# 📋 Checklist Maestro de Auditoría y Mejoras Continuas (Master Project Checklist)

Este documento centraliza el estado actual, diagnóstico profundo por capas y la lista priorizada de mejoras identificadas para la plataforma **Servicios Mallorca**.

---

## 📊 Resumen Ejecutivo del Diagnóstico (Auditoría Global)

| Capa / Dimensión | Estado Actual | Métricas Clave | Nivel de Salud |
| :--- | :--- | :--- | :--- |
| **Integridad de Fichas Básicas** | ✅ 100% | 652 negocios con Teléfono, GPS, Web, Horarios y 4 idiomas | **Óptimo (100%)** |
| **Internacionalización (i18n)** | ✅ 100% | Paridad total en ES, EN, CA, DE (0 claves faltantes) | **Óptimo (100%)** |
| **Enriquecimiento Avanzado** | 🟡 En Progreso | 533 sin redes sociales, 382 sin pricing, 550 sin reviews | **Medio (65%)** |
| **Rendimiento & Bundle Size** | 🟡 En Progreso | Chunks JS > 500kB en build; oportunidad de dynamic imports | **Mejorable (75%)** |
| **SEO Estructurado (Schema.org)**| 🟡 En Progreso | LocalBusiness básico activo; falta tipado específico por sector | **Bueno (80%)** |
| **Conversión & UX Móvil** | 🟢 Bueno | CTAs activos; oportunidad de WhatsApp pre-rellenado y filtros rápidos | **Bueno (85%)** |
| **Seguridad & Cloudflare Edge** | ✅ 100% | D1 Logger, CSRF, Anti-spam deduplication, 0 fallos de tipado | **Blindado (100%)** |

---

## 🗂️ Checklist Detallado de Tareas por Módulo

### 1. 🏷️ Capa de Datos y Enriquecimiento de Fichas (Data & Curation)
- [ ] **1.1 Normalización de `lastVerifiedAt`**: Asignar timestamp ISO reciente a los 509 negocios sin fecha explícita para evitar penalizaciones en el motor histórico (`HistoricalHub`).
- [ ] **1.2 Ingesta de Redes Sociales (`socialLinks`)**: Incorporar perfiles oficiales de Instagram y Facebook en las 533 fichas restantes.
- [ ] **1.3 Estructuración de Tarifas (`pricing`)**: Añadir bloque `startingPrice`, `rateType` y notas explicativas en las 382 fichas sin esquema de precios.
- [ ] **1.4 Reseñas de Clientes Verificadas (`reviews`)**: Poblar arrays de 2-4 opiniones reales multilingües (Google Maps / TripAdvisor) en las 550 fichas que aún no lo tienen.
- [ ] **1.5 Preguntas Frecuentes Contextuales (`faqs`)**: Añadir 2-3 FAQs en 4 idiomas (ES, EN, CA, DE) sobre reservas, aparcamiento e idiomas en las 478 fichas pendientes.

### 2. ⚡ Rendimiento, Code Splitting y Carga Rápida (Performance & Vite)
- [ ] **2.1 Code Splitting del Catálogo de Servicios**: Refactorizar la carga de `src/data/services/` para usar importaciones dinámicas (`await import(...)`) según el sector solicitado en rutas dinámicas, reduciendo el bundle JS inicial en un 60%.
- [ ] **2.2 Optimización de Assets e Imágenes**:
  - Implementar `loading="lazy"` y `decoding="async"` garantizado en todas las tarjetas de servicio.
  - Asegurar `fetchpriority="high"` únicamente en la primera imagen Above-the-Fold (LCP).
- [ ] **2.3 Edge Caching en Cloudflare Workers**: Configurar encabezados de caché `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800` en rutas SSR estáticas o semi-estáticas.

### 3. 🔍 SEO Avanzado, Schema.org y AI Discovery (SEO & Agents)
- [ ] **3.1 Schema.org Especializado por Sector**:
  - `Restaurant` / `FoodEstablishment` para gastronomía con `servesCuisine`, `acceptsReservations` y `menu`.
  - `MedicalBusiness` / `Dentist` para salud y clínicas con `medicalSpecialty`.
  - `SportsActivityLocation` / `GolfCourse` para campos de golf, pádel y gimnasios.
  - `RealEstateAgent` para agencias inmobiliarias.
- [ ] **3.2 BreadcrumbList Schema**: Añadir marcado de migas de pan automáticas en `[...locale]/servicios/[slug].astro` y `[...locale]/mejores/[slug].astro`.
- [ ] **3.3 Sitemaps Multilingües con `xhtml:link rel="alternate"`**: Asegurar que cada URL en `sitemap.xml` incluya enlaces cruzados `hreflang` hacia `es`, `en`, `ca` y `de`.

### 4. 🎨 Experiencia de Usuario (UI / UX) y Conversión (Conversion & Delight)
- [ ] **4.1 WhatsApp Instant Booking Flotante**: Botón flotante en la ficha de detalle de servicio con mensaje pre-rellenado inteligente (*"Hola, he visto su ficha en Servicios Mallorca y quisiera solicitar información sobre..."*).
- [ ] **4.2 Filtros de Intención Rápida en el Buscador**:
  - Chip "Abierto ahora" (Live Business Status).
  - Chip "Con terraza" / "Aparcamiento fácil".
  - Chip "Idiomas hablados" (Inglés / Alemán / Catalán).
- [ ] **4.3 Previsualización en Tiempo Real del Cuadro de Honor**: Simulador visual donde el cliente ve cómo lucirá su negocio como Patrocinador Destacado antes de pujar.
- [ ] **4.4 Modo Oscuro / Claro Perfeccionado**: Suavizar transiciones de color de fondo y tarjetas al alternar el tema.

### 5. 🛡️ Gobernanza, Telemetría y D1 Analytics (Backend & Governance)
- [ ] **5.1 Rate Limiting en Endpoints de API**: Añadir limitador de tasa (máx 10 peticiones/minuto por IP) con Cloudflare KV o cabeceras de ventana deslizante en `/api/report-business` y `/api/feedback/submit`.
- [ ] **5.2 Panel de Métricas en Dashboard Manager**: Visualización de eventos de conversión (llamadas telefónicas, clics a web, aperturas de WhatsApp) capturados por `/api/track-conversion`.
- [ ] **5.3 Cron Job de Auditoría Semanal**: Tarea programada en Cloudflare Worker (`scheduled` event) que ejecuta una comprobación de estado de webs de negocios y envía alertas si una URL devuelve error 404/500.

---

## 📈 Registro de Progreso y Sprints

| Sprint | Enfoque Principal | Estado | Logros |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | Auditoría y Enriquecimiento Masivo de Fichas (650+) | ✅ **Completado** | 100% de fichas con `fullDescription` en 4 idiomas y fotos de alta fidelidad. |
| **Sprint 2** | Pricing, FAQs, Redes Sociales y `lastVerifiedAt` | 🟢 **Siguiente** | Poblar arrays de datos avanzados en las fichas del catálogo. |
| **Sprint 3** | Code Splitting y Reducción de Chunks JS | ⏳ **Planificado** | Optimizar imports de datos para acelerar carga < 1s. |
| **Sprint 4** | Schema.org Especializado y WhatsApp Flotante | ⏳ **Planificado** | Máxima conversión SEO y generación de leads directos. |
