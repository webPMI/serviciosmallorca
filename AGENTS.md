## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Toda la documentación del proyecto está en `docs/`. Antes de trabajar en cualquier área, consulta:

- [GOLDEN_RULES.md](docs/GOLDEN_RULES.md) — 🥇 Reglas inmutables (obligatorio leer primero)
- [AGENTS.md](docs/AGENTS.md) — 🤖 Sistema multi-agente: roles, flujos de trabajo
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — 🏗️ Estructura del proyecto, stack, flujo de datos
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) — 🛠️ Setup, comandos, testing
- [TOOLS.md](docs/TOOLS.md) — 🛠️ Tools & infraestructura: ESLint, Prettier, Git Hooks, MCP
- [STYLING.md](docs/STYLING.md) — 🎨 Sistema de temas, variables CSS, breakpoints
- [I18N.md](docs/I18N.md) — 🌍 Internacionalización (3 idiomas)
- [AUTH.md](docs/AUTH.md) — 🔐 Firebase Auth, roles, AuthStore
- [DEVTOOLS.md](docs/DEVTOOLS.md) — 🛠️ Logger, Floating Button, DevTools Panel
- [email-templates.md](docs/email-templates.md) — 📧 Plantillas de correo Firebase

## Golden Rules (Resumen)

1. **GR-01**: Todo color/estilo usa variables CSS de `global.css`
2. **GR-02**: Responsive: breakpoints en 480/640/768/900/1024
3. **GR-03**: TypeScript estricto en Props y funciones
4. **GR-04**: Todo texto visible via i18n (`translations`)
5. **GR-05**: Todo feature con tests (`npm test`)
6. **GR-06**: Todo documentado en `docs/`
7. **GR-07**: Accesibilidad: aria-*, keyboard nav
8. **GR-08**: Agente Maestro coordina y audita cambios
9. **GR-09**: Zero console errors, build limpio
10. **GR-10**: Build < 60s en desarrollo local

## Multi-Agent System

El proyecto se gestiona mediante agentes coordinados por un **Agente Maestro**:

| Agente      | Dominio                                         |
| ----------- | ----------------------------------------------- |
| `@frontend` | `src/components/`, `src/pages/`, `src/layouts/` |
| `@styling`  | `src/styles/global.css`                         |
| `@devtools` | `public/devtools*.js`, `public/devtools.html`   |
| `@testing`  | `tests/`                                        |
| `@docs`     | `docs/`, `README.md`, `AGENTS.md`, `CLAUDE.md`  |
| `@auth`     | `src/lib/`, `src/middleware.ts`                 |

## Project Structure

```
src/
├── i18n/                    # Internationalization (es, en, ca)
├── layouts/
│   └── BaseLayout.astro    # Base layout (theme init + devtools init)
├── pages/
│   └── [...locale]/        # Locale-prefixed pages
├── styles/
│   └── global.css          # ALL styles (variables, themes, utilities)
├── components/             # Astro components
├── lib/                    # Firebase config, AuthStore
└── middleware.ts           # Locale detection + redirect

public/
├── devtools.html           # DevTools Panel (standalone)
├── devtools-floating.js    # Floating Button (draggable, context-aware)
└── devtools-logger.js      # Logger (intercepts console.*, buffer 500)
```
