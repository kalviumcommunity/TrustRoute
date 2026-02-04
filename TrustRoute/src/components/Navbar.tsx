import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const Navbar: React.FC = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();

    useLayoutEffect(() => {
        if (!navRef.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                start: '100px top',
                onEnter: () => {
                    gsap.to(navRef.current, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: 'expo.out'
                    });
                },
                onLeaveBack: () => {
                    gsap.to(navRef.current, {
                        y: 100,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power3.in'
                    });
                }
            });
        }, navRef); // Using the ref object as scope is actually supported and safer with GSAP context

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={navRef}
            className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto opacity-0 translate-y-[100px] w-[calc(100%-2rem)] md:w-auto"
        >
            <nav className="bg-black/95 backdrop-blur-md text-[#A3FF00] shadow-2xl rounded-full px-2 py-2 flex items-center justify-between md:justify-start gap-2 md:gap-6 min-w-0 md:min-w-[340px] border border-white/10 mx-auto max-w-lg md:max-w-none">
                <Link href="/" className="flex items-center gap-2 pl-3 md:pl-4 pr-1 md:pr-2 shrink-0">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-[#A3FF00] rounded rotate-12 flex items-center justify-center border-2 border-black">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full" />
                    </div>
                    <span className="font-black tracking-tighter text-[10px] md:text-sm uppercase italic hidden sm:block">TrustRoute</span>
                    <span className="font-black tracking-tighter text-[10px] uppercase italic sm:hidden">TR</span>
                </Link>

                <div className="flex items-center gap-0.5 md:gap-1 ml-auto overflow-x-auto no-scrollbar py-1">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-4 py-2 md:py-3 text-white/60 hover:text-[#A3FF00] transition-colors whitespace-nowrap">
                                Dash
                            </Link>
                            <Link href="/dashboard/bookings" className="text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-4 py-2 md:py-3 text-white/60 hover:text-[#A3FF00] transition-colors whitespace-nowrap">
                                Trips
                            </Link>
                            <Link href="/dashboard/profile" className="text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-4 py-2 md:py-3 text-white/60 hover:text-[#A3FF00] transition-colors whitespace-nowrap">
                                Profile
                            </Link>
                            <button
                                onClick={() => logout()}
                                className="text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 md:px-6 py-2 md:py-3 bg-red-600/10 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all border border-red-500/20 ml-1 whitespace-nowrap"
                            >
                                Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 md:px-4 py-2 md:py-3 text-white/60 hover:text-[#A3FF00] transition-colors whitespace-nowrap"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="text-[8px] md:text-[10px] font-black uppercase tracking-widest px-4 md:px-6 py-2 md:py-3 bg-[#A3FF00] text-black rounded-full hover:bg-white transition-all shadow-xl shadow-[#A3FF00]/10 ml-1 whitespace-nowrap"
                            >
                                Join
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
