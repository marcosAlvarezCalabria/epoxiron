import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'
import type { User } from '../../types/auth'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  describe('estado inicial', () => {
    it('debe tener usuario como null', () => {
      const { user } = useAuthStore.getState()
      expect(user).toBeNull()
    })

    it('debe tener isAuthenticated como false', () => {
      const { isAuthenticated } = useAuthStore.getState()
      expect(isAuthenticated).toBe(false)
    })

    it('debe tener token como null', () => {
      const { token } = useAuthStore.getState()
      expect(token).toBeNull()
    })
  })

  describe('setAuth', () => {
    it('debe guardar usuario y token', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      }
      const mockToken = 'fake-jwt-token'

      useAuthStore.getState().setAuth(mockUser, mockToken)

      const { user, token } = useAuthStore.getState()
      expect(user).toEqual(mockUser)
      expect(token).toBe(mockToken)
    })

    it('debe cambiar isAuthenticated a true', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      }

      useAuthStore.getState().setAuth(mockUser, 'token')

      const { isAuthenticated } = useAuthStore.getState()
      expect(isAuthenticated).toBe(true)
    })

    it('debe aceptar usuario con role opcional', () => {
      const mockUser: User = {
        id: '1',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'admin'
      }

      useAuthStore.getState().setAuth(mockUser, 'token')

      const { user } = useAuthStore.getState()
      expect(user?.role).toBe('admin')
    })
  })

  describe('logout', () => {
    it('debe limpiar usuario y token', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      }

      useAuthStore.getState().setAuth(mockUser, 'token')
      useAuthStore.getState().logout()

      const { user, token } = useAuthStore.getState()
      expect(user).toBeNull()
      expect(token).toBeNull()
    })

    it('debe cambiar isAuthenticated a false', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      }

      useAuthStore.getState().setAuth(mockUser, 'token')
      useAuthStore.getState().logout()

      const { isAuthenticated } = useAuthStore.getState()
      expect(isAuthenticated).toBe(false)
    })

    it('debe funcionar incluso si no hay usuario logueado', () => {
      expect(() => useAuthStore.getState().logout()).not.toThrow()
    })
  })

  describe('actualización de usuario', () => {
    it('debe permitir actualizar datos del usuario', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      }

      useAuthStore.getState().setAuth(mockUser, 'token')

      const updatedUser: User = {
        ...mockUser,
        name: 'Updated Name'
      }

      useAuthStore.getState().setAuth(updatedUser, 'token')

      const { user } = useAuthStore.getState()
      expect(user?.name).toBe('Updated Name')
    })
  })
})
