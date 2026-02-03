import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, hashPassword, comparePassword } from '@/lib/auth';
import { cookies } from 'next/headers';

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

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await comparePassword(currentPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: decoded.userId },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
}
