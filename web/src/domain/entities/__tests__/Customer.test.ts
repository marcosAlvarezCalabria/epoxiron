/**
 * 🔴 RED PHASE: Tests for Customer Entity
 *
 * 📝 QUÉ: Tests que definen cómo debe comportarse la entidad Customer
 * 🎯 POR QUÉ: TDD - escribimos el test ANTES del código
 * 🔍 CÓMO: Definimos todas las reglas de negocio que debe cumplir
 *
 * 🏗️ ANALOGÍA: Como el inspector que define los requisitos ANTES de construir
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
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }

      // When: Creamos el customer
      const customer = new Customer(customerData)

      // Then: Debe tener las propiedades correctas
      expect(customer.id).toBe('123')
      expect(customer.name).toBe('Juan Pérez')
      expect(customer.rateId).toBeUndefined()
      expect(customer.createdAt).toEqual(new Date('2024-01-01'))
      expect(customer.updatedAt).toEqual(new Date('2024-01-01'))
    })

    it('should create a customer with optional rateId', () => {
      // Given: Datos con tarifa asignada
      const customerData = {
        id: '123',
        name: 'Juan Pérez',
        rateId: 'tarifa-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }

      // When: Creamos el customer
      const customer = new Customer(customerData)

      // Then: Debe tener la tarifa
      expect(customer.rateId).toBe('tarifa-1')
    })

    it('should throw error if name is empty', () => {
      // Given: Nombre vacío
      const customerData = {
        id: '123',
        name: '',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }

      // When/Then: Debe lanzar error
      expect(() => new Customer(customerData)).toThrow('Name cannot be empty')
    })

    it('should throw error if name is too short', () => {
      // Given: Nombre de 1 carácter
      const customerData = {
        id: '123',
        name: 'A',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }

      // When/Then: Debe lanzar error
      expect(() => new Customer(customerData)).toThrow('Name must be at least 2 characters')
    })

    it('should trim whitespace from name', () => {
      // Given: Nombre con espacios
      const customerData = {
        id: '123',
        name: '  Juan Pérez  ',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }

      // When: Creamos el customer
      const customer = new Customer(customerData)

      // Then: Debe eliminar espacios
      expect(customer.name).toBe('Juan Pérez')
    })
  })

  // 🧪 TEST 2: Métodos de negocio
  describe('Business Logic Methods', () => {
    it('hasRate() should return true when customer has a rate', () => {
      // Given: Customer con tarifa
      const customer = new Customer({
        id: '123',
        name: 'Juan Pérez',
        rateId: 'tarifa-1',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When/Then: Debe tener tarifa
      expect(customer.hasRate()).toBe(true)
    })

    it('hasRate() should return false when customer has no rate', () => {
      // Given: Customer sin tarifa
      const customer = new Customer({
        id: '123',
        name: 'Juan Pérez',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When/Then: No debe tener tarifa
      expect(customer.hasRate()).toBe(false)
    })
  })

  // 🧪 TEST 3: Métodos para modificar
  describe('Mutation Methods', () => {
    it('changeName() should update the name', () => {
      // Given: Customer existente
      const customer = new Customer({
        id: '123',
        name: 'Juan Pérez',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When: Cambiamos el nombre
      customer.changeName('Juan García')

      // Then: Debe tener el nuevo nombre
      expect(customer.name).toBe('Juan García')
    })

    it('changeName() should throw error if new name is empty', () => {
      // Given: Customer existente
      const customer = new Customer({
        id: '123',
        name: 'Juan Pérez',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When/Then: Debe lanzar error
      expect(() => customer.changeName('')).toThrow('Name cannot be empty')
    })

    it('assignRate() should assign a rate', () => {
      // Given: Customer sin tarifa
      const customer = new Customer({
        id: '123',
        name: 'Juan Pérez',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When: Asignamos tarifa
      customer.assignRate('tarifa-1')

      // Then: Debe tener tarifa
      expect(customer.rateId).toBe('tarifa-1')
      expect(customer.hasRate()).toBe(true)
    })

    it('removeRate() should remove the rate', () => {
      // Given: Customer con tarifa
      const customer = new Customer({
        id: '123',
        name: 'Juan Pérez',
        rateId: 'tarifa-1',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When: Quitamos tarifa
      customer.removeRate()

      // Then: No debe tener tarifa
      expect(customer.rateId).toBeUndefined()
      expect(customer.hasRate()).toBe(false)
    })
  })

  // 🧪 TEST 4: Comparación
  describe('Comparison', () => {
    it('equals() should return true for same ID', () => {
      // Given: Dos customers con mismo ID
      const customer1 = new Customer({
        id: '123',
        name: 'Juan Pérez',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const customer2 = new Customer({
        id: '123',
        name: 'Otro Nombre', // Diferente nombre, mismo ID
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When/Then: Deben ser iguales (mismo ID)
      expect(customer1.equals(customer2)).toBe(true)
    })

    it('equals() should return false for different ID', () => {
      // Given: Dos customers con diferente ID
      const customer1 = new Customer({
        id: '123',
        name: 'Juan Pérez',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const customer2 = new Customer({
        id: '456',
        name: 'Juan Pérez', // Mismo nombre, diferente ID
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // When/Then: NO deben ser iguales (diferente ID)
      expect(customer1.equals(customer2)).toBe(false)
    })
  })
})
