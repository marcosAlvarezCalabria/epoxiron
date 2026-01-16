import { DeliveryNote } from '../../domain/entities/DeliveryNote'
import { Item } from '../../domain/entities/Item'
import { RACColor } from '../../domain/value-objects/RACColor'
import { Measurements } from '../../domain/value-objects/Measurements'
import { Price } from '../../domain/value-objects/Price'
import type { DeliveryNote as ApiDeliveryNote, DeliveryNoteItem as ApiDeliveryNoteItem } from '../../features/delivery-notes/types/DeliveryNote'
import type { DeliveryNoteStatus } from '../../domain/entities/DeliveryNote'

export class DeliveryNoteMapper {
    static toDomain(apiModel: ApiDeliveryNote): DeliveryNote {
        const items = apiModel.items.map(apiItem => this.toDomainItem(apiItem))
        const date = new Date(apiModel.date)

        return new DeliveryNote({
            id: apiModel.id,
            number: apiModel.number || 'UNKNOWN',
            customerId: apiModel.customerId,
            date: date,
            status: apiModel.status as DeliveryNoteStatus,
            items: items
        })
    }

    static toDomainItem(apiItem: ApiDeliveryNoteItem): Item {
        let color: RACColor
        if (apiItem.racColor) {
            color = RACColor.createRAC(apiItem.racColor)
        } else {
            color = RACColor.createSpecial(apiItem.specialColor || apiItem.color || 'Sin color')
        }

        const measurements = apiItem.measurements
            ? new Measurements({
                linearMeters: apiItem.measurements.linearMeters,
                squareMeters: apiItem.measurements.squareMeters,
                thickness: apiItem.measurements.thickness
            })
            : Measurements.createWithoutMeasurements()

        const price = apiItem.unitPrice !== undefined
            ? new Price(apiItem.unitPrice)
            : undefined

        return new Item({
            id: apiItem.id,
            name: apiItem.name,
            color: color,
            quantity: apiItem.quantity,
            measurements: measurements,
            price: price
        })
    }

    static toApi(domainEntity: DeliveryNote): ApiDeliveryNote {
        return {
            id: domainEntity.id,
            number: domainEntity.number,
            customerId: domainEntity.customerId,
            customerName: 'Unknown',
            date: domainEntity.date.toISOString(),
            status: domainEntity.status as 'draft' | 'pending' | 'reviewed',
            items: domainEntity.items.map(item => this.toApiItem(item)),
            totalAmount: domainEntity.calculateTotalAmount()?.getValue() ?? 0,
            notes: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    }

    static toApiItem(domainItem: Item): ApiDeliveryNoteItem {
        return {
            id: domainItem.id,
            name: domainItem.name,
            description: domainItem.name,
            quantity: domainItem.quantity,
            color: domainItem.color.toString(),
            racColor: domainItem.color.isRACColor() ? domainItem.color.getCode() : undefined,
            specialColor: domainItem.color.isSpecialColor() ? domainItem.color.getCode() : undefined,
            measurements: {
                linearMeters: domainItem.measurements.getLinearMeters() ?? undefined,
                squareMeters: domainItem.measurements.getSquareMeters() ?? undefined,
                thickness: domainItem.measurements.getThickness() ?? undefined
            },
            unitPrice: domainItem.price?.getValue(),
            totalPrice: domainItem.calculateTotalPrice()?.getValue() ?? 0,
            notes: undefined
        }
    }
}
