/**
 * TYPES: Rate
 *
 * Domain types for pricing rate management
 */

export interface SpecialPiece {
  name: string
  price: number
}

export interface Rate {
  id: string
  customerId: string
  ratePerLinearMeter: number
  ratePerSquareMeter: number
  minimumRate: number
  specialPieces: SpecialPiece[]
  createdAt: string
  updatedAt: string
}

export interface CreateRateRequest {
  customerId: string
  ratePerLinearMeter: number
  ratePerSquareMeter: number
  minimumRate: number
  specialPieces?: SpecialPiece[]
}

export interface UpdateRateRequest {
  ratePerLinearMeter?: number
  ratePerSquareMeter?: number
  minimumRate?: number
  specialPieces?: SpecialPiece[]
}
