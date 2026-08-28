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
- [I18N.md](docs/I18N.md) — 🌍 Internacionalización (4 idiomas)
- [AUTH.md](docs/AUTH.md) — 🔐 Firebase Auth, roles, AuthStore
- [LOGGING_AND_QUALITY_CONTROL.md](docs/LOGGING_AND_QUALITY_CONTROL.md) — 📊 Telemetría y Logs Resilientes en Cloudflare D1
- [DEVTOOLS.md](docs/DEVTOOLS.md) — 🛠️ Logger, Floating Button, DevTools Panel
- [AGENT_CURATION_SOP.md](docs/AGENT_CURATION_SOP.md) — 🤖 SOP v2.0 para Agentes: Analista de Inteligencia de Negocios, 4 fases, 5 Pilares, Checklist de salida
- [BUSINESS_DISCOVERY_SOP.md](docs/BUSINESS_DISCOVERY_SOP.md) — 🔎 Checklist Maestro: descubrimiento, minería y ranking por categoría/puntaje/alfabético (`npm run discover`, `npm run discover:mine`)
- [SPORTS_FITNESS_SECTION.md](docs/SPORTS_FITNESS_SECTION.md) — 🏋️ Vertical deportiva: gimnasios, centros deportivos y espacios públicos (taxonomía, SEO, plan de activación)
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
11. **GR-11**: Veracidad: Información y servicios 100% reales y verificados (Zero Fake Data)
12. **GR-12**: Fidelidad Google Maps: 90%+ re-indexación de datos oficiales (coordenadas, horarios, reseñas y multi-mapas)
13. **GR-13**: Seguridad del Usuario: RGPD, cabeceras HTTP y reglas Firestore blindadas
14. **GR-14**: Sincronización Continua con GitHub: Pre-flight `git fetch origin` y `git pull` obligatorio antes de iniciar o tras >12h sin sincronizar
15. **GR-15**: Telemetría, Logs Resilientes y Control de Calidad en Producción (Cloudflare D1)

## Protocolo de Curación Atómica (Cero Omisión)

Todo registro en `src/data/services/<sector>/<slug>.ts` debe cumplir estrictamente 4 pasos secuenciales:

1. **Fase 1 (Recolección):** Minería de datos con `scripts/business-intelligence-lookup.ts "<Name>"`.
2. **Fase 2 (Auditoría & Checkpoint):** Cruce telefónico, geolocalización en Mallorca y cálculo de Confidence Score ($\ge 80\%$).
3. **Fase 3 (Enriquecimiento):** Estructura completa de los 5 Pilares (Social Proof, Storytelling trilingüe, Prensa balear, Canales de conversión, Local SEO).
4. **Fase 4 (Registro & Tests):** Módulo individual y paso de la suite `npm run typecheck && npm test && npm run validate:taxonomy && npm run build`.

El proyecto se gestiona mediante agentes coordinados por un **Agente Maestro**:

| Agente      | Dominio                                                         |
| ----------- | --------------------------------------------------------------- |
| `@frontend` | `src/components/`, `src/pages/`, `src/layouts/`                 |
| `@styling`  | `src/styles/global.css`                                         |
| `@curation` | `src/data/services/`, `scripts/business-intelligence-lookup.ts` |
| `@devtools` | `public/devtools*.js`, `public/devtools.html`                   |
| `@testing`  | `tests/`                                                        |
| `@docs`     | `docs/`, `README.md`, `AGENTS.md`, `CLAUDE.md`                  |
| `@auth`     | `src/lib/`, `src/middleware.ts`                                 |

## Project Structure

```
src/
├── i18n/                    # Internationalization (es, en, ca, de)
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
