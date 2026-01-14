/**
 * HOOKS: React Query hooks for delivery notes
 * Uses real backend API with JWT authentication
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as deliveryNotesApi from '../api/deliveryNotesApi'
import type { CreateDeliveryNoteRequest, UpdateDeliveryNoteRequest } from '../types/DeliveryNote'

// Hooks
export function useDeliveryNotes() {
  return useQuery({
    queryKey: ['delivery-notes'],
    queryFn: deliveryNotesApi.fetchDeliveryNotes,
  })
}

export function useDeliveryNote(id: string) {
  return useQuery({
    queryKey: ['delivery-notes', id],
    queryFn: () => deliveryNotesApi.fetchDeliveryNote(id),
    enabled: !!id,
  })
}

export function useCreateDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDeliveryNoteRequest) => deliveryNotesApi.createDeliveryNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
  })
}

export function useUpdateDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeliveryNoteRequest }) =>
      deliveryNotesApi.updateDeliveryNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
  })
}

export function useUpdateDeliveryNoteStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'pending' | 'reviewed' }) =>
      deliveryNotesApi.updateDeliveryNoteStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
  })
}

export function useDeleteDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deliveryNotesApi.deleteDeliveryNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
  })
}
