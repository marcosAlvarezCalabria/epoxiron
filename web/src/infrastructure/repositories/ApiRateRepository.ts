import type { RateRepository } from '../../domain/repositories/RateRepository'
import type { Rate } from '../../domain/entities/Rate'
import { RateMapper } from '../mappers/RateMapper'
import { apiClient } from '../../lib/apiClient'
import type { Rate as ApiRate } from '../../features/rates/types/Rate'

export class ApiRateRepository implements RateRepository {
    async nextIdentity(): Promise<string> {
        return crypto.randomUUID()
    }

    async save(rate: Rate): Promise<void> {
        const apiModel = RateMapper.toApi(rate)
        // Upsert logic typically, or create. Assuming POST for create.
        await apiClient<ApiRate>('/rates', {
            method: 'POST',
            body: JSON.stringify(apiModel)
        })
    }

    async findByCustomerId(customerId: string): Promise<Rate | null> {
        try {
            // Assuming API endpoint pattern
            const rates = await apiClient<ApiRate[]>(`/rates?customerId=${customerId}`)
            if (rates.length === 0) return null
            return RateMapper.toDomain(rates[0])
        } catch (error) {
            console.warn(`Error fetching rate for customer ${customerId}`, error)
            return null
        }
    }

    async findAll(): Promise<Rate[]> {
        const data = await apiClient<ApiRate[]>('/rates')
        return data.map(item => RateMapper.toDomain(item))
    }
}
