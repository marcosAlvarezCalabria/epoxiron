
const API_URL = 'http://localhost:3000/api';

async function main() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@epoxiron.com', password: '123456' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const { token } = await loginRes.json();
        console.log('Login successful. Token acquired.');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Create Customer with Prices
        const customerName = `Test Customer ${Date.now()}`;
        console.log(`Creating customer with prices: ${customerName}`);

        const createData = {
            name: customerName,
            pricePerLinearMeter: 12.50,
            pricePerSquareMeter: 24.00,
            minimumRate: 60.00,
            specialPieces: [
                { name: 'Reja', price: 50 },
                { name: 'Puerta', price: 100 }
            ]
        };

        const customerRes = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers,
            body: JSON.stringify(createData)
        });

        if (!customerRes.ok) {
            const err = await customerRes.json();
            throw new Error(`Create customer failed: ${customerRes.status} - ${JSON.stringify(err)}`);
        }

        const customer = await customerRes.json();
        console.log(`Customer created. ID: ${customer.id}`);

        // 3. Verify Prices are saved
        console.log('Verifying saved data...');
        if (customer.pricePerLinearMeter === 12.50 &&
            customer.pricePerSquareMeter === 24.00 &&
            customer.specialPieces.length === 2) {
            console.log('SUCCESS: Customer saved with correct pricing!');
        } else {
            console.error('FAILURE: Customer data does not match input.');
            console.log('Received:', customer);
        }

        // --- NEW TEST CASE: Delivery Note Pricing ---
        console.log('\n--- Starting Delivery Note Pricing Test ---');

        // Create a new customer for this specific test case
        const newCustomerName = `DN Test Customer ${Date.now()}`;
        const newCustomer = {
            name: newCustomerName,
            pricePerLinearMeter: 15.50,
            pricePerSquareMeter: 45.00,
            minimumRate: 50.00,
            specialPieces: [
                { name: 'Corner', price: 25.00 }
            ]
        };

        console.log(`Creating new customer for DN test: ${newCustomerName}`);
        const createRes = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers, // Use the authenticated headers
            body: JSON.stringify(newCustomer)
        });

        if (!createRes.ok) {
            console.error('Failed to create customer for DN test:', await createRes.text());
            process.exit(1); // Exit if customer creation fails
        }

        const createdCustomer = await createRes.json();
        console.log('Customer created for DN test:', createdCustomer.id);

        // Verify fields are present
        if (
            createdCustomer.pricePerLinearMeter === 15.50 &&
            createdCustomer.pricePerSquareMeter === 45.00 &&
            createdCustomer.minimumRate === 50.00 &&
            createdCustomer.specialPieces.length === 1 &&
            createdCustomer.specialPieces[0].name === 'Corner' &&
            createdCustomer.specialPieces[0].price === 25.00
        ) {
            console.log('✅ Customer pricing fields persisted correctly for DN test');
        } else {
            console.error('❌ Customer pricing fields mismatch for DN test:', createdCustomer);
            process.exit(1); // Exit if customer data is incorrect
        }

        // Now verify Delivery Note creation with automatic pricing
        console.log('\n2. Verifying Delivery Note Pricing...');

        const deliveryNoteData = {
            customerId: createdCustomer.id,
            date: new Date().toISOString(),
            items: [
                {
                    name: 'Viga IPN',
                    description: 'Viga de acero',
                    quantity: 10, // 10 units
                    measurements: {
                        linearMeters: 2.0 // 2 meters each
                    },
                    // Expected price calculation:
                    // 2.0 meters * 15.50 eur/m = 31.00 eur unit price
                    // But minimum rate is 50.00?
                    // Wait, logic says: if calculated < minimumRate, use minimumRate.
                    // 31.00 < 50.00 -> should be 50.00
                    // Total: 10 * 50.00 = 500.00
                },
                {
                    name: 'Corner', // Special piece
                    description: 'Esquina especial',
                    quantity: 2,
                    // Special piece price: 25.00
                    // Total: 2 * 25.00 = 50.00
                }
            ]
        };

        const dnRes = await fetch(`${API_URL}/delivery-notes`, {
            method: 'POST',
            headers, // Use the authenticated headers
            body: JSON.stringify(deliveryNoteData)
        });

        if (!dnRes.ok) {
            console.error('Failed to create delivery note:', await dnRes.text());
            process.exit(1); // Exit if delivery note creation fails
        }

        const createdDN = await dnRes.json();
        console.log('Delivery Note created:', createdDN.id);

        // Access items from the created note
        const item1 = createdDN.items.find(i => i.name === 'Viga IPN');
        const item2 = createdDN.items.find(i => i.name === 'Corner');

        let success = true;

        // Verify Item 1 (Minimum Rate Logic)
        // Calculated: 2 * 15.5 = 31.
        // Minimum: 50.
        // Expected Unit Price: 50.
        if (item1 && item1.unitPrice === 50) {
            console.log('✅ Item 1 price correct (Minimum Rate applied): 50.00');
        } else {
            console.error(`❌ Item 1 price incorrect. Expected 50.00, got ${item1 ? item1.unitPrice : 'not found'}`);
            success = false;
        }

        // Verify Item 2 (Special Piece Logic)
        // Price: 25.
        if (item2 && item2.unitPrice === 25) {
            console.log('✅ Item 2 price correct (Special Piece): 25.00');
        } else {
            console.error(`❌ Item 2 price incorrect. Expected 25.00, got ${item2 ? item2.unitPrice : 'not found'}`);
            success = false;
        }

        if (success) {
            console.log('\n🎉 ALL DELIVERY NOTE TESTS PASSED: Rates successfully merged into Customers!');
        } else {
            console.log('\n⚠️ Some delivery note tests failed.');
            process.exit(1); // Exit if delivery note tests fail
        }

    } catch (error) {
        console.error('Error:', error);
        process.exit(1); // Exit on any unhandled error
    }
}

main();
