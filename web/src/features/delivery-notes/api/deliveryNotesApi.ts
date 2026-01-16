/**
 * API CLIENT: Delivery Notes
 *
 * Functions to communicate with the backend using apiClient helper
 * All requests automatically include JWT token
 */

import { apiClient } from '@/lib/apiClient'
import type {
  DeliveryNote,
  CreateDeliveryNoteRequest,
  UpdateDeliveryNoteRequest
} from '../types/DeliveryNote'

export async function fetchDeliveryNotes(): Promise<DeliveryNote[]> {
  return apiClient<DeliveryNote[]>('/delivery-notes', {
    method: 'GET'
  })
}

export async function fetchDeliveryNote(id: string): Promise<DeliveryNote> {
  return apiClient<DeliveryNote>(`/delivery-notes/${id}`, {
    method: 'GET'
  })
}

export async function createDeliveryNote(data: CreateDeliveryNoteRequest): Promise<DeliveryNote> {
  return apiClient<DeliveryNote>('/delivery-notes', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function updateDeliveryNote(
  id: string,
  data: UpdateDeliveryNoteRequest
): Promise<DeliveryNote> {
  return apiClient<DeliveryNote>(`/delivery-notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export async function updateDeliveryNoteStatus(
  id: string,
  status: 'draft' | 'pending' | 'reviewed'
): Promise<DeliveryNote> {
  return apiClient<DeliveryNote>(`/delivery-notes/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export async function deleteDeliveryNote(id: string): Promise<void> {
  return apiClient<void>(`/delivery-notes/${id}`, {
    method: 'DELETE'
  })
}
