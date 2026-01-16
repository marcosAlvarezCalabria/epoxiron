import { Rate } from '../../domain/entities/Rate'
import type { Rate as ApiRate } from '../../features/rates/types/Rate'

export class RateMapper {
    static toDomain(apiModel: ApiRate): Rate {
        return new Rate({
            id: apiModel.id,
            customerId: apiModel.customerId,
            // Map 'ratePer...' to 'pricePer...' to be more explicit in Domain if desired, 
            // or match API. Here we mapped to 'pricePer...' in Entity.
            pricePerLinearMeter: apiModel.ratePerLinearMeter,
            pricePerSquareMeter: apiModel.ratePerSquareMeter,
            minimumPrice: apiModel.minimumRate,
            specialPieces: apiModel.specialPieces || [],
            createdAt: new Date(apiModel.createdAt),
            updatedAt: new Date(apiModel.updatedAt)
        })
    }

    static toApi(domainEntity: Rate): ApiRate {
        return {
            id: domainEntity.id,
            customerId: domainEntity.customerId,
            ratePerLinearMeter: domainEntity.pricePerLinearMeter,
            ratePerSquareMeter: domainEntity.pricePerSquareMeter,
            minimumRate: domainEntity.minimumPrice,
            specialPieces: domainEntity.specialPieces,
            createdAt: domainEntity.createdAt.toISOString(),
            updatedAt: domainEntity.updatedAt.toISOString()
        }
    }
}
