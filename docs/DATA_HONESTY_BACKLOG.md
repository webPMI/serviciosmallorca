# 🛑 BACKLOG PRIORITARIO · Honestidad de Datos Multi-Mapa (GR-11 / GR-12)

> **PRIORIDAD: P0 — CRÍTICO / IMPORTANTE DE ARREGLAR**
> **Fecha de detección:** 2026-09-27 · **Fix de pipeline:** commit `7c43418` · **Remediación:** `remediate-data-honesty.mjs` · **Estado:** `COMPLETADO (953/953 fichas limpias, 0 search_fake)`

---

## 1. Resumen ejecutivo

La auditoría automática (`scripts/audit-data-honesty.mjs`) detectó un **problema sistémico de
datos fabricados** en la base de datos de negocios:

| Métrica                                                                                            | Valor                                                                       |
| :------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| Fichas analizadas                                                                                  | **954**                                                                     |
| Fichas con ≥1 URL de Google/Apple/Bing Maps **fabricada** (búsqueda genérica en vez de ficha real) | **952 (99,8 %)**                                                            |
| Google Maps — URLs reales vs. fabricadas                                                           | 125 reales / **827 fabricadas**                                             |
| Apple Maps — URLs reales vs. fabricadas                                                            | **0 reales / 952 fabricadas**                                               |
| Bing Maps — URLs reales vs. fabricadas                                                             | 90 reales / **862 fabricadas**                                              |
| Fichas que atribuyen reseñas a plataformas sin ficha real                                          | **123**                                                                     |
| Fichas limpias al inicio                                                                           | **2** (una de ellas ahora es `ink-enzo-tattoo-mallorca` tras su corrección) |

**Conclusión:** el problema NO es un caso aislado (no era solo inkEnzo). El patrón de
"URLs de maps inventadas + desglose de reseñas inflado" estaba **generalizado** porque lo
**obligaba y lo generaba la propia tubería de datos**, no un descuido puntual.

---

## 2. Causa raíz (ya corregida en `7c43418`)

1. **Test que obligaba las URLs:** `tests/unit/services.test.ts` exigía
   `googleMapsUrl`/`appleMapsUrl`/`bingMapsUrl` en TODA ficha → todo negocio sin ficha real
   recibía una URL falsa para "pasar el test".
2. **Validador que lo reforzaba:** `src/lib/validateServices.ts` emitía error
   "Enlace oficial de Google/Apple/Bing Maps requerido" si faltaban.
3. **Scripts generadores que las fabricaban:** `scripts/add-service.ts`,
   `scripts/mass-curator.ts` y `scripts/rank-and-organize-businesses.ts` autogeneraban
   `https://www.google.com/maps/search/?api=1&query=…` (y equivalentes Apple/Bing) y
   valores por defecto inventados (`reviewCount ?? 50`, `rating ?? 4.8`).

**Corrección aplicada (commit `7c43418`):**

- URLs de mapas ahora **opcionales** (tipos, validador y test con invariantes GR-11).
- Los 3 scripts **ya no generan URLs ni datos de reputación inventados**.
- `ink-enzo-tattoo-mallorca` corregido como **ficha patrón de honestidad** (ver §5).

---

## 3. Impacto real del problema

| Superficie           | Efecto del dato falso                                                                                                                |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **SEO / Schema.org** | `jsonLdGenerator` emite `AggregateRating` con `reviewCount` y `ratingValue` inventados (visible para Google).                        |
| **UI pública**       | `MapsRatingBox` mostraba "Ficha Comercial Activa" / botón "Ver Ficha en Google Maps" hacia una **búsqueda genérica** (no una ficha). |
| **Ranking interno**  | `topEngine` puntuaba popularidad con `reviewCount` inflado → ordenamientos distorsionados.                                           |
| **Confianza / RGPD** | Cifras inventadas = riesgo reputacional y de prácticas engañosas (GR-11 es regla inmutable).                                         |

---

## 4. Plan de remediación (fases)

### Fase 1 · Triaje automático por sector (herramienta: auditor)

```bash
node scripts/audit-data-honesty.mjs            # resumen global
node scripts/audit-data-honesty.mjs --json     # listado íntegro de casos (campo offenders)
```

Clasificación por URL:

- `listing` → ficha real (se conserva; solo verificar 1 vez al año).
- `search_fake` / `invalid` → **candidato a corrección** (este backlog).
- `absent` → ya honesto (sin ficha: la UI muestra "Sin ficha").

### Fase 2 · Curación por negocio (responsable: `@curation`, SOP v2.0)

Para cada ficha con `search_fake` (952):

1. **Verificar existencia real de ficha** con
   `scripts/business-intelligence-lookup.ts "<Nombre>"` y fuentes oficiales
   (`docs/OFFICIAL_SOURCES_AND_CITIZEN_INTELLIGENCE.md`).
2. **Si hay ficha real** → sustituir por la URL canónica de la ficha
   (Google `https://www.google.com/maps/place/…` o `cid=…`, Apple/Bing equivalentes).
3. **Si NO hay ficha** → **eliminar** los campos `*MapsUrl` y `reputationBreakdown`,
   y marcar las reseñas como `platform: "direct"` (patrón §5).
4. Recalcular `reviewCount` = número real de reseñas verificables (nunca inventado).

### Fase 3 · Barrera CI (vigilar que no reaparezca)

- `npm test` ya incluye invariantes GR-11 nuevos (tests: "keeps map listing URLs honest",
  "does not attribute map-platform reviews…", "keeps declared reviewCount honest…").
- Incluir `node scripts/audit-data-honesty.mjs` en la re-auditoría trimestral.

### Fase 4 · Definición de hecho (Definition of Done)

- [x] `Fichas limpias = 953` (auditor sin flags).
- [x] `search_fake = 0` y `invalid = 0`.
- [x] Ninguna reseña `google_maps`/`bing_maps` sin referencia URL real.
- [x] Ningún `reputationBreakdown` con totales inventados > `reviewCount` real.
- [x] `npx tsc --noEmit` + `npm test` + `npm run validate:taxonomy` + `npm run build` ✅.

---

## 5. Ficha patrón de honestidad: `ink-enzo-tattoo-mallorca`

Corregida por completo en `7c43418` — copiar su estructura para el resto:

- ❌ Sin `googleMapsUrl`/`appleMapsUrl`/`bingMapsUrl` (no tiene ficha → se muestra "Sin ficha").
- ❌ Sin `reputationBreakdown` con conteos inventados.
- ✅ `reviewCount: 4` con `reviews[].platform = "direct"` (origen real).
- ✅ `ratingSource` / `reviewCountSource`: `website_direct`.
- ✅ 7 imágenes propias reales (`.webp` de `inkenzo.com`) — nunca fotos de otros negocios.
- ✅ Sin premios/`webDirectories`/`sourceCrossReference` atribuidos a plataformas sin ficha.

---

## 6. Referencias

- Auditor: `scripts/audit-data-honesty.mjs` (nuevo, commit `7c43418`)
- Reglas: `docs/GOLDEN_RULES.md` (GR-11 Zero Fake Data, GR-12 Multi-Mapas) ·
  `docs/AGENT_CURATION_SOP.md` (SOP v2.0) · `docs/BUSINESS_DISCOVERY_SOP.md`
- Trazabilidad: `src/data/changelog.ts` (v0.06.1, 2026-09-27)
