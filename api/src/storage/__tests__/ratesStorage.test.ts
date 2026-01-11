/**
 * 🔴 RED PHASE: Tests for ratesStorage
 *
 * These tests define how the in-memory storage for rates should behave.
 * Following TDD - write tests FIRST, then implement to make them pass.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import type { Rate } from '../../types/rate'
import { ratesStorage } from '../ratesStorage'

describe('ratesStorage', () => {
  // Helper to create test rates
  const createTestRate = (overrides: Partial<Rate> = {}): Rate => {
    const now = new Date('2026-01-11T13:00:00.000Z')
    return {
      id: 'rate-123',
      customerId: 'customer-456',
      ratePerLinearMeter: 15.50,
      ratePerSquareMeter: 25.00,
      minimumRate: 50.00,
      specialPieces: [],
      createdAt: now,
      updatedAt: now,
      ...overrides
    }
  }

  beforeEach(() => {
    // Given: Clean storage before each test
    ratesStorage.clearAll()
  })

  describe('findAll()', () => {
    it('should return empty array when no rates exist', () => {
      // Given: Empty storage
      // When: Request all rates
      const result = ratesStorage.findAll()
      // Then: Should get empty array
      expect(result).toEqual([])
    })

    it('should return all created rates', () => {
      // Given: Multiple rates
      const rate1 = createTestRate({ id: '1', customerId: 'c1' })
      const rate2 = createTestRate({ id: '2', customerId: 'c2' })
      ratesStorage.create(rate1)
      ratesStorage.create(rate2)

      // When: Request all
      const result = ratesStorage.findAll()

      // Then: Get all rates
      expect(result).toHaveLength(2)
      expect(result).toContainEqual(rate1)
      expect(result).toContainEqual(rate2)
    })
  })

  describe('findById()', () => {
    it('should return rate when it exists', () => {
      // Given: Existing rate
      const rate = createTestRate({ id: 'test-id' })
      ratesStorage.create(rate)

      // When: Search by ID
      const result = ratesStorage.findById('test-id')

      // Then: Get the rate
      expect(result).toEqual(rate)
    })

    it('should return undefined when rate does not exist', () => {
      // Given: Empty storage
      // When: Search for non-existent ID
      const result = ratesStorage.findById('non-existent')

      // Then: Get undefined
      expect(result).toBeUndefined()
    })
  })

  describe('findByCustomerId()', () => {
    it('should return rate for a specific customer', () => {
      // Given: Rates for different customers
      const rate1 = createTestRate({ id: '1', customerId: 'customer-A' })
      const rate2 = createTestRate({ id: '2', customerId: 'customer-B' })
      ratesStorage.create(rate1)
      ratesStorage.create(rate2)

      // When: Search by customer ID
      const result = ratesStorage.findByCustomerId('customer-A')

      // Then: Get the correct rate
      expect(result).toEqual(rate1)
    })

    it('should return undefined when customer has no rate', () => {
      // Given: Empty storage
      // When: Search for non-existent customer
      const result = ratesStorage.findByCustomerId('customer-X')

      // Then: Get undefined
      expect(result).toBeUndefined()
    })
  })

  describe('create()', () => {
    it('should add rate to storage and return it', () => {
      // Given: New rate
      const newRate = createTestRate({ id: 'new', customerId: 'c1' })

      // When: Create rate
      const result = ratesStorage.create(newRate)

      // Then: Should return rate
      expect(result).toEqual(newRate)

      // And: Should be in storage
      expect(ratesStorage.findById('new')).toEqual(newRate)
    })

    it('should handle rates with special pieces', () => {
      // Given: Rate with special pieces
      const rateWithPieces = createTestRate({
        id: '1',
        specialPieces: [
          { name: 'Bumper', price: 80.00 },
          { name: 'Fender', price: 45.50 }
        ]
      })

      // When: Create rate
      const result = ratesStorage.create(rateWithPieces)

      // Then: Should include special pieces
      expect(result.specialPieces).toHaveLength(2)
      expect(result.specialPieces[0]).toEqual({ name: 'Bumper', price: 80.00 })
      expect(result.specialPieces[1]).toEqual({ name: 'Fender', price: 45.50 })
    })

    it('should handle rates without special pieces', () => {
      // Given: Rate without special pieces
      const rateNoPieces = createTestRate({
        id: '1',
        specialPieces: []
      })

      // When: Create rate
      const result = ratesStorage.create(rateNoPieces)

      // Then: Should have empty array
      expect(result.specialPieces).toEqual([])
    })
  })

  describe('update()', () => {
    it('should modify rate data and return updated rate', () => {
      // Given: Existing rate
      const rate = createTestRate({ id: 'update-test', ratePerLinearMeter: 15.00 })
      ratesStorage.create(rate)

      // When: Update linear meter rate
      const result = ratesStorage.update('update-test', { ratePerLinearMeter: 20.00 })

      // Then: Should return updated rate
      expect(result).toBeDefined()
      expect(result?.ratePerLinearMeter).toBe(20.00)
    })

    it('should update the updatedAt timestamp', () => {
      // Given: Rate with old timestamp
      const oldDate = new Date('2026-01-10T10:00:00.000Z')
      const rate = createTestRate({
        id: 'time-test',
        updatedAt: oldDate
      })
      ratesStorage.create(rate)

      // When: Update rate
      const newDate = new Date('2026-01-11T15:00:00.000Z')
      const result = ratesStorage.update('time-test', {
        ratePerLinearMeter: 25.00,
        updatedAt: newDate
      })

      // Then: Timestamp should be updated
      expect(result?.updatedAt).toEqual(newDate)
    })

    it('should return null for non-existent rate', () => {
      // When: Try to update non-existent rate
      const result = ratesStorage.update('non-existent', { ratePerLinearMeter: 20.00 })

      // Then: Should return null
      expect(result).toBeNull()
    })

    it('should preserve fields that are not being updated', () => {
      // Given: Rate with multiple fields
      const rate = createTestRate({
        id: 'preserve',
        ratePerLinearMeter: 15.00,
        ratePerSquareMeter: 25.00,
        minimumRate: 50.00
      })
      ratesStorage.create(rate)

      // When: Update only linear meter rate
      const result = ratesStorage.update('preserve', { ratePerLinearMeter: 20.00 })

      // Then: Linear meter updated, others preserved
      expect(result?.ratePerLinearMeter).toBe(20.00)
      expect(result?.ratePerSquareMeter).toBe(25.00)
      expect(result?.minimumRate).toBe(50.00)
    })

    it('should allow updating special pieces', () => {
      // Given: Rate with special pieces
      const rate = createTestRate({
        id: 'pieces-test',
        specialPieces: [{ name: 'Bumper', price: 80.00 }]
      })
      ratesStorage.create(rate)

      // When: Update special pieces
      const result = ratesStorage.update('pieces-test', {
        specialPieces: [
          { name: 'Bumper', price: 90.00 },
          { name: 'Hood', price: 100.00 }
        ]
      })

      // Then: Special pieces should be updated
      expect(result?.specialPieces).toHaveLength(2)
      expect(result?.specialPieces[0]).toEqual({ name: 'Bumper', price: 90.00 })
      expect(result?.specialPieces[1]).toEqual({ name: 'Hood', price: 100.00 })
    })
  })

  describe('delete()', () => {
    it('should remove rate and return true', () => {
      // Given: Existing rate
      const rate = createTestRate({ id: 'delete-me' })
      ratesStorage.create(rate)

      // When: Delete rate
      const result = ratesStorage.delete('delete-me')

      // Then: Should return true
      expect(result).toBe(true)

      // And: Rate should not exist
      expect(ratesStorage.findById('delete-me')).toBeUndefined()
    })

    it('should return false when rate does not exist', () => {
      // When: Try to delete non-existent rate
      const result = ratesStorage.delete('non-existent')

      // Then: Should return false
      expect(result).toBe(false)
    })

    it('should not affect other rates', () => {
      // Given: Multiple rates
      const rate1 = createTestRate({ id: 'keep-1' })
      const rate2 = createTestRate({ id: 'delete' })
      const rate3 = createTestRate({ id: 'keep-3' })
      ratesStorage.create(rate1)
      ratesStorage.create(rate2)
      ratesStorage.create(rate3)

      // When: Delete one
      ratesStorage.delete('delete')

      // Then: Others remain
      expect(ratesStorage.findById('keep-1')).toEqual(rate1)
      expect(ratesStorage.findById('keep-3')).toEqual(rate3)
      expect(ratesStorage.findAll()).toHaveLength(2)
    })
  })

  describe('exists()', () => {
    it('should return true when rate exists', () => {
      // Given: Existing rate
      const rate = createTestRate({ id: 'exists' })
      ratesStorage.create(rate)

      // When: Check existence
      const result = ratesStorage.exists('exists')

      // Then: Should return true
      expect(result).toBe(true)
    })

    it('should return false when rate does not exist', () => {
      // When: Check non-existent rate
      const result = ratesStorage.exists('non-existent')

      // Then: Should return false
      expect(result).toBe(false)
    })

    it('should return false after rate is deleted', () => {
      // Given: Rate that will be deleted
      const rate = createTestRate({ id: 'delete-check' })
      ratesStorage.create(rate)
      expect(ratesStorage.exists('delete-check')).toBe(true)

      // When: Delete rate
      ratesStorage.delete('delete-check')

      // Then: Should not exist
      expect(ratesStorage.exists('delete-check')).toBe(false)
    })
  })

  describe('clearAll()', () => {
    it('should remove all rates from storage', () => {
      // Given: Multiple rates
      const rate1 = createTestRate({ id: '1' })
      const rate2 = createTestRate({ id: '2' })
      ratesStorage.create(rate1)
      ratesStorage.create(rate2)
      expect(ratesStorage.findAll()).toHaveLength(2)

      // When: Clear all
      ratesStorage.clearAll()

      // Then: Storage should be empty
      expect(ratesStorage.findAll()).toEqual([])
    })

    it('should work on already empty storage', () => {
      // Given: Empty storage
      // When: Clear it
      ratesStorage.clearAll()

      // Then: Should still be empty
      expect(ratesStorage.findAll()).toEqual([])
    })
  })
})
