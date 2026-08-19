# 🛠️ Tools & Infrastructure - WebApp Starter

> **Guía completa de herramientas disponibles para los agentes.**

---

## 📋 Tabla de Contenido

1. [Scripts NPM](#scripts-npm)
2. [Linter & Formateador](#linter--formateador)
3. [Git Hooks](#git-hooks)
4. [TypeScript Strict](#typescript-strict)
5. [Testing](#testing)
6. [MCP Servers](#mcp-servers)
7. [Verificaciones Previas al Merge](#verificaciones-previas-al-merge)

---

## Scripts NPM

| Comando                | Descripción                                | Agente             |
| ---------------------- | ------------------------------------------ | ------------------ |
| `npm run dev`          | Inicia dev server en `localhost:4321`      | @frontend          |
| `npm run build`        | Build de producción (SSR)                  | @maestro           |
| `npm run preview`      | Preview del build                          | @maestro           |
| `npm test`             | Ejecuta tests unitarios (Vitest)           | @testing, @maestro |
| `npm run test:watch`   | Tests en modo watch                        | @testing           |
| `npm run lint`         | ESLint: revisa errores de código           | @todos             |
| `npm run lint:fix`     | ESLint: corrige errores automáticamente    | @todos             |
| `npm run format`       | Prettier: formatea todo el código          | @todos             |
| `npm run format:check` | Prettier: verifica formateo (CI)           | @todos             |
| `npm run typecheck`    | TypeScript: verifica tipos                 | @frontend          |
| `npm run check`        | Pipeline completo: lint + typecheck + test | @maestro           |

---

## Linter & Formateador

### ESLint (`.eslintrc.json`)

Reglas estrictas para TypeScript y Astro:

- `no-console`: warn (error en CI)
- `no-unused-vars`: error (con `argsIgnorePattern: ^_`)
- `no-explicit-any`: warn
- `prefer-const`: error
- `eqeqeq`: error (siempre usar ===)

**Exclusiones:**

- `public/**/*.js`: sin restricciones (vanilla JS standalone)
- `tests/**/*.ts`: permite console.log y any

### Prettier (`.prettierrc`)

Formateo consistente:

- `semi: true` (punto y coma obligatorio)
- `singleQuote: false` (comillas dobles)
- `trailingComma: all` (coma al final de objetos/arrays)
- `printWidth: 120`
- Plugin para `.astro`

---

## Git Hooks

### Pre-commit (`.husky/pre-commit`)

Ejecuta `lint-staged` automáticamente antes de cada commit:

```json
{
  "*.{ts,astro}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

### Pre-push

Configurable para ejecutar `npm test` antes de push.

---

## TypeScript Strict

`tsconfig.json` hereda de `astro/tsconfigs/strict` y añade:

- `noUnusedLocals: true` - error si hay variables no usadas
- `noUnusedParameters: true` - error si hay parámetros no usados
- `isolatedModules: true` - cada archivo es un módulo independiente
- `forceConsistentCasingInFileNames: true`

**Exclusiones:** `dist`, `node_modules`, `.astro`, `public`

---

## Testing

### Vitest

```bash
npm test           # Todos los tests
npx vitest run     # Sin cache
npx vitest --ui    # Interfaz visual (si está instalada)
```

**Archivos de test:**

- `tests/unit/i18n.test.ts` - Utilidades i18n (9 tests)
- `tests/unit/theme.test.ts` - Sistema de temas (3 tests)
- `tests/unit/scrollAwareNavbar.test.ts` - Comportamiento scroll-aware del Navbar

### Escribir Tests (Guía para @testing)

```typescript
import { describe, it, expect } from "vitest";

describe("MiComponente", () => {
  it("debe hacer X cuando Y", () => {
    expect(resultado).toBe(esperado);
  });
});
```

---

## MCP Servers

Los MCP (Model Context Protocol) servers permiten a los agentes interactuar con servicios externos.

### Instalación

1. Ejecutar `load_mcp_documentation` para ver la guía
2. Crear el servidor en `C:\Users\ink.enzo\Documents\Cline\MCP\`
3. Añadir la configuración en `cline_mcp_settings.json`

### MCP Servers Recomendados

| Servidor           | Utilidad                                         | Agente              |
| ------------------ | ------------------------------------------------ | ------------------- |
| **Astro MCP**      | `astro check`, `astro build`, `astro dev` status | @frontend, @maestro |
| **GitHub MCP**     | PRs, issues, commits, code review                | @maestro, @docs     |
| **Firebase MCP**   | Admin SDK, Firestore queries, auth               | @auth               |
| **Playwright MCP** | Tests e2e, screenshots, auditorías               | @testing            |

---

## Verificaciones Previas al Merge

### Pipeline del Agente Maestro

Antes de aceptar cualquier cambio, el Agente Maestro debe ejecutar:

```bash
# 1. Lint (sin errores)
npm run lint

# 2. Type check (sin errores)
npm run typecheck

# 3. Tests (todos pasando)
npm test

# 4. Build (sin errores)
npm run build
```

### Checklist de Auditoría (Golden Rules)

```
[ ] GR-01: ¿Todos los colores usan variables CSS?
[ ] GR-02: ¿El componente es responsive?
[ ] GR-03: ¿Props y funciones tienen tipos TypeScript?
[ ] GR-04: ¿Textos visibles usan i18n?
[ ] GR-05: ¿Hay tests para el nuevo código?
[ ] GR-06: ¿Está documentado en docs/?
[ ] GR-07: ¿Elementos interactivos tienen aria-*?
[ ] GR-08: ¿Pasó la revisión del Agente Maestro?
[ ] GR-09: ¿Build sin errores? ¿npm test 100%?
[ ] GR-10: ¿Build time < 60s?
```

---

## Resumen por Agente

| Agente        | Herramientas clave                                       |
| ------------- | -------------------------------------------------------- |
| **@frontend** | `npm run dev`, `lint`, `lint:fix`, `typecheck`, `format` |
| **@styling**  | `format`, `format:check` (solo CSS)                      |
| **@devtools** | `format` (solo public/), `lint` (ignorado por config)    |
| **@testing**  | `npm test`, `npm run test:watch`                         |
| **@docs**     | `format` (solo .md), `lint` (ignorado)                   |
| **@auth**     | `lint`, `lint:fix`, `typecheck`                          |
| **@maestro**  | `npm run check`, `npm run build`, auditoría GR-01-10     |
