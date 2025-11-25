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

## 🧭 Componente Global: Breadcrumbs (Navegación)

> **Scope:** Global compartido (`src/shared/components/Breadcrumbs`)
> **Accesibilidad:** Disponible en **todas las pantallas autenticadas** con navegación profunda

### Ubicación

**Posición en layout:**
- 📍 **Ubicación:** Parte superior de la pantalla, debajo del header/navbar
- 📐 **Padding:** 12-16px horizontal, 8-12px vertical
- 🎨 **Background:** Transparente o sutil (no debe competir con contenido)
- 📏 **Altura total:** Mínimo 48px (touch-friendly en móvil)

---

### Estructura Visual

**Patrón de breadcrumbs:**
```
🏠 Dashboard > Listar Albaranes > Albarán #1234
[touch]       [touch]           [actual - no clickable]
```

**Elementos:**
1. **Icono Home (🏠):** Siempre presente, vuelve al Dashboard
2. **Separador (>):** Entre cada nivel
3. **Enlaces:** Niveles previos (clickables)
4. **Nivel actual:** Último elemento (NO clickable, estilo diferenciado)

---

### Especificaciones Técnicas

**Touch targets (móvil/tablet):**
- 📏 **Altura mínima de cada enlace:** 44px
- 📐 **Padding horizontal por enlace:** 8-12px
- 🎯 **Separación entre enlaces:** Suficiente para evitar toques accidentales

**Tipografía:**
- 🔤 **Font-size:** 14-16px
- 📝 **Font-weight:**
  - Enlaces: Normal (400)
  - Nivel actual: Bold (600) o Medium (500)
- 🎨 **Color:**
  - Enlaces: Azul/Acento primario
  - Nivel actual: Gris oscuro / Negro
  - Separador: Gris medio

**Estados visuales:**
- **Hover (desktop):** Subrayado en enlaces
- **Active/Touch:** Efecto ripple o cambio de color sutil
- **Focus:** Outline visible (accesibilidad teclado)

---

### Comportamiento Responsive

**Móvil (< 768px):**
- Si breadcrumbs es muy largo → Truncar niveles intermedios:
  ```
  🏠 Dashboard > ... > Albarán #1234
  ```
- **Alternativa:** Scroll horizontal si es necesario
- **Prioridad:** Siempre mostrar Home (🏠) + Nivel actual

**Tablet/Desktop (≥ 768px):**
- Mostrar breadcrumbs completo
- Sin truncamiento (a menos que haya 4+ niveles)

---

### Mapeo de Breadcrumbs por Pantalla

#### **1. Dashboard**
```
❌ No tiene breadcrumbs (es la raíz)
```

#### **2. Menú Principal**
```
🏠 Dashboard > Menú
```

#### **3. Listar Albaranes**
```
🏠 Dashboard > Listar Albaranes
```

#### **4. Pantalla Albarán (Crear nuevo)**
```
🏠 Dashboard > Listar Albaranes > Nuevo Albarán
```

#### **5. Pantalla Albarán (Editar existente)**
```
🏠 Dashboard > Listar Albaranes > Albarán #1234
```

#### **6. Listar Clientes**
```
🏠 Dashboard > Listar Clientes
```

#### **7. Cliente Nuevo (Crear)**
```
🏠 Dashboard > Listar Clientes > Nuevo Cliente
```

#### **8. Cliente Nuevo (Editar existente)**
```
🏠 Dashboard > Listar Clientes > Cliente: Empresa S.A.
```

#### **9. Listar Tarifas**
```
🏠 Dashboard > Listar Tarifas
```

#### **10. Crear Tarifa (Nueva)**
```
🏠 Dashboard > Listar Tarifas > Nueva Tarifa
```

#### **11. Crear Tarifa (Editar existente)**
```
🏠 Dashboard > Listar Tarifas > Tarifa: Mano de Obra Básica
```

---

### Accesibilidad (WCAG 2.1 AA)

**Navegación por teclado:**
- ⌨️ **Tab:** Navega entre enlaces
- ⏎ **Enter/Space:** Activa enlace seleccionado
- 🎯 **Focus visible:** Outline claro en elemento enfocado

**Semántica HTML:**
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/albaranes">Listar Albaranes</a></li>
    <li aria-current="page">Albarán #1234</li>
  </ol>
</nav>
```

**Screen readers:**
- `aria-label="Breadcrumb"` en el `<nav>`
- `aria-current="page"` en el último elemento
- Separadores (`>`) con `aria-hidden="true"` (decorativos)

**Contraste:**
- 🎨 Mínimo 4.5:1 para texto de enlaces
- 🎨 Mínimo 3:1 para separadores

---

### Casos Especiales

**Si el usuario llega directo por URL (sin navegación previa):**
- Breadcrumbs se genera según la ruta actual
- Ejemplo: `/albaranes/1234` → `🏠 Dashboard > Listar Albaranes > Albarán #1234`

**Si el usuario retrocede con botón del navegador:**
- Breadcrumbs se actualiza según la nueva ruta
- Mantiene coherencia con la ubicación actual

---

### Integración en el Sistema

**Componente compartido:**
- `src/shared/components/Breadcrumbs/Breadcrumbs.tsx`
- `src/shared/components/Breadcrumbs/Breadcrumbs.test.tsx`
- `src/shared/components/Breadcrumbs/useBreadcrumbs.ts` (hook para generar breadcrumbs según ruta)

**Configuración de rutas:**
```typescript
// src/shared/config/breadcrumbsConfig.ts
export const breadcrumbsMap = {
  '/dashboard': [{ label: 'Dashboard', path: '/dashboard' }],
  '/albaranes': [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Listar Albaranes', path: '/albaranes' }
  ],
  '/albaranes/:id': [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Listar Albaranes', path: '/albaranes' },
    { label: 'Albarán #:id', path: null } // null = no clickable
  ],
  // ... más rutas
}
```

**Hook de uso:**
```typescript
// En cualquier pantalla
const breadcrumbs = useBreadcrumbs()
// Retorna: [{ label: 'Dashboard', path: '/dashboard' }, ...]
```

---

## 📄 Componente Global: Paginación

> **Scope:** Global compartido (`src/shared/components/Pagination`)
> **Uso:** Pantallas con listas largas (Listar Albaranes, Listar Clientes, Listar Tarifas)

### Ubicación

**Posición en layout:**
- 📍 **Ubicación:** Pie de la tabla/lista
- 📐 **Padding:** 16-20px horizontal, 12-16px vertical
- 🎨 **Background:** Gris muy claro o blanco
- 📏 **Altura total:** Mínimo 60px (touch-friendly)

---

### Estructura Visual

**Layout completo:**
```
┌─────────────────────────────────────────────────┐
│  Mostrando 1-25 de 234 albaranes                │
│                                                  │
│  [<] [1] [2] [3] ... [10] [>]    25 por página ▼│
└─────────────────────────────────────────────────┘
```

**Elementos:**
1. **Info de registros:** "Mostrando X-Y de Z [entidad]"
2. **Botones de navegación:** Anterior `[<]`, Siguiente `[>]`
3. **Números de página:** Páginas clickables
4. **Selector de registros por página:** Dropdown (25, 50, 100)

---

### Especificaciones Técnicas

**Touch targets (móvil/tablet):**
- 📏 **Botones navegación (< >):** Mínimo 44x44px
- 📏 **Números de página:** Mínimo 44x44px
- 📐 **Gap entre botones:** 4-8px
- 📏 **Dropdown "por página":** Mínimo 44px de altura

**Tipografía:**
- 🔤 **Info registros:** 14-16px, color gris oscuro
- 🔤 **Números de página:** 14-16px
- 🔤 **Dropdown:** 14-16px

**Colores:**
- 🎨 **Página actual:** Azul/Acento primario, background destacado
- 🎨 **Otras páginas:** Gris oscuro, background transparente
- 🎨 **Hover:** Background gris claro
- 🎨 **Disabled (< > sin páginas):** Gris claro, no clickable

**Estados visuales:**
- **Página actual:** Background azul, texto blanco, NO clickable
- **Hover (desktop):** Background gris claro
- **Active/Touch:** Efecto ripple
- **Disabled:** Opacity 0.5, cursor not-allowed
- **Focus:** Outline visible (accesibilidad)

---

### Comportamiento Responsive

**Móvil (< 640px):**
```
Mostrando 1-25 de 234

[<] [1] [2] ... [10] [>]

25 por página ▼
```
- Stacking vertical (3 filas)
- Info registros arriba
- Navegación centro
- Dropdown abajo

**Tablet (640px - 1024px):**
```
Mostrando 1-25 de 234          [<] [1] [2] ... [10] [>]    25/pág ▼
```
- Layout horizontal
- Info izquierda
- Navegación centro
- Dropdown derecha (texto corto: "25/pág")

**Desktop (≥ 1024px):**
```
Mostrando 1-25 de 234 albaranes    [<] [1] [2] [3] ... [10] [>]    25 por página ▼
```
- Layout horizontal completo
- Más números de página visibles (si hay espacio)
- Texto completo en dropdown

---

### Lógica de Números de Página

**Patrón de truncamiento:**

**Pocas páginas (≤ 7):**
```
[<] [1] [2] [3] [4] [5] [6] [7] [>]
```
Mostrar todas

**Muchas páginas (> 7):**

- **Inicio (página 1-3):**
  ```
  [<] [1] [2] [3] ... [10] [>]
  ```

- **Medio (página 4-7):**
  ```
  [<] [1] ... [5] [6] [7] ... [10] [>]
  ```

- **Final (página 8-10):**
  ```
  [<] [1] ... [8] [9] [10] [>]
  ```

**Regla:**
- Siempre mostrar: Primera, Última, Actual, ±1 de Actual
- Usar `...` para páginas omitidas (NO clickable, decorativo)

---

### Selector "Registros por Página"

**Opciones disponibles:**
- 25 por página (por defecto)
- 50 por página
- 100 por página

**Comportamiento:**
- Al cambiar → Recarga lista con nueva cantidad
- **Mantiene filtros/búsqueda activos**
- Vuelve a página 1 (resetea paginación)

**Dropdown touch-friendly:**
- 📏 Altura: Mínimo 44px
- 🎨 Borde visible, icono ▼
- 📱 En móvil: Trigger nativo `<select>` para mejor UX

---

### Texto Informativo

**Formato:**
```
Mostrando {inicio}-{fin} de {total} {entidad_plural}
```

**Ejemplos:**
- `Mostrando 1-25 de 234 albaranes`
- `Mostrando 26-50 de 234 albaranes`
- `Mostrando 201-234 de 234 albaranes` (última página)
- `Mostrando 1-15 de 15 clientes` (una sola página)

**Caso especial (sin resultados):**
```
No hay resultados
```
(No mostrar paginación)

---

### Accesibilidad (WCAG 2.1 AA)

**Navegación por teclado:**
- ⌨️ **Tab:** Navega entre botones y dropdown
- ⏎ **Enter/Space:** Activa botón seleccionado
- 🎯 **Focus visible:** Outline claro

**Semántica HTML:**
```html
<nav aria-label="Paginación">
  <div aria-live="polite" aria-atomic="true">
    Mostrando 1-25 de 234 albaranes
  </div>

  <ul>
    <li>
      <button aria-label="Página anterior" disabled>
        <span aria-hidden="true">&lt;</span>
      </button>
    </li>
    <li>
      <button aria-label="Página 1" aria-current="page">1</button>
    </li>
    <li>
      <button aria-label="Página 2">2</button>
    </li>
    <!-- ... -->
    <li>
      <button aria-label="Página siguiente">
        <span aria-hidden="true">&gt;</span>
      </button>
    </li>
  </ul>

  <label for="page-size">Registros por página:</label>
  <select id="page-size" aria-label="Registros por página">
    <option value="25" selected>25</option>
    <option value="50">50</option>
    <option value="100">100</option>
  </select>
</nav>
```

**Screen readers:**
- `aria-label` en nav y botones
- `aria-current="page"` en página actual
- `aria-live="polite"` en info de registros (anuncia cambios)
- `aria-atomic="true"` para leer mensaje completo
- Iconos `< >` con `aria-hidden="true"` (texto descriptivo en aria-label)

**Contraste:**
- 🎨 Mínimo 4.5:1 para texto
- 🎨 Mínimo 3:1 para botones

---

### Casos Especiales

**Una sola página (todos los registros caben):**
- Mostrar info: "Mostrando 1-15 de 15 clientes"
- **NO** mostrar botones de navegación
- **NO** mostrar selector de registros por página
- Simplificar UI (solo info)

**Última página (registros incompletos):**
- Ejemplo: "Mostrando 201-234 de 234 albaranes"
- Botón "Siguiente [>]" disabled
- Página actual es la última

**Cambio de filtros/búsqueda:**
- Resetea a página 1
- Recalcula total de registros
- Actualiza info: "Mostrando 1-25 de X resultados"

**Registro eliminado en página actual:**
- Si queda vacía → Retrocede a página anterior
- Si quedan registros → Recarga página actual

---

### Integración en Pantallas

**Pantallas que usan paginación:**

1. **Pantalla 5: Listar Albaranes**
   - Entidad: "albaranes"
   - Por defecto: 25 por página
   - Ordenamiento: Más recientes primero

2. **Pantalla 7: Listar Clientes**
   - Entidad: "clientes"
   - Por defecto: 25 por página
   - Ordenamiento: Alfabético por nombre

3. **Pantalla 9: Listar Tarifas**
   - Entidad: "tarifas"
   - Por defecto: 25 por página
   - Ordenamiento: Alfabético por descripción

---

### Integración en el Sistema

**Componente compartido:**
- `src/shared/components/Pagination/Pagination.tsx`
- `src/shared/components/Pagination/Pagination.test.tsx`
- `src/shared/components/Pagination/usePagination.ts` (lógica hook)

**Hook de uso:**
```typescript
// En pantallas de lista
const {
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
  setPageSize,
  pageNumbers // [1, 2, '...', 10]
} = usePagination({
  totalItems: 234,
  initialPageSize: 25
})
```

**Persistencia (opcional):**
```typescript
// Guardar en localStorage o URL query params
// Para mantener página actual al navegar back
?page=3&pageSize=50
```

**React Query integración:**
```typescript
// Paginación server-side con React Query
const { data, isLoading } = useQuery({
  queryKey: ['albaranes', { page: currentPage, pageSize }],
  queryFn: () => fetchAlbaranes({ page: currentPage, pageSize })
})
```

---

## 🗑️ Componente Global: Modal de Confirmación de Eliminación

> **Scope:** Global compartido (`src/shared/components/DeleteConfirmationModal`)
> **Uso:** Todas las pantallas con funcionalidad de eliminación (Albaranes, Clientes, Tarifas)

### Propósito

**Prevenir pérdida accidental de datos:**
- Confirmar antes de eliminar registros
- Mensaje claro y específico
- Advertencia de irreversibilidad
- Botones diferenciados (Cancelar vs Eliminar)

---

### Estructura Visual

**Modal centrado:**
```
┌─────────────────────────────────────┐
│  ⚠️  Eliminar albarán #1234         │ ← Header con icono de advertencia
├─────────────────────────────────────┤
│                                     │
│  ¿Estás seguro de que deseas        │
│  eliminar el albarán #1234?         │
│                                     │
│  Esta acción no se puede deshacer.  │ ← Advertencia en rojo/naranja
│                                     │
├─────────────────────────────────────┤
│                                     │
│       [Cancelar]    [Eliminar]      │ ← Botones touch-friendly
│                                     │
└─────────────────────────────────────┘
```

**Elementos:**
1. **Icono de advertencia (⚠️):** Visual prominente
2. **Título descriptivo:** "Eliminar [entidad] [identificador]"
3. **Pregunta de confirmación:** Específica al registro
4. **Advertencia de irreversibilidad:** Texto destacado
5. **Botones de acción:** Cancelar (secundario) + Eliminar (destructivo)

---

### Especificaciones Técnicas

**Tamaño del modal:**
- 📱 **Móvil:** 90% ancho, altura automática
- 📐 **Tablet/Desktop:** 400-500px ancho, altura automática
- 🎯 **Max-width:** 500px
- 📏 **Padding interno:** 20-24px

**Touch targets:**
- 📏 **Botones:** Mínimo 44px altura, padding 12-16px
- 📐 **Gap entre botones:** 12-16px
- 🎨 **Ancho botones:**
  - Móvil: Full-width stack vertical
  - Desktop: Inline, ancho automático (mínimo 120px cada uno)

**Tipografía:**
- 🔤 **Título:** 18-20px, font-weight 600
- 🔤 **Pregunta:** 14-16px, font-weight 400
- 🔤 **Advertencia:** 13-14px, font-weight 500
- 🔤 **Botones:** 14-16px, font-weight 500

**Colores:**
- 🎨 **Icono advertencia:** Naranja/Amarillo (#F59E0B o similar)
- 🎨 **Título:** Gris oscuro/Negro
- 🎨 **Advertencia:** Rojo/Naranja (#DC2626 o similar)
- 🎨 **Botón Cancelar:** Gris (secundario)
- 🎨 **Botón Eliminar:** Rojo (#DC2626), hover más oscuro
- 🎨 **Backdrop:** rgba(0,0,0,0.5) semitransparente

**Estados visuales:**
- **Modal abierto:** Fade-in animation, backdrop
- **Botón Hover:** Color más oscuro
- **Botón Active/Touch:** Efecto ripple
- **Botón Focus:** Outline visible
- **Loading (eliminando):** Spinner en botón Eliminar, disabled ambos botones

---

### Variantes por Entidad

**1. Eliminar Albarán:**
```
⚠️  Eliminar albarán #1234

¿Estás seguro de que deseas eliminar el albarán #1234?

Esta acción no se puede deshacer.

[Cancelar]    [Eliminar]
```

**2. Eliminar Cliente:**
```
⚠️  Eliminar cliente

¿Estás seguro de que deseas eliminar el cliente "Empresa S.A."?

⚠️ ADVERTENCIA: Si eliminas este cliente, también se eliminarán
todos sus albaranes asociados (15 albaranes).

Esta acción no se puede deshacer.

[Cancelar]    [Eliminar]
```

**3. Eliminar Tarifa:**
```
⚠️  Eliminar tarifa

¿Estás seguro de que deseas eliminar la tarifa "Mano de Obra Básica"?

⚠️ ADVERTENCIA: Si eliminas esta tarifa, se perderá la referencia
en 8 albaranes que la utilizan.

Esta acción no se puede deshacer.

[Cancelar]    [Eliminar]
```

**4. Eliminar Pieza de Albarán (inline editing):**
```
⚠️  Eliminar pieza

¿Estás seguro de que deseas eliminar esta pieza del albarán?

Esta acción no se puede deshacer.

[Cancelar]    [Eliminar]
```

---

### Comportamiento

**Al abrir modal:**
1. Backdrop fade-in
2. Modal slide-in desde centro
3. Focus automático en botón "Cancelar" (acción segura por defecto)
4. Trap focus dentro del modal (accesibilidad)

**Botón "Cancelar":**
- Click → Cierra modal sin eliminar
- Tecla `Escape` → Mismo efecto
- Devuelve focus al elemento que abrió el modal

**Botón "Eliminar":**
1. Click → Cambia a estado loading
2. Muestra spinner en botón: "Eliminando..."
3. Ejecuta acción de eliminación
4. **Si éxito:**
   - Cierra modal
   - Muestra toast: "Albarán #1234 eliminado correctamente"
   - Actualiza lista (recarga o elimina de UI)
5. **Si error:**
   - Mantiene modal abierto
   - Muestra mensaje de error arriba de botones
   - Botón vuelve a estado normal
   - Usuario puede reintentar o cancelar

**Click en backdrop:**
- Cierra modal (mismo efecto que Cancelar)
- **Alternativa:** No cerrar (forzar decisión explícita) - Más seguro

**Tecla Escape:**
- Cierra modal (mismo efecto que Cancelar)

---

### Responsive

**Móvil (< 640px):**
```
┌─────────────────────┐
│  ⚠️  Eliminar       │
│  albarán #1234      │
├─────────────────────┤
│  ¿Estás seguro...?  │
│                     │
│  Esta acción no se  │
│  puede deshacer.    │
├─────────────────────┤
│  [Cancelar]         │ ← Stack vertical
│  [Eliminar]         │   (full-width)
└─────────────────────┘
```
- Botones full-width, stack vertical
- Cancelar arriba, Eliminar abajo
- Modal ocupa 90% del ancho

**Tablet/Desktop (≥ 640px):**
```
┌────────────────────────────┐
│  ⚠️  Eliminar albarán #1234│
├────────────────────────────┤
│  ¿Estás seguro...?         │
│                            │
│  Esta acción no se puede   │
│  deshacer.                 │
├────────────────────────────┤
│      [Cancelar] [Eliminar] │ ← Inline horizontal
└────────────────────────────┘
```
- Botones inline, alineados a la derecha
- Cancelar a la izquierda, Eliminar a la derecha
- Modal ancho fijo 400-500px

---

### Accesibilidad (WCAG 2.1 AA)

**Navegación por teclado:**
- ⌨️ **Tab:** Navega entre botones
- ⏎ **Enter:** Activa botón enfocado
- 🔙 **Escape:** Cierra modal (Cancelar)
- 🎯 **Focus inicial:** Botón "Cancelar" (acción segura)
- 🔒 **Focus trap:** Focus no sale del modal

**Semántica HTML:**
```html
<div
  role="alertdialog"
  aria-labelledby="delete-title"
  aria-describedby="delete-description"
  aria-modal="true"
>
  <h2 id="delete-title">
    <span aria-hidden="true">⚠️</span>
    Eliminar albarán #1234
  </h2>

  <div id="delete-description">
    <p>¿Estás seguro de que deseas eliminar el albarán #1234?</p>
    <p class="warning">Esta acción no se puede deshacer.</p>
  </div>

  <div>
    <button type="button" autoFocus>Cancelar</button>
    <button type="button" class="danger">Eliminar</button>
  </div>
</div>

<div class="backdrop" aria-hidden="true"></div>
```

**Screen readers:**
- `role="alertdialog"` → Anuncia como diálogo de advertencia
- `aria-modal="true"` → Indica que es modal
- `aria-labelledby` → Conecta con título
- `aria-describedby` → Conecta con descripción
- `autofocus` en "Cancelar" → Focus en acción segura
- Icono ⚠️ con `aria-hidden="true"` (decorativo, texto ya es claro)

**Contraste:**
- 🎨 Mínimo 4.5:1 para texto
- 🎨 Botón "Eliminar": Contraste alto con fondo rojo

**Prevención de errores (WCAG):**
- ✅ Confirmación antes de acción irreversible
- ✅ Mensaje claro de consecuencias
- ✅ Focus en acción segura (Cancelar) por defecto

---

### Ubicación del Botón de Eliminar

**Pantallas donde aparece:**

1. **Listar Albaranes (tabla):**
   - 🗑️ Icono en columna "Acciones" por fila
   - Touch: 44x44px mínimo
   - Click → Abre modal de confirmación

2. **Pantalla Albarán (detalle):**
   - 🗑️ Botón "Eliminar albarán" en header o footer
   - Color rojo/destructivo
   - Click → Abre modal de confirmación

3. **Tabla de Piezas (inline editing):**
   - 🗑️ Icono por fila en columna "Acciones"
   - Click → Abre modal de confirmación de pieza

4. **Listar Clientes (tabla):**
   - 🗑️ Icono en columna "Acciones"
   - Click → Abre modal con advertencia de albaranes asociados

5. **Pantalla Cliente (detalle):**
   - 🗑️ Botón "Eliminar cliente" en footer
   - Click → Abre modal con advertencia de albaranes

6. **Listar Tarifas (tabla):**
   - 🗑️ Icono en columna "Acciones"
   - Click → Abre modal con advertencia de referencias

7. **Pantalla Tarifa (detalle):**
   - 🗑️ Botón "Eliminar tarifa" en footer
   - Click → Abre modal con advertencia de referencias

---

### Integración en el Sistema

**Componente compartido:**
- `src/shared/components/DeleteConfirmationModal/DeleteConfirmationModal.tsx`
- `src/shared/components/DeleteConfirmationModal/DeleteConfirmationModal.test.tsx`
- `src/shared/components/DeleteConfirmationModal/useDeleteConfirmation.ts`

**Hook de uso:**
```typescript
// En cualquier componente
const {
  isOpen,
  openConfirmation,
  closeConfirmation,
  confirmDelete
} = useDeleteConfirmation({
  onConfirm: async (id) => {
    await deleteAlbaran(id)
  },
  onSuccess: () => {
    showToast('Albarán eliminado correctamente')
  },
  onError: (error) => {
    showToast('Error al eliminar: ' + error.message, 'error')
  }
})

// Botón eliminar
<button onClick={() => openConfirmation(albaran.id)}>
  🗑️ Eliminar
</button>

// Modal
<DeleteConfirmationModal
  isOpen={isOpen}
  title="Eliminar albarán #1234"
  message="¿Estás seguro de que deseas eliminar el albarán #1234?"
  warning="Esta acción no se puede deshacer."
  onCancel={closeConfirmation}
  onConfirm={confirmDelete}
/>
```

**Estado global (opcional con Zustand):**
```typescript
// src/shared/stores/uiStore.ts
interface UIStore {
  deleteModal: {
    isOpen: boolean
    entityType: 'albaran' | 'cliente' | 'tarifa'
    entityId: string
    entityName?: string
    relatedCount?: number
  } | null
  openDeleteModal: (config) => void
  closeDeleteModal: () => void
}
```

---

## ✅ Sistema Global: Reglas de Validación de Formularios

> **Scope:** Global compartido (`src/shared/utils/validation`, `src/shared/components/Form`)
> **Aplicación:** Todos los formularios de la aplicación

### Principios de Validación

**Objetivos:**
1. **Prevenir errores:** Detectar problemas antes de enviar
2. **Guiar al usuario:** Mensajes claros y accionables
3. **No interrumpir flujo:** Validar en momento apropiado
4. **Consistencia:** Mismo comportamiento en toda la app

---

### Cuándo Validar

**Regla general:**
```
Campo individual    → Validar ON BLUR (al salir del campo)
Formulario completo → Validar ON SUBMIT (al enviar)
```

#### 1. Validación ON BLUR (por campo)

**Momento:** Al salir del campo (perder focus)

**Qué validar:**
- ✅ Formato (email, teléfono, etc.)
- ✅ Longitud (mínimo/máximo caracteres)
- ✅ Campos requeridos (si está vacío)
- ✅ Patrón (regex, caracteres permitidos)

**Comportamiento:**
```
1. Usuario escribe en campo
2. Usuario hace Tab o click fuera (blur)
3. → Validación se ejecuta
4. → Si hay error: Mostrar mensaje debajo del campo
5. → Si es válido: No mostrar nada (o icono ✓ opcional)
```

**NO validar on blur:**
- ❌ Mientras el usuario está escribiendo (on change)
- ❌ En el primer focus (antes de escribir)

**Excepción - Validación on change (después del primer blur):**
- Después del primer blur con error
- → Validar en tiempo real (on change) para dar feedback inmediato
- Ayuda al usuario a saber cuándo corrigió el error

#### 2. Validación ON SUBMIT (formulario completo)

**Momento:** Al hacer click en "Guardar" / "Crear" / "Enviar"

**Qué validar:**
- ✅ Todos los campos (por si saltaron alguno)
- ✅ Validaciones cruzadas (ej: fecha fin > fecha inicio)
- ✅ Reglas de negocio (ej: mínimo 1 pieza en albarán)

**Comportamiento:**
```
1. Usuario hace click en "Guardar"
2. → Validación completa del formulario
3. → Si hay errores:
   - Prevenir envío
   - Mostrar mensaje general arriba: "Por favor, corrige los errores"
   - Scroll al primer campo con error
   - Focus en primer campo con error
   - Mostrar todos los errores en cada campo
4. → Si todo válido:
   - Mostrar loading en botón
   - Enviar formulario
```

---

### Tipos de Validación por Campo

#### Campos de Texto

**Nombre, Descripción, etc.:**
- **Requerido:** "Este campo es obligatorio"
- **Longitud mínima:** "Mínimo 3 caracteres"
- **Longitud máxima:** "Máximo 100 caracteres"
- **Validar on blur**

#### Email

**Formato:**
- **Requerido:** "El email es obligatorio"
- **Formato inválido:** "Formato de email inválido (ejemplo@dominio.com)"
- **Validar on blur**

**Regex sugerido:**
```javascript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

#### Teléfono

**Formato:**
- **Requerido:** "El teléfono es obligatorio"
- **Formato inválido:** "Formato de teléfono inválido (9 dígitos)"
- **Validar on blur**

**Regex sugerido (España):**
```javascript
/^[6-9]\d{8}$/
```

#### Números (Cantidad, Precio, etc.)

**Formato:**
- **Requerido:** "Este campo es obligatorio"
- **No es número:** "Debe ser un número válido"
- **Mínimo:** "El valor mínimo es 0"
- **Máximo:** "El valor máximo es 999999"
- **Decimales:** Permitir punto y coma (normalizar internamente)
- **Validar on blur**

#### Fechas

**Formato:**
- **Requerido:** "La fecha es obligatoria"
- **Formato inválido:** "Formato de fecha inválido (DD/MM/YYYY)"
- **Fecha pasada:** "La fecha no puede ser anterior a hoy" (si aplica)
- **Fecha futura:** "La fecha no puede ser posterior a hoy" (si aplica)
- **Validar on blur**

#### Selects / Dropdowns

**Selección:**
- **Requerido:** "Debes seleccionar una opción"
- **Validar on change** (inmediatamente al seleccionar)

#### Checkboxes

**Aceptación:**
- **Requerido:** "Debes aceptar los términos"
- **Validar on change** (inmediatamente al marcar/desmarcar)

---

### Mensajes de Error

**Ubicación:**
- 📍 Debajo del campo afectado
- 📏 Alineado a la izquierda
- 📐 Margen top: 4-8px

**Estilo visual:**
- 🎨 **Color:** Rojo (#DC2626 o similar)
- 🔤 **Font-size:** 12-14px
- 📝 **Icono opcional:** ⚠️ o ❌
- 🎨 **Campo con error:** Borde rojo (2px)

**Formato del mensaje:**
```
❌ Formato de email inválido (ejemplo@dominio.com)
```

**Tono:**
- ✅ Claro y específico
- ✅ Accionable (qué hacer para corregir)
- ❌ NO técnico ni vago
- ❌ NO culpar al usuario

**Ejemplos buenos:**
- ✅ "El email es obligatorio"
- ✅ "Formato de email inválido (ejemplo@dominio.com)"
- ✅ "Mínimo 3 caracteres"
- ✅ "El precio debe ser mayor que 0"

**Ejemplos malos:**
- ❌ "Error"
- ❌ "Valor inválido"
- ❌ "regex_validation_failed"
- ❌ "Has cometido un error en este campo"

---

### Estados Visuales de Campos

**1. Estado Normal (sin interacción):**
```
[ Campo de texto           ]
```
- Borde gris claro
- Sin mensaje

**2. Estado Focus (usuario escribiendo):**
```
[ Campo de texto|          ]
```
- Borde azul/acento primario
- Sin mensaje todavía

**3. Estado Error (después de blur):**
```
[ Campo de texto           ]  ← Borde rojo
❌ Formato de email inválido
```
- Borde rojo (2px)
- Mensaje de error debajo
- Fondo rojo muy claro (opcional)

**4. Estado Válido (opcional):**
```
[ Campo de texto           ]  ← Borde verde
✓ (icono verde opcional)
```
- Borde verde (1px) - opcional
- Icono ✓ verde - opcional
- **Recomendación:** NO mostrar estado válido para evitar ruido visual
- **Excepción:** Campos críticos (contraseñas, confirmación email)

**5. Estado Disabled:**
```
[ Campo de texto           ]  ← Gris, cursor not-allowed
```
- Background gris claro
- Texto gris
- No editable

---

### Validaciones Cruzadas

**Ejemplos:**

**1. Rango de fechas:**
```
Fecha inicio: 01/01/2024
Fecha fin:    31/12/2023  ← Error

❌ La fecha fin debe ser posterior a la fecha inicio
```

**2. Confirmación de contraseña:**
```
Contraseña:           ********
Confirmar contraseña: *******  ← Error

❌ Las contraseñas no coinciden
```

**3. Cantidad mínima (albarán):**
```
Piezas: (vacío)  ← Error en formulario

❌ Debes añadir al menos una pieza al albarán
```

**Cuándo validar:**
- On submit (validación completa)
- On blur del segundo campo (si primer campo ya tiene valor)

---

### Mensaje General de Error (Formulario)

**Ubicación:**
- 📍 Arriba del formulario (antes del primer campo)
- 🎨 Background rojo claro
- 📏 Padding: 12-16px
- 🔘 Borde izquierdo rojo grueso (4px)

**Formato:**
```
┌─────────────────────────────────────────┐
│ ⚠️  Por favor, corrige los errores      │
│     antes de continuar.                 │
└─────────────────────────────────────────┘

[Campo con error 1]
❌ Error específico

[Campo con error 2]
❌ Error específico
```

**Comportamiento:**
- Aparece solo on submit si hay errores
- Scroll automático al mensaje
- Desaparece cuando todos los errores se corrigen

---

### Validación en Tiempo Real (Progressive Enhancement)

**Después del primer blur con error:**

```
1. Usuario escribe email mal: "test@"
2. Hace blur → ❌ "Formato de email inválido"
3. Vuelve al campo (focus)
4. Escribe: "test@example"
   → Todavía error (validación on change)
5. Escribe: "test@example.com"
   → ✓ Error desaparece (validación on change)
```

**Beneficio:**
- Feedback inmediato al corregir
- Usuario sabe cuándo el campo es válido
- Reduce frustración

---

### Accesibilidad (WCAG 2.1 AA)

**Semántica HTML:**
```html
<div class="form-field">
  <label for="email" id="email-label">
    Email
    <span aria-label="obligatorio">*</span>
  </label>

  <input
    type="email"
    id="email"
    name="email"
    aria-labelledby="email-label"
    aria-describedby="email-error"
    aria-invalid="true"
    aria-required="true"
  />

  <span id="email-error" role="alert" class="error">
    Formato de email inválido (ejemplo@dominio.com)
  </span>
</div>
```

**Atributos importantes:**
- `aria-invalid="true"` → Indica campo con error
- `aria-describedby` → Conecta mensaje de error con campo
- `aria-required="true"` → Indica campo obligatorio
- `role="alert"` → Screen reader anuncia error inmediatamente
- `aria-live="polite"` → Para mensajes dinámicos (validación en tiempo real)

**Navegación por teclado:**
- ⌨️ Tab/Shift+Tab → Navega entre campos
- ⏎ Enter en último campo → Submit (si es formulario simple)
- 🎯 Focus visible en campo activo

**Contraste:**
- 🎨 Texto de error: Mínimo 4.5:1 con fondo
- 🎨 Borde rojo: Mínimo 3:1 con fondo blanco

**Campos requeridos:**
- Visual: Asterisco `*` o texto "(obligatorio)"
- Programático: `aria-required="true"` o `required` attribute

---

### Casos Especiales

**1. Validación asíncrona (servidor):**

**Ejemplo:** Verificar si email ya existe

```
1. Usuario escribe email
2. Blur → Validación de formato (cliente) ✓
3. → Llamada al servidor (debounce 500ms)
4. → Spinner pequeño al lado del campo
5. → Respuesta servidor:
   - Si existe: ❌ "Este email ya está registrado"
   - Si no existe: ✓ Campo válido
```

**2. Validación condicional:**

**Ejemplo:** Campo "Otro" obligatorio solo si seleccionó "Otro" en dropdown

```javascript
if (tipoCliente === 'otro' && otroTexto === '') {
  error = 'Especifica el tipo de cliente'
}
```

**3. Formularios multipaso (wizard):**

```
Paso 1: Datos básicos    → Validar on submit del paso
Paso 2: Dirección        → Validar on submit del paso
Paso 3: Confirmación     → Validar todo on submit final
```

Validar cada paso antes de avanzar al siguiente

---

### Aplicación por Pantalla

**1. Login:**
- Email: On blur
- Contraseña: On blur
- Submit: Validación completa + error del servidor

**2. Albarán (Crear/Editar):**
- Cliente (select): On change
- Fecha: On blur
- Observaciones: On blur (opcional)
- Piezas (tabla inline): Validar cada fila on blur
- Submit: Validación completa (mínimo 1 pieza)

**3. Cliente (Crear/Editar):**
- Nombre: On blur (requerido, min 3 chars)
- Email: On blur (formato)
- Teléfono: On blur (formato)
- Dirección: On blur (opcional)
- Submit: Validación completa

**4. Tarifa (Crear/Editar):**
- Descripción: On blur (requerido, min 3 chars)
- Precio: On blur (número, min 0)
- Submit: Validación completa

---

### Integración en el Sistema

**Utilidades compartidas:**
- `src/shared/utils/validation/validators.ts` - Funciones de validación
- `src/shared/utils/validation/messages.ts` - Mensajes de error
- `src/shared/utils/validation/schemas.ts` - Schemas de validación (Zod recomendado)

**Componentes compartidos:**
- `src/shared/components/Form/FormField.tsx` - Campo con validación
- `src/shared/components/Form/FormError.tsx` - Mensaje de error
- `src/shared/components/Form/FormLabel.tsx` - Label con required indicator

**Hooks:**
```typescript
// src/shared/hooks/useFormValidation.ts
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isValid
} = useFormValidation({
  initialValues,
  validationSchema,
  onSubmit: async (values) => {
    // Submit logic
  }
})
```

**Librerías recomendadas:**
- **Validación:** Zod (TypeScript-first schema validation)
- **Forms:** React Hook Form (performance, DX)
- **Integración:** React Hook Form + Zod resolver

**Ejemplo con Zod:**
```typescript
import { z } from 'zod'

const clienteSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Formato de email inválido'),
  telefono: z.string().regex(/^[6-9]\d{8}$/, 'Formato de teléfono inválido'),
  direccion: z.string().optional()
})
```

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