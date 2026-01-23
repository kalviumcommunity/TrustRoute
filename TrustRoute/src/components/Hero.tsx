import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!heroRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

            tl.from('.hero-badge', { y: 20, opacity: 0, duration: 1 })
                .from('.hero-title', { y: 100, opacity: 0, duration: 1.5 }, '-=0.8')
                .from('.hero-sub', { y: 40, opacity: 0, duration: 1.2 }, '-=1')
                .from('.hero-meta', { y: 20, opacity: 0, duration: 1 }, '-=0.8');

            gsap.to(heroRef.current, {
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: 100,
                opacity: 0.2
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-12 overflow-hidden"
        >
            <div ref={contentRef} className="max-w-6xl z-10">
                <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-black text-[#A3FF00] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-12 border border-black/10 shadow-xl">
                    <span className="w-2 h-2 bg-[#A3FF00] rounded-full animate-pulse" />
                    Built for Intercity Travel
                </div>

                <h1
                    className="hero-title text-7xl md:text-[9rem] font-serif font-bold leading-[0.85] tracking-tighter mb-12 text-black"
                >
                    The transparency your <br />
                    <span className="italic text-gray-300">refund is missing.</span>
                </h1>

                <div className="hero-sub max-w-3xl mx-auto mb-16">
                    <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-6">
                        No hidden rules. No confusion. Just clear, <br className="hidden md:block" />
                        accountable refund tracking for every bus ticket.
                    </p>
                    <div className="hero-meta flex flex-wrap justify-center gap-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-12">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#A3FF00] rounded-full" /> Transparent breakdown</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#A3FF00] rounded-full" /> Live Tracking</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#A3FF00] rounded-full" /> Smart Chatbot</span>
                    </div>
                </div>
            </div >

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll to reveal</span>
                <div className="w-[1px] h-12 bg-black" />
            </div>
        </section >
    );
};

export default Hero;
