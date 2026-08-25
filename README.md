# 🏝️ Servicios Mallorca — Directorio de Servicios & Negocios Verificados

> **Plataforma web de servicios locales, guías y negocios de alta calidad en la isla de Mallorca.**
> Construida con **Astro SSR**, arquitectura modular escalable, agregador de reputación **Multi-Mapas**, sistema de curación con **Inteligencia Artificial (Zero Fake Data)**, internacionalización trilingüe y diseño responsive premium.

[![Astro](https://img.shields.io/badge/Astro-7.1.3-FF5D01?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2.7-6E9F18?logo=vitest)](https://vitest.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.16.0-FFCA28?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ Características Principales

- 🗺️ **Agregador de Reputación Multi-Mapas:** Puntuación global ponderada calculada a partir de Google Maps, Apple Maps, Bing Places y TripAdvisor.
- 💬 **Opiniones y Reseñas de Clientes Verificados:** Testimonios contrastados con insignias oficiales de plataforma (`📍 Google Maps`, `🌐 Bing Maps`, `🦉 TripAdvisor`).
- 📸 **Portafolios Visuales & Galería Lightbox:** Cuadrícula interactiva estilo mosaico con visor en pantalla completa, zoom y navegación por gestos/teclado sin distorsión EXIF.
- 📱 **Comunidad & Feed de Redes Sociales:** Conexión directa con perfiles de Instagram, TikTok, Facebook, YouTube, Pinterest, LinkedIn y canales de WhatsApp.
- 💎 **Fichas Enriquecidas de Alto Valor:** Artistas y profesionales del equipo, tarifas orientativas, comodidades (PMR, Wi-Fi, Pet Friendly), métodos de pago (Bizum, Apple Pay, Cripto) y FAQs trilingües.
- 🥇 **Regla de Oro: Zero Fake Data (GR-11 & GR-12):** Pipeline estricto de verificación con minería CLI (`business-intelligence-lookup.ts`) para garantizar que el 100% de la información sea real y verificada.
- 🌍 **Internacionalización Trilingüe (i18n):** Español (`es`), Catalán (`ca`) e Inglés (`en`) con detección automática de locale y enrutamiento limpio.
- 🎨 **Sistema Multi-Tema (CSS Nativo):** Verde Bosque (Claro/Oscuro) y Oro Mallorca (Claro/Oscuro) con variables CSS estandarizadas.
- 🔐 **Autenticación y Roles:** Firebase Auth (Email/Password + Google) con roles diferenciados (_User_, _Manager_, _Admin_) y solicitudes de propiedad (_Claims_).
- 🛠️ **DevTools Suite Integrada:** Logger circular de 500 eventos, menú contextual flotante draggable y atajos de teclado para auditoría en tiempo real.

---

## ⚡ Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# Acceso local → http://localhost:4321/es/
```

### 🧪 Comandos de Calidad & Verificación

```bash
# Ejecutar suite de pruebas unitarias (66 tests)
npm test

# Validar integridad taxonómica, categorías, zonas y tags
npm run validate:taxonomy

# Verificación de tipos TypeScript estricto
npm run typecheck

# Compilar para producción (SSR con @astrojs/node)
npm run build
```

---

## 🤖 Pipeline de Curación para Agentes (`@curation`)

Para extraer y registrar un nuevo negocio en Mallorca cumpliendo el **SOP Oficial**:

```bash
npx tsx scripts/business-intelligence-lookup.ts "Nombre del Local Palma" --url="https://weboficial.com"
```

El script extrae multimedia oficial, detecta perfiles sociales, genera dorks de reputación en directorios y devuelve el JSON listo para insertar en [`src/data/services/<sector>.ts`](src/data/services/).

### 📋 Checklist Maestro & Descubrimiento de Negocios

Para **buscar y priorizar** los negocios de Mallorca organizados por **categoría → puntaje → alfabético**:

```bash
# Regenera el checklist (docs/BUSINESS_DISCOVERY_CHECKLIST.md/.json) desde el catálogo + blueprint
npm run discover:businesses

# Mina candidatos reales (scripts/discovery-targets.json) y añádelos al checklist
npx tsx scripts/discover-businesses.ts --mine --file="scripts/discovery-targets.json"
```

Procedimiento completo: [`docs/BUSINESS_DISCOVERY_SOP.md`](docs/BUSINESS_DISCOVERY_SOP.md).

### 🏋️ Vertical Deportiva (Nuevo)

Gimnasios, centros deportivos, estudios especializados y **espacios públicos de actividad física**:

- 📖 Documento maestro: [`docs/SPORTS_FITNESS_SECTION.md`](docs/SPORTS_FITNESS_SECTION.md) (12 categorías, SEO, guías gratuitas).
- 🔎 Blueprint de descubrimiento deportivo ya integrado en `npm run discover`.
- 🎯 Primer lote de candidatos reales: `scripts/discovery-targets-sports.json` (minar con `npm run discover:mine -- --file="scripts/discovery-targets-sports.json"`).

---

## 📚 Documentación Técnica

Toda la documentación detallada del proyecto se encuentra en [`docs/`](docs/):

| Documento                                                                   | Descripción                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [**GOLDEN_RULES.md**](docs/GOLDEN_RULES.md)                                 | 🥇 Las 12 Reglas de Oro inmutables (Zero Fake Data, CSS tokens, i18n, etc.) |
| [**AGENT_CURATION_SOP.md**](docs/AGENT_CURATION_SOP.md)                     | 🤖 Protocolo SOP para Agentes de IA: Registro y Curación de Negocios        |
| [**AGENTS.md**](docs/AGENTS.md)                                             | 🤖 Arquitectura del Sistema Multi-Agente y roles especializados             |
| [**ARCHITECTURE.md**](docs/ARCHITECTURE.md)                                 | 🏗️ Arquitectura del sistema, stack, colecciones de Firestore y roadmap      |
| [**SCALABILITY_AND_ARCHITECTURE.md**](docs/SCALABILITY_AND_ARCHITECTURE.md) | 📈 Diseño modular del catálogo para miles de negocios y rendimiento SSR     |
| [**STYLING.md**](docs/STYLING.md)                                           | 🎨 Sistema de diseño, temas visuales y breakpoints responsivos              |
| [**I18N.md**](docs/I18N.md)                                                 | 🌍 Guía de internacionalización y estructura de traducciones                |
| [**AUTH.md**](docs/AUTH.md)                                                 | 🔐 Firebase Auth, roles de usuario y flujo de sesiones                      |
| [**DEVTOOLS.md**](docs/DEVTOOLS.md)                                         | 🛠️ Especificación de DevTools Panel, Floating Button y Logger               |

---

## 🏗️ Estructura del Proyecto

```
servicios-mallorca/
├── src/
│   ├── components/             # Componentes Astro (MapsRatingBox, VisualGallery, SocialFeed, etc.)
│   ├── data/
│   │   ├── categories.ts       # Categorías y sectores oficiales
│   │   ├── zones.ts            # Eje geográfico insular (7 zonas de Mallorca)
│   │   ├── tags.ts             # Catálogo cerrado de etiquetas (geográficas, producto, modalidad)
│   │   └── services/           # Catálogo modular escalable por sectores
│   │       ├── types.ts        # Modelos TypeScript de negocios y reputación
│   │       ├── arte-tatuajes.ts# Módulo sectorial
│   │       └── index.ts        # Repositorio y métodos de consulta
│   ├── i18n/                   # Traducciones (es.json, en.json, ca.json)
│   ├── layouts/
│   │   └── BaseLayout.astro    # Layout base global con SEO y analytics
│   ├── pages/
│   │   └── [...locale]/        # Páginas con prefijo de idioma dinámico
│   └── styles/
│       └── global.css          # Tokens, temas y variables CSS globales
├── scripts/
│   ├── business-intelligence-lookup.ts # Extracción de inteligencia y huella digital
│   ├── validate-taxonomy.ts            # Validador de consistencia taxonómica
│   └── audit-services.ts               # Health check y frescura de datos
└── docs/                       # Documentación técnica completa
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
