import type { CustomerRepository } from '../../domain/repositories/CustomerRepository'
import type { Customer } from '../../domain/entities/Customer'
import { CustomerMapper } from '../mappers/CustomerMapper'
import { apiClient } from '../../lib/apiClient'
import type { Customer as ApiCustomer } from '../../features/customers/types/Customer'

export class ApiCustomerRepository implements CustomerRepository {
    async findById(id: string): Promise<Customer | null> {
        try {
            const data = await apiClient<ApiCustomer>(`/customers/${id}`)
            return CustomerMapper.toDomain(data)
        } catch (error) {
            console.warn(`Customer ${id} not found or error`, error)
            return null
        }
    }

    async findAll(): Promise<Customer[]> {
        const data = await apiClient<ApiCustomer[]>('/customers')
        return data.map(item => CustomerMapper.toDomain(item))
    }

    async save(customer: Customer): Promise<void> {
        const apiModel = CustomerMapper.toApi(customer)
        await apiClient<ApiCustomer>('/customers', {
            method: 'POST',
            body: JSON.stringify(apiModel)
        })
    }

    async update(customer: Customer): Promise<void> {
        const apiModel = CustomerMapper.toApi(customer)
        await apiClient<ApiCustomer>(`/customers/${customer.id}`, {
            method: 'PUT',
            body: JSON.stringify(apiModel)
        })
    }

    async delete(id: string): Promise<void> {
        await apiClient<void>(`/customers/${id}`, {
            method: 'DELETE'
        })
    }

    async nextIdentity(): Promise<string> {
        return crypto.randomUUID()
    }
}
