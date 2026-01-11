# Pull Request

## 📋 Descripción

<!-- Describe qué hace este PR y por qué es necesario -->

## 🔗 Issue relacionado

<!-- Enlaza el issue si existe: Closes #123 -->

## 🎯 Tipo de cambio

<!-- Marca con una X lo que aplique -->

- [ ] 🐛 Bug fix (cambio que corrige un issue)
- [ ] ✨ Nueva funcionalidad (cambio que añade funcionalidad)
- [ ] 💄 Cambios de UI/UX (cambios visuales sin lógica)
- [ ] ♻️ Refactoring (cambio que no corrige bug ni añade funcionalidad)
- [ ] 📝 Documentación (cambios solo en documentación)
- [ ] ✅ Tests (añade o modifica tests)
- [ ] 🔧 Configuración (cambios en config, build, etc.)
- [ ] ⚡️ Performance (mejora de rendimiento)
- [ ] ♿️ Accesibilidad (mejoras de a11y)

## 🧪 ¿Cómo se ha probado?

<!-- Describe las pruebas realizadas -->

- [ ] Tests unitarios pasan (`npm test`)
- [ ] Tests e2e pasan (si aplica)
- [ ] Probado en navegador (Chrome/Firefox/Safari)
- [ ] Probado en tablet (principal dispositivo objetivo)
- [ ] Probado en móvil
- [ ] Validación de accesibilidad (WCAG 2.1 AA)

## 📸 Screenshots / Videos

<!-- Si aplica, añade capturas de pantalla o videos -->

### Antes:
<!-- Screenshot del estado anterior -->

### Después:
<!-- Screenshot del nuevo estado -->

## ✅ Checklist

<!-- Marca con X las que hayas completado -->

### Código

- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado auto-revisión de mi código
- [ ] He comentado partes complejas del código
- [ ] He actualizado la documentación pertinente
- [ ] Mis cambios no generan nuevos warnings
- [ ] He añadido tests que prueban mi fix/feature
- [ ] Todos los tests nuevos y existentes pasan

### Clean Architecture

- [ ] He respetado la separación de capas (Domain, Application, Infrastructure, Presentation)
- [ ] Las dependencias fluyen hacia adentro (Dependency Rule)
- [ ] Domain Layer no tiene dependencias externas
- [ ] Use Cases están en Application Layer
- [ ] Repositorios están en Infrastructure Layer
- [ ] Componentes React están en Presentation Layer

### DDD (Domain-Driven Design)

- [ ] He usado Entities para objetos con identidad
- [ ] He usado Value Objects para objetos inmutables
- [ ] He validado datos en Value Objects/Entities
- [ ] He usado Domain Exceptions para errores de negocio

### UX/UI

- [ ] Touch targets mínimo 44x44px (tablet-first)
- [ ] Estados de loading implementados
- [ ] Estados de error manejados correctamente
- [ ] Empty states implementados
- [ ] Validación de formularios (on blur + on submit)
- [ ] Mensajes de error claros y accionables
- [ ] Breadcrumbs actualizados (si aplica)

### Accesibilidad (WCAG 2.1 AA)

- [ ] Contraste de color mínimo 4.5:1
- [ ] Navegación por teclado funciona
- [ ] Labels asociados a inputs
- [ ] ARIA attributes correctos
- [ ] Screen reader compatible
- [ ] Focus visible en elementos interactivos

### Git

- [ ] Branch creado desde `main` actualizado
- [ ] Commits siguen Conventional Commits
- [ ] Commit messages descriptivos
- [ ] No hay archivos no relacionados en el PR
- [ ] He hecho rebase/merge de main si hay conflictos

## 🚀 Deployment

<!-- Marca si este PR requiere acciones especiales -->

- [ ] Requiere migración de base de datos
- [ ] Requiere variables de entorno nuevas
- [ ] Requiere actualización de dependencias (`npm install`)
- [ ] Requiere limpiar cache/localStorage
- [ ] Cambios breaking (requiere versión mayor)

## 📚 Contexto adicional

<!-- Añade cualquier contexto adicional sobre el PR -->

## 👥 Reviewers

<!-- GitHub asignará automáticamente según CODEOWNERS -->

<!--
Asignación automática:
- Frontend changes: @frontend-dev
- Backend changes: @backend-dev
- Tests: @qa-engineer
- All changes: GitHub Copilot (auto-review)
-->

---

**Para el revisor:**

- [ ] El código es legible y mantenible
- [ ] La arquitectura es correcta
- [ ] Los tests cubren casos edge
- [ ] La documentación está actualizada
- [ ] No hay problemas de seguridad evidentes
- [ ] El rendimiento no se ve afectado negativamente
