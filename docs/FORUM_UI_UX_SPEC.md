# Foro Comunidad — Especificacion Tecnica de UI/UX e Implementacion

> **Complemento operativo** de FORUM_COMMUNITY_ROADMAP.md. Define componentes, wireframes, firma de funciones de la capa lib, catalogo i18n completo, SEO para UGC, estados de interfaz y criterios de aceptacion por vista.
>
> Objetivo: que cualquier agente (@frontend, @auth, @testing) pueda implementar sin ambiguedad respetando GOLDEN_RULES.md.

---

## Indice

1. Auditoria del codigo actual (hallazgos previos a F1)
2. Arquitectura de componentes
3. Wireframes por vista (V1-V5)
4. Capa lib: firmas de funciones
5. Catalogo i18n completo (GR-04)
6. SEO para contenido UGC
7. Estados de interfaz (loading / empty / error / expirado)
8. Accesibilidad especifica del foro (GR-07)
9. Criterios de aceptacion por fase

---

## 1. Auditoria del codigo actual (hallazgos previos a F1)

Revisando firestore.rules contra src/lib/community.ts se detectan inconsistencias a resolver EN F1 antes de anyadir funcionalidad:

| #    | Hallazgo                                                                 | Evidencia                                                   | Accion                                                                             |
| ---- | ------------------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| H-01 | Rules validan campo `body` pero el codigo envia `content` (ForumTopic)   | firestore.rules L198-199 vs community.ts ForumTopic.content | Unificar a `content` en rules (o renombrar en cliente); decidir UN nombre canonico |
| H-02 | Test espera exactamente 5 valores de ForumCategory                       | tests/unit/community.test.ts L7-14                          | Actualizar test al ampliar union en F1 (11 valores)                                |
| H-03 | `withinLength(title, 300)` en rules vs maxlength=120 en formulario nuevo | comunidad/nuevo.astro vs rules L198                         | Alinear: 120 en ambos (evita titulos kilometricos)                                 |
| H-04 | No existe validacion de categoria contra lista cerrada en rules          | rules L196-199                                              | Anadir check category in lista permitida                                           |
| H-05 | renderizado de temas via innerHTML con template strings                  | comunidad/index.astro script                                | Sanitizar contenido usuario (escape HTML) o migrar a creacion de nodos; riesgo XSS |

H-05 es PRIORIDAD DE SEGURIDAD: cualquier usuario autenticado puede inyectar HTML hoy mismo si escribe `<img onerror=...>` en un tema. Ver SECURITY.md.

---

## 2. Arquitectura de componentes

### 2.1 Componentes nuevos (src/components/forum/)

| Componente             | Responsabilidad                                             | Props principales                      |
| ---------------------- | ----------------------------------------------------------- | -------------------------------------- |
| ForumCategoryNav.astro | Barra de 6 categorias + Cafe; chips scrolleables en movil   | currentLocale, activeCategory, counts? |
| TopicCard.astro        | Tarjeta generica de tema (reemplaza template string actual) | topic, locale, variant                 |
| JobCard.astro          | Variante enriquecida para category=empleo                   | job, locale, verifiedBusiness?         |
| ListingFilters.astro   | Chips Oferta/Solicitud + selects Sector/Zona (solo empleo)  | kind?, sector?, zone?                  |
| ExpiryBadge.astro      | Dias restantes / Caducado                                   | expiresAt, locale                      |
| ReportButton.astro     | Boton denunciar -> coleccion forum_reports                  | topicId, locale                        |
| DynamicTopicForm.astro | Formulario que muta campos segun categoria elegida          | categories config, locale              |

### 2.2 Reutilizados sin cambios

Navbar.astro, Footer.astro, BaseLayout.astro, ToastContainer.astro (notificaciones de exito/error ya disponibles via src/lib/toast.ts).

### 2.3 Patron de renderizado (decision clave)

Hoy: fetch Firestore -> template strings -> innerHTML. Riesgo XSS (H-05).

Decision para F2+: crear nodos con document.createElement + textContent para todo dato de usuario; atributos href/src solo tras whitelist (https: y mailto:). Se documenta como estandar del foro; ServiceCard/BlogCard no aplican al ser render SSR de datos propios curados.

---

## 3. Wireframes por vista

### V1 — Comunidad Index (/es/comunidad/)

```text
+--------------------------------------------------------------+
| [Navbar]                                                      |
+--------------------------------------------------------------+
| COMUNIDAD DE MALLORCA          [+ Crear tema]                 |
|                                                              |
| (ForumCategoryNav - chips)                                   |
| [Todas][💼 Empleo][🏠 Vivienda][🛒 Mercado][📅 Eventos]...    |
| ------------------------------------------------------------ |
| | FEED                                                       |
| | +---------------------------------------------+  +-------+ |
| | | TopicCard / JobCard x N                      |  |SIDE-  | |
| | | -------------------------------------------  |  |BAR    | |
| | | [In-Feed Ad cada 5 temas]                    |  |Normas | |
| | +---------------------------------------------+  |CTA    | |
| |                                                  |Dir.   | |
| +--------------------------------------------------------------+
| [Footer]                                                      |
```

Mobile: sidebar colapsa bajo el feed; chips con scroll horizontal.

### V2 — Bolsa de Trabajo listado (/es/comunidad?cat=empleo)

````text
+--------------------------------------------------------------+
| BOLSA DE TRABAJO MALLORCA                                    |
| Chips: [Ofertas(12)][Busco trabajo(8)]                       |
| Selects: [Sector v] [Zona v] [Contrato v]   Texto: [buscar]  |
|---------------------------------------------------------------|
| +----------------------------------------------------------+ |
| | JOBCARD OFERTA                                            | |
| | 💼 Camarero/a temporada verano            [Empresa Verif] | |
| | 📍 Calvia y Andratx · ⏱ Temporal · 💶 1300-1500/mes      | |
| | Caduca en 12 dias · 💬 3 preguntas                        | |
| | ----------------------------------------------           | |
| | [Ver detalle]                          [WhatsApp aplicar] | |
| +----------------------------------------------------------+ |
| +----------------------------------------------------------+ |
| | JOBCARD DEMANDA                                           | |
| | 🔎 Fontanero con experiencia busca encargos              | |
| | 📍 Palma · ⏱ Por encargo · Disponibilidad inmediata      | |
| +----------------------------------------------------------+ |
| [In-Feed Ad]                                                  |
| ... paginacion cursor: Cargar mas                             |
+--------------------------------------------------------------+

### V3 — Detalle de oferta (/es/comunidad/[slug])

```text
+--------------------------------------------------------------+
| <- Volver a Comunidad                                        |
| +----------------------------------------------------------+ |
| | 💼 OFERTA · Camarero/a temporada verano    [Verificada ✓] | |
| | por Restaurante Mar Blau (ficha vinculada) · hace 3 dias  | |
| | -------------------------------------------------------- | |
| | DESCRIPCION                                               | |
| | Se incorpora personal para temporada...                   | |
| |                                                          | |
| | [In-Article Ad tras descripcion]                          | |
| |                                                          | |
| | DATOS: Sector Gastronomia · Zona Calvia · Temporal       | |
| | Caduca el 24/09/2026 (en 12 dias)                        | |
| | ----------------------------------------------           | |
| | [WhatsApp] [Email] [Web]      [Denunciar] [Compartir]    | |
| +----------------------------------------------------------+ |
| PREGUNTAS Y RESPUESTAS (3)                                   |
| [reply card] [reply card] [reply card]                       |
| [In-Feed cada 5 respuestas si hilo largo]                    |
| [Formulario responder - auth gate si guest]                  |
+--------------------------------------------------------------+
````

### V4 — Formulario dinamico (comunidad/nuevo)

````text
PASO 1: Elige categoria (radio cards con icono+titulo+desc)
[💼 Empleo] [🏠 Vivienda] [🛒 Mercado] [📅 Eventos] [🚨 Avisos] [☕ Cafe]
     |
     v (campos que MUTAN segun categoria)
+-- empleo ---->+-- vivienda --+-- mercado ---+-- eventos ---+
| Tipo oferta/  | Operacion:   | Estado item: | Fecha*        |
| solicitud*    | alquiler/    | disponible/  | Hora          |
| Puesto*       | compartir/   | reservado/   | Precio?       |
| Sector*       | traspaso     | vendido      |               |
| Zona*         | Zona*        | Zona*?       | Zona?         |
| Contrato*     | Precio?      | Foto URL*    |               |
| Salario?      |              |              |               |
+---------------+--------------+--------------+---------------+
COMUNES: Titulo*(10-120) Descripcion*(30-5000) Contacto*(>=1)
Consentimiento RGPD checkbox* + aviso reglas categoria

### V5 — Mis publicaciones (extension DashboardUser)

```text
MIS PUBLICACIONES
| Tema                  | Categoria | Estado    | Caduca | Acciones       |
|-----------------------|-----------|-----------|--------|----------------|
| Camarero temporada    | 💼 Oferta | 🟢 Activa | 12 d   | [Renovar][Del] |
| Habitacion Palma      | 🏠        | 🟡 Caducado| —     | [Renovar][Del] |
| Taladros segunda mano | 🛒        | ⚪ Reservado| —     | [Marcar vendido]|
````

Renovar = update expiresAt +30d (solo autor). Del = delete propio (rules ya lo permiten).

---

## 4. Capa lib: firmas de funciones

### 4.1 src/lib/jobs.ts (F2)

```typescript
export interface JobQuery {
  kind?: "oferta" | "demanda";
  sector?: string; // CATEGORIES id
  zone?: string; // MALLORCA_ZONES id
  contractType?: JobContractType;
  pageSize?: number; // default 12, max 25
  cursor?: DocumentSnapshot | null;
}

export async function listActiveJobs(
  q: JobQuery,
): Promise<{ items: (ForumTopic & { jobMeta: JobMeta })[]; nextCursor: DocumentSnapshot | null }>;
// query base: where category=='empleo', status=='active', expiresAt > now()
// orden createdAt desc; filtros opcionales encadenables (indices sec. 5.2 roadmap)

export async function createJobTopic(input: {
  kind: JobKind;
  title: string;
  content: string;
  jobMeta: JobMeta;
  author: { uid: string; name: string; avatar?: string };
}): Promise<{ id: string; slug: string }>;
// valida cliente: longitudes, sector/zone en arrays de data/, regex contacto,
// rate-limit 24h/1-oferta via getDocs count sobre authorUid+createdAt>24h

export function daysUntilExpiry(expiresAt: string | Timestamp): number;
export function isExpired(expiresAt: string | Timestamp): boolean;
export function renewJob(topicId: string): Promise<void>; // expiresAt +=30d, solo autor
```

### 4.2 Cambios minimos en community.ts (F1)

```typescript
// Union ampliada + helpers
export const FORUM_MAIN_CATEGORIES = ["empleo", "vivienda", "mercado", "eventos", "avisos", "cafe"] as const;
export const FORUM_LEGACY_CATEGORIES = ["recomendaciones", "preguntas", "experiencias", "guias"] as const;
export type ForumCategory = (typeof FORUM_MAIN_CATEGORIES)[number] | (typeof FORUM_LEGACY_CATEGORIES)[number] | "todas";

export function isMainCategory(c: string): boolean;
export function legacyToCafeSub(c: string): string | null;
// 'recomendaciones' -> 'cafe.recomendaciones' etc.; null si ya es main
```

getForumTopics(category) mantiene firma: si recibe valor legacy filtra por el; la UI de Cafe emite subcategoria compuesta y mapea a OR query client-side (max 4 valores, dentro de limites de filtro IN de Firestore gratuito).

---

## 5. Catalogo i18n completo (GR-04)

Tabla base es.json (en y ca espejo con misma clave). Formato clave | es | en | ca resumido; implementar los 3 archivos siempre.

| Clave                                    | es                                       |
| ---------------------------------------- | ---------------------------------------- |
| forum.cat.empleo                         | Bolsa de Trabajo                         |
| forum.cat.vivienda                       | Vivienda y Alquileres                    |
| forum.cat.mercado                        | Compra-Venta                             |
| forum.cat.eventos                        | Eventos y Quedadas                       |
| forum.cat.avisos                         | Avisos del Vecindario                    |
| forum.cat.cafe                           | Cafe Comunidad                           |
| jobs.kind.oferta                         | Oferta de empleo                         |
| jobs.kind.demanda                        | Busco trabajo / ofrezco servicios        |
| jobs.form.kind                           | Que quieres publicar?                    |
| jobs.form.position                       | Puesto o profesion                       |
| jobs.form.sector                         | Sector                                   |
| jobs.form.zone                           | Zona de Mallorca                         |
| jobs.form.contract                       | Tipo de contrato                         |
| jobs.form.salary                         | Salario (opcional)                       |
| jobs.contract.indefinido                 | Indefinido                               |
| jobs.contract.temporal                   | Temporal / temporada                     |
| jobs.contract.media-jornada              | Media jornada                            |
| jobs.contract.practicas                  | Practicas                                |
| jobs.contract.por-encargo                | Por encargo                              |
| jobs.expires.in                          | Caduca en {n} dias                       |
| jobs.expired                             | Anuncio caducado                         |
| jobs.apply.whatsapp                      | Aplicar por WhatsApp                     |
| jobs.badge.verified                      | Empresa verificada                       |
| jobs.error.contactRequired               | Indica al menos un contacto              |
| jobs.error.rateLimit24h                  | Solo puedes publicar una oferta cada 24h |
| market.state.available / reserved / sold | Disponible / Reservado / Vendido         |
| events.form.date                         | Fecha del evento                         |
| avisos.report                            | Denunciar                                |

---

## 6. SEO para contenido UGC

### 6.1 Schema.org por tipo de pagina

| Vista                 | @type                                | Campos clave                                                                               |
| --------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------ |
| Detalle tema general  | DiscussionForumPosting               | headline, datePublished, author(Persion), interactionStatistic(Comment)                    |
| Detalle oferta empleo | JobPosting* + DiscussionForumPosting | title, hiringOrganization, jobLocation, employmentType, datePosted, validThrough=expiresAt |
| Listado bolsa         | CollectionPage + ItemList            | itemListElement referenciando JobPosting                                                   |

*JobPosting solo si kind=oferta y hay empresa verificada vinculada; si no, cae a DiscussionForumPosting (evita rich-result penalties por datos incompletos).

### 6.2 Meta tags por detalle (BaseLayout props ya soporta title/description)

- title: {titulo tema} - Comunidad Servicios Mallorca
- description: primeros 155 chars de content
- canonical: URL absoluta con locale
- robots: index,follow (temas activos); noindex si status!=active
- hreflang x3 apuntando al mismo slug en cada locale cuando exista; si no existe traduccion del tema, hreflang a la version es como fallback con x-default

### 6.3 Sitemap y descubrimiento

@astrojs/sitemap cubre rutas estaticas; los temas son SSR dinamico -> generar sitemap-forum.xml desde endpoint /sitemap-forum.xml.ts leyendo top N temas activos (cache 1h en memoria) y referenciarlo desde robots.txt.

---

## 7. Estados de interfaz

| Estado                         | Trigger                          | Visual                                                                                     |
| ------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------ |
| Loading inicial                | fetch en curso                   | Skeleton cards (3x) con animacion shimmer, NO spinner bloqueante                           |
| Vacio categoria                | 0 resultados con filtros         | Ilustracion emoji + texto accionable + CTA Publicar el primero                             |
| Sin conexion / error Firestore | catch                            | Toast error + boton Reintentar inline                                                      |
| Caducado                       | expiresAt < now                  | Card atenuada opacity .6 + badge Caducado; detalle muestra aviso y oculta botones contacto |
| Auth gate                      | guest intenta publicar/responder | Panel inline con icono candado + botones Login/Registro (patron actual se mantiene)        |
| Rate limit                     | 2a oferta <24h                   | Toast warning jobs.error.rateLimit24h                                                      |

---

## 8. Accesibilidad especifica del foro (GR-07)

| Elemento            | Requisito                                                     |
| ------------------- | ------------------------------------------------------------- |
| Chips de categoria  | role=tablist; aria-selected en activo; navegacion con flechas |
| Cards clicables     | El titulo es <a> real; card entera NUNCA div onclick          |
| Badges informativos | aria-label descriptivo (Caduca en 12 dias, no solo 12d)       |
| Formulario dinamico | labels for/id; errores aria-describedby y focus al primero    |
| Botones contacto    | aria-label con contexto: Aplicar por WhatsApp a {puesto}      |
| Skeleton loading    | aria-busy=true en el contenedor del feed mientras carga       |
| Denunciar           | dialog nativo o modal con focus trap y cierre Escape          |
| Contraste badges    | Ratio AA verificado sobre var(--color-*-bg) en los 4 temas    |

---

## 9. Criterios de aceptacion por fase

### F1 - Taxonomia

- [ ] Las 6 categorias nuevas renderizan con icono y traduccion x3
- [ ] URL legacy ?categoria=recomendaciones redirige suave a Cafe
- [ ] Test community.test.ts actualizado: union de 11 valores + helpers isMainCategory/legacyToCafeSub
- [ ] Paridad i18n verificada por suite existente
- [ ] H-01/H-03 resueltos: nombre canonico del campo contenido + limites alineados rules/formulario
- [ ] H-05 mitigado: feed y respuestas renderizan con createElement/textContent (anti-XSS)

### F2 - Bolsa MVP

- [ ] Publicar oferta exige >=1 contacto; regex E.164/email/URL validados
- [ ] listActiveJobs nunca devuelve expiresAt <= now (test de composicion de query con mock)
- [ ] Badge Empresa Verificada si authorUid es manager de negocio verified=true, con enlace a ficha
- [ ] Schema JobPosting SOLO en ofertas con empresa vinculada
- [ ] Renovar suma 30 dias; rules lo bloquean para no-autores
- [ ] Rate-limit cliente 24h con mensaje jobs.error.rateLimit24h
- [ ] AdSense In-Feed cada 5 items sin CLS > 0.1

### F3 - Mercado

- [ ] Estados available/reserved/sold transitables SOLO por autor; badge visual en card
- [ ] Foto URL obligatoria validada https y no duplicada del mismo autor consecutiva
- [ ] Filtro Solo gratis funcional

### F4 - Eventos/Avisos

- [ ] Eventos sin fecha futura caen al final; orden proximos primero en listado
- [ ] Subcategoria perdidos/encontrados permite marcar Resuelto por autor

### F5 - Moderacion

- [ ] Pestana Foro en DashboardAdmin lista reportados y primeros-posts-pendientes
- [ ] Accion Eliminar registra motivo en subcoleccion forum_moderation_log (solo admin)
- [ ] purge:forum --dry-run lista sin borrar; ejecucion real requiere flag --confirm

---

_Spec operativa del foro. Cualquier desviacion durante implementacion se documenta aqui antes del merge (GR-06)._
