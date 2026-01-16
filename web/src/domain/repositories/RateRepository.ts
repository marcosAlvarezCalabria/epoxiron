import type { Rate } from '../entities/Rate'

export interface RateRepository {
    nextIdentity(): Promise<string>
    save(rate: Rate): Promise<void>
    findByCustomerId(customerId: string): Promise<Rate | null>
    findAll(): Promise<Rate[]>
}
