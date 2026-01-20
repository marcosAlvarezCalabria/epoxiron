

// 📝 WHAT: Database storage for delivery notes
// 🎯 WHY: Persistent storage

import type { DeliveryNote as DomainDeliveryNote } from '../types/deliveryNote'
import { prisma } from '../prisma'

/**
 * � MAPPER: Helper to convert Prisma DB result to Domain Model
 */
function toDomain(dbNote: any): DomainDeliveryNote {
  return {
    ...dbNote,
    status: dbNote.status.toLowerCase(), // Prisma Enum is likely UPPERCASE (DRAFT), Domain is 'draft'
    items: dbNote.items?.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      hasPrimer: item.hasPrimer,
      measurements: {
        linearMeters: item.linearMeters,
        squareMeters: item.squareMeters,
        thickness: item.thickness
      }
    })) || []
  }
}

/**
 * �📋 GET ALL DELIVERY NOTES
 */
export async function findAll(): Promise<DomainDeliveryNote[]> {
  const notes = await prisma.deliveryNote.findMany({
    include: { items: true },
    orderBy: [
      { date: 'desc' },
      { createdAt: 'desc' }
    ]
  })
  return notes.map(toDomain)
}

/**
 * 🔍 FIND DELIVERY NOTE BY ID
 */
export async function findById(id: string): Promise<DomainDeliveryNote | undefined> {
  const note = await prisma.deliveryNote.findUnique({
    where: { id },
    include: { items: true }
  })

  if (!note) return undefined
  return toDomain(note)
}

/**
 * 🔍 FIND DELIVERY NOTES BY CUSTOMER ID
 */
export async function findByCustomerId(customerId: string): Promise<DomainDeliveryNote[]> {
  const notes = await prisma.deliveryNote.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { date: 'desc' }
  })
  return notes.map(toDomain)
}

/**
 * 🔍 FIND DELIVERY NOTES BY STATUS
 */
export async function findByStatus(status: DomainDeliveryNote['status']): Promise<DomainDeliveryNote[]> {
  // Map domain status (lowercase) to Prisma Enum (uppercase)
  // e.g. 'draft' -> 'DRAFT'
  const prismaStatus = status.toUpperCase() as any

  const notes = await prisma.deliveryNote.findMany({
    where: { status: prismaStatus },
    include: { items: true },
    orderBy: { date: 'desc' }
  })
  return notes.map(toDomain)
}

/**
 * ➕ CREATE NEW DELIVERY NOTE
 */
export async function create(deliveryNote: DomainDeliveryNote): Promise<DomainDeliveryNote> {
  const { items, ...noteData } = deliveryNote

  // Map domain status to Prisma Enum
  const prismaStatus = (noteData.status?.toUpperCase() || 'DRAFT') as any

  const newNote = await prisma.deliveryNote.create({
    data: {
      id: noteData.id,
      customerId: noteData.customerId,
      customerName: noteData.customerName,
      number: noteData.number,
      date: noteData.date,
      totalAmount: noteData.totalAmount || 0,
      notes: noteData.notes,

      status: prismaStatus,
      items: {
        create: items.map(item => ({
          name: item.name,
          description: item.description,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          hasPrimer: item.hasPrimer,
          linearMeters: item.measurements?.linearMeters,
          squareMeters: item.measurements?.squareMeters,
          thickness: item.measurements?.thickness
        }))
      }
    },
    include: { items: true }
  })
  return toDomain(newNote)
}

/**
 * ✏️ UPDATE EXISTING DELIVERY NOTE
 */
export async function update(id: string, data: Partial<DomainDeliveryNote>): Promise<DomainDeliveryNote | undefined> {
  const { items, ...noteData } = data

  const updateData: any = { ...noteData }
  if (updateData.status) {
    updateData.status = updateData.status.toUpperCase()
  }

  if (items) {
    const result = await prisma.$transaction(async (tx: any) => {
      await tx.deliveryNote.update({
        where: { id },
        data: {
          customerId: updateData.customerId,
          date: updateData.date,
          status: updateData.status,
          notes: updateData.notes,
          totalAmount: updateData.totalAmount
        }
      })

      await tx.deliveryNoteItem.deleteMany({ where: { deliveryNoteId: id } })
      await tx.deliveryNoteItem.createMany({
        data: items.map(item => ({
          deliveryNoteId: id,
          name: item.name,
          description: item.description,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          hasPrimer: item.hasPrimer,
          linearMeters: item.measurements?.linearMeters,
          squareMeters: item.measurements?.squareMeters,
          thickness: item.measurements?.thickness
        }))
      })

      return tx.deliveryNote.findUnique({ where: { id }, include: { items: true } })
    })

    if (!result) return undefined
    return toDomain(result)
  } else {
    const updated = await prisma.deliveryNote.update({
      where: { id },
      data: {
        customerId: updateData.customerId,
        date: updateData.date,
        status: updateData.status,
        notes: updateData.notes,
        totalAmount: updateData.totalAmount
      },
      include: { items: true }
    })
    return toDomain(updated)
  }
}

/**
 * 🗑️ DELETE DELIVERY NOTE
 */
export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.deliveryNote.delete({ where: { id } })
    return true
  } catch (e) {
    return false
  }
}

/**
 * 🧹 CLEAR ALL DELIVERY NOTES
 */
export async function clearAll(): Promise<void> {
  await prisma.deliveryNote.deleteMany()
}

/**
 * 🔢 GENERATE NEXT DELIVERY NOTE NUMBER
 */
export async function getNextNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()

  // Count using Database for performance and accuracy
  const count = await prisma.deliveryNote.count({
    where: {
      date: {
        gte: new Date(currentYear, 0, 1), // Jan 1st
        lt: new Date(currentYear + 1, 0, 1) // Jan 1st next year
      }
    }
  })

  const nextNumber = count + 1
  const shortYear = currentYear.toString().slice(-2)
  return `ALB-${shortYear}-${nextNumber.toString().padStart(3, '0')}`
}
