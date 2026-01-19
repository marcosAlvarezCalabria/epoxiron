
import { DeliveryNote } from '../../domain/entities/DeliveryNote'
import { Item } from '../../domain/entities/Item'
import { RACColor } from '../../domain/value-objects/RACColor'
import { Measurements } from '../../domain/value-objects/Measurements'
import { Price } from '../../domain/value-objects/Price'
import type { DeliveryNoteDTO } from '../dtos/DeliveryNoteDTO'
import type { DeliveryNoteStatus } from '../../domain/entities/DeliveryNote'

export class DeliveryNoteMapper {
    static toDomain(apiModel: DeliveryNoteDTO): DeliveryNote {
        // Map Items
        const items = apiModel.items.map(item => {
            // Logic to determine color type
            const color = item.color.startsWith('RAC')
                ? RACColor.createRAC(item.color.replace('RAC ', ''))
                : RACColor.createSpecial(item.color)

            const measurementsParams: any = {}
            if (item.measurements) {
                if (item.measurements.linearMeters && item.measurements.linearMeters > 0) {
                    measurementsParams.linearMeters = item.measurements.linearMeters
                }
                if (item.measurements.squareMeters && item.measurements.squareMeters > 0) {
                    measurementsParams.squareMeters = item.measurements.squareMeters
                }
                if (item.measurements.thickness && item.measurements.thickness > 0) {
                    measurementsParams.thickness = item.measurements.thickness
                }
            }

            const measurements = Object.keys(measurementsParams).length > 0
                ? new Measurements(measurementsParams)
                : Measurements.createWithoutMeasurements()

            return new Item({
                id: item.id,
                name: item.name,
                color: color,
                quantity: item.quantity,
                price: item.unitPrice !== undefined ? new Price(item.unitPrice) : undefined,
                measurements: measurements,
                isHighThickness: item.isHighThickness,
                hasPrimer: item.hasPrimer
            })
        })

        // Map DeliveryNote
        return new DeliveryNote({
            id: apiModel.id,
            customerId: apiModel.customerId,
            customerName: apiModel.customerName || 'Unknown Customer',
            number: apiModel.number,
            status: apiModel.status as DeliveryNoteStatus,
            date: new Date(apiModel.date),
            items: items
        })
    }

    static toApi(domainEntity: DeliveryNote): DeliveryNoteDTO {
        return {
            id: domainEntity.id,
            customerId: domainEntity.customerId,
            customerName: domainEntity.customerName,
            number: domainEntity.number,
            status: domainEntity.status,
            date: domainEntity.date.toISOString(),
            totalAmount: domainEntity.calculateTotalAmount()?.getValue() ?? 0,
            items: domainEntity.items.map(item => ({
                id: item.id,
                name: item.name,
                description: item.name,
                color: item.color.toString(),
                quantity: item.quantity,
                unitPrice: item.price ? item.price.getValue() : 0,
                totalPrice: item.calculateTotalPrice()?.getValue() ?? 0,
                hasPrimer: item.hasPrimer || false,
                isHighThickness: item.isHighThickness || false,
                measurements: item.measurements.hasMeasurements() ? {
                    linearMeters: item.measurements.getLinearMeters() ?? undefined,
                    squareMeters: item.measurements.getSquareMeters() ?? undefined,
                    thickness: item.measurements.getThickness() ?? undefined
                } : {}
            })),
            notes: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    }
}
