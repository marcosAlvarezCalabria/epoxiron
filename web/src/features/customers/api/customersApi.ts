/**
 * API CLIENT: Customers
 *
 * Functions to communicate with the backend using apiClient helper
 * All requests automatically include JWT token
 */

import { apiClient } from '../../../lib/apiClient'
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/Customer'

export async function fetchCustomers(): Promise<Customer[]> {
  return apiClient<Customer[]>('/customers', {
    method: 'GET'
  })
}

export async function fetchCustomer(id: string): Promise<Customer> {
  return apiClient<Customer>(`/customers/${id}`, {
    method: 'GET'
  })
}

export async function createCustomer(data: CreateCustomerRequest): Promise<Customer> {
  return apiClient<Customer>('/customers', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
  return apiClient<Customer>(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function deleteCustomer(id: string): Promise<void> {
  return apiClient<void>(`/customers/${id}`, {
    method: 'DELETE'
  })
}
