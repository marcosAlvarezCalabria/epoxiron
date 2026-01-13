/**
 * HOOKS: React Query hooks for customers
 * Con mutaciones para crear, actualizar y eliminar
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Mock data
let mockCustomers = [
  {
    id: '1',
    name: 'Empresa SA',
    email: 'contacto@empresa.com',
    phone: '+34 600 000 001',
    address: 'Calle Principal 123, Madrid',
    rateId: '1',
    notes: 'Cliente preferente',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Talleres Metal',
    email: null,
    phone: '+34 600 000 002',
    address: 'Polígono Industrial 45, Barcelona',
    rateId: null,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
const fetchCustomers = async () => {
  await delay(500)
  return [...mockCustomers]
}

const createCustomer = async (customerData: any) => {
  await delay(800)
  
  const newCustomer = {
    id: String(Date.now()),
    ...customerData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  mockCustomers.push(newCustomer)
  return newCustomer
}

const updateCustomer = async (customerData: any) => {
  await delay(800)
  
  const index = mockCustomers.findIndex(c => c.id === customerData.id)
  if (index === -1) throw new Error('Cliente no encontrado')
  
  mockCustomers[index] = {
    ...mockCustomers[index],
    ...customerData,
    updatedAt: new Date().toISOString()
  }
  
  return mockCustomers[index]
}

const deleteCustomer = async (customerId: string) => {
  await delay(500)
  
  const index = mockCustomers.findIndex(c => c.id === customerId)
  if (index === -1) throw new Error('Cliente no encontrado')
  
  const deletedCustomer = mockCustomers[index]
  mockCustomers.splice(index, 1)
  return deletedCustomer
}

// Hooks
export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
