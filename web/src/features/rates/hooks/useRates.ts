/**
 * HOOKS: React Query hooks for rates
 * Con tipos correctos para evitar errores
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Tipo Rate bien definido
export interface Rate {
  id: string
  customerId: string
  ratePerLinearMeter: number
  ratePerSquareMeter: number
  minimumRate: number
  createdAt?: string
  updatedAt?: string
}

// Mock data con tipos correctos
let mockRates: Rate[] = [
  {
    id: '1',
    customerId: '1',
    ratePerLinearMeter: 25.50,
    ratePerSquareMeter: 45.00,
    minimumRate: 100.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    customerId: '2',
    ratePerLinearMeter: 22.00,
    ratePerSquareMeter: 40.50,
    minimumRate: 85.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    customerId: '3',
    ratePerLinearMeter: 30.00,
    ratePerSquareMeter: 50.00,
    minimumRate: 120.00,
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
    customerId: rateData.customerId,
    ratePerLinearMeter: rateData.ratePerLinearMeter,
    ratePerSquareMeter: rateData.ratePerSquareMeter,
    minimumRate: rateData.minimumRate,
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
