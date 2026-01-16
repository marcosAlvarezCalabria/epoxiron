/**
 * PRESENTATION STORE: authStore
 * Global authentication state for React.
 * Location: Presentation Layer
 * Dependencies: Domain (User, Token)
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../../../domain/entities/User'
import { Token } from '../../../domain/value-objects/Token'

// Interface compatible with Domain User/Token but serializable for Zustand persist
interface AuthState {
  user: User | null
  token: Token | null
  isAuthenticated: boolean
}

interface AuthActions {
  setAuth: (user: User, token: Token) => void
  logout: () => void
  isAdmin: () => boolean
  canDeleteClients: () => boolean
  getToken: () => string | null
}

type AuthStore = AuthState & AuthActions

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

      getToken: () => {
        const { token } = get()
        return token?.getValue() ?? null
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null

          try {
            const parsed = JSON.parse(str)
            const state = parsed.state

            // Rehydrate User entity
            if (state.user) {
              // User.fromJSON expects a plain object with id, email, name, role
              // State.user from storage is that plain object
              state.user = User.fromJSON(state.user)
            }

            // Rehydrate Token value object
            if (state.token && state.token.value) {
              state.token = new Token(state.token.value)
            } else if (state.token) {
              // Fallback if token is stored as string or different shape (unlikely with current implementation)
              // The Token class has 'value' property.
              // If serialized via JSON.stringify directly on the object, it keeps properties.
              // Token has `value` property.
              // But wait, Token `value` is private. 
              // JSON.stringify on Token uses toJSON() if available or default.
              // Token.ts DOES NOT have toJSON().
              // So JSON.stringify(token) will effectively be empty {} if all props are private?
              // Let's check Token.ts again.
              // Token has `private readonly value: string`. 
              // JSON.stringify ignores private properties? No, it ignores non-enumerables?
              // TS Private is soft. JS runtime it is just a property 'value'.
              // So it should be there.
              if (typeof state.token === 'string') {
                state.token = new Token(state.token)
              } else if (state.token.value) {
                state.token = new Token(state.token.value)
              }
            }

            return parsed
          } catch (err) {
            console.error('Error rehydrating auth state:', err)
            return null
          }
        },
        setItem: (name, value) => {
          // Default storage behavior for saving
          // We might want to ensure toJSON is called or effectively serialized
          // User has toJSON(). Token does NOT have toJSON(). 
          // We should add toJSON to Token or handle it here?
          // If we don't handle it, JSON.stringify might save Token as { value: "..." } if private field is enumerable (usually yes in TS transpile).
          // But checking Token.ts (Step 205), saving `value` property. 
          // Better to safe-guard saving here?
          // Ideally Domain objects should know how to serialize themselves.
          // User.ts has toJSON().
          // Token.ts needs toJSON() to be safe? 
          // Or we just rely on default.
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => localStorage.removeItem(name),
      }
    }
  )
)
