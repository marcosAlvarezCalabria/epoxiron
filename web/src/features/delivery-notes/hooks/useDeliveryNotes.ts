/**
 * HOOKS: React Query hooks for delivery notes
 *
 * Custom hooks to manage server state
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchDeliveryNotes,
  fetchDeliveryNote,
  createDeliveryNote,
  updateDeliveryNote,
  updateDeliveryNoteStatus,
  deleteDeliveryNote
} from '../api/deliveryNotesApi'
import type {
  CreateDeliveryNoteRequest,
  UpdateDeliveryNoteRequest
} from '../types/DeliveryNote'

export function useDeliveryNotes() {
  return useQuery({
    queryKey: ['delivery-notes'],
    queryFn: fetchDeliveryNotes
  })
}

export function useDeliveryNote(id: string) {
  return useQuery({
    queryKey: ['delivery-notes', id],
    queryFn: () => fetchDeliveryNote(id),
    enabled: !!id
  })
}

export function useCreateDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    }
  })
}

export function useUpdateDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeliveryNoteRequest }) =>
      updateDeliveryNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    }
  })
}

export function useUpdateDeliveryNoteStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'pending' | 'reviewed' }) =>
      updateDeliveryNoteStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    }
  })
}

export function useDeleteDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    }
  })
}
