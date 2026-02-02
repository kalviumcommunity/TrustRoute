import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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

function calculateRefund(bookingAmount: number, travelDate: Date): RefundCalculation {
    const now = new Date();
    const hoursUntilDeparture = (travelDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundPercentage = 0;
    let slot = '';

    // TrustRoute refund policy slabs
    if (hoursUntilDeparture > 24) {
        refundPercentage = 95; // 5% convenience fee
        slot = 'More than 24 hours before departure';
    } else if (hoursUntilDeparture >= 12) {
        refundPercentage = 75; // 25% fee
        slot = '12-24 hours before departure';
    } else if (hoursUntilDeparture >= 3) {
        refundPercentage = 50; // 50% fee
        slot = '3-12 hours before departure';
    } else {
        refundPercentage = 0; // No refund
        slot = 'Less than 3 hours before departure';
    }

    const refundAmount = (bookingAmount * refundPercentage) / 100;
    const deductionTotal = bookingAmount - refundAmount;
    
    // Calculate breakdown
    const convenienceFee = bookingAmount * 0.05; // Fixed 5% convenience fee
    const cancellationFee = deductionTotal - convenienceFee;

    return {
        refundAmount,
        deductionTotal,
        refundPercentage,
        slot,
        breakdown: {
            originalAmount: bookingAmount,
            convenienceFee: Math.max(0, convenienceFee),
            cancellationFee: Math.max(0, cancellationFee),
            refundAmount,
        },
    };
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { bookingId } = await request.json();

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }

        // Fetch the booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                operator: true,
                refundTransaction: true,
            },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Verify ownership
        if (booking.userId !== decoded.userId) {
            return NextResponse.json({ error: 'Unauthorized to cancel this booking' }, { status: 403 });
        }

        // Check if already cancelled
        if (booking.status === 'CANCELLED') {
            return NextResponse.json({ error: 'Booking already cancelled' }, { status: 400 });
        }

        // Check if already has a refund transaction
        if (booking.refundTransaction) {
            return NextResponse.json({ error: 'Cancellation already in progress' }, { status: 400 });
        }

        // Check if travel date is in the past
        if (booking.travelDate && booking.travelDate < new Date()) {
            return NextResponse.json({ error: 'Cannot cancel past bookings' }, { status: 400 });
        }

        if (!booking.travelDate) {
            return NextResponse.json({ error: 'Travel date not set for this booking' }, { status: 400 });
        }

        // Calculate refund
        const refundCalc = calculateRefund(booking.amount, booking.travelDate);

        const now = new Date();

        // Create refund transaction with timeline
        const timeline = [
            {
                stage: 'Booked',
                timestamp: booking.createdAt.toISOString(),
                status: 'completed',
                description: `Ticket booked for ${booking.operator.name}`,
            },
            {
                stage: 'Cancelled',
                timestamp: now.toISOString(),
                status: 'completed',
                description: `Cancellation confirmed. ${refundCalc.slot}`,
            },
            {
                stage: 'Refund Initiated',
                timestamp: now.toISOString(),
                status: 'current',
                description: `Refund of ₹${refundCalc.refundAmount.toFixed(2)} initiated`,
            },
            {
                stage: 'Processing',
                timestamp: null,
                status: 'pending',
                description: 'Bank verification in progress',
            },
            {
                stage: 'Credited',
                timestamp: null,
                status: 'pending',
                description: 'Amount will be credited to your original payment method',
            },
        ];

        // Update booking and create refund transaction
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CANCELLED',
                cancelledAt: now,
                refundTransaction: {
                    create: {
                        refundAmount: refundCalc.refundAmount,
                        deductionTotal: refundCalc.deductionTotal,
                        breakdown: refundCalc.breakdown,
                        status: 'INITIATED',
                        timeline,
                        initiatedAt: now,
                        cancellationSlot: refundCalc.slot,
                    },
                },
            },
            include: {
                operator: true,
                refundTransaction: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Booking cancelled successfully',
                booking: updatedBooking,
                refund: refundCalc,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Cancel booking error:', error);
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
    }
}

// GET endpoint to calculate refund preview without actually cancelling
export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const bookingId = searchParams.get('bookingId');

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.userId !== decoded.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!booking.travelDate) {
            return NextResponse.json({ error: 'Travel date not set' }, { status: 400 });
        }

        const refundCalc = calculateRefund(booking.amount, booking.travelDate);

        return NextResponse.json({ refund: refundCalc }, { status: 200 });
    } catch (error) {
        console.error('Calculate refund error:', error);
        return NextResponse.json({ error: 'Failed to calculate refund' }, { status: 500 });
    }
}
