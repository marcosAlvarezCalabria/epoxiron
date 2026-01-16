/**
 * PAGE: Login - Diseño profesional basado en Stitch
 * Responsive para mobile y desktop
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/stores/authStore'
import { login as loginApi } from '../features/auth/api/authApi'
import { User } from '../domain/entities/User'
import { Email } from '../domain/value-objects/Email'
import { Token } from '../domain/value-objects/Token'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Call the real backend API
      const response = await loginApi({ email, password })

      // Transform API response to Domain Entities (Construction: Raw materials -> Structure)
      const userEmail = new Email(response.user.email)
      const token = new Token(response.token)

      const user = new User({
        id: response.user.id || 'temp-id', // Ensure ID exists
        email: userEmail,
        name: response.user.name,
        role: ((response.user as any).role) || 'user'
      })

      // Save user and token in authStore
      setAuth(user, token)

      navigate('/dashboard')
    } catch (err) {
      setError('Email o contraseña incorrectos')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] lg:max-w-[500px] flex flex-col items-stretch">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 6l-8 4-8-4V4l8 4 8-4v2zM2 8l8 4v8l-8-4V8zm12 12V12l8-4v8l-8 4z" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tight">Epoxiron</h1>
          <p className="text-gray-400 mt-2 text-lg lg:text-xl">Gestión de Taller</p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 sm:p-10">
          <h2 className="text-white text-2xl lg:text-3xl font-semibold leading-tight pb-8">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-800/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="flex flex-col flex-1">
                <p className="text-gray-300 text-sm font-medium leading-normal pb-2">
                  Correo electrónico
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex w-full min-w-0 flex-1 rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-blue-600/40 border border-gray-700 bg-gray-900 focus:border-blue-600 h-14 placeholder:text-gray-500 p-[15px] text-base font-normal transition-all disabled:opacity-50"
                  placeholder="nombre@empresa.com"
                />
              </label>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="flex flex-col flex-1">
                <p className="text-gray-300 text-sm font-medium leading-normal pb-2">
                  Contraseña
                </p>
                <div className="relative flex w-full items-stretch">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="flex w-full min-w-0 flex-1 rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-blue-600/40 border border-gray-700 bg-gray-900 focus:border-blue-600 h-14 placeholder:text-gray-500 p-[15px] pr-12 text-base font-normal transition-all disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      ) : (
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                      )}
                    </svg>
                  </button>
                </div>
              </label>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="h-5 w-5 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer disabled:opacity-50"
                />
                <label
                  htmlFor="remember-me"
                  className="text-gray-300 text-sm font-normal cursor-pointer select-none"
                >
                  Recordar usuario
                </label>
              </div>
              <button
                type="button"
                disabled={isLoading}
                className="text-blue-600 text-sm font-medium hover:text-blue-400 transition-colors disabled:opacity-50"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Accediendo...' : 'Acceder'}
            </button>
          </form>
        </div>

        {/* Professional Banner */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-gray-700">
          <div className="w-full bg-center bg-no-repeat bg-cover aspect-[21/7] flex items-end p-4 bg-gradient-to-t from-gray-900/90 to-transparent bg-gray-800">
            <p className="text-gray-400 text-[10px] lg:text-xs font-semibold uppercase tracking-[0.1em]">
              Gestión Profesional Epoxiron v2.4
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 mb-6 text-center text-gray-600 text-xs lg:text-sm">
          <p>© 2024 Epoxiron Industrial Solutions. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}
