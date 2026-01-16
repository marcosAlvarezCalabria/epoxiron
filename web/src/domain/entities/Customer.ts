/**
 * ENTITY: Customer
 * Represents a customer in the system with business logic.
 * Location: Domain Layer
 * Dependencies: None (pure TypeScript)
 */

export interface CustomerProps {
  id: string
  name: string
  email?: string
  phone?: string
  rateId?: string
  createdAt: Date
  updatedAt: Date
}

export class Customer {
  private readonly _id: string
  private _name: string
  private _email?: string
  private _phone?: string
  private _rateId?: string
  private readonly _createdAt: Date
  private _updatedAt: Date

  constructor(props: CustomerProps) {
    // Validate name
    const trimmedName = props.name.trim()

    if (trimmedName.length === 0) {
      throw new Error('Name cannot be empty')
    }

    if (trimmedName.length < 2) {
      throw new Error('Name must be at least 2 characters')
    }

    this._id = props.id
    this._name = trimmedName
    this._email = props.email
    this._phone = props.phone
    this._rateId = props.rateId
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  // Getters
  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get email(): string | undefined {
    return this._email
  }

  get phone(): string | undefined {
    return this._phone
  }

  get rateId(): string | undefined {
    return this._rateId
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  // Business logic methods
  hasRate(): boolean {
    return this._rateId !== undefined
  }

  changeName(newName: string): void {
    const trimmedName = newName.trim()

    if (trimmedName.length === 0) {
      throw new Error('Name cannot be empty')
    }

    if (trimmedName.length < 2) {
      throw new Error('Name must be at least 2 characters')
    }

    this._name = trimmedName
    this._updatedAt = new Date()
  }

  changeContactInfo(email?: string, phone?: string): void {
    if (email !== undefined) {
      this._email = email.trim()
    }
    if (phone !== undefined) {
      this._phone = phone.trim()
    }
    this._updatedAt = new Date()
  }

  assignRate(rateId: string): void {
    this._rateId = rateId
    this._updatedAt = new Date()
  }

  removeRate(): void {
    this._rateId = undefined
    this._updatedAt = new Date()
  }

  equals(other: Customer): boolean {
    return this._id === other._id
  }
}
