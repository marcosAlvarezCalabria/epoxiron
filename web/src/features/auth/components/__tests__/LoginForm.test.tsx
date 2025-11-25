import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'
import type { LoginData } from '../../types/auth'

// 📝 TESTS PARA LOGIN FORM - UI Layer


describe('LoginForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isLoading: false,
    error: null
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar todos los campos del formulario', () => {
    render(<LoginForm {...defaultProps} />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña|password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión|login/i })).toBeInTheDocument()
  })

  it('debe mostrar los valores que escribe el usuario', async () => {
    const user = userEvent.setup()
    render(<LoginForm {...defaultProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña|password/i)
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('debe llamar onSubmit con los datos correctos cuando se envía el formulario', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()
    
    render(<LoginForm {...defaultProps} onSubmit={mockSubmit} />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/contraseña|password/i), 'password123')
    
    await user.click(screen.getByRole('button', { name: /iniciar sesión|login/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      } as LoginData)
    })
  })

  it('debe mostrar error de validación si el email está vacío', async () => {
    const user = userEvent.setup()
    render(<LoginForm {...defaultProps} />)
    
    await user.type(screen.getByLabelText(/contraseña|password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /iniciar sesión|login/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email.*requerido|email.*obligatorio/i)).toBeInTheDocument()
    })
  })

  it('debe mostrar error de validación si la contraseña está vacía', async () => {
    const user = userEvent.setup()
    render(<LoginForm {...defaultProps} />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /iniciar sesión|login/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/contraseña.*requerida|contraseña.*obligatoria/i)).toBeInTheDocument()
    })
  })

  it('debe mostrar error de validación si el email tiene formato incorrecto', async () => {
    const user = userEvent.setup()
    render(<LoginForm {...defaultProps} />)
    
    await user.type(screen.getByLabelText(/email/i), 'email-incorrecto')
    await user.type(screen.getByLabelText(/contraseña|password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /iniciar sesión|login/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email.*válido|formato.*email/i)).toBeInTheDocument()
    })
  })

  it('debe deshabilitar el botón y mostrar loading cuando isLoading es true', () => {
    render(<LoginForm {...defaultProps} isLoading={true} />)
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión|login/i })
    
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/cargando|loading/i)).toBeInTheDocument()
  })

  it('debe mostrar mensaje de error cuando error no es null', () => {
    const errorMessage = 'Credenciales incorrectas'
    
    render(<LoginForm {...defaultProps} error={errorMessage} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('debe limpiar errores cuando el usuario empieza a escribir', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Error anterior'
    
    render(<LoginForm {...defaultProps} error={errorMessage} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    
    await user.type(screen.getByLabelText(/email/i), 'nuevo-email@test.com')
    
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument()
  })

  it('debe enfocar el primer campo al cargar', () => {
    render(<LoginForm {...defaultProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveFocus()
  })

  it('debe permitir enviar el formulario presionando Enter', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()
    
    render(<LoginForm {...defaultProps} onSubmit={mockSubmit} />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/contraseña|password/i), 'password123')
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })
})