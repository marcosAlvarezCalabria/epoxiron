/**
 * USE CASE: LoginUseCase
 *
 * Handles user login flow.
 *
 * Location: Application Layer
 * Reason: Orchestrates business logic flow
 * Dependencies: Domain (entities, exceptions), Infrastructure (repository)
 */

import { User } from '../../domain/entities/User'
import { Email } from '../../domain/value-objects/Email'
import { Token } from '../../domain/value-objects/Token'
import { AuthException } from '@/domain/exceptions/AuthException'
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository'

export type LoginInput = {
  email: string
  password: string
}

export type LoginOutput = {
  user: User
  token: Token
  success: boolean
}

export class LoginUseCase {
  private authRepository: AuthRepository

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  async execute(input: LoginInput): Promise<LoginOutput> {
    try {
      // Validate and create value objects
      let email: Email
      try {
        email = new Email(input.email)
      } catch {
        throw new AuthException(
          'INVALID_CREDENTIALS',
          'Email no es válido'
        )
      }

      // Validate password
      if (!input.password || input.password.length < 6) {
        throw new AuthException(
          'INVALID_CREDENTIALS',
          'La contraseña debe tener al menos 6 caracteres'
        )
      }

      // Call repository
      const { user, token } = await this.authRepository.login(email, input.password)

      // Validate token
      if (token.isExpired()) {
        throw AuthException.tokenExpired()
      }

      if (!token.isValidFormat()) {
        throw AuthException.tokenInvalid()
      }

      return {
        user,
        token,
        success: true,
      }

    } catch (error) {
      if (error instanceof AuthException) {
        throw error
      }

      throw new AuthException(
        'INVALID_CREDENTIALS',
        'Error al iniciar sesión. Por favor intenta nuevamente.'
      )
    }
  }
}
