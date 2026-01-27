'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 selection:bg-[#A3FF00] selection:text-black font-inter">
            <div className="w-full max-w-4xl border border-white/10 rounded-[2rem] p-12 bg-white/5 backdrop-blur-3xl relative overflow-hidden">
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                {/* Simple White Bar requested by user */}
                <div className="h-1 w-32 bg-white rounded-full mb-12" />

                <div className="relative z-10">
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic mb-4">
                        Dashboard
                    </h1>
                    <p className="text-[#A3FF00] font-black uppercase tracking-[0.3em] text-sm mb-12">
                        Welcome back, {user?.name || user?.email || 'Explorer'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                            <h3 className="text-white font-black uppercase italic text-xl mb-2 group-hover:text-[#A3FF00] transition-colors">Book a Bus</h3>
                            <p className="text-white/40 text-sm font-medium">Coordinate your route with immutable trust metrics.</p>
                        </div>
                        <div className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                            <h3 className="text-white font-black uppercase italic text-xl mb-2 group-hover:text-[#A3FF00] transition-colors">Manage Assets</h3>
                            <p className="text-white/40 text-sm font-medium">View and verify your returned assets in real-time.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Link href="/" className="mt-8 text-white/20 hover:text-[#A3FF00] transition-colors font-black uppercase tracking-widest text-xs">
                Return to Home
            </Link>
        </div>
    );
}
