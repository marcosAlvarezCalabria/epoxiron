/**
 * API CLIENT: Delivery Notes
 *
 * Functions to communicate with the backend
 */

import type {
  DeliveryNote,
  CreateDeliveryNoteRequest,
  UpdateDeliveryNoteRequest
} from '../types/DeliveryNote'

const API_URL = 'http://localhost:3000/api/delivery-notes'

export async function fetchDeliveryNotes(): Promise<DeliveryNote[]> {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error loading delivery notes')
  return response.json()
}

export async function fetchDeliveryNote(id: string): Promise<DeliveryNote> {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) throw new Error('Delivery note not found')
  return response.json()
}

export async function createDeliveryNote(data: CreateDeliveryNoteRequest): Promise<DeliveryNote> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error creating delivery note')
  return response.json()
}

export async function updateDeliveryNote(
  id: string,
  data: UpdateDeliveryNoteRequest
): Promise<DeliveryNote> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error updating delivery note')
  return response.json()
}

export async function updateDeliveryNoteStatus(
  id: string,
  status: 'draft' | 'pending' | 'reviewed'
): Promise<DeliveryNote> {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!response.ok) throw new Error('Error updating delivery note status')
  return response.json()
}

export async function deleteDeliveryNote(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Error deleting delivery note')
}
