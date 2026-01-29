'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <main className="relative min-h-screen font-inter overflow-x-hidden">
            {/* Decorative Background */}
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand rounded-full blur-[160px] opacity-10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-200 rounded-full blur-[160px] opacity-20" />
            </div>

            {/* Sidebar */}
            <aside className="hidden md:flex w-64 bg-white/80 border-r border-gray-200 flex-col p-6 shadow-lg min-h-screen fixed top-0 left-0 z-20 backdrop-blur-xl">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-brand italic font-serif tracking-tight">TrustRoute</h2>
                </div>
                <nav className="flex flex-col gap-4">
                    <Link href="/dashboard" className="text-brand font-semibold hover:bg-brand/10 rounded px-3 py-2 transition-colors">Dashboard</Link>
                    <Link href="/dashboard/bookings" className="text-gray-700 font-medium hover:bg-brand/10 rounded px-3 py-2 transition-colors">My Bookings</Link>
                    <Link href="/dashboard/profile" className="text-gray-700 font-medium hover:bg-brand/10 rounded px-3 py-2 transition-colors">Profile</Link>
                </nav>
                <div className="mt-auto pt-10">
                    <Link href="/" className="text-gray-400 hover:text-brand text-xs uppercase font-bold tracking-widest">Return to Home</Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col md:ml-64 min-h-screen">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 pt-10 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight tracking-tighter mb-2 text-black hero-title">Welcome, <span className="italic text-gray-300">{user?.name || user?.email || 'Explorer'}</span></h1>
                        <p className="text-gray-600 text-lg hero-sub">Plan, book, and manage your bus journeys with confidence.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-block w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-2xl border-2 border-brand">
                            {user?.name ? user.name[0].toUpperCase() : 'U'}
                        </span>
                    </div>
                </header>

                {/* Search & Booking Section */}
                <section className="bg-white/80 rounded-2xl shadow-xl p-8 mx-6 mb-8 backdrop-blur-xl">
                    <h2 className="text-2xl font-bold text-brand mb-4 font-serif">Book Your Bus</h2>
                    <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="text" placeholder="From" className="border rounded px-4 py-2 focus:outline-brand bg-white/80" />
                        <input type="text" placeholder="To" className="border rounded px-4 py-2 focus:outline-brand bg-white/80" />
                        <input type="date" className="border rounded px-4 py-2 focus:outline-brand bg-white/80" />
                        <button type="submit" className="bg-brand text-black font-bold rounded px-4 py-2 hover:bg-black hover:text-brand transition-colors">Search Buses</button>
                    </form>
                </section>

                {/* Booking History Section */}
                <section className="bg-white/80 rounded-2xl shadow-xl p-8 mx-6 mb-24 backdrop-blur-xl">
                    <h2 className="text-2xl font-bold text-brand mb-4 font-serif">My Bookings</h2>
                    <div className="text-gray-400 italic">No bookings yet. Your booked buses will appear here.</div>
                </section>
            </div>

            {/* Floating Navbar (like landing) */}
            <Navbar />
        </main>
    );
}
