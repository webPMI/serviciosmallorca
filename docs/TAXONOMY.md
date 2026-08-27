# 🗂️ Sistema de Taxonomía — Servicios Mallorca

> **Documento maestro de clasificación.** Define la jerarquía canónica (**Macro-Bloques → Categorías → Subcategorías de Nicho → Etiquetas de Producto**) que estructura de forma profesional y escalable la base de datos de negocios de Mallorca (100+ especialidades).

| Referencia                | Alcance                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| **Fuente de verdad**      | Este documento (`docs/TAXONOMY.md`) es la única referencia canónica de nomenclatura.         |
| **Implementación actual** | `src/data/categories.ts`, `src/data/tags.ts`, `src/lib/taxonomyTree.ts`, `src/data/zones.ts` |
| **Reglas que lo rigen**   | GR-06 (docs), GR-04 (i18n), GR-11 (Zero Fake Data), GR-12 (fidelidad Maps)                   |

---

## 1. Propósito y Alcance

El objetivo es que **cada negocio pueda encontrarse por 5 vías complementarias y no excluyentes**:

1. **Por Macro-Bloque** → navegación de alto nivel (Estética, Artes Visuales, Gastronomía Epicúrea, Náutica & Deportes).
2. **Por Categoría Principal & Multicategorías** → navegación intermedia (`categories: string[]`).
3. **Por Subcategoría de Nicho** → especialidad precisa (`subcategories: string[]`).
4. **Por Etiquetas de Producto (`product:*`)** → filtros dinámicos transversales (`product:fine-line`, `product:vidrio-soplado`, `product:enoturismo`, `product:charter-yates`).
5. **Por Zona Geográfica (`zona:*`)** → perímetro de actuación (`zona:palma`, `zona:calvia-andratx`, etc.).

---

## 2. Principios Rectores

| #    | Principio                                                                                                                      | Regla                 |
| ---- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| P-01 | **Jerarquía flexible:** un servicio tiene `category` obligatoria y puede tener `categories` y `subcategories` adicionales.     | GR-06                 |
| P-02 | **Etiquetas normalizadas, no libres.** Las `tags` no son texto suelto: pertenecen a catálogos cerrados con prefijo de dominio. | Arquitectura de datos |
| P-03 | **i18n completo:** nombres, descripciones y etiquetas legibles llevan traducción `es` / `en` / `ca` / `de`.                    | GR-04                 |
| P-04 | **Veracidad primero:** la taxonomía ubica negocios reales verificados; no crea categorías vacías por relleno.                  | GR-11, GR-12          |
| P-05 | **Extensible sin romper:** nuevos sectores/categorías nacen por consenso del Agente Maestro y quedan documentados aquí.        | GR-08                 |
| P-06 | **Sin duplicación:** este documento es la única fuente de nomenclatura; el resto de `docs/` lo referencia.                     | Regla nº 9            |

---

## 3. Arquitectura Jerárquica Multicapa (100+ Nichos)

```
NIVEL 1 · MACRO-BLOQUE / SUPER-SECTOR   (Macro-dominio industrial)       4 Bloques Principales / 21 SuperSectores
   └── NIVEL 2 · CATEGORÍAS             (Agrupación temática)            N por bloque
        └── NIVEL 3 · SUBCATEGORÍAS     (Especialidades de nicho)        100+ especialidades
             └── NIVEL 4 · ETIQUETAS    (Metadatos transversales)        product:*, mod:*, aud:*, amb:*, temps:*
```

### 3.1 Correspondencia con el modelo actual (`ServiceItem`)

| Nivel            | Campo(s) soportados                       | Cardinalidad        | Regla                                  |
| ---------------- | ----------------------------------------- | ------------------- | -------------------------------------- |
| Sector           | se deriva de `category` (mapa `sectorId`) | 1 (indirecto)       | No se almacena por servicio; se agrupa |
| Categoría        | `category`                                | **1** (obligatoria) | Debe existir en `CATEGORIES`           |
| Zona             | `zone`                                    | **1** (obligatoria) | Debe existir en `MALLORCA_ZONES`       |
| Tipo de servicio | `servicesProvided`                        | N (lista i18n)      | Redactado por el curador               |
| Etiquetas        | `tags: string[]`                          | 1–N                 | Deben cumplir el patrón de la §5       |

> **Nota:** la geografía (`MALLORCA_ZONES`) es un eje **ortogonal** a la taxonomía de servicio. Cada negocio referencia 1 `zone`; las etiquetas geo añaden precisión con `zona:<slug>`.

---

## 4. Taxonomía Propuesta (Fuente de Verdad)

> ⚠️ **Estado: PROPUESTA APROBADA.** Los `id` de sector/categoría se migrarán a `src/data/` en una fase posterior (ver §8). Los `id` de categoría actuales se **mantienen** para no romper `services.ts`.

### 4.1 Sectores (`id → label es`)

Un sector agrupa 1 o más categorías afines. Se definen **10 sectores**:

| `id` (slug)               | Nombre (`es`)              | Categorías que agrupa     |
| ------------------------- | -------------------------- | ------------------------- |
| `construccion-reformas`   | 🔨 Construcción & Reformas | `reformas-hogar`          |
| `nautica-charter`         | ⛵ Náutica & Charters      | `nautica-charter`         |
| `salud-bienestar`         | 🧘 Salud & Bienestar       | `salud-bienestar`         |
| `gastronomia-eventos`     | 🍽️ Gastronomía & Eventos   | `gastronomia-catering`    |
| `mobilitat-transport`     | 🚗 Movilidad & Transporte  | `motor-transporte`        |
| `servicios-profesionales` | 💼 Servicios Profesionales | `servicios-profesionales` |
| `estil-art`               | 🎨 Arte, Estilo & Cuidado  | `arte-tatuajes`           |
| `turisme-experiencies`    | 🏝️ Turismo & Experiencias  | _(expansión, §6)_         |
| `tecnologia-digital`      | 💻 Tecnología & Digital    | _(expansión, §6)_         |
| `inmobiliari-retail`      | 🏡 Inmobiliario & Retail   | _(expansión, §6)_         |

> Los **3 últimos** se marcan como expansión (§6): no se crean categorías vacías hasta tener negocios reales verificados (P-04).

### 4.2 Categorías actuales (nivel 2) y su sector

Las 10 categorías activas se agrupan bajo los sectores. **No se renombran; solo se añade el vínculo `sectorId`.**

> 🔎 **Estado vivo:** la fuente de verdad es `CATEGORIES` en `src/data/categories.ts`; esta tabla puede quedar por detrás del código.

| Categoría (`id`)          | Sector                    | Icon |
| ------------------------- | ------------------------- | ---- |
| `reformas-hogar`          | `construccion-reformas`   | 🔨   |
| `nautica-charter`         | `nautica-charter`         | ⛵   |
| `salud-bienestar`         | `salud-bienestar`         | 🧘   |
| `gastronomia-catering`    | `gastronomia-eventos`     | 🍽️   |
| `motor-transporte`        | `mobilitat-transport`     | 🚗   |
| `servicios-profesionales` | `servicios-profesionales` | 💼   |
| `arte-tatuajes`           | `estil-art`               | 🎨   |

### 4.3 Tipos de Servicio (nivel 3) por categoría

Cada "tipo" es una clave técnica normalizada con traducciones. Subdivisión orientativa que el curador completa según GR-11 (solo tipos con negocios reales).

#### §4.3.1 `reformas-hogar`

| Tipo (clave)         | `es`                 | `en`                | `ca`                |
| -------------------- | -------------------- | ------------------- | ------------------- |
| `fontaneria`         | Fontanería           | Plumbing            | Fontaneria          |
| `electricitat`       | Electricidad         | Electrical          | Electricitat        |
| `aire-condicionat`   | Aire acondicionado   | Air conditioning    | Aire condicionat    |
| `fusteria`           | Carpintería          | Carpentry           | Fusteria            |
| `pintura-decoracio`  | Pintura y decoración | Painting & décor    | Pintura i decoració |
| `reformes-integrals` | Reformas integrales  | Full renovations    | Reformes integrals  |
| `piscines-jardins`   | Piscinas y jardines  | Pools & gardens     | Piscines i jardins  |
| `terres-sostres`     | Suelos y techos      | Flooring & ceilings | Terres i sostres    |

#### §4.3.2 `nautica-charter`

| Tipo (clave)           | `es`                  | `en`               | `ca`                   |
| ---------------------- | --------------------- | ------------------ | ---------------------- |
| `xarter-amb-patron`    | Chárter con patrón    | Crewed charter     | Xàrter amb patró       |
| `lloguer-barc`         | Alquiler de barcos    | Boat rental        | Lloguer d'embarcacions |
| `iots-de-luxe`         | Yates de lujo         | Luxury yachts      | Iots de luxe           |
| `manteniment-nautic`   | Mantenimiento náutico | Marine maintenance | Manteniment nàutic     |
| `excursions-maritimes` | Excursiones marítimas | Sea excursions     | Excursions marítimes   |
| `escola-vela`          | Escuelas de vela      | Sailing schools    | Escoles de vela        |

#### §4.3.3 `salud-bienestar`

| Tipo (clave)            | `es`                    | `en`                  | `ca`                  |
| ----------------------- | ----------------------- | --------------------- | --------------------- |
| `fisioterapia`          | Fisioterapia            | Physiotherapy         | Fisioteràpia          |
| `spa-benestar`          | Spa & Bienestar         | Spa & Wellness        | Spa & Benestar        |
| `entrenadors-personals` | Entrenadores personales | Personal trainers     | Entrenadors personals |
| `nutricio-dietetica`    | Nutrición y dietética   | Nutrition & dietetics | Nutrició i dietètica  |
| `cliniques-estetica`    | Clínicas de estética    | Aesthetic clinics     | Clíniques d'estètica  |
| `medicina-estetica`     | Medicina estética       | Aesthetic medicine    | Medicina estètica     |

#### §4.3.4 `gastronomia-catering`

| Tipo (clave)             | `es`                 | `en`               | `ca`                   |
| ------------------------ | -------------------- | ------------------ | ---------------------- |
| `xefs-privats`           | Chefs privados       | Private chefs      | Xefs privats           |
| `catering-esdeveniments` | Catering de eventos  | Event catering     | Càtering esdeveniments |
| `tasts-vins`             | Catas de vino        | Wine tastings      | Tasts de vins          |
| `cellers`                | Bodegas mallorquinas | Mallorcan wineries | Cellers mallorquins    |
| `restaurants`            | Restaurantes         | Restaurants        | Restaurants            |
| `cafeteries-brunch`      | Cafeterías y brunch  | Cafés & brunch     | Cafeteries i brunch    |

#### §4.3.5 `motor-transporte`

| Tipo (clave)          | `es`                 | `en`                | `ca`                |
| --------------------- | -------------------- | ------------------- | ------------------- |
| `transfers-aeroport`  | Transfers aeropuerto | Airport transfers   | Trasllats aeroport  |
| `xofer-privat`        | Chófer privado       | Private chauffeur   | Xofer privat        |
| `lloguer-cotxes`      | Alquiler de coches   | Car hire            | Lloguer de cotxes   |
| `mobilitat-electrica` | Movilidad eléctrica  | E-mobility          | Mobilitat elèctrica |
| `tallers-mecanics`    | Talleres y mecánica  | Garages & mechanics | Tallers mecànics    |

#### §4.3.6 `servicios-profesionales`

| Tipo (clave)              | `es`                          | `en`               | `ca`                    |
| ------------------------- | ----------------------------- | ------------------ | ----------------------- |
| `advocacia`               | Abogacía                      | Legal services     | Advocacia               |
| `gestories`               | Gestorías                     | Accountancy & tax  | Gestories               |
| `assessoria-fiscal`       | Asesoría fiscal internacional | International tax  | Assessoria fiscal       |
| `assessoria-immobiliaria` | Asesoría inmobiliaria         | Real estate advice | Assessoria immobiliària |
| `fotografia-video`        | Fotografía y vídeo            | Photo & video      | Fotografia i vídeo      |
| `marketing-publicitat`    | Marketing y publicidad        | Marketing & ads    | Màrqueting i publicitat |

#### §4.3.7 `arte-tatuajes`

| Tipo (clave)         | `es`             | `en`                 | `ca`             |
| -------------------- | ---------------- | -------------------- | ---------------- |
| `tattoo-realism`     | Realismo         | Realism              | Realisme         |
| `tattoo-fine-line`   | Fine line        | Fine line            | Fine line        |
| `tattoo-traditional` | Traditional      | American traditional | Tradicional      |
| `tattoo-japones`     | Japonés          | Japanese             | Japonès          |
| `piercing`           | Piercing         | Piercing             | Pírcing          |
| `coverup-laser`      | Cover-up y láser | Cover-up & laser     | Cover-up i làser |

---

## 5. Nivel 4 — Sistema de Etiquetas (Transversal)

> **Regla de oro:** toda `tag` DEBE ser una clave `dominio:valor` en minúsculas `kebab-case`, perteneciente a los catálogos de la §5.2. **No es texto libre.**

### 5.1 Dominios de etiqueta

| Dominio             | Prefijo    | Valores de ejemplo                                        | Uso                                          |
| ------------------- | ---------- | --------------------------------------------------------- | -------------------------------------------- |
| Geográfico          | `zona:`    | `zona:palma-centro`, `zona:puerto-portals`, `zona:soller` | Filtro fino por núcleo turístico/residencial |
| Producto / Segmento | `product:` | `product:lujo`, `product:premium`, `product:accesible`    | Segmentación del directorio                  |
| Modalidad           | `mod:`     | `mod:a-domicilio`, `mod:en-local`, `mod:hibrido`          | Cómo se presta el servicio                   |
| Equipación          | `amb:`     | `amb:patron`, `amb:conductor`, `amb:catering`             | Extras incluidos                             |
| Audiencia           | `aud:`     | `aud:familias`, `aud:parejas`, `aud:expat`, `aud:b2b`     | A quién se dirige                            |
| Temporada           | `temps:`   | `temps:verano`, `temps:invierno`, `temps:todo-el-ano`     | Estacionalidad                               |

### 5.2 Catálogos de etiquetas propuestos

**Geográficas (`zona:`)** — derivadas de `MALLORCA_ZONES.popularAreas` y normalizadas en kebab-case ASCII:
`zona:palma-centro`, `zona:santa-catalina`, `zona:portixol`, `zona:son-vida`, `zona:puerto-portals`, `zona:port-adriano`, `zona:santa-pona`, `zona:palma-nova`, `zona:port-d-andratx`, `zona:soller`, `zona:port-de-soller`, `zona:valldemossa`, `zona:deya`, `zona:esporles`, `zona:fornalutx`, `zona:port-de-pollenca`, `zona:port-d-alcudia`, `zona:playa-de-muro`, `zona:can-picafort`, `zona:manacor`, `zona:porto-cristo`, `zona:cala-millor`, `zona:cala-ratjada`, `zona:arta`, `zona:santanyi`, `zona:cala-d-or`, `zona:porto-petro`, `zona:ses-salines`, `zona:campos`, `zona:llucmajor`, `zona:inca`, `zona:binissalem`, `zona:santa-maria-del-cami`, `zona:alaro`, `zona:sineu`.

**Producto/Segmento & Nichos Especializados (`product:`):**

- _Gama & Audiencia:_ `product:lujo`, `product:premium`, `product:accesible`, `product:familiar`, `product:adultos`.
- _Estética & Tatuaje:_ `product:fine-line`, `product:realismo`, `product:traditional`, `product:neotradicional`, `product:blackwork`, `product:lettering`, `product:piercing-titanio`, `product:estetica-facial`, `product:unas-pestanas`.
- _Artes Visuales & Artesanía:_ `product:galeria-arte`, `product:arte-contemporaneo`, `product:ceramica-balear`, `product:vidrio-soplado`, `product:escultura`, `product:diseno-interiores`, `product:joyeria-artesanal`.
- _Gastronomía Epicúrea:_ `product:pescados-mariscos`, `product:tapas-autor`, `product:enoturismo`, `product:cafe-especialidad`, `product:pasteleria-artesanal`.
- _Náutica & Aventura:_ `product:charter-yates`, `product:alquiler-barcos`, `product:buceo`, `product:deportes-acuaticos`, `product:padel-tenis`, `product:senderismo-rutas`, `product:yoga-bienestar`.

**Modalidad (`mod:`):** `mod:a-domicilio`, `mod:en-local`, `mod:online`, `mod:hibrido`, `mod:cita-previa`, `mod:walk-in`.

**Equipación (`amb:`):** `amb:patron`, `amb:conductor`, `amb:catering`.

**Audiencia (`aud:`):** `aud:familias`, `aud:parejas`, `aud:expat`, `aud:b2b`, `aud:seniors`.

**Temporada (`temps:`):** `temps:verano`, `temps:invierno`, `temps:todo-el-ano`.

> **i18n:** aunque la `tag` es técnica (clave), al mostrarse al usuario se resuelve vía `translations["tags.<dominio>.<clave>"]` (GR-04).

---

## 6. Sectores de Expansión (no crear todavía)

> 🔎 **Para el mapa completo de todos los negocios de Mallorca (20 super-sectores, ~160 categorías, ~1.100 tipos), ver [`docs/TAXONOMY_SCALE.md`](TAXONOMY_SCALE.md).** Este §6 solo recoge la ampliación mínima cercana.

Estos sectores se preparan en la taxonomía pero **NO se materializan** en `CATEGORIES` hasta disponer de negocios reales verificados (P-04 + GR-11).

| Sector                 | Categorías candidatas futuras               | Ejemplo de tipos de servicio                                 |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| `turisme-experiencies` | `excursions-turisme`, `hotels-allotjaments` | Excursiones guiadas, tours en barco, alojamientos boutique   |
| `tecnologia-digital`   | `desenvolupament-web`, `marketing-digital`  | Desarrollo web, e-commerce, SEO/SEM, redes sociales          |
| `inmobiliari-retail`   | `immobiliaries`, `comerços-locals`          | Compraventa, alquileres vacacionales, gestión de propiedades |

> Cuando un sector de expansión alcance su primera categoría real, se traslada a la §4 y se marca como activo.

---

## 7. Convenciones de Nomenclatura

| Elemento                            | Regla                                                  | Ejemplo             |
| ----------------------------------- | ------------------------------------------------------ | ------------------- |
| `id` / `slug` de sector y categoría | `kebab-case` ASCII (sin tildes, sin `ñ`)               | `nautica-charter`   |
| Etiqueta                            | `dominio:valor` en minúsculas, sin espacios            | `product:lujo`      |
| Clave i18n de etiqueta              | `tags.{dominio}.{valor}`                               | `tags.product.lujo` |
| Descripciones                       | Siempre en 4 idiomas `es` / `en` / `ca` / `de`         | —                   |
| Nombre de negocio                   | Capitalización oficial del negocio (GR-12)             | `G & M Tattoo Inca` |
| Emojis en iconos                    | Solo en `categories.ts` / `sectors.ts`, nunca en datos | ⛵                  |
| Acentos/`ñ` en técnico              | ASCII transliterado (`ñ`→`n`, `à`→`a`)                 | `funeraria`         |

---

## 8. Modelo de Datos Objetivo (referencia futura)

> En fases posteriores se materializará en `src/data/`. Aquí se documenta el **contrato de datos** para alinear la implementación (sin duplicar la definición actual de `ServiceItem` en `ARCHITECTURE.md`).

```ts
// src/data/sectors.ts (propuesta)
export interface Sector {
  id: string; // kebab-case
  icon: string;
  name: { es: string; en: string; ca: string };
  categoryIds: string[]; // ids de categoría agrupadas
}
```

```ts
// src/data/tags.ts (propuesta)
export type TagDomain = "zona" | "product" | "mod" | "amb" | "aud" | "temps";

export interface TagDef {
  id: string; // "product:lujo"
  domain: TagDomain;
  label: { es: string; en: string; ca: string };
}
```

> **Compatibilidad:** se añadiría `sectorId` a `ServiceCategory` y las `tags` de cada servicio se validarían contra `tags.ts`, reforzando `validateServices.ts` sin romper `services.ts`.

---

## 9. Plan de Migración (no destructivo)

| Fase | Acción                                                              | Riesgo                             |
| ---- | ------------------------------------------------------------------- | ---------------------------------- |
| F1   | Crear `docs/TAXONOMY.md` (este documento)                           | Ninguno (solo documentación)       |
| F2   | Añadir `sectorId` a `ServiceCategory` + crear `src/data/sectors.ts` | Bajo (cambio aditivo)              |
| F3   | Crear `src/data/tags.ts` + validar `tags` en `validateServices.ts`  | Medio (hay tags libres que migrar) |
| F4   | Backfill de `services.ts` con etiquetas normalizadas                | Bajo (revisión manual)             |
| F5   | UI: filtros por sector/tag + traducciones                           | Medio (frontend + i18n)            |

Cada fase se valida con `npm test` y cumple GR-05, GR-09 y GR-10.

---

## 10. Relación con otros documentos

| Documento                              | Relación                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `docs/GOLDEN_RULES.md`                 | GR-01/04/06/08/11/12 rigen toda la taxonomía                                             |
| `docs/ARCHITECTURE.md`                 | Estructura de `src/data/` y esquema actual de datos                                      |
| `docs/SCALABILITY_AND_ARCHITECTURE.md` | Fases de escalado de la base de datos de negocios                                        |
| `docs/WORKFLOW_CURATION.md`            | Protocolo de alta de negocios donde se aplica esta taxonomía                             |
| `docs/STYLING.md`, `docs/I18N.md`      | Iconos/colores de categoría y claves i18n de etiquetas                                   |
| `docs/TAXONOMY_SCALE.md`               | 🚀 Proyección masiva: 20 super-sectores, ~160 categorías, todos los negocios de Mallorca |
