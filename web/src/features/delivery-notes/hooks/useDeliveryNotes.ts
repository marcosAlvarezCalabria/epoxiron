/**
 * HOOKS: React Query hooks for delivery notes
 *
 * Custom hooks to manage server state
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { DeliveryNote } from '../types/DeliveryNote'

// Definir CreateDeliveryNoteData aquí directamente
export interface CreateDeliveryNoteData {
  customerId: string
  date?: string
  items: {
    description: string
    color: string
    quantity: number
    measurements: {
      linearMeters?: number
      squareMeters?: number
      thickness?: number
    }
  }[]
  notes?: string
}

// Mock data usando la interfaz correcta
const mockDeliveryNotes: DeliveryNote[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Empresa SA',
    date: '2024-01-15',
    status: 'reviewed',
    totalAmount: 450.00,
    items: [
      {
        id: '1',
        description: 'Trabajo de recubrimiento epoxi',
        color: 'Azul',
        measurements: {
          linearMeters: 10,
          thickness: 2
        },
        quantity: 10,
        unitPrice: 45.00,
        totalPrice: 450.00
      }
    ],
    notes: 'Trabajo completado satisfactoriamente',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Talleres Metal',
    date: '2024-01-16',
    status: 'pending',
    totalAmount: 825.50,
    items: [
      {
        id: '2',
        description: 'Recubrimiento estructural',
        color: 'Verde',
        measurements: {
          squareMeters: 25,
          thickness: 3
        },
        quantity: 42,
        unitPrice: 19.65,
        totalPrice: 825.50
      }
    ],
    notes: 'Pendiente de revisión',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
  
  // Simular cálculo de precios (esto se haría en el backend)
  const processedItems = data.items.map((item, index) => ({
    id: String(Date.now() + index),
    ...item,
    unitPrice: 45.00, // Precio por defecto
    totalPrice: item.quantity * 45.00
  }))

  const newDeliveryNote: DeliveryNote = {
    id: String(Date.now()),
    customerId: data.customerId,
    customerName: 'Cliente Test', // En el futuro se obtendrá del customerId
    date: data.date || new Date().toISOString().split('T')[0],
    status: 'draft',
    items: processedItems,
    totalAmount: processedItems.reduce((sum, item) => sum + item.totalPrice, 0),
    notes: data.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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

// Re-export types
export type { DeliveryNote }
