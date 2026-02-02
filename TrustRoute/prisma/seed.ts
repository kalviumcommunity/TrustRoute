import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const STANDARD_REFUND_RULES = {
    slabs: [
        { hoursBefore: 24, refundPercentage: 95, label: 'More than 24 hours' },
        { hoursBefore: 12, refundPercentage: 75, label: '12 to 24 hours' },
        { hoursBefore: 3, refundPercentage: 50, label: '3 to 12 hours' },
        { hoursBefore: 0, refundPercentage: 0, label: 'Less than 3 hours' },
    ],
    fees: {
        convenience: 5, // as a percentage of original fare if > 24h, included in slabs
        operatorDelay: 110, // 100% refund + 10% credit
    }
};

async function main() {
    console.log('Clearing existing data...');
    await prisma.refundTransaction.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.refundPolicy.deleteMany({});
    await prisma.busOperator.deleteMany({});

    console.log('Seeding data with TrustRoute Refund Policies...');

    const operators = [
        {
            name: 'FastTrack Travels',
            policies: {
                create: {
                    rules: {
                        cancellation: 'Full refund before 24h, 50% refund before 12h',
                        reschedule: 'Allowed with 10% fee up to 6h before',
                    },
                    version: 1,
                    isCurrent: true,
                },
            },
        },
        {
            name: 'StarBus',
            policies: {
                create: {
                    rules: {
                        cancellation: 'No refund within 24h of departure',
                        reschedule: 'Not allowed for promotional tickets',
                    },
                    version: 1,
                    isCurrent: true,
                },
            },
        },
        {
            name: 'GreenLine',
            policies: {
                create: {
                    rules: {
                        cancellation: '75% refund if cancelled 48h early',
                        reschedule: 'Unlimited rescheduling for Silver members',
                    },
                    version: 1,
                    isCurrent: true,
                },
            },
        },
        {
            name: 'NightRider',
            policies: {
                create: {
                    rules: {
                        cancellation: '95% refund before 24h, 50% refund before 6h',
                        reschedule: 'Allowed with 5% fee up to 4h before',
                    },
                    version: 1,
                    isCurrent: true,
                },
            },
        },
        {
            name: 'CityLink Express',
            policies: {
                create: {
                    rules: {
                        cancellation: '80% refund if cancelled 24h early',
                        reschedule: 'Allowed with 15% fee up to 8h before',
                    },
                    version: 1,
                    isCurrent: true,
                },
            },
        },
        {
            name: 'Royal Coaches',
            policies: {
                create: {
                    rules: {
                        cancellation: '90% refund before 12h, 40% refund before 3h',
                        reschedule: 'Allowed with 20% fee up to 2h before',
                    },
                    version: 1,
                    isCurrent: true,
                },
            },
        },
        {
            name: 'MetroWay',
            policies: {
                create: {
                    rules: {
                        cancellation: '85% refund before 24h, 30% refund before 6h',
                        reschedule: 'Allowed with 10% fee up to 5h before',
                    },
                    version: 1,
                    isCurrent: true,
                },
            },
        },
    ];

    for (const op of operators) {
        const created = await prisma.busOperator.create({
            data: {
                name: op.name,
                refundPolicies: {
                    create: {
                        rules: STANDARD_REFUND_RULES as any,
                        version: 1,
                        isCurrent: true,
                    },
                },
            },
        });
        console.log(`Created operator: ${created.name} with TrustRoute policy.`);
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
