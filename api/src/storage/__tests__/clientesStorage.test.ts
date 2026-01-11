/**
 * 🔴 RED PHASE: Tests for clientesStorage
 *
 * These tests define how the in-memory storage for customers should behave.
 * Following TDD - write tests FIRST, then implement to make them pass.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import type { Cliente } from '../../types/cliente'
import { clientesStorage } from '../clientesStorage'

describe('clientesStorage', () => {
  // Helper to create test customers
  const createTestCliente = (overrides: Partial<Cliente> = {}): Cliente => {
    const now = new Date('2026-01-11T10:00:00.000Z')
    return {
      id: 'cliente-123',
      nombre: 'Test Cliente',
      createdAt: now,
      updatedAt: now,
      ...overrides
    }
  }

  beforeEach(() => {
    // Given: Clean storage before each test
    clientesStorage.clearAll()
  })

  describe('findAll()', () => {
    it('should return empty array when no customers exist', () => {
      // Given: Empty storage
      // When: Request all customers
      const result = clientesStorage.findAll()
      // Then: Should get empty array
      expect(result).toEqual([])
    })

    it('should return all created customers', () => {
      // Given: Multiple customers
      const cliente1 = createTestCliente({ id: '1', nombre: 'One' })
      const cliente2 = createTestCliente({ id: '2', nombre: 'Two' })
      clientesStorage.create(cliente1)
      clientesStorage.create(cliente2)

      // When: Request all
      const result = clientesStorage.findAll()

      // Then: Get all customers
      expect(result).toHaveLength(2)
      expect(result).toContainEqual(cliente1)
      expect(result).toContainEqual(cliente2)
    })
  })

  describe('findById()', () => {
    it('should return customer when it exists', () => {
      // Given: Existing customer
      const cliente = createTestCliente({ id: 'test-id', nombre: 'Test' })
      clientesStorage.create(cliente)

      // When: Search by ID
      const result = clientesStorage.findById('test-id')

      // Then: Get the customer
      expect(result).toEqual(cliente)
    })

    it('should return undefined when customer does not exist', () => {
      // Given: Empty storage
      // When: Search for non-existent ID
      const result = clientesStorage.findById('non-existent')

      // Then: Get undefined
      expect(result).toBeUndefined()
    })
  })

  describe('create()', () => {
    it('should add customer to storage and return it', () => {
      // Given: New customer
      const newCliente = createTestCliente({ id: 'new', nombre: 'New' })

      // When: Create customer
      const result = clientesStorage.create(newCliente)

      // Then: Should return customer
      expect(result).toEqual(newCliente)

      // And: Should be in storage
      expect(clientesStorage.findById('new')).toEqual(newCliente)
    })

    it('should handle customers with optional tarifaId', () => {
      // Given: Customer WITH tarifaId
      const withTarifa = createTestCliente({ id: '1', tarifaId: 'tarifa-1' })
      const result1 = clientesStorage.create(withTarifa)
      expect(result1.tarifaId).toBe('tarifa-1')

      // Given: Customer WITHOUT tarifaId
      const withoutTarifa = createTestCliente({ id: '2', tarifaId: undefined })
      const result2 = clientesStorage.create(withoutTarifa)
      expect(result2.tarifaId).toBeUndefined()
    })
  })

  describe('update()', () => {
    it('should modify customer data and return updated customer', () => {
      // Given: Existing customer
      const cliente = createTestCliente({ id: 'update-test', nombre: 'Original' })
      clientesStorage.create(cliente)

      // When: Update name
      const result = clientesStorage.update('update-test', { nombre: 'Updated' })

      // Then: Should return updated customer
      expect(result).toBeDefined()
      expect(result?.nombre).toBe('Updated')
    })

    it('should update the updatedAt timestamp', () => {
      // Given: Customer with old timestamp
      const oldDate = new Date('2026-01-10T10:00:00.000Z')
      const cliente = createTestCliente({
        id: 'time-test',
        updatedAt: oldDate
      })
      clientesStorage.create(cliente)

      // When: Update customer
      const newDate = new Date('2026-01-11T15:00:00.000Z')
      const result = clientesStorage.update('time-test', {
        nombre: 'Updated',
        updatedAt: newDate
      })

      // Then: Timestamp should be updated
      expect(result?.updatedAt).toEqual(newDate)
    })

    it('should return null for non-existent customer', () => {
      // When: Try to update non-existent customer
      const result = clientesStorage.update('non-existent', { nombre: 'New' })

      // Then: Should return null
      expect(result).toBeNull()
    })

    it('should preserve fields that are not being updated', () => {
      // Given: Customer with multiple fields
      const cliente = createTestCliente({
        id: 'preserve',
        nombre: 'Original',
        tarifaId: 'tarifa-1'
      })
      clientesStorage.create(cliente)

      // When: Update only nombre
      const result = clientesStorage.update('preserve', { nombre: 'Updated' })

      // Then: Name updated, other fields preserved
      expect(result?.nombre).toBe('Updated')
      expect(result?.tarifaId).toBe('tarifa-1')
    })
  })

  describe('delete()', () => {
    it('should remove customer and return true', () => {
      // Given: Existing customer
      const cliente = createTestCliente({ id: 'delete-me' })
      clientesStorage.create(cliente)

      // When: Delete customer
      const result = clientesStorage.delete('delete-me')

      // Then: Should return true
      expect(result).toBe(true)

      // And: Customer should not exist
      expect(clientesStorage.findById('delete-me')).toBeUndefined()
    })

    it('should return false when customer does not exist', () => {
      // When: Try to delete non-existent customer
      const result = clientesStorage.delete('non-existent')

      // Then: Should return false
      expect(result).toBe(false)
    })

    it('should not affect other customers', () => {
      // Given: Multiple customers
      const cliente1 = createTestCliente({ id: 'keep-1' })
      const cliente2 = createTestCliente({ id: 'delete' })
      const cliente3 = createTestCliente({ id: 'keep-3' })
      clientesStorage.create(cliente1)
      clientesStorage.create(cliente2)
      clientesStorage.create(cliente3)

      // When: Delete one
      clientesStorage.delete('delete')

      // Then: Others remain
      expect(clientesStorage.findById('keep-1')).toEqual(cliente1)
      expect(clientesStorage.findById('keep-3')).toEqual(cliente3)
      expect(clientesStorage.findAll()).toHaveLength(2)
    })
  })

  describe('exists()', () => {
    it('should return true when customer exists', () => {
      // Given: Existing customer
      const cliente = createTestCliente({ id: 'exists' })
      clientesStorage.create(cliente)

      // When: Check existence
      const result = clientesStorage.exists('exists')

      // Then: Should return true
      expect(result).toBe(true)
    })

    it('should return false when customer does not exist', () => {
      // When: Check non-existent customer
      const result = clientesStorage.exists('non-existent')

      // Then: Should return false
      expect(result).toBe(false)
    })

    it('should return false after customer is deleted', () => {
      // Given: Customer that will be deleted
      const cliente = createTestCliente({ id: 'delete-check' })
      clientesStorage.create(cliente)
      expect(clientesStorage.exists('delete-check')).toBe(true)

      // When: Delete customer
      clientesStorage.delete('delete-check')

      // Then: Should not exist
      expect(clientesStorage.exists('delete-check')).toBe(false)
    })
  })

  describe('clearAll()', () => {
    it('should remove all customers from storage', () => {
      // Given: Multiple customers
      const cliente1 = createTestCliente({ id: '1' })
      const cliente2 = createTestCliente({ id: '2' })
      clientesStorage.create(cliente1)
      clientesStorage.create(cliente2)
      expect(clientesStorage.findAll()).toHaveLength(2)

      // When: Clear all
      clientesStorage.clearAll()

      // Then: Storage should be empty
      expect(clientesStorage.findAll()).toEqual([])
    })

    it('should work on already empty storage', () => {
      // Given: Empty storage
      // When: Clear it
      clientesStorage.clearAll()

      // Then: Should still be empty
      expect(clientesStorage.findAll()).toEqual([])
    })
  })
})
