
export interface DeliveryNoteItemDTO {
    id: string
    name: string
    description: string
    color: string
    quantity: number
    unitPrice: number
    totalPrice: number
    hasPrimer?: boolean
    isHighThickness?: boolean
    measurements: {
        linearMeters?: number
        squareMeters?: number
        thickness?: number
    }
}

export interface DeliveryNoteDTO {
    id: string
    customerId: string
    customerName: string
    number: string
    status: 'draft' | 'validated' | 'finalized'
    date: string
    totalAmount: number
    items: DeliveryNoteItemDTO[]
    notes?: string
    createdAt: string
    updatedAt: string
}
