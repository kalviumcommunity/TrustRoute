'use client';

import React, { useState } from 'react';
import { User, Check, Info } from 'lucide-react';

interface SeatSelectorProps {
    onSelect: (seat: string, passengerName: string) => void;
    onCancel: () => void;
    busName: string;
    price: number;
}

export default function SeatSelector({ onSelect, onCancel, busName, price }: SeatSelectorProps) {
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [passengerName, setPassengerName] = useState('');

    // Generate 40 seats (typical for a bus: 10 rows, 4 seats per row)
    const rows = 10;
    const seatsPerRow = 4;
    const seats = Array.from({ length: rows * seatsPerRow }, (_, i) => {
        const row = Math.floor(i / seatsPerRow) + 1;
        const col = String.fromCharCode(65 + (i % seatsPerRow));
        return `${row}${col}`;
    });

    // Mock occupied seats
    const occupiedSeats = ['1A', '2B', '5C', '8D', '10A'];
    // Mock "Best Seats" (e.g., front row or aisle)
    const bestSeats = ['1A', '1B', '1C', '1D', '2A', '2B'];

    const handleSeatClick = (seat: string) => {
        if (occupiedSeats.includes(seat)) return;
        setSelectedSeat(seat === selectedSeat ? null : seat);
    };

    const handleConfirm = () => {
        if (selectedSeat && passengerName.trim()) {
            onSelect(selectedSeat, passengerName);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                {/* Left: Seat Map */}
                <div className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 font-serif">Select Your Seat</h2>
                            <p className="text-gray-500 text-sm">{busName} • A/C Sleeper</p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-sm bg-white border border-gray-200" /> Available
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-sm bg-gray-200" /> Occupied
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-sm bg-brand" /> Selected
                            </div>
                        </div>
                    </div>

                    {/* Bus Layout */}
                    <div className="relative border-4 border-gray-200 rounded-3xl p-8 max-w-[300px] mx-auto bg-white shadow-inner">
                        {/* Driver Seat */}
                        <div className="absolute top-4 right-4 w-10 h-10 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-200">
                            <User size={20} />
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-12">
                            {seats.map((seat, idx) => {
                                const isOccupied = occupiedSeats.includes(seat);
                                const isSelected = selectedSeat === seat;
                                const isBest = bestSeats.includes(seat) && !isOccupied;

                                return (
                                    <React.Fragment key={seat}>
                                        {/* Aisle Spacer after 2 seats */}
                                        {idx % 4 === 2 && <div className="w-4" />}
                                        <button
                                            onClick={() => handleSeatClick(seat)}
                                            disabled={isOccupied}
                                            className={`
                                                relative w-10 h-10 rounded-lg font-bold text-xs transition-all
                                                flex items-center justify-center
                                                ${isOccupied ? 'bg-gray-100 text-gray-300 cursor-not-allowed' :
                                                    isSelected ? 'bg-brand text-black shadow-lg scale-110 z-10' :
                                                        'bg-white border-2 border-gray-100 text-gray-400 hover:border-brand hover:text-brand'}
                                            `}
                                        >
                                            {seat}
                                            {isBest && !isSelected && (
                                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                                            )}
                                        </button>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Passenger Info */}
                <div className="w-full md:w-80 bg-white p-8 border-l border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Passenger Details</h3>
                            <p className="text-gray-400 text-sm italic">Enter name for the ticket</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Seat Selected</label>
                                <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl flex items-center justify-between">
                                    <span className="text-2xl font-bold text-brand">{selectedSeat || '--'}</span>
                                    {selectedSeat && <Check className="text-brand" size={20} />}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter passenger name"
                                    value={passengerName}
                                    onChange={(e) => setPassengerName(e.target.value)}
                                    className="w-full p-4 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-gray-50/50"
                                />
                            </div>

                            <div className="p-4 bg-yellow-50 rounded-xl flex gap-3 border border-yellow-100">
                                <Info className="text-yellow-600 shrink-0" size={18} />
                                <p className="text-xs text-yellow-700 leading-relaxed font-medium">
                                    <span className="font-bold">Pro Tip:</span> Yellow dots indicate seats with better views and extra legroom!
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Refund Policy Preview</label>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-500">{'>'}24 hrs</span>
                                        <span className="font-bold text-green-600">₹{(price * 0.95).toFixed(0)} back</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-500">12-24 hrs</span>
                                        <span className="font-bold text-yellow-600">₹{(price * 0.75).toFixed(0)} back</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-500">3-12 hrs</span>
                                        <span className="font-bold text-orange-600">₹{(price * 0.50).toFixed(0)} back</span>
                                    </div>
                                </div>
                                <label className="mt-4 flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" required className="rounded border-gray-300 text-brand focus:ring-brand" />
                                    <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700">I acknowledge the refund policy rules</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 space-y-3">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="text-gray-400 font-medium">Ticket Price</span>
                            <span className="text-xl font-bold text-gray-900">₹{price}</span>
                        </div>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedSeat || !passengerName.trim()}
                            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-brand hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            Review & Pay
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                        >
                            Change Bus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
