/**
 * TYPES: Customer
 *
 * Domain types for customer management
 */

export interface Customer {
  id: string
  name: string
  rateId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRequest {
  name: string
}

export interface UpdateCustomerRequest {
  name?: string
  rateId?: string
}
