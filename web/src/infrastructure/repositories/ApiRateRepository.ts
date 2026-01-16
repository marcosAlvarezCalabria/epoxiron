import type { RateRepository } from '../../domain/repositories/RateRepository'
import type { Rate } from '../../domain/entities/Rate'
import { RateMapper } from '../mappers/RateMapper'
import { apiClient } from '../../lib/apiClient'
import type { Rate as ApiRate } from '../../features/rates/types/Rate'
import { ServerError } from '../../domain/errors/DomainErrors'

export class ApiRateRepository implements RateRepository {
    async nextIdentity(): Promise<string> {
        return crypto.randomUUID()
    }

    async save(rate: Rate): Promise<void> {
        try {
            const apiModel = RateMapper.toApi(rate)
            await apiClient<ApiRate>('/rates', {
                method: 'POST',
                body: JSON.stringify(apiModel)
            })
        } catch (error: any) {
            throw new ServerError(error.message || 'Error saving rate')
        }
    }

    async findByCustomerId(customerId: string): Promise<Rate | null> {
        try {
            const rates = await apiClient<ApiRate[]>(`/rates?customerId=${customerId}`)
            if (rates.length === 0) return null
            return RateMapper.toDomain(rates[0])
        } catch (error) {
            // If it's a connection error, it will throw. If 404, returns empty array typically.
            // We let connection errors bubble up or wrap them
            console.warn(`Error fetching rate for customer ${customerId}`, error)
            return null
        }
    }

    async findById(id: string): Promise<Rate | null> {
        try {
            const data = await apiClient<ApiRate>(`/rates/${id}`)
            return RateMapper.toDomain(data)
        } catch (error) {
            // Assuming 404 throws an error in apiClient
            console.warn(`Rate ${id} not found`, error)
            return null
        }
    }

    async findAll(): Promise<Rate[]> {
        const data = await apiClient<ApiRate[]>('/rates')
        return data.map(item => RateMapper.toDomain(item))
    }

    async update(rate: Rate): Promise<void> {
        try {
            const apiModel = RateMapper.toApi(rate)
            await apiClient<ApiRate>(`/rates/${rate.id}`, {
                method: 'PUT',
                body: JSON.stringify(apiModel)
            })
        } catch (error: any) {
            throw new ServerError(error.message || 'Error updating rate')
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await apiClient<void>(`/rates/${id}`, {
                method: 'DELETE'
            })
        } catch (error: any) {
            throw new ServerError(error.message || 'Error deleting rate')
        }
    }
}
