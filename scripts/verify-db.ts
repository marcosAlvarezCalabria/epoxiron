import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import process from 'node:process';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connection = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(connection);

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🚀 Starting database verification...');

    try {
        // 1. Connect
        await prisma.$connect();
        console.log('✅ Connected to database successfully.');

        // 2. Clear previous test data (optional, purely for clean state in dev)
        // await prisma.customer.deleteMany({ where: { email: 'test@example.com' } });

        // 3. Create a test user
        const userEmail = `test-${Date.now()}@example.com`;
        console.log(`Creating test user: ${userEmail}`);
        const user = await prisma.user.create({
            data: {
                email: userEmail,
                name: 'Test User',
                password: 'hashed-password-123', // In real app, hash this!
            },
        });
        console.log('✅ User created:', user.id);

        // 4. Create a Customer with Special Prices
        console.log('Creating test customer...');
        const customer = await prisma.customer.create({
            data: {
                name: 'Verification Corp',
                email: 'contact@verification.corp',
                pricePerLinearMeter: 10.5,
                pricePerSquareMeter: 25.0,
                specialPrices: {
                    create: [
                        { name: 'Special Beam A', price: 150.0 },
                        { name: 'Special Beam B', price: 200.0 },
                    ],
                },
            },
            include: {
                specialPrices: true,
            },
        });
        console.log('✅ Customer created:', customer.name);
        console.log('   with Special Prices:', customer.specialPrices.length);

        // 5. Create a Delivery Note for that customer
        console.log('Creating delivery note...');
        const note = await prisma.deliveryNote.create({
            data: {
                number: `ALB-TEST-${Date.now()}`,
                customerId: customer.id,
                customerName: customer.name,
                items: {
                    create: [
                        {
                            name: 'Item 1',
                            description: 'Test Item Description',
                            color: 'RAL9000',
                            quantity: 2,
                            unitPrice: 50,
                            totalPrice: 100,
                        }
                    ]
                }
            },
            include: {
                items: true
            }
        });
        console.log('✅ Delivery Note created:', note.number);
        console.log('   with Items:', note.items.length);

        console.log('🎉 Verification COMPLETE. All systems go.');

    } catch (error) {
        console.error('❌ Verification FAILED:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
