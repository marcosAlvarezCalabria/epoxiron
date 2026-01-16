import { DeliveryNote } from '../../domain/entities/DeliveryNote'
import { Item } from '../../domain/entities/Item'
import { RACColor } from '../../domain/value-objects/RACColor'
import { Measurements } from '../../domain/value-objects/Measurements'
import type { DeliveryNoteRepository } from '../../domain/repositories/DeliveryNoteRepository'
import type { DeliveryNoteFormData } from '../../features/delivery-notes/schemas/deliveryNoteSchema'

export class CreateDeliveryNoteUseCase {
    private readonly deliveryNoteRepository: DeliveryNoteRepository

    constructor(deliveryNoteRepository: DeliveryNoteRepository) {
        this.deliveryNoteRepository = deliveryNoteRepository
    }

    async execute(data: DeliveryNoteFormData): Promise<DeliveryNote> {
        // 1. Generate identity
        const id = await this.deliveryNoteRepository.nextIdentity()
        const number = await this.deliveryNoteRepository.nextNumber()

        // 2. Map items
        const items = data.items.map((itemData) => {
            let color: RACColor
            // Check if color is RAC (4 digits) or special
            // The schema validation allows any string.
            // Heuristic: if it matches 4 digits (optionally prefixed with RAC), try RAC, else Special.
            const racRegex = /^(?:RAC\s*)?(\d{4})$/i
            const match = racRegex.exec(itemData.color)

            if (match) {
                try {
                    // Extract just the digits (group 1)
                    // If input is "RAC 1234" or "1234", match[1] will be "1234"
                    color = RACColor.createRAC(match[1])
                } catch {
                    // Should not happen if regex matches
                    color = RACColor.createSpecial(itemData.color)
                }
            } else {
                color = RACColor.createSpecial(itemData.color)
            }

            const measurements = new Measurements({
                linearMeters: itemData.measurements.linearMeters,
                squareMeters: itemData.measurements.squareMeters,
                thickness: itemData.measurements.thickness
            })

            // Generate a new ID for the item
            const itemId = crypto.randomUUID()

            return new Item({
                id: itemId,
                name: itemData.description,
                color: color,
                quantity: itemData.quantity,
                measurements: measurements,
                price: undefined
            })
        })

        // 3. Create DeliveryNote Entity (Draft)
        const deliveryNote = DeliveryNote.createDraft({
            id,
            number,
            customerId: data.customerId
        })

        // 4. Add items to the delivery note
        items.forEach(item => deliveryNote.addItem(item))

        // 5. Save and return
        return this.deliveryNoteRepository.save(deliveryNote)
    }
}