import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
      const loginSpy = vi.spyOn(authApi, 'login').mockResolvedValue({
        token: 'fake-token',
        user: { id: '1', email: 'test@test.com', name: 'Test User' }
      })

      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)

      await user.type(emailInput, 'test@test.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(loginSpy).toHaveBeenCalled()
        const callArgs = loginSpy.mock.calls[0][0]
        expect(callArgs).toEqual({
          email: 'test@test.com',
          password: 'password123'
        })
      })
    })

    it('debe mostrar estado de carga mientras procesa', async () => {
      const user = userEvent.setup()
      vi.spyOn(authApi, 'login').mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)

      await user.type(emailInput, 'test@test.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      expect(screen.getByText(/cargando/i)).toBeInTheDocument()
    })

    it('debe deshabilitar el botón mientras procesa', async () => {
      const user = userEvent.setup()
      vi.spyOn(authApi, 'login').mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)

      await user.type(emailInput, 'test@test.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      expect(submitButton).toBeDisabled()
    })

    it('debe mostrar mensaje de error si login falla', async () => {
      const user = userEvent.setup()
      vi.spyOn(authApi, 'login').mockRejectedValue(
        new Error('Credenciales incorrectas')
      )

      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)

      await user.type(emailInput, 'wrong@test.com')
      await user.type(passwordInput, 'wrongpass')

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument()
    })

    it('debe limpiar errores al empezar a escribir', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      expect(await screen.findByText(/email es requerido/i)).toBeInTheDocument()

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 't')

      expect(screen.queryByText(/email es requerido/i)).not.toBeInTheDocument()
    })
  })

  describe('accesibilidad', () => {
    it('los campos deben tener labels asociados', () => {
      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)

      expect(emailInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()
    })

    it('los campos deben ser requeridos', () => {
      render(<LoginForm />, { wrapper: createWrapper() })

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/contraseña/i)

      expect(emailInput).toBeRequired()
      expect(passwordInput).toBeRequired()
    })

    it('debe mostrar errores con role alert para lectores de pantalla', async () => {
      const user = userEvent.setup()
      render(<LoginForm />, { wrapper: createWrapper() })

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(submitButton)

      const errorAlerts = await screen.findAllByRole('alert')
      expect(errorAlerts.length).toBeGreaterThan(0)
    })
  })
})
