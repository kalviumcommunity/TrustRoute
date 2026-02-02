import React, { useState } from 'react';
import { X, AlertTriangle, IndianRupee, Clock } from 'lucide-react';

interface RefundBreakdown {
    originalAmount: number;
    convenienceFee: number;
    cancellationFee: number;
    refundAmount: number;
}

interface RefundCalculation {
    refundAmount: number;
    deductionTotal: number;
    refundPercentage: number;
    slot: string;
    breakdown: RefundBreakdown;
}

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    booking: {
        id: string;
        amount: number;
        passengerName?: string;
        seatNumber?: string;
        travelDate?: string;
        operator: { name: string };
    };
    refundCalculation: RefundCalculation | null;
    loading: boolean;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    booking,
    refundCalculation,
    loading,
}) => {
    const [confirmed, setConfirmed] = useState(false);

    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleConfirm = () => {
        if (!confirmed) return;
        onConfirm();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Cancel Booking</h2>
                        <p className="text-sm text-gray-500 mt-1">Ticket ID: {booking.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Booking Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bus Operator:</span>
                                <span className="font-medium">{booking.operator.name}</span>
                            </div>
                            {booking.passengerName && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Passenger:</span>
                                    <span className="font-medium">{booking.passengerName}</span>
                                </div>
                            )}
                            {booking.seatNumber && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Seat Number:</span>
                                    <span className="font-medium">{booking.seatNumber}</span>
                                </div>
                            )}
                            {booking.travelDate && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Travel Date:</span>
                                    <span className="font-medium">{formatDate(booking.travelDate)}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 border-t">
                                <span className="text-gray-600">Original Amount:</span>
                                <span className="font-semibold">₹{booking.amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Refund Calculation */}
                    {refundCalculation ? (
                        <>
                            {/* Warning Banner */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-yellow-800">
                                        Cancellation Window: {refundCalculation.slot}
                                    </p>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        You will receive {refundCalculation.refundPercentage}% of your booking amount.
                                    </p>
                                </div>
                            </div>

                            {/* Refund Breakdown */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <IndianRupee className="w-5 h-5" />
                                    Refund Breakdown
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Original Booking Amount:</span>
                                        <span>₹{refundCalculation.breakdown.originalAmount.toFixed(2)}</span>
                                    </div>
                                    {refundCalculation.breakdown.convenienceFee > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>Convenience Fee (5%):</span>
                                            <span>- ₹{refundCalculation.breakdown.convenienceFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {refundCalculation.breakdown.cancellationFee > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>Cancellation Fee:</span>
                                            <span>- ₹{refundCalculation.breakdown.cancellationFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-300">
                                        <span className="text-gray-600">Total Deductions:</span>
                                        <span className="text-red-600 font-medium">
                                            - ₹{refundCalculation.deductionTotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t-2 border-gray-400">
                                        <span className="font-semibold text-gray-900">Refund Amount:</span>
                                        <span className="font-bold text-green-600 text-lg">
                                            ₹{refundCalculation.refundAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Refund Timeline
                                </h4>
                                <ul className="text-sm text-blue-800 space-y-1 ml-7">
                                    <li>• Initiated: Immediately after confirmation</li>
                                    <li>• Processing: 1-2 working days</li>
                                    <li>• Credited: 3-5 working days to your original payment method</li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Calculating refund...</p>
                        </div>
                    )}

                    {/* Confirmation Checkbox */}
                    {refundCalculation && (
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="confirm-cancel"
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="confirm-cancel" className="text-sm text-gray-700 cursor-pointer">
                                I understand that this action is irreversible and I will receive{' '}
                                <strong>₹{refundCalculation.refundAmount.toFixed(2)}</strong> as a refund within 3-5 working days.
                            </label>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                        disabled={loading}
                    >
                        Keep Booking
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!confirmed || loading || !refundCalculation}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancellationModal;
