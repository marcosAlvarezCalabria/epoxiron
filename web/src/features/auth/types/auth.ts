export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  role?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface AuthError {
  message: string
  code?: string
}
