/**
 * STORAGE: DeliveryNotes
 *
 * In-memory storage for delivery notes (temporary solution).
 * Will be migrated to a database in the future.
 *
 * Location: Backend - Storage (Infrastructure Layer)
 * Reason: Data persistence abstraction
 */

import type { DeliveryNote } from '../types/deliveryNote'

// 📦 In-memory storage
let deliveryNotes: DeliveryNote[] = []

/**
 * 📋 GET ALL DELIVERY NOTES
 * Returns all delivery notes sorted by date (newest first)
 */
export function findAll(): DeliveryNote[] {
  return deliveryNotes.sort((a, b) =>
    b.date.getTime() - a.date.getTime()
  )
}

/**
 * 🔍 FIND DELIVERY NOTE BY ID
 * @param id - Delivery note ID
 * @returns Found delivery note or undefined
 */
export function findById(id: string): DeliveryNote | undefined {
  return deliveryNotes.find(dn => dn.id === id)
}

/**
 * 🔍 FIND DELIVERY NOTES BY CUSTOMER ID
 * @param customerId - Customer ID to filter by
 * @returns Delivery notes for this customer, sorted by date (newest first)
 */
export function findByCustomerId(customerId: string): DeliveryNote[] {
  return deliveryNotes
    .filter(dn => dn.customerId === customerId)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

/**
 * 🔍 FIND DELIVERY NOTES BY STATUS
 * @param status - Status to filter by ('draft' | 'pending' | 'reviewed')
 * @returns Delivery notes with this status, sorted by date (newest first)
 */
export function findByStatus(status: DeliveryNote['status']): DeliveryNote[] {
  return deliveryNotes
    .filter(dn => dn.status === status)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

/**
 * ➕ CREATE NEW DELIVERY NOTE
 * @param deliveryNote - Delivery note to save
 * @returns The saved delivery note
 */
export function create(deliveryNote: DeliveryNote): DeliveryNote {
  deliveryNotes.push(deliveryNote)
  return deliveryNote
}

/**
 * ✏️ UPDATE EXISTING DELIVERY NOTE
 * @param id - Delivery note ID to update
 * @param data - Partial data to update
 * @returns Updated delivery note or undefined if not found
 */
export function update(id: string, data: Partial<DeliveryNote>): DeliveryNote | undefined {
  const index = deliveryNotes.findIndex(dn => dn.id === id)

  if (index === -1) {
    return undefined
  }

  deliveryNotes[index] = {
    ...deliveryNotes[index],
    ...data,
    updatedAt: new Date()
  }

  return deliveryNotes[index]
}

/**
 * 🗑️ DELETE DELIVERY NOTE
 * @param id - Delivery note ID to delete
 * @returns true if deleted, false if not found
 */
export function remove(id: string): boolean {
  const initialLength = deliveryNotes.length
  deliveryNotes = deliveryNotes.filter(dn => dn.id !== id)
  return deliveryNotes.length < initialLength
}

/**
 * 🧹 CLEAR ALL DELIVERY NOTES
 * (Useful for testing)
 */
export function clearAll(): void {
  deliveryNotes = []
}

/**
 * 🔢 GENERATE NEXT DELIVERY NOTE NUMBER
 * Generates a sequential number like ALB-1, ALB-2, etc.
 */
export function getNextNumber(): string {
  const currentYear = new Date().getFullYear()
  const notesThisYear = deliveryNotes.filter(note => {
    const noteYear = note.date.getFullYear()
    return noteYear === currentYear
  })

  const nextNumber = notesThisYear.length + 1
  return `ALB-${currentYear}-${nextNumber.toString().padStart(3, '0')}`
}
