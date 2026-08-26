# 🏋️ Diseño Técnico — Vertical Deportiva Servicios Mallorca

> **Estado: Borrador de diseño (Fase 0 de preparación).**
> Este documento define la arquitectura de separación de scrapers, la activación de categorías
> y las interfaces pública/admin antes de escribir código. Basado en `docs/SPORTS_FITNESS_SECTION.md`.

---

## 1. Contexto actual y problema

### 1.1 State del orquestador (`src/lib/scrapers/orchestrator.ts`)

| Aspecto                       | Estado                                                                                                                                                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tamaño**                    | 575 líneas — ha crecido hasta ser difícil de mantener                                                                                                                                                          |
| **Detección de categoría**    | `detectBusinessCategory()` con lógica duplicada (arte-tatuajes aparece en dos bloques distintos, gastronomía con condiciones redundantes)                                                                      |
| **Especialistas por dominio** | `if/else if` anidados en `harvestBusinessIntelligence()` — cada nuevo sector añade ramas                                                                                                                       |
| **Sports**                    | No tiene scraper especializado; el motor detecta "golf" y "gimnasios-fitness" por keywords del DOM pero no extrae datos deportivos específicos (horario de apertura, day-pass, equipamiento, idiomas de clase) |

### 1.2 ¿Qué extrae mal el orquestador general para deportes?

El `harvestBusinessIntelligence` actual produce (ejemplo Golf Son Vida):

- ✅ Categoría detectada correctamente
- ✅ Teléfono parcialmente (si está en HTML)
- ✅ Maps URL
- ❌ **Horario de apertura** — un gimnasio o campo de golf sin horario es ficha incompleta
- ❌ **Modalidad** — no distingue "24h", "day-pass disponible", "membership solo", "cita previa obligatoria"
- ❌ **Equipamiento/especialidad** — no extrae "sala cardio", "crossfit box", "pista de pádel", "9 hoyos"
- ❌ **Idiomas de clase** — no detecta "clases en inglés", "entrenador de habla alemana"
- ❌ **Certification deportiva** — no añade "Entrenador Personal Certificado NSCA/ACE", "Registro de Club", etc.

**Conclusión**: el orquestador necesita un especialista deportivo que llene estos huecos.

---

## 2. Separación del orquestador — nuevo scraper deportivo

### 2.1 Principio de separación

El orquestador delegará en especialistas por dominio. El patrón existente es:

```ts
// orchestrator.ts (actual — ejemplo horse)
if (detectedCategory === "gastronomia-restaurantes") {
  const restoData = scrapeRestaurantData(html, baseUrl, cleanName);
  menuUrl = restoData.menuUrl;
  domainSpecialties = restoData.specialties;
  ...
}
```

El sports scraper seguirá el mismo contrato: recibe `html`, `baseUrl`, `businessName` y devuelve un objeto estructurado con los campos deportivos específicos.

### 2.2 Nuevo archivo: `src/lib/scrapers/sportsScraper.ts`

**Responsabilidad:** extraer datos deportivos específicos del HTML de un negocio deportivo Detectado.

**Interfaz pública:**

```ts
export interface SportsScrapeResult {
  // Detección de tipo específico dentro del sector
  sportType?: string[]; // ej: ["gimnasio-24h", "crossfit-box", "pádel-club"]

  // Horario (CRUCIAL para deportes — gimnasio sin horario es poco usable)
  schedule?: string; // ej: "Lun-Vie: 07:00-22:00 | Sáb: 09:00-14:00 | Dom: Cerrado"

  // Modalidad de acceso
  accessModality?: string[]; // ej: ["walk-in", "cita-previa", "day-pass", "membership", "24h"]

  // Equipamiento / instalaciones detectadas
  amenities?: string[]; // ej: ["sala-cardio", "mancuernas", "piscina", "pista-padel", "crossfit", "spinning"]

  // Idiomas en que se imparten clases / atención
  classLanguages?: string[]; // ej: ["en", "de"] → badge EN/DE spoken

  // Precio / tarifas detectadas (solo si visibles explícitamente — GR-11)
  pricingInfo?: string; // ej: "Membership desde 29€/mes | Day-pass: 12€"

  // Certificaciones deportivas específicas
  certifications?: string[]; // ej: ["Entrenador Personal Certificado", "Registro de Club Balear"]

  // Especialidades / servicios deportivos concretos (para servicesProvided)
  specialties?: string[]; // ej: ["entrenador-personal", "clases-yoga", "bike-fit"]

  // Dorks de directorio deportivo específico
  sportsDorks?: Array<{ directoryName: string; searchUrl: string }>;
}
```

**Función exportada:**

```ts
export function scrapeSportsData(html: string, baseUrl: URL, businessName: string): SportsScrapeResult;
```

### 2.3 Detección de tipo deportivo dentro del scraper

No confiar en `detectBusinessCategory` para el nivel granular. El sports scraper hace su propia detección del tipo específico:

```ts
function detectSportType(text: string): string[] {
  const types: string[] = [];

  // Gimnasio
  if (/\b(gimnasio|gym|fitness\s*(center|studio|club)|musculación|crossfit\s*box|body\s*pump)\b/i.test(text))
    types.push("gimnasio-general");
  if (/24\s*h|24h|a\s*las\s*24|todas\s*las\s*noches/i.test(text)) types.push("gimnasio-24h");
  if (/\bcrossfit|cross-?\s*fit|XFit|box\s*de\s*crossfit\b/i.test(text)) types.push("crossfit-box");
  if (/\bHIIT|bootcamp|boot\s*?camp|entrenamiento\s*?funcional|funcional\s*?training\b/i.test(text))
    types.push("entrenamiento-funcional");
  if (/\bsala\s*de\s*cardio|cardio\s*?sala|sala\s*cardio\b/i.test(text)) types.push("sala-cardio");
  if (
    /\b(body\s*pump|body\s*step|body\s*salance|turbo\s*fitness|spinning| 실내사이클|ciclismo\s*stationary)\b/i.test(
      text,
    )
  )
    types.push("clases-grupales");

  // Pádel / tenis
  if (/\b(pádel|padel|pàdel)\b/i.test(text)) types.push("padel");
  if (/\b(tenis|tennis|pickleball|bádminton|squash|frontón)\b/i.test(text)) types.push("raqueta");

  // Yoga / pilates / cuerpo-mente
  if (/\b(yoga|ioga)\b/i.test(text)) types.push("yoga");
  if (/\b(pilates|pílates)\b/i.test(text)) types.push("pilates");
  if (/\b(barre|barre\s*fitness|barre\s*workout)\b/i.test(text)) types.push("barre");
  if (/\b(gyrotonic|gyrotonic\s*®|gyrotonic\s*exercis)\b/i.test(text)) types.push("gyrotonic");
  if (/\b(meditación|meditacion| mindfulness|mindfulness|stretching)\b/i.test(text)) types.push("mind-body");

  // Artes marciales
  if (
    /\b(boxeo|boxe|boxing|lucha\s*libre|kickboxing|muay\s*thai|jiu[\s-]?jitsu|judo|karate|taekwondo|MMA|esgrima)\b/i.test(
      text,
    )
  )
    types.push("artes-marciales");

  // Golf
  if (
    /\b(golf|campo\s*de\s*golf|club\s*de\s*golf|green\s*fee|escuela\s*golf|pitch\s*&\s*putt|simulador\s*indoor)\b/i.test(
      text,
    )
  )
    types.push("golf");

  // Natación / deportes acuáticos
  if (
    /\b(natación|natació|swimming|club\s*natación|piscina\s*cubierta|aquagym|surf|paddle\s*surf|windsurf|kitesurf|buceo|buceo)\b/i.test(
      text,
    )
  )
    types.push("natacion-acuaticos");

  // Ciclismo / running / trail
  if (
    /\b(ciclismo|cycling|club\s*ciclista|bike\s*fit|bicicleta|running|trail|trekking|senderismo|senderisme|alquiler\s*bici)\b/i.test(
      text,
    )
  )
    types.push("ciclismo-running-trail");

  // Equitación
  if (
    /\b(hípica|hipica|horse\s*riding|equitación|equitació|centro\s*ecuestre|escuela\s*hípica|rutas\s*a\s*caballo)\b/i.test(
      text,
    )
  )
    types.push("hipica");

  // Senderismo / montaña / aventura
  if (
    /\b(senderismo|senderisme|hiking|trekking|escalada|escalad|guía\s*de\s*montaña|barranquismo|parque\s*de\s*aventura|tirolina)\b/i.test(
      text,
    )
  )
    types.push("montana-aventura");

  // Clubes / escuelas deportivas
  if (
    /\b(escuela\s*(de\s*)?(fútbol|baloncesto|fußball)|campus\s*deportivo|clube\s*(de\s*)?(futebol|tenis|pádel)|hurling|multi\s*deport)\b/i.test(
      text,
    )
  )
    types.push("clubes-escuelas");

  // Espacio público
  if (
    /\b(parque\s*de\s*calistenia|skatepark|skate\s*park|circuito\s*de\s*running|pista\s*pública|parque\s*de\s*fitness|calisthenics\s*park|fitness\s*park|parque\s*de\s*ejercicio)\b/i.test(
      text,
    )
  )
    types.push("espacio-publico");

  return types;
}
```

### 2.4 Interfaces a añadir al orchestrator

El `harvestBusinessIntelligence` invocará el sports scraper cuando detecte una categoría deportiva. El contrato de integración:

```ts
// En harvestBusinessIntelligence, tras detectar categoría:
if (isSportsCategory(detectedCategory)) {
  const sportsData = scrapeSportsData(html, baseUrl, cleanName);
  // 1. schedule → curationTemplate.schedule (reemplaza vacío)
  curationTemplate.schedule = sportsData.schedule || "";
  // 2. accessModality → tags (mod:walk-in, mod:cita-previa, product:day-pass, etc.)
  sportsData.accessModality?.forEach((mod) => {
    if (mod === "walk-in") curationTemplate.tags.push("mod:walk-in");
    if (mod === "cita-previa") curationTemplate.tags.push("mod:cita-previa");
    if (mod === "day-pass") curationTemplate.tags.push("product:day-pass");
    if (mod === "membership") curationTemplate.tags.push("product:membership");
    if (mod === "online") curationTemplate.tags.push("mod:online");
    if (mod === "a-domicilio") curationTemplate.tags.push("mod:a-domicilio");
  });
  // 3. amenities → curationTemplate.amenities
  curationTemplate.amenities = [
    ...curationTemplate.amenities,
    ...sportsData.amenities.filter((a) => !curationTemplate.amenities.includes(a)),
  ];
  // 4. classLanguages → languagesSpoken (añadir en, de si no están)
  if (sportsData.classLanguages?.includes("en") && !curationTemplate.languagesSpoken?.includes("en"))
    curationTemplate.languagesSpoken?.push("en");
  if (sportsData.classLanguages?.includes("de") && !curationTemplate.languagesSpoken?.includes("de"))
    curationTemplate.languagesSpoken?.push("de");
  // 5. certifications deportivas
  if (sportsData.certifications?.length) {
    curationTemplate.certifications = [...curationTemplate.certifications, ...sportsData.certifications];
  }
  // 6. specialties → servicesProvided
  if (sportsData.specialties?.length) {
    sportsData.specialties.forEach((s) => {
      if (!curationTemplate.servicesProvided?.es.includes(s)) curationTemplate.servicesProvided?.es.push(s);
      if (!curationTemplate.servicesProvided?.en.includes(s)) curationTemplate.servicesProvided?.en.push(s);
      if (!curationTemplate.servicesProvided?.ca.includes(s)) curationTemplate.servicesProvided?.ca.push(s);
    });
  }
  // 7. pricingInfo → pricing.startingPrice o pricing.notes
  if (sportsData.pricingInfo) {
    if (!curationTemplate.pricing?.startingPrice) curationTemplate.pricing.startingPrice = sportsData.pricingInfo;
  }
}
```

### 2.5 Categorías deportivas que el orchestrator debe reconocer

El `detectBusinessCategory` actual no tiene words de deporte. Hay que añadirlas — pero **sin expandir el orquestador**. Solución: detector separado.

**Opción A (preferida): detector deportivo separado en `sportsScraper.ts`**

```ts
// sportsScraper.ts
export function detectSportsCategory(query: string, rawHtml = ""): string | null {
  const text = `${query} ${rawHtml}`.toLowerCase();

  if (
    /\b(gimnasio|gym|fitness\s*(center|studio|club)|musculación|crossfit|crossfit\s*box|body\s*pump|HIIT|bootcamp|entrenamiento\s*funcional|box\s*de\s*crossfit|sala\s*cardio)\b/i.test(
      text,
    )
  )
    return "gimnasios-fitness";

  if (/\b(pádel|padel|pàdel|tenis|tennis|pickleball|bádminton|squash|frontón)\b/i.test(text))
    return "padel-tenis-raqueta";

  if (/\b(yoga|ioga|pilates|pílates|barre|gyrotonic|meditación|meditacion|mindfulness|stretching)\b/i.test(text))
    return "estudios-cuerpo-mente";

  if (
    /\b(boxeo|boxe|boxing|lucha\s*libre|kickboxing|muay\s*thai|jiu[\s-]?jitsu|judo|karate|taekwondo|MMA|esgrima)\b/i.test(
      text,
    )
  )
    return "artes-marciales-boxeo";

  if (
    /\b(natación|natació|swimming|club\s*natación|piscina\s*cubierta|aquagym|surf|paddle\s*surf|windsurf|kitesurf|buceo|buceo)\b/i.test(
      text,
    )
  )
    return "natacion-deportes-acuaticos";

  if (
    /\b(ciclismo|cycling|club\s*ciclista|bike\s*fit|bicicleta|running|trail|trekking|senderismo|senderisme|alquiler\s*bici|alquiler\s*de\s*bicicleta)\b/i.test(
      text,
    )
  )
    return "ciclismo-running-trail";

  if (
    /\b(golf|campo\s*de\s*golf|club\s*de\s*golf|green\s*fee|escuela\s*golf|pitch\s*&\s*putt|simulador\s*indoor)\b/i.test(
      text,
    )
  )
    return "golf";

  if (
    /\b(hípica|hipica|horse\s*riding|equitación|equitació|centro\s*ecuestre|escuela\s*hípica|rutas\s*a\s*caballo)\b/i.test(
      text,
    )
  )
    return "equitacion-hipica";

  if (
    /\b(senderismo|senderisme|hiking|trekking|escalada|escalad|guía\s*de\s*montaña|barranquismo|parque\s*de\s*aventura|tirolina)\b/i.test(
      text,
    )
  )
    return "deportes-montana-aventura";

  if (
    /\b(escuela\s*(de\s*)?(fútbol|baloncesto|fußball)|campus\s*deportivo|clube\s*(de\s*)?(futebol|tenis|pádel))\b/i.test(
      text,
    )
  )
    return "clubes-escuelas-deportivas";

  if (
    /\b(parque\s*de\s*calistenia|skatepark|skate\s*park|circuito\s*de\s*running|pista\s*pública|parque\s*de\s*fitness|calisthenics\s*park|fitness\s*park|parque\s*de\s*ejercicio)\b/i.test(
      text,
    )
  )
    return "espacios-deportivos-publicos";

  // Entrenamiento personal — keywords más genéricas, verificar con contexto
  if (
    /\b(entrenador\s*personal|personal\s*trainer|preparador\s*físico|fitness\s*coach|online\s*coach|entrenador\s*licenciado|preparador\s*sport)\b/i.test(
      text,
    )
  )
    return "entrenamiento-personal";

  return null;
}
```

**Opción B: extender `detectBusinessCategory` en el orchestrator** — NO recomendada: ensucia el orquestador y el PR sería grande.

**Decisión:** Opción A. El `detectBusinessCategory` del orchestrador delega en `detectSportsCategory` cuando no encuentra categoría conocida:

```ts
// En detectBusinessCategory, al final:
// 7. Deportes — detector especializado (sportsScraper.ts)
const sportsCat = detectSportsCategory(query, rawHtml);
if (sportsCat) return sportsCat;

// fallback final:
return "servicios-profesionales";
```

### 2.6 Contratos de calidad del sports scraper

- **Zero Fake Data (GR-11):** no inventar horario, ni precio, ni teléfono. Si no está en el HTML, el campo queda vacío o `null`.
- **Fidelidad Maps (GR-12):** el horario detectado tiene que coincidir con lo que Google Maps muestra (o al menos ser consistente con el dominio extraído).
- **No duplicar lógica:** el sports scraper no repite `fetchHtmlWithTimeout` ni `extractBaseMetadata` — recibe el HTML ya procesado.
- **Idempotente:** ejecutarlo dos veces sobre el mismo HTML produce el mismo resultado.

---

## 3. Categorías a activar — viabilidad según minería real

### 3.1 Resultado de minería (2026-08-25)

| Negocio                | Categoría detectada automáticamente | Score    | Teléfono           | Estado                      |
| ---------------------- | ----------------------------------- | -------- | ------------------ | --------------------------- |
| **Golf Son Vida**      | `golf`                              | 70 pts   | +34 971 783 000 ✅ | 🌟 Listo para F2            |
| **Golf Son Muntaner**  | `golf`                              | 70 pts   | +34 971 783 000 ✅ | 🌟 Listo para F2            |
| Basic-Fit Palma        | `gimnasios-fitness`                 | 65 pts   | +34 000 000 000 ❌ | Triaje — verificar teléfono |
| CrossFit Mallorca      | `gimnasios-fitness`                 | 64.3 pts | +34 000 000 000 ❌ | Triaje — verificar teléfono |
| AltaFit Palma          | `gimnasios-fitness`                 | 57.5 pts | +34 000 000 000 ❌ | Triaje — verificar teléfono |
| Arabella Golf Mallorca | `golf`                              | 57.5 pts | +34 000 000 000 ❌ | Triaje — verificar teléfono |
| Golf de Andratx        | `golf`                              | 57.5 pts | +34 000 000 000 ❌ | Triaje — verificar teléfono |

### 3.2 Categorías a activar inmediatamente (F2 prioritario)

**Golf** — es la categoría viable ahora mismo:

- 2 negocios con teléfono real y score 70
- `detectSportsCategory` ya la detecta
- No requiere gym-specific fields (horario de apertura de campo de golf es menos crítico)

**gimnasios-fitness** — posponer F2 hasta verificar teléfonos:

- 3 negocios detectados, pero todos con teléfono placeholder
- Requieren verificación manual de teléfono antes de publicar
- El sports scraper aporta el mayor valor aquí (horario, modalidad 24h, day-pass, idiomas)

**Resto de categorías deportivas (10+)** — mantener como mapa, no activar sin negocios verificados (P-04, GR-11).

### 3.3 Decisión de activación

| Fase                | Categorías                | Negocios                         | Prerrequisito                   |
| ------------------- | ------------------------- | -------------------------------- | ------------------------------- |
| **F2a (inmediato)** | `golf`                    | Golf Son Vida, Golf Son Muntaner | Teléfono verificado ✅          |
| **F2b (pendiente)** | `gimnasios-fitness`       | Basic-Fit, CrossFit, AltaFit     | Verificar teléfonos manualmente |
| **F2c (futuro)**    | resto (pádel, yoga, etc.) | —                                | Esperar candidatos reales       |

---

## 4. Archivos a crear/modificar (plan de implementación)

### 4.1 Nuevos archivos

| Archivo                                                   | Propósito                                                                                |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/lib/scrapers/sportsScraper.ts`                       | Scraper especialista deportivo (detectSportType, scrapeSportsData, detectSportsCategory) |
| `src/data/services/deportes-fitness/index.ts`             | Agregador del módulo deportes-fitness                                                    |
| `src/data/services/deportes-fitness/golf-son-vida.ts`     | Ficha Golf Son Vida (modelada desde minería verificada)                                  |
| `src/data/services/deportes-fitness/golf-son-muntaner.ts` | Ficha Golf Son Muntaner (modelada desde minería verificada)                              |

### 4.2 Modificaciones a archivos existentes

| Archivo                            | Cambio                                                                                                                                                                                                                                                             | Líneas aproximadas           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `src/lib/scrapers/orchestrator.ts` | 1) Importar `detectSportsCategory` y `scrapeSportsData` de sportsScraper. 2) Añadir `isSportsCategory()` helper. 3) Añadir bloque de integración sports en `harvestBusinessIntelligence`. 4) Añadir fallback a `detectSportsCategory` en `detectBusinessCategory`. | ~20-30 líneas añadidas       |
| `src/data/categories.ts`           | Añadir categoría `golf` (id: `golf`, sectorId: `deportes-aire-libre`, icono: ⛳, nombres es/en/ca, sinónimos, color `#2d6a4f`)                                                                                                                                     | ~25 líneas                   |
| `src/data/services/index.ts`       | Importar `DEPORTES_FITNESS_SERVICES` y exportarlo; añadir al `SERVICES` array                                                                                                                                                                                      | ~4 líneas                    |
| `src/lib/jsonLdGenerator.ts`       | El mapeo de `golf` ya existe (`GolfCourse`, `SportsActivityLocation`) — verificar que está correcto; añadir cualquier categoría deportiva faltante                                                                                                                 | ~10 líneas si hay que añadir |

### 4.3 Interfaces públicas y admin — por hacer (documentación de diseño, no código aún)

**Public-facing:**

| Elemento                  | Detalle                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| Hub `/servicios/deporte`  | Landing con subsecciones por categoría + filtros                                                          |
| Filtros deportivos        | Modalidad (24h, day-pass, membership, cita-previa, walk-in), idioma (EN/DE spoken), precio, horario, zona |
| Badges                    | Day Pass, 24h, EN/DE spoken, Free (espacios públicos)                                                     |
| Mapa de espacios públicos | Capa interactiva con parques de calistenia, pistas, circuitos (guías editoriales, no fichas de negocio)   |
| Guías editoriales         | Posts en 4 idiomas: rutas de running, parques de calistenia por zona, mejores zonas de ciclismo           |

**Admin:**

| Elemento                              | Detalle                                                                                                          |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| CRUD de fichas deportivas             | Crear / editar / validar ficha deportiva (horario, modalidad, idiomas, equipamiento, precios)                    |
| Verificación de datos deportivos      | Checklist: horario real, día de cierre, precios de membership, teléfono verificado, idiomas de clase confirmados |
| Gestión de guías de espacios públicos | CRUD de posts editoriales (no fichas de negocio) para parques, pistas, circuitos gratuitos                       |

---

## 5. Validación de viabilidad técnica

### 5.1 Preguntas abiertas

| #   | Pregunta                                                                                            | Impacto                                                                                   |
| --- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | ¿El `detectSportsCategory` debe vivir en `sportsScraper.ts` o en el orchestrator?                   | Decisión arquitectural: preferimos sportsScraper para no ensuciar el orquestador          |
| 2   | ¿Se añade `product:day-pass` y `product:membership` al catálogo de tags, o se usa `mod:` existente? | Afecta a `src/data/tags.ts` — tags cerrados, no libres                                    |
| 3   | ¿Las guías de espacios públicos son posts del blog (lenguaje Astro) o un nuevo tipo de contenido?   | Afecta a `src/pages/` y `src/lib/scrapers/socialScraper.ts` si necesitan lectura de posts |
| 4   | ¿El admin de fichas deportivas reutiliza el admin existente o necesita UI específica?               | Afecta a las páginas admin actuales (`dashboard.astro`, `nuevo.astro`)                    |

### 5.2 Criterios de validación antes de escribir código

- [ ] `detectSportsCategory` detecta correctamente `golf` y `gimnasios-fitness` en los 9 targets del JSON de sports
- [ ] `scrapeSportsData` extrae horario/equipamiento de al menos 1 gym real con datos visibles
- [ ] El orquestador integra el sports scraper sin duplicar lógica de fetch/parseo
- [ ] Las 2 fichas de golf (Son Vida, Son Muntaner) pasan `typecheck && test && validate:taxonomy`
- [ ] El pipeline de minería + ingesta funciona para golf sin romper otros sectores

---

## 6. Referencias

- **`docs/SPORTS_FITNESS_SECTION.md`** — visión, taxonomía, SEO, plan de activación F1-F5
- **`docs/TAXONOMY.md`** — sistema conceptual de taxonomía (P-04, GR-11, GR-12)
- **`docs/TAXONOMY_SCALE.md`** — proyección SS-11 (Deportes & Aire Libre)
- **`docs/AGENT_CURATION_SOP.md`** — protocolo de curación 4 pasos
- **`src/lib/scrapers/orchestrator.ts`** — orquestador actual (575 líneas)
- **`src/lib/scrapers/baseScraper.ts`** — fetch, extractBaseMetadata, formatSpanishPhone
- **`src/lib/scrapers/restaurantScraper.ts`** — patrón de scraper especialista existente
- **`src/lib/scrapers/serviceScraper.ts`** — patrón de scraper general existente
- **`src/data/categories.ts`** — catálogo de categorías actual (sin deportes)
- **`src/data/tags.ts`** — catálogo cerrado de tags
- **`src/data/types.ts`** — interfaz ServiceItem completa
- **`src/lib/jsonLdGenerator.ts`** — mapeo Schema.org (incluye `golf`, `natacion-deportes-acuaticos`, `deportes-montana-aventura`)
