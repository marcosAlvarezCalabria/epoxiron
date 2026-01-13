# Plan de Implementación Actualizado - Epoxiron MVP

> 📅 **Actualizado:** 2026-01-12
> 🎯 **Objetivo:** Sistema completo de gestión de delivery notes para taller de pintura
> 🌐 **Naming Convention:** All code identifiers in English, UI labels in Spanish (via i18n)

---

## ✅ Estado Actual - Fases 1, 2 y 3 COMPLETADAS

### Lo que ya funciona:

#### Backend (API)
- ✅ **Backend completo con Express + TypeScript**
  - Servidor corriendo en `http://localhost:3000`
  - JWT + bcryptjs para autenticación
  - CORS configurado
  - Estructura de carpetas: `api/src/{controllers, routes, types, storage, server.ts}`

- ✅ **Autenticación funcionando end-to-end**
  - Login con email/password
  - Generación de token JWT
  - Validación con bcrypt
  - Usuario hardcodeado: `admin@epoxiron.com` / `123456`

- ✅ **Customers API completada**
  - Controller: `api/src/controllers/customerController.ts`
  - Storage: `api/src/storage/customersStorage.ts`
  - Routes: `/api/customers` (GET, POST, PUT, DELETE)
  - Tests: `api/src/controllers/__tests__/customerController.test.ts`

- ✅ **Rates API completada**
  - Controller: `api/src/controllers/rateController.ts` (443 líneas de tests)
  - Storage: `api/src/storage/ratesStorage.ts` (344 líneas de tests)
  - Routes: `/api/rates` (GET, POST, PUT, DELETE)
  - Endpoint especial: `GET /api/rates/customer/:customerId`
  - Tests: `api/src/controllers/__tests__/rateController.test.ts`

#### Frontend (Web)
- ✅ **Frontend React 19 + TypeScript**
  - Vite como bundler
  - React Router con rutas protegidas
  - React Query para estado del servidor
  - Zustand para estado global
  - Zod + React Hook Form para validación
  - Tailwind CSS

- ✅ **Páginas implementadas:**
  - `LoginPage` → Formulario de login completo
  - `DashboardPage` → Vista después de login
  - `CustomersPage` → Gestión completa de clientes
  - `RatesPage` → Gestión completa de tarifas
  - `ProtectedRoute` → HOC para proteger rutas

- ✅ **Features completadas:**
  - `web/src/features/auth/` → Sistema de autenticación completo
  - `web/src/features/customers/` → CRUD de clientes
    - `api/customersApi.ts`
    - `hooks/useCustomers.ts`
    - `components/CustomerForm.tsx`
    - `components/CustomerList.tsx`
    - `types/Customer.ts`
  - `web/src/features/rates/` → CRUD de tarifas
    - `api/ratesApi.ts`
    - `hooks/useRates.ts`
    - `components/RateForm.tsx`
    - `components/RateList.tsx`
    - `types/Rate.ts`

#### Domain Layer (TDD) - 🎯 COMPLETADO
- ✅ **Entidades con tests comprehensivos:**
  - `User` → 34 tests, 100% cobertura
  - `Customer` → 13 tests, 100% cobertura
  - `Item` → 43 tests, 100% cobertura
  - `DeliveryNote` → 43 tests, 100% cobertura (aggregate root)

- ✅ **Value Objects:**
  - `Email` → 19 tests, validación completa
  - `Price` → Validación de euros, 2 decimales
  - `RACColor` → Colores RAC y especiales
  - `Measurements` → Metros lineales/cuadrados, grosor
  - `Token` → JWT validation

- ✅ **Domain Exceptions:**
  - `AuthException` → Errores de autenticación tipados
  - `DeliveryNoteException` → Errores de negocio de delivery notes

**Total tests pasando:** 159 ✅

---

## 🚀 SIGUIENTE: FASE 4 - Delivery Notes (Albaranes)

### ¿Por qué Delivery Notes ahora?
- Ya tenemos Customers y Rates completados
- El Domain Layer está listo (entities + value objects)
- Es la funcionalidad principal del sistema
- Conecta customers con rates

---

### Backend - Delivery Notes API

#### Tipos (Domain Layer)
**Archivo:** `api/src/types/deliveryNote.ts`

```typescript
export interface DeliveryNote {
  id: string
  customerId: string
  customerName: string  // Para mostrar en la UI
  date: Date
  status: 'draft' | 'pending' | 'reviewed'
  items: DeliveryNoteItem[]
  totalAmount: number  // Calculado automáticamente
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface DeliveryNoteItem {
  id: string
  description: string
  color: string  // RAC color code
  measurements: {
    linearMeters?: number
    squareMeters?: number
    thickness?: number
  }
  quantity: number
  unitPrice: number  // Del rate del customer
  totalPrice: number  // quantity * unitPrice
}

export interface CreateDeliveryNoteRequest {
  customerId: string
  date?: Date  // Default: hoy
  items: Omit<DeliveryNoteItem, 'id' | 'unitPrice' | 'totalPrice'>[]
  notes?: string
}

export interface UpdateDeliveryNoteRequest {
  customerId?: string
  date?: Date
  status?: 'draft' | 'pending' | 'reviewed'
  items?: DeliveryNoteItem[]
  notes?: string
}
```

#### Storage (temporal)
**Archivo:** `api/src/storage/deliveryNotesStorage.ts`

```typescript
import type { DeliveryNote } from '../types/deliveryNote'

let deliveryNotes: DeliveryNote[] = []

export function findAll(): DeliveryNote[] {
  return deliveryNotes.sort((a, b) =>
    b.date.getTime() - a.date.getTime()
  )
}

export function findById(id: string): DeliveryNote | undefined {
  return deliveryNotes.find(dn => dn.id === id)
}

export function findByCustomerId(customerId: string): DeliveryNote[] {
  return deliveryNotes
    .filter(dn => dn.customerId === customerId)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function findByStatus(status: DeliveryNote['status']): DeliveryNote[] {
  return deliveryNotes
    .filter(dn => dn.status === status)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function create(deliveryNote: DeliveryNote): DeliveryNote {
  deliveryNotes.push(deliveryNote)
  return deliveryNote
}

export function update(id: string, data: Partial<DeliveryNote>): DeliveryNote | undefined {
  const index = deliveryNotes.findIndex(dn => dn.id === id)
  if (index === -1) return undefined

  deliveryNotes[index] = {
    ...deliveryNotes[index],
    ...data,
    updatedAt: new Date()
  }
  return deliveryNotes[index]
}

export function remove(id: string): boolean {
  const index = deliveryNotes.findIndex(dn => dn.id === id)
  if (index === -1) return false

  deliveryNotes.splice(index, 1)
  return true
}
```

#### Controller
**Archivo:** `api/src/controllers/deliveryNoteController.ts`

```typescript
import { Request, Response } from 'express'
import { nanoid } from 'nanoid'
import * as deliveryNotesStorage from '../storage/deliveryNotesStorage'
import * as customersStorage from '../storage/customersStorage'
import * as ratesStorage from '../storage/ratesStorage'
import type { CreateDeliveryNoteRequest, DeliveryNote, DeliveryNoteItem } from '../types/deliveryNote'

// GET /api/delivery-notes - Listar todos
export async function listDeliveryNotes(req: Request, res: Response) {
  try {
    const { customerId, status } = req.query

    let notes: DeliveryNote[]

    if (customerId) {
      notes = deliveryNotesStorage.findByCustomerId(customerId as string)
    } else if (status) {
      notes = deliveryNotesStorage.findByStatus(status as DeliveryNote['status'])
    } else {
      notes = deliveryNotesStorage.findAll()
    }

    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching delivery notes' })
  }
}

// GET /api/delivery-notes/:id - Ver uno
export async function getDeliveryNote(req: Request, res: Response) {
  try {
    const { id } = req.params
    const note = deliveryNotesStorage.findById(id)

    if (!note) {
      return res.status(404).json({ error: 'Delivery note not found' })
    }

    res.json(note)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching delivery note' })
  }
}

// POST /api/delivery-notes - Crear nuevo
export async function createDeliveryNote(req: Request, res: Response) {
  try {
    const data: CreateDeliveryNoteRequest = req.body

    // Validar customer existe
    const customer = customersStorage.findById(data.customerId)
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    // Obtener rate del customer
    const rate = customer.rateId
      ? ratesStorage.findById(customer.rateId)
      : null

    // Calcular precios de items usando rate
    const itemsWithPrices: DeliveryNoteItem[] = data.items.map(item => {
      let unitPrice = 0

      if (rate) {
        // Calcular precio según measurements
        if (item.measurements.linearMeters) {
          unitPrice = rate.ratePerLinearMeter * item.measurements.linearMeters
        } else if (item.measurements.squareMeters) {
          unitPrice = rate.ratePerSquareMeter * item.measurements.squareMeters
        }

        // Aplicar rate mínimo si es menor
        if (unitPrice < rate.minimumRate) {
          unitPrice = rate.minimumRate
        }
      }

      return {
        ...item,
        id: nanoid(),
        unitPrice,
        totalPrice: unitPrice * item.quantity
      }
    })

    // Calcular total
    const totalAmount = itemsWithPrices.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    )

    const newNote: DeliveryNote = {
      id: nanoid(),
      customerId: data.customerId,
      customerName: customer.name,
      date: data.date || new Date(),
      status: 'draft',
      items: itemsWithPrices,
      totalAmount,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const created = deliveryNotesStorage.create(newNote)
    res.status(201).json(created)
  } catch (error) {
    res.status(500).json({ error: 'Error creating delivery note' })
  }
}

// PUT /api/delivery-notes/:id - Actualizar
export async function updateDeliveryNote(req: Request, res: Response) {
  try {
    const { id } = req.params
    const data = req.body

    const note = deliveryNotesStorage.findById(id)
    if (!note) {
      return res.status(404).json({ error: 'Delivery note not found' })
    }

    const updated = deliveryNotesStorage.update(id, data)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error updating delivery note' })
  }
}

// DELETE /api/delivery-notes/:id - Eliminar
export async function deleteDeliveryNote(req: Request, res: Response) {
  try {
    const { id } = req.params

    const note = deliveryNotesStorage.findById(id)
    if (!note) {
      return res.status(404).json({ error: 'Delivery note not found' })
    }

    // Solo permitir eliminar drafts
    if (note.status !== 'draft') {
      return res.status(400).json({
        error: 'Can only delete draft delivery notes'
      })
    }

    const deleted = deliveryNotesStorage.remove(id)
    if (!deleted) {
      return res.status(500).json({ error: 'Error deleting delivery note' })
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error deleting delivery note' })
  }
}

// PATCH /api/delivery-notes/:id/status - Cambiar estado
export async function updateDeliveryNoteStatus(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['draft', 'pending', 'reviewed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const updated = deliveryNotesStorage.update(id, { status })
    if (!updated) {
      return res.status(404).json({ error: 'Delivery note not found' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error updating status' })
  }
}
```

#### Routes
**Archivo:** `api/src/routes/deliveryNoteRoutes.ts`

```typescript
import { Router } from 'express'
import {
  listDeliveryNotes,
  getDeliveryNote,
  createDeliveryNote,
  updateDeliveryNote,
  deleteDeliveryNote,
  updateDeliveryNoteStatus
} from '../controllers/deliveryNoteController'

const router = Router()

router.get('/', listDeliveryNotes)
router.get('/:id', getDeliveryNote)
router.post('/', createDeliveryNote)
router.put('/:id', updateDeliveryNote)
router.delete('/:id', deleteDeliveryNote)
router.patch('/:id/status', updateDeliveryNoteStatus)

export default router
```

#### Actualizar server.ts
```typescript
import deliveryNoteRoutes from './routes/deliveryNoteRoutes'

// Agregar:
app.use('/api/delivery-notes', deliveryNoteRoutes)
```

---

### Frontend - Delivery Notes Feature

#### Estructura de carpetas
```
web/src/features/delivery-notes/
├── types/
│   └── DeliveryNote.ts
├── api/
│   └── deliveryNotesApi.ts
├── hooks/
│   ├── useDeliveryNotes.ts
│   └── useDeliveryNoteForm.ts
├── components/
│   ├── DeliveryNoteForm.tsx
│   ├── DeliveryNoteList.tsx
│   ├── DeliveryNoteCard.tsx
│   ├── DeliveryNoteItemForm.tsx
│   └── StatusBadge.tsx
└── schemas/
    └── deliveryNoteSchema.ts
```

#### Types
**Archivo:** `web/src/features/delivery-notes/types/DeliveryNote.ts`

```typescript
export interface DeliveryNote {
  id: string
  customerId: string
  customerName: string
  date: string
  status: 'draft' | 'pending' | 'reviewed'
  items: DeliveryNoteItem[]
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DeliveryNoteItem {
  id: string
  description: string
  color: string
  measurements: {
    linearMeters?: number
    squareMeters?: number
    thickness?: number
  }
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface DeliveryNoteFormData {
  customerId: string
  date: string
  items: Omit<DeliveryNoteItem, 'id' | 'unitPrice' | 'totalPrice'>[]
  notes?: string
}
```

#### Schema
**Archivo:** `web/src/features/delivery-notes/schemas/deliveryNoteSchema.ts`

```typescript
import { z } from 'zod'

const deliveryNoteItemSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  color: z.string().min(1, 'Color is required'),
  measurements: z.object({
    linearMeters: z.number().positive().optional(),
    squareMeters: z.number().positive().optional(),
    thickness: z.number().positive().optional()
  }).refine(
    (data) => data.linearMeters || data.squareMeters,
    'Either linear or square meters must be provided'
  ),
  quantity: z.number().int().positive('Quantity must be positive')
})

export const deliveryNoteSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  date: z.string(),
  items: z.array(deliveryNoteItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional()
})

export type DeliveryNoteFormData = z.infer<typeof deliveryNoteSchema>
```

#### API Client
**Archivo:** `web/src/features/delivery-notes/api/deliveryNotesApi.ts`

```typescript
import type { DeliveryNote, DeliveryNoteFormData } from '../types/DeliveryNote'

const API_URL = 'http://localhost:3000/api/delivery-notes'

export async function fetchDeliveryNotes(
  params?: { customerId?: string; status?: string }
): Promise<DeliveryNote[]> {
  const queryParams = new URLSearchParams(params).toString()
  const url = queryParams ? `${API_URL}?${queryParams}` : API_URL

  const response = await fetch(url)
  if (!response.ok) throw new Error('Error fetching delivery notes')
  return response.json()
}

export async function fetchDeliveryNote(id: string): Promise<DeliveryNote> {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) throw new Error('Delivery note not found')
  return response.json()
}

export async function createDeliveryNote(
  data: DeliveryNoteFormData
): Promise<DeliveryNote> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error creating delivery note')
  return response.json()
}

export async function updateDeliveryNote(
  id: string,
  data: Partial<DeliveryNoteFormData>
): Promise<DeliveryNote> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error updating delivery note')
  return response.json()
}

export async function updateDeliveryNoteStatus(
  id: string,
  status: 'draft' | 'pending' | 'reviewed'
): Promise<DeliveryNote> {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!response.ok) throw new Error('Error updating status')
  return response.json()
}

export async function deleteDeliveryNote(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Error deleting delivery note')
}
```

#### Hooks
**Archivo:** `web/src/features/delivery-notes/hooks/useDeliveryNotes.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchDeliveryNotes,
  fetchDeliveryNote,
  createDeliveryNote,
  updateDeliveryNote,
  updateDeliveryNoteStatus,
  deleteDeliveryNote
} from '../api/deliveryNotesApi'
import type { DeliveryNoteFormData } from '../types/DeliveryNote'

export function useDeliveryNotes(params?: { customerId?: string; status?: string }) {
  return useQuery({
    queryKey: ['delivery-notes', params],
    queryFn: () => fetchDeliveryNotes(params)
  })
}

export function useDeliveryNote(id: string) {
  return useQuery({
    queryKey: ['delivery-notes', id],
    queryFn: () => fetchDeliveryNote(id),
    enabled: !!id
  })
}

export function useCreateDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    }
  })
}

export function useUpdateDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliveryNoteFormData> }) =>
      updateDeliveryNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    }
  })
}

export function useUpdateDeliveryNoteStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'pending' | 'reviewed' }) =>
      updateDeliveryNoteStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    }
  })
}

export function useDeleteDeliveryNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] })
    }
  })
}
```

#### Página
**Archivo:** `web/src/pages/DeliveryNotesPage.tsx`

```typescript
import { useState } from 'react'
import { DeliveryNoteForm } from '@/features/delivery-notes/components/DeliveryNoteForm'
import { DeliveryNoteList } from '@/features/delivery-notes/components/DeliveryNoteList'
import { useCreateDeliveryNote } from '@/features/delivery-notes/hooks/useDeliveryNotes'
import type { DeliveryNoteFormData } from '@/features/delivery-notes/types/DeliveryNote'

export function DeliveryNotesPage() {
  const [showForm, setShowForm] = useState(false)
  const { mutate: create, isPending } = useCreateDeliveryNote()

  const handleSubmit = (data: DeliveryNoteFormData) => {
    create(data, {
      onSuccess: () => setShowForm(false)
    })
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Delivery Notes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          New Delivery Note
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <DeliveryNoteForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={isPending}
          />
        </div>
      )}

      <DeliveryNoteList />
    </div>
  )
}
```

---

## 📝 Checklist - Implementación de Delivery Notes

### Backend
- [ ] Crear `api/src/types/deliveryNote.ts`
- [ ] Crear `api/src/storage/deliveryNotesStorage.ts`
- [ ] Crear `api/src/controllers/deliveryNoteController.ts`
- [ ] Crear `api/src/routes/deliveryNoteRoutes.ts`
- [ ] Conectar rutas en `server.ts`
- [ ] Escribir tests TDD
- [ ] Probar con Postman/test.http

### Frontend
- [ ] Crear estructura `web/src/features/delivery-notes/`
- [ ] Crear `types/DeliveryNote.ts`
- [ ] Crear `schemas/deliveryNoteSchema.ts`
- [ ] Crear `api/deliveryNotesApi.ts`
- [ ] Crear `hooks/useDeliveryNotes.ts`
- [ ] Crear `components/DeliveryNoteForm.tsx`
- [ ] Crear `components/DeliveryNoteList.tsx`
- [ ] Crear `components/DeliveryNoteCard.tsx`
- [ ] Crear `components/StatusBadge.tsx`
- [ ] Crear `pages/DeliveryNotesPage.tsx`
- [ ] Agregar ruta en `App.tsx`
- [ ] Agregar link en Dashboard

### Testing
- [ ] Tests backend: CRUD completo
- [ ] Tests cálculo de precios con rates
- [ ] Tests validación de estados
- [ ] Tests frontend: Formularios y validaciones

---

## 🎯 Resumen del Plan

| Fase | Feature | Estado | Notas |
|------|---------|--------|-------|
| 1 | Authentication | ✅ Completado | JWT, bcrypt, 159 tests |
| 2 | Customers | ✅ Completado | Backend + Frontend + Tests |
| 3 | Rates | ✅ Completado | Backend + Frontend + Tests |
| 4 | Delivery Notes | ⏳ **SIGUIENTE** | Domain layer listo |
| 5 | Daily Summary | 📋 Pendiente | Resumen del día |
| 6 | UX/Layout | 📋 Pendiente | Mejoras de interfaz |

**Progreso:** 3/6 fases completadas (50%)

---

## ✅ ESTAMOS AQUÍ - Comenzar Fase 4

**Lo siguiente es:**
1. Crear backend de Delivery Notes (tipos, storage, controller, routes)
2. Escribir tests con TDD
3. Crear frontend de Delivery Notes
4. Integrar con Customers y Rates existentes
5. Probar flujo completo: crear customer → asignar rate → crear delivery note

**Ventajas:**
- Domain layer ya está completo y testeado
- Customers y Rates funcionando
- Infraestructura lista (React Query, routing, etc.)

¿Empezamos con el backend de Delivery Notes?
