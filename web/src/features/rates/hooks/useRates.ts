/**
 * HOOKS: React Query hooks for rates
 * Con mutaciones para crear, actualizar y eliminar
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Mock data con name editable
let mockRates = [
  {
    id: '1',
    name: 'Tarifa Estándar',
    description: 'Precios estándar para clientes regulares',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Tarifa Premium',
    description: 'Precios especiales para clientes VIP',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Tarifa Descuento',
    description: null, // Sin descripción para probar
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
const fetchRates = async () => {
  await delay(500)
  return [...mockRates]
}

const createRate = async (rateData: any) => {
  await delay(800)
  
  const newRate = {
    id: String(Date.now()),
    name: rateData.name,
    description: rateData.description || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockRates.push(newRate)
  return newRate
}

const updateRate = async (rateData: any) => {
  await delay(800)

  const index = mockRates.findIndex(r => r.id === rateData.id)
  if (index === -1) throw new Error('Tarifa no encontrada')

  mockRates[index] = {
    ...mockRates[index],
    ...rateData,
    updatedAt: new Date().toISOString()
  }

  return mockRates[index]
}

const deleteRate = async (rateId: string) => {
  await delay(500)

  const index = mockRates.findIndex(r => r.id === rateId)
  if (index === -1) throw new Error('Tarifa no encontrada')

  const deletedRate = mockRates[index]
  mockRates.splice(index, 1)
  return deletedRate
}

// Hooks
export function useRates() {
  return useQuery({
    queryKey: ['rates'],
    queryFn: fetchRates
  })
}

export function useCreateRate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rates'] })
    }
  })
}

export function useUpdateRate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rates'] })
    }
  })
}

export function useDeleteRate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rates'] })
    }
  })
}
