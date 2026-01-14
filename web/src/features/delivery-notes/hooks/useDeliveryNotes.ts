/**
 * HOOKS: React Query hooks for delivery notes
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { DeliveryNote, CreateDeliveryNoteRequest, UpdateDeliveryNoteRequest } from '../types/DeliveryNote'

// Mock data temporal
let mockDeliveryNotes: DeliveryNote[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Cliente A', // Added mock name
    date: new Date().toISOString(),
    status: 'pending',
    items: [
      {
        id: '1',
        name: 'Puerta principal',
        description: 'Puerta principal de entrada',
        quantity: 1,
        color: 'RAL 7016',
        measurements: {
          linearMeters: 3.5,
          squareMeters: 2.8
        },
        racColor: 'RAL 7016',
        unitPrice: 85.00,
        totalPrice: 85.00
      },
      {
        id: '2',
        name: 'Ventana lateral',
        description: 'Ventana lateral derecha',
        quantity: 2,
        color: 'RAL 9010',
        measurements: {
          linearMeters: 2.0,
          squareMeters: 1.2
        },
        racColor: 'RAL 9010',
        totalPrice: 0 // Sin precio asignado
      }
    ],
    totalAmount: 85.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Cliente B',
    date: new Date().toISOString(),
    status: 'draft',
    items: [
      {
        id: '3',
        name: 'Panel decorativo',
        description: 'Panel decorativo salón',
        quantity: 3,
        color: 'Azul metalizado',
        measurements: {
          squareMeters: 4.5,
          thickness: 2
        },
        specialColor: 'Azul metalizado',
        unitPrice: 45.00,
        totalPrice: 135.00
      }
    ],
    totalAmount: 135.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Cliente C',
    date: new Date().toISOString(),
    status: 'reviewed',
    items: [
      {
        id: '4',
        name: 'Estructura completa',
        description: 'Estructura metálica completa',
        quantity: 1,
        color: 'RAL 8017',
        measurements: {
          linearMeters: 12.5,
          squareMeters: 8.3
        },
        racColor: 'RAL 8017',
        unitPrice: 120.00,
        totalPrice: 120.00
      }
    ],
    totalAmount: 120.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export const useDeliveryNotes = () => {
  return useQuery({
    queryKey: ['deliveryNotes'],
    queryFn: async (): Promise<DeliveryNote[]> => {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 100))
      return [...mockDeliveryNotes]
    }
  })
}

export const useDeliveryNote = (id: string) => {
  return useQuery({
    queryKey: ['deliveryNote', id],
    queryFn: async (): Promise<DeliveryNote | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 100))
      return mockDeliveryNotes.find(note => note.id === id)
    },
    enabled: !!id
  })
}

export const useCreateDeliveryNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDeliveryNoteRequest): Promise<DeliveryNote> => {
      await new Promise(resolve => setTimeout(resolve, 500))

      const newNote: DeliveryNote = {
        id: Date.now().toString(),
        customerId: data.customerId,
        customerName: 'Cliente Mock', // Mock name
        date: data.date,
        status: 'draft',
        items: data.items.map((item, index) => ({
          ...item,
          id: `${Date.now()}-${index}`,
          // Ensure correct structure if passed from form
          measurements: item.measurements || {},
          unitPrice: 0,
          totalPrice: 0
        })),
        totalAmount: 0, // Recalculate if needed
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockDeliveryNotes.push(newNote)
      return newNote
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryNotes'] })
    }
  })
}

export const useUpdateDeliveryNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDeliveryNoteRequest }): Promise<DeliveryNote> => {
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = mockDeliveryNotes.findIndex(note => note.id === id)
      if (index === -1) throw new Error('Albarán no encontrado')

      const updatedNote: DeliveryNote = {
        ...mockDeliveryNotes[index],
        ...data,
        updatedAt: new Date().toISOString()
      }

      if (data.items) {
        updatedNote.totalAmount = data.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
      }

      mockDeliveryNotes[index] = updatedNote
      return updatedNote
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deliveryNotes'] })
      queryClient.invalidateQueries({ queryKey: ['deliveryNote', data.id] })
    }
  })
}

export const useDeleteDeliveryNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = mockDeliveryNotes.findIndex(note => note.id === id)
      if (index === -1) throw new Error('Albarán no encontrado')

      mockDeliveryNotes.splice(index, 1)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryNotes'] })
    }
  })
}
