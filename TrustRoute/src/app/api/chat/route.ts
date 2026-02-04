import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

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

        const { messages } = await request.json();

        // Fetch User Data for context
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                bookings: {
                    include: {
                        operator: true,
                        refundTransaction: true
                    },
                    orderBy: {
                        travelDate: 'desc'
                    }
                }
            }
        });

        // Read Policy Details
        // The file is at /Users/sriman/Developer/Projects/TrustRoute/docs/REFUND_POLICY.md
        // The code is at /Users/sriman/Developer/Projects/TrustRoute/TrustRoute/src/app/api/chat/route.ts
        // In local dev, process.cwd() is /Users/sriman/Developer/Projects/TrustRoute/TrustRoute
        const policyPath = path.join(process.cwd(), '..', 'docs', 'REFUND_POLICY.md');
        let policyContent = '';
        try {
            if (fs.existsSync(policyPath)) {
                policyContent = fs.readFileSync(policyPath, 'utf-8');
            } else {
                // Try alternate path if first fails
                const altPath = path.join(process.cwd(), 'docs', 'REFUND_POLICY.md');
                if (fs.existsSync(altPath)) {
                    policyContent = fs.readFileSync(altPath, 'utf-8');
                } else {
                    policyContent = "Refund Policy: 95% refund if >24hrs, 75% if 12-24hrs, 50% if 3-12hrs, 0% if <3hrs. Timeline: 1-2 days processing, 3-5 days credit.";
                }
            }
        } catch (e) {
            policyContent = "Refund Policy: 95% refund if >24hrs, 75% if 12-24hrs, 50% if 3-12hrs, 0% if <3hrs. Timeline: 1-2 days processing, 3-5 days credit.";
        }

        // Prepare context
        const context = {
            userName: user?.name || 'User',
            bookings: user?.bookings.map((b: any) => ({
                id: b.id,
                route: b.route,
                date: b.travelDate ? new Date(b.travelDate).toLocaleDateString() : 'N/A',
                time: b.departureTime,
                amount: b.amount,
                status: b.status,
                refundStatus: b.refundTransaction?.status || 'None',
                refundAmount: b.refundTransaction?.refundAmount || 0
            })),
            policy: policyContent
        };

        const systemPrompt = `
You are TrustRoute AI, the official AI Chatbot for TrustRoute. Your goal is to help users with their refund policy doubts, booking details, and refund status queries.

Core Instructions:
1. **Refund Policy Assistance**: Strictly follow the provided policy. Explain slabs, deductions (convenience and cancellation fees), and timelines (1-2 days processing, 3-5 days credit) simply.
2. **Booking Awareness**: Use the provided user-specific booking data to answer questions about their trips. Be personalized (use their name: ${context.userName}).
3. **Refund Status**: Use the real refund states (Initiated, Processing, Credited) from the booking data.
4. **Tamil Support**: If the user asks in Tamil or asks to speak in Tamil (e.g., "தமிழில் சொல்லு"), respond ONLY in simple, conversational Tamil.
5. **Conversational UX**: Be friendly, supportive, and empathetic. Keep answers short and clear. Ask follow-up questions only when needed.
6. **Constraint**: You are read-only. You cannot book or cancel tickets. Do not hallucinate booking or refund information. If data is missing, politely say so.

User Booking Context:
${JSON.stringify(context.bookings, null, 2)}

Refund Policy Content:
${context.policy}

Format your response using Markdown. Avoid overly long paragraphs.
`;

        const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://trustroute.vercel.app',
                'X-Title': 'TrustRoute AI Chatbot'
            },
            body: JSON.stringify({
                model: 'qwen/qwen-2.5-72b-instruct',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error('OpenRouter error:', errorData);
            return NextResponse.json({ error: 'AI Service Error' }, { status: 502 });
        }

        const data = await apiResponse.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
