/**
 * PRESENTATION STORE: authStore - Versión simplificada para desarrollo rápido
 * Se conectará con MongoDB después
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
  name?: string
  role?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  login: (userData: User, token: string) => void
  logout: () => void
  getToken: () => string | null
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        set(() => ({
          user: userData,
          token: token,
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

      getToken: () => {
        return get().token
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
