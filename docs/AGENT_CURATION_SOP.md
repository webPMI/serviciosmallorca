# 🤖 Protocolo Estándar de Operación (SOP) para Agentes: Registro y Curación de Negocios

> **Objetivo:** Garantizar que cualquier agente que agregue o actualice negocios lo haga de forma **100% verídica (Zero Fake Data - GR-11)**, **optimizada en consumo de tokens**, **modular (1 archivo por negocio)**, **con especialización por nicho** y **sin errores de compilación**.

---

## ⚡ Reglas Inmutables de Eficiencia de Tokens & Veracidad (GR-11)

1. **PROHIBICIÓN TOTAL DE DATOS SINTÉTICOS O INVENTADOS (GR-11):**
   - ❌ **PROHIBIDO:** Inventar premios, artículos de prensa ficticios, nombres de personas para reseñas simuladas, historias de fundador o productos inventados.
   - ✅ **REGLA:** Si un negocio no tiene premios oficiales, `awards` **se omite**. Si no tiene artículos de prensa, `pressMentions` **se omite**. Si no tiene tienda online verificada, `onlineStore` y `products` **se omiten**. Solo se publican datos 100% reales constatables en fuentes oficiales o proporcionados por el titular.
2. **PROHIBIDO QUEMAR TOKENS EN BÚSQUEDAS ITERATIVAS:** Utilizar siempre el script CLI local `scripts/business-intelligence-lookup.ts`, que ejecuta la extracción multimedia, detección de redes, e-commerce y resolución de mapas en un solo proceso local de alto rendimiento.
3. **ARQUITECTURA 1 ARCHIVO POR NEGOCIO:** Todo nuevo negocio se registra como un módulo independiente en `src/data/services/<sector>/<slug>.ts` (~200 líneas). Nunca escribir en archivos monolíticos.

---

## 🗺️ La Ruta de 5 Pasos del Agente

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. MINERÍA AUTOMATIZADA CON EL SCRIPT CLI LOCAL                       │
│    npx tsx scripts/business-intelligence-lookup.ts                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. APLICACIÓN DEL PLAYBOOK POR NICHO / SECTOR                          │
│    Restaurantes, Tatuajes, Náutica, Villas, Spas o Servicios           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. TAXONOMÍA, GPS & MULTI-MAPAS (Puntuación Ponderada)                 │
│    Google/Bing/Apple/TripAdvisor + Coordenadas para Motor Haversine    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. CREACIÓN MODULAR ATÓMICA                                            │
│    src/data/services/<sector>/<slug>.ts + export en index.ts           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. VERIFICACIÓN Y VALIDACIÓN AUTOMATIZADA                              │
│    npm run typecheck && npm test && npm run validate:taxonomy          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Playbooks Especializados por Nicho de Negocio

Cada sector tiene un comportamiento, fuentes de reputación y requerimientos diferentes. El agente debe aplicar el playbook correspondiente:

---

### 🍽️ 1. Playbook: Restaurantes, Gastronomía & Beach Clubs
* **Sector / Carpeta:** `gastronomia-restaurantes`
* **Fuentes de Autoridad Obligatorias:**
  * **Guía Michelin:** Buscar si posee Estrella Michelin, Estrella Verde o mención *Bib Gourmand*.
  * **Guía Repsol:** Buscar si cuenta con Soles Repsol o distintivo *Solete Repsol*.
  * **TheFork / OpenTable:** Enlace a reservas online y carta digitalizada.
  * **TripAdvisor Gastronomía:** Reputación en ranking gastronómico de Mallorca.
* **Campos Esenciales a Extraer:**
  * `servicesProvided`: Tipo de cocina (Mediterránea, Mallorquina de Autor, Fusión Nikkei, Pescados & Mariscos, etc.).
  * `amenities`: `sea_views` (vistas al mar), `terrace` (terraza exterior), `valet_parking`, `sommelier_service`.
  * `pricing`: Rango del menú degustación o precio medio por cubierto (ej. `Menú degustación 9 pasos: 110€`).
  * `features`: Opciones para dietas especiales (`gluten_free_options`, `vegan_friendly`, `organic_ingredients`).
  * `onlineStore`: Posibilidad de adquirir **Tarjetas Regalo / Bono Menú Degustación** o tienda gourmet.

---

### 🎨 2. Playbook: Arte, Tatuajes, Piercing & Espacios Creativos
* **Sector / Carpeta:** `arte-tatuajes`
* **Fuentes de Autoridad Obligatorias:**
  * **Instagram / TikTok:** Portafolio visual de alta calidad y feed de publicaciones recientes.
  * **Convenciones de Tatuaje:** Premios en la *Mallorca International Tattoo Convention* o certámenes internacionales.
  * **Conselleria de Salut:** Registro Higiénico-Sanitario Oficial de Baleares.
* **Campos Esenciales a Extraer:**
  * `teamMembers`: Tatuadores y anilladores residentes con sus nombres, especialidades, handles de Instagram y fotos de avatar.
  * `certifications`: Titanio Grado Médico ASTM F-136, tintas homologadas REACH UE y esterilización en autoclave Clase B.
  * `pricing`: Tarifa mínima ("Desde 60€"), fianza de reserva y política de presupuestos personalizados.
  * `onlineStore`: Tienda de **Merchandise oficial**, **Prints de autor numerados**, **Cremas post-cuidado** y **Tarjetas Regalo**.

---

### ⛵ 3. Playbook: Náutica, Charters & Alquiler de Barcos
* **Sector / Carpeta:** `nautica-charters`
* **Fuentes de Autoridad Obligatorias:**
  * **Puertos Oficiales:** Port d'Andratx, Marina Port de Mallorca (Palma), Port Adriano, Puerto Portals, Port de Pollença o Cala d'Or.
  * **Licencias de Navegación:** Declaración de patrón profesional (Skipper) y licencias ETV náuticas.
* **Campos Esenciales a Extraer:**
  * `servicesProvided`: Eslora del barco, capacidad máxima de pasaje (ej. "Hasta 12 pasajeros"), tipo de embarcación (Yate, Velero, Catamarán, Lancha semirrígida).
  * `amenities`: Patrón incluido, catering a bordo, Seabob, equipos de snorkel, paddle surf, toallas y combustible.
  * `pricing`: Tarifas de medio día (4h), día completo (8h) o semanas completas en temporada alta/baja.

---

### 🏡 4. Playbook: Villas, Inmobiliaria Exclusiva & Reformas
* **Sector / Carpeta:** `villas-reformas`
* **Fuentes de Autoridad:** Colegios oficiales (COAIB Arquitectos), portales de lujo (*ABC Mallorca Living*, *Balearic Properties*).
* **Campos Esenciales:** Licencia turística (ETV), seguro de responsabilidad civil, idiomas hablados y cobertura geográfica en la isla.

---

### 💆 5. Playbook: Bienestar, Spas, Masajes & Estética
* **Sector / Carpeta:** `bienestar-belleza`
* **Fuentes de Autoridad:** Treatwell Baleares, Fresha, sellos ecológicos y certificaciones terapéuticas.
* **Campos Esenciales:** Menú de rituales y masajes, marcas cosméticas de lujo orgánicas, cabinas dobles para parejas y reserva online.

---

## 🛠️ Procedimiento de Creación Modular (1 Archivo por Negocio)

Para registrar un nuevo negocio, el agente debe seguir esta secuencia:

### 1. Ejecutar el Buscador de Inteligencia
```bash
npx tsx scripts/business-intelligence-lookup.ts "Nombre Negocio Palma" --url="https://weboficial.com"
```

### 2. Crear el archivo del negocio: `src/data/services/<sector>/<slug>.ts`
```typescript
import type { ServiceItem } from "../types.ts";

export const miNegocio: ServiceItem = {
  id: "mi-negocio-palma",
  slug: "mi-negocio-palma",
  name: "Mi Negocio Palma",
  category: "gastronomia-restaurantes", // o el sector correspondiente
  zone: "palma",
  address: "Carrer de...",
  coordinates: { lat: 39.5701, lng: 2.6515 }, // Obligatorio para GPS y Proximidad
  rating: 4.9,
  reviewCount: 230,
  // ... resto de campos según el playbook del nicho
};
```

### 3. Registrar en el agregador del sector: `src/data/services/<sector>/index.ts`
```typescript
import { miNegocio } from "./mi-negocio-palma.ts";

export const SECTOR_SERVICES = [
  // ...otros negocios
  miNegocio,
];
```

### 4. Validar Calidad y Compilación
```bash
npm run typecheck && npm test && npm run validate:taxonomy && npm run build
```

---

## 🌟 Garantías de Calidad (Quality Checklist)
- [ ] ¿Coordenadas GPS reales verificadas para el cálculo de distancia Haversine?
- [ ] ¿Puntuación ponderada combinando Google Maps, Bing, Apple o TripAdvisor?
- [ ] ¿Premios o reconocimientos con enlaces oficiales de verificación (`url`)?
- [ ] ¿Tienda online / productos indexados si el negocio dispone de ellos (`onlineStore` / `products`)?
- [ ] ¿Textos trilingües completos (`es`, `en`, `ca`) en roles, preguntas frecuentes y productos?
- [ ] ¿Tests pasando al 100% y 0 errores de compilación?
