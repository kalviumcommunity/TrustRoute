'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Search, Bus, Calendar, MapPin, Clock, CreditCard, CheckCircle2, Loader2, History, Ticket as TicketIcon, User as UserIcon } from 'lucide-react';
import SeatSelector from '@/components/SeatSelector';
import Ticket from '@/components/Ticket';

interface Booking {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    passengerName?: string;
    seatNumber?: string;
    travelDate?: string;
    operator: { name: string };
    policy: { rules: any };
}

interface BusResult {
    id: string;
    name: string;
    operatorName: string;
    operatorId: string;
    policyId: string;
    departure: string;
    arrival: string;
    price: number;
    type: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [searchResults, setSearchResults] = useState<BusResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [searchValues, setSearchValues] = useState({ from: '', to: '', date: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Flow states
    const [selectedBus, setSelectedBus] = useState<BusResult | null>(null);
    const [showSeatSelector, setShowSeatSelector] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [activeBooking, setActiveBooking] = useState<any>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            if (data.bookings) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValues.from || !searchValues.to || !searchValues.date) return;

        setSearching(true);
        try {
            const res = await fetch(`/api/buses/search?from=${searchValues.from}&to=${searchValues.to}&date=${searchValues.date}`);
            const data = await res.json();
            if (data.buses) {
                setSearchResults(data.buses);
            } else {
                setMessage({ type: 'error', text: data.error || 'Search failed' });
            }
        } catch (error) {
            console.error('Search failed', error);
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setSearching(false);
        }
    };

    const handleInitialSelect = (bus: BusResult) => {
        setSelectedBus(bus);
        setShowSeatSelector(true);
    };

    const handleSeatConfirm = (seat: string, passengerName: string) => {
        if (!selectedBus) return;
        setActiveBooking({
            ...selectedBus,
            seatNumber: seat,
            passengerName,
            travelDate: searchValues.date,
        });
        setShowSeatSelector(false);
        setShowPayment(true);
    };

    const handlePaymentConfirm = async () => {
        if (!activeBooking) return;
        setBookingLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    operatorId: activeBooking.operatorId,
                    policyId: activeBooking.policyId,
                    amount: activeBooking.price,
                    seatNumber: activeBooking.seatNumber,
                    passengerName: activeBooking.passengerName,
                    travelDate: activeBooking.travelDate,
                    route: `${searchValues.from} → ${searchValues.to}`,
                    departureTime: activeBooking.departure,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: `Successfully booked ${activeBooking.name}!` });
                fetchBookings();
                setSearchResults([]);
                setShowPayment(false);
                setShowTicket(true);
                // The API returns the new booking ID
                setActiveBooking({ ...activeBooking, id: data.booking.id, date: activeBooking.travelDate, busName: activeBooking.name, from: searchValues.from, to: searchValues.to });
            } else {
                setMessage({ type: 'error', text: data.error || 'Booking failed' });
            }
        } catch (error) {
            console.error('Booking failed', error);
            setMessage({ type: 'error', text: 'Booking failed. Please try again.' });
        } finally {
            setBookingLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <main className="relative min-h-screen font-inter overflow-x-hidden bg-gray-50/30">
            {/* Decorative Background */}
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand rounded-full blur-[160px] opacity-10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-200 rounded-full blur-[160px] opacity-20" />
            </div>

            {/* Sidebar */}
            <aside className="hidden md:flex w-64 bg-white/80 border-r border-gray-200 flex-col p-6 shadow-sm min-h-screen fixed top-0 left-0 z-20 backdrop-blur-xl">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-brand italic font-serif tracking-tight">TrustRoute</h2>
                </div>
                <nav className="flex flex-col gap-2">
                    <Link href="/dashboard" className="flex items-center gap-3 bg-brand/10 text-brand font-semibold rounded-xl px-4 py-3 transition-all">
                        <Bus size={20} /> Dashboard
                    </Link>
                    <Link href="/dashboard/bookings" className="flex items-center gap-3 text-gray-500 hover:bg-gray-100 font-medium rounded-xl px-4 py-3 transition-all">
                        <History size={20} /> My Bookings
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-3 text-gray-500 hover:bg-gray-100 font-medium rounded-xl px-4 py-3 transition-all">
                        <MapPin size={20} /> Profile
                    </Link>
                </nav>
                <div className="mt-auto pt-10">
                    <Link href="/" className="text-gray-400 hover:text-brand text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                        ← Return Home
                    </Link>
                </div>
            </aside>

            {/* Modals for Flow */}
            {showSeatSelector && selectedBus && (
                <SeatSelector
                    busName={selectedBus.name}
                    price={selectedBus.price}
                    onSelect={handleSeatConfirm}
                    onCancel={() => setShowSeatSelector(false)}
                />
            )}

            {showPayment && activeBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-brand" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Secure Payment</h2>

                        <div className="space-y-6 mb-8">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Order Summary</p>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-gray-900">{activeBooking.name}</span>
                                    <span className="font-bold text-gray-900">₹{activeBooking.price}</span>
                                </div>
                                <p className="text-sm text-gray-500">Seat {activeBooking.seatNumber} • {activeBooking.passengerName}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Card Holder Name</label>
                                    <input type="text" value={activeBooking.passengerName} readOnly className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 font-medium" />
                                </div>
                                <div className="p-4 border-2 border-brand rounded-2xl bg-brand/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-brand rounded-lg text-black">
                                            <CreditCard size={18} />
                                        </div>
                                        <span className="font-bold text-gray-900">PAY ON ARRIVAL</span>
                                    </div>
                                    <CheckCircle2 className="text-brand" size={20} />
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed px-1">
                                    By clicking Pay Now, you agree to our terms of service. Since this is a demo, we'll process this as a mock transaction.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowPayment(false)}
                                className="flex-1 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePaymentConfirm}
                                disabled={bookingLoading}
                                className="flex-[2] bg-black text-white py-4 rounded-2xl font-bold hover:bg-brand hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                {bookingLoading ? <Loader2 className="animate-spin" size={20} /> : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showTicket && activeBooking && (
                <Ticket
                    booking={activeBooking}
                    onClose={() => {
                        setShowTicket(false);
                        setActiveBooking(null);
                        setSelectedBus(null);
                    }}
                />
            )}

            {/* Main Content */}
            <div className="flex flex-col md:ml-64 min-h-screen">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 pt-12 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight tracking-tight mb-2 text-gray-900 hero-title">
                            Hello, <span className="italic text-brand">{user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Explorer'}</span>
                        </h1>
                        <p className="text-gray-500 text-lg hero-sub">Where are we heading today?</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="font-bold text-sm text-gray-900">{user?.name || user?.email}</p>
                            <p className="text-xs text-gray-400">Regular Member</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand font-bold text-xl border-2 border-brand/20 shadow-sm">
                            {user?.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                    </div>
                </header>

                {message && (
                    <div className={`mx-8 mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <Search size={20} />}
                        <p className="font-medium text-sm">{message.text}</p>
                    </div>
                )}

                {/* Search & Booking Section */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mx-8 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-brand/10 rounded-lg text-brand">
                            <Search size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Quick Book</h2>
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="From City"
                                required
                                value={searchValues.from}
                                onChange={(e) => setSearchValues({ ...searchValues, from: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="To City"
                                required
                                value={searchValues.to}
                                onChange={(e) => setSearchValues({ ...searchValues, to: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white"
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="date"
                                required
                                value={searchValues.date}
                                onChange={(e) => setSearchValues({ ...searchValues, date: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={searching}
                            className="bg-brand text-black font-bold rounded-xl px-6 py-3 hover:shadow-lg hover:bg-black hover:text-brand transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {searching ? <Loader2 className="animate-spin" size={20} /> : 'Search Buses'}
                        </button>
                    </form>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Available Rides</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {searchResults.map((bus) => (
                                    <div key={bus.id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">{bus.name}</h4>
                                                <p className="text-sm text-gray-500">{bus.type} • {bus.operatorName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-brand">₹{bus.price}</p>
                                                <p className="text-xs text-gray-400">per traveler</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-6 p-3 bg-white rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-brand" />
                                                <span className="font-bold text-sm tracking-tight">{bus.departure}</span>
                                            </div>
                                            <div className="h-px bg-gray-100 flex-1 mx-4 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                                    <Bus size={14} className="text-gray-300" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm tracking-tight">{bus.arrival}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleInitialSelect(bus)}
                                            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-brand hover:text-black transition-all flex items-center justify-center gap-2"
                                        >
                                            <TicketIcon size={18} /> Select Seat
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Booking History Section */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mx-8 mb-24 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-brand/10 rounded-lg text-brand">
                                <History size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 font-serif">Trip History</h2>
                        </div>
                        <button onClick={fetchBookings} className="text-xs font-bold text-brand hover:underline">Refresh history</button>
                    </div>

                    {bookings.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="p-6 rounded-3xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-xl hover:border-brand/20 transition-all group flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-black transition-all">
                                                <Bus size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg">Express Journey</p>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{booking.operator.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                                                {booking.status}
                                            </span>
                                            <p className="text-lg font-bold text-gray-900 mt-1 italic">₹{booking.amount}</p>
                                        </div>
                                    </div>

                                    {booking.passengerName && (
                                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/50 rounded-2xl border border-gray-50 group-hover:border-gray-100 transition-all">
                                            <div className="flex items-center gap-2">
                                                <UserIcon size={14} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600 truncate">{booking.passengerName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className="text-xs font-bold text-gray-400 uppercase">Seat</span>
                                                <span className="text-sm font-bold text-brand">{booking.seatNumber}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-500">
                                                {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : new Date(booking.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button className="text-xs font-bold bg-black text-white px-5 py-2.5 rounded-xl hover:bg-brand hover:text-black transition-all shadow-md">
                                            View Ticket
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
                                <Bus size={40} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-400 mb-2">No trips found</h3>
                            <p className="text-gray-400 text-sm max-w-xs">Your booked buses will appear here once you make your first journey.</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Floating Navbar (like landing) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <Navbar />
            </div>
        </main>
    );
}
