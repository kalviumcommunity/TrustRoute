import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Confidence: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.reveal-text', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 90%',
                },
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'expo.out'
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 md:py-40 px-6 bg-white overflow-hidden">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="reveal-text text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-black italic leading-[1.2] md:leading-[1.1] mb-12 md:mb-16 tracking-tighter">
                    "Transparency is the new trust. <br className="hidden md:block" /> We ensure your refund is never a mystery."
                </h2>

                <div className="reveal-text flex flex-wrap justify-center gap-8 md:gap-16 mt-8 md:mt-12">
                    <div className="flex flex-col items-center">
                        <span className="text-lg md:text-xl font-bold mb-1">100%</span>
                        <span className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">Policy Compliance</span>
                    </div>
                    <div className="w-[1px] h-12 bg-gray-100 hidden md:block" />
                    <div className="flex flex-col items-center">
                        <span className="text-lg md:text-xl font-bold mb-1">Instant</span>
                        <span className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">Deduction Logs</span>
                    </div>
                    <div className="w-[1px] h-12 bg-gray-100 hidden md:block" />
                    <div className="flex flex-col items-center">
                        <span className="text-lg md:text-xl font-bold mb-1">24/7/365</span>
                        <span className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">Refund Support</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Confidence;
