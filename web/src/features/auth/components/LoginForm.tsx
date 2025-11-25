import { useState, useEffect, useRef } from 'react'
import type { LoginData } from '../types/auth'

interface LoginFormProps {
  onSubmit: (data: LoginData) => void
  isLoading?: boolean
  error?: string | null
}

export function LoginForm({ onSubmit, isLoading = false, error = null }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  })
  
  const [validationErrors, setValidationErrors] = useState<Partial<LoginData>>({})
  const [showError, setShowError] = useState(error)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus()
    }
  }, [])

  useEffect(() => {
    setShowError(error)
  }, [error])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const errors: Partial<LoginData> = {}
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Ingresa un email válido'
    }
    
    if (!formData.password.trim()) {
      errors.password = 'La contraseña es requerida'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof LoginData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (showError) {
      setShowError(null)
    }
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) return
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          ref={emailRef}
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.email 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300'
          }`}
          aria-describedby={validationErrors.email ? 'email-error' : undefined}
          aria-invalid={!!validationErrors.email}
        />
        {validationErrors.email && (
          <p id="email-error" className="mt-2 text-sm text-red-600">
            {validationErrors.email}
          </p>
        )}
      </div>

      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.password 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300'
          }`}
          aria-describedby={validationErrors.password ? 'password-error' : undefined}
          aria-invalid={!!validationErrors.password}
        />
        {validationErrors.password && (
          <p id="password-error" className="mt-2 text-sm text-red-600">
            {validationErrors.password}
          </p>
        )}
      </div>

      {showError && (
        <div role="alert" className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{showError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}