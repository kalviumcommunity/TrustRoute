import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Clearing existing data...');
    await prisma.refundTransaction.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.refundPolicy.deleteMany({});
    await prisma.busOperator.deleteMany({});

    console.log('Seeding data...');

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
    ];

    for (const op of operators) {
        const created = await prisma.busOperator.create({
            data: {
                name: op.name,
                refundPolicies: op.policies,
            },
        });
        console.log(`Created operator: ${created.name}`);
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
