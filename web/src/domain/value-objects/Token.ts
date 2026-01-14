/**
 * VALUE OBJECT: Token
 *
 * Represents an immutable JWT token for authentication.
 *
 * Location: Domain Layer
 * Reason: Represents business concept "authentication credential"
 * Dependencies: None (pure TypeScript)
 */

export class Token {
  private readonly value: string

  constructor(tokenString: string) {
    if (!tokenString || tokenString.trim().length === 0) {
      throw new Error('Token no puede estar vacío')
    }

    this.value = tokenString.trim()
  }

  isValidFormat(): boolean {
    const parts = this.value.split('.')
    return parts.length === 3
  }

  getPayload(): Record<string, unknown> {
    if (!this.isValidFormat()) {
      throw new Error('Token no tiene formato JWT válido')
    }

    try {
      const [, payloadBase64] = this.value.split('.')
      const payloadJson = atob(payloadBase64)
      return JSON.parse(payloadJson)
    } catch {
      throw new Error('No se pudo decodificar el payload del token')
    }
  }

  isExpired(): boolean {
    try {
      const payload = this.getPayload()

      if (payload.exp && typeof payload.exp === 'number') {
        const nowInSeconds = Math.floor(Date.now() / 1000)
        return payload.exp < nowInSeconds
      }

      return false
    } catch {
      return true
    }
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }

  toJSON(): Record<string, unknown> {
    return {
      value: this.value
    }
  }

  equals(other: Token): boolean {
    return this.value === other.value
  }
}
