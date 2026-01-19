/**
 * TYPES: Customer
 *
 * Domain types for customer management
 */

export interface SpecialPiece {
  name: string
  price: number
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  // rateId removed

  // PRICING
  pricePerLinearMeter: number
  pricePerSquareMeter: number
  minimumRate: number
  specialPieces: SpecialPiece[]

  createdAt: string // En JSON las fechas vienen como string
  updatedAt: string
}

export interface CreateCustomerRequest {
  name: string
  email?: string
  phone?: string

  // PRICING
  pricePerLinearMeter?: number
  pricePerSquareMeter?: number
  minimumRate?: number
  specialPieces?: SpecialPiece[]
}

export interface UpdateCustomerRequest {
  name?: string
  email?: string
  phone?: string

  // PRICING
  pricePerLinearMeter?: number
  pricePerSquareMeter?: number
  minimumRate?: number
  specialPieces?: SpecialPiece[]
}
