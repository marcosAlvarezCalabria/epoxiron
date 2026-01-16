import type { Customer } from '../../domain/entities/Customer'
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository'

export interface UpdateCustomerDTO {
    id: string
    name?: string
    rateId?: string
}

export class UpdateCustomerUseCase {
    private readonly customerRepository: CustomerRepository

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository
    }

    async execute(data: UpdateCustomerDTO): Promise<Customer> {
        // 1. Load Entity
        const customer = await this.customerRepository.findById(data.id)
        if (!customer) {
            throw new Error(`Customer with id ${data.id} not found`)
        }

        // 2. Apply Domain Changes
        if (data.name !== undefined) {
            customer.changeName(data.name)
        }

        if (data.rateId !== undefined) {
            if (data.rateId) {
                customer.assignRate(data.rateId)
            } else {
                customer.removeRate() // Or handle unassignment if logic permits
            }
        }

        // 3. Persist
        await this.customerRepository.update(customer)

        return customer
    }
}
