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
        { name: 'FastTrack Travels' },
        { name: 'StarBus' },
        { name: 'GreenLine' },
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
