/**
 * ENTITY: Customer
 * Represents a customer in the system with business logic.
 * Location: Domain Layer
 * Dependencies: None (pure TypeScript)
 */

export interface SpecialPiece {
  name: string
  price: number
}

export interface CustomerProps {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string

  // Pricing
  pricePerLinearMeter: number
  pricePerSquareMeter: number
  minimumRate: number
  specialPieces: SpecialPiece[]

  createdAt: Date
  updatedAt: Date
}

export class Customer {
  private readonly _id: string
  private _name: string
  private _email?: string
  private _phone?: string
  private _address?: string
  private _notes?: string

  // Pricing
  private _pricePerLinearMeter: number
  private _pricePerSquareMeter: number
  private _minimumRate: number
  private _specialPieces: SpecialPiece[]

  private readonly _createdAt: Date
  private _updatedAt: Date

  constructor(props: CustomerProps) {
    // Validate name
    const trimmedName = props.name.trim()
    if (trimmedName.length === 0) throw new Error('Name cannot be empty')
    if (trimmedName.length < 2) throw new Error('Name must be at least 2 characters')

    this._id = props.id
    this._name = trimmedName
    this._email = props.email
    this._phone = props.phone
    this._address = props.address
    this._notes = props.notes

    // Pricing
    this._pricePerLinearMeter = props.pricePerLinearMeter
    this._pricePerSquareMeter = props.pricePerSquareMeter
    this._minimumRate = props.minimumRate
    this._specialPieces = props.specialPieces

    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  // Getters
  get id(): string { return this._id }
  get name(): string { return this._name }
  get email(): string | undefined { return this._email }
  get phone(): string | undefined { return this._phone }
  get address(): string | undefined { return this._address }
  get notes(): string | undefined { return this._notes }

  get pricePerLinearMeter(): number { return this._pricePerLinearMeter }
  get pricePerSquareMeter(): number { return this._pricePerSquareMeter }
  get minimumRate(): number { return this._minimumRate }
  get specialPieces(): SpecialPiece[] { return [...this._specialPieces] }

  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }

  // Business logic
  changeName(newName: string): void {
    const trimmedName = newName.trim()
    if (trimmedName.length < 2) throw new Error('Name must be at least 2 characters')
    this._name = trimmedName
    this._updatedAt = new Date()
  }

  changeContactInfo(email?: string, phone?: string, address?: string, notes?: string): void {
    if (email !== undefined) this._email = email.trim()
    if (phone !== undefined) this._phone = phone.trim()
    if (address !== undefined) this._address = address.trim()
    if (notes !== undefined) this._notes = notes.trim()
    this._updatedAt = new Date()
  }

  updatePricing(linear: number, square: number, min: number, special: SpecialPiece[]): void {
    if (linear < 0 || square < 0 || min < 0) throw new Error('Prices cannot be negative')

    this._pricePerLinearMeter = linear
    this._pricePerSquareMeter = square
    this._minimumRate = min
    this._specialPieces = [...special]
    this._updatedAt = new Date()
  }

  equals(other: Customer): boolean {
    return this._id === other._id
  }
}
