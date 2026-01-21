/**
 * 🔴 RED PHASE: Tests for Item Entity
 *
 * 📝 QUÉ: Tests que definen cómo debe comportarse la entidad Item
 * 🎯 POR QUÉ: TDD - escribimos el test ANTES del código
 * 🔍 CÓMO: Definimos todas las reglas de negocio que debe cumplir
 *
 * 🏗️ ANALOGÍA: Como el inspector que define los requisitos ANTES de construir
 */

import { describe, it, expect } from 'vitest'
import { Item } from '../Item'
import { RACColor } from '../../value-objects/RACColor'
import { Measurements } from '../../value-objects/Measurements'
import { Price } from '../../value-objects/Price'

describe('Item Entity', () => {
  // 🧪 TEST 1: Crear un item básico
  describe('Constructor', () => {
    it('should create an item with required fields and no price', () => {
      // Given: Datos mínimos para crear un item
      const itemData = {
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      }

      // When: Creamos el item
      const item = new Item(itemData)

      // Then: Debe tener las propiedades correctas
      expect(item.id).toBe('123')
      expect(item.name).toBe('Puerta metálica')
      expect(item.color.getCode()).toBe('9010')
      expect(item.quantity).toBe(5)
      expect(item.measurements.getLinearMeters()).toBe(10)
      expect(item.price).toBeNull()
    })

    it('should create an item with optional price', () => {
      // Given: Datos con precio
      const itemData = {
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10),
        price: new Price(100)
      }

      // When: Creamos el item
      const item = new Item(itemData)

      // Then: Debe tener precio
      expect(item.price).not.toBeNull()
      expect(item.price?.getValue()).toBe(100)
    })

    it('should create an item with special color', () => {
      // Given: Datos con color especial
      const itemData = {
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createSpecial('Azul metalizado'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      }

      // When: Creamos el item
      const item = new Item(itemData)

      // Then: Debe tener color especial
      expect(item.color.isSpecialColor()).toBe(true)
      expect(item.color.getCode()).toBe('Azul metalizado')
    })

    it('should create an item without measurements', () => {
      // Given: Datos sin medidas (usa tarifa mínima)
      const itemData = {
        id: '123',
        name: 'Pieza pequeña',
        color: RACColor.createRAC('9010'),
        quantity: 3,
        measurements: Measurements.createWithoutMeasurements()
      }

      // When: Creamos el item
      const item = new Item(itemData)

      // Then: No debe tener medidas
      expect(item.measurements.hasMeasurements()).toBe(false)
    })

    it('should create an item with square meters', () => {
      // Given: Datos con metros cuadrados
      const itemData = {
        id: '123',
        name: 'Panel',
        color: RACColor.createRAC('9010'),
        quantity: 2,
        measurements: Measurements.createWithSquareMeters(5.5)
      }

      // When: Creamos el item
      const item = new Item(itemData)

      // Then: Debe tener metros cuadrados
      expect(item.measurements.getSquareMeters()).toBe(5.5)
      expect(item.measurements.getLinearMeters()).toBeNull()
    })

    it('should create an item with special thickness', () => {
      // Given: Datos con grosor especial
      const itemData = {
        id: '123',
        name: 'Tubo',
        color: RACColor.createRAC('9010'),
        quantity: 10,
        measurements: Measurements.createWithLinearMeters(20, 5)
      }

      // When: Creamos el item
      const item = new Item(itemData)

      // Then: Debe tener grosor especial
      expect(item.measurements.getThickness()).toBe(5)
    })

    it('should throw error if id is empty', () => {
      // Given: ID vacío
      const itemData = {
        id: '',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      }

      // When/Then: Debe lanzar error
      expect(() => new Item(itemData)).toThrow('Item must have an ID')
    })

    it('should throw error if id is only whitespace', () => {
      // Given: ID solo espacios
      const itemData = {
        id: '   ',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      }

      // When/Then: Debe lanzar error
      expect(() => new Item(itemData)).toThrow('Item must have an ID')
    })

    it('should throw error if name is empty', () => {
      // Given: Nombre vacío
      const itemData = {
        id: '123',
        name: '',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      }

      // When/Then: Debe lanzar error
      expect(() => new Item(itemData)).toThrow('Item must have a name')
    })

    it('should throw error if name is only whitespace', () => {
      // Given: Nombre solo espacios
      const itemData = {
        id: '123',
        name: '   ',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      }

      // When/Then: Debe lanzar error
      expect(() => new Item(itemData)).toThrow('Item must have a name')
    })

    it('should trim whitespace from name', () => {
      // Given: Nombre con espacios
      const itemData = {
        id: '123',
        name: '  Puerta metálica  ',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      }

      // When: Creamos el item
      const item = new Item(itemData)

      // Then: Debe eliminar espacios
      expect(item.name).toBe('Puerta metálica')
    })

    it('should throw error if quantity is zero', () => {
      // Given: Cantidad cero
      const itemData = {
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 0,
        measurements: Measurements.createWithLinearMeters(10)
      }

      // When/Then: Debe lanzar error
      expect(() => new Item(itemData)).toThrow('Quantity must be greater than 0')
    })

    it('should throw error if quantity is negative', () => {
      // Given: Cantidad negativa
      const itemData = {
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: -5,
        measurements: Measurements.createWithLinearMeters(10)
      }

      // When/Then: Debe lanzar error
      expect(() => new Item(itemData)).toThrow('Quantity must be greater than 0')
    })
  })

  // 🧪 TEST 2: Métodos de negocio
  describe('Business Logic Methods', () => {
    it('hasPrice() should return true when item has a price', () => {
      // Given: Item con precio
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10),
        price: new Price(100)
      })

      // When/Then: Debe tener precio
      expect(item.hasPrice()).toBe(true)
    })

    it('hasPrice() should return false when item has no price', () => {
      // Given: Item sin precio
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: No debe tener precio
      expect(item.hasPrice()).toBe(false)
    })

    it('hasSpecialColor() should return true for special color', () => {
      // Given: Item con color especial
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createSpecial('Azul metalizado'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: Debe tener color especial
      expect(item.hasSpecialColor()).toBe(true)
    })

    it('hasSpecialColor() should return false for RAC color', () => {
      // Given: Item con color RAC
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: No debe tener color especial
      expect(item.hasSpecialColor()).toBe(false)
    })

    it('hasMeasurements() should return true when item has linear meters', () => {
      // Given: Item con metros lineales
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: Debe tener medidas
      expect(item.hasMeasurements()).toBe(true)
    })

    it('hasMeasurements() should return true when item has square meters', () => {
      // Given: Item con metros cuadrados
      const item = new Item({
        id: '123',
        name: 'Panel',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithSquareMeters(5.5)
      })

      // When/Then: Debe tener medidas
      expect(item.hasMeasurements()).toBe(true)
    })

    it('hasMeasurements() should return false when item has no measurements', () => {
      // Given: Item sin medidas
      const item = new Item({
        id: '123',
        name: 'Pieza pequeña',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithoutMeasurements()
      })

      // When/Then: No debe tener medidas
      expect(item.hasMeasurements()).toBe(false)
    })

    it('requiresMinimumRate() should return true when item has no measurements', () => {
      // Given: Item sin medidas
      const item = new Item({
        id: '123',
        name: 'Pieza pequeña',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithoutMeasurements()
      })

      // When/Then: Debe requerir tarifa mínima
      expect(item.requiresMinimumRate()).toBe(true)
    })

    it('requiresMinimumRate() should return false when item has measurements', () => {
      // Given: Item con medidas
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: No debe requerir tarifa mínima
      expect(item.requiresMinimumRate()).toBe(false)
    })

    it('hasSpecialThickness() should return true when item has thickness', () => {
      // Given: Item con grosor especial
      const item = new Item({
        id: '123',
        name: 'Tubo',
        color: RACColor.createRAC('9010'),
        quantity: 10,
        measurements: Measurements.createWithLinearMeters(20, 5)
      })

      // When/Then: Debe tener grosor especial
      expect(item.hasSpecialThickness()).toBe(true)
    })

    it('hasSpecialThickness() should return false when item has no thickness', () => {
      // Given: Item sin grosor especial
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: No debe tener grosor especial
      expect(item.hasSpecialThickness()).toBe(false)
    })

    it('calculateTotalPrice() should return total price when item has price', () => {
      // Given: Item con precio y cantidad 5
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10),
        price: new Price(100)
      })

      // When: Calculamos el precio total
      const totalPrice = item.calculateTotalPrice()

      // Then: Debe ser precio * cantidad = 100 * 5 = 500
      expect(totalPrice).not.toBeNull()
      expect(totalPrice?.getValue()).toBe(500)
    })

    it('calculateTotalPrice() should return null when item has no price', () => {
      // Given: Item sin precio
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When: Calculamos el precio total
      const totalPrice = item.calculateTotalPrice()

      // Then: Debe ser null
      expect(totalPrice).toBeNull()
    })
  })

  // 🧪 TEST 3: Métodos para modificar
  describe('Mutation Methods', () => {
    it('changeName() should update the name', () => {
      // Given: Item existente
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When: Cambiamos el nombre
      item.changeName('Ventana metálica')

      // Then: Debe tener el nuevo nombre
      expect(item.name).toBe('Ventana metálica')
    })

    it('changeName() should throw error if new name is empty', () => {
      // Given: Item existente
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: Debe lanzar error
      expect(() => item.changeName('')).toThrow('Name cannot be empty')
    })

    it('changeName() should trim whitespace from new name', () => {
      // Given: Item existente
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When: Cambiamos el nombre con espacios
      item.changeName('  Ventana metálica  ')

      // Then: Debe eliminar espacios
      expect(item.name).toBe('Ventana metálica')
    })

    it('changeColor() should update the color', () => {
      // Given: Item existente con color RAC
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When: Cambiamos a color especial
      const nuevoColor = RACColor.createSpecial('Azul metalizado')
      item.changeColor(nuevoColor)

      // Then: Debe tener el nuevo color
      expect(item.color.getCode()).toBe('Azul metalizado')
      expect(item.color.isSpecialColor()).toBe(true)
    })

    it('changeQuantity() should update the quantity', () => {
      // Given: Item existente
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When: Cambiamos la cantidad
      item.changeQuantity(10)

      // Then: Debe tener la nueva cantidad
      expect(item.quantity).toBe(10)
    })

    it('changeQuantity() should throw error if new quantity is zero', () => {
      // Given: Item existente
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: Debe lanzar error
      expect(() => item.changeQuantity(0)).toThrow('Quantity must be greater than 0')
    })

    it('changeQuantity() should throw error if new quantity is negative', () => {
      // Given: Item existente
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: Debe lanzar error
      expect(() => item.changeQuantity(-3)).toThrow('Quantity must be greater than 0')
    })

    it('changeMeasurements() should update the measurements', () => {
      // Given: Item existente con metros lineales
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When: Cambiamos a metros cuadrados
      const nuevasMedidas = Measurements.createWithSquareMeters(15)
      item.changeMeasurements(nuevasMedidas)

      // Then: Debe tener las nuevas medidas
      expect(item.measurements.getSquareMeters()).toBe(15)
      expect(item.measurements.getLinearMeters()).toBeNull()
    })

    it('assignPrice() should assign a price', () => {
      // Given: Item sin precio
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When: Asignamos precio
      item.assignPrice(new Price(200))

      // Then: Debe tener precio
      expect(item.price).not.toBeNull()
      expect(item.price?.getValue()).toBe(200)
      expect(item.hasPrice()).toBe(true)
    })

    it('removePrice() should remove the price', () => {
      // Given: Item con precio
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10),
        price: new Price(100)
      })

      // When: Quitamos el precio
      item.removePrice()

      // Then: No debe tener precio
      expect(item.price).toBeNull()
      expect(item.hasPrice()).toBe(false)
    })
  })

  // 🧪 TEST 4: Comparación
  describe('Comparison', () => {
    it('equals() should return true for same ID', () => {
      // Given: Dos items con mismo ID
      const item1 = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      const item2 = new Item({
        id: '123',
        name: 'Otro nombre', // Diferente nombre, mismo ID
        color: RACColor.createRAC('7016'),
        quantity: 10,
        measurements: Measurements.createWithSquareMeters(20)
      })

      // When/Then: Deben ser iguales (mismo ID)
      expect(item1.equals(item2)).toBe(true)
    })

    it('equals() should return false for different ID', () => {
      // Given: Dos items con diferente ID
      const item1 = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      const item2 = new Item({
        id: '456',
        name: 'Puerta metálica', // Mismo nombre, diferente ID
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When/Then: NO deben ser iguales (diferente ID)
      expect(item1.equals(item2)).toBe(false)
    })
  })

  // 🧪 TEST 5: Serialización
  describe('Serialization', () => {
    it('toJSON() should return correct JSON representation with all fields', () => {
      // Given: Item completo con todas las propiedades
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10, 3),
        price: new Price(100)
      })

      // When: Convertimos a JSON
      const json = item.toJSON()

      // Then: Debe tener la estructura correcta
      expect(json).toEqual({
        id: '123',
        name: 'Puerta metálica',
        color: 'RAC 9010',
        colorIsRAC: true,
        quantity: 5,
        measurements: '10 ml, thickness 3mm',
        linearMeters: 10,
        squareMeters: null,
        thickness: 3,
        isHighThickness: true,
        hasPrimer: false,
        price: 100,
        totalPrice: 500
      })
    })

    it('toJSON() should return correct JSON for special color', () => {
      // Given: Item con color especial
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createSpecial('Azul metalizado'),
        quantity: 2,
        measurements: Measurements.createWithLinearMeters(5),
        price: new Price(150)
      })

      // When: Convertimos a JSON
      const json = item.toJSON()

      // Then: Debe indicar que no es RAC
      expect(json.color).toBe('Azul metalizado')
      expect(json.colorIsRAC).toBe(false)
    })

    it('toJSON() should return correct JSON for item without measurements', () => {
      // Given: Item sin medidas
      const item = new Item({
        id: '123',
        name: 'Pieza pequeña',
        color: RACColor.createRAC('9010'),
        quantity: 3,
        measurements: Measurements.createWithoutMeasurements(),
        price: new Price(50)
      })

      // When: Convertimos a JSON
      const json = item.toJSON()

      // Then: Debe mostrar "No measurements"
      expect(json.measurements).toBe('No measurements')
      expect(json.linearMeters).toBeNull()
      expect(json.squareMeters).toBeNull()
      expect(json.thickness).toBeNull()
    })

    it('toJSON() should return null price when item has no price', () => {
      // Given: Item sin precio
      const item = new Item({
        id: '123',
        name: 'Puerta metálica',
        color: RACColor.createRAC('9010'),
        quantity: 5,
        measurements: Measurements.createWithLinearMeters(10)
      })

      // When: Convertimos a JSON
      const json = item.toJSON()

      // Then: Precio debe ser null
      expect(json.price).toBeNull()
      expect(json.totalPrice).toBeNull()
    })

    it('toJSON() should return correct JSON for square meters', () => {
      // Given: Item con metros cuadrados
      const item = new Item({
        id: '123',
        name: 'Panel',
        color: RACColor.createRAC('9010'),
        quantity: 4,
        measurements: Measurements.createWithSquareMeters(8.5, 2),
        price: new Price(75)
      })

      // When: Convertimos a JSON
      const json = item.toJSON()

      // Then: Debe tener metros cuadrados
      expect(json.linearMeters).toBeNull()
      expect(json.squareMeters).toBe(8.5)
      expect(json.thickness).toBe(2)
      expect(json.measurements).toBe('8.5 m², thickness 2mm')
    })
  })
})
