import type { DeliveryNoteRepository } from '../../domain/repositories/DeliveryNoteRepository'
import type { DeliveryNote } from '../../domain/entities/DeliveryNote'
import { DeliveryNoteMapper } from '../mappers/DeliveryNoteMapper'
import { apiClient } from '../../lib/apiClient'
import type { DeliveryNote as ApiDeliveryNote } from '../../features/delivery-notes/types/DeliveryNote'

export class ApiDeliveryNoteRepository implements DeliveryNoteRepository {
    async findById(id: string): Promise<DeliveryNote | null> {
        try {
            const data = await apiClient<ApiDeliveryNote>(`/delivery-notes/${id}`)
            return DeliveryNoteMapper.toDomain(data)
        } catch (error) {
            console.warn(`DeliveryNote ${id} not found or error`, error)
            return null
        }
    }

    async findAll(): Promise<DeliveryNote[]> {
        try {
            const data = await apiClient<ApiDeliveryNote[]>('/delivery-notes')
            return data.map(item => DeliveryNoteMapper.toDomain(item))
        } catch (error) {
            console.error('Error fetching delivery notes', error)
            return []
        }
    }

    async save(deliveryNote: DeliveryNote): Promise<DeliveryNote> {
        const apiModel = DeliveryNoteMapper.toApi(deliveryNote)

        // POST returns the created object from backend
        const response = await apiClient<ApiDeliveryNote>('/delivery-notes', {
            method: 'POST',
            body: JSON.stringify(apiModel)
        })

        // Map response back to Domain Entity
        return DeliveryNoteMapper.toDomain(response)
    }

    async update(deliveryNote: DeliveryNote): Promise<DeliveryNote> {
        const apiModel = DeliveryNoteMapper.toApi(deliveryNote)

        // PUT returns the updated object from backend
        const response = await apiClient<ApiDeliveryNote>(`/delivery-notes/${deliveryNote.id}`, {
            method: 'PUT',
            body: JSON.stringify(apiModel)
        })

        // Map response back to Domain Entity
        return DeliveryNoteMapper.toDomain(response)
    }

    async delete(id: string): Promise<void> {
        await apiClient(`/delivery-notes/${id}`, {
            method: 'DELETE'
        })
    }

    async nextIdentity(): Promise<string> {
        return crypto.randomUUID()
    }

    async nextNumber(): Promise<string> {
        const timestamp = Date.now().toString().slice(-4)
        return `DN-${new Date().getFullYear()}-${timestamp}`
    }
}
