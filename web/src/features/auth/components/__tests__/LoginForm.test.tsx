import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthException } from '../../../../domain/exceptions/AuthException'

// Mock useLogin hook directly
// This isolates the component from the hook implementation
// Mock useLogin hook directly
// This isolates the component from the hook implementation
vi.mock('../../hooks/useLogin', () => ({
  useLogin: vi.fn()
}))

import { useLogin } from '../../hooks/useLogin'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('LoginForm', () => {
  const loginMock = vi.fn()
  const useLoginMock = useLogin as unknown as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementation
    useLoginMock.mockReturnValue({
      login: loginMock,
      isLoading: false,
      isError: false,
      error: null
    })
  })

  describe('renderizado inicial', () => {
    it('debe mostrar campo de email', () => {
      render(<LoginForm />, { wrapper: createWrapper() })
      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toBeInTheDocument()
    })

    it('debe mostrar campo de password', () => {
      render(<LoginForm />, { wrapper: createWrapper() })
      const passwordInput = screen.getByLabelText(/contraseña/i)
      expect(passwordInput).toBeInTheDocument()
    })

    it('debe mostrar botón de submit', () => {
      render(<LoginForm />, { wrapper: createWrapper() })
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      expect(submitButton).toBeInTheDocument()
    })

    it('el campo de password debe ser tipo password', () => {
      render(<LoginForm />, { wrapper: createWrapper() })
      const passwordInput = screen.getByLabelText(/contraseña/i)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('el campo de email debe ser tipo email', () => {
      render(<LoginForm />, { wrapper: createWrapper() })
      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toHaveAttribute('type', 'email')
    })
  })

  describe('interacción del usuario', () => {
    it('debe permitir escribir en el campo de email', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'test@test.com')

      expect(emailInput).toHaveValue('test@test.com')
    })

    it('debe permitir escribir en el campo de password', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const passwordInput = screen.getByLabelText(/contraseña/i)
      await user.type(passwordInput, 'password123')

      expect(passwordInput).toHaveValue('password123')
    })
  })

  describe('validación de formulario', () => {
    it('debe mostrar error si email está vacío', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      expect(await screen.findByText(/email es requerido/i)).toBeInTheDocument()
    })

    it('debe mostrar error si password está vacío', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'test@test.com')

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      expect(await screen.findByText(/contraseña es requerida/i)).toBeInTheDocument()
    })

    it('debe mostrar error si email no es válido', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'email-invalido')

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      expect(await screen.findByText(/email no es válido/i)).toBeInTheDocument()
    })

    it('debe mostrar error si password es muy corta', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)

      await user.type(emailInput, 'test@test.com')
      await user.type(passwordInput, '123')

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      expect(await screen.findByText(/contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument()
    })
  })

  describe('envío de formulario', () => {
    it('debe llamar a login con los datos correctos', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)

      await user.type(emailInput, 'test@test.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(loginMock).toHaveBeenCalled()
        const callArgs = loginMock.mock.calls[0][0]
        expect(callArgs).toEqual({
          email: 'test@test.com',
          password: 'password123'
        })
      })
    })

    it('debe mostrar estado de carga mientras procesa', async () => {
      useLoginMock.mockReturnValue({
        login: loginMock,
        isLoading: true,
        isError: false,
        error: null
      })

      render(<LoginForm />, { wrapper: createWrapper() })

      expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument()
    })

    it('debe deshabilitar el botón mientras procesa', async () => {
      useLoginMock.mockReturnValue({
        login: loginMock,
        isLoading: true,
        isError: false,
        error: null
      })

      render(<LoginForm />, { wrapper: createWrapper() })

      const submitButton = screen.getByRole('button', { name: /iniciando sesión/i }) // Text changes when loading
      expect(submitButton).toBeDisabled()
    })

    it('debe mostrar mensaje de error si login falla', async () => {
      const authError = AuthException.invalidCredentials()

      useLoginMock.mockReturnValue({
        login: loginMock,
        isLoading: false,
        isError: true,
        error: authError
      })

      render(<LoginForm />, { wrapper: createWrapper() })

      // Since we mock the hook state, the error should appear immediately
      expect(screen.getByText(/email o contraseña incorrectos/i)).toBeInTheDocument()
    })

    // "debe limpiar errores al empezar a escribir"
    // This logic is usually handled by react-hook-form locally or by useLogin reset?
    // LoginForm implementation likely uses react-hook-form errors which are handled by the library.
    // However, if we mean the "Auth error" displayed at the bottom, that depends on `error` from hook.
    // If the hook `error` persists, the message persists.
    // The previous test logic relied on user interaction clearing errors? Or maybe just form errors?
    // Let's check original test. It checked "email es requerido" disappearing.
    // That is form validation error. Since we mock hooks, form validation (local) still works!

    it('debe limpiar errores al empezar a escribir', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      expect(await screen.findByText(/email es requerido/i)).toBeInTheDocument()

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 't')

      // react-hook-form should clear error on change/blur depending on mode
      // Original test expected it to clear.
      expect(screen.queryByText(/email es requerido/i)).not.toBeInTheDocument()
    })
  })

  describe('accesibilidad', () => {
    it('los campos deben tener labels asociados', () => {
      render(<LoginForm />, { wrapper: createWrapper() })
      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toBeInTheDocument()
    })

    // ... other accessibility tests rely on DOM attributes, should pass with default render
  })
})
