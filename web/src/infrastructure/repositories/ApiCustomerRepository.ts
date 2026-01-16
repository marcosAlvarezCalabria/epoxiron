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

        // Determine if it's create (POST) or update (PUT)
        // Since this repository is simple, we might assume save = create or update based on existence?
        // But typically 'save' in this context is often used for Creation in this simple CRUD app.
        // Let's check how CreateDeliveryNote works. It does POST.
        // We will assume POST for now or check if ID exists (but clean arch usually separates add/update or handles it smart).
        // For 'CreateCustomerUseCase', we know we are creating. 
        // Ideally we should have `create` and `update` methods or smart logic.
        // Given current usage pattern in project:
        // ApiDeliveryNoteRepository has 'save' doing POST.

        await apiClient<ApiCustomer>('/customers', {
            method: 'POST',
            body: JSON.stringify(apiModel)
        })
    }

    async nextIdentity(): Promise<string> {
        return crypto.randomUUID()
    }
}
