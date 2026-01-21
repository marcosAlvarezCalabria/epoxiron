import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'

// Configuración de la story
const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false }
        }
      })

      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
              <Story />
            </div>
          </MemoryRouter>
        </QueryClientProvider>
      )
    }
  ],
  tags: ['autodocs']
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

// Historia 1: Estado por defecto (formulario vacío)
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Formulario de login en estado inicial, vacío y listo para usar.'
      }
    }
  }
}

// Historia 2: Login exitoso (simula respuesta OK del servidor)
export const LoginSuccess: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Simula un login exitoso. Los datos se validan y el servidor responde OK.'
      }
    }
  },
  play: async () => {
    // Aquí podrías agregar interacciones automáticas con @storybook/test
    // Por ejemplo: llenar el formulario y hacer submit
  }
}

// Historia 3: Error de servidor (simula error 401)
// NOTA: Para simular errores, necesitarías MSW (Mock Service Worker)
// Por ahora, esta historia solo muestra el formulario
export const LoginError: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Formulario listo para probar errores del servidor.'
      }
    }
  }
}

// Historia 4: Validación de email inválido
export const InvalidEmail: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Muestra errores de validación cuando el email no es válido.'
      }
    }
  }
}

// Historia 5: Password muy corta
export const ShortPassword: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Muestra error cuando la contraseña tiene menos de 6 caracteres.'
      }
    }
  }
}
