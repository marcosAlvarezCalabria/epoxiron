/**
 * 🔴 RED PHASE: Tests for Customer Entity
 */

import { describe, it, expect } from 'vitest'
import { Customer } from '../Customer'

describe('Customer Entity', () => {
  // 🧪 TEST 1: Crear un customer básico
  describe('Constructor', () => {
    it('should create a customer with required fields', () => {
      // Given: Datos mínimos para crear un customer
      const customerData = {
        id: '123',
        name: 'Juan Pérez',
        pricePerLinearMeter: 0,
        pricePerSquareMeter: 0,
        minimumRate: 0,
        specialPieces: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }

      // When: Creamos el customer
      const customer = new Customer(customerData)

      // Then: Debe tener las propiedades correctas
      expect(customer.id).toBe('123')
      expect(customer.name).toBe('Juan Pérez')
      expect(customer.pricePerLinearMeter).toBe(0)
      expect(customer.createdAt).toEqual(new Date('2024-01-01'))
      expect(customer.updatedAt).toEqual(new Date('2024-01-01'))
    })

    it('should create a customer with specific pricing', () => {
      // Given: Datos con tarifa asignada
      const customerData = {
        id: '123',
        name: 'Juan Pérez',
        pricePerLinearMeter: 10,
        pricePerSquareMeter: 20,
        minimumRate: 5,
        specialPieces: [{ name: 'Test', price: 50 }],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }

      // When: Creamos el customer
      const customer = new Customer(customerData)

      // Then: Debe tener la tarifa correcta
      expect(customer.pricePerLinearMeter).toBe(10)
      expect(customer.pricePerSquareMeter).toBe(20)
      expect(customer.specialPieces).toHaveLength(1)
    })

    it('should throw error if name is empty', () => {
      // Given: Nombre vacío
      const customerData = {
        id: '123',
        name: '',
        pricePerLinearMeter: 0,
        pricePerSquareMeter: 0,
        minimumRate: 0,
        specialPieces: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }

      // When/Then: Debe lanzar error
      expect(() => new Customer(customerData)).toThrow('Name cannot be empty')
    })
  })

  // 🧪 TEST 3: Métodos para modificar
  describe('Mutation Methods', () => {
    it('changeName() should update the name', () => {
      // Given: Customer existente
      const customer = new Customer({
        id: '123',
        name: 'Juan Pérez',
        pricePerLinearMeter: 0,
        pricePerSquareMeter: 0,
        minimumRate: 0,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When: Cambiamos el nombre
      customer.changeName('Juan García')

      // Then: Debe tener el nuevo nombre
      expect(customer.name).toBe('Juan García')
    })

    it('updatePricing() should update prices', () => {
      // Given: Customer sin tarifa
      const customer = new Customer({
        id: '123',
        name: 'Juan Pérez',
        pricePerLinearMeter: 0,
        pricePerSquareMeter: 0,
        minimumRate: 0,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When: Asignamos tarifa
      customer.updatePricing(15, 25, 10, [{ name: 'New', price: 100 }])

      // Then: Debe tener nuevos precios
      expect(customer.pricePerLinearMeter).toBe(15)
      expect(customer.pricePerSquareMeter).toBe(25)
      expect(customer.minimumRate).toBe(10)
      expect(customer.specialPieces).toHaveLength(1)
    })

    it('updatePricing() should throw error on negative prices', () => {
      const customer = new Customer({
        id: '123',
        name: 'Juan Pérez',
        pricePerLinearMeter: 0,
        pricePerSquareMeter: 0,
        minimumRate: 0,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      expect(() => customer.updatePricing(-1, 0, 0, [])).toThrow('Prices cannot be negative')
    })
  })

  // 🧪 TEST 4: Comparación
  describe('Comparison', () => {
    it('equals() should return true for same ID', () => {
      const customer1 = new Customer({
        id: '123',
        name: 'Juan Pérez',
        pricePerLinearMeter: 0,
        pricePerSquareMeter: 0,
        minimumRate: 0,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const customer2 = new Customer({
        id: '123',
        name: 'Otro Nombre',
        pricePerLinearMeter: 0,
        pricePerSquareMeter: 0,
        minimumRate: 0,
        specialPieces: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      expect(customer1.equals(customer2)).toBe(true)
    })
  })
})
