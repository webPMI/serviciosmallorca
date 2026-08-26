# 🛡️ Protocolo Estándar de Operación (SOP): Estrategia de "Cero Omisión" y Pasos Atómicos

> **Objetivo Supremo:** Garantizar que la curación y registro de negocios opere con **cero omisiones**, **pasos atómicos secuenciales**, **verificación obligatoria de checkpoints**, **cumplimiento estricto de las Golden Rules (GR-11 & GR-12)** y **cero fallos de build**.

---

## ⚡ 1. Reglas Inmutables de Operación (Persistencia de Reglas)

Antes de cualquier acción de escritura o modificación de datos, el agente debe validar mentalmente y reflejar en su razonamiento:

1. **GR-11 (Zero Fake Data):** Prohibición absoluta de inventar datos, premios, noticias o nombres ficticios. Si un dato no existe en las fuentes oficiales minadas, se omite.
2. **GR-12 (Fidelidad Google Maps):** Más del 90% de coincidencia exacta con coordenadas de la isla de Mallorca, enlaces de multi-mapas y teléfonos oficiales.
3. **GR-04 (Multilingüismo Real):** Todo texto visible, especialidad o historia de fundador debe estar completamente redactado en los 4 idiomas oficiales (`es`, `en`, `ca`, `de`).
4. **Arquitectura Modular (1 Negocio = 1 Archivo):** Cada negocio se guarda en `src/data/services/<sector>/<slug>.ts` con su export individual y agregación en el índice del sector.

---

## 🔄 2. Protocolo de los 4 Pasos Atómicos Secuenciales

El agente **no puede procesar un negocio en un único bloque ciego**. Debe ejecutar de forma secuencial y atómica las 4 fases con sus respectivos checkpoints:

```
┌────────────────────────────────────────────────────────────────────────┐
│ PASO 1: FASE DE RECOLECCIÓN (Data Harvesting & Mining)                 │
│ 1. Ejecutar: npx tsx scripts/business-intelligence-lookup.ts "<Name>"  │
│ 2. Extraer metadatos crudos: teléfono, email, web, redes, fotos, mapas │
│ 🛑 CHECKPOINT 1: Validar que el dominio web y los datos no son 404/500│
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PASO 2: FASE DE AUDITORÍA & PENSAMIENTO CRÍTICO (Chain of Thought)     │
│ 1. Comparar teléfono Web vs teléfono Maps vs WhatsApp.                 │
│ 2. Validar que las coordenadas caen dentro de la isla de Mallorca.     │
│ 3. Calcular el Confidence Score (mínimo 80% para 'verified').          │
│ 🛑 CHECKPOINT 2: Bloque explícito de verificación de reglas activas.   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PASO 3: FASE DE ENRIQUECIMIENTO PROFUNDO (Los 5 Pilares)               │
│ 1. Social Proof: Reseñas cuantitativas y testimonios reales.           │
│ 2. Storytelling: 'founderStory' en ES/EN/CA/DE con valor diferencial.│
│ 3. Autoridad & Prensa: Enlaces exactos a hemeroteca balear y premios.  │
│ 4. Conversión: WhatsApp pre-configurado, tarifas y horarios reales.    │
│ 5. Local SEO: Tags de TAG_CATALOG y subtipo de Schema.org JSON-LD.     │
│ 🛑 CHECKPOINT 3: Todos los campos obligatorios tipados correctamente.  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PASO 4: FASE DE REGISTRO & CERTIFICACIÓN (Escritura y Test Suite)      │
│ 1. Escribir archivo modular en src/data/services/<sector>/<slug>.ts    │
│ 2. Actualizar export e índice sectorial y central.                     │
│ 3. Ejecutar: npm run typecheck && npm test && npm run validate:taxonomy│
│ 🛑 CHECKPOINT 4: 100% Tests pasados y 0 errores de TypeScript.         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 3. Inyección de Pensamiento Crítico Obligatorio (Chain of Thought)

Durante la Fase 2 (Auditoría), el agente debe incluir en su análisis interno un bloque de verificación explícita siguiendo este formato:

```markdown
### 🔍 Verificación de Reglas y Checkpoint de Auditoría:

- **Negocio Analizado:** [Nombre del Negocio]
- **Fuente Web Oficial:** [URL Oficial] (HTTP Status 200 OK)
- **Teléfono Extraído:** [+34 XXX XX XX XX] (Coincide Web y Maps: SÍ)
- **Geolocalización:** [Lat, Lng] (Dentro de polígono de Mallorca: SÍ)
- **Puntaje de Confianza:** [XX%] (Estado: VERIFIED)
- **Cumplimiento GR-11 & GR-12:** Totalmente acreditado con fuentes primarias.
```

---

## 💎 4. Estructura Completa del Archivo de Servicio (Anatomía de los 5 Pilares)

Todo archivo `src/data/services/<sector>/<slug>.ts` debe contener la estructura enriquecida completa:

```typescript
import type { ServiceItem } from "../types.ts";

export const miNegocio: ServiceItem = {
  id: "mi-negocio-mallorca",
  slug: "mi-negocio-mallorca",
  name: "Mi Negocio Mallorca",
  category: "gastronomia-catering",
  sectorId: "hosteleria-gastronomia",
  culturalIdentity: "mallorquin_heritage",
  rating: 4.9,
  reviewCount: 250,
  verified: true,
  featured: true,
  status: "open",
  seasonality: "year_round",
  isIconicHeritage: true,
  priceRange: "€€€",
  address: "Carrer Major, 10, 07001 Palma, Illes Balears",
  zone: "palma",
  phone: "+34 971 00 00 00",
  whatsapp: "+34 971 00 00 00",
  email: "info@minegocio.com",
  website: "https://minegocio.com",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=...",
  appleMapsUrl: "https://maps.apple.com/?q=...",
  bingMapsUrl: "https://www.bing.com/maps?q=...",
  coordinates: { lat: 39.5696, lng: 2.6502 },
  schedule: "Lunes a Sábado: 10:00 - 20:00",
  lastVerifiedAt: "2026-08-25",
  image: "https://...",
  images: ["https://..."],
  gallery: ["https://..."],
  targetAudience: ["residentes", "turistas", "expat"],
  languagesSpoken: ["es", "en", "ca", "de"],
  emergency24h: false,
  inVillaService: false,
  shortDescription: { es: "...", en: "...", ca: "...", de: "..." },
  fullDescription: { es: "...", en: "...", ca: "...", de: "..." },
  specialties: { es: ["..."], en: ["..."], ca: ["..."], de: ["..."] },
  highlights: { es: ["..."], en: ["..."], ca: ["..."], de: ["..."] },
  servicesProvided: { es: ["..."], en: ["..."], ca: ["..."], de: ["..."] },
  tags: ["zona:palma", "product:premium", "mod:cita-previa", "temps:todo-el-ano"],
  pricing: {
    startingPrice: "Desde 45€",
    rateType: "tiered",
  },
  amenities: ["wifi", "air_conditioning"],
  features: ["wifi", "air_conditioning", "credit_card"],
  paymentMethods: ["credit_card", "cash"],
  certifications: ["Registro Oficial Balear"],
  socialLinks: {
    instagram: "https://instagram.com/minegocio",
  },
  teamMembers: [
    {
      name: "Titular",
      role: { es: "Director", en: "Director", ca: "Director", de: "Direktor" },
      specialty: "Atención Especializada",
    },
  ],
  reputationBreakdown: {
    googleMaps: { rating: 4.9, reviewCount: 250, url: "..." },
    totalReviewsAggregated: 250,
    overallWeightedRating: 4.9,
  },
  reviews: [
    {
      id: "rev-1",
      authorName: "Cliente",
      rating: 5,
      date: "2025-06-10",
      platform: "google_maps",
      language: "es",
      comment: "Excelente servicio profesional en Mallorca.",
      verifiedCustomer: true,
    },
  ],
  confidenceScore: 95,
  verificationStatus: "verified",
  sourceCrossReference: {
    webPhoneMatch: true,
    mapsPhoneMatch: true,
    addressInMallorca: true,
    activeWeb200Ok: true,
    socialMatchScore: 100,
    googleMapsConfirmed: true,
    socialPresenceActive: true,
    taxIdVerified: true,
  },
  founderStory: { es: "...", en: "...", ca: "...", de: "..." },
  newsMentions: [
    {
      title: "Noticia en prensa balear",
      source: "Diario de Mallorca",
      url: "https://www.google.com/search?q=site:diariodemallorca.es+...",
    },
  ],
};
```

---

## 💎 5. Protocolo de "Alta Fidelidad" (Calidad sobre Cantidad)

Para maximizar el valor de la plataforma y el posicionamiento SEO, cada incorporación exige:

1. **Triple Contraste de Fuentes (Web + Google Maps + Redes):**
   - Coincidencia estricta de teléfono, coordenadas en Mallorca y horarios reales.
   - Si un negocio aparece cerrado en Maps o su web responde con error 404/500, se descarta automáticamente.
2. **Cero Descripciones Genéricas:**
   - Prohibido el texto de relleno ("excelente comida", "gran servicio"). Se requiere documentar especialidades tangibles, origen de la materia prima, certificaciones y comodidades reales.
3. **Curación Fotográfica de Alto Nivel:**
   - Selección de las mejores imágenes reales en alta definición. Prohibidas fotos borrosas, marcas de agua de terceros o logos genéricos.
4. **Smart-CTA Adaptativo por Vertical:**
   - Gastronomía: `Reservar Mesa / Ver Carta`
   - Tatuajes & Piercing: `Pedir Presupuesto / Ver Portafolio`
   - Náutica & Chárter: `Consultar Chárter / Ver Yates`
   - Deportes & Gimnasios: `Ver Disponibilidad / Contactar`
   - Bienestar & Spas: `Reservar Tratamiento / Consultar Menú Spa`
5. **Reporte de Calidad y Verificación Obligatorio:**
   - Para cada lote incorporado, el agente debe emitir el reporte con las fuentes contrastadas, el confidence score y los motivos de recomendación verificada.

---

## 🎯 6. Verificación de Entrega

Todo nuevo lote de negocios debe pasar sin excepciones:

1. `npm run typecheck` (0 errores de TypeScript)
2. `npm test` (100% de tests unitarios pasando)
3. `npm run validate:taxonomy` (100% de tags, zonas y categorías válidas)
4. `npm run audit:quality` (100% de cumplimiento de Hard Gates de Calidad)
5. `npm run build` (Compilación de producción limpia en Cloudflare Workers)
