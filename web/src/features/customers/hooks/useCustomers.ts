/**
 * HOOKS: React Query hooks for customers
 * Uses real backend API with JWT authentication
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as customersApi from '../api/customersApi'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/Customer'

// Hooks
export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: customersApi.fetchCustomers,
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customersApi.fetchCustomer(id),
    enabled: !!id,
  })
}

// DI Injection (Manual for now)
import { ApiCustomerRepository } from '../../../infrastructure/repositories/ApiCustomerRepository'
import { CreateCustomerUseCase } from '../../../application/use-cases/CreateCustomerUseCase'

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  // In a real app, this would come from a Context/Container
  const repository = new ApiCustomerRepository()
  const createUseCase = new CreateCustomerUseCase(repository)

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => createUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
      customersApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customerId: string) => customersApi.deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
