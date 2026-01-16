import { Customer } from '../../domain/entities/Customer'
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository'

interface CreateCustomerDTO {
    name: string
    rateId?: string
}

export class CreateCustomerUseCase {
    private readonly customerRepository: CustomerRepository

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository
    }

    async execute(data: CreateCustomerDTO): Promise<Customer> {
        // 1. Generate identity
        const id = await this.customerRepository.nextIdentity()

        // 2. Create Domain Entity
        const customer = new Customer({
            id: id,
            name: data.name,
            rateId: data.rateId,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // 3. Persist
        await this.customerRepository.save(customer)

        return customer
    }
}
