import { PrismaClient } from '../../generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

/**
 * 🔌 PRISMA CLIENT SINGLETON
 * 
 * We use a singleton pattern (one instance for the whole app)
 * to avoid opening too many connections to the database.
 * 
 * We also use the PrismaPg adapter for better performance.
 */

// 1. Create connection pool
const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })

// 2. Create adapter
const adapter = new PrismaPg(pool)

// 3. Create Prisma Client instance
export const prisma = new PrismaClient({ adapter })
