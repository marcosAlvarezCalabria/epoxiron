import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/loginSchema'
import { useLogin } from '../hooks/useLogin'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'



export function LoginForm() {
  const { login, isLoading, error, isSuccess } = useLogin()
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }
  useEffect(() => {
    if (isSuccess) {
      navigate('/dashboard')
    }
  }, [isSuccess, navigate])

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Campo Email */}
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="admin@epoxiron.com"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Campo Password */}
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="••••••"
            required
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error del servidor */}
        {error && (
          <div 
            role="alert" 
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-800">
              ❌ {error.message}
            </p>
          </div>
        )}

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '⏳ Cargando...' : '🚀 Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}