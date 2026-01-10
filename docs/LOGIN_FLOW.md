# Flujo de Login - Clean Architecture

## Diagrama de Flujo

```mermaid
sequenceDiagram
    actor User
    participant UI as LoginForm<br/>(Presentation)
    participant Hook as useLogin<br/>(Presentation)
    participant UseCase as LoginUseCase<br/>(Application)
    participant Repo as AuthRepository<br/>(Infrastructure)
    participant API as Backend API<br/>(External)
    participant Store as authStore<br/>(Presentation)

    %% Usuario ingresa credenciales
    User->>UI: Escribe email/password
    User->>UI: Click en "Login"

    %% UI captura evento
    UI->>UI: Validar con Zod schema

    alt Validación falla
        UI->>User: Mostrar errores de validación
    else Validación OK
        UI->>Hook: login({ email, password })

        %% Hook ejecuta Use Case
        Hook->>UseCase: execute({ email, password })

        %% Use Case procesa
        UseCase->>UseCase: Crear Email(email)

        alt Email inválido
            UseCase-->>Hook: throw Error('Email inválido')
            Hook-->>UI: error
            UI->>User: Mostrar error
        else Email válido
            UseCase->>UseCase: Validar password

            alt Password muy corto
                UseCase-->>Hook: throw AuthException
                Hook-->>UI: error
                UI->>User: Mostrar error
            else Password válido
                %% Llamar al Repository
                UseCase->>Repo: login(email, password)

                %% Repository llama a la API
                Repo->>API: POST /api/auth/login

                alt Credenciales incorrectas
                    API-->>Repo: 401 Unauthorized
                    Repo-->>UseCase: throw AuthException.invalidCredentials()
                    UseCase-->>Hook: throw AuthException
                    Hook-->>UI: error
                    UI->>User: "Email o contraseña incorrectos"
                else Credenciales correctas
                    API-->>Repo: 200 OK { token, user }

                    %% Repository crea entidades
                    Repo->>Repo: user = new User(data.user)
                    Repo->>Repo: token = new Token(data.token)
                    Repo->>Repo: localStorage.setItem('auth_token', token)
                    Repo-->>UseCase: { user, token }

                    %% Use Case valida token
                    UseCase->>UseCase: token.isExpired()?

                    alt Token expirado
                        UseCase-->>Hook: throw AuthException.tokenExpired()
                        Hook-->>UI: error
                        UI->>User: "Sesión expirada"
                    else Token válido
                        UseCase->>UseCase: token.isValidFormat()?

                        alt Formato inválido
                            UseCase-->>Hook: throw AuthException.tokenInvalid()
                            Hook-->>UI: error
                            UI->>User: "Token inválido"
                        else Todo OK
                            UseCase-->>Hook: { user, token, success: true }

                            %% Hook guarda en store
                            Hook->>Store: setAuth(user, token)
                            Store->>Store: user = user
                            Store->>Store: token = token
                            Store->>Store: isAuthenticated = true

                            %% UI actualiza
                            Hook-->>UI: success
                            UI->>UI: navigate('/dashboard')
                            UI->>User: Redirigir a Dashboard
                        end
                    end
                end
            end
        end
    end
```

## Capas Involucradas

### 1. **Presentation Layer** (UI)
- `LoginForm.tsx` - Captura input del usuario
- `useLogin.ts` - Adaptador entre React y Use Cases
- `authStore.ts` - Estado global de React

### 2. **Application Layer** (Casos de Uso)
- `LoginUseCase.ts` - Orquesta el flujo completo

### 3. **Domain Layer** (Entidades)
- `User.ts` - Entidad con lógica de negocio
- `Email.ts` - Value Object con validación
- `Token.ts` - Value Object con lógica de JWT
- `AuthException.ts` - Errores de negocio

### 4. **Infrastructure Layer** (Acceso Externo)
- `AuthRepository.ts` - Comunicación con la API

## Flujo Simplificado

```
User Input (email/password)
    ↓
LoginForm (validation)
    ↓
useLogin hook
    ↓
LoginUseCase.execute()
    ├─ Validate email (Domain)
    ├─ Validate password (Domain)
    └─ Call AuthRepository
        ↓
    AuthRepository.login()
        ├─ HTTP POST to API
        ├─ Parse JSON response
        ├─ Create User entity
        ├─ Create Token entity
        └─ Save to localStorage
        ↓
    LoginUseCase validates
        ├─ token.isExpired()
        └─ token.isValidFormat()
        ↓
    Return { user, token, success }
    ↓
useLogin hook
    └─ setAuth(user, token)
    ↓
authStore updated
    ↓
UI re-renders
    └─ Navigate to /dashboard
```

## Ventajas de este Flujo

1. **Separación de responsabilidades**
   - UI solo renderiza
   - Use Case tiene la lógica
   - Repository maneja HTTP

2. **Testeable en cada capa**
   - Domain: Sin dependencias
   - Application: Mock del Repository
   - Infrastructure: Mock de fetch
   - Presentation: Mock del Use Case

3. **Fácil de modificar**
   - Cambiar API → Solo AuthRepository
   - Cambiar validación → Solo Domain
   - Cambiar UI → Solo LoginForm
