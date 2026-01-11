/**
 * API CLIENT: Rates
 *
 * Functions to communicate with the backend
 */

import type { Rate, CreateRateRequest, UpdateRateRequest } from '../types/Rate'

const API_URL = 'http://localhost:3000/api/rates'

export async function fetchRates(): Promise<Rate[]> {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error loading rates')
  return response.json()
}

export async function fetchRate(id: string): Promise<Rate> {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) throw new Error('Rate not found')
  return response.json()
}

export async function fetchRateByCustomer(customerId: string): Promise<Rate> {
  const response = await fetch(`${API_URL}/customer/${customerId}`)
  if (!response.ok) throw new Error('Rate not found for this customer')
  return response.json()
}

export async function createRate(data: CreateRateRequest): Promise<Rate> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error creating rate')
  return response.json()
}

export async function updateRate(id: string, data: UpdateRateRequest): Promise<Rate> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error updating rate')
  return response.json()
}

export async function deleteRate(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Error deleting rate')
}
