import type { DeliveryNoteRepository } from '../../domain/repositories/DeliveryNoteRepository'
import type { DeliveryNote } from '../../domain/entities/DeliveryNote'
import { DeliveryNoteMapper } from '../mappers/DeliveryNoteMapper'
import { apiClient } from '../../lib/apiClient'
import type { DeliveryNoteDTO } from '../dtos/DeliveryNoteDTO'
import { ServerError, ConnectionError } from '../../domain/errors/DomainErrors'

export class ApiDeliveryNoteRepository implements DeliveryNoteRepository {
    async findById(id: string): Promise<DeliveryNote | null> {
        try {
            const data = await apiClient<DeliveryNoteDTO>(`/delivery-notes/${id}`)
            return DeliveryNoteMapper.toDomain(data)
        } catch (error: any) {
            console.warn(`DeliveryNote ${id} not found or error`, error)
            // Usually we return null for 404, throw for others. Keeping null for safety if 404.
            return null
        }
    }

    async findAll(): Promise<DeliveryNote[]> {
        try {
            const data = await apiClient<DeliveryNoteDTO[]>('/delivery-notes')
            return data.map(item => DeliveryNoteMapper.toDomain(item))
        } catch (error: any) {
            throw new ConnectionError(error.message || 'Failed to fetch delivery notes')
        }
    }

    async save(deliveryNote: DeliveryNote): Promise<DeliveryNote> {
        try {
            const apiModel = DeliveryNoteMapper.toApi(deliveryNote)

            // POST returns the created object from backend
            const response = await apiClient<DeliveryNoteDTO>('/delivery-notes', {
                method: 'POST',
                body: JSON.stringify(apiModel)
            })

            // Map response back to Domain Entity
            return DeliveryNoteMapper.toDomain(response)
        } catch (error: any) {
            throw new ServerError(error.message || 'Error saving delivery note')
        }
    }

    async update(deliveryNote: DeliveryNote): Promise<DeliveryNote> {
        try {
            const apiModel = DeliveryNoteMapper.toApi(deliveryNote)

            // PUT returns the updated object from backend
            const response = await apiClient<DeliveryNoteDTO>(`/delivery-notes/${deliveryNote.id}`, {
                method: 'PUT',
                body: JSON.stringify(apiModel)
            })

            // Map response back to Domain Entity
            return DeliveryNoteMapper.toDomain(response)
        } catch (error: any) {
            throw new ServerError(error.message || 'Error updating delivery note')
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await apiClient(`/delivery-notes/${id}`, {
                method: 'DELETE'
            })
        } catch (error: any) {
            throw new ServerError(error.message || 'Error deleting delivery note')
        }
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
