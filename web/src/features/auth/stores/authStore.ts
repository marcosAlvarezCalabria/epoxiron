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
  isAuthenticated: boolean
  
  login: (userData: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => {
        set(() => ({
          user: userData,
          isAuthenticated: true,
        }))
      },

      logout: () => {
        set(() => ({
          user: null,
          isAuthenticated: false,
        }))
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
