import { DeliveryNote } from '../entities/DeliveryNote'

export interface DeliveryNoteRepository {
    findById(id: string): Promise<DeliveryNote | null>
    findAll(): Promise<DeliveryNote[]>
    save(deliveryNote: DeliveryNote): Promise<DeliveryNote>
    update(deliveryNote: DeliveryNote): Promise<DeliveryNote>
    delete(id: string): Promise<void>
    nextIdentity(): Promise<string>
    nextNumber(): Promise<string>
}
