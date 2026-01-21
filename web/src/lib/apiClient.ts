/**
 * API CLIENT HELPER
 *
 * Utility function to make authenticated requests to the backend
 * Automatically adds the JWT token from authStore to all requests
 */

import { useAuthStore } from '../features/auth/stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean
}

/**
 * Enhanced fetch that automatically adds JWT token
 *
 * @param endpoint - API endpoint (e.g., '/customers', '/rates')
 * @param options - Fetch options (method, body, etc.)
 * @returns Promise with the response data
 */
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  }

  // Add JWT token if authentication is required
  if (requiresAuth) {
    const token = useAuthStore.getState().token
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  // Make the request
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
    cache: 'no-store' // Ensure we never read from browser cache for API calls
  })

  // Handle errors
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid - logout user
      useAuthStore.getState().logout()
      throw new Error('Session expired. Please login again.')
    }

    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP Error ${response.status}`)
  }

  // Handle 204 No Content (DELETE requests)
  if (response.status === 204) {
    return undefined as T
  }

  // Parse and return JSON
  return response.json()
}
