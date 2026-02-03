#!/bin/bash
cd /app
cat > /tmp/seed.js << 'EOF'
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
    await prisma.booking.deleteMany({});
    await prisma.refundPolicy.deleteMany({});
    await prisma.busOperator.deleteMany({});

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

    console.log('\n🚌 Adding sample bus routes...');
    
    const routes = [
        { from: 'New York', to: 'Boston', distance: 215, duration: '3h 45m', price: 45 },
        { from: 'New York', to: 'Philadelphia', distance: 95, duration: '2h 15m', price: 35 },
        { from: 'Boston', to: 'Philadelphia', distance: 310, duration: '5h 30m', price: 55 },
        { from: 'New York', to: 'Washington DC', distance: 225, duration: '4h 00m', price: 50 },
        { from: 'Philadelphia', to: 'Washington DC', distance: 140, duration: '2h 45m', price: 40 },
        { from: 'Boston', to: 'Washington DC', distance: 435, duration: '7h 15m', price: 75 },
    ];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    let count = 0;
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const operator = createdOperators[i % createdOperators.length];
        const policy = operator.refundPolicies[0];
        
        for (let j = 0; j < 2; j++) {
            const travelDate = j === 0 ? tomorrow : nextWeek;
            const hour = 8 + (j * 6);
            
            await prisma.booking.create({
                data: {
                    userId: 'demo-user-id',
                    operatorId: operator.id,
                    policyId: policy.id,
                    amount: route.price,
                    status: 'CONFIRMED',
                    seatNumber: `${String.fromCharCode(65 + (i % 26))}${j + 1}`,
                    passengerName: `Sample Passenger ${i + 1}`,
                    route: `${route.from} → ${route.to}`,
                    travelDate: travelDate,
                    departureTime: `${hour}:00 AM`,
                },
            });
            count++;
        }
    }

    console.log(`✅ Seeding complete! Added ${routes.length} routes with ${count} total bookings.`);
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
EOF
node /tmp/seed.js
