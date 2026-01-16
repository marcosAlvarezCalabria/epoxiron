/**
 * API CLIENT: Rates
 *
 * Functions to communicate with the backend using apiClient helper
 * All requests automatically include JWT token
 */

import { apiClient } from '@/lib/apiClient'
import type { Rate, CreateRateRequest, UpdateRateRequest } from '../types/Rate'

export async function fetchRates(): Promise<Rate[]> {
  return apiClient<Rate[]>('/rates', {
    method: 'GET'
  })
}

export async function fetchRate(id: string): Promise<Rate> {
  return apiClient<Rate>(`/rates/${id}`, {
    method: 'GET'
  })
}

export async function fetchRateByCustomer(customerId: string): Promise<Rate> {
  return apiClient<Rate>(`/rates/customer/${customerId}`, {
    method: 'GET'
  })
}

export async function createRate(data: CreateRateRequest): Promise<Rate> {
  return apiClient<Rate>('/rates', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function updateRate(id: string, data: UpdateRateRequest): Promise<Rate> {
  return apiClient<Rate>(`/rates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function deleteRate(id: string): Promise<void> {
  return apiClient<void>(`/rates/${id}`, {
    method: 'DELETE'
  })
}
