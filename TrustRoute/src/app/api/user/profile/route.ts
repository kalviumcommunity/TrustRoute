import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PATCH(request: Request) {
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

        const { name, phoneNumber } = await request.json();

        // Basic validation
        if (name && name.length < 2) {
            return NextResponse.json({ error: 'Name must be at least 2 characters long' }, { status: 400 });
        }

        if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
            return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: {
                name,
                phoneNumber,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ user: updatedUser, message: 'Profile updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
