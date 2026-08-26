# 🏗️ Arquitectura y Escalabilidad Profesional — Servicios Mallorca

Este documento detalla el diseño de ingeniería, el ciclo de vida de los datos, la estrategia de rendimiento y el modelo de monetización para escalar **Servicios Mallorca** desde un directorio ágil hasta un portal de referencia balear con miles de visitas diarias y cientos de negocios verificados.

---

## 1. Visión y Fases de Escalabilidad

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   FASE 1: LANZAMIENTO   │     │   FASE 2: CONSOLIDACIÓN │     │   FASE 3: PLATAFORMA    │
│  (0 - 200 Servicios)    │ ──> │ (200 - 1.000 Servicios) │ ──> │ (+1.000 Servicios)      │
│                         │     │                         │     │                         │
│ • Datasets tipados TS   │     │ • Base de datos Híbrida │     │ • Panel B2B para socios │
│ • SSR + Edge Caching    │     │ • Imágenes en R2/Cloud  │     │ • Pagos Stripe Connect  │
│ • AdSense Display Ads   │     │ • Lead Gen + AdSense    │     │ • Lead Gen Automatizado │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

---

## 2. Arquitectura de Datos y Ciclo de Vida

### 2.1 Estructura Tipada Estricta (`src/data/`)

Cada servicio debe implementar la interfaz TypeScript `ServiceItem` garantizando:

- `id` y `slug` únicos (kebab-case).
- Relación 1:N con `CATEGORIES` y `MALLORCA_ZONES`.
- Cobertura i18n completa (`es`, `en`, `ca`) en títulos, descripciones y puntos clave.
- Metadatos verificados: teléfono operativo, dirección física, horario y URL canónica.

### 2.2 Pipeline de Ingesta Diaria (Protocolo 5 Servicios/Día)

```
1. Investigación (Google Maps / Registro Oficial)
   │
2. Extracción de datos reales (Nombre, Tel, Web, Fotos, Rating, Horario)
   │
3. Control Automático Anti-Duplicados (validateServicesList)
   │
4. Redacción Editorial y Traducción (ES / EN / CA)
   │
5. Generación de Schema.org JSON-LD
   │
6. Auditoría y Tests Automatizados (npm test)
   │
7. Publicación y Despliegue Continuo
```

---

## 3. Estrategia SEO Técnica y Optimización para Motores de IA (GEO)

Los motores de búsqueda modernos y los agentes de IA (Google Search Generative Experience, Perplexity, ChatGPT Search, Gemini) premian la estructura semántica limpia y la veracidad de fuentes:

### 3.1 Datos Estructurados (Schema.org)

- **Fichas de Servicio (`servicios/[slug]`):**
  - `@type: LocalBusiness`
  - `address` (Mallorca, Illes Balears, ES)
  - `telephone`, `url`, `priceRange`
  - `aggregateRating` (`ratingValue`, `reviewCount`)
- **Artículos del Blog (`blog/[slug]`):**
  - `@type: BlogPosting`
  - `headline`, `image`, `datePublished`, `author`, `publisher`
- **Navegación:**
  - `@type: BreadcrumbList`

### 3.2 Rendimiento y Core Web Vitals

- **LCP (Largest Contentful Paint) < 1.2s:** Imágenes con compresión WebP, atributos `loading="lazy"` y tamaños adecuados.
- **CLS (Cumulative Layout Shift) = 0.00:** Contenedores de anuncios AdSense con `min-height` predefinido para evitar saltos de pantalla al cargar banners.
- **FID / INP < 50ms:** Renderizado SSR en Node.js sin JavaScript pesado en el cliente (0 frameworks de cliente innecesarios).

---

## 4. Estrategia de Monetización Multi-Nivel

```
                           ┌─────────────────────────────────────────┐
                           │   NIVEL 3: LEAD GENERATION DIRECTO      │
                           │  (Comisión por presupuesto o llamada)   │
                           ├─────────────────────────────────────────┤
                           │   NIVEL 2: LISTADOS DESTACADOS B2B      │
                           │ (Suscripción mensual por visibilidad)   │
                           ├─────────────────────────────────────────┤
                           │   NIVEL 1: PROGRAMÁTICA (ADSENSE)       │
                           │     (Ingresos pasivos por tráfico)      │
                           └─────────────────────────────────────────┘
```

### 4.1 Nivel 1: Google AdSense (Programática)

- Configurado con Publisher ID: `ca-pub-1988580228487420`.
- **Ubicaciones:**
  - `AdSenseSlot format="in-feed"`: En el catálogo y entre resultados de búsqueda.
  - `AdSenseSlot format="horizontal"`: Al pie del listado y final de artículos.
  - In-Article: Tras el bloque introductorio de cada guía del blog.

### 4.2 Nivel 2: Servicios Destacados y Verificación B2B (_Featured & Verified_)

- **Reclamación de Ficha (_Claim Listing_):** Los propietarios de negocios pueden verificar su titularidad enviando su CIF o acreditación para gestionar y actualizar su información con rol `manager`.
- **Planes de Suscripción Premium:**
  - Posicionamiento destacado en la portada (`index.astro`).
  - Distintivo visual `⭐ Negocio Verificado / Recomendado`.
  - Mención prioritaria en los artículos y guías temáticas del blog.
  - Panel B2B para actualizar horarios de temporada, ofertas y fotos.

### 4.3 Nivel 3: Generación de Contactos y Leads Directos

- Enlaces directos a WhatsApp con mensaje preconfigurado que incluye etiqueta de atribución:
  `?text=Hola, he visto su servicio en Servicios Mallorca...`
- Solicitud de presupuestos online y canalización directa al negocio correspondiente.
- Derecho de Supresión y Baja (_Opt-out_): Formulario accesible para solicitar la retirada de la ficha conforme a la normativa RGPD/LOPD.

---

## 5. Auditoría Continua y Control de Estado (Health Check)

Para evitar información desactualizada, negocios cerrados o enlaces rotos, el proyecto implementa un sistema automatizado de control de calidad:

### 5.1 Estados de Operatividad (`ServiceStatus`)

Cada servicio cuenta con un estado operativo explícito:

- `open` 🟢: Negocio abierto y prestando servicios con normalidad.
- `seasonal_closure` 🟡: Cierre temporal por temporada baja de invierno (típico en chárters náuticos o beach clubs de Mallorca). Se muestra un aviso informativo al usuario y se desactiva de la sección de destacados.
- `permanently_closed` 🔴: Negocio que ha cesado su actividad o cambiado de titular. Se excluye de las consultas públicas para no degradar la confianza del usuario ni el SEO.

### 5.2 Script de Health Check (`npm run audit:services`)

El script [`scripts/audit-services.ts`](file:///c:/Users/ink.enzo/Desktop/p/servicios-mallorca/scripts/audit-services.ts) audita automáticamente:

1. **Disponibilidad Web:** Comprueba mediante peticiones HTTP que los sitios web oficiales responden con código 200/300 (detecta webs caídas o dominios expirados).
2. **Frescura de Datos (SLA < 90 días):** Alerta de cualquier servicio que supere los 90 días desde su última fecha de verificación (`lastVerifiedAt`).
3. **Control Anti-Duplicados:** Verifica que no existan duplicidades por ID, slug, nombre, teléfono o dominio.
4. **Campos Obligatorios:** Garantiza que existan teléfono, dirección, horario y valoraciones válidas.

---

## 6. Control de Calidad y Reglas de Desarrollo (Golden Rules)

1. **GR-01 (Estilos):** 100% variables CSS en `global.css` (cero estilos inline o utilidades no estándar).
2. **GR-04 (i18n):** Todo texto visible proviene de `es.json`, `en.json`, `ca.json`, `de.json` con paridad total.
3. **GR-05 (Tests):** `npm test` debe validar integridad, tipos y ausencia de duplicados antes de cada commit.
4. **GR-11 (Zero Fake Data):** Prohibido publicar datos ficticios o no corroborados.

---

## 7. Mantenimiento y Comandos de Producción

| Acción                     | Comando                      | Descripción                                               |
| -------------------------- | ---------------------------- | --------------------------------------------------------- |
| **Auditoría de Negocios**  | `npm run audit:services`     | Ejecuta health check de webs, estado operativo y frescura |
| **Testing**                | `npm test`                   | Valida temas, permisos, i18n, integridad y no duplicación |
| **Auditoría completa**     | `npm run check`              | Ejecuta linter, typechecker y vitest en paralelo          |
| **Compilación**            | `npm run build`              | Genera el bundle de producción optimizado para SSR        |
| **Servidor de Producción** | `node dist/server/entry.mjs` | Levanta el servidor standalone de alto rendimiento        |

---

## 8. 📋 Próximas Mejoras de Escalabilidad (Roadmap)

### 8.1 Modularización de `src/pages/[...locale]/servicios/[slug].astro`

- **Diagnóstico:** El archivo actual ha alcanzado **~2.650 líneas**, concentrando estilos, modales, formularios y lógica de renderizado en un único punto.
- **Solución Programada:** Extraer a componentes atómicos en `src/components/`:
  - `ServiceHeaderHero.astro` (Encabezado, badges y breadcrumbs)
  - `ServiceSidebarInfo.astro` (Contacto rápido, horario y copiar datos)
  - `ServiceLocationMap.astro` (Mapa y enlaces de navegación)
  - `ServiceBookingModal.astro` (Cita previa y presupuestos)
  - `ServiceClaimDeleteModals.astro` (Gestión de propiedad y bajas)
  - `ServiceReviewsSection.astro` (Comentarios locales y valoraciones)
  - `ServiceRelatedList.astro` (Servicios relacionados de la zona)
- **Impacto:** Reduce el coste de procesamiento y consumo de tokens para agentes de IA en más de un 85%.
