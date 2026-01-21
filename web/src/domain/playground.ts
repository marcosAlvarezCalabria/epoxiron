/**
 * PLAYGROUND: Domain Layer Practice
 *
 * This file is for practicing and understanding how
 * entities and value objects work.
 *
 * To run it:
 * 1. Uncomment the code you want to test
 * 2. Run: npm run dev
 * 3. Open the browser console
 */

import { DeliveryNote } from './entities/DeliveryNote'
import { Item } from './entities/Item'
import { Price } from './value-objects/Price'
import { RACColor } from './value-objects/RACColor'
import { Measurements } from './value-objects/Measurements'

// ============================================
// PRACTICE 1: Value Objects (Immutable)
// ============================================

console.log('=== PRACTICE 1: Value Objects ===')

// Create a price
const price1 = new Price(50.99)
console.log('Price 1:', price1.getValue())  // 50.99
console.log('Price 1 formatted:', price1.toString())  // "50.99€"

// Try to create invalid price (uncomment to see error)
// const invalidPrice = new Price(-10)  // ❌ Error: Price cannot be negative

// Try to create price with many decimals (uncomment)
// const decimalPrice = new Price(10.999)  // ❌ Error: more than 2 decimals

// Compare prices by value
const price2 = new Price(50.99)
console.log('price1 === price2:', price1 === price2)  // false (different objects)
console.log('price1.equals(price2):', price1.equals(price2))  // true (same value)

// Operations with prices
const price3 = price1.add(new Price(10))
console.log('50.99 + 10 =', price3.getValue())  // 60.99

const price4 = price1.multiply(3)
console.log('50.99 * 3 =', price4.getValue())  // 152.97

// Value objects are immutable
console.log('Price 1 is still:', price1.getValue())  // 50.99 (didn't change)

// ============================================
// PRACTICE 2: RACColor
// ============================================

console.log('\n=== PRACTICE 2: RACColor ===')

// Create RAC color
const racColor = RACColor.createRAC('7035')
console.log('RAC Color:', racColor.toString())  // "RAC 7035"
console.log('Is RAC?:', racColor.isRACColor())  // true
console.log('Is special?:', racColor.isSpecialColor())  // false

// Create special color
const specialColor = RACColor.createSpecial('Metallic Blue')
console.log('Special color:', specialColor.toString())  // "Metallic Blue"
console.log('Is RAC?:', specialColor.isRACColor())  // false
console.log('Is special?:', specialColor.isSpecialColor())  // true

// Try to create invalid RAC color (uncomment)
// const invalidColor = RACColor.createRAC('ABC123')  // ❌ Error: invalid format

// ============================================
// PRACTICE 3: Measurements
// ============================================

console.log('\n=== PRACTICE 3: Measurements ===')

// No measurements (will use minimum rate)
const emptyMeasurements = Measurements.createWithoutMeasurements()
console.log('Empty measurements:', emptyMeasurements.toString())  // "No measurements"
console.log('Requires minimum rate?:', emptyMeasurements.requiresMinimumRate())  // true

// With linear meters
const linearMeasurements = Measurements.createWithLinearMeters(5.5)
console.log('Linear measurements:', linearMeasurements.toString())  // "5.5 lm"
console.log('Has measurements?:', linearMeasurements.hasMeasurements())  // true
console.log('Requires minimum rate?:', linearMeasurements.requiresMinimumRate())  // false

// With linear meters and thickness
const linearWithThickness = Measurements.createWithLinearMeters(5.5, 2)
console.log('Linear + thickness:', linearWithThickness.toString())  // "5.5 lm, thickness 2mm"
console.log('Has special thickness?:', linearWithThickness.hasSpecialThickness())  // true

// With square meters
const squareMeasurements = Measurements.createWithSquareMeters(10.25)
console.log('Square measurements:', squareMeasurements.toString())  // "10.25 m²"

// ============================================
// PRACTICE 4: Entity Item
// ============================================

console.log('\n=== PRACTICE 4: Entity Item ===')

// Create an item
const item1 = new Item({
  id: 'item-1',
  name: 'Steel Tube',
  color: RACColor.createRAC('7035'),
  quantity: 10,
  measurements: Measurements.createWithLinearMeters(5.5),
  price: new Price(15.50)
})

console.log('Item:', item1.name)
console.log('Color:', item1.color.toString())
console.log('Quantity:', item1.quantity)
console.log('Measurements:', item1.measurements.toString())
console.log('Has price?:', item1.hasPrice())  // true
console.log('Unit price:', item1.price?.getValue())  // 15.50
console.log('Total price:', item1.calculateTotalPrice()?.getValue())  // 155 (15.50 * 10)

// Change properties (entities are mutable)
item1.changeQuantity(15)
console.log('New quantity:', item1.quantity)  // 15
console.log('New total price:', item1.calculateTotalPrice()?.getValue())  // 232.5

item1.assignPrice(new Price(20))
console.log('New unit price:', item1.price?.getValue())  // 20
console.log('New total price:', item1.calculateTotalPrice()?.getValue())  // 300 (20 * 15)

// Create item without price
const item2 = new Item({
  id: 'item-2',
  name: 'Special Structure',
  color: RACColor.createSpecial('Metallic Blue'),
  quantity: 1,
  measurements: Measurements.createWithoutMeasurements(),
})

console.log('Item 2:', item2.name)
console.log('Has price?:', item2.hasPrice())  // false
console.log('Special color?:', item2.hasSpecialColor())  // true
console.log('Requires minimum rate?:', item2.requiresMinimumRate())  // true

// Compare items by ID (not by properties)
const item3 = new Item({
  id: 'item-1',  // Same ID as item1
  name: 'Other name',
  color: RACColor.createRAC('9010'),
  quantity: 1,
  measurements: Measurements.createWithoutMeasurements(),
})

console.log('item1.equals(item3):', item1.equals(item3))  // true (same ID)

// ============================================
// PRACTICE 5: Entity DeliveryNote (Aggregate)
// ============================================

console.log('\n=== PRACTICE 5: Entity DeliveryNote ===')

// Create delivery note in draft
const deliveryNote = DeliveryNote.createDraft({
  id: 'dn-123',
  number: 'DN-2024-0001',
  customerId: 'customer-456',
  customerName: 'Test Customer'
})

console.log('Delivery Note:', deliveryNote.number)
console.log('Status:', deliveryNote.status)  // 'draft'
console.log('Is editable?:', deliveryNote.isEditable())  // true
console.log('Item count:', deliveryNote.itemCount())  // 0

// Add items
deliveryNote.addItem(item1)
deliveryNote.addItem(item2)
console.log('Item count:', deliveryNote.itemCount())  // 2
console.log('All have price?:', deliveryNote.allItemsHavePrice())  // false

// Assign price to item2
deliveryNote.updateItemPrice('item-2', new Price(200))
console.log('All have price?:', deliveryNote.allItemsHavePrice())  // true

// Calculate total amount
const totalAmount = deliveryNote.calculateTotalAmount()
console.log('Total amount:', totalAmount?.getValue())  // 500 (300 + 200)

// Validate delivery note
console.log('\n--- Validate delivery note ---')
deliveryNote.validate()
console.log('Status:', deliveryNote.status)  // 'validated'
console.log('Is editable?:', deliveryNote.isEditable())  // false

// Try to add item → ERROR
console.log('\n--- Try to add item in validated status ---')
try {
  const newItem = new Item({
    id: 'new-item',
    name: 'New Item',
    color: RACColor.createRAC('7035'),
    quantity: 1,
    measurements: Measurements.createWithoutMeasurements(),
  })
  deliveryNote.addItem(newItem)
} catch (error) {
  if (error instanceof Error) {
    console.log('❌ Expected error:', error.message)
  }
}

// But CAN change prices in validated status
console.log('\n--- Change price in validated status ---')
deliveryNote.updateItemPrice('item-1', new Price(25))
console.log('New price item 1:', item1.price?.getValue())  // 25
console.log('New total amount:', deliveryNote.calculateTotalAmount()?.getValue())  // 575

// Finalize
console.log('\n--- Finalize delivery note ---')
deliveryNote.finalize()
console.log('Status:', deliveryNote.status)  // 'finalized'

// Try to change price → ERROR
console.log('\n--- Try to change price in finalized status ---')
try {
  deliveryNote.updateItemPrice('item-1', new Price(30))
} catch (error) {
  if (error instanceof Error) {
    console.log('❌ Expected error:', error.message)
  }
}

// ============================================
// PRACTICE 6: State Machine
// ============================================

console.log('\n=== PRACTICE 6: State Machine ===')

const deliveryNote2 = DeliveryNote.createDraft({
  id: 'dn-124',
  number: 'DN-2024-0002',
  customerId: 'customer-789',
  customerName: 'Test Customer 2'
})

// Add item
deliveryNote2.addItem(new Item({
  id: 'i1',
  name: 'Test Item',
  color: RACColor.createRAC('7035'),
  quantity: 1,
  measurements: Measurements.createWithLinearMeters(1),
  price: new Price(10)
}))

console.log('Initial status:', deliveryNote2.status)  // 'draft'

// Validate
deliveryNote2.validate()
console.log('After validate:', deliveryNote2.status)  // 'validated'

// Reopen
deliveryNote2.reopen()
console.log('After reopen:', deliveryNote2.status)  // 'draft'

// Validate and finalize
deliveryNote2.validate()
deliveryNote2.finalize()
console.log('After finalize:', deliveryNote2.status)  // 'finalized'

// Try to reopen finalized → ERROR
console.log('\n--- Try to reopen finalized ---')
try {
  deliveryNote2.reopen()
} catch (error) {
  if (error instanceof Error) {
    console.log('❌ Expected error:', error.message)
  }
}

console.log('\n✅ Practice completed. Check the browser console.')
