import React, { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const CTA: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 60%',
                }
            });

            tl.from('.cta-headline', { y: 50, opacity: 0, duration: 1, ease: 'expo.out' })
                .from('.brand-reveal', { y: 100, opacity: 0, duration: 1.5, ease: 'expo.out' }, '-=0.5')
                .from('.footer-meta > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, '-=1')
                .from('.bottom-nav-link', { opacity: 0, x: -10, duration: 0.5, stagger: 0.05 }, '-=0.5');
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="bg-black text-white pt-32 pb-12 px-6 md:px-12 relative overflow-hidden"
        >
            {/* Immersive Background Gradients */}
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-[#A3FF00]/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[100%] h-[30%] bg-gradient-to-t from-[#A3FF00]/5 to-transparent pointer-events-none" />

            <div className="max-w-[1440px] mx-auto relative z-10">
                {/* Top Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
                    <h2 className="cta-headline text-5xl md:text-6xl font-medium tracking-tight">
                        Get started today
                    </h2>

                    <div className="cta-headline flex items-center gap-1">
                        <a
                            href="#demo"
                            className="flex items-center gap-4 bg-[#A3FF00] hover:bg-white text-black px-8 py-4 rounded-sm font-bold text-xs uppercase tracking-[0.2em] transition-all group"
                        >
                            Book a Demo
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* Massive Brand Reveal - The "Wow" Factor */}
                <div className="brand-reveal mb-24">
                    <h3 className="text-[12vw] md:text-[14vw] font-black leading-[0.8] tracking-tighter text-white uppercase italic select-none">
                        Trust<span className="text-transparent stroke-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>route</span>
                    </h3>
                </div>

                {/* Information Grid */}
                <div className="footer-meta grid grid-cols-1 md:grid-cols-12 gap-12 pb-24 border-b border-white/10">
                    <div className="md:col-span-3">
                        <p className="text-gray-400 text-sm leading-relaxed max-w-[240px]">
                            The transparency layer your bus travel experience is missing. Verified, secure, and ready to refund.
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A3FF00] mb-6">Support</h4>
                        <div className="space-y-4 text-sm text-gray-300">
                            <p>Available 24/7 for refund assistance.</p>
                            <a href="mailto:support@trustroute.io" className="block hover:text-white transition-colors">support@trustroute.io</a>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-center md:justify-start">
                        {/* Security Badge - inspired by SOC badge in reference */}
                        <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center text-[8px] text-center font-bold px-4 leading-tight text-white/40">
                            TRUSTROUTE CERTIFIED REFUNDS
                        </div>
                    </div>

                    <div className="md:col-span-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6">Stay up to date</h4>
                        <form className="flex w-full group">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                className="bg-transparent border-b border-white/20 py-3 text-xs w-full focus:outline-none focus:border-[#A3FF00] transition-colors"
                            />
                            <button className="border-b border-white/20 px-6 py-3 text-[10px] font-black bg-white text-black hover:bg-[#A3FF00] transition-colors">
                                SUBMIT
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Horizontal Navigation */}
                <div className="pt-8 flex flex-wrap justify-between items-center gap-6">
                    <div className="flex flex-wrap gap-8">
                        {['BUILD', 'ROUTE', 'TRACK', 'RESOURCES', 'ABOUT', 'SECURITY', 'PRIVACY', 'TERMS'].map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                className="bottom-nav-link text-[9px] font-black tracking-widest text-white/40 hover:text-[#A3FF00] transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.1em]">
                        <span>© TrustRoute Technologies. All Rights Reserved 2026</span>
                        <span className="hidden md:block">|</span>
                        <span className="hover:text-[#A3FF00] cursor-pointer transition-colors">Site by TR-Studio</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
