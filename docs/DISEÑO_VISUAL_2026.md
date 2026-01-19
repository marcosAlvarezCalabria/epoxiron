# 🎨 Diseño Visual - Epoxiron MVP
> **Fecha:** 17 de Enero, 2026
> **Estilo:** Dark Mode Industrial / Clean UI
> **Framework:** Tailwind CSS v3

---

## 1. Paleta de Colores
Utilizamos una paleta oscura para reducir la fatiga visual en entornos de taller y ofrecer una estética profesional.

### Fondos (Backgrounds)
- **Main BG:** `bg-gray-900` (#111827) - Fondo principal de la aplicación.
- **Card BG:** `bg-gray-800` (#1F2937) - Fondo de tarjetas y paneles.
- **Input BG:** `bg-gray-900/50` - Fondo de campos de entrada.

### Acentos (Accents)
- **Primary Blue:** `text-blue-400` / `bg-blue-600` - Acciones principales, botones, enlaces.
- **Success Green:** `text-green-400` / `border-green-500` - Estados positivos, validaciones.
- **Warning Yellow:** `text-yellow-400` - Alertas no críticas inside.
- **Error Red:** `text-red-400` / `border-red-600` - Errores de validación, acciones destructivas.
- **Purple:** `text-purple-400` - Acentos secundarios para diferenciar tipos de datos (ej: m²).

---

## 2. Componentes UI

### Cards (Tarjetas)
El elemento principal de organización.
- Rounded Corners: `rounded-xl`
- Border: `border border-gray-700`
- Hover Effect: `hover:border-blue-500/50 hover:bg-gray-700/50 transition-all`

### Inputs (Campos de Entrada)
Diseñados para ser claros y legibles.
- Base: `bg-gray-900 border border-gray-600`
- Focus: `focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- Error: `border-red-500 focus:border-red-500`

### Chips / Tags
Utilizados para las "Piezas Especiales".
- Container: `bg-blue-900/30 border border-blue-700/50`
- Text: `text-blue-200`
- Action: Botón de cierre integrado (`×`)

---

## 3. Páginas Principales

### 🔐 Login Page
- **Layout:** Centrado vertical y horizontalmente.
- **Elementos:** Logo grande, formulario limpio de email/password.
- **Feedback:** Mensajes de error en rojo suave si fallan las credenciales.

### 👥 Customers Page (Gestión de Clientes)
- **Listado:** Tabla o Grid de tarjetas con búsqueda rápida.
- **Formulario de Cliente:**
  - **Datos Personales:** Inputs estándar (Nombre, Email, Teléfono, Dirección).
  - **Tarifas y Precios (NUEVO):**
    - **Tarjetas Visuales:** 3 grandes tarjetas para `Metro Lineal`, `Metro Cuadrado`, `Tarifa Mínima`.
    - **Iconos:** Regla (Lineal), Cuadrícula (Cuadrado), Moneda (Mínima).
    - **Input Gigante:** El precio se introduce en un campo grande central dentro de la tarjeta.
    - **Piezas Especiales:** Input tipo "Añadir + Enter" que genera Chips visuales.

### 📄 Delivery Notes Page (Albaranes)
- **Creador Inteligente:**
  - **Selección de Cliente:** Autocomplete.
  - **Tabla de Items:**
    - Columnas: Cantidad, Descripción, Color, Medidas (ml/m²).
    - **Cálculo en Tiempo Real:** Al introducir medidas, el sistema muestra el `Precio Unitario` calculado según la tarifa del cliente.
    - **Status:** Badges de estado (Borrador = Gris, Pendiente = Amarillo, Revisado = Verde).

---

## 4. Tipografía
- **Fuente Principal:** `Inter` o sistem default (Sans-serif).
- **Headings:** `font-bold text-gray-100`.
- **Labels:** `text-xs font-bold text-gray-400 uppercase tracking-wider`.
- **Precios/Números:** `font-mono` para alineación y legibilidad técnica.

---

## 5. Iconografía
- **Librería:** Heroicons (Outline & Solid).
- **Uso:** Iconos de 20px-24px (`w-5 h-5` / `w-6 h-6`) para acciones y navegación.
