# Plan de Implementación Actualizado - Epoxiron MVP

> 📅 **Actualizado:** 2025-12-01
> 🎯 **Objetivo:** Sistema completo de gestión de albaranes para taller de pintura

---

## ✅ Estado Actual - Fase 1 COMPLETADA

### Lo que ya funciona:
- ✅ **Backend completo con Express + TypeScript**
  - Servidor corriendo en `http://localhost:3000`
  - JWT + bcryptjs para autenticación
  - CORS configurado
  - Estructura de carpetas: `api/src/{controllers, routes, types, server.ts}`

- ✅ **Autenticación funcionando end-to-end**
  - Login con email/password
  - Generación de token JWT
  - Validación con bcrypt
  - Usuario hardcodeado: `admin@epoxiron.com` / `123456`

- ✅ **Frontend React 19 + TypeScript**
  - Vite como bundler
  - React Router con rutas protegidas
  - React Query para estado del servidor
  - Zustand para estado global
  - Zod + React Hook Form para validación
  - Tailwind CSS

- ✅ **Páginas implementadas:**
  - `LoginPage` → Formulario de login
  - `DashboardPage` → Vista después de login
  - `ProtectedRoute` → HOC para proteger rutas

- ✅ **Features completadas:**
  - `web/src/features/auth/` → Sistema de autenticación completo
  - Clean Architecture aplicada correctamente

---

## 🚀 Siguiente: FASE 2 - Gestión de Clientes

### ¿Por qué Clientes primero?
- Son la base de todo el sistema
- Más simples que albaranes (buen punto de partida)
- Necesarios antes de crear albaranes o tarifas

### Backend - API de Clientes

#### Tipos (Domain Layer)
**Archivo:** `api/src/types/cliente.ts`

```typescript
export interface Cliente {
  id: string
  nombre: string
  tarifaId?: string  // Opcional, se asigna después
  createdAt: Date
  updatedAt: Date
}

export interface CreateClienteRequest {
  nombre: string
}

export interface UpdateClienteRequest {
  nombre: string
  tarifaId?: string
}
```

#### Controller
**Archivo:** `api/src/controllers/clienteController.ts`

```typescript
// GET /api/clientes - Listar todos
export async function listarClientes(req, res)

// GET /api/clientes/:id - Ver uno
export async function verCliente(req, res)

// POST /api/clientes - Crear nuevo
export async function crearCliente(req, res)

// PUT /api/clientes/:id - Editar
export async function editarCliente(req, res)

// DELETE /api/clientes/:id - Eliminar (validar sin albaranes)
export async function eliminarCliente(req, res)
```

#### Routes
**Archivo:** `api/src/routes/clienteRoutes.ts`

```typescript
import { Router } from 'express'
import {
  listarClientes,
  verCliente,
  crearCliente,
  editarCliente,
  eliminarCliente
} from '../controllers/clienteController'

const router = Router()

router.get('/', listarClientes)
router.get('/:id', verCliente)
router.post('/', crearCliente)
router.put('/:id', editarCliente)
router.delete('/:id', eliminarCliente)

export default router
```

#### Storage (temporal)
**Archivo:** `api/src/storage/clientesStorage.ts`

```typescript
// Por ahora: array en memoria
// Más adelante: migrar a base de datos

let clientes: Cliente[] = []

export const clientesStorage = {
  findAll: () => clientes,
  findById: (id: string) => clientes.find(c => c.id === id),
  create: (cliente: Cliente) => { clientes.push(cliente); return cliente },
  update: (id: string, data: Partial<Cliente>) => { /* ... */ },
  delete: (id: string) => { clientes = clientes.filter(c => c.id !== id) }
}
```

---

### Frontend - Feature de Clientes

#### Estructura de carpetas
```
web/src/features/clientes/
├── types/
│   └── Cliente.ts
├── api/
│   └── clientesApi.ts
├── hooks/
│   ├── useClientes.ts
│   └── useClienteForm.ts
├── stores/
│   └── clientesStore.ts  (opcional)
├── components/
│   ├── ClienteForm.tsx
│   ├── ClienteList.tsx
│   └── ClienteCard.tsx
└── schemas/
    └── clienteSchema.ts
```

#### Types (Domain Layer)
**Archivo:** `web/src/features/clientes/types/Cliente.ts`

```typescript
export interface Cliente {
  id: string
  nombre: string
  tarifaId?: string
  createdAt: string
  updatedAt: string
}

export interface ClienteFormData {
  nombre: string
}
```

#### Schema (Domain Layer)
**Archivo:** `web/src/features/clientes/schemas/clienteSchema.ts`

```typescript
import { z } from 'zod'

export const clienteSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
})

export type ClienteFormData = z.infer<typeof clienteSchema>
```

#### API (Infrastructure Layer)
**Archivo:** `web/src/features/clientes/api/clientesApi.ts`

```typescript
import type { Cliente, ClienteFormData } from '../types/Cliente'

const API_URL = 'http://localhost:3000/api/clientes'

export async function fetchClientes(): Promise<Cliente[]> {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error al cargar clientes')
  return response.json()
}

export async function fetchCliente(id: string): Promise<Cliente> {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) throw new Error('Cliente no encontrado')
  return response.json()
}

export async function createCliente(data: ClienteFormData): Promise<Cliente> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error al crear cliente')
  return response.json()
}

export async function updateCliente(id: string, data: ClienteFormData): Promise<Cliente> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error al actualizar cliente')
  return response.json()
}

export async function deleteCliente(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Error al eliminar cliente')
}
```

#### Hooks (Application Layer)
**Archivo:** `web/src/features/clientes/hooks/useClientes.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchClientes, createCliente, updateCliente, deleteCliente } from '../api/clientesApi'
import type { ClienteFormData } from '../types/Cliente'

export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes
  })
}

export function useCreateCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    }
  })
}

export function useUpdateCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClienteFormData }) =>
      updateCliente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    }
  })
}

export function useDeleteCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    }
  })
}
```

#### Components (UI Layer)
**Archivo:** `web/src/features/clientes/components/ClienteForm.tsx`

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clienteSchema, type ClienteFormData } from '../schemas/clienteSchema'

interface ClienteFormProps {
  initialData?: ClienteFormData
  onSubmit: (data: ClienteFormData) => void
  onCancel: () => void
  isLoading: boolean
}

export function ClienteForm({ initialData, onSubmit, onCancel, isLoading }: ClienteFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: initialData
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Campo Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium">
          Nombre del Cliente
        </label>
        <input
          id="nombre"
          type="text"
          {...register('nombre')}
          disabled={isLoading}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.nombre && (
          <p className="text-sm text-red-600">{errors.nombre.message}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="bg-gray-300 px-4 py-2 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
```

**Archivo:** `web/src/features/clientes/components/ClienteList.tsx`

```typescript
import { useClientes, useDeleteCliente } from '../hooks/useClientes'

export function ClienteList() {
  const { data: clientes, isLoading } = useClientes()
  const { mutate: eliminar } = useDeleteCliente()

  if (isLoading) return <div>Cargando...</div>

  return (
    <div className="space-y-4">
      {clientes?.map(cliente => (
        <div key={cliente.id} className="border p-4 rounded-lg">
          <h3 className="font-bold">{cliente.nombre}</h3>
          <button
            onClick={() => eliminar(cliente.id)}
            className="text-red-600"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  )
}
```

#### Página
**Archivo:** `web/src/pages/ClientesPage.tsx`

```typescript
import { useState } from 'react'
import { ClienteForm } from '@/features/clientes/components/ClienteForm'
import { ClienteList } from '@/features/clientes/components/ClienteList'
import { useCreateCliente } from '@/features/clientes/hooks/useClientes'

export function ClientesPage() {
  const [showForm, setShowForm] = useState(false)
  const { mutate: crear, isPending } = useCreateCliente()

  const handleSubmit = (data: ClienteFormData) => {
    crear(data, {
      onSuccess: () => setShowForm(false)
    })
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Nuevo Cliente
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ClienteForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={isPending}
          />
        </div>
      )}

      <ClienteList />
    </div>
  )
}
```

#### Actualizar App.tsx
```typescript
import { ClientesPage } from './pages/ClientesPage'

// Agregar ruta:
<Route path="/clientes" element={
  <ProtectedRoute>
    <ClientesPage />
  </ProtectedRoute>
} />
```

---

## 📝 Checklist - Implementación de Clientes

### Backend
- [ ] Crear `api/src/types/cliente.ts`
- [ ] Crear `api/src/storage/clientesStorage.ts`
- [ ] Crear `api/src/controllers/clienteController.ts`
- [ ] Crear `api/src/routes/clienteRoutes.ts`
- [ ] Conectar rutas en `server.ts`: `app.use('/api/clientes', clienteRoutes)`
- [ ] Probar con `api/test.http`

### Frontend
- [ ] Crear estructura `web/src/features/clientes/`
- [ ] Crear `types/Cliente.ts`
- [ ] Crear `schemas/clienteSchema.ts`
- [ ] Crear `api/clientesApi.ts`
- [ ] Crear `hooks/useClientes.ts`
- [ ] Crear `components/ClienteForm.tsx`
- [ ] Crear `components/ClienteList.tsx`
- [ ] Crear `pages/ClientesPage.tsx`
- [ ] Agregar ruta en `App.tsx`
- [ ] Agregar link en Dashboard

### Testing
- [ ] Test backend: CRUD completo
- [ ] Test frontend: Formulario + validaciones
- [ ] Test E2E: Crear, editar, eliminar cliente

### Git
- [ ] Commit backend: "feat: add clientes API"
- [ ] Commit frontend: "feat: add clientes management UI"

---

## 🔄 Después de Clientes: FASE 3 - Tarifas

Misma estructura que Clientes pero con:
- `tarifaMl`, `tarifaM2`, `tarifaMinima`
- Relación con `clienteId`
- Lista de `piezasEspeciales[]`

---

## 🔄 FASE 4 - Albaranes (Lo más complejo)

Después de tener Clientes y Tarifas, implementar:
- Albaranes con relación a Cliente
- Piezas dentro de Albarán
- Cálculo automático de precios según tarifas
- Estados: Borrador → Pendiente → Revisado

---

## 🎯 Resumen del Plan

| Fase | Feature | Estado | Estimado |
|------|---------|--------|----------|
| 1 | Autenticación | ✅ Completado | - |
| 2 | Clientes | ⏳ Siguiente | 1-2 días |
| 3 | Tarifas | 📋 Pendiente | 2-3 días |
| 4 | Albaranes | 📋 Pendiente | 5-7 días |
| 5 | Resumen Día | 📋 Pendiente | 1-2 días |
| 6 | UX/Layout | 📋 Pendiente | 2-3 días |

**Total MVP:** ~3-4 semanas

---

## ✅ Para empezar AHORA:

1. Crear tipos de Cliente (backend)
2. Crear controller de Clientes
3. Probar con test.http
4. Crear feature de clientes (frontend)
5. Probar crear/listar/eliminar cliente
6. Commit

¿Empezamos con Clientes?
