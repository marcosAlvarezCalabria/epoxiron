/**
 * HOOKS: React Query hooks for delivery notes
 *
 * Custom hooks to manage server state
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface DeliveryNoteItem {
  id: string
  rateId: string
  quantity: number
  description?: string
}

interface DeliveryNote {
  id: string
  customerId: string
  deliveryDate: string
  items: DeliveryNoteItem[]
  notes?: string
  createdAt: Date
}

interface CreateDeliveryNoteData {
  customerId: string
  deliveryDate: string
  items: Omit<DeliveryNoteItem, 'id'>[]
  notes?: string
}

// Mock data
const mockDeliveryNotes: DeliveryNote[] = [
  {
    id: '1',
    customerId: '1',
    deliveryDate: '2024-01-15',
    items: [
      {
        id: '1',
        rateId: '1',
        quantity: 10,
        description: 'Trabajo de recubrimiento epoxi'
      }
    ],
    notes: 'Trabajo completado satisfactoriamente',
    createdAt: new Date()
  }
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
const fetchDeliveryNotes = async (): Promise<DeliveryNote[]> => {
  await delay(500)
  return mockDeliveryNotes
}

const createDeliveryNote = async (data: CreateDeliveryNoteData): Promise<DeliveryNote> => {
  await delay(300)
  const newDeliveryNote: DeliveryNote = {
    id: String(Date.now()),
    ...data,
    items: data.items.map((item, index) => ({
      ...item,
      id: String(Date.now() + index)
    })),
    createdAt: new Date()
  }
  mockDeliveryNotes.push(newDeliveryNote)
  return newDeliveryNote
}

// Hooks
export function useDeliveryNotes() {
  return useQuery({
    queryKey: ['delivery-notes'],
    queryFn: fetchDeliveryNotes,
  })
}

export function useCreateDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
  })
}

export type { DeliveryNote, DeliveryNoteItem, CreateDeliveryNoteData }
