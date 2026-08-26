# Estrategia de Crecimiento Automatico y Monetizacion AdSense — Servicios Mallorca

> **Documento maestro de monetizacion, crecimiento y optimizacion de ingresos.**
>
> Documenta el modelo economico, el flujo de interaccion de usuarios para maximizar ingresos de Google AdSense, las estrategias de crecimiento automatico y los mecanismos de confianza de **Servicios Mallorca**.
>
> **Coste operativo anual objetivo: 10 EUR/anio** (unicamente dominio). Todo lo demas opera en free tiers.
>
> **Relacion con otros documentos**: Complementa la monetizacion de SCALABILITY_AND_ARCHITECTURE.md (sec. 4) y WORKFLOW_CURATION.md (sec. 3); los requisitos de cumplimiento en ADSENSE_PREPARATION.md y ADSENSE_TECHNICAL_VALIDATION.md. No duplica informacion de GOLDEN_RULES.md, TAXONOMY.md ni ARCHITECTURE.md.

---

## Indice

1. Modelo Economico: Infraestructura de Coste Cero
2. Estrategia de Monetizacion AdSense
3. Flujo de Interaccion del Usuario (User Engagement Loop)
4. Motor de Crecimiento Automatico (Growth Engine)
5. Optimizacion Tecnica para Revenue
6. Construccion de Confianza y Credibilidad
7. Proyecciones de Crecimiento y Modelado de Revenue
8. Plan de Implementacion por Fases
9. Checklist de Cumplimiento Golden Rules
10. Referencias y Proximos Pasos

---

## 1. Modelo Economico: Infraestructura de Coste Cero

### 1.1 Costes Fijos Anuales

| Concepto                       | Coste           | Justificacion                                         |
| ------------------------------ | --------------- | ----------------------------------------------------- |
| Dominio (serviciosmallorca.es) | **10 EUR/anio** | Registro .es en NIC.es o proveedor                    |
| Alojamiento                    | 0 EUR/anio      | Free tier Railway / Render / Fly.io (~1M visitas/mes) |
| Base de datos                  | 0 EUR/anio      | Firebase Spark: 50K reads/dia, 20K writes/dia, 1GB    |
| Anuncios (AdSense)             | 0 EUR/anio      | Google gestiona infraestructura y pagos               |
| Imagenes/Assets                | 0 EUR/anio      | Unsplash links, Cloudflare Images free                |
| Email transaccional            | 0 EUR/anio      | Firebase Auth (reseteo/verificacion)                  |

**Total: 10 EUR/anio (solo dominio).**

### 1.2 Modelo de Costes Marginal

```text
Visitante adicional            -> 0 EUR coste marginal
Impresion de anuncio adicional -> 0 EUR coste marginal
Ingreso adicional              -> Ingreso neto (hasta 100% margen)
```

**Ventaja competitiva**: Astro SSR standalone en free tier + Cloudflare CDN = coste plano sin importar escala, a diferencia de Vercel/Netlify que cobran por serverless execution o bandwidth.

### 1.3 Resiliencia ante Traffic Spikes

- Astro output estatico + SSR ligero (paginas prerenderizables)
- Node adapter en free tier: ~15K horas/mes (~20 req/s promedio)
- Cloudflare (plan gratuito) como CDN delante del servidor
- Lazy loading de Firestore: reviews y comunidad bajo demanda

### 1.4 Estado Actual del Proyecto

| Componente                        | Estado       | Observacion                                    |
| --------------------------------- | ------------ | ---------------------------------------------- |
| AdSense (ca-pub-1988580228487420) | Integrado    | Script en BaseLayout.astro                     |
| ads.txt                           | Verificado   | google.com, pub-1988580228487420, DIRECT       |
| AdSenseSlot.astro                 | Existente    | Formatos: auto, rectangle, horizontal, in-feed |
| Sitemap.xml                       | Falta        | Critico para SEO                               |
| robots.txt                        | Falta        | Critico para SEO                               |
| OpenGraph/Twitter cards           | Falta        | Necesario para social sharing                  |
| Canonical/hreflang tags           | Falta        | Necesario para SEO multi-locale                |
| Schema.org JSON-LD                | Parcial      | Servicios y blog posts (SCALABILITY sec. 3.1)  |
| Blog posts                        | 2 articulos  | Muy escaso para monetizacion                   |
| Servicios en catalogo             | ~8 servicios | Necesita expansion                             |
| Comunidad/Forum                   | Funcional    | Firebase Firestore — sin anuncios              |

## 2. Estrategia de Monetizacion AdSense

### 2.1 Analisis de Implementacion Actual

| Pagina               | Formato    | Posicion             | Estado                   |
| -------------------- | ---------- | -------------------- | ------------------------ |
| Homepage             | horizontal | After categories     | Activo                   |
| Directorio servicios | horizontal | Bottom               | Activo                   |
| Ficha servicio       | rectangle  | Sidebar (no sticky)  | No sticky, no in-content |
| Blog index           | horizontal | Bottom               | Activo                   |
| Blog post            | in-feed    | After lead paragraph | Deberia ser in-article   |
| Comunidad (todas)    | —          | —                    | Sin anuncios             |

**Gaps criticos**: sin in-article ads en blog posts, sin ads en comunidad, sin ads sticky/desktop, sin ads in-content en fichas, texto Publicidad hardcodeado en AdSenseSlot.astro (violacion GR-04), sin Auto Ads habilitados.

### 2.2 Matriz de Placements Optimizada (Revenue Max)

#### 2.2.1 Homepage (/es/)

- **Leaderboard 728x90 (horizontal)**: tras el hero, antes del grid de categorias
- **In-Feed (fluid)**: entre categoria 3 y 4
- **In-Feed (fluid)**: entre servicio destacado 3 y 4
- **Sticky Footer (horizontal)**: fixed bottom en desktop, dismissible

#### 2.2.2 Directorio de Servicios (/es/servicios/)

- **In-Feed Ad (fluid)**: cada 6 tarjetas de servicio
- **Horizontal Banner (footer)**: cierre de pagina (existente)

#### 2.2.3 Ficha de Servicio (/es/servicios/[slug]/) — pagina de mayor valor

```text
+------------------+----------------------------------+
| LEFT COLUMN      | RIGHT COLUMN (Sidebar)           |
|                  | [Rectangle 300x250 STICKY]       |
| - Image/Gallery  | Contact Card (sticky):           |
| - Description    |   WhatsApp / Call / Web btns     |
| - In-Content Ad  | Tags + B2B actions               |
| - Map / Reviews  |                                  |
+------------------+----------------------------------+
[AdSense In-Content rectangle tras Acerca-de-este-servicio]
Related Blog Posts / Services
[AdSense Footer Leaderboard]
```

#### 2.2.4 Blog Post (/es/blog/[slug]/) — pagina de mayor rotacion

- **In-Article Ad #1**: tras el lead paragraph, antes del cuerpo
- **In-Article Ad #2**: a mitad de contenido (~60% del articulo)
- **Sticky Rectangle**: solo desktop durante scroll de lectura
- **Footer Leaderboard**: cierre de pagina

#### 2.2.5 Comunidad / Foro — actualmente sin anuncios

- **Index (/es/comunidad/)**: In-Feed cada 4 temas + footer leaderboard
- **Topic Detail (/es/comunidad/[slug]/)**: In-Article tras el tema + In-Feed cada 5 respuestas + footer leaderboard

### 2.3 Estrategia de Formatos AdSense

| Formato           | Uso                               | Ventaja                            | Politica AdSense             |
| ----------------- | --------------------------------- | ---------------------------------- | ---------------------------- |
| Auto (Responsive) | Homepage leaderboard, footers     | Se adapta a todos los dispositivos | Dentro del limite de ancho   |
| In-Article        | Blog posts, fichas servicio       | CTR 2-5x mayor que display         | Solo contenido textual largo |
| In-Feed           | Directorio, blog index, comunidad | Natural, alta integracion          | Entre items de feed          |
| Rectangle 300x250 | Sidebar sticky desktop            | Alto eCPM en escritorio            | Max 2 por pageview           |
| Sticky Footer Bar | Mobile + Desktop                  | Visibilidad constante              | Debe ser dismissible         |

**Regla de oro AdSense**: maximo 3 anuncios visibles por pageview en movil, 4-5 en desktop. Priorizar viewability sobre cantidad.

### 2.4 Auto Ads vs Manual Placement

| Estrategia            | Ventajas                                  | Desventajas                      | Recomendacion                          |
| --------------------- | ----------------------------------------- | -------------------------------- | -------------------------------------- |
| Auto Ads (pasiva)     | Google optimiza posicion; 0 mantenimiento | Menos control, puede afectar CLS | Habilitar como capa base en BaseLayout |
| Manual placements     | Control preciso, CLS garantizado          | Requiere mantenimiento y testing | Mantener 3-5 slots estrategicos        |
| Combinacion (hibrida) | Lo mejor de ambos                         | Complejidad de testing           | **Recomendado**: Auto + manual         |

### 2.5 CLS Compliance

AdSenseSlot.astro ya implementa min-height para placeholders (GR-09). Estrategia ampliada:

```css
.adsense-container {
  min-height: 90px; /* horizontal leaderboards */
  min-height: 250px; /* rectangle 300x250 */
  min-height: 60px; /* sticky footer bar */
}
```

- Movil: 320x100 (min-height 100px)
- Desktop: 728x90 o 300x250 con min-height reservado
- Todos los ads usan data-full-width-responsive true

### 2.6 Revenue Optimization (RPM/CPM)

| Metrica         | Target (Fase 1) | Target (Fase 3) |
| --------------- | --------------- | --------------- |
| Pageviews/mes   | 30K             | 500K            |
| Ads/page visto  | 2.5             | 3.5             |
| Impresiones/mes | 75K             | 1.75M           |
| CTR medio       | 0.5%            | 0.8%            |
| CPM estimado    | 2.50 EUR        | 4.00 EUR        |
| Revenue/mes     | 187 EUR         | 7,000 EUR       |

El CPM para servicios locales en Baleares oscila entre 1.5 y 5.0 EUR. El crecimiento del blog y la comunidad multiplica impresiones sin coste adicional.

---

## 3. Flujo de Interaccion del Usuario (User Engagement Loop)

El objetivo es maximizar tiempo en sitio, paginas por sesion y visitas recurrentes. Todas estas metricas conducen a mas impresiones de anuncios y mas ingresos AdSense.

### 3.1 User Journey Funnel

```text
Organic Search / Social / Direct
        |
        v
Landing Page (Service / Blog / Community)
        |
        v
Internal Linking Ecosystem (cross-content navigation)
  - Service <-> Blog Related Posts
  - Service <-> Community Discussions
  - Blog <-> Related Services
        |
        v
More Pages Viewed (+Pages/Session)
More Time on Site (+Session Duration)
More Ad Impressions
        |
        v
User Action (CTA)
  - WhatsApp click (lead directo)
  - Review escrita (trust + engagement)
  - Forum reply (community stickiness)
  - Service claimed (B2B monetization)
        |
        v
Returning Visitor (loyalty + frecuencia)
        |
        v
AdSense Optimiza (CPM mas alto para usuarios enganchados)
```

### 3.2 Engagement Levers

#### 3.2.1 Internal Link Density (driver de Pages/Session)

| Desde            | Hacia                 | Elemento UI            | Objetivo            |
| ---------------- | --------------------- | ---------------------- | ------------------- |
| Service Detail   | Blog Post relacionado | Articulos relacionados | 1 click -> blog     |
| Service Detail   | Community Forum tema  | Discutir en comunidad  | 1 click -> foro     |
| Blog Post        | Service Detail        | Ver ficha completa     | 1 click -> servicio |
| Blog Post        | Community Topic       | Ver discusion          | 1 click -> foro     |
| Community Topic  | Service Detail        | Ver en directorio      | 1 click -> servicio |
| Cualquier pagina | Category/Zone listing | Breadcrumbs, pills     | Navegacion lateral  |

**Target**: 4.0+ pages/session, 3+ min avg session duration.

#### 3.2.2 Community-Driven Engagement (mayor retencion)

El foro de comunidad genera sesiones largas porque:

- Los threads con respuestas crean un feed natural de scroll
- Los usuarios leen multiples respuestas (alta profundidad de pagina)
- Sistema de likes y respuestas fomenta participacion

Estrategia:

1. **Seed content**: crear temas guia iniciales (ej: mejor fontanero de urgencias en Palma)
2. **Notificaciones de respuesta** via Firebase Cloud Functions (free tier)
3. **Badges de participacion**: Top contribuidor del mes hace que los usuarios vuelvan
4. **Cross-posting**: blog posts generan discusiones en el foro

#### 3.2.3 Reviews & Social Proof

- Sistema de resenas: Firestore reviews collection (ya implementado)
- Review prompts tras visitar ficha: Has usado este servicio? Deja tu resena
- Helpful votes: interaccion adicional que genera pageviews
- Trust signals agregados: rating promedio, contador de resenas, badges verificados

#### 3.2.4 Content Depth & Readability

- Blog posts: minimo 1500 palabras con H2/H3 (mas tiempo de lectura = mas impresiones in-article)
- FAQ schema en blog posts (posibilidad de aparecer en SGE / AI Overviews)
- Multi-format content: texto + imagenes + listas + tablas (engagement visual)

#### 3.2.5 Social Sharing & Viral Loops

| Mecanismo         | Implementacion                        | Beneficio                   |
| ----------------- | ------------------------------------- | --------------------------- |
| Share buttons     | Web Share API + botones fijos en blog | Trafico organico viral      |
| OG metadata       | OpenGraph + Twitter Cards (falta)     | Rich previews -> mas clicks |
| Newsletter signup | Footer + final de blog posts          | Recupera visitantes         |
| Referral program  | Comparte servicios -> visibilidad     | Viral growth loop           |

### 3.3 KPIs de Engagement

| Metrica                 | Target (Fase 1) | Target (Fase 3) |
| ----------------------- | --------------- | --------------- |
| Pages/session           | 3.0             | 5.0+            |
| Avg session duration    | 2 min           | 5+ min          |
| Bounce rate             | <50%            | <35%            |
| Returning visitors      | 20%             | 40%+            |
| Community replies/topic | 3.0             | 8.0+            |
| Reviews per service     | 5               | 20+             |

---

## 4. Motor de Crecimiento Automatico (Growth Engine)

### 4.1 Pipeline de Contenido (Content Velocity Strategy)

```text
DIARIO (automatico + manual)
- Curacion: 5 servicios nuevos validados (WORKFLOW_CURATION.md)
- Audit: npm run audit:services (health check)
- Data refresh: horarios, ratings, fotos

SEMANAL
- Blog post: 1 articulo guia (1500+ palabras)
- Community seeds: 3-5 temas guia en el foro
- Reviews monitoring: follow-up de resenas nuevas

MENSUAL
- Category deep-dive: expansion de servicios por sector
- Performance audit: Core Web Vitals, sitemap, indexing
- Revenue report: AdSense RPM, CTR, impresiones
```

### 4.2 SEO & GEO (Search + Generative Engine Optimization)

#### 4.2.1 SEO Tecnico (Infraestructura)

| Item               | Estado Actual | Accion                                | Prioridad |
| ------------------ | ------------- | ------------------------------------- | --------- |
| sitemap.xml        | No existe     | Instalar @astrojs/sitemap             | CRITICA   |
| robots.txt         | No existe     | Crear con directivas de crawl         | CRITICA   |
| OpenGraph meta     | No existe     | Anadir og:* y twitter:* en BaseLayout | ALTA      |
| Canonical tags     | No existe     | Anadir link rel=canonical             | MEDIA     |
| hreflang tags      | No existe     | Anadir hreflang es/en/ca/de           | ALTA      |
| Schema.org JSON-LD | Parcial       | Expandir a FAQ y BreadcrumbList       | MEDIA     |
| Image optimization | Unsplash URLs | lazy loading + width/height attrs     | MEDIA     |

#### 4.2.2 Mapa de Keywords Estrategico

```text
HIGH VOLUME (competencia media)
- servicios mallorca -> Homepage
- directorios servicios mallorca -> /servicios/
- empresas verificadas mallorca -> /servicios/
- blog guias mallorca -> /blog/

MEDIUM VOLUME (baja competencia, alta intencion)
- fontanero urgencias palma -> servicios?zona=palma&q=fontanero
- alquiler yates mallorca -> servicios?categoria=nautica-charter
- tatuador palma -> servicios?categoria=arte-tatuajes
- chef privado mallorca -> servicios?categoria=gastronomia-catering

LONG TAIL (generative search friendly)
- mejor estudio de tatuaje en mallorca 2026
- como alquilar un yate en puerto portals baratos
- guia completa de servicios en santa catalina palma
- que preguntar antes de contratar un fontanero en mallorca
```

GEO: los prompts de IA suelen ser preguntas especificas. Crear contenido FAQ que responda directamente estas consultas.

### 4.3 Social Proof & Distribution

Redes sociales (coste cero):

| Plataforma     | Estrategia                                    | Frecuencia      |
| -------------- | --------------------------------------------- | --------------- |
| Instagram      | Reels 15s de servicios verificados por zona   | 3 posts/semana  |
| TikTok         | 5 servicios que necesitas en Mallorca (viral) | 2 posts/semana  |
| X/Twitter      | Tips rapidos + threads verificados            | 1 post/dia      |
| LinkedIn       | Articulos profesionales B2B Mallorca          | 1 post/semana   |
| YouTube Shorts | Mini-documentales de negocios (30s)           | 2 videos/semana |

Newsletter-led growth:

- Formulario en footer de todas las paginas + final de blog posts
- Incentivo: mejores ofertas de servicios verificados cada semana
- Frecuencia: weekly digest segun preferencia del usuario (es/ca/en)
- Plataforma gratuita: Buttondown o Beehiiv free tier (5K suscriptores)

### 4.4 Link Building (Backlinks para SEO)

Estrategia earned media (coste cero):

1. Press release local (freeportales.com, majorcadailysociety.com): Servicios Mallorca verifica N nuevos negocios
2. Partnerships con blogs de viajes: guest posts tipo 72 horas en Mallorca
3. Directorios gratuitos: Wikidelia, Mallorca turisme, Google My Business
4. Community amplification: usuarios que publican resenas comparten naturalmente

---

## 5. Optimizacion Tecnica para Revenue (Performance = Revenue)

### 5.1 Core Web Vitals (Google AdSense favorece sitios rapidos)

| Metrica                         | Target  | Implementacion                                        |
| ------------------------------- | ------- | ----------------------------------------------------- |
| LCP (Largest Contentful Paint)  | < 1.2s  | Astro SSR, imagenes WebP + lazy, font preloading      |
| CLS (Cumulative Layout Shift)   | < 0.1   | AdSenseSlot con min-height, imagenes con width/height |
| INP (Interaction to Next Paint) | < 200ms | Cero JS cliente en landing pages (SSR puro)           |

### 5.2 Mobile-First Ad Strategy (65%+ del trafico es movil)

Unidades de anuncio moviles prioritarias:

- 320x100 banner: sticky top (dismissible)
- 300x250 rectangle: in-content, mid-page
- 320x50 anchor: sticky bottom (dismissible)
- Fluid auto: in-feed entre cards

Unidades de anuncio desktop:

- 728x90 leaderboard: after hero/categories
- 300x250 rectangle: sticky sidebar
- 728x90 sticky footer: fixed bottom
- 970x90 large leaderboard: opcional pantallas grandes

### 5.3 Lazy Loading & Ad Refresh

- AdSense lazy-load: usar loading lazy en contenedores de ads fuera del fold
- Ad refresh: en paginas de alta rotacion (comunidad), refrescar ads cada 30 min sin recargar pagina
- Viewability threshold: no servir ads si el usuario no va a hacer scroll (Intersection Observer API)

### 5.4 Zero-Cost Infrastructure Stack

```text
DEPLOY STACK (0 EUR/mes):
GitHub -> Railway/Render/Fly.io (free tier)
  - Astro SSR (Node standalone)
  - Cloudflare CDN delante (plan gratuito)
  - Firebase Spark (auth, firestore)

Total: 10 EUR/anio (solo dominio)

FREE TIER CAPACITY (suficiente para +1M visitas/mes):
- Railway/Render: 500-15K horas/mes (~15-30 req/s)
- Cloudflare: CDN ilimitada
- Firebase: 50K reads/dia, 20K writes/dia, 1GB storage
- AdSense: infraestructura propia de Google
```

---

## 6. Construccion de Confianza y Credibilidad

La confianza es el activo mas valioso del proyecto. Sin ella, ni usuarios ni AdSense funcionan.

### 6.1 GR-11: Zero Fake Data (Fundamento de la Credibilidad)

El pilar de la confianza es la veracidad absoluta de la informacion:

1. PageRank de Google: sitios con datos falsos caen en rankings
2. AdSense Policy: Google desmonetiza sitios con contenido enganoso
3. Retencion de usuarios: si los datos son falsos, los usuarios no vuelven

Protocolo de Verificacion Triple:

```text
Fuente 1: Google Maps / Google Business Profile (GR-12)
  - Nombre comercial, coordenadas GPS, rating y review count,
    horario de atencion, sitio web oficial

Fuente 2: Sitio web oficial del negocio
  - Verificacion de dominio activo, contacto coincide,
    datos de empresa (CIF, direccion)

Fuente 3: Registro oficial (SIRE, Mercantil, etc.)
  - Cross-check de datos legales
```

### 6.2 GR-12: Fidelidad de Datos Google Maps (90%+ Re-indexacion)

| Dato                          | Fuente Obligatoria  | Verificacion                     |
| ----------------------------- | ------------------- | -------------------------------- |
| Nombre comercial              | Google Maps         | Match exacto                     |
| Direccion + coordenadas       | Google Maps         | lat/lng en bounding box Mallorca |
| Rating + review count         | Google Maps publico | Match exacto                     |
| Horario                       | Google Maps         | Dias + franjas horarias          |
| Maps URLs (Google/Apple/Bing) | Google Maps         | 3 enlaces verificados            |

**Script de auditoria**: npm run audit:services verifica automaticamente disponibilidad web, frescura de datos (< 90 dias), anti-duplicados y campos obligatorios.

### 6.3 Trust Signals Visuales

- Badge Negocio Verificado: solo para servicios con verification=true
- Badge Ultima verificacion [fecha]: transmite frescura de datos
- Rating + review count de Google Maps: trust de terceros
- Community reviews (Firestore): trust de usuarios reales del sitio
- Google Maps embed + multi-map links: verificacion visual de ubicacion

### 6.4 Community Trust (UGC = Trust)

1. Foro de comunidad: debates reales generan trust social
2. Sistema de resenas: prueba social de usuarios reales
3. Moderacion activa: reglas del foro prohiben spam y datos falsos
4. Usuarios autenticados (Firebase Auth) generan mas confianza que anonimos

### 6.5 Legal & Compliance

- Privacy policy (/es/privacy): existe
- Terminos de uso (/es/terms): existe
- RGPD/LOPD compliance: formulario de borrado implementado en fichas
- AdSense policy: etiqueta Publicidad en todos los anuncios (debe ser i18n segun GR-04)
- Plantillas legales completas en LEGAL_POLICIES_TEMPLATE.md

---

## 7. Proyecciones de Crecimiento y Modelado de Revenue

### 7.1 Modelo de Revenue (AdSense CPM)

```text
Revenue = (Pageviews x Ad Density x Viewability x CTR x CPC) / 1000

Donde:
- Pageviews: visitas a paginas con ads
- Ad Density: anuncios por pagina (target: 2.5-3.5)
- Viewability: % de ads visibles (target: >=70%)
- CTR: click-through rate (target: >=0.5%)
- CPC: cost per click (variable, 0.10-0.50 EUR para servicios en ES)
```

### 7.2 Proyecciones por Fases

Fase 1 - Lanzamiento (0-3 meses):

| Variable        | Valor       |
| --------------- | ----------- |
| Pageviews/dia   | 1,000       |
| Ads/page        | 2.0         |
| Viewability     | 70%         |
| Impresiones/dia | 1,400       |
| CTR             | 0.3%        |
| CPM             | 1.50 EUR    |
| **Revenue/mes** | **~63 EUR** |
| Coste/mes       | ~0.83 EUR   |
| **Profit/mes**  | **~62 EUR** |

Fase 2 - Crecimiento (3-12 meses):

| Variable        | Valor          |
| --------------- | -------------- |
| Pageviews/dia   | 10,000         |
| Ads/page        | 2.5            |
| Viewability     | 75%            |
| Impresiones/dia | 18,750         |
| CTR             | 0.5%           |
| CPM             | 2.50 EUR       |
| **Revenue/mes** | **~1,406 EUR** |
| Coste/mes       | ~0.83 EUR      |
| **Profit/mes**  | **~1,405 EUR** |

Fase 3 - Escala (12+ meses):

| Variable        | Valor           |
| --------------- | --------------- |
| Pageviews/dia   | 50,000          |
| Ads/page        | 3.0             |
| Viewability     | 80%             |
| Impresiones/dia | 120,000         |
| CTR             | 0.7%            |
| CPM             | 3.50 EUR        |
| **Revenue/mes** | **~12,600 EUR** |
| Coste/mes       | ~0.83 EUR       |
| **Profit/mes**  | **~12,599 EUR** |

### 7.3 Revenue Multipliers (Growth Levers)

| Lever                            | Impacto en Revenue    | Esfuerzo | Coste Cero |
| -------------------------------- | --------------------- | -------- | ---------- |
| +1 blog post/semana              | +15% pageviews        | Bajo     | Si         |
| +3 ad slots por pagina           | +20% impresiones      | Bajo     | Si         |
| Newsletter (recupera visitantes) | +8% pageviews         | Medio    | Si         |
| Community forum engagement       | +25% session duration | Alto     | Si         |
| Social sharing viralidad         | Variable (0-200%)     | Alto     | Si         |
| SEO (sitemap + hreflang)         | +50% trafico organico | Medio    | Si         |

---

## 8. Plan de Implementacion por Fases

### 8.1 Fase 0: Inmediato (0-30 dias) - Wins rapidos

| #   | Tarea                                                        | Area            |
| --- | ------------------------------------------------------------ | --------------- |
| 1   | Instalar @astrojs/sitemap + crear robots.txt                 | SEO             |
| 2   | Anadir OpenGraph + canonical + hreflang en BaseLayout        | SEO/Metadata    |
| 3   | Habilitar Google AdSense Auto Ads en BaseLayout              | Monetizacion    |
| 4   | Arreglar texto Publicidad hardcodeado -> i18n en AdSenseSlot | GR-04           |
| 5   | Anadir ads en comunidad (in-feed + footer)                   | Monetizacion    |
| 6   | Duplicar ad slot in-article en blog post (tras parrafo 2)    | Monetizacion    |
| 7   | Configurar Google Analytics 4 + Search Console               | Analytics       |
| 8   | Anadir width/height attrs en todas las imagenes              | Core Web Vitals |

### 8.2 Fase 1: Fundacion (1-3 meses) - Estructura de crecimiento

| #   | Tarea                                                  | KPI                     |
| --- | ------------------------------------------------------ | ----------------------- |
| 1   | Content calendar: 5 servicios/dia + 1 blog post/semana | 150 servicios, 12 posts |
| 2   | Newsletter signup (Buttondown/Beehiiv free)            | 100 suscriptores        |
| 3   | Social sharing buttons en blog posts                   | 5% share CTR            |
| 4   | FAQ schema en blog posts (GEO)                         | 3 preguntas FAQ/page    |
| 5   | AdSense in-content en service detail                   | +1 ad/service page      |
| 6   | Sticky footer bar (desktop)                            | +1 visible ad/desktop   |
| 7   | Review system promotion (CTA tras ficha)               | 10% review CTR          |

### 8.3 Fase 2: Escala (3-6 meses) - Aceleracion

| #   | Tarea                                         | KPI                     |
| --- | --------------------------------------------- | ----------------------- |
| 1   | Auto-refresh de ads en comunidad (30 min)     | +15% impresiones        |
| 2   | Video embeds (YouTube Shorts) en blog         | +2 min session duration |
| 3   | Related posts engine                          | +0.5 pages/session      |
| 4   | Community gamification (badges, leaderboards) | 20% mas posts           |
| 5   | Link building outreach (guest posts)          | 10 backlinks            |
| 6   | A/B testing ad placements                     | 10% mas CTR             |

### 8.4 Fase 3: Plataforma (6-12 meses) - Consolidacion

| #   | Tarea                                | KPI                 |
| --- | ------------------------------------ | ------------------- |
| 1   | Lead gen B2B (formulario WhatsApp)   | 50 leads/mes        |
| 2   | Premium listings (featured business) | 5 negocios premium  |
| 3   | Podcast/YouTube channel (local SEO)  | 1K suscriptores     |
| 4   | Traduccion aleman (turistas)         | 4 locale            |
| 5   | API publica de servicios             | Backlinks naturales |

---

## 9. Checklist de Cumplimiento Golden Rules

Antes de cada implementacion de monetizacion, verificar contra las reglas del proyecto:

```text
[ ] GR-01: Todos los estilos de ads usan var(--color-*), no colores hardcodeados
[ ] GR-02: Responsive: ads se adaptan en breakpoints 480/640/768/900/1024
[ ] GR-03: AdSenseSlot.astro tiene Props con TypeScript explicito
[ ] GR-04: Texto Publicidad -> translations[ads.label] (i18n en los 3 locales)
[ ] GR-05: Tests para nuevas funciones de ads (viewability, lazy-load)
[ ] GR-07: aria-label en todos los containers de anuncios
[ ] GR-09: Zero console errors, build limpio
[ ] GR-10: Build time < 60s (monitorear con ads adicionales)
[ ] GR-11: Zero Fake Data - todos los negocios son reales y verificados
[ ] GR-12: Google Maps fidelity - coords, ratings, horarios sincronizados
```

---

## 10. Referencias y Proximos Pasos

### 10.1 Documentos Relacionados

- SCALABILITY_AND_ARCHITECTURE.md - Fases de escalado, monetizacion multi-nivel
- WORKFLOW_CURATION.md - Protocolo de curacion diaria, tabla de AdSense
- ADSENSE_PREPARATION.md - Politicas de contenido y requisitos legales AdSense
- ADSENSE_TECHNICAL_VALIDATION.md - Validacion tecnica (meta tags, Schema.org)
- LEGAL_POLICIES_TEMPLATE.md - Plantillas legales (privacidad, terminos, cookies)
- GOLDEN_RULES.md - Reglas inmutables (GR-01, GR-04, GR-09, GR-11, GR-12)
- TAXONOMY.md / TAXONOMY_SCALE.md - Sistema de clasificacion de servicios

### 10.2 Herramientas Gratuitas Recomendadas

| Necesidad         | Herramienta           | Free Tier           |
| ----------------- | --------------------- | ------------------- |
| Analytics         | Google Analytics 4    | Ilimitado           |
| Search Console    | Google Search Console | Ilimitado           |
| Sitemap           | @astrojs/sitemap      | Open source         |
| CDN               | Cloudflare            | Plan gratuito       |
| Newsletter        | Buttondown / Beehiiv  | 5K suscriptores     |
| Image CDN         | Cloudflare Images     | 1000 imagenes       |
| Social Scheduling | Buffer                | 3 cuentas, 10 posts |
| Email API         | SendGrid              | 100 emails/dia      |

### 10.3 KPIs Mensuales a Monitorear

1. Revenue: AdSense revenue vs proyeccion (sec. 7)
2. Trafico: Pageviews, sessions, new vs returning
3. Engagement: Pages/session, avg session duration, bounce rate (targets sec. 3.3)
4. Contenido: Servicios nuevos, blog posts publicados
5. Confianza: Resenas nuevas, community topics, verification rate
6. Tecnico: Core Web Vitals, CLS, build time (targets sec. 5.1)

---

_Documento parte del sistema de documentacion de Servicios Mallorca. Actualizar tras cada fase de implementacion._
