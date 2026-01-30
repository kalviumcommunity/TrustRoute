import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { calculateRefund } from '@/lib/refund-utils';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { policy: true },
        });

        if (!booking || booking.userId !== decoded.userId) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.status === 'CANCELLED') {
            return NextResponse.json({ error: 'Booking already cancelled' }, { status: 400 });
        }

        // Calculate refund
        const departureTime = booking.travelDate || new Date();
        const results = calculateRefund(booking.amount, departureTime, new Date(), booking.policy.rules as any);

        // Audit Logging Layer
        console.log(`[AUDIT][${new Date().toISOString()}] Refund Initiation:
    Booking ID: ${id}
    User ID: ${decoded.userId}
    Original Amount: ₹${booking.amount}
    Refund Amount: ₹${results.refundAmount}
    Deduction: ₹${results.deductionTotal}
    Slab Applied: ${results.appliedSlab.label}
    Departure: ${departureTime.toISOString()}`);

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                refundTransaction: {
                    create: {
                        refundAmount: results.refundAmount,
                        deductionTotal: results.deductionTotal,
                        breakdown: results.breakdown as any,
                        status: 'INITIATED',
                        timeline: [
                            { status: 'INITIATED', timestamp: new Date().toISOString(), message: 'Refund initiated automatically via TrustRoute Policy System.' }
                        ] as any,
                    }
                }
            },
            include: {
                refundTransaction: true,
                operator: true
            }
        });

        return NextResponse.json({ booking: updatedBooking }, { status: 200 });
    } catch (error) {
        console.error('Cancellation error:', error);
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
    }
}
