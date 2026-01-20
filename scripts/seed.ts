import 'dotenv/config';
import { PrismaClient } from '../api/src/generated/client/client';
import process from 'node:process';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connection = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(connection);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seeding...');

    console.log('🧹 Cleaning database...');
    await prisma.deliveryNoteItem.deleteMany();
    await prisma.deliveryNote.deleteMany();
    await prisma.specialPrice.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create Admin User
    const adminEmail = 'admin@epoxiron.com';
    console.log(`Creating Admin User: ${adminEmail}`);
    // Password: "123456" (hash taken from authController.ts)
    const passwordHash = '$2b$10$P4jDE8EYB.stJZABgpW3T.PyQaeSfpep4HmKp.Sf/cTaaZy6wg2cS';

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Administrador',
            password: passwordHash,
            role: 'ADMIN',
        },
    });

    const customerCount = 10;
    const notesPerCustomer = 5;

    // Helper to round to 2 decimals
    const round = (num: number) => Math.round(num * 100) / 100;

    // Global counter for sequential delivery notes across all customers
    let noteGlobalCounter = 1;

    for (let i = 1; i <= customerCount; i++) {
        const customerName = `Cliente Empresa ${i} S.L.`;
        const email = `contacto@empresa${i}.com`;

        console.log(`Creating Customer ${i}/${customerCount}: ${customerName}`);

        const customer = await prisma.customer.create({
            data: {
                name: customerName,
                email: email,
                phone: `600${Math.floor(100000 + Math.random() * 900000)}`,
                address: `Polígono Industrial ${i}, Calle Principal ${Math.floor(Math.random() * 100)}`,
                pricePerLinearMeter: round(10 + Math.random() * 10),
                pricePerSquareMeter: round(20 + Math.random() * 15),
                minimumRate: 50,
                specialPrices: {
                    create: [
                        { name: 'Viga IPN-100', price: round(50 + Math.random() * 20) },
                        { name: 'Reja Ventana', price: round(80 + Math.random() * 30) }
                    ]
                }
            }
        });

        // Create 5 Delivery Notes for this Customer
        for (let j = 1; j <= notesPerCustomer; j++) {
            const noteNumber = `ALB-26-${noteGlobalCounter.toString().padStart(3, '0')}`;
            noteGlobalCounter++;

            await prisma.deliveryNote.create({
                data: {
                    number: noteNumber,
                    customerId: customer.id,
                    customerName: customer.name,
                    date: new Date(),
                    status: j % 2 === 0 ? 'VALIDATED' : 'DRAFT',
                    totalAmount: 0, // In a real app logic this would be sum of items
                    items: {
                        create: [
                            {
                                name: 'Tubo Estructural',
                                description: '40x40x2mm',
                                color: 'RAL 9016',
                                quantity: Math.floor(1 + Math.random() * 10),
                                linearMeters: 6,
                                unitPrice: customer.pricePerLinearMeter,
                                totalPrice: round(customer.pricePerLinearMeter * 6),
                            },
                            {
                                name: 'Chapa Lisa',
                                description: '2000x1000x2mm',
                                color: 'RAL 7016',
                                quantity: Math.floor(1 + Math.random() * 5),
                                squareMeters: 2,
                                unitPrice: customer.pricePerSquareMeter,
                                totalPrice: round(customer.pricePerSquareMeter * 2),
                            }
                        ]
                    }
                }
            });
        }
    }

    console.log('✅ Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
