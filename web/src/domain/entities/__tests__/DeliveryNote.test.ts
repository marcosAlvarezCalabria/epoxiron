/**
 * 🔴 RED PHASE: Tests for DeliveryNote Entity
 *
 * 📝 QUÉ: Tests que definen cómo debe comportarse la entidad DeliveryNote
 * 🎯 POR QUÉ: TDD - escribimos el test ANTES del código
 * 🔍 CÓMO: Definimos todas las reglas de negocio que debe cumplir
 *
 * 🏗️ ANALOGÍA: Como el inspector que define los requisitos ANTES de construir
 */

import { describe, it, expect } from 'vitest'
import { DeliveryNote } from '../DeliveryNote'
import { Item } from '../Item'
import { RACColor } from '../../value-objects/RACColor'
import { Measurements } from '../../value-objects/Measurements'
import { Price } from '../../value-objects/Price'
import { DeliveryNoteException } from '../../exceptions/DeliveryNoteException'

describe('DeliveryNote Entity', () => {
  // Helper function para crear un item de prueba
  const createTestItem = (id: string, name: string, price?: Price): Item => {
    return new Item({
      id,
      name,
      color: RACColor.createRAC('9010'),
      quantity: 1,
      measurements: Measurements.createWithLinearMeters(10),
      price
    })
  }

  // 🧪 TEST 1: Constructor y Factory
  describe('Constructor and Factory', () => {
    it('should create a delivery note with required fields', () => {
      // Given: Datos mínimos para crear un albarán
      const deliveryNoteData = {
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date('2024-01-15'),
        status: 'draft' as const,
        items: []
      }

      // When: Creamos el albarán
      const deliveryNote = new DeliveryNote(deliveryNoteData)

      // Then: Debe tener las propiedades correctas
      expect(deliveryNote.id).toBe('dn-123')
      expect(deliveryNote.number).toBe('DN-2024-0001')
      expect(deliveryNote.customerId).toBe('customer-1')
      expect(deliveryNote.date).toEqual(new Date('2024-01-15'))
      expect(deliveryNote.status).toBe('draft')
      expect(deliveryNote.items).toHaveLength(0)
    })

    it('should create a delivery note with items', () => {
      // Given: Datos con items
      const item = createTestItem('item-1', 'Puerta')
      const deliveryNoteData = {
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date('2024-01-15'),
        status: 'draft' as const,
        items: [item]
      }

      // When: Creamos el albarán
      const deliveryNote = new DeliveryNote(deliveryNoteData)

      // Then: Debe tener el item
      expect(deliveryNote.items).toHaveLength(1)
      expect(deliveryNote.items[0].id).toBe('item-1')
    })

    it('should throw error if id is empty', () => {
      // Given: ID vacío
      const deliveryNoteData = {
        id: '',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date('2024-01-15'),
        status: 'draft' as const,
        items: []
      }

      // When/Then: Debe lanzar error
      expect(() => new DeliveryNote(deliveryNoteData)).toThrow('DeliveryNote must have an ID')
    })

    it('should throw error if number is empty', () => {
      // Given: Número vacío
      const deliveryNoteData = {
        id: 'dn-123',
        number: '',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date('2024-01-15'),
        status: 'draft' as const,
        items: []
      }

      // When/Then: Debe lanzar error
      expect(() => new DeliveryNote(deliveryNoteData)).toThrow('DeliveryNote must have a number')
    })

    it('should throw DeliveryNoteException if customerId is empty', () => {
      // Given: Customer ID vacío
      const deliveryNoteData = {
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: '',
        customerName: 'Test Customer',
        date: new Date('2024-01-15'),
        status: 'draft' as const,
        items: []
      }

      // When/Then: Debe lanzar DeliveryNoteException
      expect(() => new DeliveryNote(deliveryNoteData)).toThrow(DeliveryNoteException)
      try {
        new DeliveryNote(deliveryNoteData)
      } catch (error) {
        expect((error as DeliveryNoteException).code).toBe('DELIVERY_NOTE_WITHOUT_CUSTOMER')
      }
    })

    it('should create draft delivery note using factory method', () => {
      // Given: Parámetros para crear draft
      const params = {
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      }

      // When: Usamos el factory method
      const deliveryNote = DeliveryNote.createDraft(params)

      // Then: Debe ser un draft vacío con fecha actual
      expect(deliveryNote.id).toBe('dn-123')
      expect(deliveryNote.number).toBe('DN-2024-0001')
      expect(deliveryNote.customerId).toBe('customer-1')
      expect(deliveryNote.status).toBe('draft')
      expect(deliveryNote.items).toHaveLength(0)
      expect(deliveryNote.date).toBeInstanceOf(Date)
    })
  })

  // 🧪 TEST 2: Gestión de items
  describe('Item Management', () => {
    it('addItem() should add an item to draft delivery note', () => {
      // Given: Albarán en draft
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      const item = createTestItem('item-1', 'Puerta')

      // When: Añadimos el item
      deliveryNote.addItem(item)

      // Then: Debe tener el item
      expect(deliveryNote.items).toHaveLength(1)
      expect(deliveryNote.items[0].id).toBe('item-1')
    })

    it('addItem() should throw error if delivery note is validated', () => {
      // Given: Albarán validado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'validated',
        items: [createTestItem('item-1', 'Puerta')]
      })
      const newItem = createTestItem('item-2', 'Ventana')

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.addItem(newItem)).toThrow(DeliveryNoteException)
      try {
        deliveryNote.addItem(newItem)
      } catch (error) {
        expect((error as DeliveryNoteException).code).toBe('DELIVERY_NOTE_NOT_EDITABLE')
      }
    })

    it('addItem() should throw error if delivery note is finalized', () => {
      // Given: Albarán finalizado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'finalized',
        items: [createTestItem('item-1', 'Puerta')]
      })
      const newItem = createTestItem('item-2', 'Ventana')

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.addItem(newItem)).toThrow(DeliveryNoteException)
    })

    it('removeItem() should remove an item from draft delivery note', () => {
      // Given: Albarán en draft con un item
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      const item = createTestItem('item-1', 'Puerta')
      deliveryNote.addItem(item)

      // When: Quitamos el item
      deliveryNote.removeItem('item-1')

      // Then: No debe tener items
      expect(deliveryNote.items).toHaveLength(0)
    })

    it('removeItem() should throw error if item not found', () => {
      // Given: Albarán sin el item
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.removeItem('item-999')).toThrow(DeliveryNoteException)
      try {
        deliveryNote.removeItem('item-999')
      } catch (error) {
        expect((error as DeliveryNoteException).code).toBe('ITEM_NOT_FOUND')
      }
    })

    it('removeItem() should throw error if delivery note is not editable', () => {
      // Given: Albarán validado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'validated',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.removeItem('item-1')).toThrow(DeliveryNoteException)
    })

    it('getItem() should return the item by id', () => {
      // Given: Albarán con items
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      const item = createTestItem('item-1', 'Puerta')
      deliveryNote.addItem(item)

      // When: Obtenemos el item
      const foundItem = deliveryNote.getItem('item-1')

      // Then: Debe devolver el item correcto
      expect(foundItem.id).toBe('item-1')
      expect(foundItem.name).toBe('Puerta')
    })

    it('getItem() should throw error if item not found', () => {
      // Given: Albarán sin el item
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.getItem('item-999')).toThrow(DeliveryNoteException)
    })

    it('updateItemPrice() should update price in draft delivery note', () => {
      // Given: Albarán en draft con item sin precio
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      const item = createTestItem('item-1', 'Puerta')
      deliveryNote.addItem(item)

      // When: Actualizamos el precio
      deliveryNote.updateItemPrice('item-1', new Price(100))

      // Then: El item debe tener precio
      const updatedItem = deliveryNote.getItem('item-1')
      expect(updatedItem.price?.getValue()).toBe(100)
    })

    it('updateItemPrice() should update price in validated delivery note', () => {
      // Given: Albarán validado (permite editar precios)
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'validated',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When: Actualizamos el precio
      deliveryNote.updateItemPrice('item-1', new Price(200))

      // Then: Debe actualizar el precio
      const updatedItem = deliveryNote.getItem('item-1')
      expect(updatedItem.price?.getValue()).toBe(200)
    })

    it('updateItemPrice() should throw error if delivery note is finalized', () => {
      // Given: Albarán finalizado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'finalized',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.updateItemPrice('item-1', new Price(100))).toThrow(DeliveryNoteException)
      try {
        deliveryNote.updateItemPrice('item-1', new Price(100))
      } catch (error) {
        expect((error as DeliveryNoteException).code).toBe('DELIVERY_NOTE_ALREADY_FINALIZED')
      }
    })
  })

  // 🧪 TEST 3: Transiciones de estado
  describe('Status Transitions', () => {
    it('validate() should change status from draft to validated', () => {
      // Given: Albarán en draft con items
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      deliveryNote.addItem(createTestItem('item-1', 'Puerta', new Price(100)))

      // When: Validamos
      deliveryNote.validate()

      // Then: Debe estar validado
      expect(deliveryNote.status).toBe('validated')
      expect(deliveryNote.isValidated()).toBe(true)
    })

    it('validate() should throw error if delivery note has no items', () => {
      // Given: Albarán en draft sin items
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.validate()).toThrow(DeliveryNoteException)
      try {
        deliveryNote.validate()
      } catch (error) {
        expect((error as DeliveryNoteException).code).toBe('DELIVERY_NOTE_WITHOUT_ITEMS')
      }
    })

    it('validate() should throw error if status is not draft', () => {
      // Given: Albarán ya validado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'validated',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.validate()).toThrow(DeliveryNoteException)
      try {
        deliveryNote.validate()
      } catch (error) {
        expect((error as DeliveryNoteException).code).toBe('INVALID_STATUS')
      }
    })

    it('finalize() should change status from validated to finalized', () => {
      // Given: Albarán validado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'validated',
        items: [createTestItem('item-1', 'Puerta', new Price(100))]
      })

      // When: Finalizamos
      deliveryNote.finalize()

      // Then: Debe estar finalizado
      expect(deliveryNote.status).toBe('finalized')
      expect(deliveryNote.isFinalized()).toBe(true)
    })

    it('finalize() should work even if items do not have prices', () => {
      // Given: Albarán validado con items sin precio
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'validated',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When: Finalizamos
      deliveryNote.finalize()

      // Then: Debe estar finalizado
      expect(deliveryNote.status).toBe('finalized')
    })

    it('finalize() should throw error if status is not validated', () => {
      // Given: Albarán en draft
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      deliveryNote.addItem(createTestItem('item-1', 'Puerta'))

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.finalize()).toThrow(DeliveryNoteException)
      try {
        deliveryNote.finalize()
      } catch (error) {
        expect((error as DeliveryNoteException).code).toBe('INVALID_STATUS')
      }
    })

    it('reopen() should change status from validated to draft', () => {
      // Given: Albarán validado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'validated',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When: Reabrimos
      deliveryNote.reopen()

      // Then: Debe estar en draft
      expect(deliveryNote.status).toBe('draft')
      expect(deliveryNote.isEditable()).toBe(true)
    })

    it('reopen() should do nothing if already in draft', () => {
      // Given: Albarán en draft
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      // When: Reabrimos
      deliveryNote.reopen()

      // Then: Debe seguir en draft
      expect(deliveryNote.status).toBe('draft')
    })

    it('reopen() should throw error if delivery note is finalized', () => {
      // Given: Albarán finalizado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'finalized',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When/Then: Debe lanzar error
      expect(() => deliveryNote.reopen()).toThrow(DeliveryNoteException)
      try {
        deliveryNote.reopen()
      } catch (error) {
        expect((error as DeliveryNoteException).code).toBe('DELIVERY_NOTE_ALREADY_FINALIZED')
      }
    })
  })

  // 🧪 TEST 4: Métodos de consulta
  describe('Query Methods', () => {
    it('isEditable() should return true for draft status', () => {
      // Given: Albarán en draft
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      // When/Then: Debe ser editable
      expect(deliveryNote.isEditable()).toBe(true)
    })

    it('isEditable() should return false for validated status', () => {
      // Given: Albarán validado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'validated',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When/Then: No debe ser editable
      expect(deliveryNote.isEditable()).toBe(false)
    })

    it('isValidated() should return true for validated status', () => {
      // Given: Albarán validado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'validated',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When/Then: Debe estar validado
      expect(deliveryNote.isValidated()).toBe(true)
    })

    it('isFinalized() should return true for finalized status', () => {
      // Given: Albarán finalizado
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date(),
        status: 'finalized',
        items: [createTestItem('item-1', 'Puerta')]
      })

      // When/Then: Debe estar finalizado
      expect(deliveryNote.isFinalized()).toBe(true)
    })

    it('hasItems() should return true when delivery note has items', () => {
      // Given: Albarán con items
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      deliveryNote.addItem(createTestItem('item-1', 'Puerta'))

      // When/Then: Debe tener items
      expect(deliveryNote.hasItems()).toBe(true)
    })

    it('hasItems() should return false when delivery note has no items', () => {
      // Given: Albarán sin items
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      // When/Then: No debe tener items
      expect(deliveryNote.hasItems()).toBe(false)
    })

    it('itemCount() should return the number of items', () => {
      // Given: Albarán con 3 items
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      deliveryNote.addItem(createTestItem('item-1', 'Puerta'))
      deliveryNote.addItem(createTestItem('item-2', 'Ventana'))
      deliveryNote.addItem(createTestItem('item-3', 'Reja'))

      // When/Then: Debe contar correctamente
      expect(deliveryNote.itemCount()).toBe(3)
    })

    it('allItemsHavePrice() should return true when all items have price', () => {
      // Given: Albarán con todos los items con precio
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      deliveryNote.addItem(createTestItem('item-1', 'Puerta', new Price(100)))
      deliveryNote.addItem(createTestItem('item-2', 'Ventana', new Price(50)))

      // When/Then: Todos deben tener precio
      expect(deliveryNote.allItemsHavePrice()).toBe(true)
    })

    it('allItemsHavePrice() should return false when some items do not have price', () => {
      // Given: Albarán con items sin precio
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      deliveryNote.addItem(createTestItem('item-1', 'Puerta', new Price(100)))
      deliveryNote.addItem(createTestItem('item-2', 'Ventana')) // Sin precio

      // When/Then: No todos tienen precio
      expect(deliveryNote.allItemsHavePrice()).toBe(false)
    })

    it('itemsWithoutPrice() should return items without price', () => {
      // Given: Albarán con items con y sin precio
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      deliveryNote.addItem(createTestItem('item-1', 'Puerta', new Price(100)))
      deliveryNote.addItem(createTestItem('item-2', 'Ventana')) // Sin precio
      deliveryNote.addItem(createTestItem('item-3', 'Reja')) // Sin precio

      // When: Obtenemos items sin precio
      const itemsWithoutPrice = deliveryNote.itemsWithoutPrice()

      // Then: Debe devolver 2 items
      expect(itemsWithoutPrice).toHaveLength(2)
      expect(itemsWithoutPrice[0].id).toBe('item-2')
      expect(itemsWithoutPrice[1].id).toBe('item-3')
    })
  })

  // 🧪 TEST 5: Cálculos
  describe('Calculations', () => {
    it('calculateTotalAmount() should return total when all items have price', () => {
      // Given: Albarán con items con precio
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      // Item 1: precio 100, cantidad 2 = 200
      const item1 = new Item({
        id: 'item-1',
        name: 'Puerta',
        color: RACColor.createRAC('9010'),
        quantity: 2,
        measurements: Measurements.createWithLinearMeters(10),
        price: new Price(100)
      })

      // Item 2: precio 50, cantidad 3 = 150
      const item2 = new Item({
        id: 'item-2',
        name: 'Ventana',
        color: RACColor.createRAC('9010'),
        quantity: 3,
        measurements: Measurements.createWithLinearMeters(5),
        price: new Price(50)
      })

      deliveryNote.addItem(item1)
      deliveryNote.addItem(item2)

      // When: Calculamos el total
      const total = deliveryNote.calculateTotalAmount()

      // Then: Debe ser 200 + 150 = 350
      expect(total).not.toBeNull()
      expect(total?.getValue()).toBe(350)
    })

    it('calculateTotalAmount() should return null when some items do not have price', () => {
      // Given: Albarán con items sin precio
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      deliveryNote.addItem(createTestItem('item-1', 'Puerta', new Price(100)))
      deliveryNote.addItem(createTestItem('item-2', 'Ventana')) // Sin precio

      // When: Calculamos el total
      const total = deliveryNote.calculateTotalAmount()

      // Then: Debe ser null
      expect(total).toBeNull()
    })

    it('calculateTotalAmount() should return 0 when no items', () => {
      // Given: Albarán sin items
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      // When: Calculamos el total
      const total = deliveryNote.calculateTotalAmount()

      // Then: Debe ser 0 (lista vacía cumple "todos tienen precio")
      expect(total).not.toBeNull()
      expect(total?.getValue()).toBe(0)
    })
  })

  // 🧪 TEST 6: Comparación
  describe('Comparison', () => {
    it('equals() should return true for same ID', () => {
      // Given: Dos albaranes con mismo ID
      const deliveryNote1 = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      const deliveryNote2 = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0002', // Diferente número, mismo ID
        customerId: 'customer-2', customerName: 'Test Customer 2'
      })

      // When/Then: Deben ser iguales (mismo ID)
      expect(deliveryNote1.equals(deliveryNote2)).toBe(true)
    })

    it('equals() should return false for different ID', () => {
      // Given: Dos albaranes con diferente ID
      const deliveryNote1 = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      const deliveryNote2 = DeliveryNote.createDraft({
        id: 'dn-456',
        number: 'DN-2024-0001', // Mismo número, diferente ID
        customerId: 'customer-1', customerName: 'Test Customer'
      })

      // When/Then: NO deben ser iguales (diferente ID)
      expect(deliveryNote1.equals(deliveryNote2)).toBe(false)
    })
  })

  // 🧪 TEST 7: Serialización
  describe('Serialization', () => {
    it('toJSON() should return correct JSON representation', () => {
      // Given: Albarán completo
      const deliveryNote = new DeliveryNote({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: new Date('2024-01-15T10:00:00Z'),
        status: 'validated',
        items: [
          createTestItem('item-1', 'Puerta', new Price(100)),
          createTestItem('item-2', 'Ventana', new Price(50))
        ]
      })

      // When: Convertimos a JSON
      const json = deliveryNote.toJSON()

      // Then: Debe tener la estructura correcta
      expect(json).toEqual({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer',
        date: '2024-01-15T10:00:00.000Z',
        status: 'validated',
        items: expect.any(Array),
        itemCount: 2,
        totalAmount: 150,
        allHavePrice: true,
        itemsWithoutPrice: 0,
        createdAt: expect.any(String),
        notes: undefined
      })
    })

    it('toJSON() should show null totalAmount when items do not have price', () => {
      // Given: Albarán con items sin precio
      const deliveryNote = DeliveryNote.createDraft({
        id: 'dn-123',
        number: 'DN-2024-0001',
        customerId: 'customer-1', customerName: 'Test Customer'
      })
      deliveryNote.addItem(createTestItem('item-1', 'Puerta'))

      // When: Convertimos a JSON
      const json = deliveryNote.toJSON()

      // Then: Total debe ser null
      expect(json.totalAmount).toBeNull()
      expect(json.allHavePrice).toBe(false)
      expect(json.itemsWithoutPrice).toBe(1)
    })
  })
})
