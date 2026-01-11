/**
 * API CLIENT: Customers
 *
 * Functions to communicate with the backend
 */

import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/Customer'

const API_URL = 'http://localhost:3000/api/customers'

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error loading customers')
  return response.json()
}

export async function fetchCustomer(id: string): Promise<Customer> {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) throw new Error('Customer not found')
  return response.json()
}

export async function createCustomer(data: CreateCustomerRequest): Promise<Customer> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error creating customer')
  return response.json()
}

export async function updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error updating customer')
  return response.json()
}

export async function deleteCustomer(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Error deleting customer')
}
