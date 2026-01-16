import type { Rate } from '../entities/Rate'

export interface RateRepository {
    nextIdentity(): Promise<string>
    save(rate: Rate): Promise<void>
    findByCustomerId(customerId: string): Promise<Rate | null>
    findById(id: string): Promise<Rate | null>
    findAll(): Promise<Rate[]>
    update(rate: Rate): Promise<void>
    delete(id: string): Promise<void>
}
