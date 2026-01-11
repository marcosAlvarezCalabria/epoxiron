/**
 * PRESENTATION COMPONENT: LoginForm
 *
 * Form component for user authentication.
 *
 * Location: Presentation Layer
 * Reason: UI component that connects form validation with login use case
 * Dependencies: React Hook Form, Zod schema, useLogin hook
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormData } from '../schemas/loginSchema'
import { AuthException } from '@/domain/exceptions/AuthException'

export function LoginForm() {
  const navigate = useNavigate()
  const { login, isLoading, isError, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          navigate('/dashboard')
        },
      }
    )
  }

  const getErrorMessage = (): string | null => {
    if (!isError || !error) return null

    if (error instanceof AuthException) {
      if (error.isCredentialsError()) {
        return 'Email o contraseña incorrectos'
      }
      if (error.isTokenError()) {
        return 'Error en la autenticación. Por favor, intenta de nuevo.'
      }
      return error.message
    }

    return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
  }

  const errorMessage = getErrorMessage()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="tu@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
          isLoading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
