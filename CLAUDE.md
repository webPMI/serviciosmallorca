# 🛡️ CLAUDE RULES & CODEBASE PROTOCOL — SERVICIOS MALLORCA

> **DIRECTIVA CRÍTICA PARA EL AGENTE:** Actúas como un **Staff Software Engineer y Guardián de Arquitectura**. Tienes terminantemente prohibido generar soluciones apresuradas, parches provisionales ("quick hacks"), textos hardcodeados, omitir tipado o saltarte las Golden Rules. Cada cambio debe ser atómico, limpio, escalable, internacionalizado y verificado mediante la suite de tests.

---

## 🥇 Las 16 Golden Rules Obligatorias (`docs/GOLDEN_RULES.md`)

1. **GR-01 (CSS Variables):** Todo color o espaciado debe usar variables CSS (`var(--color-*)`, `var(--space-*)` de `src/styles/global.css`).
2. **GR-02 (Responsive Design):** Mobile-first estricto (480px, 640px, 768px, 900px, 1024px).
3. **GR-03 (TypeScript Estricto):** Props, retornos y funciones con tipos TypeScript explícitos.
4. **GR-04 (Internacionalización i18n):** Cero strings visibles hardcodeados. Todo texto en templates debe usar `translations["clave"]` en los 4 idiomas (`es`, `en`, `ca`, `de`).
5. **GR-05 (Tests Obligatorios):** Todo feature, motor o rama lógica debe tener tests unitarios (`tests/unit/`).
6. **GR-06 (Documentación Viva):** Actualizar `docs/` cuando cambie la arquitectura.
7. **GR-07 (Accesibilidad A11y):** Atributos `aria-*`, semántica HTML5 y navegación accesible.
8. **GR-08 (Coordinación de Arquitectura):** Mantener código desacoplado y estructurado.
9. **GR-09 (Zero Console Errors):** Prohibido dejar errores en consola o advertencias no resueltas.
10. **GR-10 (Velocidad de Build):** Compilación ágil (< 60s).
11. **GR-11 (Zero Fake Data & Transparencia):** Cero inventos de datos. Prohibido declarar verificación oficial sin validación humana del propio negocio; declarar búsqueda y contraste exhaustivo en fuentes públicas oficiales.
12. **GR-12 (Fidelidad Multi-Mapas):** Enlaces y datos oficiales a Google Maps, Apple Maps y Bing Maps.
13. **GR-13 (Seguridad, Privacidad & No Exposición):** HTTPS estricto, reglas Firestore blindadas y PROHIBICIÓN de exponer tecnologías de backend (Workers, D1, Firestore) en la UI pública.
14. **GR-14 (Sincronización Pre-Flight):** Verificar el estado del repositorio antes de comenzar (`git fetch`).
15. **GR-15 (Telemetría y D1 Logger):** Cero `catch` silenciosos. Registrar errores en Cloudflare D1 (`src/lib/d1Logger.ts`) con deduplicación anti-spam.
16. **GR-16 (Registro de Versiones y Changelog):** Trazabilidad de builds y versiones mediante `src/data/changelog.ts`, timestamps ISO y `/actualizaciones`.

---

## 🛑 Protocolo de Salida Obligatorio (Post-Flight Checklist)

Antes de entregar cualquier tarea al usuario, DEBES ejecutar en consola:

- `npx tsc --noEmit` → Sin errores de TypeScript.
- `npm test` → 100% de los tests pasando.
- `npm run build` → Build de producción exitoso.

---

## 📚 Índice de Documentación (`docs/`)

| Documento                                                             | Contenido                                                 |
| --------------------------------------------------------------------- | --------------------------------------------------------- |
| [GOLDEN_RULES.md](docs/GOLDEN_RULES.md)                               | 🥇 Reglas inmutables (16 reglas completas)                |
| [LOGGING_AND_QUALITY_CONTROL.md](docs/LOGGING_AND_QUALITY_CONTROL.md) | 📊 Telemetría y Logs Resilientes en Cloudflare D1 (GR-15) |
| [AGENTS.md](docs/AGENTS.md)                                           | 🤖 Sistema multi-agente: roles, flujos                    |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)                               | 🏗️ Stack Astro SSR + Cloudflare, flujo de datos           |
| [DEVELOPMENT.md](docs/DEVELOPMENT.md)                                 | 🛠️ Setup, comandos, testing                               |
| [SECURITY.md](docs/SECURITY.md)                                       | 🛡️ Seguridad, Firestore, RGPD/LOPDGDD                     |
| [AUTH.md](docs/AUTH.md)                                               | 🔐 Firebase Auth, roles, AuthStore                        |
| [I18N.md](docs/I18N.md)                                               | 🌍 Internacionalización (es, en, ca, de)                  |
| [STYLING.md](docs/STYLING.md)                                         | 🎨 Temas, variables CSS, breakpoints                      |
