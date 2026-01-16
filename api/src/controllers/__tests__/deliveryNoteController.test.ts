

/**
 * 🔴 RED PHASE: Tests for deliveryNoteController
 *
 * These tests define how the delivery note controller should behave.
 * Following TDD - write tests FIRST, then implement to make them pass.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import type { Request, Response } from 'express'
import {
  listDeliveryNotes,
  getDeliveryNote,
  createDeliveryNote,
  updateDeliveryNote,
  deleteDeliveryNote,
  updateDeliveryNoteStatus
} from '../deliveryNoteController'
import * as deliveryNotesStorage from '../../storage/deliveryNotesStorage'
import * as customersStorage from '../../storage/customersStorage'
import { ratesStorage } from '../../storage/ratesStorage'
import type { DeliveryNote, CreateDeliveryNoteRequest } from '../../types/deliveryNote'
import type { Customer } from '../../types/customer'
import type { Rate } from '../../types/rate'

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: () => 'test-id-123'
}))

// Helper to create mock Express request
const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  params: {},
  body: {},
  query: {},
  ...overrides
})

// Helper to create mock Express response
const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis()
  }
  return res
}

// Helper to create test customer
const createTestCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  id: 'customer-123',
  name: 'Test Customer',
  rateId: 'rate-456',
  createdAt: new Date('2026-01-12T10:00:00.000Z'),
  updatedAt: new Date('2026-01-12T10:00:00.000Z'),
  ...overrides
})

// Helper to create test rate
const createTestRate = (overrides: Partial<Rate> = {}): Rate => ({
  id: 'rate-456',
  customerId: 'customer-123',
  ratePerLinearMeter: 15.50,
  ratePerSquareMeter: 25.00,
  minimumRate: 50.00,
  specialPieces: [],
  createdAt: new Date('2026-01-12T10:00:00.000Z'),
  updatedAt: new Date('2026-01-12T10:00:00.000Z'),
  ...overrides
})

// Helper to create test delivery note
const createTestDeliveryNote = (overrides: Partial<DeliveryNote> = {}): DeliveryNote => {
  const now = new Date('2026-01-12T10:00:00.000Z')
  return {
    id: 'dn-123',
    customerId: 'customer-123',
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

describe('deliveryNoteController', () => {
  beforeEach(() => {
    // Given: Clean storage and clear mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('listDeliveryNotes() - GET /api/delivery-notes', () => {
    it('should return 200 with empty array when no delivery notes exist', async () => {
      // Given: Empty storage
      vi.spyOn(deliveryNotesStorage, 'findAll').mockReturnValue([])
      const req = createMockRequest()
      const res = createMockResponse()

      // When: Request all delivery notes
      await listDeliveryNotes(req as Request, res as Response)

      // Then: Should return 200 with empty array
      expect(res.json).toHaveBeenCalledWith([])
      expect(deliveryNotesStorage.findAll).toHaveBeenCalled()
    })

    it('should return 200 with all delivery notes', async () => {
      // Given: Multiple delivery notes
      const dn1 = createTestDeliveryNote({ id: 'dn-1' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2' })
      vi.spyOn(deliveryNotesStorage, 'findAll').mockReturnValue([dn1, dn2])
      const req = createMockRequest()
      const res = createMockResponse()

      // When: Request all delivery notes
      await listDeliveryNotes(req as Request, res as Response)

      // Then: Should return all delivery notes
      expect(res.json).toHaveBeenCalledWith([dn1, dn2])
    })

    it('should filter by customerId when provided', async () => {
      // Given: Query parameter with customerId
      const dn1 = createTestDeliveryNote({ id: 'dn-1', customerId: 'customer-1' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2', customerId: 'customer-1' })
      vi.spyOn(deliveryNotesStorage, 'findByCustomerId').mockReturnValue([dn1, dn2])
      const req = createMockRequest({
        query: { customerId: 'customer-1' }
      })
      const res = createMockResponse()

      // When: Request with customerId filter
      await listDeliveryNotes(req as Request, res as Response)

      // Then: Should call findByCustomerId and return filtered results
      expect(deliveryNotesStorage.findByCustomerId).toHaveBeenCalledWith('customer-1')
      expect(res.json).toHaveBeenCalledWith([dn1, dn2])
    })

    it('should filter by status when provided', async () => {
      // Given: Query parameter with status
      const dn1 = createTestDeliveryNote({ id: 'dn-1', status: 'pending' })
      const dn2 = createTestDeliveryNote({ id: 'dn-2', status: 'pending' })
      vi.spyOn(deliveryNotesStorage, 'findByStatus').mockReturnValue([dn1, dn2])
      const req = createMockRequest({
        query: { status: 'pending' }
      })
      const res = createMockResponse()

      // When: Request with status filter
      await listDeliveryNotes(req as Request, res as Response)

      // Then: Should call findByStatus and return filtered results
      expect(deliveryNotesStorage.findByStatus).toHaveBeenCalledWith('pending')
      expect(res.json).toHaveBeenCalledWith([dn1, dn2])
    })

    it('should prioritize customerId over status when both provided', async () => {
      // Given: Both query parameters
      const dn = createTestDeliveryNote({ customerId: 'customer-1', status: 'pending' })
      vi.spyOn(deliveryNotesStorage, 'findByCustomerId').mockReturnValue([dn])
      vi.spyOn(deliveryNotesStorage, 'findByStatus')
      const req = createMockRequest({
        query: { customerId: 'customer-1', status: 'pending' }
      })
      const res = createMockResponse()

      // When: Request with both filters
      await listDeliveryNotes(req as Request, res as Response)

      // Then: Should use customerId filter only
      expect(deliveryNotesStorage.findByCustomerId).toHaveBeenCalledWith('customer-1')
      expect(deliveryNotesStorage.findByStatus).not.toHaveBeenCalled()
    })

    it('should return 500 on error', async () => {
      // Given: Storage throws error
      vi.spyOn(deliveryNotesStorage, 'findAll').mockImplementation(() => {
        throw new Error('Storage error')
      })
      const req = createMockRequest()
      const res = createMockResponse()

      // When: Request fails
      await listDeliveryNotes(req as Request, res as Response)

      // Then: Should return 500 error
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching delivery notes' })
    })
  })

  describe('getDeliveryNote() - GET /api/delivery-notes/:id', () => {
    it('should return 200 with delivery note when found', async () => {
      // Given: Existing delivery note
      const dn = createTestDeliveryNote({ id: 'dn-123' })
      vi.spyOn(deliveryNotesStorage, 'findById').mockReturnValue(dn)
      const req = createMockRequest({ params: { id: 'dn-123' } })
      const res = createMockResponse()

      // When: Request specific delivery note
      await getDeliveryNote(req as Request, res as Response)

      // Then: Should return the delivery note
      expect(deliveryNotesStorage.findById).toHaveBeenCalledWith('dn-123')
      expect(res.json).toHaveBeenCalledWith(dn)
    })

    it('should return 404 when delivery note not found', async () => {
      // Given: Non-existent delivery note
      vi.spyOn(deliveryNotesStorage, 'findById').mockReturnValue(undefined)
      const req = createMockRequest({ params: { id: 'non-existent' } })
      const res = createMockResponse()

      // When: Request non-existent delivery note
      await getDeliveryNote(req as Request, res as Response)

      // Then: Should return 404
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Delivery note not found' })
    })

    it('should return 500 on error', async () => {
      // Given: Storage throws error
      vi.spyOn(deliveryNotesStorage, 'findById').mockImplementation(() => {
        throw new Error('Storage error')
      })
      const req = createMockRequest({ params: { id: 'dn-123' } })
      const res = createMockResponse()

      // When: Request fails
      await getDeliveryNote(req as Request, res as Response)

      // Then: Should return 500
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching delivery note' })
    })
  })

  describe('createDeliveryNote() - POST /api/delivery-notes', () => {
    it('should create delivery note with linear meters price calculation', async () => {
      // Given: Customer with rate and request with linear meters
      const customer = createTestCustomer({ id: 'customer-123', name: 'Test Customer', rateId: 'rate-456' })
      const rate = createTestRate({ id: 'rate-456', ratePerLinearMeter: 15.50, minimumRate: 50.00 })
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      ratesStorage.clearAll()
      ratesStorage.create(rate)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 10, thickness: 2 },
            quantity: 5
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should calculate price using linearMeters
      expect(deliveryNotesStorage.create).toHaveBeenCalled()
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      // unitPrice = 10 * 15.50 = 155.00
      expect(createdDN.items[0].unitPrice).toBe(155.00)
      // totalPrice = 155.00 * 5 = 775.00
      expect(createdDN.items[0].totalPrice).toBe(775.00)
      expect(createdDN.totalAmount).toBe(775.00)
      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('should create delivery note with square meters price calculation', async () => {
      // Given: Customer with rate and request with square meters
      const customer = createTestCustomer({ rateId: 'rate-456' })
      const rate = createTestRate({ id: 'rate-456', ratePerSquareMeter: 25.00, minimumRate: 50.00 })
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      ratesStorage.clearAll()
      ratesStorage.create(rate)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { squareMeters: 20 },
            quantity: 2
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should calculate price using squareMeters
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      // unitPrice = 20 * 25.00 = 500.00
      expect(createdDN.items[0].unitPrice).toBe(500.00)
      // totalPrice = 500.00 * 2 = 1000.00
      expect(createdDN.items[0].totalPrice).toBe(1000.00)
      expect(createdDN.totalAmount).toBe(1000.00)
    })

    it('should apply minimum rate when calculated price is lower', async () => {
      // Given: Customer with rate and small measurements
      const customer = createTestCustomer({ rateId: 'rate-456' })
      const rate = createTestRate({
        id: 'rate-456',
        ratePerLinearMeter: 15.50,
        minimumRate: 200.00
      })
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      ratesStorage.clearAll()
      ratesStorage.create(rate)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Small Item',
            color: 'RAL9016',
            measurements: { linearMeters: 2 },
            quantity: 1
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should apply minimum rate
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      // Calculated: 2 * 15.50 = 31.00, but minimumRate is 200.00
      expect(createdDN.items[0].unitPrice).toBe(200.00)
      expect(createdDN.items[0].totalPrice).toBe(200.00)
      expect(createdDN.totalAmount).toBe(200.00)
    })

    it('should handle customer without rate (unitPrice = 0)', async () => {
      // Given: Customer without rate
      const customer = createTestCustomer({ rateId: undefined })
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 5
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should set unitPrice to 0
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      expect(createdDN.items[0].unitPrice).toBe(0)
      expect(createdDN.items[0].totalPrice).toBe(0)
      expect(createdDN.totalAmount).toBe(0)
    })

    it('should calculate total amount from multiple items', async () => {
      // Given: Customer with rate and multiple items
      const customer = createTestCustomer({ rateId: 'rate-456' })
      const rate = createTestRate({ id: 'rate-456', ratePerLinearMeter: 10.00, minimumRate: 0 })
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      ratesStorage.clearAll()
      ratesStorage.create(rate)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Item 1',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 2  // 10*10*2 = 200
          },
          {
            description: 'Item 2',
            color: 'RAL7016',
            measurements: { linearMeters: 15 },
            quantity: 3  // 15*10*3 = 450
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should sum all item totals
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      expect(createdDN.items).toHaveLength(2)
      expect(createdDN.items[0].totalPrice).toBe(200.00)
      expect(createdDN.items[1].totalPrice).toBe(450.00)
      expect(createdDN.totalAmount).toBe(650.00)
    })

    it('should set default values (status=draft, date=today)', async () => {
      // Given: Customer and request without date
      const customer = createTestCustomer()
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 1
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should set defaults
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      expect(createdDN.status).toBe('draft')
      expect(createdDN.date).toBeInstanceOf(Date)
    })

    it('should use provided date when given', async () => {
      // Given: Customer and request with specific date
      const customer = createTestCustomer()
      const specificDate = new Date('2026-01-15T00:00:00.000Z')
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        date: specificDate,
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 1
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should use provided date
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      expect(createdDN.date).toEqual(specificDate)
    })

    it('should include customerName from customer', async () => {
      // Given: Customer with specific name
      const customer = createTestCustomer({ name: 'John Doe Industries' })
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 1
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should include customer name
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      expect(createdDN.customerName).toBe('John Doe Industries')
    })

    it('should generate unique ID for delivery note', async () => {
      // Given: Customer and request
      const customer = createTestCustomer()
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 1
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should have generated ID (from mocked nanoid)
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      expect(createdDN.id).toBe('test-id-123')
    })

    it('should generate unique IDs for each item', async () => {
      // Given: Customer and multiple items
      const customer = createTestCustomer()
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Item 1',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 1
          },
          {
            description: 'Item 2',
            color: 'RAL7016',
            measurements: { linearMeters: 15 },
            quantity: 1
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Each item should have an ID
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      expect(createdDN.items[0].id).toBe('test-id-123')
      expect(createdDN.items[1].id).toBe('test-id-123')
    })

    it('should include optional notes when provided', async () => {
      // Given: Customer and request with notes
      const customer = createTestCustomer()
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation((dn) => dn)

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 1
          }
        ],
        notes: 'Important delivery instructions'
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should include notes
      const createdDN = (deliveryNotesStorage.create as any).mock.calls[0][0]
      expect(createdDN.notes).toBe('Important delivery instructions')
    })

    it('should return 404 when customer not found', async () => {
      // Given: Non-existent customer
      vi.spyOn(customersStorage, 'findById').mockReturnValue(undefined)
      const createSpy = vi.spyOn(deliveryNotesStorage, 'create')

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'non-existent',
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 1
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Try to create delivery note
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should return 404
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Customer not found' })
      expect(createSpy).not.toHaveBeenCalled()
    })

    it('should return 500 on error', async () => {
      // Given: Storage throws error
      const customer = createTestCustomer()
      vi.spyOn(customersStorage, 'findById').mockReturnValue(customer)
      vi.spyOn(deliveryNotesStorage, 'create').mockImplementation(() => {
        throw new Error('Storage error')
      })

      const requestData: CreateDeliveryNoteRequest = {
        customerId: 'customer-123',
        items: [
          {
            description: 'Test Item',
            color: 'RAL9016',
            measurements: { linearMeters: 10 },
            quantity: 1
          }
        ]
      }
      const req = createMockRequest({ body: requestData })
      const res = createMockResponse()

      // When: Create fails
      await createDeliveryNote(req as Request, res as Response)

      // Then: Should return 500
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Error creating delivery note' })
    })
  })

  describe('updateDeliveryNote() - PUT /api/delivery-notes/:id', () => {
    it('should update delivery note when found', async () => {
      // Given: Existing delivery note
      const existingDN = createTestDeliveryNote({ id: 'dn-123' })
      vi.spyOn(deliveryNotesStorage, 'findById').mockReturnValue(existingDN)
      const updateSpy = vi.spyOn(deliveryNotesStorage, 'update').mockReturnValue({
        ...existingDN,
        notes: 'Updated notes'
      })

      const req = createMockRequest({
        params: { id: 'dn-123' },
        body: { notes: 'Updated notes' }
      })
      const res = createMockResponse()

      // When: Update delivery note
      await updateDeliveryNote(req as Request, res as Response)

      // Then: Should update and return updated delivery note
      expect(updateSpy).toHaveBeenCalledWith('dn-123', { notes: 'Updated notes' })
      expect(res.json).toHaveBeenCalled()
    })

    it('should return 404 when delivery note not found', async () => {
      // Given: Non-existent delivery note
      vi.spyOn(deliveryNotesStorage, 'findById').mockReturnValue(undefined)
      const updateSpy = vi.spyOn(deliveryNotesStorage, 'update')

      const req = createMockRequest({
        params: { id: 'non-existent' },
        body: { notes: 'Updated notes' }
      })
      const res = createMockResponse()

      // When: Try to update
      await updateDeliveryNote(req as Request, res as Response)

      // Then: Should return 404
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Delivery note not found' })
      expect(updateSpy).not.toHaveBeenCalled()
    })

    it('should return 500 on error', async () => {
      // Given: Storage throws error
      vi.spyOn(deliveryNotesStorage, 'findById').mockImplementation(() => {
        throw new Error('Storage error')
      })

      const req = createMockRequest({
        params: { id: 'dn-123' },
        body: { notes: 'Updated notes' }
      })
      const res = createMockResponse()

      // When: Update fails
      await updateDeliveryNote(req as Request, res as Response)

      // Then: Should return 500
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Error updating delivery note' })
    })
  })

  describe('deleteDeliveryNote() - DELETE /api/delivery-notes/:id', () => {
    it('should delete delivery note when status is draft', async () => {
      // Given: Draft delivery note
      const draftDN = createTestDeliveryNote({ id: 'dn-123', status: 'draft' })
      vi.spyOn(deliveryNotesStorage, 'findById').mockReturnValue(draftDN)
      vi.spyOn(deliveryNotesStorage, 'remove').mockReturnValue(true)

      const req = createMockRequest({ params: { id: 'dn-123' } })
      const res = createMockResponse()

      // When: Delete delivery note
      await deleteDeliveryNote(req as Request, res as Response)

      // Then: Should delete and return 204
      expect(deliveryNotesStorage.remove).toHaveBeenCalledWith('dn-123')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })

    it('should return 400 when status is pending', async () => {
      // Given: Pending delivery note
      const pendingDN = createTestDeliveryNote({ id: 'dn-123', status: 'pending' })
      vi.spyOn(deliveryNotesStorage, 'findById').mockReturnValue(pendingDN)
      const removeSpy = vi.spyOn(deliveryNotesStorage, 'remove')

      const req = createMockRequest({ params: { id: 'dn-123' } })
      const res = createMockResponse()

      // When: Try to delete
      await deleteDeliveryNote(req as Request, res as Response)

      // Then: Should return 400
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Can only delete draft delivery notes'
      })
      expect(removeSpy).not.toHaveBeenCalled()
    })

    it('should return 400 when status is reviewed', async () => {
      // Given: Reviewed delivery note
      const reviewedDN = createTestDeliveryNote({ id: 'dn-123', status: 'reviewed' })
      vi.spyOn(deliveryNotesStorage, 'findById').mockReturnValue(reviewedDN)
      const removeSpy = vi.spyOn(deliveryNotesStorage, 'remove')

      const req = createMockRequest({ params: { id: 'dn-123' } })
      const res = createMockResponse()

      // When: Try to delete
      await deleteDeliveryNote(req as Request, res as Response)

      // Then: Should return 400
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Can only delete draft delivery notes'
      })
      expect(removeSpy).not.toHaveBeenCalled()
    })

    it('should return 404 when delivery note not found', async () => {
      // Given: Non-existent delivery note
      vi.spyOn(deliveryNotesStorage, 'findById').mockReturnValue(undefined)
      const removeSpy = vi.spyOn(deliveryNotesStorage, 'remove')

      const req = createMockRequest({ params: { id: 'non-existent' } })
      const res = createMockResponse()

      // When: Try to delete
      await deleteDeliveryNote(req as Request, res as Response)

      // Then: Should return 404
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Delivery note not found' })
      expect(removeSpy).not.toHaveBeenCalled()
    })

    it('should return 500 when removal fails', async () => {
      // Given: Draft delivery note but removal fails
      const draftDN = createTestDeliveryNote({ id: 'dn-123', status: 'draft' })
      vi.spyOn(deliveryNotesStorage, 'findById').mockReturnValue(draftDN)
      vi.spyOn(deliveryNotesStorage, 'remove').mockReturnValue(false)

      const req = createMockRequest({ params: { id: 'dn-123' } })
      const res = createMockResponse()

      // When: Delete fails
      await deleteDeliveryNote(req as Request, res as Response)

      // Then: Should return 500
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting delivery note' })
    })

    it('should return 500 on error', async () => {
      // Given: Storage throws error
      vi.spyOn(deliveryNotesStorage, 'findById').mockImplementation(() => {
        throw new Error('Storage error')
      })

      const req = createMockRequest({ params: { id: 'dn-123' } })
      const res = createMockResponse()

      // When: Delete fails
      await deleteDeliveryNote(req as Request, res as Response)

      // Then: Should return 500
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting delivery note' })
    })
  })

  describe('updateDeliveryNoteStatus() - PATCH /api/delivery-notes/:id/status', () => {
    it('should update status to pending', async () => {
      // Given: Delivery note with draft status
      const dn = createTestDeliveryNote({ id: 'dn-123', status: 'draft' })
      vi.spyOn(deliveryNotesStorage, 'update').mockReturnValue({
        ...dn,
        status: 'pending'
      })

      const req = createMockRequest({
        params: { id: 'dn-123' },
        body: { status: 'pending' }
      })
      const res = createMockResponse()

      // When: Update status
      await updateDeliveryNoteStatus(req as Request, res as Response)

      // Then: Should update status
      expect(deliveryNotesStorage.update).toHaveBeenCalledWith('dn-123', { status: 'pending' })
      expect(res.json).toHaveBeenCalled()
    })

    it('should update status to reviewed', async () => {
      // Given: Delivery note with pending status
      const dn = createTestDeliveryNote({ id: 'dn-123', status: 'pending' })
      vi.spyOn(deliveryNotesStorage, 'update').mockReturnValue({
        ...dn,
        status: 'reviewed'
      })

      const req = createMockRequest({
        params: { id: 'dn-123' },
        body: { status: 'reviewed' }
      })
      const res = createMockResponse()

      // When: Update status
      await updateDeliveryNoteStatus(req as Request, res as Response)

      // Then: Should update status
      expect(deliveryNotesStorage.update).toHaveBeenCalledWith('dn-123', { status: 'reviewed' })
      expect(res.json).toHaveBeenCalled()
    })

    it('should update status back to draft', async () => {
      // Given: Delivery note with pending status
      const dn = createTestDeliveryNote({ id: 'dn-123', status: 'pending' })
      vi.spyOn(deliveryNotesStorage, 'update').mockReturnValue({
        ...dn,
        status: 'draft'
      })

      const req = createMockRequest({
        params: { id: 'dn-123' },
        body: { status: 'draft' }
      })
      const res = createMockResponse()

      // When: Update status
      await updateDeliveryNoteStatus(req as Request, res as Response)

      // Then: Should update status
      expect(deliveryNotesStorage.update).toHaveBeenCalledWith('dn-123', { status: 'draft' })
      expect(res.json).toHaveBeenCalled()
    })

    it('should return 400 when status is invalid', async () => {
      // Given: Invalid status
      const updateSpy = vi.spyOn(deliveryNotesStorage, 'update')
      const req = createMockRequest({
        params: { id: 'dn-123' },
        body: { status: 'invalid-status' }
      })
      const res = createMockResponse()

      // When: Try to update with invalid status
      await updateDeliveryNoteStatus(req as Request, res as Response)

      // Then: Should return 400
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status' })
      expect(updateSpy).not.toHaveBeenCalled()
    })

    it('should return 404 when delivery note not found', async () => {
      // Given: Non-existent delivery note
      vi.spyOn(deliveryNotesStorage, 'update').mockReturnValue(undefined)

      const req = createMockRequest({
        params: { id: 'non-existent' },
        body: { status: 'pending' }
      })
      const res = createMockResponse()

      // When: Try to update status
      await updateDeliveryNoteStatus(req as Request, res as Response)

      // Then: Should return 404
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Delivery note not found' })
    })

    it('should return 500 on error', async () => {
      // Given: Storage throws error
      vi.spyOn(deliveryNotesStorage, 'update').mockImplementation(() => {
        throw new Error('Storage error')
      })

      const req = createMockRequest({
        params: { id: 'dn-123' },
        body: { status: 'pending' }
      })
      const res = createMockResponse()

      // When: Update fails
      await updateDeliveryNoteStatus(req as Request, res as Response)

      // Then: Should return 500
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Error updating status' })
    })
  })
})
