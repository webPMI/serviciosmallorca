# 🏗️ Arquitectura Completa — Servicios Mallorca

## 1. Stack Tecnológico

| Capa                   | Tecnología                        | Versión / Tipo                                   |
| ---------------------- | --------------------------------- | ------------------------------------------------ |
| **Framework Web**      | Astro (SSR)                       | ^7.1.3 (@astrojs/cloudflare Edge adapter)        |
| **Runtime / Edge**     | Cloudflare Pages                  | nodejs_compat (Ultra baja latencia)              |
| **Autenticación & DB** | Firebase Auth + Cloud Firestore   | ^12.16.0 (`serviciosmallorca`)                   |
| **Monetización**       | Google AdSense                    | `ca-pub-1988580228487420` (`ads.txt` verificado) |
| **Testing**            | Vitest                            | ^3.0.7 (70+ unit tests)                          |
| **Tipado**             | TypeScript                        | ^6.0.3 (Strict mode)                             |
| **Estilos**            | CSS Variables + Custom Properties | Nativo (Dark, Light, Golden, Golden-Dark)        |

---

## 2. Estructura de Directorios

```
servicios-mallorca/
├── wrangler.json               # Configuración de Cloudflare Pages
├── public/
│   ├── ads.txt                 # Archivo de autorización Google AdSense
│   ├── devtools.html           # Panel DevTools standalone
│   ├── devtools-floating.js    # Botón flotante context-aware
│   └── devtools-logger.js      # Logger circular de 500 entradas
├── src/
│   ├── data/                   # Capa de datos estáticos y repositorios
│   │   ├── categories.ts       # Categorías de servicios en Mallorca
│   │   ├── zones.ts            # 7 Zonas geográficas insulares
│   │   ├── tags.ts             # Catálogo cerrado de tags ortogonales
│   │   ├── posts.ts            # Artículos y guías del blog
│   │   └── services/           # 🏛️ Catálogo Modular (1 archivo por negocio)
│   │       ├── types.ts        # Modelos TypeScript compartidos
│   │       ├── index.ts        # Agregador central global
│   │       └── arte-tatuajes/  # 📂 Sector Arte, Tatuajes & Piercing
│   │           ├── kuyen-art-tattoo.ts
│   │           ├── box-tattoo-piercing.ts
│   │           ├── urban-soul-tattoo.ts
│   │           └── index.ts
│   ├── i18n/                   # Internacionalización (ES, EN, CA)
│   ├── layouts/
│   │   └── BaseLayout.astro    # Layout con AdSense, temas, metas y SEO
│   ├── pages/
│   │   └── [...locale]/
│   │       ├── index.astro             # Portada con buscador y destacados
│   │       ├── dashboard.astro         # Panel según rol (User, Manager, Admin)
│   │       ├── login.astro             # Inicio de sesión (Email + Google)
│   │       ├── register.astro          # Registro de cuentas
│   │       ├── forgot-password.astro   # Recuperación de credenciales
│   │       ├── profile.astro           # Perfil de usuario y avatar
│   │       ├── servicios/
│   │       │   ├── index.astro         # Directorio con filtros por categoría y zona
│   │       │   ├── [slug].astro        # Ficha individual (Multi-Maps, Galería, Tienda, FAQs)
│   │       │   └── nuevo.astro         # Alta y propuesta de nuevo negocio
│   │       └── blog/
│   ├── components/
│   │   ├── MapsRatingBox.astro         # Agregador de reputación multi-mapas
│   │   ├── VisualGalleryShowcase.astro # Galería mosaico & Visor Lightbox
│   │   ├── OnlineStoreShowcase.astro   # Tienda online & Productos oficiales
│   │   ├── SocialFeedSection.astro     # Canales y feed de publicaciones reales
│   │   ├── AdSenseSlot.astro           # Componente de anuncios sin CLS
│   │   ├── ServiceCard.astro           # Tarjeta de servicio
│   │   └── Navbar.astro                # Navegación reactiva
│   └── lib/
│       ├── geoUtils.ts                 # 📍 Motor de Proximidad Haversine (GPS)
│       ├── firebase.ts                 # Cliente oficial de Firebase
│       ├── serviceActions.ts           # Operaciones Firestore (Claims, Altas, Bajas)
│       ├── userProfile.ts              # Sincronización de perfiles en Firestore
│       └── authStore.ts                # Store reactivo de autenticación
├── scripts/
│   ├── business-intelligence-lookup.ts # 🔎 Minería y scraping para agentes
│   ├── validate-taxonomy.ts            # Validador de integridad taxonómica
│   └── audit-services.ts               # Health check de webs y frescura
```

---

## 3. Esquema de Colecciones en Cloud Firestore

| Colección                   | Documento        | Campos Principales                                         | Permisos                                 |
| --------------------------- | ---------------- | ---------------------------------------------------------- | ---------------------------------------- |
| `users`                     | `{uid}`          | `role`, `displayName`, `email`, `createdAt`, `updatedAt`   | Lectura propia/admin, escritura propia   |
| `services`                  | `{serviceId}`    | `name`, `category`, `zone`, `phone`, `website`, `ownerUid` | Lectura pública, escritura Admin/Manager |
| `service_claims`            | `{claimId}`      | `serviceId`, `applicantUid`, `verificationProof`, `status` | Creación usuario, gestión Admin          |
| `service_submissions`       | `{submissionId}` | `name`, `category`, `address`, `phone`, `status`           | Creación usuario, gestión Admin          |
| `service_deletion_requests` | `{requestId}`    | `serviceId`, `applicantUid`, `reason`, `status`            | Creación usuario, tramitación Admin      |
| `reviews`                   | `{reviewId}`     | `serviceId`, `authorUid`, `rating`, `comment`, `createdAt` | Lectura pública, creación usuario        |

---

## 4. 📋 Tareas Pendientes & Roadmap de Refactorización

### 🧩 Refactorización Modular de `src/pages/[...locale]/servicios/[slug].astro`

- **Objetivo:** Reducir la página de detalle de servicio de **~2.650 líneas a < 150 líneas**, optimizando drásticamente el consumo de tokens para agentes de IA y aislando el ámbito CSS.
- **Componentes a Extraer a `src/components/`:**
  1. `ServiceHeaderHero.astro`: Breadcrumbs, título `h1`, badges de categoría y botón compartir.
  2. `ServiceSidebarInfo.astro`: Teléfono con copia en portapapeles, dirección, estado en vivo y CTAs de contacto.
  3. `ServiceLocationMap.astro`: Coordenadas, mapa interactivo y accesos directos a Google / Apple / Bing Maps.
  4. `ServiceBookingModal.astro`: Modal interactivo de reserva de cita y solicitud de presupuesto.
  5. `ServiceClaimDeleteModals.astro`: Diálogos modales para reclamación de propiedad y propuesta de baja.
  6. `ServiceReviewsSection.astro`: Formulario de publicación y listado de opiniones de la comunidad.
  7. `ServiceRelatedList.astro`: Negocios recomendados en la misma categoría o zona insular.
- **Beneficios:**
  - Reducción del 85% en tokens consumidos por interacción con IA en la ficha de servicios.
  - Cero riesgo de conflictos de CSS o JavaScript entre secciones.
  - Pruebas y mantenimiento atómico de cada componente.
