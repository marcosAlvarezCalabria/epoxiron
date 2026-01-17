# 📘 Documentación Técnica - Epoxiron MVP
> **Fecha:** 17 de Enero, 2026
> **Versión:** 1.0.0 (MVP Funcional)
> **Estado:** En Desarrollo / Pre-Producción

---

## 1. Visión General
**Epoxiron** es una aplicación web para la gestión de un taller de pintura industrial. Permite administrar clientes, definir sus tarifas personalizadas y generar albaranes (delivery notes) con cálculo automático de precios.

El sistema está diseñado para reemplazar procesos manuales, asegurando consistencia en los precios y agilizando la facturación.

---

## 2. Stack Tecnológico

### 🎨 Frontend (Web)
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS (Diseño moderno "Dark Mode")
- **Estado Server:** TanStack Query (React Query)
- **Estado Global:** Zustand (Auth storage)
- **Routing:** React Router DOM
- **Validación:** Zod + React Hook Form
- **HTTP Client:** Fetch API wrapper personalizado (`apiClient.ts`) con manejo automático de JWT.

### ⚙️ Backend (API)
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Seguridad:** JWT (JSON Web Tokens) + bcryptjs
- **Base de Datos:** In-Memory Storage (Temporal para MVP / Dev)
- **Arquitectura:** Capas (Routes -> Controllers -> Storage/Infra)

---

## 3. Arquitectura del Sistema

### 🏗️ Frontend: Clean Architecture
El frontend sigue una arquitectura limpia modular para facilitar la escalabilidad y el mantenimiento.

`src/features/[feature-name]/`
- **Domain/Types:** Definiciones de entidades (ej: `Customer.ts`).
- **Infrastructure (API):** Comunicación con el backend (ej: `customersApi.ts`).
- **Application (Hooks):** Casos de uso y gestión de estado (ej: `useCustomers.ts`).
- **Presentation (Components):** UI y lógica visual (ej: `CustomerForm.tsx`).

### 🧱 Backend: Layered Architecture
- **Routes Layer:** Define los endpoints y aplica middleware (Auth).
- **Controller Layer:** Valida entrada, orquesta lógica y maneja errores HTTP.
- **Storage Layer (Repository):** Abstracción de persistencia de datos (actualmente en memoria).

---

## 4. Modelo de Datos (Actual)

### 👤 Cliente (Customer)
Entidad central que ahora **incluye** la información de tarifas. La entidad separada "Rate" fue eliminada en favor de este modelo embebido más simple.

```typescript
interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  
  // 💰 Tarifas Embebidas
  pricePerLinearMeter: number  // Precio por metro lineal
  pricePerSquareMeter: number  // Precio por metro cuadrado
  minimumRate: number          // Precio mínimo por pieza
  specialPieces: {             // Lista de precios fijos
    name: string
    price: number
  }[]
  
  createdAt: Date
  updatedAt: Date
}
```

### 📄 Albarán (Delivery Note)
Documento que registra los trabajos realizados. Calcula sus precios basándose en el cliente asignado.

```typescript
interface DeliveryNote {
  id: string
  customerId: string    // Vinculado al cliente
  number: string        // Ej: ALB-2026-001
  status: 'draft' | 'pending' | 'reviewed'
  items: {
    description: string
    color: string       // Carta RAL
    measurements: {
      linearMeters?: number
      squareMeters?: number
    }
    quantity: number
    unitPrice: number   // Calculado automáticamente al crear
    totalPrice: number
  }[]
  totalAmount: number
  date: Date
}
```

### 🔐 Usuario (User)
Utilizado para el acceso al sistema.
- `email`: (ej: admin@epoxiron.com)
- `password`: (Hashed)
- `role`: (admin, user)

---

## 5. Funcionalidades Implementadas

### ✅ Autenticación
- Login seguro con validación de credenciales.
- Sesión persistente (token JWT en LocalStorage).
- Protección de rutas en Frontend y Backend.
- Redirección automática al expirar sesión.

### ✅ Gestión de Clientes (Customers)
- **CRUD Completo:** Crear, Leer, Editar, Eliminar.
- **Tarifas Personalizadas:** Interfaz amigable (Tarjetas visuales) para definir precios específicos por cliente.
- **Piezas Especiales:** Sistema de "Tags/Chips" para añadir precios fijos por nombre de pieza (ej: "Reja", "Farola").
- **Validación:** Formularios robustos que impiden guardar datos incompletos.

### ✅ Gestión de Albaranes (Delivery Notes)
- **Creación Inteligente:** Al seleccionar un cliente y añadir medidas, el sistema calcula el precio automáticamente usando sus tarifas.
- **Lógica de Precios:**
  1. Busca si es una "Pieza Especial" por nombre.
  2. Si no, calcula por Metros (Lineales o Cuadrados).
  3. Aplica la "Tarifa Mínima" si el cálculo es inferior a ella.
- **Estado:** Gestión de estados (Borrador, Pendiente, Revisado).

---

## 6. Estructura de Carpetas

```
epoxiron/
├── api/                  # Backend
│   ├── src/
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/   # Auth, validaciones
│   │   ├── routes/       # Endpoints API
│   │   ├── storage/      # Persistencia (In-Memory)
│   │   ├── types/        # Definiciones TS compartidas
│   │   └── server.ts     # Entry point
│
├── web/                  # Frontend
│   ├── src/
│   │   ├── features/     # Módulos del sistema
│   │   │   ├── auth/
│   │   │   ├── customers/
│   │   │   └── delivery-notes/
│   │   ├── lib/          # Utilidades (apiClient)
│   │   ├── pages/        # Vistas principales
│   │   └── App.tsx       # Routing
│
└── docs/                 # Documentación
    ├── DOCUMENTACION_TECNICA_2026.md  # 👈 Este archivo
    └── ...
```

---

## 7. Próximos Pasos (Roadmap)
1. **Persistencia Real:** Migrar de "In-Memory" a Base de Datos (SQLite/PostgreSQL) para evitar pérdida de datos al reiniciar.
2. **Generación PDF:** Exportar albaranes a PDF.
3. **Dashboard:** Gráficos de facturación mensual.
