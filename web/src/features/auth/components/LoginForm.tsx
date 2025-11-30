import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/loginSchema'
import { useLogin } from '../hooks/useLogin'

export function LoginForm() {
  const { login, isLoading, error } = useLogin()

  // useForm = Hook de React Hook Form
  // Maneja TODO el formulario automáticamente
  const {
    register,      // Función para "registrar" inputs
    handleSubmit,  // Función para manejar submit
    formState: { errors }  // Objeto con errores de validación
  } = useForm<LoginFormData>({
    // resolver = "resolvedor" - conecta Zod con React Hook Form
    // zodResolver lee el schema y valida automáticamente
    resolver: zodResolver(loginSchema)
  })

  // Esta función se ejecuta SOLO si la validación pasa
  const onSubmit = (data: LoginFormData) => {
    // data ya está validado por Zod
    // data = { email: "...", password: "..." }
    login(data)
  }

  return (
    <div>
      <h1>Login</h1>

      {/* handleSubmit(onSubmit) = valida y luego ejecuta onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            disabled={isLoading}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <div id="email-error" role="alert" style={{ color: 'red' }}>
              {errors.email.message}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            disabled={isLoading}
            required
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <div id="password-error" role="alert" style={{ color: 'red' }}>
              {errors.password.message}
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
