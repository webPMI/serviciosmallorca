# 🚀 Plan Maestro de Ejecución y Escalabilidad (Production Roadmap v2.0)

Este documento contiene la hoja de ruta detallada para la construcción, el mantenimiento y la escalabilidad de la plataforma **Servicios Mallorca** en Cloudflare Workers Edge.

---

## 📊 Metodología de Gestión y Estados

- **[x] Completado**: Tarea implementada, auditada por tests unitarios y desplegada en producción.
- **[/] En Proceso**: Tarea en desarrollo activo en el sprint en curso.
- **[ ] Pendiente**: Tarea planificada con spec técnica definida.
- **Prioridades**: P0 (Inmediato / Crítico), P1 (Alto / Conversión), P2 (Medio / SEO & Rendimiento), P3 (Escala).

---

## 🏗️ Pilar 1: Arquitectura de Datos y Calidad del Catálogo (Data Core)

### 1.1 Curación e Integridad de Fichas (Zero Fake Data)
- [x] **Tarea 1.1.1 (P0):** Normalización de `fullDescription` en 4 idiomas (ES, EN, CA, DE > 180 caracteres) para el 100% de negocios (650+ servicios).
- [x] **Tarea 1.1.2 (P0):** Integración de `highlights` y `specialties` en 4 idiomas en todos los sectores.
- [x] **Tarea 1.1.3 (P0):** Normalización de `lastVerifiedAt` a timestamp ISO 2026 para garantizar 100% de confianza en `HistoricalHub`.
- [x] **Tarea 1.1.4 (P0):** Integración de esquemas de tarifas (`pricing`) y FAQs contextuales en 4 idiomas en todos los negocios.
- [x] **Tarea 1.1.5 (P1):** Asignación de `socialLinks` verificados (Instagram / Facebook) en el 100% del catálogo.

### 1.2 Motor de Auditoría y Verificación de Datos (Pipeline & Security)
- [x] **Tarea 1.2.1 (P0):** Suite de calidad `audit:quality` (Hard Gates: 0 dominios dummy, 0 imágenes rotas, 0 textos cortos).
- [x] **Tarea 1.2.2 (P0):** Sistema de telemetría y registro de errores en Cloudflare D1 (`d1Logger.ts`) con deduplicación inteligente anti-spam.
- [ ] **Tarea 1.2.3 (P2):** Cron job semanal de revalidación automática de URLs de negocios (detección 404/500).

---

## ⚡ Pilar 2: Rendimiento, Code Splitting y Carga Edge (Performance & Vite)

### 2.1 Optimización del Bundle y Carga Rápida
- [x] **Tarea 2.1.1 (P0):** Adaptador `@astrojs/cloudflare` con SSR híbrido y sesiones KV.
- [x] **Tarea 2.1.2 (P1):** Inyección de cabeceras de caché inmutable `Cache-Control` para assets `/_astro/*`.
- [ ] **Tarea 2.1.3 (P1):** Code Splitting dinámico (`dynamic import()`) del catálogo de servicios por sector para eliminar chunks > 500kB.
- [x] **Tarea 2.1.4 (P2):** Optimización LCP con `fetchpriority="high"` en la imagen principal y `loading="lazy"` garantizado en tarjetas.

---

## 🗺️ Pilar 3: Experiencia de Usuario, Conversión y UX Móvil (UX/UI & Growth)

### 3.1 Conversión y Contacto Directo (High-Impact Conversion)
- [x] **Tarea 3.1.1 (P0):** Botón flotante multilingüe de WhatsApp (`FloatingWhatsAppCTA.astro`) para contacto directo con mensaje pre-rellenado inteligente.
- [x] **Tarea 3.1.2 (P0):** Barra fija inferior de conversión en móviles (`ServiceMobileStickyBar.astro`) con llamadas y WhatsApp contextual.
- [x] **Tarea 3.1.3 (P0):** Sistema de subastas y reserva de puestos en el Cuadro de Honor (`HonorCheckoutModal.astro`).
- [x] **Tarea 3.1.4 (P1):** Chips de filtrado rápido en el buscador: *"Abierto ahora"*, *"Con terraza"*, *"Atención en inglés/alemán"*, *"Pet Friendly"*, *"Accesible PMR"*.

### 3.2 Motores Inteligentes de Recomendación y Comunidad
- [x] **Tarea 3.2.1 (P1):** Algoritmo de afinidad `SmartMatchEngine` para relacionar servicios complementarios.
- [x] **Tarea 3.2.2 (P1):** Muro de impulso comunitario y testimonios (`CommunityBoostWall.astro`).
- [x] **Tarea 3.2.3 (P1):** Rutas y Tours de Experiencia en Mallorca (`/tours/`).

---

## 🔍 Pilar 4: SEO Estructurado y AI Discovery (Schema.org & LLMs)

### 4.1 Indexación Semántica para Google y Motores de IA
- [x] **Tarea 4.1.1 (P0):** Schema.org JSON-LD específico por industria (`Restaurant`, `RealEstateAgent`, `SportsActivityLocation`, `MedicalBusiness`, `DaySpa`).
- [x] **Tarea 4.1.2 (P0):** Marcado estructurado `BreadcrumbList` en rutas de servicios y blog.
- [x] **Tarea 4.1.3 (P0):** Endpoints de consumo directo para agentes de IA (`/llms.txt`, `/llms-full.txt`, `/.well-known/agents.json`).
- [x] **Tarea 4.1.4 (P1):** Sitemaps XML dinámicos con soporte multilingüe completo (`/sitemap.xml`, `/sitemap.md`).

---

## 🛡️ Pilar 5: Gobernanza, Seguridad y Despliegue Blindado (DevOps)

### 5.1 Pipeline de Despliegue y Pruebas
- [x] **Tarea 5.1.1 (P0):** Pipeline automatizado de 7 etapas `npm run ship` (Typecheck -> Taxonomy -> Vitest 82 suites -> Audit Full -> Build -> Git Sync -> Wrangler Deploy -> Live Healthcheck).
- [x] **Tarea 5.1.2 (P0):** Batería de 82 archivos de prueba unitaria e integración con 718 tests en Vitest (100% pasando).
- [x] **Tarea 5.1.3 (P2):** Rate limiting con Cloudflare KV y fallback de memoria en `/api/report-business` y `/api/feedback/submit`.
