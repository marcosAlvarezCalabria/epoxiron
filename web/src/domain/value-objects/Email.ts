/**
 * VALUE OBJECT: Email
 *
 * Represents an immutable, validated email address.
 *
 * Location: Domain Layer
 * Dependencies: None (pure TypeScript)
 */

export class Email {
  private readonly value: string

  /**
   * Creates a new Email instance.
   * @param email - The email address to validate and store
   * @throws Error if the email format is invalid
   */
  constructor(email: string) {
    // Normalize first (trim and lowercase), then validate
    const normalized = email.toLowerCase().trim()

    if (!this.isValid(normalized)) {
      throw new Error(`Email inválido: ${email}`)
    }

    this.value = normalized
  }

  /**
   * Validates email format using regex pattern.
   * @param email - The email string to validate
   * @returns true if valid, false otherwise
   */
  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Gets the email value.
   * @returns The validated email string
   */
  getValue(): string {
    return this.value
  }

  /**
   * Compares this email with another email.
   * @param other - Another Email instance to compare
   * @returns true if emails are equal
   */
  equals(other: Email): boolean {
    return this.value === other.value
  }

  /**
   * Converts email to string representation.
   * @returns The email value as string
   */
  toString(): string {
    return this.value
  }
}
