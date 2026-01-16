import type { CustomerRepository } from '../../domain/repositories/CustomerRepository'
import type { Customer } from '../../domain/entities/Customer'
import { CustomerMapper } from '../mappers/CustomerMapper'
import { apiClient } from '../../lib/apiClient'
import type { Customer as ApiCustomer } from '../../features/customers/types/Customer'
import { NotFoundError, ServerError, ConnectionError } from '../../domain/errors/DomainErrors'

export class ApiCustomerRepository implements CustomerRepository {
    async findById(id: string): Promise<Customer | null> {
        try {
            const data = await apiClient<ApiCustomer>(`/customers/${id}`)
            return CustomerMapper.toDomain(data)
        } catch (error: any) {
            if (error.status === 404) return null // Use Case handles null logic usually
            throw new ServerError(error.message || 'Error fetching customer')
        }
    }

    async findAll(): Promise<Customer[]> {
        try {
            const data = await apiClient<ApiCustomer[]>('/customers')
            return data.map(item => CustomerMapper.toDomain(item))
        } catch (error: any) {
            throw new ConnectionError(error.message || 'Failed to connect to server')
        }
    }

    async save(customer: Customer): Promise<void> {
        try {
            const apiModel = CustomerMapper.toApi(customer)
            await apiClient<ApiCustomer>('/customers', {
                method: 'POST',
                body: JSON.stringify(apiModel)
            })
        } catch (error: any) {
            throw new ServerError(error.message || 'Error saving customer')
        }
    }

    async update(customer: Customer): Promise<void> {
        try {
            const apiModel = CustomerMapper.toApi(customer)
            await apiClient<ApiCustomer>(`/customers/${customer.id}`, {
                method: 'PUT',
                body: JSON.stringify(apiModel)
            })
        } catch (error: any) {
            throw new ServerError(error.message || 'Error updating customer')
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await apiClient<void>(`/customers/${id}`, {
                method: 'DELETE'
            })
        } catch (error: any) {
            throw new ServerError(error.message || 'Error deleting customer')
        }
    }

    async nextIdentity(): Promise<string> {
        return crypto.randomUUID()
    }

    async existsByName(name: string): Promise<boolean> {
        const customers = await this.findAll()
        return customers.some(c => c.name.trim().toLowerCase() === name.trim().toLowerCase())
    }
}
