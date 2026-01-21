# Documentación de Diseño UX - Epoxiron

> Sistema de gestión de albaranes para taller

## 📖 Índice General

### 🌐 Componentes Globales

Componentes compartidos utilizados en 2 o más pantallas (`src/shared/`)

1. **[Calculadora Modal](global/calculator.md)** 🧮
   - FAB flotante en esquina inferior derecha
   - Calculadora con operaciones básicas
   - Copiar resultado al clipboard
   - **Usado en:** Dashboard, Menú, Albaranes, Clientes, Tarifas

2. **[Breadcrumbs](global/breadcrumbs.md)** 🧭
   - Navegación jerárquica
   - Touch-friendly (44px mínimo)
   - Truncamiento inteligente en móvil
   - **Usado en:** Todas las pantallas autenticadas (excepto Dashboard y Login)

3. **[Paginación](global/pagination.md)** 📄
   - Sistema de paginación con truncamiento
   - 25/50/100 registros por página
   - Responsive (vertical en móvil, horizontal en desktop)
   - **Usado en:** Listar Albaranes, Listar Clientes, Listar Tarifas

4. **[Modal de Confirmación de Eliminación](global/delete-confirmation.md)** 🗑️
   - Confirmación antes de eliminar
   - Advertencias contextuales (elementos relacionados)
   - Focus en acción segura (Cancelar)
   - **Usado en:** Todas las pantallas con funcionalidad de eliminación

5. **[Reglas de Validación](global/validation-rules.md)** ✅
   - Validación on blur (campos individuales)
   - Validación on submit (formulario completo)
   - Mensajes de error claros y accionables
   - **Usado en:** Todos los formularios (Login, Albarán, Cliente, Tarifa)

---

### 📱 Pantallas

Diseño específico de cada pantalla de la aplicación

#### Públicas
1. **[Login](screens/01-login.md)** 🔐
   - Autenticación básica
   - Email + Contraseña
   - Error genérico (seguridad)

#### Autenticadas
2. **[Dashboard](screens/02-dashboard.md)** 🏠
   - Vista de albaranes del día
   - Acceso rápido a funcionalidades

3. **[Menú Principal](screens/03-menu.md)** 🧭
   - Navegación principal
   - Acceso a todas las secciones

4. **[Albarán (Crear/Editar)](screens/04-albaran.md)** 📋
   - Formulario dual (crear/editar)
   - Tabla inline de piezas
   - Validaciones cruzadas

5. **[Listar Albaranes](screens/05-listar-albaranes.md)** 📊
   - Tabla con búsqueda y filtros
   - Paginación
   - Edición inline

6. **[Cliente (Crear/Editar)](screens/06-cliente.md)** 👤
   - Formulario dual (crear/editar)
   - Validación de email y teléfono
   - Botón cancelar con confirmación

7. **[Listar Clientes](screens/07-listar-clientes.md)** 👥
   - Tabla con búsqueda
   - Paginación
   - Acciones por fila

8. **[Tarifa (Crear/Editar)](screens/08-tarifa.md)** 💰
   - Formulario dual (crear/editar)
   - Validación de precio
   - Descripción y unidad


---

## 🎯 Principios de Diseño

### Accesibilidad (WCAG 2.1 AA)
- ♿ Navegación por teclado completa
- 🔊 Screen readers support (ARIA labels)
- 🎨 Contraste mínimo 4.5:1
- 📏 Touch targets mínimo 44x44px

### Responsive Design
- 📱 **Móvil:** < 640px (touch-first)
- 📐 **Tablet:** 640px - 1024px (optimizado para taller)
- 🖥️ **Desktop:** ≥ 1024px

### UX Patterns
- ✅ Validación on blur + on submit
- 🗑️ Confirmación antes de eliminar
- ❌ Botones cancelar en todos los formularios
- 🧭 Breadcrumbs para orientación
- 📄 Paginación para listas largas
- 🧮 Calculadora global accesible

---

## 📂 Estructura del Proyecto

```
design/
├── README.md                    # Este archivo (índice)
├── global/                      # Componentes compartidos
│   ├── calculator.md
│   ├── breadcrumbs.md
│   ├── pagination.md
│   ├── delete-confirmation.md
│   └── validation-rules.md
└── screens/                     # Pantallas específicas
    ├── 01-login.md
    ├── 02-dashboard.md
    ├── 03-menu.md
    ├── 04-albaran.md
    ├── 05-listar-albaranes.md
    ├── 06-cliente.md
    ├── 07-listar-clientes.md
    ├── 08-tarifa.md
    └── 09-listar-tarifas.md
```

---

## 🚀 Problemas UX Resueltos

### ✅ Completados (8/8)
1. **Terminología inconsistente** → Estandarizado a 3 estados (Borrador, Pendiente, Revisado)
2. **Error de seguridad en Login** → Mensaje genérico sin revelación de usuario
3. **Falta especificación edición inline** → Patrón tablet-optimizado documentado
4. **Sin botones Cancelar** → Añadidos a todos los formularios con detección de cambios
5. **Sin navegación (breadcrumbs)** → Sistema completo de breadcrumbs
6. **Sin paginación** → Paginación con truncamiento inteligente
7. **Sin confirmación de eliminación** → Modal con advertencias contextuales
8. **Validaciones poco claras** → Reglas claras (on blur + on submit)

---

## 📝 Stack Tecnológico

- **Frontend:** React 19 + TypeScript
- **Estado:** Zustand
- **Server State:** React Query
- **Estilos:** Tailwind CSS
- **Testing:** Vitest + React Testing Library
- **Validación:** Zod + React Hook Form
- **Accesibilidad:** WCAG 2.1 AA compliant

---

## 📌 Scope Rule

**Global (2+ features):** `src/shared/`
- Calculadora
- Breadcrumbs
- Paginación
- Delete Confirmation Modal
- Validation utilities

**Local (1 feature):** `src/features/[feature]/`
- Componentes específicos de cada pantalla

---

## 🔗 Referencias

- **PLAN_IMPLEMENTACION.md** - Plan de implementación general
- **CLAUDE.md** - Reglas de desarrollo y workflow TDD
- **design.md** - Diseño técnico original (deprecado, migrado a esta estructura)
