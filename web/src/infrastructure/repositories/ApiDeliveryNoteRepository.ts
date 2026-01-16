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
        try {
            // Get all existing notes to calculate next number
            // Ideally this should be done by the backend to avoid race conditions
            const allNotes = await this.findAll()

            // Filter notes for current year to reset sequence annually (optional business rule)
            const currentYear = new Date().getFullYear()
            const currentYearNotes = allNotes.filter(n =>
                new Date(n.date).getFullYear() === currentYear
            )

            // Simple sequence: count + 1
            const nextSequence = currentYearNotes.length + 1

            // Format: ALB-2024-001
            // Pad sequence with leading zeros (e.g., 1 -> 001, 12 -> 012)
            const paddedSequence = nextSequence.toString().padStart(3, '0')

            return `ALB-${currentYear}-${paddedSequence}`
        } catch (error) {
            console.warn('Could not calculate sequential ID, falling back to timestamp', error)
            const timestamp = Date.now().toString().slice(-4)
            return `ALB-${new Date().getFullYear()}-${timestamp}`
        }
    }
}
