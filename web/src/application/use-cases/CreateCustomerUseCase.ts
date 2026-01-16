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
        // 1. Check for duplicates
        if (await this.customerRepository.existsByName(data.name)) {
            throw new Error('A customer with this name already exists')
        }

        // 2. Generate identity
        const id = await this.customerRepository.nextIdentity()

        // 3. Create Domain Entity
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
