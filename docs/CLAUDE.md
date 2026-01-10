# CLAUDE.md

## Architecture: Pure Clean Architecture + DDD

### Clean Architecture Layers (4 Layers)

```
┌─────────────────────────────────────────┐
│   Presentation Layer (React)            │  ← UI, Hooks, Stores
│   src/features/*/components/            │
│   src/features/*/hooks/                 │
│   src/features/*/stores/                │
│   src/pages/                            │
├─────────────────────────────────────────┤
│   Application Layer                     │  ← Use Cases (orchestration)
│   src/application/use-cases/            │
├─────────────────────────────────────────┤
│   Domain Layer                          │  ← Entities, Value Objects, Rules
│   src/domain/entities/                  │
│   src/domain/value-objects/             │
│   src/domain/exceptions/                │
├─────────────────────────────────────────┤
│   Infrastructure Layer                  │  ← APIs, Repositories, External
│   src/infrastructure/repositories/      │
│   src/infrastructure/api/               │
└─────────────────────────────────────────┘
```

**Dependency Rule (CRITICAL):**
- ⬇️ Dependencies flow INWARD (outer layers depend on inner)
- ❌ Inner layers NEVER depend on outer layers
- ✅ Domain is the center - ZERO dependencies (pure TypeScript)
- ✅ Application depends ONLY on Domain
- ✅ Infrastructure depends ONLY on Domain
- ✅ Presentation depends on Application + Domain + Infrastructure

**Dependency Flow:**
```
Presentation → Application → Domain
     ↓              ↓
Infrastructure ────┘
```

### Domain-Driven Design (DDD) Concepts

**1. Entities** - Objects with unique identity and lifecycle
```typescript
// src/domain/entities/User.ts
export class User {
  private readonly _id: string
  private _email: Email
  private _name: string
  private _role: UserRole

  // Business logic methods
  esAdmin(): boolean {
    return this._role === 'admin'
  }

  puedeEliminarClientes(): boolean {
    return this._role === 'admin'
  }
}
```

**2. Value Objects** - Immutable objects without identity
```typescript
// src/domain/value-objects/Email.ts
export class Email {
  private readonly value: string

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error(`Email inválido: ${email}`)
    }
    this.value = email.toLowerCase().trim()
  }

  getValue(): string { return this.value }
  equals(other: Email): boolean { return this.value === other.value }
}
```

**3. Domain Exceptions** - Business errors
```typescript
// src/domain/exceptions/AuthException.ts
export class AuthException extends Error {
  public readonly code: AuthErrorCode

  static invalidCredentials(): AuthException {
    return new AuthException('INVALID_CREDENTIALS', 'Email o contraseña incorrectos')
  }
}
```

### Layer Responsibilities

**Domain Layer (src/domain/):**
- 📐 Entities with business logic
- 💎 Value Objects (immutable, validated)
- 🚫 Domain Exceptions (business errors)
- 🎯 Business rules (pure functions)
- ❌ ZERO external dependencies (only TypeScript)
- ❌ NO framework knowledge (no React, no HTTP, no DB)

**Application Layer (src/application/):**
- 🎯 Use Cases (orchestrate business operations)
- 🔄 Validate inputs using Domain objects
- 🧩 Combine Domain entities and Infrastructure
- ✅ Uses Domain entities, value objects, exceptions
- ✅ Calls Infrastructure repositories
- ❌ NO UI knowledge (independent of React)

**Infrastructure Layer (src/infrastructure/):**
- 🌐 Repositories (data access)
- 📡 API clients (HTTP calls)
- 💾 LocalStorage/IndexedDB
- 🔌 External services
- ✅ Translates JSON → Domain entities
- ✅ Translates Domain entities → JSON
- ❌ NO UI knowledge

**Presentation Layer (src/features/, src/pages/):**
- 🎨 React components (UI)
- 🪝 Custom hooks (adapt Use Cases to React)
- 📊 Zustand stores (global state)
- ✅ Uses Use Cases from Application
- ✅ Uses Domain entities
- ✅ Uses React Query for async state
- ❌ NO direct API calls (uses Use Cases)

### Folder Structure

```
src/
├── domain/                         # DOMAIN LAYER
│   ├── entities/                   # Entities with business logic
│   │   ├── User.ts
│   │   ├── Albaran.ts
│   │   └── Cliente.ts
│   ├── value-objects/              # Immutable validated objects
│   │   ├── Email.ts
│   │   ├── Token.ts
│   │   └── Tarifa.ts
│   └── exceptions/                 # Business errors
│       ├── AuthException.ts
│       └── AlbaranException.ts
│
├── application/                    # APPLICATION LAYER
│   └── use-cases/                  # Business operations
│       ├── LoginUseCase.ts
│       ├── LogoutUseCase.ts
│       ├── CrearAlbaranUseCase.ts
│       └── ValidarAlbaranUseCase.ts
│
├── infrastructure/                 # INFRASTRUCTURE LAYER
│   ├── repositories/               # Data access
│   │   ├── AuthRepository.ts
│   │   ├── AlbaranRepository.ts
│   │   └── ClienteRepository.ts
│   └── api/                        # HTTP clients
│       └── apiClient.ts
│
├── features/                       # PRESENTATION LAYER
│   ├── auth/
│   │   ├── components/             # React UI
│   │   │   ├── LoginForm.tsx
│   │   │   └── __tests__/
│   │   ├── hooks/                  # React adapters
│   │   │   ├── useLogin.ts
│   │   │   └── __tests__/
│   │   └── stores/                 # Global state
│   │       ├── authStore.ts
│   │       └── __tests__/
│   ├── albaranes/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── stores/
│   └── clientes/
│       ├── components/
│       ├── hooks/
│       └── stores/
│
└── pages/                          # PRESENTATION LAYER
    ├── LoginPage.tsx
    ├── DashboardPage.tsx
    └── AlbaranesPage.tsx
```

### Import Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/application/*": ["./src/application/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/features/*": ["./src/features/*"]
    }
  }
}
```

**Usage:**
```typescript
// ✅ Clean imports with aliases
import { User } from '@/domain/entities/User'
import { Email } from '@/domain/value-objects/Email'
import { LoginUseCase } from '@/application/use-cases/LoginUseCase'
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository'
import { useLogin } from '@/features/auth/hooks/useLogin'

// ❌ Avoid relative imports
import { User } from '../../../domain/entities/User'
```

### Complete Example: Login Flow (Clean Architecture)

**1. Domain Layer - Value Object:**
```typescript
// src/domain/value-objects/Email.ts
/**
 * VALUE OBJECT: Email
 * Immutable, validated email address.
 * Location: Domain Layer
 * Dependencies: None (pure TypeScript)
 */
export class Email {
  private readonly value: string

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error(`Email inválido: ${email}`)
    }
    this.value = email.toLowerCase().trim()
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  getValue(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}
```

**2. Domain Layer - Entity:**
```typescript
// src/domain/entities/User.ts
/**
 * ENTITY: User
 * User with identity and business logic.
 * Location: Domain Layer
 * Dependencies: Email (Value Object)
 */
import { Email } from '../value-objects/Email'

export type UserRole = 'admin' | 'user' | 'guest'

export class User {
  private readonly _id: string
  private _email: Email
  private _name: string
  private _role: UserRole

  constructor(props: { id: string; email: Email; name: string; role: UserRole }) {
    this._id = props.id
    this._email = props.email
    this._name = props.name
    this._role = props.role
  }

  // Business logic
  esAdmin(): boolean {
    return this._role === 'admin'
  }

  puedeEliminarClientes(): boolean {
    return this._role === 'admin'
  }

  // Getters
  get id(): string { return this._id }
  get email(): Email { return this._email }
  get name(): string { return this._name }
  get role(): UserRole { return this._role }
}
```

**3. Domain Layer - Exception:**
```typescript
// src/domain/exceptions/AuthException.ts
/**
 * DOMAIN EXCEPTION: AuthException
 * Business-level authentication errors.
 * Location: Domain Layer
 * Dependencies: None
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'UNAUTHORIZED'

export class AuthException extends Error {
  public readonly code: AuthErrorCode

  constructor(code: AuthErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'AuthException'
  }

  static invalidCredentials(): AuthException {
    return new AuthException('INVALID_CREDENTIALS', 'Email o contraseña incorrectos')
  }

  static tokenExpired(): AuthException {
    return new AuthException('TOKEN_EXPIRED', 'El token ha expirado')
  }
}
```

**4. Infrastructure Layer - Repository:**
```typescript
// src/infrastructure/repositories/AuthRepository.ts
/**
 * REPOSITORY: AuthRepository
 * Handles HTTP calls and translates JSON ↔ Domain entities.
 * Location: Infrastructure Layer
 * Dependencies: Domain (User, Email, Token, AuthException)
 */
import { User } from '@/domain/entities/User'
import { Email } from '@/domain/value-objects/Email'
import { Token } from '@/domain/value-objects/Token'
import { AuthException } from '@/domain/exceptions/AuthException'

export class AuthRepository {
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  async login(email: Email, password: string): Promise<{ user: User; token: Token }> {
    const response = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.getValue(), // Extract value from Value Object
        password,
      }),
    })

    if (!response.ok) {
      throw AuthException.invalidCredentials()
    }

    const data = await response.json()

    // Translate JSON → Domain entities
    const user = new User({
      id: data.user.id,
      email: new Email(data.user.email),
      name: data.user.name,
      role: data.user.role || 'user',
    })

    const token = new Token(data.token)
    this.saveToken(token)

    return { user, token }
  }

  private saveToken(token: Token): void {
    localStorage.setItem('authToken', token.getValue())
  }
}
```

**5. Application Layer - Use Case:**
```typescript
// src/application/use-cases/LoginUseCase.ts
/**
 * USE CASE: LoginUseCase
 * Orchestrates login flow.
 * Location: Application Layer
 * Dependencies: Domain (Email, Token, User, AuthException), Infrastructure (AuthRepository)
 */
import { Email } from '@/domain/value-objects/Email'
import { Token } from '@/domain/value-objects/Token'
import { User } from '@/domain/entities/User'
import { AuthException } from '@/domain/exceptions/AuthException'
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginOutput {
  user: User
  token: Token
  success: boolean
}

export class LoginUseCase {
  private authRepository: AuthRepository

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  async execute(input: LoginInput): Promise<LoginOutput> {
    // Validate email using Domain Value Object
    let email: Email
    try {
      email = new Email(input.email)
    } catch (error) {
      throw new AuthException('INVALID_CREDENTIALS', 'Email no es válido')
    }

    // Validate password
    if (!input.password || input.password.length < 6) {
      throw new AuthException('INVALID_CREDENTIALS', 'Contraseña debe tener al menos 6 caracteres')
    }

    // Call Infrastructure
    const { user, token } = await this.authRepository.login(email, input.password)

    // Validate token
    if (token.isExpired()) throw AuthException.tokenExpired()

    return { user, token, success: true }
  }
}
```

**6. Presentation Layer - React Hook (Adapter):**
```typescript
// src/features/auth/hooks/useLogin.ts
/**
 * PRESENTATION HOOK: useLogin
 * Adapts LoginUseCase to React.
 * Location: Presentation Layer
 * Dependencies: Application (LoginUseCase), Infrastructure (AuthRepository), Domain (AuthException)
 */
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import { LoginUseCase, type LoginInput } from '@/application/use-cases/LoginUseCase'
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository'
import { AuthException } from '@/domain/exceptions/AuthException'

const authRepository = new AuthRepository()
const loginUseCase = new LoginUseCase(authRepository)

export function useLogin() {
  const { setAuth } = useAuthStore()

  const mutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      return await loginUseCase.execute(input)
    },

    onSuccess: (result) => {
      setAuth(result.user, result.token)
    },

    onError: (error) => {
      if (error instanceof AuthException) {
        console.error(`[Auth Error] ${error.code}: ${error.message}`)
      } else {
        console.error('[Technical Error]', error)
      }
    },
  })

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  }
}
```

**7. Presentation Layer - Zustand Store:**
```typescript
// src/features/auth/stores/authStore.ts
/**
 * PRESENTATION STORE: authStore
 * Global authentication state for React.
 * Location: Presentation Layer
 * Dependencies: Domain (User, Token)
 */
import { create } from 'zustand'
import { User } from '@/domain/entities/User'
import { Token } from '@/domain/value-objects/Token'

interface AuthStore {
  user: User | null
  token: Token | null
  isAuthenticated: boolean

  setAuth: (user: User, token: Token) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    set(() => ({ user, token, isAuthenticated: true }))
  },

  logout: () => {
    set(() => ({ user: null, token: null, isAuthenticated: false }))
  },

  isAdmin: () => {
    const { user } = get()
    return user?.esAdmin() ?? false
  },
}))
```

**8. Presentation Layer - React Component:**
```typescript
// src/features/auth/components/LoginForm.tsx
/**
 * PRESENTATION COMPONENT: LoginForm
 * Login UI form.
 * Location: Presentation Layer
 * Dependencies: useLogin hook
 */
import { useLogin } from '../hooks/useLogin'

export function LoginForm() {
  const { login, isLoading, isError, error } = useLogin()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
      {isError && <p>{error?.message}</p>}
    </form>
  )
}
```

### Rules for Clean Architecture

**ALWAYS:**
- ✅ Keep layers strictly separated
- ✅ Domain has ZERO dependencies (pure TypeScript)
- ✅ Use Cases orchestrate but don't know about React
- ✅ Infrastructure translates JSON ↔ Domain entities
- ✅ Presentation adapts Use Cases to React
- ✅ Use dependency injection (pass repositories to Use Cases)
- ✅ Use Domain exceptions for business errors

**NEVER:**
- ❌ Import from outer layers (no upward dependencies)
- ❌ Put business logic in components or hooks
- ❌ Put API calls in components or Use Cases
- ❌ Use plain objects in Domain (use classes with behavior)
- ❌ Mix layers in same file
- ❌ Let Domain know about HTTP, React, or databases

---

## Tech Stack
- React 19 + TypeScript
- Zustand for state
- React Query for server state
- Tailwind CSS
- Vitest + React Testing Library
- ESLint + Prettier (auto-applied)

## TDD Development Workflow

### Phase 1: Architecture & Planning
1. scope-rule-architect: Design structure - USE for new features
2. react-mentor: Architectural guidance - USE for complex decisions
3. git-workflow-manager: Commit - USE after each phase

### Phase 2: Test-Driven Development
4. tdd-test-first: Create tests - USE for each functionality
5. git-workflow-manager: Commit RED phase
6. react-test-implementer: Implement - USE after tests fail
7. git-workflow-manager: Commit GREEN phase

### Phase 3: Quality & Security
8. security-auditor: Audit - USE before main merge
9. git-workflow-manager: Commit fixes
10. accessibility-auditor: WCAG - USE after UI complete
11. git-workflow-manager: Commit improvements

## Git Strategy (NO Claude mentions)
- Architecture: "feat: add [feature] architecture"
- Tests: "test: add [feature] tests (RED)"
- Implementation: "feat: implement [feature] (GREEN)"
- Security: "fix: security improvements"
- A11Y: "feat: improve accessibility"

## LEARNING MODE: TypeScript First Project

> **Context:** This is the user's first TypeScript project. They are learning and want to **understand** every line of code, not just copy/paste.

### User Background & Preferred Analogies

**User Experience:**
- First TypeScript project (learning from scratch)
- Professional background: Construction and plumbing
- Prefers hands-on learning ("yo lo iré haciendo" - I'll do it myself)

**MANDATORY - Use Construction & Plumbing Analogies:**
- 🏗️ **Construction analogies**: blueprints, foundations, building materials, structural integrity, permits, inspections
- 🔧 **Plumbing analogies**: pipes, valves, water flow, connections, leaks, pressure testing, backflow prevention
- ✅ **Examples**:
  - Entities = Main structures (house, building)
  - Value Objects = Materials (cement mix, pipe size - can't change once set)
  - Use Cases = Construction phases (foundation, framing, plumbing)
  - Repositories = Material suppliers (deliver materials, take orders)
  - Types = Blueprints (specify exact measurements before building)
  - Validation = Building inspections (catch problems before going live)

**Teaching Style:**
- Always relate new concepts to construction/plumbing first
- Use "como cuando..." (like when...) to connect to his experience
- Show the "blueprint" (types) before building the "structure" (code)

### Educational Rules

**MANDATORY - Before Writing ANY Code:**
1. **Explain First, Code Second:**
   - ALWAYS explain the TypeScript/DDD concept before writing code
   - Break down what each concept does and why
   - Show simpler examples before complex ones
   - Use analogies to JavaScript when helpful

2. **Step-by-Step Code Explanation:**
   - Write code in small chunks (5-10 lines max)
   - Explain each chunk with inline comments
   - Show what the TypeScript compiler is checking
   - Explain what would break without the types

3. **Interactive Learning:**
   - Ask if the user understands before moving forward
   - Offer to explain concepts in more detail
   - Show JavaScript equivalent when applicable
   - Point out common mistakes to avoid

4. **Build Knowledge Progressively:**
   - Start with basic types (string, number, boolean)
   - Then classes and objects
   - Then Domain concepts (Entity, Value Object)
   - Then Use Cases and Repositories
   - Then advanced patterns only when needed

### DDD Concepts Explained

**Entity (Entidad):**
- Como una **casa con dirección única** - la dirección es el ID
- Tiene identidad permanente (el ID no cambia)
- Puede cambiar sus propiedades (pintarla, remodelarla)
- Contiene lógica de negocio (métodos que hacen cosas)

**Value Object (Objeto de Valor):**
- Como una **mezcla de cemento** - una vez mezclada, no se puede cambiar
- Sin identidad (dos mezclas iguales son lo mismo)
- Inmutable (si quieres diferente, creas uno nuevo)
- Se valida al crearse (no puedes crear mezcla inválida)

**Use Case (Caso de Uso):**
- Como una **fase de construcción** - "instalar la plomería"
- Orquesta varios pasos (abrir zanjas, colocar tubos, probar presión)
- No sabe de React ni HTTP (solo lógica de negocio)
- Recibe datos, valida, llama repositorios, retorna resultado

**Repository (Repositorio):**
- Como un **proveedor de materiales** - trae y lleva materiales
- Traduce entre JSON (camión) y Domain (materiales en obra)
- Hace llamadas HTTP, guarda en localStorage
- El resto del sistema no sabe de HTTP

### Code Presentation Format

**For EVERY piece of code, explain in construction terms:**

```typescript
// 📝 QUÉ: Value Object Email (mezcla de cemento - inmutable)
// 🎯 POR QUÉ: No queremos emails inválidos en nuestro sistema
// 🔍 CÓMO: Se valida al crearse, si es inválido, lanza error

export class Email {
  private readonly value: string  // readonly = no se puede cambiar (cemento seco)

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error(`Email inválido: ${email}`)
    }
    this.value = email.toLowerCase().trim()
  }

  // Método privado - solo Email puede usarlo (inspector interno)
  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Método público - cualquiera puede obtener el valor
  getValue(): string {
    return this.value
  }
}

// ✅ USO CORRECTO:
const email = new Email('user@example.com')  // Se valida automáticamente

// ❌ ESTO LANZA ERROR:
// const email = new Email('invalid')  // Error: Email inválido
```

### Questions to Ask User

**After explaining a concept:**
- "¿Tiene sentido hasta aquí?"
- "¿Quieres que explique [concepto] con más detalle?"
- "¿Ves por qué TypeScript atrapó ese error?"
- "¿Te sientes cómodo para seguir, o practicamos más esto?"

### Anti-Patterns to AVOID

❌ **NEVER do this:**
- Write complex code without explanation
- Use `any` type (defeats TypeScript purpose)
- Use advanced features without building up to them
- Skip explaining DDD concepts (Entity, Value Object, Use Case)
- Assume user knows Clean Architecture jargon

✅ **ALWAYS do this:**
- Explain before writing
- Use construction/plumbing analogies
- Build from simple to complex
- Show what errors are prevented
- Check for understanding

---

## RULES
- NEVER write code without concrete functionality
- NEVER implement without failing tests
- NEVER mention Claude in commits
- ALWAYS apply ESLint + Prettier
- **NEVER write TypeScript code without explaining it first**
- **ALWAYS use construction/plumbing analogies**
- **ALWAYS explain DDD concepts (Entity, Value Object, Use Case)**
- **ALWAYS check if user understands before continuing**
