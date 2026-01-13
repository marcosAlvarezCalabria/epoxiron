/**
 * 🔴 RED PHASE: Tests for deliveryNotesStorage
 *
 * These tests define how the in-memory storage for delivery notes should behave.
 * Following TDD - write tests FIRST, then implement to make them pass.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import type { DeliveryNote } from '../../types/deliveryNote'
import * as deliveryNotesStorage from '../deliveryNotesStorage'

describe('deliveryNotesStorage', () => {
  // Helper to create test delivery notes
  const createTestDeliveryNote = (overrides: Partial<DeliveryNote> = {}): DeliveryNote => {
    const now = new Date('2026-01-12T10:00:00.000Z')
    return {
      id: 'dn-123',
      customerId: 'customer-456',
      customerName: 'Test Customer',
      date: new Date('2026-01-12T00:00:00.000Z'),
      status: 'draft',
      items: [
        {
          id: 'item-1',
          description: 'Test Item',
          color: 'RAL9016',
          measurements: {
            linearMeters: 10,
            squareMeters: undefined,
            thickness: 2
          },
          quantity: 5,
          unitPrice: 155.00,
          totalPrice: 775.00
        }
      ],
      totalAmount: 775.00,
      notes: 'Test notes',
      createdAt: now,
      updatedAt: now,
      ...overrides
    }
  }

  beforeEach(() => {
    // Given: Clean storage before each test
    deliveryNotesStorage.clearAll()
  })

  describe('findAll()', () => {
    it('should return empty array when no delivery notes exist', () => {
      // Given: Empty storage
      // When: Request all delivery notes
      const result = deliveryNotesStorage.findAll()
      // Then: Should get empty array
      expect(result).toEqual([])
    })

    it('should return all created delivery notes', () => {
      // Given: Multiple delivery notes
      const dn1 = createTestDeliveryNote({ id: 'dn-1', customerId: 'c1' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2', customerId: 'c2' })
      deliveryNotesStorage.create(dn1)
      deliveryNotesStorage.create(dn2)

      // When: Request all delivery notes
      const result = deliveryNotesStorage.findAll()

      // Then: Should return both delivery notes
      expect(result).toHaveLength(2)
      expect(result).toContainEqual(dn1)
      expect(result).toContainEqual(dn2)
    })

    it('should return delivery notes sorted by date descending (newest first)', () => {
      // Given: Delivery notes created on different dates
      const oldDN = createTestDeliveryNote({
        id: 'dn-old',
        date: new Date('2026-01-01T00:00:00.000Z')
      })
      const newDN = createTestDeliveryNote({
        id: 'dn-new',
        date: new Date('2026-01-15T00:00:00.000Z')
      })
      const middleDN = createTestDeliveryNote({
        id: 'dn-middle',
        date: new Date('2026-01-10T00:00:00.000Z')
      })

      // When: Create in random order
      deliveryNotesStorage.create(oldDN)
      deliveryNotesStorage.create(newDN)
      deliveryNotesStorage.create(middleDN)

      const result = deliveryNotesStorage.findAll()

      // Then: Should be sorted newest first
      expect(result[0].id).toBe('dn-new')
      expect(result[1].id).toBe('dn-middle')
      expect(result[2].id).toBe('dn-old')
    })

    it('should handle delivery notes with multiple items', () => {
      // Given: Delivery note with multiple items
      const dn = createTestDeliveryNote({
        items: [
          {
            id: 'item-1',
            description: 'Item 1',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 5,
            unitPrice: 100,
            totalPrice: 500
          },
          {
            id: 'item-2',
            description: 'Item 2',
            color: 'RAL7016',
            measurements: { squareMeters: 20 },
            quantity: 3,
            unitPrice: 200,
            totalPrice: 600
          }
        ],
        totalAmount: 1100
      })
      deliveryNotesStorage.create(dn)

      // When: Retrieve all
      const result = deliveryNotesStorage.findAll()

      // Then: Should include all items
      expect(result[0].items).toHaveLength(2)
      expect(result[0].totalAmount).toBe(1100)
    })

    it('should handle delivery notes without notes field', () => {
      // Given: Delivery note without notes
      const dn = createTestDeliveryNote({ notes: undefined })
      deliveryNotesStorage.create(dn)

      // When: Retrieve all
      const result = deliveryNotesStorage.findAll()

      // Then: Should have undefined notes
      expect(result[0].notes).toBeUndefined()
    })
  })

  describe('findById()', () => {
    it('should return delivery note when ID exists', () => {
      // Given: Existing delivery note
      const dn = createTestDeliveryNote({ id: 'dn-123' })
      deliveryNotesStorage.create(dn)

      // When: Search by ID
      const result = deliveryNotesStorage.findById('dn-123')

      // Then: Should find the delivery note
      expect(result).toEqual(dn)
    })

    it('should return undefined when ID does not exist', () => {
      // Given: Empty storage
      // When: Search for non-existent ID
      const result = deliveryNotesStorage.findById('non-existent')

      // Then: Should return undefined
      expect(result).toBeUndefined()
    })

    it('should find correct delivery note among multiple', () => {
      // Given: Multiple delivery notes
      const dn1 = createTestDeliveryNote({ id: 'dn-1' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2' })
      const dn3 = createTestDeliveryNote({ id: 'dn-3' })
      deliveryNotesStorage.create(dn1)
      deliveryNotesStorage.create(dn2)
      deliveryNotesStorage.create(dn3)

      // When: Search for specific ID
      const result = deliveryNotesStorage.findById('dn-2')

      // Then: Should find only the matching delivery note
      expect(result).toEqual(dn2)
      expect(result?.id).toBe('dn-2')
    })
  })

  describe('findByCustomerId()', () => {
    it('should return empty array when no delivery notes for customer', () => {
      // Given: Delivery notes for different customers
      const dn = createTestDeliveryNote({ customerId: 'customer-1' })
      deliveryNotesStorage.create(dn)

      // When: Search for different customer
      const result = deliveryNotesStorage.findByCustomerId('customer-999')

      // Then: Should return empty array
      expect(result).toEqual([])
    })

    it('should return all delivery notes for specific customer', () => {
      // Given: Delivery notes for multiple customers
      const dn1 = createTestDeliveryNote({ id: 'dn-1', customerId: 'customer-1' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2', customerId: 'customer-2' })
      const dn3 = createTestDeliveryNote({ id: 'dn-3', customerId: 'customer-1' })
      deliveryNotesStorage.create(dn1)
      deliveryNotesStorage.create(dn2)
      deliveryNotesStorage.create(dn3)

      // When: Search for customer-1
      const result = deliveryNotesStorage.findByCustomerId('customer-1')

      // Then: Should return only customer-1's delivery notes
      expect(result).toHaveLength(2)
      expect(result.every(dn => dn.customerId === 'customer-1')).toBe(true)
      expect(result.map(dn => dn.id)).toContain('dn-1')
      expect(result.map(dn => dn.id)).toContain('dn-3')
    })

    it('should return customer delivery notes sorted by date descending', () => {
      // Given: Multiple delivery notes for same customer with different dates
      const oldDN = createTestDeliveryNote({
        id: 'dn-old',
        customerId: 'customer-1',
        date: new Date('2026-01-01T00:00:00.000Z')
      })
      const newDN = createTestDeliveryNote({
        id: 'dn-new',
        customerId: 'customer-1',
        date: new Date('2026-01-15T00:00:00.000Z')
      })
      deliveryNotesStorage.create(oldDN)
      deliveryNotesStorage.create(newDN)

      // When: Search for customer
      const result = deliveryNotesStorage.findByCustomerId('customer-1')

      // Then: Should be sorted newest first
      expect(result[0].id).toBe('dn-new')
      expect(result[1].id).toBe('dn-old')
    })
  })

  describe('findByStatus()', () => {
    it('should return empty array when no delivery notes with status', () => {
      // Given: Delivery notes with different statuses
      const dn = createTestDeliveryNote({ status: 'draft' })
      deliveryNotesStorage.create(dn)

      // When: Search for different status
      const result = deliveryNotesStorage.findByStatus('reviewed')

      // Then: Should return empty array
      expect(result).toEqual([])
    })

    it('should return all delivery notes with specific status', () => {
      // Given: Delivery notes with different statuses
      const dn1 = createTestDeliveryNote({ id: 'dn-1', status: 'draft' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2', status: 'pending' })
      const dn3 = createTestDeliveryNote({ id: 'dn-3', status: 'draft' })
      const dn4 = createTestDeliveryNote({ id: 'dn-4', status: 'reviewed' })
      deliveryNotesStorage.create(dn1)
      deliveryNotesStorage.create(dn2)
      deliveryNotesStorage.create(dn3)
      deliveryNotesStorage.create(dn4)

      // When: Search for 'draft' status
      const result = deliveryNotesStorage.findByStatus('draft')

      // Then: Should return only draft delivery notes
      expect(result).toHaveLength(2)
      expect(result.every(dn => dn.status === 'draft')).toBe(true)
      expect(result.map(dn => dn.id)).toContain('dn-1')
      expect(result.map(dn => dn.id)).toContain('dn-3')
    })

    it('should return delivery notes sorted by date descending', () => {
      // Given: Multiple delivery notes with same status
      const oldDN = createTestDeliveryNote({
        id: 'dn-old',
        status: 'pending',
        date: new Date('2026-01-01T00:00:00.000Z')
      })
      const newDN = createTestDeliveryNote({
        id: 'dn-new',
        status: 'pending',
        date: new Date('2026-01-15T00:00:00.000Z')
      })
      deliveryNotesStorage.create(oldDN)
      deliveryNotesStorage.create(newDN)

      // When: Search by status
      const result = deliveryNotesStorage.findByStatus('pending')

      // Then: Should be sorted newest first
      expect(result[0].id).toBe('dn-new')
      expect(result[1].id).toBe('dn-old')
    })

    it('should work with all valid statuses', () => {
      // Given: Delivery notes with all statuses
      const draft = createTestDeliveryNote({ id: 'dn-draft', status: 'draft' })
      const pending = createTestDeliveryNote({ id: 'dn-pending', status: 'pending' })
      const reviewed = createTestDeliveryNote({ id: 'dn-reviewed', status: 'reviewed' })
      deliveryNotesStorage.create(draft)
      deliveryNotesStorage.create(pending)
      deliveryNotesStorage.create(reviewed)

      // When/Then: Each status should be findable
      expect(deliveryNotesStorage.findByStatus('draft')).toHaveLength(1)
      expect(deliveryNotesStorage.findByStatus('pending')).toHaveLength(1)
      expect(deliveryNotesStorage.findByStatus('reviewed')).toHaveLength(1)
    })
  })

  describe('create()', () => {
    it('should create and store a new delivery note', () => {
      // Given: New delivery note
      const dn = createTestDeliveryNote()

      // When: Create delivery note
      const result = deliveryNotesStorage.create(dn)

      // Then: Should return the created delivery note
      expect(result).toEqual(dn)
      // And: Should be stored
      expect(deliveryNotesStorage.findById(dn.id)).toEqual(dn)
    })

    it('should preserve all delivery note properties', () => {
      // Given: Delivery note with all properties
      const dn = createTestDeliveryNote({
        id: 'dn-full',
        customerId: 'customer-123',
        customerName: 'Full Customer',
        date: new Date('2026-01-12T00:00:00.000Z'),
        status: 'pending',
        items: [
          {
            id: 'item-1',
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 15, thickness: 3 },
            quantity: 10,
            unitPrice: 150,
            totalPrice: 1500
          }
        ],
        totalAmount: 1500,
        notes: 'Important notes',
        createdAt: new Date('2026-01-12T10:00:00.000Z'),
        updatedAt: new Date('2026-01-12T10:00:00.000Z')
      })

      // When: Create
      deliveryNotesStorage.create(dn)
      const result = deliveryNotesStorage.findById('dn-full')

      // Then: All properties should be preserved
      expect(result).toEqual(dn)
      expect(result?.customerId).toBe('customer-123')
      expect(result?.customerName).toBe('Full Customer')
      expect(result?.status).toBe('pending')
      expect(result?.items).toHaveLength(1)
      expect(result?.totalAmount).toBe(1500)
      expect(result?.notes).toBe('Important notes')
    })

    it('should handle delivery note without optional notes', () => {
      // Given: Delivery note without notes
      const dn = createTestDeliveryNote({ notes: undefined })

      // When: Create
      const result = deliveryNotesStorage.create(dn)

      // Then: Should create without notes field
      expect(result.notes).toBeUndefined()
    })
  })

  describe('update()', () => {
    it('should update existing delivery note', () => {
      // Given: Existing delivery note
      const dn = createTestDeliveryNote({ id: 'dn-123', status: 'draft' })
      deliveryNotesStorage.create(dn)

      // When: Update status
      const result = deliveryNotesStorage.update('dn-123', { status: 'pending' })

      // Then: Should update and return updated delivery note
      expect(result).toBeDefined()
      expect(result?.status).toBe('pending')
      // And: Should update updatedAt
      expect(result?.updatedAt).not.toEqual(dn.updatedAt)
      // And: Should persist the update
      const stored = deliveryNotesStorage.findById('dn-123')
      expect(stored?.status).toBe('pending')
    })

    it('should return undefined when delivery note does not exist', () => {
      // Given: Empty storage
      // When: Try to update non-existent delivery note
      const result = deliveryNotesStorage.update('non-existent', { status: 'pending' })

      // Then: Should return undefined
      expect(result).toBeUndefined()
    })

    it('should allow partial updates', () => {
      // Given: Existing delivery note
      const dn = createTestDeliveryNote({
        id: 'dn-123',
        status: 'draft',
        notes: 'Original notes',
        totalAmount: 1000
      })
      deliveryNotesStorage.create(dn)

      // When: Update only notes
      const result = deliveryNotesStorage.update('dn-123', {
        notes: 'Updated notes'
      })

      // Then: Should update only notes, preserve other fields
      expect(result?.notes).toBe('Updated notes')
      expect(result?.status).toBe('draft')
      expect(result?.totalAmount).toBe(1000)
      expect(result?.id).toBe('dn-123')
    })

    it('should update items array', () => {
      // Given: Existing delivery note
      const dn = createTestDeliveryNote({ id: 'dn-123' })
      deliveryNotesStorage.create(dn)

      const newItems = [
        {
          id: 'item-new',
          description: 'New Item',
          color: 'RAL7016',
          measurements: { squareMeters: 50 },
          quantity: 2,
          unitPrice: 500,
          totalPrice: 1000
        }
      ]

      // When: Update items
      const result = deliveryNotesStorage.update('dn-123', {
        items: newItems,
        totalAmount: 1000
      })

      // Then: Should update items
      expect(result?.items).toEqual(newItems)
      expect(result?.totalAmount).toBe(1000)
    })

    it('should not affect other delivery notes', () => {
      // Given: Multiple delivery notes
      const dn1 = createTestDeliveryNote({ id: 'dn-1', status: 'draft' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2', status: 'draft' })
      deliveryNotesStorage.create(dn1)
      deliveryNotesStorage.create(dn2)

      // When: Update only dn-1
      deliveryNotesStorage.update('dn-1', { status: 'pending' })

      // Then: dn-2 should remain unchanged
      const dn2Result = deliveryNotesStorage.findById('dn-2')
      expect(dn2Result?.status).toBe('draft')
    })
  })

  describe('remove()', () => {
    it('should remove existing delivery note', () => {
      // Given: Existing delivery note
      const dn = createTestDeliveryNote({ id: 'dn-123' })
      deliveryNotesStorage.create(dn)

      // When: Remove delivery note
      const result = deliveryNotesStorage.remove('dn-123')

      // Then: Should return true
      expect(result).toBe(true)
      // And: Should no longer exist in storage
      expect(deliveryNotesStorage.findById('dn-123')).toBeUndefined()
    })

    it('should return false when delivery note does not exist', () => {
      // Given: Empty storage
      // When: Try to remove non-existent delivery note
      const result = deliveryNotesStorage.remove('non-existent')

      // Then: Should return false
      expect(result).toBe(false)
    })

    it('should not affect other delivery notes', () => {
      // Given: Multiple delivery notes
      const dn1 = createTestDeliveryNote({ id: 'dn-1' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2' })
      const dn3 = createTestDeliveryNote({ id: 'dn-3' })
      deliveryNotesStorage.create(dn1)
      deliveryNotesStorage.create(dn2)
      deliveryNotesStorage.create(dn3)

      // When: Remove only dn-2
      deliveryNotesStorage.remove('dn-2')

      // Then: Other delivery notes should still exist
      expect(deliveryNotesStorage.findById('dn-1')).toEqual(dn1)
      expect(deliveryNotesStorage.findById('dn-3')).toEqual(dn3)
      // And: Removed delivery note should not exist
      expect(deliveryNotesStorage.findById('dn-2')).toBeUndefined()
      // And: Total count should be 2
      expect(deliveryNotesStorage.findAll()).toHaveLength(2)
    })
  })

  describe('clearAll()', () => {
    it('should remove all delivery notes', () => {
      // Given: Multiple delivery notes
      const dn1 = createTestDeliveryNote({ id: 'dn-1' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2' })
      const dn3 = createTestDeliveryNote({ id: 'dn-3' })
      deliveryNotesStorage.create(dn1)
      deliveryNotesStorage.create(dn2)
      deliveryNotesStorage.create(dn3)

      // When: Clear all
      deliveryNotesStorage.clearAll()

      // Then: Storage should be empty
      expect(deliveryNotesStorage.findAll()).toEqual([])
      expect(deliveryNotesStorage.findById('dn-1')).toBeUndefined()
      expect(deliveryNotesStorage.findById('dn-2')).toBeUndefined()
      expect(deliveryNotesStorage.findById('dn-3')).toBeUndefined()
    })

    it('should work when storage is already empty', () => {
      // Given: Empty storage
      // When: Clear all
      deliveryNotesStorage.clearAll()

      // Then: Should still be empty, no errors
      expect(deliveryNotesStorage.findAll()).toEqual([])
    })
  })
})
