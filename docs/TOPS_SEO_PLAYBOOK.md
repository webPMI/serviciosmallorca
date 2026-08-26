# 🏆 Playbook: Tops, Destacados & Posicionamiento SEO — Servicios Mallorca

> **Documento maestro para convertir la vertical deportiva en autoridad #1 de la isla.** Define cómo se
> construyen y publican los **Tops** (motor automático + editoriales), qué criterios rigen los
> **destacados** (`featured`) y el **plan SEO/posicionamiento** a 90 días. Todo se apoya en la
> infraestructura real del repo y respeta **GR-11 (Zero Fake Data)**, **GR-12 (Fidelidad Maps)**,
> **GR-04 (i18n x3)** y **P-04** (nada vacío). Vertical deportiva: [`SPORTS_FITNESS_SECTION.md`](SPORTS_FITNESS_SECTION.md).

---

## 1. 🧠 Los dos motores de ranking (inventario real)

Existen **dos motores complementarios**. No confundirlos:

|                | 🖥️ Motor Runtime ("Top Engine AI")                | 📦 Motor de Descubrimiento (curación)                                 |
| -------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| Archivo        | `src/lib/topEngine.ts`                            | `scripts/rank-and-organize-businesses.ts` (`npm run rank:businesses`) |
| Qué clasifica  | Fichas **ya publicadas** (`SERVICES`) en vivo     | Candidatos del checklist (publicados y pendientes)                    |
| Para qué sirve | Alimentar la UI: home, hubs futuros y bloques Top | Priorizar qué curar/ingestar y triaje de calidad                      |
| Salida         | Cards con badge 🥇🥈🥉, score 0-100 y reasons     | `docs/BUSINESS_DISCOVERY_CHECKLIST.md/json` (Tiers S/A/B/…)           |

### 1.1 Fórmula del motor runtime (`calculateBusinessScore`)

| Criterio                   | Peso    | Normalización                                             | Por qué importa                         |
| -------------------------- | ------- | --------------------------------------------------------- | --------------------------------------- |
| Rating                     | **40%** | `(rating/5)*100`                                          | Señal pública de calidad                |
| Volumen de reseñas         | **25%** | `min(100, (reviews/400)*100)`                             | Consistencia social, anti-éxito puntual |
| Confidence Score           | **20%** | `confidenceScore` (o 90 si `verified`, 60 si no)          | Auditoría propia GR-11                  |
| Bonus calidad de contenido | **15%** | teléfono +25 · whatsapp +25 · horario +25 · galería≥3 +25 | Completeness de la ficha                |

Funciones disponibles (todas deterministas):

| Función                         | Uso previsto                                                                              | Badge                      |
| ------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------- |
| `getTopServicesByCategory(cat)` | Bloques "Top N" por categoría deportiva (hubs, landings)                                  | 🥇 Top #1 Sector / 🥈 / 🥉 |
| `getTopRankedServices(n)`       | Ranking global isla (home, llms.txt)                                                      | 👑 Top #1 Mallorca         |
| `getWeeklyCuratedTops()`        | "Top 3 de la Semana": rotación determinista semanal (`semana×3 % total`) sobre `verified` | ✨ Selección Semanal       |
| `getTopServicesByZone(zone)`    | Líderes por macro-zona                                                                    | Top #N `<zona>`            |

> 💡 La rotación semanal es **intencional**: refresca la home cada semana para usuarios y para que los
> crawlers de IA (GPTBot, ClaudeBot, PerplexityBot — ver `robots.txt.ts`) re-indexen contenido fresco.

### 1.2 Tiers del motor de descubrimiento (pre-publicación)

| Tier                          | Regla                         | Acción editorial                    |
| ----------------------------- | ----------------------------- | ----------------------------------- |
| **Tier S (TOP / Excelencia)** | rating ≥4.8 y ≥150 reseñas    | Candidato ideal a `featured` y Tops |
| **Tier A (Recomendado)**      | rating ≥4.8 con menos reseñas | Ingesta prioritaria                 |
| **Tier B (Estándar)**         | rating 4.0–4.7                | Ingesta normal                      |
| **Tier Novedad (🆕)**         | sin reseñas, confianza alta   | Ingesta con nota "nueva apertura"   |
| **Tier Triaje (🔒)**          | rating <3.0 o incidencias     | Nunca publicar sin revisión         |

---

## 2. 🥇 Cómo hacer un Top editorial (SOP `top_list`)

Los bloques del motor posicionan la home; los **posts `top_list` son los que capturan keywords**
("mejores gimnasios de Palma", "top campos de golf Mallorca"). Se publican como `BlogPost` en
`src/data/posts.ts` con `postType: "top_list"`.

> 🛑 **Regla previa (P-04 aplicada a Tops):** no se publica un Top de una categoría con **menos de 5
> fichas verificadas** publicadas. Un top con huecos destruye E-E-A-T. Si falta masa crítica, ingesta
> fichas primero (SOP de curación).

| Paso | Acción                                                                                                           | Validación                                 |
| ---- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1    | Elegir **keyword objetivo** del mapa §3.2 del doc deportivo; slug `top-<categoria>-<zona>-<año>`                 | Keyword con intención transaccional/local  |
| 2    | **Seed list** desde `getTopServicesByCategory()` + Checklist Tier S/A; solo fichas `verified` con teléfono real  | 0 candidatos sin verificar (GR-11)         |
| 3    | Ordenar por **score del motor**, nunca a mano ni por criterios comerciales ocultos                               | Orden reproducible ejecutando el motor     |
| 4    | Redactar en **es/en/ca/de**: intro con intención de búsqueda, tarjeta por negocio (datos de su ficha), FAQ breve | GR-04; datos idénticos a la ficha enlazada |
| 5    | Incluir bloque **"Metodología"** transparente: pesos de §1.1 y mención de `lastVerifiedAt`                       | E-E-A-T: criterios auditables públicamente |
| 6    | Cablear `BlogPost`: `postType:"top_list"`, `relatedServiceIds`, tags `zona:*`, año en título y refresh anual     | Enlace interno a TODAS las fichas del top  |
| 7    | Publicar, enviar a GSC (inspección URL) y difundir en canal editorial                                            | `npm run check` verde y URL indexable      |

**Estructura recomendada:** H1 keyword+año → contexto local → caja Metodología → cards #N..#1
(nombre, zona, rating/reseñas reales, diferencial, enlace a ficha) → FAQ 3-4 preguntas → CTA categorías.

> ♻️ **Cadencia:** los Tops llevan **año en el título** ("… 2026") y se refrescan al menos una vez al
> año y tras cada ingesta relevante. El refresh actualiza datos y fecha visible — Google premia
> frescura demostrable, no cosmética.

---

## 3. ⭐ Destacados (`featured`) — criterios y mecánica

El campo `featured: true` existe en `ServiceItem` y `BlogPost`. Es **manual y auditado** — nunca un
pago silencioso ni un capricho editorial.

**Checklist para marcar `featured: true` en una ficha deportiva:**

- [ ] Tier S o Tier A en el checklist de descubrimiento
- [ ] Los 5 pilares del SOP completos (social proof, storytelling, prensa, conversión, Local SEO)
- [ ] `gallery` ≥3 fotos reales (regla anti-stock) y `schedule` verificado
- [ ] `languagesSpoken` completo y `lastVerifiedAt` < 12 meses
- [ ] Sin historial en Triaje

**Reglas anti-abuso:**

1. La visibilidad diaria la da la **rotación semanal determinista**, no `featured` — la home rota entre
   todos los verificados y ningún negocio "compra" la portada.
2. Cualquier destacamento comercial deberá ir **etiquetado como publicidad** (LSSI/RGPD — ver
   `LEGAL_COMPLIANCE.md`). Mientras no exista ese producto, `featured` solo por mérito auditado.
3. Cuota inicial vertical deportiva: **máx 1 `featured` por categoría** hasta alcanzar ≥10 fichas.

---

## 4. 🔧 SEO técnico — inventario existente y checklist por página

### 4.1 Infraestructura ya desplegada (no reconstruir)

| Activo                          | Archivo                                                       | Estado |
| ------------------------------- | ------------------------------------------------------------- | ------ |
| Sitemap XML + Markdown          | `src/pages/sitemap.xml.ts` / `sitemap.md.ts`                  | ✅     |
| Robots con política crawlers IA | `src/pages/robots.txt.ts` (GPTBot, ClaudeBot, PerplexityBot…) | ✅     |
| Índice LLM + versión full       | `src/pages/llms.txt.ts` / `llms-full.txt`                     | ✅     |
| Manifest agentes + MCP card     | `.well-known/agents.json.ts` / `mcp/server-card.json`         | ✅     |
| Negociación Markdown            | cabecera `Accept: text/markdown`                              | ✅     |
| JSON-LD por ficha               | `src/lib/jsonLdGenerator.ts` (tipos deportivos YA mapeados)   | ✅     |
| Canonical + Open Graph          | `[...locale]/servicios/[slug].astro`, `index.astro`           | ✅     |

### 4.2 Checklist on-page por tipo de página

| Página                        | Title (patrón)                                       | JSON-LD obligatorio                  | Enlazado interno mínimo                        |
| ----------------------------- | ---------------------------------------------------- | ------------------------------------ | ---------------------------------------------- |
| Hub `/servicios/deporte` (F4) | "Deporte y Fitness en Mallorca \| Categorías y Tops" | `ItemList` de categorías + `WebSite` | → 12 categorías → tops → guías                 |
| Categoría deportiva           | "<Categoría> en Mallorca — Verificadas"              | `BreadcrumbList` + `ItemList`        | ← hub · → fichas · → top de la categoría       |
| Ficha `ServiceItem`           | "<Negocio> — <Zona>"                                 | tipo deportivo (§3.1 doc deportivo)  | → categoría · → zona · → top que lo incluya    |
| Post `top_list`               | "<Keyword> <Año>"                                    | `ItemList` + `FAQPage`               | → todas las fichas · → categoría · → hub       |
| Guía espacios públicos        | "Guía <espacio> <zona>"                              | `TouristAttraction` + `ItemList`     | → fichas cercanas · → categoría diferenciadora |

### 4.3 Backlog priorizado

| Estado                  | Mejora                                                                                                               | Archivo                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| ✅ **Hecho 2026-08-25** | `llms.txt` usa ya `getTopRankedServices(10)` (ranking real, posiciones `#N` + puntuación); test de regresión añadido | `src/pages/llms.txt.ts`, `tests/unit/topsSeoPlaybook.test.ts` |
| ✅ **Hecho 2026-08-25** | Posts `top_list` emiten `ItemList` con posiciones; corregido `publisher.url` del `BlogPosting` (.es → .com)          | `[...locale]/blog/[slug].astro`                               |
| 🟠 P1                   | `BreadcrumbList` global (fichas, categorías y blog)                                                                  | layouts                                                       |
| 🟠 P1                   | Hub deportivo (F4) renderizando bloques Top por categoría con `getTopServicesByCategory()`                           | páginas Astro nuevas                                          |
| 🟡 P2                   | OG image dinámica por ficha/top y feed RSS de guías                                                                  | layouts + `rss.xml.ts` nuevo                                  |

> ℹ️ El antiguo P0 (el índice LLM publicaba el orden del array como si fuera ranking) quedó resuelto y
> blindado con `tests/unit/topsSeoPlaybook.test.ts`: si alguien reintroduce `slice()`, los tests fallan.

---

## 5. 🚀 Plan de posicionamiento 90 días ("modo brutal")

### 5.1 Fases

| Fase                | Semanas | Acciones clave                                                                                                                                                                        |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Fundamentos**  | S1–S2   | F2: ingestar Golf Son Vida + Son Muntaner (§8 doc deportivo) y activar `golf`; aplicar fix P0 de llms.txt; verificar propiedad en GSC + Bing Webmaster; enviar sitemaps               |
| **2. Masa crítica** | S3–S6   | Ritmo 2–3 fichas deportivas/día (SOP 4 pasos); activar categorías según P-04; primer top editorial al llegar a 5 fichas en una categoría; bloques Top por zona en landings existentes |
| **3. Autoridad**    | S7–S12  | Guías de espacios públicos (backlog §2.12.3 doc deportivo); link building local: federaciones baleares, clubes, prensa deportiva, blogs ciclismo/triatlón; lanzar rankings anuales    |

### 5.2 Arquitectura de clusters keyword (hub & spoke)

```text
Hub /servicios/deporte ──► Categoría "gimnasios-fitness" ──► Fichas (spoke)
        │                        ▲                                    │
        ├── Top editorial "mejores gimnasios Palma 2026" ──────────────┤ (enlace bidireccional)
        ├── Guía "parques calistenia Palma" ──► categoría espacios públicos
        └── Zona "palma" ◄──── tags zona:* en todo el clúster
```

**Regla de oro interna:** toda página nueva entra en la malla con **≥3 enlaces internos contextuales**
(nunca huérfana) y recibe ≥1 enlace desde una página ya indexada el mismo día de publicarse.

### 5.3 KPIs de seguimiento (revisión mensual)

| Métrica                           | Objetivo 90 días                       | Fuente                      |
| --------------------------------- | -------------------------------------- | --------------------------- |
| URLs deportivas indexadas en GSC  | 100% de las publicadas                 | Google Search Console       |
| Keywords long-tail en top-3       | ≥20 (espacios públicos + nichos EN/DE) | GSC + rank tracker gratuito |
| Impresiones vertical deportiva    | Curva creciente mes a mes              | GSC                         |
| Crawls de bots IA sobre hubs/tops | ≥1 crawl/semana                        | logs del hosting            |
| Fichas deportivas publicadas      | ≥60 (a 3/día desde S3)                 | `SERVICES` + checklist      |

### 5.4 Apalancadores E-E-A-T propios (ventaja injusta vs competidores)

1. **`lastVerifiedAt` visible** en fichas y tops — nadie más enseña fecha de auditoría.
2. **Metodología pública** de ranking (pesos de §1.1 citados dentro de cada top).
3. **Fuentes municipales citadas** en guías de espacios públicos (enlaces salientes de autoridad).
4. **Multilingüe real** es/en/ca/de — competencia casi nula en catalán y alemán para deporte local.
5. **Zero stock photos** — imágenes propias/licenciadas como señal de experiencia de primera mano.

---

## 6. ✅ Checklist relámpago antes de publicar cualquier Top

1. ¿Las 5+ fichas están `verified` y con teléfono real?
2. ¿El orden sale del motor (reproducible) y está citada la metodología?
3. ¿Hay `ItemList` schema y enlaces a todas las fichas?
4. ¿Trilingüe completo y año en el título?
5. ¿URL enviada a GSC y enlazada desde hub/categoría?

---

## 7. 📚 Relación con el resto de la documentación

- **[`SPORTS_FITNESS_SECTION.md`](SPORTS_FITNESS_SECTION.md)** — vertical deportiva: taxonomía, fases F0→F5 y minería.
- **[`AGENT_CURATION_SOP.md`](AGENT_CURATION_SOP.md)** — curación de las fichas que alimentan los tops.
- **[`BUSINESS_DISCOVERY_SOP.md`](BUSINESS_DISCOVERY_SOP.md)** — minería y priorización de candidatos.
- **[`MONETIZATION_GROWTH.md`](MONETIZATION_GROWTH.md)** — monetización (los tops son superficie premium futura, siempre etiquetada).
- **[`I18N.md`](I18N.md)** — flujo de traducciones para posts y filtros.
