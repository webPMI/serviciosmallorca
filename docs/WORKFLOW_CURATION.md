# 🎯 Protocolo de Curación Diaria, Inteligencia y Monetización

Este documento establece el flujo de trabajo editorial, las reglas de selección de negocios, la optimización técnica para buscadores e IA, y la estrategia de monetización de **Servicios Mallorca**.

---

## 1. Regla de Oro: Curación Diaria (Negocios Verificados con Cero Fake Data)

Cada jornada se seleccionan negocios reales con presencia consolidada en Mallorca cumpliendo con **GR-11** y **GR-12**:

### Criterios de Selección Obligatorios:

1. **Actividad Real y Horario Verificado:** El negocio debe estar 100% abierto y operativo en Google Maps, Apple Maps y web oficial.
2. **Reputación y Fiabilidad:** Valoración contrastada en plataformas oficiales con volumen significativo de opiniones reales.
3. **Minería de Inteligencia Previa:**
   - Ejecución obligatoria de `scripts/business-intelligence-lookup.ts "<Nombre>"`.
   - Extracción de menciones en prensa balear (_Diario de Mallorca_, _Última Hora_, _Mallorca Magazin_, _Majorca Daily Bulletin_, _ABC Mallorca_).
   - Detección de premios, certificaciones higiénico-sanitarias o galardones de convenciones.
4. **Clasificación por Identidad Cultural:**
   - Asignar `culturalIdentity` (`mallorquin_heritage`, `german_oriented`, `british_oriented`, `international_luxury`).
   - Identificar si es un imprescindible de la isla (`isIconicHeritage: true`).
5. **Control Estricto de Duplicados (Zero Duplication):**
   - Verificación de que no exista previamente en `src/data/services.ts` por teléfono, dominio web o coordenadas.

---

## 2. Optimización para Buscadores (SEO) y Motores de IA (GEO)

Para maximizar el tráfico orgánico desde Google, Bing, Perplexity, ChatGPT Search, Gemini y Claude:

1. **Datos Estructurados Schema.org Enriquecidos:**
   - `LocalBusiness` / `TattooParlor` con `address`, `telephone`, `url`, `priceRange`, `aggregateRating`, `openingHoursSpecification`, `geo` y `sameAs` (Google, Apple, Bing Maps y redes).
   - `BlogPosting` con `author`, `datePublished`, `headline`, `publisher`.
   - `BreadcrumbList` y `FAQPage` en guías y comparativas.
2. **Internacionalización y hreflang:**
   - Etiquetas `hreflang` para `es`, `ca` y `en` con URLs canónicas absolutas.
3. **Semántica HTML y Core Web Vitals:**
   - Jerarquía estricta (`h1` único por página, `h2`, `h3`).
   - Cero Cumulative Layout Shift (CLS): los bloques de anuncios tienen dimensiones mínimas reservadas.

---

## 3. Monetización con Google AdSense

Estructura de espacios publicitarios optimizados para alto CTR sin perjudicar la experiencia del usuario ni el rendimiento estático:

| Ubicación                       | Formato                | Estrategia                                                 |
| ------------------------------- | ---------------------- | ---------------------------------------------------------- |
| **Directorio de Servicios**     | In-feed Ad             | Integrado armónicamente entre las tarjetas de servicios    |
| **Artículo del Blog (Cuerpo)**  | Banner In-Article      | Tras el segundo párrafo para máxima visibilidad            |
| **Artículo del Blog (Sidebar)** | Sticky Rectangle       | Visible durante toda la lectura en pantallas de escritorio |
| **Footer / Bottom Banner**      | Leaderboard Responsivo | Cierre de página con baja intrusividad                     |
