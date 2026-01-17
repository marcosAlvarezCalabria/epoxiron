/**
 * CONTROLLER: DeliveryNote
 *
 * Handles CRUD operations for delivery notes.
 * Includes price calculation logic based on customer rates.
 *
 * Location: Backend - Controllers (Application Layer)
 * Reason: HTTP request handling and business logic orchestration
 */

import { Request, Response } from 'express'
import { nanoid } from 'nanoid'
import type {
  DeliveryNote,
  DeliveryNoteItem,
  CreateDeliveryNoteRequest
} from '../types/deliveryNote'
import * as deliveryNotesStorage from '../storage/deliveryNotesStorage'
import * as customersStorage from '../storage/customersStorage'

/**
 * 📋 LIST ALL DELIVERY NOTES
 * GET /api/delivery-notes
 *
 * Query params:
 * - customerId: Filter by customer
 * - status: Filter by status (draft, pending, reviewed)
 */
export async function listDeliveryNotes(req: Request, res: Response) {
  try {
    const { customerId, status } = req.query

    let notes: DeliveryNote[]

    if (customerId) {
      notes = deliveryNotesStorage.findByCustomerId(customerId as string)
    } else if (status) {
      notes = deliveryNotesStorage.findByStatus(status as DeliveryNote['status'])
    } else {
      notes = deliveryNotesStorage.findAll()
    }

    return res.json(notes)
  } catch (error) {
    console.error('Error fetching delivery notes:', error)
    return res.status(500).json({ error: 'Error fetching delivery notes' })
  }
}

/**
 * 🔍 GET ONE DELIVERY NOTE BY ID
 * GET /api/delivery-notes/:id
 */
export async function getDeliveryNote(req: Request, res: Response) {
  try {
    const { id } = req.params
    const note = deliveryNotesStorage.findById(id)

    if (!note) {
      return res.status(404).json({ error: 'Delivery note not found' })
    }

    return res.json(note)
  } catch (error) {
    console.error('Error fetching delivery note:', error)
    return res.status(500).json({ error: 'Error fetching delivery note' })
  }
}

/**
 * ➕ CREATE NEW DELIVERY NOTE
 * POST /api/delivery-notes
 *
 * Business Logic:
 * 1. Validate customer exists
 * 2. Get customer's rate if available
 * 3. Calculate prices for each item based on measurements and rate
 * 4. Apply minimum rate if calculated price is lower
 * 5. Calculate total amount from all items
 */
export async function createDeliveryNote(req: Request, res: Response) {
  try {
    const data: CreateDeliveryNoteRequest = req.body

    // 1. Validate customer exists
    const customer = customersStorage.findById(data.customerId)
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    // 2. Get pricing (now embedded in customer)
    // We treat the customer itself as the rate provider
    const rate = customer

    // 3. Calculate prices for each item
    const itemsWithPrices: DeliveryNoteItem[] = data.items.map(item => {
      let unitPrice = 0

      if (rate) {
        // 1. Check for special pieces FIRST (doesn't require measurements)
        const specialPiece = rate.specialPieces?.find(p =>
          (item.name && p.name.toLowerCase() === item.name.toLowerCase()) ||
          (item.description && p.name.toLowerCase() === item.description.toLowerCase())
        )

        if (specialPiece) {
          unitPrice = specialPiece.price
        } else if (item.measurements) {
          // 2. Fallback to measurements calculation
          if (item.measurements.linearMeters) {
            unitPrice = rate.pricePerLinearMeter * item.measurements.linearMeters
          } else if (item.measurements.squareMeters) {
            unitPrice = rate.pricePerSquareMeter * item.measurements.squareMeters
          }

          // Apply minimum rate if calculated price is lower (and not 0)
          if (unitPrice > 0 && unitPrice < rate.minimumRate) {
            unitPrice = rate.minimumRate
          }
        }

        // Apply Primer multiplier (Double price)
        if (item.hasPrimer) {
          unitPrice *= 2
        }
      }

      return {
        ...item,
        id: nanoid(),
        unitPrice,
        totalPrice: unitPrice * item.quantity
      }
    })

    // 4. Calculate total amount
    const totalAmount = itemsWithPrices.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    )

    // 5. Create delivery note
    const newNote: DeliveryNote = {
      id: nanoid(),
      number: deliveryNotesStorage.getNextNumber(), // Sequential number like ALB-2026-001
      customerId: data.customerId,
      customerName: customer.name,
      date: data.date ? new Date(data.date) : new Date(), // Convert string to Date
      status: 'draft',
      items: itemsWithPrices,
      totalAmount,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const created = deliveryNotesStorage.create(newNote)
    return res.status(201).json(created)
  } catch (error) {
    console.error('Error creating delivery note:', error)
    return res.status(500).json({ error: 'Error creating delivery note' })
  }
}

/**
 * ✏️ UPDATE EXISTING DELIVERY NOTE
 * PUT /api/delivery-notes/:id
 */
export async function updateDeliveryNote(req: Request, res: Response) {
  try {
    const { id } = req.params
    const data = req.body

    const note = deliveryNotesStorage.findById(id)
    if (!note) {
      return res.status(404).json({ error: 'Delivery note not found' })
    }

    // Ensure date is a Date object if present
    if (data.date) {
      data.date = new Date(data.date)
    }

    const updated = deliveryNotesStorage.update(id, data)
    return res.json(updated)
  } catch (error) {
    console.error('Error updating delivery note:', error)
    return res.status(500).json({ error: 'Error updating delivery note' })
  }
}

/**
 * 🗑️ DELETE DELIVERY NOTE
 * DELETE /api/delivery-notes/:id
 *
 * Business Rule: Can only delete if status is 'draft'
 */
export async function deleteDeliveryNote(req: Request, res: Response) {
  try {
    const { id } = req.params

    const note = deliveryNotesStorage.findById(id)
    if (!note) {
      return res.status(404).json({ error: 'Delivery note not found' })
    }

    // Only allow deleting drafts
    if (note.status !== 'draft') {
      return res.status(400).json({
        error: 'Can only delete draft delivery notes'
      })
    }

    const deleted = deliveryNotesStorage.remove(id)
    if (!deleted) {
      return res.status(500).json({ error: 'Error deleting delivery note' })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting delivery note:', error)
    return res.status(500).json({ error: 'Error deleting delivery note' })
  }
}

/**
 * 🔄 UPDATE DELIVERY NOTE STATUS
 * PATCH /api/delivery-notes/:id/status
 *
 * Updates only the status field
 */
export async function updateDeliveryNoteStatus(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['draft', 'validated', 'finalized']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const updated = deliveryNotesStorage.update(id, { status })
    if (!updated) {
      return res.status(404).json({ error: 'Delivery note not found' })
    }

    return res.json(updated)
  } catch (error) {
    console.error('Error updating status:', error)
    return res.status(500).json({ error: 'Error updating status' })
  }
}
