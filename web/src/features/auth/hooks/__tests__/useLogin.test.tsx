import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLogin } from '../useLogin'
import { useAuthStore } from '../../stores/authStore'
import * as authApi from '../../api/authApi'
import type { ReactNode } from 'react'

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
    vi.spyOn(authApi, 'login').mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'test@test.com',
      password: '123456'
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('debe guardar usuario en el store después de login exitoso', async () => {
    const mockResponse = {
      token: 'fake-token',
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      }
    }

    vi.spyOn(authApi, 'login').mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'test@test.com',
      password: '123456'
    })

    await waitFor(() => {
      expect(useAuthStore.getState().user).toEqual(mockResponse.user)
    })
  })

  it('debe guardar token en el store después de login exitoso', async () => {
    const mockResponse = {
      token: 'fake-token',
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      }
    }

    vi.spyOn(authApi, 'login').mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'test@test.com',
      password: '123456'
    })

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('fake-token')
    })
  })

  it('debe cambiar isAuthenticated a true después de login exitoso', async () => {
    const mockResponse = {
      token: 'fake-token',
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      }
    }

    vi.spyOn(authApi, 'login').mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'test@test.com',
      password: '123456'
    })

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })
  })

  it('debe manejar error cuando el login falla', async () => {
    const mockError = new Error('Credenciales incorrectas')
    vi.spyOn(authApi, 'login').mockRejectedValue(mockError)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'wrong@test.com',
      password: 'wrongpass'
    })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
  })

  it('debe mantener isLoading en false después de error', async () => {
    const mockError = new Error('Credenciales incorrectas')
    vi.spyOn(authApi, 'login').mockRejectedValue(mockError)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'wrong@test.com',
      password: 'wrongpass'
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('no debe guardar usuario en el store si el login falla', async () => {
    const mockError = new Error('Credenciales incorrectas')
    vi.spyOn(authApi, 'login').mockRejectedValue(mockError)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper()
    })

    result.current.login({
      email: 'wrong@test.com',
      password: 'wrongpass'
    })

    await waitFor(() => {
      expect(useAuthStore.getState().user).toBeNull()
    })
  })
})
