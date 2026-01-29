import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const date = searchParams.get('date');

        if (!from || !to || !date) {
            return NextResponse.json({ error: 'From, To, and Date are required' }, { status: 400 });
        }

        // For demo purposes, we fetch all operators and return them as search results
        // In a real app, we would search a 'Schedules' or 'Buses' table
        const operators = await prisma.busOperator.findMany({
            include: {
                refundPolicies: {
                    where: { isCurrent: true },
                    take: 1,
                },
            },
        });

        if (operators.length === 0) {
            return NextResponse.json({ buses: [] });
        }

        const buses = operators.map((op, index) => ({
            id: op.id,
            name: `${op.name} Express`,
            operatorName: op.name,
            operatorId: op.id,
            policyId: op.refundPolicies[0]?.id,
            departure: `${9 + index}:00 AM`,
            arrival: `${5 + index}:00 PM`,
            price: 700 + (index * 150),
            type: index % 2 === 0 ? 'A/C Sleeper' : 'Non-A/C Seater',
        }));

        return NextResponse.json({ buses }, { status: 200 });
    } catch (error) {
        console.error('Search buses error:', error);
        return NextResponse.json({ error: 'Failed to search buses' }, { status: 500 });
    }
}
