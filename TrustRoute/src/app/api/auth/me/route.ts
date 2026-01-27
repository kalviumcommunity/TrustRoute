import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error('Session error:', error);
        return NextResponse.json({ user: null }, { status: 200 });
    }
}

export async function POST() {
    // Logout
    try {
        const cookieStore = await cookies();
        cookieStore.set('token', '', { maxAge: 0 });
        return NextResponse.json({ message: 'Logged out' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
