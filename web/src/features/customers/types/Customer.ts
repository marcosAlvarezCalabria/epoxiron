/**
 * TYPES: Customer
 *
 * Domain types for customer management
 */

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  rateId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRequest {
  name: string
  email?: string
  phone?: string
}

export interface UpdateCustomerRequest {
  name?: string
  email?: string
  phone?: string
  rateId?: string
}
