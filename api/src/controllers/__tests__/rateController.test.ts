/**
 * 🔴 RED PHASE: Tests for rateController
 *
 * These tests define how the rate controller should behave.
 * Following TDD - write tests FIRST, then implement to make them pass.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Request, Response } from 'express'
import {
  listRates,
  getRate,
  getRateByCustomer,
  createRate,
  updateRate,
  deleteRate
} from '../rateController'
import { ratesStorage } from '../../storage/ratesStorage'

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
    json: vi.fn().mockReturnThis()
  }
  return res
}

describe('rateController', () => {
  beforeEach(() => {
    // Given: Clean storage before each test
    ratesStorage.clearAll()
  })

  describe('listRates() - GET /api/rates', () => {
    it('should return 200 with empty array when no rates exist', async () => {
      // Given: Empty storage
      const req = createMockRequest()
      const res = createMockResponse()

      // When: Request all rates
      await listRates(req as Request, res as Response)

      // Then: Should return 200 with empty array
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([])
    })

    it('should return 200 with all rates', async () => {
      // Given: Multiple rates in storage
      const rate1 = {
        id: 'rate-1',
        customerId: 'customer-1',
        ratePerLinearMeter: 15.00,
        ratePerSquareMeter: 25.00,
        minimumRate: 50.00,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ratesStorage.create(rate1)

      const req = createMockRequest()
      const res = createMockResponse()

      // When: Request all rates
      await listRates(req as Request, res as Response)

      // Then: Should return 200 with all rates
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([rate1])
    })
  })

  describe('getRate() - GET /api/rates/:id', () => {
    it('should return 200 with rate when it exists', async () => {
      // Given: Existing rate
      const rate = {
        id: 'test-id',
        customerId: 'customer-1',
        ratePerLinearMeter: 15.00,
        ratePerSquareMeter: 25.00,
        minimumRate: 50.00,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ratesStorage.create(rate)

      const req = createMockRequest({ params: { id: 'test-id' } })
      const res = createMockResponse()

      // When: Request rate by ID
      await getRate(req as Request, res as Response)

      // Then: Should return 200 with rate
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(rate)
    })

    it('should return 404 when rate does not exist', async () => {
      // Given: Empty storage
      const req = createMockRequest({ params: { id: 'non-existent' } })
      const res = createMockResponse()

      // When: Request non-existent rate
      await getRate(req as Request, res as Response)

      // Then: Should return 404
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Rate not found'
      })
    })
  })

  describe('getRateByCustomer() - GET /api/rates/customer/:customerId', () => {
    it('should return 200 with rate when customer has one', async () => {
      // Given: Rate for specific customer
      const rate = {
        id: 'rate-1',
        customerId: 'customer-123',
        ratePerLinearMeter: 15.00,
        ratePerSquareMeter: 25.00,
        minimumRate: 50.00,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ratesStorage.create(rate)

      const req = createMockRequest({ params: { customerId: 'customer-123' } })
      const res = createMockResponse()

      // When: Request rate by customer ID
      await getRateByCustomer(req as Request, res as Response)

      // Then: Should return 200 with rate
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(rate)
    })

    it('should return 404 when customer has no rate', async () => {
      // Given: Empty storage
      const req = createMockRequest({ params: { customerId: 'customer-999' } })
      const res = createMockResponse()

      // When: Request rate for customer without one
      await getRateByCustomer(req as Request, res as Response)

      // Then: Should return 404
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Rate not found for this customer'
      })
    })
  })

  describe('createRate() - POST /api/rates', () => {
    it('should return 201 with created rate', async () => {
      // Given: Valid rate data
      const req = createMockRequest({
        body: {
          customerId: 'customer-1',
          ratePerLinearMeter: 15.50,
          ratePerSquareMeter: 25.00,
          minimumRate: 50.00
        }
      })
      const res = createMockResponse()

      // When: Create rate
      await createRate(req as Request, res as Response)

      // Then: Should return 201
      expect(res.status).toHaveBeenCalledWith(201)

      // And: Should return created rate with ID and timestamps
      const responseCall = (res.json as any).mock.calls[0][0]
      expect(responseCall).toMatchObject({
        customerId: 'customer-1',
        ratePerLinearMeter: 15.50,
        ratePerSquareMeter: 25.00,
        minimumRate: 50.00,
        specialPieces: []
      })
      expect(responseCall.id).toBeDefined()
      expect(responseCall.createdAt).toBeDefined()
      expect(responseCall.updatedAt).toBeDefined()
    })

    it('should store the rate in storage', async () => {
      // Given: Valid rate data
      const req = createMockRequest({
        body: {
          customerId: 'customer-1',
          ratePerLinearMeter: 15.00,
          ratePerSquareMeter: 25.00,
          minimumRate: 50.00
        }
      })
      const res = createMockResponse()

      // When: Create rate
      await createRate(req as Request, res as Response)

      // Then: Rate should be in storage
      const allRates = ratesStorage.findAll()
      expect(allRates).toHaveLength(1)
      expect(allRates[0].customerId).toBe('customer-1')
    })

    it('should return 400 when customerId is missing', async () => {
      // Given: Invalid data (no customerId)
      const req = createMockRequest({
        body: {
          ratePerLinearMeter: 15.00,
          ratePerSquareMeter: 25.00,
          minimumRate: 50.00
        }
      })
      const res = createMockResponse()

      // When: Try to create rate
      await createRate(req as Request, res as Response)

      // Then: Should return 400
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Customer ID is required'
      })
    })

    it('should return 400 when rates are negative', async () => {
      // Given: Invalid data (negative price)
      const req = createMockRequest({
        body: {
          customerId: 'customer-1',
          ratePerLinearMeter: -5.00,
          ratePerSquareMeter: 25.00,
          minimumRate: 50.00
        }
      })
      const res = createMockResponse()

      // When: Try to create rate
      await createRate(req as Request, res as Response)

      // Then: Should return 400
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Rates must be positive numbers'
      })
    })

    it('should handle special pieces array', async () => {
      // Given: Rate with special pieces
      const req = createMockRequest({
        body: {
          customerId: 'customer-1',
          ratePerLinearMeter: 15.00,
          ratePerSquareMeter: 25.00,
          minimumRate: 50.00,
          specialPieces: [
            { name: 'Bumper', price: 80.00 },
            { name: 'Hood', price: 100.00 }
          ]
        }
      })
      const res = createMockResponse()

      // When: Create rate
      await createRate(req as Request, res as Response)

      // Then: Should include special pieces
      const responseCall = (res.json as any).mock.calls[0][0]
      expect(responseCall.specialPieces).toHaveLength(2)
      expect(responseCall.specialPieces[0]).toEqual({ name: 'Bumper', price: 80.00 })
    })
  })

  describe('updateRate() - PUT /api/rates/:id', () => {
    it('should return 200 with updated rate', async () => {
      // Given: Existing rate
      const rate = {
        id: 'update-id',
        customerId: 'customer-1',
        ratePerLinearMeter: 15.00,
        ratePerSquareMeter: 25.00,
        minimumRate: 50.00,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ratesStorage.create(rate)

      const req = createMockRequest({
        params: { id: 'update-id' },
        body: {
          ratePerLinearMeter: 20.00
        }
      })
      const res = createMockResponse()

      // When: Update rate
      await updateRate(req as Request, res as Response)

      // Then: Should return 200 with updated rate
      expect(res.status).toHaveBeenCalledWith(200)
      const responseCall = (res.json as any).mock.calls[0][0]
      expect(responseCall.ratePerLinearMeter).toBe(20.00)
    })

    it('should return 404 when rate does not exist', async () => {
      // Given: Empty storage
      const req = createMockRequest({
        params: { id: 'non-existent' },
        body: {
          ratePerLinearMeter: 20.00
        }
      })
      const res = createMockResponse()

      // When: Try to update non-existent rate
      await updateRate(req as Request, res as Response)

      // Then: Should return 404
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Rate not found'
      })
    })

    it('should return 400 when updated rates are negative', async () => {
      // Given: Existing rate
      const rate = {
        id: 'test-id',
        customerId: 'customer-1',
        ratePerLinearMeter: 15.00,
        ratePerSquareMeter: 25.00,
        minimumRate: 50.00,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ratesStorage.create(rate)

      const req = createMockRequest({
        params: { id: 'test-id' },
        body: {
          minimumRate: -10.00
        }
      })
      const res = createMockResponse()

      // When: Try to update with negative value
      await updateRate(req as Request, res as Response)

      // Then: Should return 400
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Rates must be positive numbers'
      })
    })
  })

  describe('deleteRate() - DELETE /api/rates/:id', () => {
    it('should return 200 when rate is deleted', async () => {
      // Given: Existing rate
      const rate = {
        id: 'delete-id',
        customerId: 'customer-1',
        ratePerLinearMeter: 15.00,
        ratePerSquareMeter: 25.00,
        minimumRate: 50.00,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ratesStorage.create(rate)

      const req = createMockRequest({ params: { id: 'delete-id' } })
      const res = createMockResponse()

      // When: Delete rate
      await deleteRate(req as Request, res as Response)

      // Then: Should return 200
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Rate deleted successfully'
      })
    })

    it('should remove rate from storage', async () => {
      // Given: Existing rate
      const rate = {
        id: 'delete-id',
        customerId: 'customer-1',
        ratePerLinearMeter: 15.00,
        ratePerSquareMeter: 25.00,
        minimumRate: 50.00,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ratesStorage.create(rate)
      expect(ratesStorage.exists('delete-id')).toBe(true)

      const req = createMockRequest({ params: { id: 'delete-id' } })
      const res = createMockResponse()

      // When: Delete rate
      await deleteRate(req as Request, res as Response)

      // Then: Rate should not exist in storage
      expect(ratesStorage.exists('delete-id')).toBe(false)
    })

    it('should return 404 when rate does not exist', async () => {
      // Given: Empty storage
      const req = createMockRequest({ params: { id: 'non-existent' } })
      const res = createMockResponse()

      // When: Try to delete non-existent rate
      await deleteRate(req as Request, res as Response)

      // Then: Should return 404
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Rate not found'
      })
    })
  })
})
