import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const STANDARD_REFUND_RULES = {
    slabs: [
        { hoursBefore: 24, refundPercentage: 95, label: 'More than 24 hours' },
        { hoursBefore: 12, refundPercentage: 75, label: '12 to 24 hours' },
        { hoursBefore: 3, refundPercentage: 50, label: '3 to 12 hours' },
        { hoursBefore: 0, refundPercentage: 0, label: 'Less than 3 hours' },
    ],
    fees: {
        convenience: 5,
        operatorDelay: 110,
    }
};

async function main() {
    console.log('Clearing existing data...');
    // Delete in order to satisfy foreign key constraints
    await prisma.refundTransaction.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.refundPolicy.deleteMany({});
    await prisma.busOperator.deleteMany({});
    // We don't delete users to preserve accounts

    const operatorNames = [
        'FastTrack Travels',
        'StarBus',
        'GreenLine',
        'NightRider',
        'CityLink Express',
        'Royal Coaches',
        'MetroWay',
    ];

    const createdOperators = [];

    for (const name of operatorNames) {
        const created = await prisma.busOperator.create({
            data: {
                name: name,
                refundPolicies: {
                    create: {
                        rules: STANDARD_REFUND_RULES,
                        version: 1,
                        isCurrent: true,
                    },
                },
            },
            include: {
                refundPolicies: true,
            },
        });
        createdOperators.push(created);
        console.log(`✅ Created operator: ${created.name}`);
    }

    // Try to find a user to attach sample bookings to, or create a demo one
    let demoUser = await prisma.user.findFirst({
        where: { email: 'demo@example.com' }
    });

    if (!demoUser) {
        // If no demo user, try to find ANY user
        demoUser = await prisma.user.findFirst();
    }

    if (demoUser) {
        console.log('\n🚌 Adding sample bus routes/bookings for history...');

        const routes = [
            { from: 'New York', to: 'Boston', distance: 215, duration: '3h 45m', price: 45 },
            { from: 'New York', to: 'Philadelphia', distance: 95, duration: '2h 15m', price: 35 },
            { from: 'Boston', to: 'Philadelphia', distance: 310, duration: '5h 30m', price: 55 },
        ];

        let count = 0;
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const operator = createdOperators[i % createdOperators.length];
            const policy = operator.refundPolicies[0];

            // Create a past booking
            await prisma.booking.create({
                data: {
                    userId: demoUser.id,
                    operatorId: operator.id,
                    policyId: policy.id,
                    amount: route.price,
                    status: 'COMPLETED',
                    seatNumber: `${String.fromCharCode(65 + (i % 26))}1`,
                    passengerName: demoUser.name || 'Traveler',
                    route: `${route.from} → ${route.to}`,
                    travelDate: new Date(Date.now() - 86400000 * (i + 1)), // Past dates
                    departureTime: '10:00 AM',
                },
            });
            count++;
        }
        console.log(`✅ Added ${count} sample past bookings for user ${demoUser.email || demoUser.id}`);
    } else {
        console.log('ℹ️ No users found. Skipping sample booking creation. Operators are created and searchable.');
    }

    console.log(`✅ Seeding complete!`);
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
