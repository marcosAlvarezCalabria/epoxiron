import { Rate, type SpecialPiece } from '../../domain/entities/Rate'
import type { RateRepository } from '../../domain/repositories/RateRepository'

export interface CreateRateDTO {
    customerId: string
    pricePerLinearMeter: number
    pricePerSquareMeter: number
    minimumPrice: number
    specialPieces?: SpecialPiece[]
}

export class CreateRateUseCase {
    private readonly rateRepository: RateRepository

    constructor(rateRepository: RateRepository) {
        this.rateRepository = rateRepository
    }

    async execute(data: CreateRateDTO): Promise<Rate> {
        const id = await this.rateRepository.nextIdentity()

        const rate = new Rate({
            id: id,
            customerId: data.customerId,
            pricePerLinearMeter: data.pricePerLinearMeter,
            pricePerSquareMeter: data.pricePerSquareMeter,
            minimumPrice: data.minimumPrice,
            specialPieces: data.specialPieces || [],
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await this.rateRepository.save(rate)

        return rate
    }
}
