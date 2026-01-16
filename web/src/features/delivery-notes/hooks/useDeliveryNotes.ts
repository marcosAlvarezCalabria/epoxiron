import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { DeliveryNote, CreateDeliveryNoteRequest, UpdateDeliveryNoteRequest } from '../types/DeliveryNote'
import { ApiDeliveryNoteRepository } from '../../../infrastructure/repositories/ApiDeliveryNoteRepository'
import { CreateDeliveryNoteUseCase } from '../../../application/use-cases/CreateDeliveryNoteUseCase'
import { UpdateDeliveryNoteUseCase } from '../../../application/use-cases/UpdateDeliveryNoteUseCase'
import { DeliveryNoteMapper } from '../../../infrastructure/mappers/DeliveryNoteMapper'

// Instantiate Repository (Singleton-ish for hooks)
const repository = new ApiDeliveryNoteRepository()
const createUseCase = new CreateDeliveryNoteUseCase(repository)
const updateUseCase = new UpdateDeliveryNoteUseCase(repository)

export const useDeliveryNotes = () => {
  return useQuery({
    queryKey: ['deliveryNotes'],
    queryFn: async (): Promise<DeliveryNote[]> => {
      const domainNotes = await repository.findAll()
      return domainNotes.map(note => DeliveryNoteMapper.toApi(note))
    },
    refetchOnMount: 'always' // Always refetch when component mounts
  })
}

export const useDeliveryNote = (id: string) => {
  return useQuery({
    queryKey: ['deliveryNote', id],
    queryFn: async (): Promise<DeliveryNote | undefined> => {
      const note = await repository.findById(id)
      return note ? DeliveryNoteMapper.toApi(note) : undefined
    },
    enabled: !!id
  })
}

export const useCreateDeliveryNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDeliveryNoteRequest): Promise<DeliveryNote> => {
      // Adapt Request to Use Case Input (FormData)
      // We map 'name' to 'description' as required by the Use Case / Schema
      const formData = {
        customerId: data.customerId,
        date: data.date,
        items: data.items.map(i => ({
          description: i.description || i.name, // Fallback if description is missing
          color: i.color,
          quantity: i.quantity,
          measurements: i.measurements
        })),
        notes: data.notes
      }

      // EXECUTE USE CASE
      // Returns Domain Entity
      const domainNote = await createUseCase.execute(formData)

      // Map Domain Entity back to API Type for the frontend
      return DeliveryNoteMapper.toApi(domainNote)
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
      // Explicit checks to ensure data presence for the Use Case
      const customerId = data.customerId
      const items = data.items

      if (!customerId) throw new Error('Customer ID is required for update')
      if (!items) throw new Error('Items are required for update')

      // EXECUTE USE CASE
      const output = await updateUseCase.execute({
        id: id,
        customerId: customerId,
        date: data.date || new Date().toISOString(), // Fallback if missing
        items: items.map(i => ({
          id: i.id, // Pass ID for existing items
          name: i.name,
          quantity: i.quantity,
          color: i.color,
          racColor: i.racColor,
          specialColor: i.specialColor,
          measurements: i.measurements,
          unitPrice: i.unitPrice,
          // totalPrice is ignored by input
          notes: i.notes
        })),
        notes: data.notes
      })

      return DeliveryNoteMapper.toApi(output.deliveryNote)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deliveryNotes'] })
      queryClient.invalidateQueries({ queryKey: ['deliveryNote', data?.id] })
    }
  })
}

import { DeleteDeliveryNoteUseCase } from '../../../application/use-cases/DeleteDeliveryNoteUseCase'

const deleteUseCase = new DeleteDeliveryNoteUseCase(repository)

export const useDeleteDeliveryNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await deleteUseCase.execute(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryNotes'] })
    }
  })
}
