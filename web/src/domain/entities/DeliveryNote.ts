/**
 * ENTITY: DeliveryNote
 *
 * Represents a delivery note for receiving customer items.
 *
 * Location: Domain Layer
 * Reason: Aggregate root entity (contains items)
 * Dependencies: Item (Entity), Price (Value Object), DeliveryNoteException
 *
 * Business rules (according to design.md):
 * - Auto-generated delivery note number
 * - Auto-complete date
 * - Cannot mix items from different customers
 * - Status flow: draft → validated → finalized
 * - Draft: editable
 * - Validated: locked except prices
 * - Finalized: ready to export
 *
 * What is an Aggregate?
 * - DeliveryNote is the "aggregate root"
 * - Contains multiple Items
 * - Items DO NOT exist without a DeliveryNote
 * - Items are only accessed through the DeliveryNote
 */

import { Item } from './Item'
import { Price } from '../value-objects/Price'
import { DeliveryNoteException } from '../exceptions/DeliveryNoteException'

export type DeliveryNoteStatus = 'draft' | 'validated' | 'finalized'

export interface DeliveryNoteProps {
  id: string
  number: string        // Auto-generated number (e.g., "DN-2024-0001")
  customerId: string
  customerName: string
  date: Date
  status: DeliveryNoteStatus
  items: Item[]
  notes?: string
  createdAt?: Date
}

export class DeliveryNote {
  private readonly _id: string
  private readonly _number: string
  private readonly _customerId: string
  private readonly _customerName: string
  private readonly _date: Date
  private _status: DeliveryNoteStatus
  private _items: Item[]
  private _notes?: string
  private _createdAt: Date

  constructor(props: DeliveryNoteProps) {
    // Validations
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('DeliveryNote must have an ID')
    }

    if (!props.number || props.number.trim().length === 0) {
      throw new Error('DeliveryNote must have a number')
    }

    if (!props.customerId || props.customerId.trim().length === 0) {
      throw DeliveryNoteException.withoutCustomer()
    }

    this._id = props.id
    this._number = props.number
    this._customerId = props.customerId
    this._customerName = props.customerName || 'Unknown Customer' // Fallback
    this._date = props.date
    this._status = props.status
    this._items = props.items
    this._notes = props.notes
    this._createdAt = props.createdAt || new Date()
  }

  // Getters
  get id(): string {
    return this._id
  }

  get number(): string {
    return this._number
  }

  get customerId(): string {
    return this._customerId
  }

  get customerName(): string {
    return this._customerName
  }

  get date(): Date {
    return this._date
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get status(): DeliveryNoteStatus {
    return this._status
  }

  get items(): ReadonlyArray<Item> {
    return this._items
  }

  get notes(): string | undefined {
    return this._notes
  }

  // Methods to manage items (aggregate)

  addItem(item: Item): void {
    // Validate that the delivery note is editable
    if (!this.isEditable()) {
      throw DeliveryNoteException.notEditable()
    }

    this._items.push(item)
  }

  removeItem(itemId: string): void {
    // Validate that the delivery note is editable
    if (!this.isEditable()) {
      throw DeliveryNoteException.notEditable()
    }

    const index = this._items.findIndex((i) => i.id === itemId)
    if (index === -1) {
      throw DeliveryNoteException.itemNotFound(itemId)
    }

    this._items.splice(index, 1)
  }

  getItem(itemId: string): Item {
    const item = this._items.find((i) => i.id === itemId)
    if (!item) {
      throw DeliveryNoteException.itemNotFound(itemId)
    }
    return item
  }

  updateItemPrice(itemId: string, price: Price): void {
    // In validated status, prices can be edited
    if (this._status === 'finalized') {
      throw DeliveryNoteException.alreadyFinalized()
    }

    const item = this.getItem(itemId)
    item.assignPrice(price)
  }

  // Status transition methods

  validate(): void {
    // Can only validate from draft
    if (this._status !== 'draft') {
      throw DeliveryNoteException.invalidStatus(this._status, 'validated')
    }

    // Validate that it has items
    if (this._items.length === 0) {
      throw DeliveryNoteException.withoutItems()
    }

    // Validate that all items have measurements or name and PRICE
    if (!this.allItemsHavePrice()) {
      // Although old design said "may not have price", user now enforces strict pricing.
      // However, Item.hasPrice() depends on having a value.
      // If calculator always returns a value (even 0?), we might need to check > 0.
      // But let's stick to hasPrice() existence check for now as a first step.
      // Actually, if mapped from UI, price might be undefined if no match.
    }
    // Strict business rule: All items must have a price before validation
    if (!this.allItemsHavePrice()) {
      throw DeliveryNoteException.itemsWithoutPrice(this.itemsWithoutPrice().map(i => i.name).join(', '))
    }

    this._status = 'validated'
  }

  finalize(): void {
    // Can only finalize from validated
    if (this._status !== 'validated') {
      throw DeliveryNoteException.invalidStatus(this._status, 'finalized')
    }

    // Can finalize even if prices are missing (will remain as pending)
    this._status = 'finalized'
  }

  reopen(): void {
    // Can only reopen if validated (not finalized)
    if (this._status === 'finalized') {
      throw DeliveryNoteException.alreadyFinalized()
    }

    if (this._status === 'draft') {
      return // Already open
    }

    this._status = 'draft'
  }

  // Business rules (questions about business status)

  isEditable(): boolean {
    return this._status === 'draft'
  }

  isValidated(): boolean {
    return this._status === 'validated'
  }

  isFinalized(): boolean {
    return this._status === 'finalized'
  }

  hasItems(): boolean {
    return this._items.length > 0
  }

  itemCount(): number {
    return this._items.length
  }

  allItemsHavePrice(): boolean {
    return this._items.every((i) => i.hasPrice())
  }

  itemsWithoutPrice(): Item[] {
    return this._items.filter((i) => !i.hasPrice())
  }

  calculateTotalAmount(): Price | null {
    if (!this.allItemsHavePrice()) {
      return null
    }

    let total = new Price(0)
    for (const item of this._items) {
      const totalPrice = item.calculateTotalPrice()
      if (totalPrice) {
        total = total.add(totalPrice)
      }
    }

    return total
  }

  // Comparison by ID
  equals(other: DeliveryNote): boolean {
    return this._id === other._id
  }

  // Serialization
  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      number: this._number,
      customerId: this._customerId,
      customerName: this._customerName,
      date: this._date.toISOString(),
      status: this._status,
      items: this._items.map((i) => i.toJSON()),
      itemCount: this.itemCount(),
      totalAmount: this.calculateTotalAmount()?.getValue() ?? null,
      notes: this._notes,
      createdAt: this._createdAt.toISOString(),
      allHavePrice: this.allItemsHavePrice(),
      itemsWithoutPrice: this.itemsWithoutPrice().length,
    }
  }

  // Factory method to create a draft delivery note
  static createDraft(params: {
    id: string
    number: string
    customerId: string
    customerName: string
    notes?: string
  }): DeliveryNote {
    return new DeliveryNote({
      id: params.id,
      number: params.number,
      customerId: params.customerId,
      customerName: params.customerName,
      date: new Date(),
      createdAt: new Date(),
      status: 'draft',
      items: [],
      notes: params.notes
    })
  }
}
