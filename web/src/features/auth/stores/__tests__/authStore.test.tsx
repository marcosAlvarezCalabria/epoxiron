import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'
import { User } from '../../../../domain/entities/User'
import { Email } from '../../../../domain/value-objects/Email'
import { Token } from '../../../../domain/value-objects/Token'

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
      const mockUser = new User({
        id: '1',
        email: new Email('test@test.com'),
        name: 'Test User',
        role: 'user'
      })
      const mockToken = new Token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')

      useAuthStore.getState().setAuth(mockUser, mockToken)

      const { user, token } = useAuthStore.getState()
      expect(user).toBe(mockUser)
      expect(token).toBe(mockToken)
    })

    it('debe cambiar isAuthenticated a true', () => {
      const mockUser = new User({
        id: '1',
        email: new Email('test@test.com'),
        name: 'Test User',
        role: 'user'
      })
      const mockToken = new Token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')

      useAuthStore.getState().setAuth(mockUser, mockToken)

      const { isAuthenticated } = useAuthStore.getState()
      expect(isAuthenticated).toBe(true)
    })

    it('debe aceptar usuario con role admin', () => {
      const mockUser = new User({
        id: '1',
        email: new Email('admin@test.com'),
        name: 'Admin User',
        role: 'admin'
      })
      const mockToken = new Token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')

      useAuthStore.getState().setAuth(mockUser, mockToken)

      const { user } = useAuthStore.getState()
      expect(user?.role).toBe('admin')
      expect(user?.esAdmin()).toBe(true)
    })
  })

  describe('logout', () => {
    it('debe limpiar usuario y token', () => {
      const mockUser = new User({
        id: '1',
        email: new Email('test@test.com'),
        name: 'Test User',
        role: 'user'
      })
      const mockToken = new Token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')

      useAuthStore.getState().setAuth(mockUser, mockToken)
      useAuthStore.getState().logout()

      const { user, token } = useAuthStore.getState()
      expect(user).toBeNull()
      expect(token).toBeNull()
    })

    it('debe cambiar isAuthenticated a false', () => {
      const mockUser = new User({
        id: '1',
        email: new Email('test@test.com'),
        name: 'Test User',
        role: 'user'
      })
      const mockToken = new Token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')

      useAuthStore.getState().setAuth(mockUser, mockToken)
      useAuthStore.getState().logout()

      const { isAuthenticated } = useAuthStore.getState()
      expect(isAuthenticated).toBe(false)
    })

    it('debe funcionar incluso si no hay usuario logueado', () => {
      expect(() => useAuthStore.getState().logout()).not.toThrow()
    })
  })

  describe('helpers del store', () => {
    it('isAdmin debe retornar true para usuario admin', () => {
      const adminUser = new User({
        id: '1',
        email: new Email('admin@test.com'),
        name: 'Admin',
        role: 'admin'
      })
      const mockToken = new Token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')

      useAuthStore.getState().setAuth(adminUser, mockToken)

      expect(useAuthStore.getState().isAdmin()).toBe(true)
    })

    it('isAdmin debe retornar false para usuario normal', () => {
      const normalUser = new User({
        id: '1',
        email: new Email('user@test.com'),
        name: 'User',
        role: 'user'
      })
      const mockToken = new Token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')

      useAuthStore.getState().setAuth(normalUser, mockToken)

      expect(useAuthStore.getState().isAdmin()).toBe(false)
    })

    it('canDeleteClients debe retornar true para admin', () => {
      const adminUser = new User({
        id: '1',
        email: new Email('admin@test.com'),
        name: 'Admin',
        role: 'admin'
      })
      const mockToken = new Token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')

      useAuthStore.getState().setAuth(adminUser, mockToken)

      expect(useAuthStore.getState().canDeleteClients()).toBe(true)
    })
  })
})
