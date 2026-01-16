import type { CustomerRepository } from '../../domain/repositories/CustomerRepository'

export class DeleteCustomerUseCase {
    private readonly customerRepository: CustomerRepository

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository
    }

    async execute(id: string): Promise<void> {
        // Can add logic here: e.g. "Check if customer has active delivery notes before deleting"
        await this.customerRepository.delete(id)
    }
}
