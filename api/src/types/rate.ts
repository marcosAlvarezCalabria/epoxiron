/**
 * DOMAIN TYPES: Rate
 *
 * Types for pricing rates in the epoxy coating workshop.
 *
 * Location: Backend - Types (Domain Layer)
 * Reason: Core business entity representing pricing structure
 */

export interface SpecialPiece {
  name: string
  price: number
}

export interface Rate {
  id: string
  customerId: string
  ratePerLinearMeter: number  // Price per linear meter (€/ml)
  ratePerSquareMeter: number  // Price per square meter (€/m2)
  minimumRate: number         // Minimum price per job (€)
  specialPieces: SpecialPiece[]
  createdAt: Date
  updatedAt: Date
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

export interface RateResponse {
  id: string
  customerId: string
  ratePerLinearMeter: number
  ratePerSquareMeter: number
  minimumRate: number
  specialPieces: SpecialPiece[]
  createdAt: string
  updatedAt: string
}
