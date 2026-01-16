/**
 * HOOKS: React Query hooks for rates
 * Uses real backend API with JWT authentication
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as ratesApi from '../api/ratesApi'
import { RateMapper } from '../../../infrastructure/mappers/RateMapper'
import type { CreateRateRequest, UpdateRateRequest } from '../types/Rate'

// Re-export Rate type
export type { Rate } from '../types/Rate'

// Hooks
export function useRates() {
  return useQuery({
    queryKey: ['rates'],
    queryFn: ratesApi.fetchRates
  })
}

export function useRate(id: string) {
  return useQuery({
    queryKey: ['rates', id],
    queryFn: () => ratesApi.fetchRate(id),
    enabled: !!id
  })
}

export function useRateByCustomer(customerId: string) {
  const repository = new ApiRateRepository() // Should be dependency injected, but OK for now

  return useQuery({
    queryKey: ['rates', 'customer', customerId],
    queryFn: async () => {
      const rate = await repository.findByCustomerId(customerId)
      return rate // This is now a Rate Domain Entity
    },
    enabled: !!customerId
  })
}

// DI Injection (Manual)
import { ApiRateRepository } from '../../../infrastructure/repositories/ApiRateRepository'
import { CreateRateUseCase, type CreateRateDTO } from '../../../application/use-cases/CreateRateUseCase'

export function useCreateRate() {
  const queryClient = useQueryClient()
  const repository = new ApiRateRepository()
  const createUseCase = new CreateRateUseCase(repository)

  return useMutation({
    mutationFn: (data: CreateRateDTO) => createUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rates'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

import { UpdateRateUseCase, type UpdateRateDTO } from '../../../application/use-cases/UpdateRateUseCase'
import { DeleteRateUseCase } from '../../../application/use-cases/DeleteRateUseCase'

export function useUpdateRate() {
  const queryClient = useQueryClient()
  const repository = new ApiRateRepository()
  const updateUseCase = new UpdateRateUseCase(repository)

  return useMutation({
    mutationFn: (data: UpdateRateDTO) =>
      updateUseCase.execute(data),
    onSuccess: (updatedRate) => {
      // 1. Optimistic Update (update local cache instantly)
      const apiRate = RateMapper.toApi(updatedRate)

      queryClient.setQueryData<Rate[]>(['rates'], (oldRates) => {
        if (!oldRates) return [apiRate]
        return oldRates.map(r => r.id === apiRate.id ? apiRate : r)
      })

      // 2. Refresh lists (consistency check)
      queryClient.invalidateQueries({ queryKey: ['rates'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteRate() {
  const queryClient = useQueryClient()
  const repository = new ApiRateRepository()
  const deleteUseCase = new DeleteRateUseCase(repository)

  return useMutation({
    mutationFn: (rateId: string) => deleteUseCase.execute(rateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rates'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
