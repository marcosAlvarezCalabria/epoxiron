import { DeliveryNote } from '../../domain/entities/DeliveryNote'
import { Item } from '../../domain/entities/Item'
import type { DeliveryNoteRepository } from '../../domain/repositories/DeliveryNoteRepository'
import { RACColor } from '../../domain/value-objects/RACColor'
import { Measurements } from '../../domain/value-objects/Measurements'
import { Price } from '../../domain/value-objects/Price'

export interface UpdateDeliveryNoteInput {
    id: string
    customerId: string
    date: string
    items: Array<{
        id?: string
        name: string
        quantity: number
        color: string
        racColor?: string
        specialColor?: string
        measurements?: {
            linearMeters?: number
            squareMeters?: number
            thickness?: number
        }
        unitPrice?: number
        notes?: string
        hasPrimer?: boolean
        isHighThickness?: boolean
    }>
    notes?: string
    status?: 'draft' | 'validated' | 'finalized'
}

export interface UpdateDeliveryNoteOutput {
    deliveryNote: DeliveryNote
}

export class UpdateDeliveryNoteUseCase {
    private readonly deliveryNoteRepository: DeliveryNoteRepository

    constructor(deliveryNoteRepository: DeliveryNoteRepository) {
        this.deliveryNoteRepository = deliveryNoteRepository
    }

    async execute(input: UpdateDeliveryNoteInput): Promise<UpdateDeliveryNoteOutput> {
        // We could fetch first to check existence, but for now we'll trust the ID
        // const existingNote = await this.deliveryNoteRepository.findById(input.id)

        // Reconstruct the Domain Entity from input
        // Note: In a stricter CQRS/DDD approach, we might load->mutate->save.
        // But here we are essentially replacing the state with what the form sends.

        const items = input.items.map(itemInput => {
            let color: RACColor
            if (itemInput.racColor) {
                color = RACColor.createRAC(itemInput.racColor)
            } else {
                color = RACColor.createSpecial(itemInput.specialColor || itemInput.color || 'Sin color')
            }

            const measurements = itemInput.measurements
                ? new Measurements({
                    linearMeters: itemInput.measurements.linearMeters,
                    squareMeters: itemInput.measurements.squareMeters,
                    thickness: itemInput.measurements.thickness
                })
                : Measurements.createWithoutMeasurements()

            const price = itemInput.unitPrice !== undefined
                ? new Price(itemInput.unitPrice)
                : undefined

            // Use provided ID or generate a new one if it's a new item added during edit
            const itemId = itemInput.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2))

            return new Item({
                id: itemId,
                name: itemInput.name,
                color: color,
                quantity: itemInput.quantity,
                measurements: measurements,
                price: price,
                isHighThickness: itemInput.isHighThickness,
                hasPrimer: itemInput.hasPrimer
            })
        })

        // We need to create a DeliveryNote entity to pass to update
        // Since we are replacing it, we can "create" a new instance with the existing ID.
        // Ideally, we should fetch the 'number' and 'status' from the existing one to preserve them if not passed.
        // However, the input usually comes from the form which might not have 'number' or 'status'.

        // Better approach: Fetch existing to preserve immutable fields (like Number, CreatedAt, Status if not changing)
        const existingNote = await this.deliveryNoteRepository.findById(input.id)
        if (!existingNote) {
            throw new Error(`Delivery Note with ID ${input.id} not found`)
        }

        // Apply changes
        // Since DeliveryNote is likely an Aggregate Root with methods, we might not have setters for everything.
        // But looking at the Mapper, it constructs it via constructor.
        // Let's create a new instance with updated fields but preserving others.

        // Logic to preserve time if the date (day) hasn't changed
        // This prevents the note from dropping to the bottom of the list when sorting by date
        const inputDate = new Date(input.date)
        const existingDate = existingNote.date

        // Check if it's the same day (comparing YYYY-MM-DD from ISO strings)
        const isSameDay = inputDate.toISOString().split('T')[0] === existingDate.toISOString().split('T')[0]
        const finalDate = isSameDay ? existingDate : inputDate

        const updatedDeliveryNote = new DeliveryNote({
            id: existingNote.id,
            number: existingNote.number,
            customerId: input.customerId,
            customerName: existingNote.customerName,
            date: finalDate, // Use preserved date if applicable
            status: existingNote.status, // Start with existing status, then transition if needed
            items: items,
            notes: input.notes,
            createdAt: existingNote.createdAt // Preserve original creation date
        })

        // Handle Status Transitions
        if (input.status && input.status !== existingNote.status) {
            if (input.status === 'validated') {
                updatedDeliveryNote.validate()
            } else if (input.status === 'finalized') {
                // If jumping from draft to finalized, validate first?
                // Domain rules say: draft -> validated -> finalized.
                if (existingNote.status === 'draft') {
                    updatedDeliveryNote.validate()
                }
                updatedDeliveryNote.finalize()
            } else if (input.status === 'draft') {
                updatedDeliveryNote.reopen()
            }
        }

        // Save (Update)
        const savedDeliveryNote = await this.deliveryNoteRepository.update(updatedDeliveryNote)

        return { deliveryNote: savedDeliveryNote }
    }
}
