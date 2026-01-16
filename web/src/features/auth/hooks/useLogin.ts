/**
 * PRESENTATION HOOK: useLogin
 *
 * React hook that adapts LoginUseCase to React.
 *
 * Location: Presentation Layer
 * Reason: React-specific adapter (uses hooks, React Query)
 * Dependencies: Application (LoginUseCase), Infrastructure (AuthRepository), Domain (AuthException)
 */

import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import { LoginUseCase, type LoginInput } from '../../../application/use-cases/LoginUseCase'
import { AuthRepository } from '../../../infrastructure/repositories/AuthRepository'
import { AuthException } from '../../../domain/exceptions/AuthException'

const authRepository = new AuthRepository()
const loginUseCase = new LoginUseCase(authRepository)

export function useLogin() {
  const { setAuth } = useAuthStore()

  const mutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      return await loginUseCase.execute(input)
    },

    onSuccess: (result) => {
      setAuth(result.user, result.token)
    },

    onError: (error) => {
      if (error instanceof AuthException) {
        console.error(`[Auth Error] ${error.code}: ${error.message}`)
      } else {
        console.error('[Technical Error]', error)
      }
    },
  })

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  }
}
