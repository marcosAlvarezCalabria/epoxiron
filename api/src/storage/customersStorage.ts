

// 📝 WHAT: Database storage for customers using Prisma
// 🎯 WHY: Persistent storage instead of in-memory array

import { Customer as DomainCustomer } from '../types/customer'
import { prisma } from '../prisma'

/**
 * 🔄 MAPPER: Helper to convert Prisma DB result to Domain Model
 */
function toDomain(dbCustomer: any): DomainCustomer {
  return {
    ...dbCustomer,
    // Map specialPrices (DB) -> specialPieces (Domain)
    specialPieces: dbCustomer.specialPrices?.map((sp: any) => ({
      name: sp.name,
      price: sp.price
    })) || []
  }
}

/**
 * 📋 LIST ALL
 */
export async function findAll(): Promise<DomainCustomer[]> {
  const customers = await prisma.customer.findMany({
    include: {
      specialPrices: true
    }
  })

  return customers.map(toDomain)
}

/**
 * 🔍 FIND ONE BY ID
 */
export async function findById(id: string): Promise<DomainCustomer | undefined> {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { specialPrices: true }
  })

  if (!customer) return undefined
  return toDomain(customer)
}

/**
 * ➕ CREATE NEW
 */
export async function create(customer: DomainCustomer): Promise<DomainCustomer> {
  const { specialPieces, ...customerData } = customer

  // Remove ID if present to let DB generate it, or use it if we want to enforce it
  // Usually clean architectures separate CreateRequest from DomainEntity, but here we reuse

  const newCustomer = await prisma.customer.create({
    data: {
      id: customerData.id,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      pricePerLinearMeter: customerData.pricePerLinearMeter,
      pricePerSquareMeter: customerData.pricePerSquareMeter,
      minimumRate: customerData.minimumRate,
      createdAt: customerData.createdAt,
      updatedAt: customerData.updatedAt,

      // Map SpecialPiece[] to Prisma create structure
      specialPrices: {
        create: specialPieces?.map(sp => ({
          name: sp.name,
          price: sp.price
        }))
      }
    },
    include: { specialPrices: true }
  })

  return toDomain(newCustomer)
}

/**
 * ✏️ UPDATE
 */
export async function update(id: string, updates: Partial<DomainCustomer>): Promise<DomainCustomer | undefined> {
  const { specialPieces, ...dataToUpdate } = updates

  // Clean undefined fields to avoid overwriting with null/undefined if Prisma behaves oddly (though usually it ignores undefined)
  // Warning: We are using "Partial<DomainCustomer>", so we need to be careful with types compatible with Prisma UpdateInput

  if (specialPieces) {
    const result = await prisma.$transaction(async (tx) => {
      await tx.customer.update({
        where: { id },
        data: {
          name: dataToUpdate.name,
          email: dataToUpdate.email,
          phone: dataToUpdate.phone,
          pricePerLinearMeter: dataToUpdate.pricePerLinearMeter,
          pricePerSquareMeter: dataToUpdate.pricePerSquareMeter,
          minimumRate: dataToUpdate.minimumRate,
        }
      })

      await tx.specialPrice.deleteMany({ where: { customerId: id } })
      await tx.specialPrice.createMany({
        data: specialPieces.map(sp => ({
          name: sp.name,
          price: sp.price,
          customerId: id
        }))
      })

      return tx.customer.findUnique({ where: { id }, include: { specialPrices: true } })
    })

    if (!result) return undefined
    return toDomain(result)
  } else {
    const updated = await prisma.customer.update({
      where: { id },
      data: {
        name: dataToUpdate.name,
        email: dataToUpdate.email,
        phone: dataToUpdate.phone,
        pricePerLinearMeter: dataToUpdate.pricePerLinearMeter,
        pricePerSquareMeter: dataToUpdate.pricePerSquareMeter,
        minimumRate: dataToUpdate.minimumRate,
      },
      include: { specialPrices: true }
    })
    return toDomain(updated)
  }
}

/**
 * 🗑️ DELETE
 */
export async function deleteById(id: string): Promise<boolean> {
  try {
    await prisma.customer.delete({ where: { id } })
    return true
  } catch (error) {
    return false
  }
}

/**
 * 🧹 CLEAR ALL (For tests)
 */
export async function clearAll(): Promise<void> {
  await prisma.customer.deleteMany()
}
