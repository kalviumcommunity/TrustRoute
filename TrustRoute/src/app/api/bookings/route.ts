import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
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

        const bookings = await prisma.booking.findMany({
            where: { userId: decoded.userId },
            include: {
                operator: {
                    select: {
                        name: true,
                    },
                },
                policy: {
                    select: {
                        rules: true,
                        version: true,
                    },
                },
                refundTransaction: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error) {
        console.error('Fetch bookings error:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
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

        const { operatorId, policyId, amount, seatNumber, passengerName, travelDate, route, departureTime } = await request.json();

        if (!operatorId || !policyId || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const booking = await prisma.booking.create({
            data: {
                userId: decoded.userId,
                operatorId,
                policyId,
                amount: parseFloat(amount),
                status: 'CONFIRMED',
                seatNumber,
                passengerName,
                travelDate: travelDate ? new Date(travelDate) : null,
                route,
                departureTime,
            },
        });

        return NextResponse.json({ booking }, { status: 201 });
    } catch (error) {
        console.error('Create booking error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
