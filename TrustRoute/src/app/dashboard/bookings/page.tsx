'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookingCard from '@/components/BookingCard';
import CancellationModal from '@/components/CancellationModal';
import RefundTimeline from '@/components/RefundTimeline';
import { Bus, History, MapPin, Ticket, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Booking {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    cancelledAt?: string;
    passengerName?: string;
    seatNumber?: string;
    travelDate?: string;
    route?: string;
    departureTime?: string;
    operator: { name: string };
    refundTransaction?: {
        refundAmount: number;
        deductionTotal: number;
        status: string;
        timeline: any[];
    } | null;
}

interface RefundCalculation {
    refundAmount: number;
    deductionTotal: number;
    refundPercentage: number;
    slot: string;
    breakdown: {
        originalAmount: number;
        convenienceFee: number;
        cancellationFee: number;
        refundAmount: number;
    };
}

export default function DashboardBookingsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showTimelineModal, setShowTimelineModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [refundCalculation, setRefundCalculation] = useState<RefundCalculation | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchBookings();
    }, [user, router]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/bookings');
            const data = await res.json();
            if (data.bookings) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
            setMessage({ type: 'error', text: 'Failed to fetch bookings' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = async (bookingId: string) => {
        const booking = bookings.find((b) => b.id === bookingId);
        if (!booking) return;

        setCancellingBookingId(bookingId);
        setSelectedBooking(booking);
        setShowCancelModal(true);

        try {
            const res = await fetch(`/api/bookings/cancel?bookingId=${bookingId}`);
            const data = await res.json();
            if (data.refund) {
                setRefundCalculation(data.refund);
            }
        } catch (error) {
            console.error('Failed to calculate refund', error);
            setMessage({ type: 'error', text: 'Failed to calculate refund' });
        }
    };

    const handleConfirmCancel = async () => {
        if (!cancellingBookingId) return;

        try {
            setCancelling(true);
            const res = await fetch('/api/bookings/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: cancellingBookingId }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Booking cancelled successfully! Refund initiated.' });
                setShowCancelModal(false);
                setCancellingBookingId(null);
                setRefundCalculation(null);
                await fetchBookings();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to cancel booking' });
            }
        } catch (error) {
            console.error('Cancel booking error:', error);
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setCancelling(false);
        }
    };

    const handleCloseModal = () => {
        setShowCancelModal(false);
        setCancellingBookingId(null);
        setRefundCalculation(null);
        setSelectedBooking(null);
    };

    const handleViewTimeline = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowTimelineModal(true);
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === 'all') return true;
        if (filter === 'confirmed') return booking.status === 'CONFIRMED';
        if (filter === 'cancelled') return booking.status === 'CANCELLED';
        return true;
    });

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
        cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
    };

    return (
        <main className="relative min-h-screen font-inter overflow-x-hidden bg-gray-50/30">
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand rounded-full blur-[160px] opacity-10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-200 rounded-full blur-[160px] opacity-20" />
            </div>

            <aside className="hidden md:flex w-64 bg-white/80 border-r border-gray-200 flex-col p-6 shadow-sm min-h-screen fixed top-0 left-0 z-20 backdrop-blur-xl">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-brand italic font-serif tracking-tight">TrustRoute</h2>
                </div>
                <nav className="flex flex-col gap-2">
                    <Link href="/dashboard" className="flex items-center gap-3 text-gray-500 hover:bg-gray-100 font-medium rounded-xl px-4 py-3 transition-all">
                        <Bus size={20} /> Dashboard
                    </Link>
                    <Link href="/dashboard/bookings" className="flex items-center gap-3 bg-brand/10 text-brand font-semibold rounded-xl px-4 py-3 transition-all">
                        <History size={20} /> My Bookings
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-3 text-gray-500 hover:bg-gray-100 font-medium rounded-xl px-4 py-3 transition-all">
                        <MapPin size={20} /> Profile
                    </Link>
                </nav>
                <div className="mt-auto pt-10">
                    <button
                        onClick={() => logout()}
                        className="text-gray-400 hover:text-brand text-xs uppercase font-bold tracking-widest flex items-center gap-2"
                    >
                        ← Logout
                    </button>
                </div>
            </aside>

            <div className="flex flex-col md:ml-64 min-h-screen">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 pt-12 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight tracking-tight mb-2 text-gray-900 hero-title">
                            My <span className="italic text-brand">Bookings</span>
                        </h1>
                        <p className="text-gray-500 text-lg hero-sub">Track, cancel, and follow your refunds in real time.</p>
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
                    <div
                        className={`mx-8 mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
                            message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <p className="font-medium text-sm">{message.text}</p>
                    </div>
                )}

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-8 mb-8">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total Bookings</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Confirmed</p>
                        <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Cancelled</p>
                        <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
                    </div>
                </section>

                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mx-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-brand/10 rounded-lg text-brand">
                                <Ticket size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 font-serif">Your Tickets</h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                    filter === 'all'
                                        ? 'bg-brand text-black'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('confirmed')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                    filter === 'confirmed'
                                        ? 'bg-brand text-black'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Confirmed
                            </button>
                            <button
                                onClick={() => setFilter('cancelled')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                    filter === 'cancelled'
                                        ? 'bg-brand text-black'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Cancelled
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-brand" />
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                            <p className="text-gray-600 mb-6">
                                {filter === 'all'
                                    ? "You haven't made any bookings yet."
                                    : `No ${filter} bookings found.`}
                            </p>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-2xl font-bold hover:bg-brand hover:text-black transition-all"
                            >
                                Book Your First Ticket
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredBookings.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onCancelClick={handleCancelClick}
                                    onViewTimeline={handleViewTimeline}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {showCancelModal && selectedBooking && (
                <CancellationModal
                    isOpen={showCancelModal}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmCancel}
                    booking={selectedBooking}
                    refundCalculation={refundCalculation}
                    loading={cancelling}
                />
            )}

            {showTimelineModal && selectedBooking?.refundTransaction && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Refund Status Tracker</h2>
                                <p className="text-sm text-gray-500 mt-1">Ticket ID: {selectedBooking.id}</p>
                            </div>
                            <button
                                onClick={() => setShowTimelineModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6">
                            <RefundTimeline timeline={selectedBooking.refundTransaction.timeline} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
