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

---

## 7. 📚 Fuentes y documentos relacionados

- **`docs/TAXONOMY_SCALE.md`** — roadmap de escalado (SS-11/SS-15 deportes y aire libre).
- **`docs/TAXONOMY.md`** — sistema conceptual de la taxonomía y regla P-04.
- **`docs/AGENT_CURATION_SOP.md`** — protocolo de curación (4 pasos atómicos).
- **`docs/BUSINESS_DISCOVERY_SOP.md`** — checklist maestro y minería de candidatos.
- **`docs/WORKFLOW_CURATION.md`** — ritmo de curación diaria (2–5 fichas/día).
