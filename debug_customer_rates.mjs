
const API_URL = 'http://localhost:3000/api'

async function run() {
    try {
        console.log('🔍 Debugging Customer Rates...')

        // 1. Auth Login
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@epoxiron.com', password: '123456' })
        })

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`)
        const loginData = await loginRes.json()
        const token = loginData.token

        // 2. List Customers
        const res = await fetch(`${API_URL}/customers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const customers = await res.json()

        console.log(`Found ${customers.length} customers.`)

        customers.forEach(c => {
            console.log(`\nCUSTOMER: ${c.name} (ID: ${c.id})`)
            console.log(`- Linear: ${c.pricePerLinearMeter}`)
            console.log(`- Square: ${c.pricePerSquareMeter}`)
            console.log(`- Min: ${c.minimumRate}`)
            console.log(`- Special Pieces: ${c.specialPieces?.length || 0}`)
        })

    } catch (error) {
        console.error('❌ Error:', error)
    }
}

run()
