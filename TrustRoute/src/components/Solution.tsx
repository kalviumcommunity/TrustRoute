import React, { useRef } from 'react';
import { Eye, Clock, Shield } from 'lucide-react';

const Solution: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="py-40 px-6 bg-[#fcfcfc] relative">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-24 text-center">
                    <span className="text-black/40 font-black uppercase tracking-[0.4em] text-[10px]">The Pro Standard</span>
                    <h2 className="text-6xl md:text-8xl font-serif font-bold mt-6 tracking-tighter">Engineered for Trust</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Eye className="w-8 h-8" />,
                            title: "Absolute Visibility",
                            desc: "Clearly explains how refunds are calculated and why deductions happen. No hidden rules."
                        },
                        {
                            icon: <Clock className="w-8 h-8" />,
                            title: "Live Tracking",
                            desc: "Track your refund status in real-time. Know exactly when it moves from initiated to credited."
                        },
                        {
                            icon: <Shield className="w-8 h-8" />,
                            title: "Smart Assistance",
                            desc: "Our AI Chatbot answers your refund questions in simple, human language. No more support delays."
                        }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="solution-card bg-white p-14 rounded-[3rem] border border-gray-100 group hover:border-[#A3FF00] transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-[#A3FF00]/10"
                        >
                            <div className="mb-10 p-5 bg-black text-[#A3FF00] w-fit rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                {item.icon}
                            </div>
                            <h3 className="text-3xl font-bold mb-6 tracking-tight">{item.title}</h3>
                            <p className="text-gray-500 font-light leading-relaxed text-lg">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solution;
