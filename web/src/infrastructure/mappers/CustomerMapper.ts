import { Customer } from '../../domain/entities/Customer'
import type { Customer as ApiCustomer } from '../../features/customers/types/Customer'

export class CustomerMapper {
    static toDomain(apiModel: ApiCustomer): Customer {
        return new Customer({
            id: apiModel.id,
            name: apiModel.name,
            email: apiModel.email,
            phone: apiModel.phone,
            address: apiModel.address,
            notes: apiModel.notes,

            // Pricing
            pricePerLinearMeter: apiModel.pricePerLinearMeter,
            pricePerSquareMeter: apiModel.pricePerSquareMeter,
            minimumRate: apiModel.minimumRate,
            specialPieces: apiModel.specialPieces || [],

            createdAt: new Date(apiModel.createdAt),
            updatedAt: new Date(apiModel.updatedAt)
        })
    }

    static toApi(domainEntity: Customer): ApiCustomer {
        return {
            id: domainEntity.id,
            name: domainEntity.name,
            email: domainEntity.email,
            phone: domainEntity.phone,
            address: domainEntity.address,
            notes: domainEntity.notes,

            // Pricing
            pricePerLinearMeter: domainEntity.pricePerLinearMeter,
            pricePerSquareMeter: domainEntity.pricePerSquareMeter,
            minimumRate: domainEntity.minimumRate,
            specialPieces: domainEntity.specialPieces,

            createdAt: domainEntity.createdAt.toISOString(),
            updatedAt: domainEntity.updatedAt.toISOString()
        }
    }
}
