/**
 * HOOKS: React Query hooks for delivery notes
 *
 * Custom hooks to manage server state
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface DeliveryNote {
  id: string
  customerName: string
  date: string
  items: DeliveryNoteItem[]
  notes?: string
  status: 'draft' | 'pending' | 'reviewed'
  totalAmount: number
  createdAt: Date
}

interface DeliveryNoteItem {
  id: string
  description: string
  color: string
  quantity: number
}

// Mock data compatible con el componente existente
const mockDeliveryNotes: DeliveryNote[] = [
  {
    id: '1',
    customerName: 'Cliente Ejemplo 1',
    date: '2024-01-15',
    items: [
      {
        id: '1',
        description: 'Pieza soldada',
        color: 'Azul',
        quantity: 5
      }
    ],
    notes: 'Trabajo completado correctamente',
    status: 'draft',
    totalAmount: 450.00,
    createdAt: new Date()
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const fetchDeliveryNotes = async (): Promise<DeliveryNote[]> => {
  await delay(500)
  return mockDeliveryNotes
}

const deleteDeliveryNote = async (id: string): Promise<void> => {
  await delay(300)
  const index = mockDeliveryNotes.findIndex(note => note.id === id)
  if (index > -1) {
    mockDeliveryNotes.splice(index, 1)
  }
}

const updateDeliveryNoteStatus = async ({ id, status }: { id: string; status: 'draft' | 'pending' | 'reviewed' }): Promise<void> => {
  await delay(300)
  const note = mockDeliveryNotes.find(note => note.id === id)
  if (note) {
    note.status = status
  }
}

// Hooks
export function useDeliveryNotes() {
  return useQuery({
    queryKey: ['delivery-notes'],
    queryFn: fetchDeliveryNotes,
  })
}

export function useDeleteDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
  })
}

export function useUpdateDeliveryNoteStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateDeliveryNoteStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
  })
}

export type { DeliveryNote, DeliveryNoteItem }
