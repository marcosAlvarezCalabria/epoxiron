/**
 * INFRASTRUCTURE: AuthRepository
 *
 * Handles external data access for authentication.
 *
 * Location: Infrastructure Layer
 * Reason: Depends on external APIs and localStorage
 * Dependencies: Domain entities (User, Email, Token, AuthException)
 */

import { User } from '@/domain/entities/User'
import { Email } from '@/domain/value-objects/Email'
import { Token } from '@/domain/value-objects/Token'
import { AuthException } from '@/domain/exceptions/AuthException'
import type { AuthRepository as IAuthRepository } from '@/domain/repositories/AuthRepository'

interface LoginApiResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role?: string
  }
}

export class AuthRepository implements IAuthRepository {
  private readonly apiUrl: string
  private readonly tokenStorageKey = 'auth_token'

  constructor(apiUrl: string = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:3000/api/auth')) {
    this.apiUrl = apiUrl
  }

  async login(email: Email, password: string): Promise<{ user: User; token: Token }> {
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.getValue(),
          password,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw AuthException.invalidCredentials()
        }

        throw new Error(`Error HTTP ${response.status}`)
      }

      const data: LoginApiResponse = await response.json()

      const user = new User({
        id: data.user.id,
        email: new Email(data.user.email),
        name: data.user.name,
        role: (data.user.role as 'admin' | 'user' | 'guest') || 'user',
      })

      const token = new Token(data.token)

      this.saveToken(token)

      return { user, token }

    } catch (error) {
      if (error instanceof AuthException) {
        throw error
      }

      throw new Error('Error de conexión con el servidor')
    }
  }

  logout(): void {
    this.removeToken()
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getStoredToken()

    if (!token) {
      return null
    }

    if (token.isExpired()) {
      this.removeToken()
      throw AuthException.tokenExpired()
    }

    try {
      const response = await fetch(`${this.apiUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${token.getValue()}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken()
          throw AuthException.unauthorized()
        }
        throw new Error(`Error HTTP ${response.status}`)
      }

      const data = await response.json()

      return new User({
        id: data.id,
        email: new Email(data.email),
        name: data.name,
        role: data.role || 'user',
      })

    } catch (error) {
      if (error instanceof AuthException) {
        throw error
      }

      this.removeToken()
      return null
    }
  }

  private saveToken(token: Token): void {
    localStorage.setItem(this.tokenStorageKey, token.getValue())
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenStorageKey)
  }

  getStoredToken(): Token | null {
    const tokenString = localStorage.getItem(this.tokenStorageKey)

    if (!tokenString) {
      return null
    }

    try {
      return new Token(tokenString)
    } catch {
      this.removeToken()
      return null
    }
  }

  hasValidToken(): boolean {
    const token = this.getStoredToken()

    if (!token) {
      return false
    }

    return !token.isExpired()
  }
}
