import { Customer } from '../../domain/entities/Customer'
import type { Customer as ApiCustomer } from '../../features/customers/types/Customer'

export class CustomerMapper {
    static toDomain(apiModel: ApiCustomer): Customer {
        return new Customer({
            id: apiModel.id,
            name: apiModel.name,
            email: apiModel.email,
            phone: apiModel.phone,
            rateId: apiModel.rateId,
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
            rateId: domainEntity.rateId,
            createdAt: domainEntity.createdAt.toISOString(),
            updatedAt: domainEntity.updatedAt.toISOString()
        }
    }
}
