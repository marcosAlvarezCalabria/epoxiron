
import { strict as assert } from 'assert'

const API_URL = 'http://localhost:3000/api'
let authToken = ''
let customerId = ''

async function run() {
    try {
        console.log('🧪 Starting Primer Feature Verification...')

        // 1. Auth Login
        console.log('🔑 Logging in...')
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@epoxiron.com', password: '123456' })
        })

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`)
        const loginData = await loginRes.json()
        authToken = loginData.token
        console.log('✅ Login successful')

        // 2. Create Customer
        console.log('👤 Creating Test Customer...')
        const custRes = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name: 'Primer Test Customer',
                pricePerLinearMeter: 10,  // Rates
                pricePerSquareMeter: 20,
                minimumRate: 5,
                specialPieces: [{ name: 'Corner', price: 15 }]
            })
        })

        if (!custRes.ok) throw new Error(`Create customer failed: ${custRes.status}`)
        const customer = await custRes.json()
        customerId = customer.id
        console.log('✅ Customer created')

        // 3. Create Delivery Note with Primer
        console.log('📄 Creating Delivery Note with Primer...')
        const noteRes = await fetch(`${API_URL}/delivery-notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                customerId: customerId,
                items: [
                    {
                        name: 'Linear Item',
                        description: 'Item with primer',
                        color: 'RAL9010',
                        quantity: 1,
                        measurements: { linearMeters: 2 }, // Base price: 2 * 10 = 20
                        hasPrimer: true // Should double to 40
                    },
                    {
                        name: 'Corner', // Special Piece
                        description: 'Special piece with primer',
                        color: 'RAL9010',
                        quantity: 1,
                        hasPrimer: true // Base: 15 -> Should double to 30
                    }
                ]
            })
        })

        if (!noteRes.ok) throw new Error(`Create delivery note failed: ${noteRes.status}`)
        const note = await noteRes.json()

        // 4. Verify Prices
        console.log('🔍 Verifying Prices...')

        // Item 1: Linear Meters (2 * 10 = 20) * 2 = 40
        const item1 = note.items[0]
        assert.equal(item1.unitPrice, 40, `Item 1 Price should be 40, got ${item1.unitPrice}`)
        console.log(`✅ Item 1 (Linear + Primer) verified: 40 €`)

        // Item 2: Special Piece (15) * 2 = 30
        const item2 = note.items[1]
        assert.equal(item2.unitPrice, 30, `Item 2 Price should be 30, got ${item2.unitPrice}`)
        console.log(`✅ Item 2 (Special Piece + Primer) verified: 30 €`)

        console.log('🎉 ALL TESTS PASSED')

    } catch (error) {
        console.error('❌ Verification Failed:', error)
        process.exit(1)
    }
}

run()
