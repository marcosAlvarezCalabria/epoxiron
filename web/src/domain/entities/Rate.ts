/**
 * ENTITY: Rate (Tarifa)
 * Represents the pricing agreement for a customer.
 */

export interface SpecialPiece {
    name: string
    price: number
}

export interface RateProps {
    id: string
    customerId: string
    pricePerLinearMeter: number // Normalized name
    pricePerSquareMeter: number
    minimumPrice: number
    specialPieces: SpecialPiece[]
    createdAt: Date
    updatedAt: Date
}

export class Rate {
    private readonly _id: string
    private readonly _customerId: string
    private _pricePerLinearMeter: number
    private _pricePerSquareMeter: number
    private _minimumPrice: number
    private _specialPieces: SpecialPiece[]
    private readonly _createdAt: Date
    private _updatedAt: Date

    constructor(props: RateProps) {
        this.validatePrices(props.pricePerLinearMeter, props.pricePerSquareMeter, props.minimumPrice)

        this._id = props.id
        this._customerId = props.customerId
        this._pricePerLinearMeter = props.pricePerLinearMeter
        this._pricePerSquareMeter = props.pricePerSquareMeter
        this._minimumPrice = props.minimumPrice
        this._specialPieces = props.specialPieces
        this._createdAt = props.createdAt
        this._updatedAt = props.updatedAt
    }

    private validatePrices(lm: number, sm: number, min: number): void {
        if (lm < 0 || sm < 0 || min < 0) {
            throw new Error('Prices cannot be negative')
        }
    }

    // Getters
    get id(): string { return this._id }
    get customerId(): string { return this._customerId }
    get pricePerLinearMeter(): number { return this._pricePerLinearMeter }
    get pricePerSquareMeter(): number { return this._pricePerSquareMeter }
    get minimumPrice(): number { return this._minimumPrice }
    get specialPieces(): SpecialPiece[] { return [...this._specialPieces] } // Return copy
    get createdAt(): Date { return this._createdAt }
    get updatedAt(): Date { return this._updatedAt }

    // Methods
    updatePrices(lm: number, sm: number, min: number): void {
        this.validatePrices(lm, sm, min)
        this._pricePerLinearMeter = lm
        this._pricePerSquareMeter = sm
        this._minimumPrice = min
        this._updatedAt = new Date()
    }

    addSpecialPiece(name: string, price: number): void {
        if (price < 0) throw new Error('Price cannot be negative')
        this._specialPieces.push({ name, price })
        this._updatedAt = new Date()
    }
}
