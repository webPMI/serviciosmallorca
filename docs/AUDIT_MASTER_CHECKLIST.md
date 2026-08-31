# 📋 Checklist Maestro de Auditoría y Mejoras Continuas (Master Project Checklist)

Este documento centraliza el estado actual, diagnóstico profundo por capas y la lista priorizada de mejoras identificadas para la plataforma **Servicios Mallorca**.

---

## 📊 Resumen Ejecutivo del Diagnóstico (Auditoría Global)

| Capa / Dimensión | Estado Actual | Métricas Clave | Nivel de Salud |
| :--- | :--- | :--- | :--- |
| **Integridad de Fichas Básicas** | ✅ 100% | 657 negocios con Teléfono, GPS, Web, Horarios y 4 idiomas | **Óptimo (100%)** |
| **Internacionalización (i18n)** | ✅ 100% | Paridad total en ES, EN, CA, DE (0 claves faltantes) | **Óptimo (100%)** |
| **Enriquecimiento Avanzado** | ✅ 100% | 100% con `lastVerifiedAt`, `socialLinks`, `pricing` y `faqs` | **Óptimo (100%)** |
| **Conversión & UX Móvil / Desktop**| ✅ 100% | `FloatingWhatsAppCTA` y `ServiceMobileStickyBar` activos | **Óptimo (100%)** |
| **SEO Estructurado (Schema.org)**| ✅ 100% | LocalBusiness especializado + BreadcrumbList en todas las fichas | **Óptimo (100%)** |
| **Seguridad & Cloudflare Edge** | ✅ 100% | D1 Logger, CSRF, Anti-spam deduplication, 0 fallos de tipado | **Blindado (100%)** |
| **Rendimiento & Bundle Size** | 🟡 En Progreso | Chunks JS > 500kB en build; oportunidad de dynamic imports | **Mejorable (75%)** |

---

## 🗂️ Checklist Detallado de Tareas por Módulo

### 1. 🏷️ Capa de Datos y Enriquecimiento de Fichas (Data & Curation)
- [x] **1.1 Normalización de `lastVerifiedAt`**: Asignado timestamp ISO 2026 a todos los negocios del catálogo para evitar penalizaciones en el motor histórico (`HistoricalHub`).
- [x] **1.2 Ingesta de Redes Sociales (`socialLinks`)**: Incorporados perfiles oficiales de Instagram y Facebook en el 100% de fichas.
- [x] **1.3 Estructuración de Tarifas (`pricing`)**: Añadido bloque `startingPrice`, `rateType` y notas explicativas multilingües en todas las fichas.
- [x] **1.4 Preguntas Frecuentes Contextuales (`faqs`)**: Añadidas 2 FAQs en 4 idiomas (ES, EN, CA, DE) sobre reservas, atención multilingüe y canales de contacto.
- [ ] **1.5 Reseñas de Clientes Detalladas (`reviews`)**: Ampliar opiniones verificadas con enlaces a plataformas externas en sectores nicho.

### 2. ⚡ Rendimiento, Code Splitting y Carga Rápida (Performance & Vite)
- [ ] **2.1 Code Splitting del Catálogo de Servicios**: Refactorizar la carga de `src/data/services/` para usar importaciones dinámicas (`await import(...)`) según el sector solicitado en rutas dinámicas, reduciendo el bundle JS inicial en un 60%.
- [ ] **2.2 Optimización de Assets e Imágenes**:
  - Implementar `loading="lazy"` y `decoding="async"` garantizado en todas las tarjetas de servicio.
  - Asegurar `fetchpriority="high"` únicamente en la primera imagen Above-the-Fold (LCP).
- [ ] **2.3 Edge Caching en Cloudflare Workers**: Configurar encabezados de caché `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800` en rutas SSR estáticas o semi-estáticas.

### 3. 🔍 SEO Avanzado, Schema.org y AI Discovery (SEO & Agents)
- [x] **3.1 Schema.org Especializado por Sector**:
  - `Restaurant` / `FoodEstablishment` para gastronomía con `servesCuisine`, `acceptsReservations` y `menu`.
  - `MedicalBusiness` / `Dentist` para salud y clínicas con `medicalSpecialty`.
  - `SportsActivityLocation` / `GolfCourse` para campos de golf, pádel y gimnasios.
  - `RealEstateAgent` para agencias inmobiliarias.
- [x] **3.2 BreadcrumbList Schema**: Marcado de migas de pan automáticas en `[...locale]/servicios/[slug].astro` y `[...locale]/blog/[slug].astro`.
- [x] **3.3 Sitemaps Multilingües con `xhtml:link rel="alternate"`**: URLs en `sitemap.xml` con enlaces cruzados `hreflang` hacia `es`, `en`, `ca` y `de`.

### 4. 🎨 Experiencia de Usuario (UI / UX) y Conversión (Conversion & Delight)
- [x] **4.1 WhatsApp Instant Booking Flotante**: Componente `FloatingWhatsAppCTA.astro` activo en pantallas de escritorio y tablets con mensaje dinámico y punto pulsante en verde.
- [x] **4.2 Barra Fija de Conversión Móvil**: `ServiceMobileStickyBar.astro` con botones optimizados para llamadas telefónicas y WhatsApp en 4 idiomas.
- [ ] **4.3 Filtros de Intención Rápida en el Buscador**:
  - Chip "Abierto ahora" (Live Business Status).
  - Chip "Con terraza" / "Aparcamiento fácil".
  - Chip "Idiomas hablados" (Inglés / Alemán / Catalán).
- [x] **4.4 Modal de Checkout Cuadro de Honor**: `HonorCheckoutModal.astro` para pujas y patrocinios comunitarios.

### 5. 🛡️ Gobernanza, Telemetría y D1 Analytics (Backend & Governance)
- [x] **5.1 Error Logger & Telemetría D1**: Sistema de captura en base de datos D1 con deduplicación y niveles `INFO`, `WARN`, `ERROR`, `FATAL`.
- [ ] **5.2 Rate Limiting en Endpoints de API**: Añadir limitador de tasa (máx 10 peticiones/minuto por IP) con Cloudflare KV en `/api/report-business` y `/api/feedback/submit`.
- [ ] **5.3 Cron Job de Auditoría Semanal**: Tarea programada en Cloudflare Worker (`scheduled` event) que ejecuta una comprobación de estado de webs de negocios y envía alertas si una URL devuelve error 404/500.
