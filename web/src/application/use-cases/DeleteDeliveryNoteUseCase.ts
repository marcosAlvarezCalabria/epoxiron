import type { DeliveryNoteRepository } from '../../domain/repositories/DeliveryNoteRepository'

export class DeleteDeliveryNoteUseCase {
    private readonly repository: DeliveryNoteRepository

    constructor(repository: DeliveryNoteRepository) {
        this.repository = repository
    }

    async execute(id: string): Promise<void> {
        await this.repository.delete(id)
    }
}
