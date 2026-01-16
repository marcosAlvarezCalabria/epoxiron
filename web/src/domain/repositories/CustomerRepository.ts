import type { Customer } from '../entities/Customer'

export interface CustomerRepository {
    findById(id: string): Promise<Customer | null>
    findAll(): Promise<Customer[]>
    save(customer: Customer): Promise<void>
    update(customer: Customer): Promise<void>
    delete(id: string): Promise<void>
    nextIdentity(): Promise<string>
}
