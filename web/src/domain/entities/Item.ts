/**
 * ENTITY: Item
 *
 * Represents a metal piece that the customer delivers for painting.
 *
 * Location: Domain Layer
 * Reason: Business entity with identity and behavior
 * Dependencies: RACColor, Measurements, Price (Value Objects)
 *
 * Business rules (according to design.md):
 * - Name: required
 * - Color: required (can be RAC or special)
 * - Quantity: required
 * - Measurements: optional (if none, uses minimum rate)
 * - Price: optional (can be calculated later)
 *
 * What is an Entity?
 * - Object WITH unique identity (ID)
 * - Can change its properties (price, measurements)
 * - Two items with the same name but different ID are DIFFERENT
 */

import { RACColor } from '../value-objects/RACColor'
import { Measurements } from '../value-objects/Measurements'
import { Price } from '../value-objects/Price'

export interface ItemProps {
  id: string
  name: string
  color: RACColor  // Can be RAC or special
  quantity: number
  measurements: Measurements  // Can be "no measurements" (will use minimum rate)
  price?: Price   // Optional: can be calculated later
  isHighThickness?: boolean
  hasPrimer?: boolean
}

export class Item {
  private readonly _id: string
  private _name: string
  private _color: RACColor
  private _quantity: number
  private _measurements: Measurements
  private _price: Price | null
  private _isHighThickness: boolean
  private _hasPrimer: boolean

  constructor(props: ItemProps) {
    // Validations
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('Item must have an ID')
    }

    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Item must have a name')
    }

    if (props.quantity <= 0) {
      throw new Error('Quantity must be greater than 0')
    }

    this._id = props.id
    this._name = props.name.trim()
    this._color = props.color  // Already validated in RACColor
    this._quantity = props.quantity
    this._measurements = props.measurements  // Can be "no measurements"
    this._price = props.price ?? null
    this._isHighThickness = props.isHighThickness ?? false
    this._hasPrimer = props.hasPrimer ?? false
  }

  // Getters (readonly from outside)
  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get color(): RACColor {
    return this._color
  }

  get quantity(): number {
    return this._quantity
  }

  get measurements(): Measurements {
    return this._measurements
  }

  get price(): Price | null {
    return this._price
  }

  get isHighThickness(): boolean {
    return this._isHighThickness
  }

  get hasPrimer(): boolean {
    return this._hasPrimer
  }

  // Methods to change properties (entities are mutable)

  changeName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty')
    }
    this._name = newName.trim()
  }

  changeColor(newColor: RACColor): void {
    this._color = newColor
  }

  changeQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be greater than 0')
    }
    this._quantity = newQuantity
  }

  changeMeasurements(newMeasurements: Measurements): void {
    this._measurements = newMeasurements
  }

  setHighThickness(value: boolean): void {
    this._isHighThickness = value
  }

  setHasPrimer(value: boolean): void {
    this._hasPrimer = value
  }

  assignPrice(price: Price): void {
    this._price = price
  }

  removePrice(): void {
    this._price = null
  }

  // Business rules (methods that answer questions about the business)

  hasPrice(): boolean {
    return this._price !== null
  }

  hasSpecialColor(): boolean {
    return this._color.isSpecialColor()
  }

  hasMeasurements(): boolean {
    return this._measurements.hasMeasurements()
  }

  requiresMinimumRate(): boolean {
    return this._measurements.requiresMinimumRate()
  }

  hasSpecialThickness(): boolean {
    return this._isHighThickness
  }

  calculateTotalPrice(): Price | null {
    if (!this._price) {
      return null
    }
    return this._price.multiply(this._quantity)
  }

  // Comparison by ID (entities are compared by identity, not properties)
  equals(other: Item): boolean {
    return this._id === other._id
  }

  // JSON serialization (when sent to backend or saved)
  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      color: this._color.toString(),
      colorIsRAC: this._color.isRACColor(),
      quantity: this._quantity,
      measurements: this._measurements.toString(),
      linearMeters: this._measurements.getLinearMeters(),
      squareMeters: this._measurements.getSquareMeters(),
      thickness: this._measurements.getThickness(),
      isHighThickness: this._isHighThickness,
      hasPrimer: this._hasPrimer,
      price: this._price?.getValue() ?? null,
      totalPrice: this.calculateTotalPrice()?.getValue() ?? null,
    }
  }
}
