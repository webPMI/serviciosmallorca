# 🤖 Protocolo Estándar de Operación (SOP) para Agentes: Registro y Curación de Negocios

> **Objetivo:** Garantizar que cualquier agente que agregue o actualice negocios lo haga de forma **100% verídica (Zero Fake Data - GR-11)**, **optimizada en consumo de tokens**, **modular** y **sin errores de compilación**.

---

## ⚡ Regla de Oro de Eficiencia de Tokens

> **PROHIBIDO:** No quemar tokens de IA realizando búsquedas web abiertas iterativas, ni solicitando al modelo que invente o suponga direcciones, horarios, teléfonos o reseñas.
>
> **MÉTODO OBLIGATORIO:** Utilizar siempre el script CLI local `scripts/business-intelligence-lookup.ts`, que ejecuta la extracción multimedia, detección de redes y resolución de mapas en un solo subproceso local de alto rendimiento.

---

## 🗺️ La Ruta de 5 Pasos del Agente

```
┌────────────────────────────────────────────────────────┐
│ 1. MINERÍA AUTOMATIZADA CON EL SCRIPT CLI             │
│    npx tsx scripts/business-intelligence-lookup.ts     │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. RESOLUCIÓN MULTI-MAPAS & REPUTACIÓN PONDERADA       │
│    Google Maps, Apple Maps, Bing Maps + Reseñas        │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. TAXONOMÍA ESTRICTA & IDENTIDAD CULTURAL             │
│    CATEGORIES + MALLORCA_ZONES + TAG_CATALOG           │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. INSERCIÓN MODULAR                                   │
│    src/data/services/<sector>.ts                       │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 5. VERIFICACIÓN Y VALIDACIÓN AUTOMATIZADA              │
│    npm run typecheck && npm test && npm run validate   │
└────────────────────────────────────────────────────────┘
```

---

### 🔹 Paso 1: Minería Automatizada con el CLI Oficial

El agente debe ejecutar el comando CLI pasando el nombre del negocio y su web oficial:

```bash
npx tsx scripts/business-intelligence-lookup.ts "Nombre del Negocio Palma" --url="https://weboficial.com"
```

**Lo que el script genera automáticamente:**

1. **Multimedia:** Extrae `og:image`, favicon oficial y galería de fotos en alta resolución.
2. **Redes Sociales:** Detecta Instagram, Facebook, TikTok y YouTube.
3. **Enlaces de Navegación:** Genera URLs de Google Maps, Apple Maps y Bing Maps.
4. **Directorios Baleares:** Enlaces a Páginas Amarillas, Cylex, ABC Mallorca y TripAdvisor.
5. **JSON Estructurado:** Plantilla TypeScript completa lista para usar.

---

### 🔹 Paso 2: Resolución de Multi-Mapas, Reputación y Reseñas

El agente revisa la plantilla JSON y completa con precisión:

- **Coordenadas GPS reales:** Latitud y longitud dentro de Mallorca (ej. `lat: 39.5714, lng: 2.6534`).
- **Horario Operativo Real (`schedule`):** Ej. `"Mar - Vie: 14:00 - 20:00 (Cita previa)"`.
- **Agregador Multi-Plataforma (`reputationBreakdown`):**
  ```typescript
  reputationBreakdown: {
    googleMaps: { rating: 5.0, reviewCount: 148, url: "https://..." },
    bingMaps:   { rating: 5.0, reviewCount: 14,  url: "https://..." },
    totalReviewsAggregated: 162,
    overallWeightedRating: 5.0
  }
  ```
- **Reseñas Reales de Clientes (`reviews`):** 1 a 3 testimonios representativos con autor, fecha, idioma, plataforma y `verifiedCustomer: true`.

---

### 🔹 Paso 3: Taxonomía e Identidad Cultural

Todo negocio debe cumplir con el catálogo cerrado:

1. **Categoría Principal (`category`):** Debe existir en `src/data/categories.ts` (ej. `"arte-tatuajes"`, `"nautica-charter"`, `"gastronomia-restaurantes"`).
2. **Zona (`zone`):** Debe existir en `src/data/zones.ts` (ej. `"palma"`, `"calvia"`, `"andratx"`, `"alcudia"`).
3. **Identidad Cultural (`culturalIdentity`):**
   - `mallorquin_heritage`: Negocio clásico o emblemático de la isla.
   - `german_oriented`: Orientado a la comunidad/turismo alemán (Deutsche Community).
   - `british_oriented`: Orientado a público angloparlante.
   - `international_luxury`: Enfoque internacional cosmopolita de alta gama.
   - `local_spanish`: Tradición nacional.
4. **Etiquetas (`tags`):** Formato `dominio:valor` existentes en `src/data/tags.ts`:
   - Geográficas: `"zona:palma"`, `"zona:santa-catalina"`.
   - Estilo/Producto: `"product:fine-line"`, `"product:realismo"`, `"product:piercing-titanio"`.
   - Modalidad: `"mod:cita-previa"`, `"mod:walk-in"`, `"mod:en-local"`.

---

### 🔹 Paso 4: Inserción Modular en el Catálogo

Para mantener la escalabilidad a miles de empresas:

1. **Abrir o crear el módulo sectorial** en `src/data/services/<sector>.ts`:
   - Ejemplo: `src/data/services/arte-tatuajes.ts`, `src/data/services/nautica.ts`.
2. **Agregar el objeto `ServiceItem`** al array exportado.
3. **Si es un módulo nuevo:** Importarlo y agregarlo en `src/data/services/index.ts`.

---

### 🔹 Paso 5: Validación Automática Obligatoria

Antes de dar por completada la tarea, el agente **DEBE** ejecutar la suite completa de verificación:

```bash
npm run typecheck && npm test && npm run validate:taxonomy && npm run build
```

**Criterios de Éxito:**

- ✅ **0 errores de TypeScript** (`tsc --noEmit`).
- ✅ **100% de tests unitarios superados** (Vitest).
- ✅ **Validación de taxonomía íntegra** (`validate-taxonomy.ts`).
- ✅ **Build de producción limpio en < 60s** (Astro).

---

## 📋 Checklist Rápido de 30 Segundos para Agentes

- [ ] ¿He ejecutado `business-intelligence-lookup.ts` en lugar de inventar datos?
- [ ] ¿Las coordenadas GPS apuntan exactamente a Mallorca?
- [ ] ¿La categoría y tags pertenecen al catálogo cerrado?
- [ ] ¿El horario y teléfono son 100% reales y verificados?
- [ ] ¿Tiene fotos reales o URLs oficiales sin roturas?
- [ ] ¿He insertado en el archivo modular `src/data/services/<sector>.ts`?
- [ ] ¿`npm test` y `npm run build` pasan con código de salida 0?
