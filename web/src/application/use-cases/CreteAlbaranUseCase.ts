import { DeliveryNote } from "@/domain/entities/DeliveryNote";
//import { DeliveryNoteRepository } from "@/infrastructure/repositories/DeliveryNoteRepository";


export interface CreateDeliveryNoteInput {
    customerId: string;
    number: string;
    id: string;
}
export interface CreateDeliveryNoteOutput {
    deliveryNote: DeliveryNote;
    success: boolean;
}

export class CreateDeliveryNoteUseCase {
    //private deliveryNoteRepository: DeliveryNoteRepository;

    constructor(
        //deliveryNoteRepository: DeliveryNoteRepository
    ) {
        //this.deliveryNoteRepository = deliveryNoteRepository;     

    }
}