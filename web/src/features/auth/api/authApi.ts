import type { LoginData } from '../types/auth'

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

export const logout = async (): Promise<void> => {
  await fetch('/api/auth/logout', {
    method: 'POST'
  })
}