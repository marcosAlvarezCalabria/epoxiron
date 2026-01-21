import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLogin } from '../useLogin'
import { useAuthStore } from '../../stores/authStore'
import { LoginUseCase } from '../../../../application/use-cases/LoginUseCase'
import { AuthException } from '../../../../domain/exceptions/AuthException'
import type { ReactNode } from 'react'

// Mock LoginUseCase class module
vi.mock('../../../../application/use-cases/LoginUseCase')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useLogin', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    vi.clearAllMocks()

    // Setup default mock implementation for LogicUseCase
    const MockedUseCase = vi.mocked(LoginUseCase)
    MockedUseCase.prototype.execute = vi.fn() as any
  })

  it('debe retornar función login y estados iniciales', () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    expect(result.current.login).toBeDefined()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('debe cambiar isLoading a true mientras hace login', async () => {
    const MockedUseCase = vi.mocked(LoginUseCase)
      ; (MockedUseCase.prototype.execute as any).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    act(() => {
      result.current.login({
        email: 'test@test.com',
        password: 'password123'
      })
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })
  })

  it('debe guardar usuario y token en el store después de login exitoso', async () => {
    const mockOutput = {
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      } as any, // Cast to match User type partially or fully
      token: {
        getValue: () => 'fake-token'
      } as any,
      success: true
    }

    const MockedUseCase = vi.mocked(LoginUseCase)
      ; (MockedUseCase.prototype.execute as any).mockResolvedValue(mockOutput)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'test@test.com',
      password: 'password123'
    })

    await waitFor(() => {
      expect(useAuthStore.getState().user).toEqual(mockOutput.user)
      expect(useAuthStore.getState().getToken()).toBe('fake-token')
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })
  })

  it('debe manejar error cuando el login falla', async () => {
    const mockError = new AuthException('INVALID_CREDENTIALS', 'Credenciales incorrectas')
    const MockedUseCase = vi.mocked(LoginUseCase)
      ; (MockedUseCase.prototype.execute as any).mockRejectedValue(mockError)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'test@test.com',
      password: 'password123'
    })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
  })

  it('debe mantener isLoading en false después de error', async () => {
    const mockError = new Error('Gateway Error')
    const MockedUseCase = vi.mocked(LoginUseCase)
      ; (MockedUseCase.prototype.execute as any).mockRejectedValue(mockError)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'test@test.com',
      password: 'password123'
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('no debe guardar usuario en el store si el login falla', async () => {
    const mockError = new Error('Fail')
    const MockedUseCase = vi.mocked(LoginUseCase)
      ; (MockedUseCase.prototype.execute as any).mockRejectedValue(mockError)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'test@test.com',
      password: 'password123'
    })

    await waitFor(() => {
      expect(useAuthStore.getState().user).toBeNull()
    })
  })
})
