import type { Rate, SpecialPiece } from '../../domain/entities/Rate'
import type { RateRepository } from '../../domain/repositories/RateRepository'

export interface UpdateRateDTO {
    id: string
    pricePerLinearMeter?: number
    pricePerSquareMeter?: number
    minimumPrice?: number
    specialPieces?: SpecialPiece[]
}

export class UpdateRateUseCase {
    private readonly rateRepository: RateRepository

    constructor(rateRepository: RateRepository) {
        this.rateRepository = rateRepository
    }

    async execute(data: UpdateRateDTO): Promise<Rate> {
        const rate = await this.rateRepository.findById(data.id)
        if (!rate) {
            throw new Error(`Rate with id ${data.id} not found`)
        }

        // Calculate new values, fallback to existing if undefined
        const newLm = data.pricePerLinearMeter ?? rate.pricePerLinearMeter
        const newSm = data.pricePerSquareMeter ?? rate.pricePerSquareMeter
        const newMin = data.minimumPrice ?? rate.minimumPrice

        // Update main prices (validators inside Entity run here)
        rate.updatePrices(newLm, newSm, newMin)

        // Handle special pieces (Naive replacement for now, or add method in Entity)
        // Since Entity has `addSpecialPiece` but not `setSpecialPieces`, accessing private _specialPieces is hard?
        // Wait, I defined `_specialPieces` as private. I need a method to replace them if the DTO sends a full list.
        // Or I can add `replaceSpecialPieces` to Entity.
        // Let's check Rate.ts. It has `addSpecialPiece`.
        // To support full update, I should add `updateSpecialPieces` to Entity.
        // For now, I will assume we might need to modify Entity first. 
        // Or just don't support updating pieces in this iteration if not critical?
        // User likely wants full update form.
        // I will implement `updateSpecialPieces` in the Entity in next step if checking fails, 
        // but for now I can't access it. 
        // I'll assume I can modify Entity.ts. I'll add the method to Entity first? 
        // No, I'll write this file, it will fail type check, then I fix Entity.

        // Actually, let's fix Entity first or check if I can add it.
        // I will skip special pieces update logic here momentarily or assume `replaceSpecialPieces` exists 
        // and fixing it right after.

        if (data.specialPieces) {
            rate.replaceSpecialPieces(data.specialPieces)
        }

        await this.rateRepository.update(rate)
        return rate
    }
}
