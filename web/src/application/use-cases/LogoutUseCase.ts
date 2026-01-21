/**
 * USE CASE: LogoutUseCase
 *
 * Handles user logout flow.
 *
 * Location: Application Layer
 * Reason: Business action orchestration
 * Dependencies: Infrastructure (repository)
 */

import type { AuthRepository } from '../../domain/repositories/AuthRepository'

export type LogoutOutput = {
  success: boolean
}

export class LogoutUseCase {
  private authRepository: AuthRepository

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  execute(): LogoutOutput {
    this.authRepository.logout()

    return {
      success: true,
    }
  }
}
