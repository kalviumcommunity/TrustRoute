import React from 'react';
import { Bus, Calendar, Clock, MapPin, User, CreditCard, XCircle, CheckCircle } from 'lucide-react';

interface BookingCardProps {
    booking: {
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
            status: string;
            timeline: any[];
        } | null;
    };
    onCancelClick: (bookingId: string) => void;
    onViewTimeline: (booking: any) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancelClick, onViewTimeline }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Cancelled
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                    </span>
                );
            default:
                return null;
        }
    };

    const getRefundStatusBadge = (status: string) => {
        switch (status) {
            case 'INITIATED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        Refund Initiated
                    </span>
                );
            case 'PROCESSING':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        Processing
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Refunded
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                        Failed
                    </span>
                );
            default:
                return null;
        }
    };

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

    const formatShortDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const canCancel = () => {
        if (booking.status !== 'CONFIRMED') return false;
        if (!booking.travelDate) return false;
        const travelDate = new Date(booking.travelDate);
        return travelDate > new Date();
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Bus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{booking.operator.name}</h3>
                        <p className="text-xs text-gray-500">Ticket ID: {booking.id.slice(0, 8)}</p>
                    </div>
                </div>
                {getStatusBadge(booking.status)}
            </div>

            {/* Route & Time Info */}
            {booking.route && (
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{booking.route}</span>
                </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                {booking.travelDate && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Journey Date</p>
                            <p className="font-medium text-gray-900">{formatShortDate(booking.travelDate)}</p>
                        </div>
                    </div>
                )}

                {booking.departureTime && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Departure</p>
                            <p className="font-medium text-gray-900">{booking.departureTime}</p>
                        </div>
                    </div>
                )}

                {booking.passengerName && (
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Passenger</p>
                            <p className="font-medium text-gray-900">{booking.passengerName}</p>
                        </div>
                    </div>
                )}

                {booking.seatNumber && (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-500">S</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Seat</p>
                            <p className="font-medium text-gray-900">{booking.seatNumber}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking & Cancellation Info */}
            <div className="border-t border-gray-200 pt-3 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Booked on:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(booking.createdAt)}</span>
                </div>
                {booking.cancelledAt && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Cancelled on:</span>
                        <span className="text-sm font-medium text-red-600">{formatDate(booking.cancelledAt)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-lg font-bold text-gray-900">₹{booking.amount.toFixed(2)}</span>
                </div>
            </div>

            {/* Refund Info */}
            {booking.refundTransaction && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-700">Refund Amount:</span>
                        <span className="text-lg font-bold text-green-600">
                            ₹{booking.refundTransaction.refundAmount.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Status:</span>
                        {getRefundStatusBadge(booking.refundTransaction.status)}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {canCancel() && (
                    <button
                        onClick={() => onCancelClick(booking.id)}
                        className="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition text-sm"
                    >
                        Cancel Ticket
                    </button>
                )}
                {booking.refundTransaction && (
                    <button
                        onClick={() => onViewTimeline(booking)}
                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-blue-100 transition text-sm"
                    >
                        View Refund Status
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookingCard;
