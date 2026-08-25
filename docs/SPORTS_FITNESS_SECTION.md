# 🏋️ Sección Deporte, Fitness & Espacios de Actividad — Servicios Mallorca

> **Documento maestro de la nueva vertical deportiva.** Define la visión, la taxonomía, las
> oportunidades SEO y el plan de activación para cubrir **gimnasios, centros deportivos,
> estudios especializados, deportes al aire libre y espacios públicos de actividad física**
> en toda la isla. Se rige por **GR-11 (Zero Fake Data)**, **GR-12 (Fidelidad Maps)** y
> **P-04** (una categoría solo se activa con negocios reales verificados).

---

## 1. 🎯 Visión estratégica

La vertical deportiva convierte Servicios Mallorca en el **directorio de referencia del
entrenamiento y la actividad física en la isla**, cubriendo tanto el ecosistema **comercial**
(gimnasios, clubes, escuelas, estudios) como el **público y gratuito** (parques de calistenia,
pistas, circuitos, piscinas municipales) que **ningún competidor cubre**.

### 1.1 Por qué ahora

| Señal                                                                                                        | Implicación                                                               |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Mallorca es capital europea del **ciclismo y el triatlón** (concentraciones de equipos ProTour en invierno). | Alta demanda de servicios deportivos B2B2C y contenido en inglés/alemán.  |
| Gran comunidad **expat** (alemana, británica, nórdica) que entrena todo el año.                              | Búsquedas en `en`, `de` + clases dirigidas en esos idiomas.               |
| Turismo masivo **8 meses/año** también quiere entrenar durante las vacaciones.                               | Los **day-passes** y gimnasios 24h son diferenciales a destacar.          |
| Estilo de vida saludable **post-COVID** consolidado.                                                         | Categorías de yoga/pilates/funcional en pleno crecimiento.                |
| **Nadie indexa los espacios públicos deportivos gratuitos** de Mallorca.                                     | Oportunidad SEO **long-tail casi sin competencia** → autoridad (E-E-A-T). |

### 1.2 Públicos objetivo

| Segmento                  | Necesidad                                                     | Contenido / filtros que le sirven                      |
| ------------------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| **Residentes**            | Encontrar gimnasio/pádel/ciclo cerca de casa con precio claro | Filtros por zona, modalidad, precio, horario           |
| **Expats (DE/EN/Nordic)** | Clases y entrenadores que hablen su idioma                    | `languagesSpoken`, guías trilingües, clubes sociales   |
| **Turistas activos**      | Entrenar durante las vacaciones                               | Badge **day-pass**, rutas de running, alquiler de bici |
| **Familias**              | Escuelas multideporte infantiles, campus, natación niños      | Filtro `aud:familias`, categorías de escuelas          |
| **Deportistas serios**    | Triatlón, ciclismo, trail, preparación física                 | Clubes, bike-fit, guías de montaña, instalaciones      |

---

## 2. 🗂️ Taxonomía propuesta (Nivel 2 → Nivel 3)

Todas las categorías cuelgan del super-sector existente **`deportes-aire-libre` (SS-15)** de
`src/data/categories.ts`. Hasta que haya negocios verificados quedan en **modo "mapa"**
(documentado en `TAXONOMY_SCALE.md`); se activan en `CATEGORIES` categoría a categoría (P-04).

> ℹ️ **Nota de numeración:** el mapa de proyección `TAXONOMY_SCALE.md` numera esta vertical como
> **SS-11** (orden de proyección); el **código oficial vigente** en la taxonomía viva es **SS-15**
> (`deportes-aire-libre`). Ante cualquier conflicto, manda siempre el código de `src/data/categories.ts`.

### 2.1 Gimnasios & Fitness

| Campo                 | Valor                                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **id**                | `gimnasios-fitness`                                                                                                              |
| **icono**             | 🏋️                                                                                                                               |
| **Nombre (es/en/ca)** | Gimnasios & Centros de Fitness / Gyms & Fitness Centers / Gimnasos & Centres de Fitness                                          |
| **Tipos de servicio** | Gimnasio tradicional · box CrossFit · entrenamiento funcional · sala HIIT/bootcamp · musculación · sala de cardio · gimnasio 24h |
| **Tags sugeridos**    | `mod:walk-in`, `mod:cita-previa`, `aud:familias`, `product:premium`, `product:accesible`                                         |
| **Colores**           | `#f97316`                                                                                                                        |

### 2.2 Entrenamiento Personal & Coaching

| Campo                 | Valor                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **id**                | `entrenamiento-personal`                                                                                                    |
| **icono**             | 🎯                                                                                                                          |
| **Nombre (es/en/ca)** | Entrenamiento Personal & Coaching / Personal Training & Coaching / Entrenament Personal & Coaching                          |
| **Tipos de servicio** | Entrenador personal · preparador físico · online coach · valoración física · nutrición deportiva · readaptación de lesiones |
| **Tags sugeridos**    | `mod:cita-previa`, `mod:online`, `mod:hibrido`, `mod:a-domicilio`                                                           |

### 2.3 Pilates, Yoga & Cuerpo-Mente

| Campo                 | Valor                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **id**                | `estudios-cuerpo-mente`                                                                                          |
| **icono**             | 🧘                                                                                                               |
| **Nombre (es/en/ca)** | Pilates, Yoga & Cuerpo-Mente / Pilates, Yoga & Mind-Body / Pilates, Ioga & Cos-Ment                              |
| **Tipos de servicio** | Estudio de yoga · pilates (clásico/reformer) · barre · gyrotonic · meditación & mindfulness · stretching · danza |
| **Tags sugeridos**    | `mod:cita-previa`, `aud:parejas`, `product:premium`                                                              |

### 2.4 Artes Marciales & Boxeo

| Campo  | Valor                   |
| ------ | ----------------------- |
| **id** | `artes-marciales-boxeo` |

### 2.5 Pádel, Tenis & Raqueta

| Campo                 | Valor                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **id**                | `padel-tenis-raqueta`                                                                                            |
| **icono**             | 🎾                                                                                                               |
| **Nombre (es/en/ca)** | Pádel, Tenis & Raqueta / Padel, Tennis & Racket / Pàdel, Tennis & Raqueta                                        |
| **Tipos de servicio** | Club de pádel · alquiler de pista · escuela de pádel · club de tenis · pickleball · bádminton · squash · frontón |
| **Tags sugeridos**    | `mod:walk-in`, `mod:cita-previa`, `aud:parejas`                                                                  |

### 2.6 Natación & Deportes Acuáticos

| Campo                 | Valor                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **id**                | `natacion-deportes-acuaticos`                                                                                          |
| **icono**             | 🏊                                                                                                                     |
| **Nombre (es/en/ca)** | Natación & Deportes Acuáticos / Swimming & Water Sports / Natació & Esports Aqüàtics                                   |
| **Tipos de servicio** | Club de natación · piscina cubierta · escuela de natación · aquagym · surf · paddle surf · windsurf · kitesurf · buceo |
| **Tags sugeridos**    | `temps:verano`, `aud:familias`                                                                                         |

### 2.7 Ciclismo, Running & Trail

| Campo                 | Valor                                                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **id**                | `ciclismo-running-trail`                                                                                                      |
| **icono**             | 🚴                                                                                                                            |
| **Nombre (es/en/ca)** | Ciclismo, Running & Trail / Cycling, Running & Trail / Ciclisme, Running & Trail                                              |
| **Tipos de servicio** | Club ciclista · alquiler de bici con guía · bike fit · tienda especializada · club de running · trail running · rutas guiadas |
| **Tags sugeridos**    | `mod:en-local`, `mod:online`, `temps:todo-el-ano`                                                                             |

### 2.8 Golf

| Campo                 | Valor                                                                            |
| --------------------- | -------------------------------------------------------------------------------- |
| **id**                | `golf`                                                                           |
| **icono**             | ⛳                                                                               |
| **Nombre (es/en/ca)** | Golf / Golf / Golf                                                               |
| **Tipos de servicio** | Campo de golf · club de golf · escuela de golf · pitch & putt · simulador indoor |
| **Tags sugeridos**    | `product:premium`, `product:lujo`, `aud:seniors`                                 |

### 2.9 Hípica & Equitación

| Campo                 | Valor                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| **id**                | `equitacion-hipica`                                                                              |
| **icono**             | 🐴                                                                                               |
| **Nombre (es/en/ca)** | Hípica & Equitación / Horse Riding & Equestrian / Hípica & Equitació                             |
| **Tipos de servicio** | Centro ecuestre · escuela de hípica · rutas a caballo · horse resort · doma                      |
| **Tags sugeridos**    | `aud:familias`, `aud:parejas`                                                                    |
| **icono**             | 🥋                                                                                               |
| **Nombre (es/en/ca)** | Artes Marciales & Boxeo / Martial Arts & Boxing / Arts Marcials & Boxa                           |
| **Tipos de servicio** | Boxeo · kickboxing · muay thai · jiu-jitsu brasileño · judo · karate · taekwondo · MMA · esgrima |
| **Tags sugeridos**    | `aud:familias`, `mod:cita-previa`                                                                |

### 2.10 Senderismo, Montaña & Aventura

| Campo                 | Valor                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **id**                | `deportes-montana-aventura`                                                                                      |
| **icono**             | 🧗                                                                                                               |
| **Nombre (es/en/ca)** | Senderismo, Montaña & Aventura / Hiking, Mountain & Adventure / Senderisme, Muntanya & Aventura                  |
| **Tipos de servicio** | Guía de montaña · senderismo · trekking · escalada · barranquismo · espeleología · parque de aventura · tirolina |
| **Tags sugeridos**    | `temps:verano`, `mod:cita-previa`, `mod:a-domicilio`                                                             |

### 2.11 Clubes, Escuelas & Deporte en Equipo

| Campo                 | Valor                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **id**                | `clubes-escuelas-deportivas`                                                                                        |
| **icono**             | 🏀                                                                                                                  |
| **Nombre (es/en/ca)** | Clubes, Escuelas & Deporte en Equipo / Clubs, Schools & Team Sports / Clubs, Escoles & Esport d'Equip               |
| **Tipos de servicio** | Escuela de fútbol · baloncesto · fútbol sala · voleibol · multideporte infantil · campus · club amateur · formación |
| **Tags sugeridos**    | `aud:familias`                                                                                                      |

### 2.12 Espacios Públicos & Instalaciones Deportivas ⭐ (diferenciador)

| Campo                 | Valor                                                                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **id**                | `espacios-deportivos-publicos`                                                                                                                                                            |
| **icono**             | 🏟️                                                                                                                                                                                        |
| **Nombre (es/en/ca)** | Espacios Públicos & Instalaciones Deportivas / Public Sports Spaces & Facilities / Espais Públics & Instal·lacions Esportives                                                             |
| **Modelo**            | **No comercial** — puntos de interés gratuitos (no `ServiceItem` de negocio; se modelan como **guías** en la web, no como ficha de pago).                                                 |
| **Tipos de espacio**  | Parques de calistenia · skateparks · pistas públicas · circuitos de running · velódromo · piscinas municipales · rocódromos públicos · campos públicos · parques de fitness al aire libre |

> **Por qué importa (SEO):** nadie los cataloga. Una guía "**mejores parques de calistenia de Palma**" o
> "**circuitos de running por zonas de Mallorca**" genera búsquedas long-tail, backlinks y autoridad
> temática que refuerza todo el resto de la vertical. Es contenido editorial (posts), no ficha de negocio.

---

#### 2.12.1 Cómo se modelan (decisión técnica)

Los espacios públicos **NO son `ServiceItem`**: no tienen teléfono comercial, ni precios comparables,
ni reseñas de negocio, y tratarlos como fichas comerciales debilitaría la veracidad del catálogo
(GR-11/GR-12). Se publican como **guías editoriales** (`BlogPost` de `src/data/posts.ts`) con
`postType: "guia"` o `"top_list"`.

| Aspecto                | Implementación                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Contenedor             | `BLOG_POSTS[]` en `src/data/posts.ts`                                                                                         |
| Tipo                   | `postType: "guia"` (guía por zona/disciplina) o `"top_list"` (ranking de espacios)                                            |
| Cluster temático       | Nuevo `TopicCluster` propuesto: `"deporte_fitness"` (no existe aún; requiere ampliar el union type y su i18n)                 |
| Enlace con la vertical | `category: "espacios-deportivos-publicos"` + `relatedServiceIds` hacia fichas deportivas cercanas (cross-linking SEO interno) |
| Tags                   | `zona:<macro-zona>` del catálogo cerrado (`src/data/tags.ts`, P-02) + `temps:*`; nunca texto libre                            |
| Schema.org del post    | `TouristAttraction` + `SportsActivityLocation`, con `ItemList` de los espacios inventariados                                  |

Campos estructurados recomendados **dentro del contenido** de cada guía (tabla markdown por espacio,
mantenible sin tocar el modelo TypeScript):

`nombre oficial · tipo de espacio · municipio/zona · coordenadas (GR-12 ≥90%) · acceso (libre u horario municipal) · equipamiento · foto propia/licencia clara · fuente oficial (ayuntamiento, IME, Consell) · lastVerifiedAt`.

#### 2.12.2 Protocolo de verificación adaptado (GR-11 para espacios públicos)

Al no haber teléfono ni reseñas que contrastar, el checkpoint de confianza cambia de fuente:

1. **Fuente primaria municipal:** web del ayuntamiento, IME (Institut Municipal d'Esports de Palma),
   Consell de Mallorca o web oficial de la instalación. La existencia del espacio debe ser citable.
2. **Coordenadas:** pin de Google Maps dentro del recinto (fidelidad ≥90%, GR-12) + enlaces multi-mapa.
3. **Imagen:** foto propia o Wikimedia Commons con licencia clara; stock prohibido (regla anti-stock del repo).
4. **Estado real:** evidencia reciente (<12 meses) de que el espacio está operativo y accesible; registrar `lastVerifiedAt`.
5. **i18n completo `es/en/ca` (GR-04)**, igual que cualquier ficha del catálogo.

#### 2.12.3 Backlog de guías propuestas (materia prima de F5)

> Todas las entradas son **leads a verificar**, no datos publicados (GR-11).

| Guía (slug propuesto)                     | Zona             | Espacios a inventariar                                                 |
| ----------------------------------------- | ---------------- | ---------------------------------------------------------------------- |
| `guia-calistenia-palma`                   | Palma            | Parques con barras/aparatos (ses Estacions, zona Playa de Palma…)      |
| `guia-skateparks-mallorca`                | Isla completa    | Skatepark sa Foixarda (Passeig Marítim) + skateparks comarcales        |
| `guia-running-palma-circuitos`            | Palma            | Passeig Marítim (~4,5 km costeros), entorno Bellver, Can Dragó         |
| `guia-piscinas-municipales-palma`         | Palma            | Complejos municipales (p. ej., Son Hugo), horarios y tarifas oficiales |
| `guia-ciclismo-tramuntana-rutas-publicas` | Serra Tramuntana | Vía verde, Camí de s'Arxiduc, puertos clásicos de carretera            |
| `guia-deporte-familiar-parques`           | Isla completa    | Pistas polideportivas libres, campos públicos, rocódromos              |

---

## 3. 🔎 Mapa de oportunidades SEO

### 3.1 Schema.org por categoría (para `src/lib/jsonLdGenerator.ts`)

| Categoría                      | Tipos `@type` Schema.org                              |
| ------------------------------ | ----------------------------------------------------- |
| `gimnasios-fitness`            | `SportsActivityLocation`, `ExerciseGym`, `HealthClub` |
| `entrenamiento-personal`       | `SportsActivityLocation`, `PersonalTrainer`           |
| `estudios-cuerpo-mente`        | `HealthClub`, `SportsActivityLocation`                |
| `artes-marciales-boxeo`        | `SportsActivityLocation`                              |
| `padel-tenis-raqueta`          | `SportsActivityLocation`, `TennisComplex`             |
| `natacion-deportes-acuaticos`  | `SportsActivityLocation`, `SwimmingPool`              |
| `ciclismo-running-trail`       | `SportsActivityLocation`, `LocalBusiness`             |
| `golf`                         | `GolfCourse`, `SportsActivityLocation`                |
| `equitacion-hipica`            | `LocalBusiness`, `SportsActivityLocation`             |
| `deportes-montana-aventura`    | `SportsActivityLocation`, `TouristInformationCenter`  |
| `clubes-escuelas-deportivas`   | `SportsClub`, `SportsActivityLocation`                |
| `espacios-deportivos-publicos` | `TouristAttraction`, `SportsActivityLocation`         |

### 3.2 Keywords objetivo (intención + volumen cualitativo)

| Categoría              | Keywords primarias (ES)                                                                                      | Keywords secundarias (EN/DE)                                                   | Intención                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | --------------------------- |
| Gimnasios              | "gimnasio cerca de mí Palma", "mejores gimnasios de Palma", "crossfit Mallorca precio", "gimnasio 24h Palma" | "gym Palma English", "Fitnessstudio Mallorca", "Mallorca gym day pass"         | Transaccional / local       |
| Entrenamiento personal | "entrenador personal Palma", "personal trainer Mallorca expat", "coach online"                               | "personal trainer Palma English", "Fitnesstrainer Mallorca"                    | Transaccional               |
| Yoga/Pilates           | "yoga en Mallorca", "pilates reformer Palma", "yoga en inglés Palma"                                         | "yoga classes Mallorca English", "Pilatestudio Palma"                          | Transaccional/informativa   |
| Pádel/Tenis            | "alquilar pista de padel Palma", "club de tenis Mallorca", "escuela padel niños Palma"                       | "padel court rental Palma", "tennis club Mallorca"                             | Transaccional               |
| Natación               | "club natación Palma", "piscina cubierta Mallorca", "cursos natación adultos"                                | "swimming club Palma", "covered pool Mallorca"                                 | Transaccional               |
| Ciclismo               | "alquiler bici carretera Mallorca", "club ciclista Mallorca", "triathlon training Mallorca"                  | "road bike hire Mallorca", "cycling hotel Mallorca", "Triathlon Camp Mallorca" | Transaccional/B2B2C         |
| Golf                   | "campo de golf Mallorca", "green fee Son Vida", "escuela golf Palma"                                         | "Mallorca golf courses", "golf green fees"                                     | Transaccional/alta          |
| Hípica                 | "rutas a caballo Mallorca", "escuela hípica Palma"                                                           | "horse riding Mallorca", "Mallorca horseback tours"                            | Transaccional/ocio          |
| Aventura               | "senderismo guiado Tramuntana", "escalada Mallorca", "barranquismo Mallorca"                                 | "guided hiking Mallorca", "climbing Mallorca"                                  | Transaccional/informativa   |
| Espacios públicos      | "parque calistenia Palma", "skatepark Mallorca", "circuito running Palma", "pista padel gratis Palma"        | "calisthenics park Palma", "public running track Mallorca"                     | **Informativa / long-tail** |
| Escuelas/clubes        | "escuela fútbol niños Mallorca", "campus verano deporte Palma"                                               | "kids football academy Mallorca"                                               | Familiar                    |

### 3.3 Estrategia de contenido (E-E-A-T)

1. **Guías de espacios públicos gratuitos** (diferenciador) — por zona (Palma, Tramuntana, Llevant…).
2. **Guías por disciplina** — "mejores zonas de ciclismo de Mallorca", "rutas de running por el paseo marítimo".
3. **Rankings anuales** — "Top gimnasios de Palma 2026" (reutiliza el motor de ranking del checklist).
4. **FAQ trilingües** — "¿Cuánto cuesta un gimnasio en Palma?", "¿Dónde entrenar yoga en inglés?", "¿Dónde alquilar una bici de carretera?".
5. **Siempre con datos reales** (GR-11): fotos, horarios, precios y mapas verificados + `lastVerifiedAt`.
6. **i18n en 3 idiomas** (es/en/ca) en todo contenido y filtros (GR-04).

### 3.4 Impacto esperado

| Métrica                                               | Proyección                                        |
| ----------------------------------------------------- | ------------------------------------------------- |
| Keywords long-tail con baja competencia capturables   | **180–300** (espacios públicos, yoga, calistenia) |
| Negocios reales modelables en Mallorca                | **800+** (según `TAXONOMY_SCALE.md`)              |
| Páginas indexables nuevas (hub + categorías + fichas) | +80–120 iniciales                                 |
| Señal de autoridad (E-E-A-T)                          | Alta vía guías gratis + datos verificados         |

---

## 4. 🖥️ Experiencia de usuario propuesta

| Elemento                          | Detalle                                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| **Hub `/servicios/deporte`**      | Landíng vertical con subsecciones por categoría deportiva + filtros                       |
| **Filtros específicos**           | Modalidad · 24h · day-pass **turista** · clases en inglés/alemán · precio · accesible PMR |
| **Badges**                        | `Day Pass` para turistas · `24h` · `EN/DE spoken` · `Free (espacios públicos)`            |
| **Mapa de espacios públicos**     | Capa interactiva con parques de calistenia, pistas, circuitos y skateparks gratuitos      |
| **Guías editoriales**             | Posts enlazados desde categorías (rutas de running, calistenia, ciclismo)                 |
| **Ficha `ServiceItem` deportiva** | Reutiliza los 5 pilares del SOP (+ `schedule` real, `amenities`, `faqs`)                  |

---

### 4.1 Especificación de filtros (fuente de verdad por faceta)

Los filtros reutilizan catálogos existentes (P-02); ningún filtro introduce texto libre:

| Filtro UI           | Fuente de datos                                            | Ejemplos                                            |
| ------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| Zona                | `MALLORCA_ZONES` + tags `zona:*` derivados automáticamente | palma, calvia-andratx, manacor-llevant              |
| Categoría deportiva | `CATEGORIES` bajo SS-15                                    | gimnasios-fitness, padel-tenis-raqueta…             |
| Modalidad           | dominio `mod:*` de `tags.ts`                               | walk-in, cita-previa, online, hibrido               |
| Audiencia           | dominio `aud:*`                                            | familias, parejas, expat, seniors                   |
| Estacionalidad      | dominio `temps:*`                                          | verano, todo-el-ano                                 |
| Rango de precio     | campo `priceRange` (€–€€€€)                                | €, €€, €€€                                          |
| Abierto ahora       | campo `schedule` parseado                                  | —                                                   |
| Idiomas hablados    | array `languagesSpoken`                                    | es, en, ca (valor `de` solo si se amplía el modelo) |

### 4.2 Badges: condiciones de activación (derivadas, nunca manuales)

Un badge aparece **solo si el dato estructurado lo respalda** — evita marketing vacío (GR-11):

| Badge          | Condición técnica                                                   | Nota                                 |
| -------------- | ------------------------------------------------------------------- | ------------------------------------ |
| `Day Pass`     | `amenities` incluye day-pass o `pricing.rateType === "per_session"` | Prioritario para el segmento turista |
| `24h`          | `schedule` con franja 00:00–24:00 verificada en la minería          | Nunca inferir; solo horario minado   |
| `EN/DE spoken` | `languagesSpoken` incluye `en` / `de`                               | Refuerza búsquedas expat y turista   |
| `Free`         | Contenido de `espacios-deportivos-publicos` (guías editoriales)     | Solo posts, jamás fichas comerciales |
| `Kids`         | tag `aud:familias` o `servicesProvided` infantil                    | Segmento familias                    |

### 4.3 Convención i18n (GR-04)

Claves agrupadas bajo `sports.*`: `sports.hub.title`, `sports.filter.<faceta>`,
`sports.badge.<badge>` y `sports.category.<id>` (estas últimas reutilizan los labels trilingües de
`categories.ts`). Prohibido hardcodear textos de la vertical fuera de los bundles i18n `es/en/ca`.

---

## 5. 🚦 Plan de activación (fases controladas)

> Cumple **P-04** de `TAXONOMY.md`: las categorías se activan en `src/data/categories.ts` **solo cuando
> tengan ≥1 negocio real verificado** (GR-11/GR-12). Nunca se publican categorías vacías.

| Fase           | Acción                                                                                       | Entregable                                     | Validación                               |
| -------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| **F0 (hecho)** | Este documento + blueprint de descubrimiento deportivo                                       | `docs/SPORTS_FITNESS_SECTION.md`               | —                                        |
| **F1**         | Primer lote de candidatos reales (gimnasios, pádel, golf, natación)                          | `scripts/discovery-targets-sports.json`        | minería real vía `npm run discover:mine` |
| **F2**         | Curar 4–6 fichas deportivas reales (SOP 4 pasos) y activar sus categorías en `categories.ts` | `src/data/services/deportes-fitness/`          | `typecheck && test && validate:taxonomy` |
| **F3**         | Mapeo Schema.org deportivo en `jsonLdGenerator.ts`                                           | tipos `ExerciseGym`, `SportsActivityLocation`… | tests + Rich Snippets                    |
| **F4**         | Hub `/servicios/deporte` + filtros + badges                                                  | páginas Astro + i18n `es/en/ca`                | build + Lighthouse                       |
| **F5**         | Guías editoriales de espacios públicos gratuitos                                             | posts en 3 idiomas                             | analytics + backlinks                    |

**Ritmo recomendado:** 2–3 fichas deportivas/día (cuadruplicable con `--ingest-verified` del motor).

#### 📸 Snapshot de estado real (revisión 2026-08-25)

| Fase | Estado        | Evidencia verificada en el repo                                                                                        |
| ---- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| F0   | ✅ Hecho      | Este documento                                                                                                         |
| F1   | ✅ Hecho      | Blueprint minado con resultados verificados (**ver §8**): 2 listos para ingesta, 5 en triaje                           |
| F2   | ⏭️ Siguiente  | Ingesta de Golf Son Vida + Son Muntaner → crear `src/data/services/deportes-fitness/` y activar `golf` en `CATEGORIES` |
| F3   | ✅ Adelantado | `src/lib/jsonLdGenerator.ts` (bloque "Vertical Deportiva") mapea las 12 categorías                                     |
| F4   | ❌ Pendiente  | Sin páginas `/servicios/deporte` en `src/pages`                                                                        |
| F5   | ❌ Pendiente  | Sin guías deportivas en `src/data/posts.ts` (ver §2.12.1–2.12.3 para el modelo)                                        |

> El adelanto de F3 sobre F2 es seguro: el `switch` de `getSchemaTypeForCategory` solo aplica cuando
> existan servicios con esas categorías, así que activar F2 no exigirá reescribirlo, solo ajustes finos.

---

## 6. 📦 Inventario inicial de candidatos reales (primer lote F1)

> Negocios **reales y verificables** de Mallorca (a minar con `harvestBusinessIntelligence`,
> que contrasta la ficha oficial de Google Maps y la web — GR-11/GR-12). Las fichas solo se
> publican tras pasar el checkpoint del SOP.

| Negocio (real)           | Sector propuesto | Zona                   | Por qué                                         |
| ------------------------ | ---------------- | ---------------------- | ----------------------------------------------- |
| Basic-Fit Palma          | Gimnasios        | Palma                  | Franquicia global, gimnasio 24h, ideal day-pass |
| AltaFit (varios centros) | Gimnasios        | Palma / Inca / Manacor | Cadena balear local de referencia               |
| Rafa Nadal Sports Centre | Tenis/Fitness    | Manacor                | Instalación premium de renombre internacional   |
| Golf Son Vida            | Golf             | Palma                  | Campo histórico en Son Vida                     |
| Golf Son Muntaner        | Golf             | Palma                  | Club tradicional céntrico                       |
| Golf de Andratx          | Golf             | Calvià & Andratx       | Campo de 27 hoyos junto al mar                  |
| Arabella Golf Mallorca   | Golf             | Palma                  | Resort con 3 recorridos                         |
| CrossFit Mallorca        | CrossFit         | Palma                  | Box community más veterano                      |
| Club Natació Palma       | Natación         | Palma                  | Club histórico + piscina + triatlón             |
| Mallorca Cycling Store   | Ciclismo         | Palma                  | Alquiler, service y salidas de grupo            |

> ⚠️ **Nota de veracidad:** esta tabla es una **guía de descubrimiento**, no un catálogo publicado.
> Cada negocio debe pasar minería y los checkpoints del `AGENT_CURATION_SOP.md` antes de publicarse.

#### Cobertura del script F1 vs este documento

El blueprint `scripts/discovery-targets-sports.json` incluye hoy **9 de los 10** candidatos de la tabla
anterior — falta **Mallorca Cycling Store** (`ciclismo-running-trail`). Al ampliar el JSON respetar el
formato `{ name, website, categoryHint, zoneHint }` y minar con `npm run discover:sports`.

#### Leads adicionales para categorías sin candidato (verificar antes de publicar)

| Lead (real, por confirmar)     | Categoría objetivo         | Zona  | Por qué                                          |
| ------------------------------ | -------------------------- | ----- | ------------------------------------------------ |
| Zunray Yoga                    | estudios-cuerpo-mente      | Palma | Estudio de yoga consolidado, clases multilingües |
| RCD Mallorca Academy           | clubes-escuelas-deportivas | Palma | Academia del club referente de la isla           |
| CD Atlético Baleares (cantera) | clubes-escuelas-deportivas | Palma | Club histórico con formación juvenil             |

Para **artes marciales** y **montaña/aventura** aún no hay anclas nombradas: minar primero con queries
tipo `"artes marciales palma"`, `"club boxeo mallorca"`, `"guias montana tramuntana empresa"`,
`"barranquismo guiado mallorca"` vía `npm run discover:mine` y añadir al blueprint únicamente nombres
con web oficial verificable (GR-11).

---

## 8. 📊 Resultados de Minería Real — F1 Verificado (2026-08-25)

> Minería ejecutada con `npm run discover:mine -- --file=scripts/discovery-targets-sports.json`.
> Los resultados confirman que el pipeline de detección categorial funciona para deportes (detectó automáticamente `golf` y `gimnasios-fitness`), pero la calidad de extracción de teléfono es variable.

### 8.1 Resumen Ejecutivo

- **Candidatos explorados:** 9 de la lista F1
- **Detectados y categorizados automáticamente:** 7 (2 golf + 3 gimnasios + 2 "otro")
- **Listos para ingesta (score ≥70, teléfono real):** 2 → Golf Son Vida, Golf Son Muntaner
- **En triaje (requieren verificación manual de teléfono):** 5 → Basic-Fit, AltaFit, CrossFit, Arabella, Golf Andratx
- **Telefonos con placeholder `+34 000 000 000` detectados:** 5 de 9 → indica web sin teléfono visible al scrapear

### 8.2 Tabla de Resultados Detallados

|     | Negocio                | Categoría detectada | Score    | Teléfono           | Maps URL                                                                           | Estado                      |
| --- | ---------------------- | ------------------- | -------- | ------------------ | ---------------------------------------------------------------------------------- | --------------------------- |
| ✅  | **Golf Son Vida**      | `golf`              | 70 pts   | +34 971 783 000    | [Maps](https://www.google.com/maps/search/?api=1&query=Golf+Son+Vida+Mallorca)     | 🌟 Listo Ingesta            |
| ✅  | **Golf Son Muntaner**  | `golf`              | 70 pts   | +34 971 783 000    | [Maps](https://www.google.com/maps/search/?api=1&query=Golf+Son+Muntaner+Mallorca) | 🌟 Listo Ingesta            |
| ⚠️  | Basic-Fit Palma        | `gimnasios-fitness` | 65 pts   | +34 000 000 000 ❌ | [Maps](https://www.google.com/maps/search/?api=1&query=Basic-Fit+Palma+Mallorca)   | Triaje → verificar teléfono |
| ⚠️  | CrossFit Mallorca      | `gimnasios-fitness` | 64.3 pts | +34 000 000 000 ❌ | [Maps](https://www.google.com/maps/search/?api=1&query=CrossFit+Mallorca)          | Triaje → verificar teléfono |
| ⚠️  | AltaFit Palma          | `gimnasios-fitness` | 57.5 pts | +34 000 000 000 ❌ | [Maps](https://www.google.com/maps/search/?api=1&query=AltaFit+Palma+Mallorca)     | Triaje → verificar teléfono |
| ⚠️  | Arabella Golf Mallorca | `golf`              | 57.5 pts | +34 000 000 000 ❌ | [Maps](https://www.google.com/maps/search/?api=1&query=Arabella+Golf+Mallorca)     | Triaje → verificar teléfono |
| ⚠️  | Golf de Andratx        | `golf`              | 57.5 pts | +34 000 000 000 ❌ | [Maps](https://www.google.com/maps/search/?api=1&query=Golf+de+Andratx+Mallorca)   | Triaje → verificar teléfono |

### 8.3 Conclusión de Viabilidad

**Viable ✅.** El motor `discover-businesses.ts` detecta automáticamente categorías deportivas (`golf`, `gimnasios-fitness`) sin necesidad de categorías previas en `categories.ts`. Se confirma que:

1. El detector de categorías del `orchestrator.ts` es funcional para deporte (detecta "golf" y "gimnasio/fitness" del DOM).
2. El pipeline F1→F2 funciona: minería → checklist → candidatos listos para ingesta.
3. Los dos campos de golf con teléfono real (Son Vida, Son Muntaner) pueden publicarse ya mediante F2.

**Pendiente plano:** los gimnasios necesitan verificación manual del teléfono (Basic-Fit Palma es franquicia global, el número local hay que confirmar vía Google Maps o web local). No publicar sin teléfono verificado (GR-11).

---

## 9. 📚 Fuentes y documentos relacionados

- **`docs/TAXONOMY_SCALE.md`** — roadmap de escalado (SS-11/SS-15 deportes y aire libre).
- **[`docs/TOPS_SEO_PLAYBOOK.md`](TOPS_SEO_PLAYBOOK.md)** — cómo hacer tops, destacar fichas (`featured`) y plan SEO/posicionamiento de la vertical.
- **`docs/TAXONOMY.md`** — sistema conceptual de la taxonomía y regla P-04.
- **`docs/AGENT_CURATION_SOP.md`** — protocolo de curación (4 pasos atómicos).
- **`docs/BUSINESS_DISCOVERY_SOP.md`** — checklist maestro y minería de candidatos.
- **`docs/WORKFLOW_CURATION.md`** — ritmo de curación diaria (2–5 fichas/día).
