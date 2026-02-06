'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function Chatbot() {
    const { user } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm **TrustRoute AI**, your personal travel assistant. How can I help you today? I can explain our refund policy, check your booking status, or answer in Tamil if you'd like!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        if (confirm('Clear chat history?')) {
            setMessages([
                { role: 'assistant', content: "Chat cleared. How else can I help you?" }
            ]);
        }
    };

    const isDashboard = pathname.startsWith('/dashboard');
    if (!user || !isDashboard) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            {/* Chat Bubble */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-black text-brand rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 group ring-4 ring-brand/20"
                >
                    <MessageCircle size={32} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md">
                        AI
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`bg-white rounded-[2rem] shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isMaximized
                        ? 'fixed inset-4 md:inset-10 w-auto h-auto'
                        : 'w-[90vw] md:w-[400px] h-[600px] max-h-[80vh]'
                        }`}
                >
                    {/* Header */}
                    <div className="bg-black p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-black font-bold border-2 border-brand/20">
                                T
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">TrustRoute AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-brand text-[10px] uppercase font-bold tracking-widest">Active Support</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={clearChat} className="text-gray-400 hover:text-red-400 p-2 transition-colors" title="Clear Chat">
                                <Trash2 size={16} />
                            </button>
                            <button onClick={() => setIsMaximized(!isMaximized)} className="text-gray-400 hover:text-brand p-2 transition-colors hidden md:block">
                                {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-black text-brand' : 'bg-brand text-black'
                                        }`}>
                                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                        ? 'bg-black text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}>
                                        <div className="whitespace-pre-wrap break-words prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-serif prose-headings:mb-2 prose-headings:mt-4 prose-p:mb-2 prose-li:mb-1">
                                            {m.role === 'assistant' ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h1: ({ node, ...props }) => <h1 className="text-lg font-bold border-b pb-1 mb-2 mt-4" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-md font-bold mt-3 mb-1" {...props} />,
                                                        h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-2 mb-1 uppercase tracking-wider text-gray-500" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
                                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                        code: ({ node, ...props }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-brand" {...props} />,
                                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-brand/30 pl-3 italic my-2 text-gray-600" {...props} />,
                                                        table: ({ node, ...props }) => <div className="overflow-x-auto my-3"><table className="w-full text-xs border-collapse border border-gray-200" {...props} /></div>,
                                                        th: ({ node, ...props }) => <th className="border border-gray-200 bg-gray-50 p-2 font-bold" {...props} />,
                                                        td: ({ node, ...props }) => <td className="border border-gray-200 p-2" {...props} />,
                                                    }}
                                                >
                                                    {m.content}
                                                </ReactMarkdown>
                                            ) : m.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-black shadow-sm">
                                        <Bot size={14} />
                                    </div>
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-brand" />
                                        <span className="text-xs text-gray-400 font-medium italic">TrustRoute AI is thinking...</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-medium mt-2 px-1">I&apos;m an AI and can make mistakes. Please check the final refund breakdown in your dashboard.</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="px-5 py-2 flex gap-2 overflow-x-auto bg-gray-50/50 border-t border-gray-100 no-scrollbar">
                        {[
                            "Refund policy?",
                            "My next bus?",
                            "Explain in Tamil",
                            "Refund status?"
                        ].map((q, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setInput(q);
                                }}
                                className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 hover:border-brand hover:text-black transition-all shadow-sm"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-5 bg-white border-t border-gray-100 flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask TrustRoute AI anything..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="w-12 h-12 bg-black text-brand rounded-xl flex items-center justify-center hover:bg-brand hover:text-black transition-all shadow-lg disabled:opacity-50 disabled:grayscale"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
