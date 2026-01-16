import type { RateRepository } from '../../domain/repositories/RateRepository'

export class DeleteRateUseCase {
    private readonly rateRepository: RateRepository

    constructor(rateRepository: RateRepository) {
        this.rateRepository = rateRepository
    }

    async execute(id: string): Promise<void> {
        await this.rateRepository.delete(id)
    }
}
