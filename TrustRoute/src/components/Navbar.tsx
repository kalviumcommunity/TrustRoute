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
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto opacity-0 translate-y-[100px]"
        >
            <nav className="bg-black text-[#A3FF00] shadow-2xl rounded-full px-2 py-2 flex items-center gap-6 min-w-[340px] border border-white/10">
                <Link href="/" className="flex items-center gap-2 pl-4 pr-2">
                    {/* Updated Logo Icon to match the Lime/Black aesthetic */}
                    <div className="w-6 h-6 bg-[#A3FF00] rounded-lg rotate-12 flex items-center justify-center border-2 border-black">
                        <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                    <span className="font-black tracking-tighter text-sm uppercase italic">TrustRoute</span>
                </Link>

                <div className="flex items-center gap-1 ml-auto">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard/bookings"
                                className="text-[10px] font-black uppercase tracking-widest px-4 py-3 text-white/60 hover:text-[#A3FF00] transition-colors"
                            >
                                My Bookings
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-[10px] font-black uppercase tracking-widest px-4 py-3 text-white/60 hover:text-[#A3FF00] transition-colors"
                            >
                                Dashboard
                            </Link>
                            <span className="text-[10px] font-black uppercase tracking-widest px-4 py-3 text-white/40">
                                {user.name || user.email.split('@')[0]}
                            </span>
                            <button
                                onClick={() => logout()}
                                className="text-[10px] font-black uppercase tracking-widest px-6 py-3 bg-red-600/10 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all border border-red-500/20"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-[10px] font-black uppercase tracking-widest px-4 py-3 text-white/60 hover:text-[#A3FF00] transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="text-[10px] font-black uppercase tracking-widest px-6 py-3 bg-[#A3FF00] text-black rounded-full hover:bg-white transition-all shadow-xl shadow-[#A3FF00]/10"
                            >
                                Start Now
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
