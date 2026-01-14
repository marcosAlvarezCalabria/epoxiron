/**
 * Tests for authApi
 *
 * These tests verify the API layer functions for authentication.
 * Note: authApi is a thin wrapper over fetch. The real business logic
 * is in AuthRepository (infrastructure layer).
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { login, logout } from '../authApi'
import type { LoginData } from '../../types/auth'

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should return token and user when credentials are correct', async () => {
      // Given: Mock successful API response
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'fake-token-123',
          user: {
            id: '1',
            email: 'test@test.com',
            name: 'Test User'
          }
        })
      })

      const loginData: LoginData = {
        email: 'test@test.com',
        password: '123456'
      }

      // When: Login is called
      const response = await login(loginData)

      // Then: Should return token and user
      expect(response.token).toBe('fake-token-123')
      expect(response.user).toBeDefined()
      expect(response.user.email).toBe(loginData.email)
      expect(response.user.name).toBe('Test User')
    })

    it('should call fetch with correct parameters', async () => {
      // Given: Mock fetch
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'fake-token-123',
          user: {
            id: '1',
            email: 'test@test.com',
            name: 'Test User'
          }
        })
      })
      globalThis.fetch = mockFetch

      const loginData: LoginData = {
        email: 'test@test.com',
        password: '123456'
      }

      // When: Login is called
      await login(loginData)

      // Then: Fetch should be called with correct parameters
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
    })

    it('should throw error when credentials are incorrect', async () => {
      // Given: Mock failed API response
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401
      })

      const loginData: LoginData = {
        email: 'wrong@test.com',
        password: 'wrongpass'
      }

      // When/Then: Should throw error
      await expect(login(loginData)).rejects.toThrow('Login failed')
    })

    it('should throw error when server returns 400', async () => {
      // Given: Mock bad request response
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400
      })

      const loginData: LoginData = {
        email: 'test@test.com',
        password: '123456'
      }

      // When/Then: Should throw error
      await expect(login(loginData)).rejects.toThrow('Login failed')
    })

    it('should throw error when server returns 500', async () => {
      // Given: Mock server error response
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const loginData: LoginData = {
        email: 'test@test.com',
        password: '123456'
      }

      // When/Then: Should throw error
      await expect(login(loginData)).rejects.toThrow('Login failed')
    })
  })

  describe('logout', () => {
    it('should call logout endpoint', async () => {
      // Given: Mock fetch
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true
      })
      globalThis.fetch = mockFetch

      // When: Logout is called
      await logout()

      // Then: Should call logout endpoint with POST
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST'
      })
    })

    it('should not throw error even if request fails', async () => {
      // Given: Mock failed logout response
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      // When/Then: Should not throw (logout is fire-and-forget)
      await expect(logout()).resolves.toBeUndefined()
    })
  })
})
