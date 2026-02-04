import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Problem: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.stat-box', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 90%',
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: 'expo.out'
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 md:py-40 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                <div className="space-y-6 md:space-y-10">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tighter">
                        Refunds shouldn't be a <br className="hidden md:block" />
                        <span className="italic text-gray-400">guessing game.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed">
                        Unclear deductions and endless waiting. Passengers lose trust when they don't know why or when their money will be returned.
                    </p>
                    <div className="pt-4 md:pt-8 flex gap-8 md:gap-12">
                        <div>
                            <div className="text-2xl md:text-3xl font-bold mb-1">82%</div>
                            <div className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400">Demand Clarity</div>
                        </div>
                        <div>
                            <div className="text-2xl md:text-3xl font-bold mb-1">100%</div>
                            <div className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400">Transparency Goal</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                    <div className="stat-box bg-gray-50 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100">
                        <span className="text-5xl md:text-6xl font-bold mb-2">65%</span>
                        <p className="text-[10px] md:text-xs uppercase font-black tracking-widest text-gray-400 mt-3 md:mt-4 leading-tight">Customer <br />Frustration Rate</p>
                    </div>
                    <div className="stat-box bg-black p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] text-[#A3FF00] sm:mt-12 shadow-2xl shadow-black/20">
                        <span className="text-5xl md:text-6xl font-bold mb-2">12d</span>
                        <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-60 mt-3 md:mt-4 leading-tight">Average Refund <br />Wait Time</p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#A3FF00] rounded-full blur-[80px] -z-10 opacity-20" />
                </div>
            </div>
        </section>
    );
};

export default Problem;
