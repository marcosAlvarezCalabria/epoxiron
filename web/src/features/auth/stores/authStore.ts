/**
 * PRESENTATION STORE: authStore
 *
 * Global authentication state for React with persistence.
 *
 * Location: Presentation Layer
 * Reason: React-specific state management (Zustand)
 * Dependencies: Domain entities (User, Token)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/domain/entities/User'
import { Token } from '@/domain/value-objects/Token'

interface AuthStore {
  user: User | null
  token: Token | null
  isAuthenticated: boolean

  setAuth: (user: User, token: Token) => void
  logout: () => void

  isAdmin: () => boolean
  canDeleteClients: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set(() => ({
          user,
          token,
          isAuthenticated: true,
        }))
      },

      logout: () => {
        set(() => ({
          user: null,
          token: null,
          isAuthenticated: false,
        }))
      },

      isAdmin: () => {
        const { user } = get()
        return user?.esAdmin() ?? false
      },

      canDeleteClients: () => {
        const { user } = get()
        return user?.puedeEliminarClientes() ?? false
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
)
