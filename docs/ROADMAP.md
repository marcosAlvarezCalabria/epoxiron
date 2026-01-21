# 🗺️ Roadmap & Future Improvements

Este documento registra mejoras técnicas y funcionales planificadas para fases futuras del desarrollo de Epoxiron.

## 🚀 Mejoras de Arquitectura

### 1. Paginación en Servidor (High Priority)
Actualmente, la paginación se realiza en el cliente (`DeliveryNotesPage.tsx`). Esto es eficiente para < 1000 registros, pero no escalará indefinidamente.

**Plan de Migración:**
1.  **Backend (`api`):**
    *   Actualizar `findAll` en `deliveryNotesStorage` para aceptar `skip` y `take`.
    *   Implementar filtros de búsqueda (Prisma `where` conditions) en el backend, ya que la búsqueda en cliente dejaría de funcionar correctamente.
    *   Actualizar API Endpoint `GET /delivery-notes` para recibir query params (`?page=1&limit=25&search=...`).
    *   Devolver metadatos de paginación: `{ data: [...], meta: { total, page, lastPage } }`.
2.  **Frontend (`web`):**
    *   Actualizar `ApiDeliveryNoteRepository` para construir la URL con los parámetros.
    *   Actualizar `useDeliveryNotes` (React Query) para incluir `page` y `search` en la `queryKey` (`['deliveryNotes', page, search]`).
    *   Gestionar estados de carga (`isLoading`) al cambiar de página.

### 2. Tests End-to-End (E2E)
Implementar una suite básica con **Playwright** o **Cypress** para cubrir flujos críticos que los tests unitarios no capturan (como la persistencia real de datos en DB).
*   **Flow Crítico:** Login -> Crear Albarán -> Guardar -> Editar -> Verificar persistencia (ej. checkbox Grosor).

## 🛠️ Deuda Técnica Pendiente

-   **App.test.tsx**: Resolver el error de importación en `Navbar.tsx` que causa el fallo del test, aunque la aplicación funciona correctamente.
