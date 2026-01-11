/**
 * HOOKS: React Query hooks for customers
 *
 * Custom hooks to manage server state
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../api/customersApi'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/Customer'

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    }
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
      updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    }
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    }
  })
}
