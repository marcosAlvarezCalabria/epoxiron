# Git Workflow - Epoxiron Project

## 🌳 Branch Strategy (Git Flow Simplificado)

```
main (producción)
  ├── develop (desarrollo)
  │   ├── feature/nombre-feature
  │   ├── bugfix/nombre-bug
  │   ├── hotfix/nombre-hotfix
  │   └── refactor/nombre-refactor
```

### Branches principales:

- **main**: Código en producción, siempre estable
- **develop**: Integración de features, listo para próximo release

### Branches temporales:

- **feature/**: Nuevas funcionalidades
- **bugfix/**: Corrección de bugs
- **hotfix/**: Corrección urgente en producción
- **refactor/**: Refactorización de código

---

## 📝 Conventional Commits

Todos los commits deben seguir el formato:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types permitidos:

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Cambios de formato (no afectan lógica)
- **refactor**: Refactorización (no fix ni feat)
- **perf**: Mejora de rendimiento
- **test**: Añadir o modificar tests
- **build**: Cambios en build/dependencias
- **ci**: Cambios en CI/CD
- **chore**: Tareas de mantenimiento

### Scopes sugeridos:

- **domain**: Domain Layer
- **application**: Application Layer
- **infrastructure**: Infrastructure Layer
- **presentation**: Presentation Layer
- **api**: Backend API
- **web**: Frontend Web
- **auth**: Authentication
- **albaranes**: Albaranes feature
- **clientes**: Clientes feature
- **tarifas**: Tarifas feature

### Ejemplos:

```bash
feat(albaranes): add slide-out panel for piece editing
fix(auth): correct session timeout calculation
docs(readme): update installation instructions
refactor(domain): extract validation logic to Value Objects
test(clientes): add integration tests for customer CRUD
perf(infrastructure): optimize database queries with indexes
```

---

## 🔄 Workflow Completo

### 1. Crear nueva branch desde develop

```bash
# Actualizar develop
git checkout develop
git pull origin develop

# Crear nueva feature branch
git checkout -b feature/add-calculator-component

# O para bugfix
git checkout -b bugfix/fix-login-validation
```

### 2. Desarrollar y hacer commits

```bash
# Hacer cambios...

# Commit siguiendo Conventional Commits
git add .
git commit -m "feat(presentation): add floating calculator component"

# Más commits...
git commit -m "test(presentation): add calculator component tests"
git commit -m "docs(readme): document calculator usage"
```

### 3. Mantener branch actualizado

```bash
# Traer cambios de develop
git fetch origin develop
git rebase origin/develop

# Si hay conflictos, resolverlos y continuar
git rebase --continue
```

### 4. Push a remoto

```bash
# Primera vez
git push -u origin feature/add-calculator-component

# Siguientes veces
git push
```

### 5. Crear Pull Request

1. **Ir a GitHub**
2. **Crear PR** desde tu branch hacia `develop`
3. **Completar template** de PR (se auto-completa)
4. **Esperar checks automáticos**:
   - ✅ Lint checks
   - ✅ Type checks
   - ✅ Tests
   - ✅ Build
   - ✅ Copilot review
5. **Asignación automática** de reviewers (CODEOWNERS)
6. **Review por humano** + Copilot

### 6. Revisión y merge

```bash
# Si reviewer pide cambios
git checkout feature/add-calculator-component
# Hacer cambios...
git add .
git commit -m "fix(presentation): address PR review comments"
git push

# Cuando PR es aprobado, mergear desde GitHub UI
# Se usa "Squash and merge" para commits limpios
```

### 7. Limpiar branches locales

```bash
# Volver a develop
git checkout develop
git pull origin develop

# Eliminar branch local
git branch -d feature/add-calculator-component

# Eliminar branch remota (opcional, GitHub lo hace automático)
git push origin --delete feature/add-calculator-component
```

---

## 🚀 Workflow por Tipo de Cambio

### Feature Nueva

```bash
# 1. Branch desde develop
git checkout develop
git pull origin develop
git checkout -b feature/albaranes-export-pdf

# 2. Desarrollar (TDD)
# - Crear tests primero (tdd-test-first agent)
git commit -m "test(albaranes): add tests for PDF export"

# - Implementar feature
git commit -m "feat(albaranes): add PDF export functionality"

# 3. PR a develop
gh pr create --base develop --title "feat(albaranes): add PDF export" --fill
```

### Bug Fix

```bash
# 1. Branch desde develop
git checkout develop
git pull origin develop
git checkout -b bugfix/fix-tarifa-calculation

# 2. Reproducir bug con test
git commit -m "test(tarifas): add failing test for calculation bug"

# 3. Fix bug
git commit -m "fix(tarifas): correct price calculation for special pieces"

# 4. PR a develop
gh pr create --base develop --title "fix(tarifas): correct price calculation" --fill
```

### Hotfix (Producción)

```bash
# 1. Branch desde main
git checkout main
git pull origin main
git checkout -b hotfix/critical-auth-fix

# 2. Fix crítico
git commit -m "fix(auth): prevent token expiration crash"

# 3. PR a main Y develop
gh pr create --base main --title "hotfix(auth): prevent token crash" --fill
gh pr create --base develop --title "hotfix(auth): prevent token crash" --fill
```

---

## 👥 Roles del Equipo

### @marcos (Tech Lead)

- Revisa todos los PRs
- Aprueba merges a `main`
- Gestiona releases
- Configura CI/CD

### @frontend-dev

- Revisa PRs de frontend
- Foco en UI/UX
- Accesibilidad
- Performance React

### @backend-dev

- Revisa PRs de backend
- Foco en arquitectura
- Domain Layer crítico
- Performance DB

### @qa-engineer

- Revisa tests
- Valida funcionalidad
- Smoke tests
- Regresión

### GitHub Copilot (Automático)

- Revisa cada PR automáticamente
- Chequea arquitectura
- Detecta patrones
- Sugerencias de seguridad

---

## ✅ Checklist Pre-PR

Antes de crear un PR, verifica:

- [ ] Código sigue guías de estilo (ESLint pasa)
- [ ] TypeScript sin errores (tsc --noEmit pasa)
- [ ] Tests añadidos/actualizados
- [ ] Tests pasan (npm test)
- [ ] Build exitoso (npm run build)
- [ ] Commits siguen Conventional Commits
- [ ] Branch actualizado con develop/main
- [ ] Sin conflictos
- [ ] Sin archivos no relacionados
- [ ] Sin console.log / debugger
- [ ] Documentación actualizada

---

## 🏷️ Labels Automáticos

Los PRs se etiquetan automáticamente:

- **frontend**: Cambios en web/src
- **backend**: Cambios en api/src
- **domain**: Cambios en domain layer
- **tests**: Cambios en tests
- **documentation**: Cambios en docs
- **size/XS|S|M|L|XL**: Tamaño del PR

---

## 🎯 Buenas Prácticas

### DO ✅

- Commits pequeños y atómicos
- Un commit = un concepto
- Mensajes descriptivos
- PRs pequeños (< 500 líneas idealmente)
- Tests antes de implementar (TDD)
- Actualizar branch con develop frecuentemente
- Resolver conflictos localmente
- Revisar tus propios cambios antes de PR

### DON'T ❌

- Commits masivos ("fix everything")
- Mensajes vagos ("fix", "update")
- PRs gigantes (> 1000 líneas)
- Código sin tests
- Push a main directamente
- Merge sin approval
- Dejar console.log
- Comentar código (eliminarlo)

---

## 🔍 Revisión de PRs

### Como Autor

1. **Auto-review**: Revisa tus cambios antes de crear PR
2. **Descripción clara**: Usa el template
3. **Screenshots**: Si cambios visuales
4. **Tests**: Asegura que pasan
5. **Responde rápido**: A comentarios de reviewers

### Como Reviewer

1. **Lee descripción**: Entiende el contexto
2. **Chequea arquitectura**: Clean Architecture + DDD
3. **Lee código**: No solo scan superficial
4. **Prueba localmente**: Si es crítico
5. **Comentarios constructivos**: Explica el "por qué"
6. **Aprueba cuando**: Todo checklist OK

---

## 📊 Métricas de Calidad

Se monitorean:

- **PR size**: Preferir < 500 líneas
- **Time to merge**: < 24h ideal
- **Review comments**: Engagement del equipo
- **CI/CD success rate**: Debe ser > 95%
- **Test coverage**: Meta > 80%

---

## 🆘 Troubleshooting

### Conflictos en rebase

```bash
# Durante rebase
git status  # Ver conflictos
# Resolver manualmente
git add .
git rebase --continue

# Si todo sale mal
git rebase --abort
```

### PR rechazado por CI

```bash
# Ver logs en GitHub Actions
# Fix localmente
git commit -m "fix(ci): resolve linting errors"
git push
# CI se re-ejecuta automáticamente
```

### Olvidé algo en el último commit

```bash
# Si NO has hecho push
git add archivo-olvidado.ts
git commit --amend --no-edit

# Si YA hiciste push
git add archivo-olvidado.ts
git commit -m "fix(scope): add missing file"
git push
```

---

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Pull Requests](https://docs.github.com/en/pull-requests)
- [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

---

**Última actualización:** 2026-01-10
