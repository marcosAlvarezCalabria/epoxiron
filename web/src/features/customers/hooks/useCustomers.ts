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
    staleTime: 0, // Always fetch fresh
    refetchOnMount: true
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




import { UpdateCustomerUseCase, type UpdateCustomerDTO } from '../../../application/use-cases/UpdateCustomerUseCase'
import { DeleteCustomerUseCase } from '../../../application/use-cases/DeleteCustomerUseCase'

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  const repository = new ApiCustomerRepository()
  const updateUseCase = new UpdateCustomerUseCase(repository)

  return useMutation({
    mutationFn: (data: UpdateCustomerDTO) =>
      updateUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  const repository = new ApiCustomerRepository()
  const deleteUseCase = new DeleteCustomerUseCase(repository)

  return useMutation({
    mutationFn: (customerId: string) => deleteUseCase.execute(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
