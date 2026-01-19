/**
 * VALUE OBJECT: Price
 *
 * Represents a monetary price in euros.
 *
 * Location: Domain Layer
 * Reason: Business concept - a price must be valid (positive, correct format)
 * Dependencies: None (pure TypeScript)
 */

export class Price {
  private readonly value: number

  constructor(value: number) {
    if (value < 0) {
      throw new Error(`Price cannot be negative: ${value}`)
    }



    this.value = Math.round(value * 100) / 100
  }

  getValue(): number {
    return this.value
  }

  equals(other: Price): boolean {
    return this.value === other.value
  }

  add(other: Price): Price {
    return new Price(this.value + other.value)
  }

  multiply(quantity: number): Price {
    return new Price(this.value * quantity)
  }

  toString(): string {
    return `${this.value.toFixed(2)}€`
  }
}
