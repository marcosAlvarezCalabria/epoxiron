# Design Doc: Sistema de Gestión de Albaranes - Epoxiron

> 📝 _Se irán añadiendo elementos según lo vaya indicando el usuario_

---

## 🧮 Componente Global: Calculadora Modal

> **Scope:** Global compartido (`src/shared/components/Calculator`)
> **Accesibilidad:** Disponible desde **todas las pantallas autenticadas** de la aplicación

### Acceso

**Botón flotante (FAB - Floating Action Button):**
- 📍 **Ubicación:** Esquina inferior derecha (fixed position)
- 🎨 **Icono:** 🧮 o calculadora estándar
- 📏 **Tamaño:** Mínimo 56x56px (touch-friendly)
- 🎯 **z-index:** Alto (por encima de todo el contenido)
- 💡 **Color:** Acento secundario (no interfiere con acciones primarias)
- ♿ **Aria-label:** "Abrir calculadora"

**Comportamiento:**
- Touch/Click → Abre modal de calculadora
- **Visible en:** Dashboard, Menú, Albaranes, Clientes, Tarifas
- **NO visible en:** Login (pantalla no autenticada)
- Se mantiene accesible durante scroll

---

### Modal de Calculadora

#### Layout

**Tamaño del modal:**
- 📱 **Móvil:** Full-width, altura automática desde bottom
- 📐 **Tablet/Desktop:** 320x480px centrado

**Estructura:**
```
┌─────────────────────────────┐
│ Calculadora            [✕]  │ ← Header con botón cerrar
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ 0                   │    │ ← Display (resultado)
│  └─────────────────────┘    │
├─────────────────────────────┤
│  [C]  [±]  [%]  [÷]         │
│  [7]  [8]  [9]  [×]         │ ← Teclado numérico
│  [4]  [5]  [6]  [−]         │   (touch-friendly)
│  [1]  [2]  [3]  [+]         │
│  [0]       [.]  [=]         │
├─────────────────────────────┤
│  📋 Copiar resultado        │ ← Acción adicional
└─────────────────────────────┘
```

#### Especificaciones Técnicas

**Display:**
- 📊 Altura: 60-80px
- 🔤 Font-size: 24-32px (monospace)
- 🎨 Background: Gris claro
- ➡️ Alineación: Derecha
- 📝 Muestra operación y resultado

**Botones del teclado:**
- 📏 **Tamaño mínimo:** 56x56px (touch-friendly)
- 📐 **Gap entre botones:** 8-12px
- 🎨 **Colores:**
  - Números (0-9): Blanco/Gris claro
  - Operadores (+, −, ×, ÷): Naranja/Azul
  - Igual (=): Verde/Acento primario
  - Clear (C): Rojo suave
- 🔤 **Font-size:** 20-24px
- ♿ **Estados:** Hover, Active, Focus (para teclado)

**Operaciones soportadas:**
- ➕ Suma (+)
- ➖ Resta (−)
- ✖️ Multiplicación (×)
- ➗ División (÷)
- 📍 Decimal (.)
- 🔄 Cambiar signo (±)
- 💯 Porcentaje (%)
- 🗑️ Clear (C)

#### Funcionalidades

**1. Operaciones básicas:**
- Suma, resta, multiplicación, división
- Decimales con punto (.)
- Porcentajes automáticos
- Cambio de signo

**2. Teclado físico (opcional desktop):**
- Números `0-9` → Insertar dígito
- Operadores `+`, `-`, `*`, `/` → Operación
- `Enter` o `=` → Calcular
- `Escape` → Cerrar modal
- `C` o `Delete` → Clear
- `.` → Decimal

**3. Copiar resultado:**
- 📋 Botón "Copiar resultado" al pie del modal
- Touch/Click → Copia al clipboard
- Toast/Snackbar: "Resultado copiado: 123.45"

**4. Cerrar modal:**
- ❌ Botón cerrar (X) en header
- Click fuera del modal (backdrop)
- Tecla `Escape`
- **NO** requiere confirmación (calculadora no tiene estado persistente)

#### Comportamiento

**Al abrir:**
- Display muestra: `0`
- Sin operaciones previas guardadas
- Foco en el modal (trap focus para accesibilidad)

**Durante uso:**
- Operación actual visible en display
- Actualización en tiempo real
- Sin límite de operaciones encadenadas

**Al cerrar:**
- No guarda historial
- Próxima apertura: Calculadora limpia (reset)

#### Accesibilidad (WCAG 2.1 AA)

- ♿ **Keyboard navigation:** Tab entre botones, Enter para activar
- 🔊 **Screen readers:** Aria-labels en todos los botones
- 🎯 **Focus trap:** Focus permanece dentro del modal
- 🎨 **Contraste:** Mínimo 4.5:1 en textos
- 📏 **Touch targets:** Mínimo 44x44px (cumple WCAG AAA)

#### Estados visuales

- **Modal abierto:** Backdrop semitransparente (rgba(0,0,0,0.5))
- **Botón presionado:** Efecto ripple o scale
- **Error:** Si división por cero → Display: "Error"
- **Overflow:** Si número muy largo → Display scroll horizontal o ellipsis

---

### Integración en el Sistema

**Componente compartido:**
- `src/shared/components/Calculator/Calculator.tsx`
- `src/shared/components/Calculator/Calculator.test.tsx`
- `src/shared/components/Calculator/useCalculator.ts` (lógica hook)

**Estado global (Zustand):**
```typescript
// src/shared/stores/uiStore.ts
interface UIStore {
  isCalculatorOpen: boolean
  openCalculator: () => void
  closeCalculator: () => void
}
```

**Uso en pantallas:**
- ✅ **FAB visible en:** Dashboard, Menú, Albaranes, Clientes, Tarifas (pantallas autenticadas)
- ❌ **FAB NO visible en:** Login (pantalla pública)

---

# Design Doc: Pantalla Login

> 📝 _Se irán añadiendo elementos según lo vaya indicando el usuario_

---

## Estructura Inicial

### 1. Título

**"Iniciar sesión"**

### 2. Campo: Usuario

- **Label:** "Usuario"
- **Placeholder:** `nombre@empresa.com`

### 3. Campo: Contraseña

- **Label:** "Contraseña"
- **Icono:** Mostrar/Ocultar contraseña

### 4. Botón Principal

- **Texto:** "Acceder"
- **Estado inicial:** Deshabilitado si faltan campos

### 5. Reglas Básicas

- ✅ Validación solo al enviar
- ⚠️ **Error general:** "Las credenciales no son correctas. Por favor, verifica tus datos."

### 6. Layout

- 🎯 Formulario centrado
- 📏 Ancho máximo: `360–400px`
- 📐 Espaciado: `16–24px`

---

## 7. Elementos Añadidos

### 7.1 Enlace "¿Olvidaste tu contraseña?"

- 📍 **Ubicación:** Debajo del campo contraseña
- 🎨 **Estilo:** Link secundario

### 7.2 Opción "Recordar usuario"

- ☑️ Checkbox debajo del formulario
- **Texto:** "Recordar usuario"

### 7.3 Logo / Branding

- 🖼️ Logo centrado en la parte superior
- **Alt:** "Logo del taller"

### 7.4 Estado Loading

- ⏳ Botón "Acceder" muestra spinner al enviar
- 🔒 Bloqueo del formulario mientras carga

### 7.5 Optimización para Tablet

- 👆 Componentes con toque mínimo: `44px`
- 📱 Inputs más altos: `48–52px`
- 📏 Botón principal: Ancho completo

### 7.6 Validaciones Avanzadas

- 📧 Usuario debe tener formato email válido
- 🔐 Contraseña mínimo **6 caracteres**
- 💬 Mensajes contextuales bajo cada campo

---

# Design Doc: Dashboard (Pantalla 2)

## Objetivo de la Pantalla

🎯 Mostrar los albaranes del día y su estado de revisión.

---

## Contenido Base

### 📅 Fecha Actual
- **Ubicación:** Parte superior
- **Alineación:** Centrada o alineada a la izquierda
- **Formato:** Visible y destacada

### 📋 Listado de Albaranes

Tabla con las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| **Nº Albarán** | Autogenerado |
| **Cliente** | Nombre del cliente |
| **Estado** | ✅ Revisado / ❌ Pendiente |
| **Total Piezas** | Cantidad de piezas |
| **Importe Total** | Precio total |
| **Acciones** | 👁️ Ver / ✏️ Editar |

### 🚫 Estado Vacío
- **Condición:** Si no hay albaranes
- **Mensaje:** "Aún no hay albaranes"
- **Ubicación:** Centrado en la pantalla

---

## Layout y Estilo

### 📐 Estructura
- 🎯 Contenedor centrado horizontalmente
- 📏 Columnas alineadas y legibles en tablet
- 📊 Espaciado suficiente entre filas y columnas

### 🎨 Elementos Visuales
- ✅ Iconos de estado claros (check / cruz)
- 👆 Optimización para toque en tablet
- 🔤 Tipografía legible

---

> ⏳ _En espera de nuevas indicaciones para añadir elementos paso a paso._

---

# Design Doc: Menú Principal (Pantalla 3)

## Objetivo de la Pantalla

🎯 Permitir al usuario navegar fácilmente entre las secciones principales de la aplicación.

---

## Elementos del Menú

### 🧭 Opciones de Navegación

1. **📄 Albarán nuevo**
2. **📋 Listar albaranes**
3. **👤 Cliente nuevo**
4. **👥 Listar clientes**
5. **💰 Tarifa**
6. **📊 Listar tarifas**

---

## Estilo y Layout

### 🖥️ Desktop
- **Tipo:** Barra de navegación horizontal (navbar)
- **Ubicación:** Parte superior
- **Distribución:** Elementos en línea horizontal

### 📱 Mobile
- **Tipo:** Menú hamburguesa desplegable
- **Comportamiento:** Menú colapsable/expandible
- **Icono:** Hamburguesa (☰) en la parte superior

### 🎨 Elementos Visuales

- ✅ **Iconos opcionales** al lado de cada texto para mayor claridad
- 👆 **Touch-friendly:** Mínimo `44px` de altura para cada elemento
- 🎯 **Estado activo** destacado:
  - Color de fondo diferenciado
  - O borde inferior visible
- 📐 **Separación clara** entre secciones funcionales

### ♿ Accesibilidad

- 🔤 Texto legible y contrastado
- 👆 Targets táctiles adecuados
- 🎨 Estados hover/focus bien definidos

---

> ⏳ _En espera de instrucciones para añadir comportamientos adicionales, submenús o colores específicos._

---

# Design Doc: Pantalla de Albarán (Pantalla 4)

## Objetivo de la Pantalla

🎯 Permitir al usuario crear un nuevo albarán o editar un albarán existente desde la misma interfaz, manteniendo todos los campos y piezas visibles y editables según reglas de negocio.

---

## Modo de la Pantalla

### 🆕 Modo Creación
- **Origen:** Desde menú "Albarán nuevo"
- **Estado inicial:** Campos vacíos
- **Botón principal:** "Guardar borrador"
- **Habilitación:** Cuando se completa el mínimo requerido

### ✏️ Modo Edición
- **Origen:** Desde Dashboard (Ver/Editar)
- **Estado inicial:** Campos rellenados con datos existentes
- **Botones disponibles:**
  - "Guardar cambios" (activo)
  - "Marcar como revisado" (disponible)

---

## Contenido de la Pantalla

### 📋 Información General

| Campo | Descripción |
|-------|-------------|
| **Nº Albarán** | Autogenerado |
| **Cliente** | Selección de lista o buscador |
| **Fecha** | Autocompletada |
| **Estado** | Borrador / Pendiente / Revisado |

### 🔧 Listado de Piezas

Tabla editable con las siguientes columnas:

- **Nombre de la pieza**
- **Cantidad**
- **Metros lineales / Metros cuadrados**
- **Grosor**
- **Color RAC o especial**
- **Precio** _(opcional)_

#### Funcionalidades de Edición Inline

**Patrón optimizado para tablet:**

1. **Activar edición:**
   - Touch en icono ✏️ de la fila → Toda la fila se vuelve editable
   - Solo una fila editable a la vez

2. **Controles por fila (touch-friendly):**
   - ✅ Botón "Guardar" (verde, mínimo 44px)
   - ❌ Botón "Cancelar" (gris, mínimo 44px)
   - Ubicados al final de la fila

3. **Atajos de teclado (opcional, para desktop):**
   - `Enter` → Guarda cambios
   - `Escape` → Cancela edición

4. **Validación:**
   - En tiempo real mientras edita
   - Mensajes de error bajo el campo

5. **Estados visuales:**
   - Fila en edición: Borde destacado (azul/verde)
   - Inputs touch-friendly: Mínimo 48-52px de altura
   - Scroll horizontal si la tabla es muy ancha

6. **Comportamiento:**
   - Touch fuera de la fila en edición → Mostrar confirmación si hay cambios sin guardar
   - "¿Guardar cambios? [Guardar] [Descartar] [Cancelar]"

7. **Alternativa modal:**
   - 🔲 **Modal opcional:** Para edición avanzada con más detalles si se requiere

### 🎛️ Botones de Acción

**Layout horizontal (tablet/desktop):**
- ❌ **Cancelar** (secundario, gris, mínimo 44px)
- 💾 **Guardar cambios / Guardar borrador** (primario, destacado, mínimo 44px)
- ✅ **Marcar como revisado** (opcional, según estado)

**Comportamiento botón Cancelar:**

**Modo creación:**
- Si NO hay cambios → Vuelve al Dashboard
- Si HAY cambios → Confirmación: "¿Descartar cambios? [Descartar] [Continuar editando]"

**Modo edición:**
- Si NO hay cambios → Vuelve a pantalla anterior
- Si HAY cambios → Confirmación: "¿Descartar cambios? [Descartar] [Continuar editando]"

**Atajo de teclado:** `Escape` → Activa botón Cancelar

---

## Comportamiento

### 🔐 Reglas de Edición
- ✅ Edición disponible mientras el albarán **no esté finalizado**
- 💾 Guardar cambios actualiza albarán en **tiempo real**
- ✅ Marcar como revisado refleja estado en **Dashboard**
- 🤖 Reglas de negocio aplicadas automáticamente:
  - Tarifas
  - Medidas
  - Precios mínimos

### 🔀 Diferenciación de Modos

| Origen | Modo | Estado |
|--------|------|--------|
| 📄 **Menú** | Creación | Campos vacíos |
| 📊 **Dashboard** | Edición | Campos rellenados |

---

## Layout y Estilo

### 📐 Estructura
- **Sección general:** Parte superior (Info general)
- **Lista de piezas:** Parte inferior (Editable)
- **Espaciado:** Touch-friendly (mínimo `44px`)

### 🎨 Elementos Visuales
- ✅ **Botón "Marcar como revisado"** destacado
- 👆 **Optimizado para tablet**
- 📱 **Responsive design**
- 🔤 **Tipografía legible** y contrastada

### ⚡ Interactividad
- **Edición inline** en tabla de piezas
- **Modal opcional** para detalles avanzados
- **Validación en tiempo real** de campos obligatorios

---

> 🎉 _Pantalla única lista para cubrir creación y edición de albaranes, integrable desde menú y Dashboard._

---

# Design Doc: Listar Albaranes (Pantalla 5)

## Objetivo de la Pantalla

🎯 Permitir al usuario ver todos los albaranes existentes, filtrar, buscar y ejecutar acciones rápidas sobre cada albarán.

---

## Contenido de la Pantalla

### 📅 Información Temporal
- **Fecha actual** o **rango de fechas**
- Visible en la parte superior

### 🔍 Filtros y Búsqueda

| Tipo | Opciones |
|------|----------|
| **Buscar por cliente** | Campo de texto con búsqueda en tiempo real |
| **Buscar por Nº albarán** | Campo numérico/texto |
| **Filtrar por estado** | Borrador / Pendiente / Revisado |

### 📋 Listado de Albaranes

**Orden inicial:** Más nuevo a más viejo

Tabla con las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| **Nº Albarán** | Autogenerado |
| **Cliente** | Nombre del cliente |
| **Fecha** | Fecha de creación |
| **Estado** | ✅ Revisado / ❌ Pendiente |
| **Nº Piezas** | Cantidad total de piezas |
| **Importe Total** | Precio total |
| **Acciones** | 👁️ Ver / ✏️ Editar / ✅ Marcar revisado / 🗑️ Eliminar |

#### 🗑️ Regla de Eliminación
- **Solo permitido** si el albarán está en estado **Borrador**

### 🚫 Estado Vacío
- **Condición:** Si no hay albaranes
- **Mensaje:** "No hay albaranes registrados"
- **Ubicación:** Centrado en la pantalla

---

## Comportamiento

### 🖱️ Interacciones
- 👆 **Albarán clicable:** Abre pantalla única de albarán en **modo edición**
- ⚡ **Filtros en tiempo real:** Modifican orden y contenido del listado
- 🔄 **Acciones rápidas:** Reflejan cambios inmediatamente en listado y dashboard
- 🗑️ **Eliminar:** Solo permitido si estado = **Borrador**

### 🔀 Flujo de Navegación
- **Clic en albarán** → Pantalla de Albarán (modo edición)
- **Filtros/búsqueda** → Actualización instantánea del listado
- **Marcar como revisado** → Actualización de estado en tabla y dashboard

---

## Layout y Estilo

### 📐 Estructura
- 📊 **Tabla responsive** optimizada para tablet y desktop
- 📏 **Columnas alineadas** y legibles
- 📐 **Espaciado adecuado** entre filas y columnas

### 🎨 Elementos Visuales
- ✅ **Iconos de estado** claros (check / cruz)
- 👆 **Botones touch-friendly:** Mínimo `44px`
- 🔤 **Tipografía legible** y contrastada
- 🎯 **Acciones agrupadas** por fila

### ⚡ Funcionalidades
- 🔍 **Búsqueda en tiempo real**
- 🔄 **Ordenamiento** (más nuevo a más viejo por defecto)
- 🎨 **Estados visuales** diferenciados por estado de albarán

---

> 📊 _Pantalla lista para mostrar listado de albaranes con orden inicial de más nuevo a más viejo, filtros, búsqueda y acciones rápidas._

---

# Design Doc: Cliente Nuevo (Pantalla 6)

## Objetivo de la Pantalla

🎯 Permitir al usuario crear un nuevo cliente introduciendo su nombre y asignándole una tarifa existente.

---

## Contenido de la Pantalla

### 📝 Formulario de Cliente

| Campo | Tipo | Requerido |
|-------|------|-----------|
| **Nombre de la empresa** | Texto | ✅ Obligatorio |
| **Tarifa** | Selector/Desplegable | ✅ Obligatorio |

#### 📋 Selector de Tarifa
- **Fuente:** Lista de todas las tarifas existentes
- **Opción por defecto:** Selecciona una tarifa automáticamente (opcional)
- **Formato:** Desplegable con nombres de tarifas

### 🎛️ Botones de Acción

**Layout horizontal (tablet/desktop):**
- ❌ **Cancelar** (secundario, gris, mínimo 44px)
- 💾 **Guardar / Crear Cliente** (primario, destacado, mínimo 44px)

**Comportamiento botón Cancelar:**

**Modo creación:**
- Si NO hay cambios → Vuelve a lista de clientes
- Si HAY cambios → Confirmación: "¿Descartar cambios? [Descartar] [Continuar editando]"

**Modo edición:**
- Si NO hay cambios → Vuelve a lista de clientes
- Si HAY cambios → Confirmación: "¿Descartar cambios? [Continuar editando] [Descartar]"

**Atajo de teclado:** `Escape` → Activa botón Cancelar

---

## Comportamiento

### ✅ Validación
- **Ambos campos obligatorios**
- 🚫 No permitir guardar si falta algún campo
- 💬 **Feedback visual** si faltan campos obligatorios

### 💾 Al Guardar
- ✅ Cliente se añade a la **base de datos**
- 🔗 Cliente estará **disponible para crear albaranes**
- 🔄 Selector de tarifa muestra **todas las tarifas existentes**

### 🔀 Flujo Post-Creación
- **Opción 1:** Redirigir a lista de clientes
- **Opción 2:** Limpiar formulario para crear otro cliente
- **Opción 3:** Mostrar confirmación y permitir elegir acción

---

## Layout y Estilo

### 📐 Estructura
- 🎯 **Formulario centrado** y simple
- 📏 **Ancho máximo:** `360–400px`
- 📐 **Espaciado:** `16–24px` entre campos

### 🎨 Elementos Visuales
- 👆 **Campos touch-friendly:** Mínimo `44px` de altura
- 🔤 **Labels claros** para cada campo
- ✅ **Botón Guardar destacado** (color primario)
- ⚠️ **Feedback visual** para campos vacíos (borde rojo, mensaje de error)

### 📱 Responsive
- **Tablet:** Formulario centrado, ancho máximo
- **Desktop:** Formulario centrado, mismo comportamiento

### ♿ Accesibilidad
- 🔤 Labels asociados a inputs
- ⌨️ Navegación por teclado (Tab, Enter)
- 🎨 Contraste adecuado en textos y bordes
- 📢 Mensajes de error accesibles (aria-live)

---

> 👤 _Pantalla lista para crear un cliente con nombre y tarifa asignada._

---

# Design Doc: Listar Clientes (Pantalla 7)

## Objetivo de la Pantalla

🎯 Permitir al usuario ver todos los clientes existentes, buscar, filtrar y acceder a la edición de cada cliente.

---

## Contenido de la Pantalla

### 🔍 Búsqueda y Filtros

| Tipo | Opciones |
|------|----------|
| **Buscar por nombre** | Campo de texto con búsqueda en tiempo real |
| **Filtrar por tarifa** | Selector de tarifas asignadas |

### 👥 Listado de Clientes

Tabla con las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| **Nombre de la empresa** | Nombre del cliente |
| **Tarifa asignada** | Nombre de la tarifa asociada |
| **Acciones** | ✏️ Editar / 🗑️ Eliminar |

#### 🗑️ Regla de Eliminación
- **Solo permitido** si el cliente **NO tiene albaranes asociados**
- Si tiene albaranes → Mostrar mensaje de error/advertencia

### 🚫 Estado Vacío
- **Condición:** Si no hay clientes
- **Mensaje:** "No hay clientes registrados"
- **Ubicación:** Centrado en la pantalla

---

## Comportamiento

### 🖱️ Interacciones
- 👆 **Cliente clicable:** Abre pantalla de Cliente Nuevo en **modo edición**
- ⚡ **Filtros en tiempo real:** Modifican contenido del listado
- ✏️ **Editar:** Permite modificar nombre o tarifa
- 🗑️ **Eliminar:** Solo permitido si **no tiene albaranes asociados**

### 🔀 Flujo de Navegación
- **Clic en cliente** → Pantalla Cliente Nuevo (modo edición)
- **Filtros/búsqueda** → Actualización instantánea del listado
- **Editar** → Abre formulario con datos precargados
- **Eliminar** → Confirmación + validación de albaranes asociados

### ⚠️ Validación de Eliminación
- Si cliente tiene albaranes → **Bloquear eliminación**
- Mostrar mensaje: _"No se puede eliminar. El cliente tiene albaranes asociados"_

---

## Layout y Estilo

### 📐 Estructura
- 📊 **Tabla responsive** optimizada para tablet y desktop
- 📏 **Columnas alineadas** y legibles
- 📐 **Espaciado adecuado** entre filas y columnas

### 🎨 Elementos Visuales
- 👆 **Botones touch-friendly:** Mínimo `44px`
- 🔤 **Tipografía legible** y contrastada
- 🎯 **Acciones agrupadas** por fila
- ⚠️ **Estados de error** para eliminación bloqueada

### ⚡ Funcionalidades
- 🔍 **Búsqueda en tiempo real** por nombre
- 🔄 **Filtrado** por tarifa asignada
- 🎨 **Estados visuales** diferenciados (hover, disabled)

### ♿ Accesibilidad
- 🔤 Nombres de columnas claros
- ⌨️ Navegación por teclado
- 🎨 Contraste adecuado
- 📢 Mensajes de error accesibles (aria-live)

---

> 👥 _Pantalla lista para mostrar listado de clientes con búsqueda, filtros y edición rápida._

---

# Design Doc: Crear Tarifa (Pantalla 8)

## Objetivo de la Pantalla

🎯 Permitir al usuario crear una nueva tarifa con todos los detalles de precios y reglas asociadas.

---

## Contenido de la Pantalla

### 📝 Formulario de Tarifa

| Campo | Tipo | Requerido |
|-------|------|-----------|
| **Nombre de la tarifa** | Texto | ✅ Obligatorio |
| **Precio por metro lineal** | Numérico | ⚪ Opcional |
| **Precio por metro cuadrado** | Numérico | ⚪ Opcional |
| **Grosor** | Numérico | ⚪ Opcional |

### ⭐ Tarifa Especial

| Campo | Tipo | Requerido |
|-------|------|-----------|
| **Nombre/Descripción** | Texto | ⚪ Opcional |
| **Precio especial** | Numérico | ⚪ Opcional (obligatorio si se completa nombre) |

#### 📋 Regla de Tarifa Especial
- Si se completa el **nombre de pieza especial** → El **precio especial** se vuelve **obligatorio**
- Si está vacío el nombre → Precio especial no es necesario

### 🎛️ Botones de Acción

**Layout horizontal (tablet/desktop):**
- ❌ **Cancelar** (secundario, gris, mínimo 44px)
- 💾 **Guardar / Crear Tarifa** (primario, destacado, mínimo 44px)

**Comportamiento botón Cancelar:**

**Modo creación:**
- Si NO hay cambios → Vuelve a lista de tarifas
- Si HAY cambios → Confirmación: "¿Descartar cambios? [Descartar] [Continuar editando]"

**Modo edición:**
- Si NO hay cambios → Vuelve a lista de tarifas
- Si HAY cambios → Confirmación: "¿Descartar cambios? [Continuar editando] [Descartar]"

**Atajo de teclado:** `Escape` → Activa botón Cancelar

---

## Comportamiento

### ✅ Validación

| Regla | Descripción |
|-------|-------------|
| **Nombre obligatorio** | No permitir guardar si falta el nombre |
| **Precio especial condicional** | Si hay nombre de pieza especial → precio especial obligatorio |
| **Campos opcionales** | Pueden dejarse vacíos (excepto condiciones especiales) |

### 💾 Al Guardar
- ✅ Tarifa se añade a la **base de datos**
- 🔗 Tarifa estará **disponible para asignar a clientes**
- 🎯 **Validación previa** de campos obligatorios

### 🔀 Flujo Post-Creación
- **Opción 1:** Redirigir a lista de tarifas
- **Opción 2:** Limpiar formulario para crear otra tarifa
- **Opción 3:** Mostrar confirmación y permitir elegir acción

---

## Layout y Estilo

### 📐 Estructura
- 🎯 **Formulario centrado** y simple
- 📏 **Ancho máximo:** `360–400px`
- 📐 **Espaciado:** `16–24px` entre campos
- 📑 **Agrupación visual:** Sección de precios y sección especial diferenciadas

### 🎨 Elementos Visuales
- 👆 **Campos touch-friendly:** Mínimo `44px` de altura
- 🔤 **Labels claros** para cada campo
- ✅ **Botón Guardar destacado** (color primario)
- ⚠️ **Feedback visual** para errores:
  - Borde rojo en campos con error
  - Mensaje contextual bajo el campo
- 💡 **Indicadores de opcional/obligatorio** claros

### 📱 Responsive
- **Tablet:** Formulario centrado, ancho máximo
- **Desktop:** Formulario centrado, mismo comportamiento

### ♿ Accesibilidad
- 🔤 Labels asociados a inputs
- ⌨️ Navegación por teclado (Tab, Enter)
- 🎨 Contraste adecuado en textos y bordes
- 📢 Mensajes de error accesibles (aria-live)
- 💬 Indicación clara de campos obligatorios vs opcionales

---

> 💰 _Pantalla lista para crear tarifas con nombre, precios, piezas especiales y grosor._

---

# Design Doc: Listar Tarifas (Pantalla 9)

## Objetivo de la Pantalla

🎯 Permitir al usuario ver todas las tarifas existentes, buscar, filtrar y acceder a la edición de cada tarifa.

---

## Contenido de la Pantalla

### 🔍 Búsqueda y Filtros

| Tipo | Opciones |
|------|----------|
| **Buscar por nombre** | Campo de texto con búsqueda en tiempo real |
| **Filtrar por precio metro lineal** | Rango de precios |
| **Filtrar por precio metro cuadrado** | Rango de precios |
| **Filtrar por piezas especiales** | Mostrar solo tarifas con piezas especiales |

### 💰 Listado de Tarifas

Tabla con las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| **Nombre de la tarifa** | Nombre identificador |
| **Precio m. lineal** | Precio por metro lineal |
| **Precio m. cuadrado** | Precio por metro cuadrado |
| **Grosor** | Grosor asociado |
| **Piezas especiales** | Resumen (cantidad o ícono) |
| **Acciones** | ✏️ Editar / 🗑️ Eliminar |

#### 🗑️ Regla de Eliminación
- **Solo permitido** si la tarifa **NO está asignada** a ningún cliente o albarán
- Si está en uso → Mostrar mensaje de error/advertencia

### 🚫 Estado Vacío
- **Condición:** Si no hay tarifas
- **Mensaje:** "No hay tarifas registradas"
- **Ubicación:** Centrado en la pantalla

---

## Comportamiento

### 🖱️ Interacciones
- 👆 **Tarifa clicable:** Abre pantalla Crear Tarifa en **modo edición**
- ⚡ **Filtros en tiempo real:** Modifican contenido del listado
- ✏️ **Editar:** Permite modificar todos los campos de la tarifa
- 🗑️ **Eliminar:** Solo permitido si **no está asignada a clientes o albaranes**

### 🔀 Flujo de Navegación
- **Clic en tarifa** → Pantalla Crear Tarifa (modo edición)
- **Filtros/búsqueda** → Actualización instantánea del listado
- **Editar** → Abre formulario con datos precargados
- **Eliminar** → Confirmación + validación de uso en clientes/albaranes

### ⚠️ Validación de Eliminación
- Si tarifa está asignada → **Bloquear eliminación**
- Mostrar mensaje: _"No se puede eliminar. La tarifa está asignada a clientes o albaranes"_

---

## Layout y Estilo

### 📐 Estructura
- 📊 **Tabla responsive** optimizada para tablet y desktop
- 📏 **Columnas alineadas** y legibles
- 📐 **Espaciado adecuado** entre filas y columnas

### 🎨 Elementos Visuales
- 👆 **Botones touch-friendly:** Mínimo `44px`
- 🔤 **Tipografía legible** y contrastada
- 🎯 **Acciones agrupadas** por fila
- ⚠️ **Estados de error** para eliminación bloqueada
- ⭐ **Indicador visual** para piezas especiales (badge, ícono, etc.)

### ⚡ Funcionalidades
- 🔍 **Búsqueda en tiempo real** por nombre
- 🔄 **Filtrado múltiple**:
  - Por precio metro lineal
  - Por precio metro cuadrado
  - Por presencia de piezas especiales
- 🎨 **Estados visuales** diferenciados (hover, disabled)

### 📊 Visualización de Datos
- **Precios vacíos:** Mostrar "—" o "N/A"
- **Piezas especiales:** Badge con cantidad o ícono ⭐
- **Columnas numéricas:** Alineadas a la derecha
- **Formato de precios:** Con símbolo de moneda (€)

### ♿ Accesibilidad
- 🔤 Nombres de columnas claros
- ⌨️ Navegación por teclado
- 🎨 Contraste adecuado
- 📢 Mensajes de error accesibles (aria-live)
- 🏷️ Labels para filtros y búsquedas

---

> 💰 _Pantalla lista para mostrar listado de tarifas con búsqueda, filtros y edición rápida._