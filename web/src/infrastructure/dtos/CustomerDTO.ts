
export interface CustomerDTO {
    id: string
    name: string
    email?: string
    phone?: string
    address?: string
    notes?: string

    // Pricing
    pricePerLinearMeter: number
    pricePerSquareMeter: number
    minimumRate: number
    specialPieces: Array<{ name: string; price: number }>

    createdAt: string
    updatedAt: string
}
