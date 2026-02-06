'use client';

import React from 'react';
import { Bus, Calendar, User, Download, CheckCircle2, QrCode, ArrowRight } from 'lucide-react';

interface TicketProps {
    booking: {
        id: string;
        passengerName: string;
        seatNumber: string;
        busName: string;
        from: string;
        to: string;
        date: string;
        departure: string;
        amount: number;
    };
    onClose: () => void;
}

export default function Ticket({ booking, onClose }: TicketProps) {
    const handleDownload = () => {
        const ticketContent = `
=== TRUSTROUTE DIGITAL TICKET ===
Booking ID: ${booking.id}
Passenger: ${booking.passengerName}
Seat Number: ${booking.seatNumber}
Bus: ${booking.busName}
From: ${booking.from}
To: ${booking.to}
Date: ${new Date(booking.date).toLocaleDateString()}
Departure: ${booking.departure}
Amount Paid: ₹${booking.amount}
Status: CONFIRMED
=================================
Thank you for choosing TrustRoute!
Transparency First.
        `;

        const blob = new Blob([ticketContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `TrustRoute_Ticket_${booking.id.slice(0, 8)}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                {/* Header / Success Banner */}
                <div className="bg-green-500 p-6 md:p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 md:mb-4 backdrop-blur-md border border-white/30">
                            <CheckCircle2 size={24} className="md:w-8 md:h-8" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold font-serif italic">Payment Successful!</h2>
                        <p className="text-white/80 text-xs md:text-sm mt-1">Pack your bags, you&apos;re ready to go.</p>
                    </div>
                </div>

                {/* Ticket Body */}
                <div className="p-6 md:p-8 relative">
                    {/* Perforated edge effect */}
                    <div className="absolute -left-3 top-[-12px] w-6 h-6 bg-white rounded-full" />
                    <div className="absolute -right-3 top-[-12px] w-6 h-6 bg-white rounded-full" />
                    <div className="absolute left-4 right-4 top-0 border-t-2 border-dashed border-gray-100" />

                    <div className="space-y-6 md:space-y-8 text-sm md:text-base">
                        {/* Journey Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bus Service</p>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                                    <Bus size={16} className="text-brand md:w-[18px] md:h-[18px]" /> {booking.busName}
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                                <p className="font-mono font-bold text-brand uppercase text-sm md:text-base">{booking.id.slice(0, 8)}</p>
                            </div>
                        </div>

                        {/* Route */}
                        <div className="flex items-center gap-2 md:gap-4 bg-gray-50/80 p-4 md:p-5 rounded-2xl border border-gray-100">
                            <div className="flex-1">
                                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase mb-0.5 md:mb-1">From</p>
                                <p className="font-bold text-base md:text-lg text-gray-900">{booking.from}</p>
                            </div>
                            <div className="flex flex-col items-center px-1 md:px-2">
                                <ArrowRight size={16} className="text-brand md:w-5 md:h-5" />
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase mb-0.5 md:mb-1">To</p>
                                <p className="font-bold text-base md:text-lg text-gray-900">{booking.to}</p>
                            </div>
                        </div>

                        {/* Passenger & Seat Info */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="flex items-start gap-2 md:gap-3">
                                <div className="p-1.5 md:p-2 bg-gray-100 rounded-lg text-gray-400">
                                    <User size={16} className="md:w-[18px] md:h-[18px]" />
                                </div>
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase mb-0.5">Passenger</p>
                                    <p className="font-bold text-gray-900 truncate max-w-[80px] md:max-w-[120px] text-xs md:text-sm">{booking.passengerName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 md:gap-3 justify-end text-right">
                                <div className="text-right">
                                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase mb-0.5">Seat No.</p>
                                    <p className="font-bold text-brand text-lg md:text-xl leading-none">{booking.seatNumber}</p>
                                </div>
                                <div className="p-1.5 md:p-2 bg-brand/10 rounded-lg text-brand">
                                    <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" />
                                </div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="flex items-start gap-2 md:gap-3">
                                <div className="p-1.5 md:p-2 bg-gray-100 rounded-lg text-gray-400">
                                    <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                                </div>
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase mb-0.5">Date</p>
                                    <p className="font-bold text-gray-900 text-xs md:text-sm">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 md:gap-3 justify-end text-right">
                                <div className="text-right">
                                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase mb-0.5">Departure</p>
                                    <p className="font-bold text-gray-900 text-xs md:text-sm">{booking.departure}</p>
                                </div>
                                <div className="p-1.5 md:p-2 bg-gray-100 rounded-lg text-gray-400">
                                    <QrCode size={16} className="md:w-[18px] md:h-[18px]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code / Footer */}
                    <div className="mt-8 md:mt-10 flex flex-col items-center">
                        <div className="p-3 md:p-4 bg-white border-2 border-gray-100 rounded-2xl md:rounded-3xl shadow-sm mb-6">
                            <QrCode size={64} className="text-gray-900 md:w-20 md:h-20" />
                        </div>
                        <div className="w-full space-y-3">
                            <button
                                onClick={handleDownload}
                                className="w-full bg-black text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-brand hover:text-black transition-all flex items-center justify-center gap-2 border-2 border-transparent hover:border-black shadow-lg text-sm md:text-base"
                            >
                                <Download size={18} className="md:w-5 md:h-5" /> Download Ticket
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-2 md:py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
                            >
                                Close & View History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
