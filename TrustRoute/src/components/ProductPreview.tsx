import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const ProductPreview: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.browser-window', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    end: 'top 20%',
                    scrub: 1,
                },
                scale: 0.8,
                y: 100,
                opacity: 0,
                rotateX: 10,
                transformPerspective: 1000,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative py-20 px-6 overflow-visible">
            <div className="max-w-6xl mx-auto">
                <div className="browser-window relative bg-[#f8f9fa] rounded-3xl border border-gray-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden">
                    {/* Browser Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="px-6 py-1 bg-gray-50 rounded-lg text-[10px] font-medium text-gray-400 w-1/2 text-center border border-gray-100">
                            trustroute.io/refund/track/RFC-88293
                        </div>
                        <div className="w-12" />
                    </div>

                    {/* Mock Dashboard Content */}
                    <div className="p-10 bg-[#fdfdfd] grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 space-y-6">
                            <div className="h-32 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between">
                                <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Refund Request</div>
                                <div className="text-2xl font-serif font-bold">#RFC-88293</div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-[#A3FF00]" />
                                </div>
                            </div>
                            <div className="h-48 bg-black rounded-2xl p-6 flex flex-col justify-between text-[#A3FF00]">
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</div>
                                <div className="text-3xl font-serif font-bold italic">Processing.</div>
                                <div className="text-xs text-white/40 leading-relaxed font-light">
                                    Cancellation verified. <br />
                                    Refund initiated to original mode.
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-8 bg-white rounded-2xl border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-12">
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Refund Timeline</div>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 bg-[#A3FF00] rounded-full text-[10px] font-bold">Live</div>
                                    <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold">Policy</div>
                                </div>
                            </div>
                            {/* Visual Route Representation */}
                            <div className="relative h-40 flex items-center justify-between px-12">
                                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0" />
                                <div className="relative z-10 w-4 h-4 rounded-full bg-black border-4 border-[#A3FF00] shadow-[0_0_20px_#A3FF00]" />
                                <div className="relative z-10 w-2 h-2 rounded-full bg-gray-200" />
                                <div className="relative z-10 w-2 h-2 rounded-full bg-gray-200" />
                                <div className="relative z-10 w-6 h-6 rounded-full bg-[#A3FF00] flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-black animate-ping" />
                                </div>
                            </div>
                            <div className="mt-8 text-center text-xs text-gray-400 font-light">
                                Refund initiated at Payment Gateway • 5 mins ago
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductPreview;
