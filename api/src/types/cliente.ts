/**
 * DOMAIN TYPES: Cliente
 *
 * Types for customer management in the epoxy coating workshop.
 *
 * Location: Backend - Types (Domain Layer)
 * Reason: Core business entity representing customers
 */

export interface Cliente {
  id: string
  nombre: string
  tarifaId?: string  // Optional: assigned rate (to be implemented in Phase 3)
  createdAt: Date
  updatedAt: Date
}

export interface CreateClienteRequest {
  nombre: string
}

export interface UpdateClienteRequest {
  nombre: string
  tarifaId?: string
}

export interface ClienteResponse {
  id: string
  nombre: string
  tarifaId?: string
  createdAt: string
  updatedAt: string
}
