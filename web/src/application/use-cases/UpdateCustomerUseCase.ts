import type { Customer } from '../../domain/entities/Customer'
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository'

export interface UpdateCustomerDTO {
    id: string
    name?: string
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

        if (data.email !== undefined || data.phone !== undefined || data.address !== undefined || data.notes !== undefined) {
            customer.changeContactInfo(data.email, data.phone, data.address, data.notes)
        }

        // Pricing Update
        if (
            data.pricePerLinearMeter !== undefined ||
            data.pricePerSquareMeter !== undefined ||
            data.minimumRate !== undefined ||
            data.specialPieces !== undefined
        ) {
            customer.updatePricing(
                data.pricePerLinearMeter ?? customer.pricePerLinearMeter,
                data.pricePerSquareMeter ?? customer.pricePerSquareMeter,
                data.minimumRate ?? customer.minimumRate,
                data.specialPieces ?? customer.specialPieces
            )
        }

        // 3. Persist
        await this.customerRepository.update(customer)

        return customer
    }
}
