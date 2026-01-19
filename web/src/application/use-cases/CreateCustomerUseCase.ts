import { Customer } from '../../domain/entities/Customer'
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository'

interface CreateCustomerDTO {
    name: string
    email?: string
    phone?: string
    address?: string
    notes?: string

    // Pricing
    pricePerLinearMeter?: number
    pricePerSquareMeter?: number
    minimumRate?: number
    specialPieces?: Array<{ name: string; price: number }>
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
            email: data.email,
            phone: data.phone,
            address: data.address,
            notes: data.notes,

            // Pricing Defaults
            pricePerLinearMeter: data.pricePerLinearMeter || 0,
            pricePerSquareMeter: data.pricePerSquareMeter || 0,
            minimumRate: data.minimumRate || 0,
            specialPieces: data.specialPieces || [],

            createdAt: new Date(),
            updatedAt: new Date()
        })

        // 3. Persist
        await this.customerRepository.save(customer)

        return customer
    }
}
