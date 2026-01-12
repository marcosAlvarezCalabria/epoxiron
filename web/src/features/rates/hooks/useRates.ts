/**
 * HOOKS: React Query hooks for rates
 *
 * Custom hooks to manage server state
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRates,
  fetchRate,
  fetchRateByCustomer,
  createRate,
  updateRate,
  deleteRate
} from '../api/ratesApi'
import type { CreateRateRequest, UpdateRateRequest } from '../types/Rate'

export function useRates() {
  return useQuery({
    queryKey: ['rates'],
    queryFn: fetchRates
  })
}

export function useRate(id: string) {
  return useQuery({
    queryKey: ['rates', id],
    queryFn: () => fetchRate(id),
    enabled: !!id
  })
}

export function useRateByCustomer(customerId: string) {
  return useQuery({
    queryKey: ['rates', 'customer', customerId],
    queryFn: () => fetchRateByCustomer(customerId),
    enabled: !!customerId
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
    mutationFn: ({ id, data }: { id: string; data: UpdateRateRequest }) =>
      updateRate(id, data),
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
