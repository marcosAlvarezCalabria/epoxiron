import { useState, type FormEvent } from 'react'
import { useLogin } from '../hooks/useLogin'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const { login, isLoading, error } = useLogin()

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email es requerido')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Email no es válido')
      return false
    }

    setEmailError('')
    return true
  }

  const validatePassword = (password: string): boolean => {
    if (!password.trim()) {
      setPasswordError('Contraseña es requerida')
      return false
    }

    if (password.length < 6) {
      setPasswordError('Contraseña debe tener al menos 6 caracteres')
      return false
    }

    setPasswordError('')
    return true
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (isEmailValid && isPasswordValid) {
      login({ email, password })
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError || error) {
      setEmailError('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordError || error) {
      setPasswordError('')
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
            required
            aria-invalid={!!emailError}
            aria-describedby={emailError ? 'email-error' : undefined}
          />
          {emailError && (
            <div id="email-error" role="alert" style={{ color: 'red' }}>
              {emailError}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            required
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? 'password-error' : undefined}
          />
          {passwordError && (
            <div id="password-error" role="alert" style={{ color: 'red' }}>
              {passwordError}
            </div>
          )}
        </div>

        {error && (
          <div role="alert" style={{ color: 'red' }}>
            Error: {error.message}
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}
