# Post-Mortem de Incidente y Plan de Trabajo a Largo Plazo

## 1. Contexto del Incidente

- **Fecha**: 23 de Septiembre de 2026
- **Síntoma**: Pantalla en blanco sin logs visibles al intentar abrir fichas de negocios (ej. `clinica-psicologia-palma-mente-sana`).
- **Impacto**: Bloqueo del acceso a fichas de servicios y degradación del catálogo principal.
- **Estado**: **RESUELTO AL 100%**.

## 2. Causa Raíz

1. **Servicios huérfanos sin registrar**: 16 fichas de negocio existían como archivos `.ts` en subcarpetas de `src/data/services/`, pero no estaban importadas ni añadidas al array de servicios de su sector. Al no encontrarse por su slug, el enrutador ejecutaba una redirección 302 hacia `/es/servicios`.
2. **Crash en tiempo de ejecución en el catálogo**: En `/es/servicios`, servicios con horarios en formato objeto provocaban un error fatal `scheduleText.trim is not a function`, interrumpiendo el SSR de Astro y mostrando una respuesta vacía / 500.

## 3. Plan de Tareas Documentado para Trabajo a Largo Plazo

### Fase 1: Prevención Inmediata (Completada)

- [x] Normalizar formato de horarios en `src/lib/scheduleParser.ts` para tolerar objetos y cadenas.
- [x] Blindar componentes Astro (`LiveScheduleBadge.astro`, `index.astro`) contra tipos no primitivos.
- [x] Registrar e indexar los 16 servicios huérfanos con validación estricta de taxonomía y etiquetas.
- [x] Validar que `npm run typecheck`, `npm test` y `npm run build` pasan al 100%.

### Fase 2: Automatización y Control de Calidad Continuo (CI/CD)

- [x] **Linter de Ficheros Huérfanos**: Integrar un test unitario en `tests/unit/services.test.ts` que recorra todas las subcarpetas de `src/data/services/` y falle si algún `.ts` (excepto `index.ts`) no está exportado en el catálogo.
- [ ] **Validador de Esquema en Pre-commit**: Añadir hook de Husky que ejecute `validateServicesList` antes de permitir cualquier commit que modifique archivos de servicios.
- [x] **Fallback de Logging Local**: En `src/middleware.ts` y `src/lib/d1Logger.ts`, si D1 no está disponible (ej. en desarrollo local sin emulador Cloudflare), imprimir errores en consola estándar con formato legible en lugar de descartarlos silenciosamente.

### Fase 3: Optimización del Catálogo y SEO

- [ ] **Paginación / Virtualización del Catálogo**: La página `/es/servicios` actualmente genera más de 5 MB de HTML debido a que incluye más de 950 fichas simultáneamente. Implementar carga diferida o paginación por páginas estáticas/SSR para mejorar el Time To First Byte (TTFB).
- [ ] **Generación de Imágenes Faltantes**: Generar y alojar los assets de imagen correspondientes a los servicios recién registrados (`public/images/services/*.jpg`).
- [ ] **Pruebas E2E de Rutas de Negocio**: Añadir suite de Playwright / subagent de testing que navegue aleatoriamente por 50 fichas de negocio y compruebe códigos 200 y elementos del DOM visibles.
