# 🏛️ Especificación UI/UX & Técnica: Sección Ciudadanía, Guías y Estadísticas

> **Documento de Especificación Técnica & Visual de la Vertical Ciudadana.**  
> Rige la creación del portal de trámites al ciudadano (`/guias`), el hub de estadísticas insulares (`/estadisticas`) y su enlace con los servicios comerciales del directorio. Cumple estrictamente con **GR-01** (variables CSS de `global.css`), **GR-02** (responsividad por breakpoints), **GR-03** (TypeScript estricto), **GR-04** (traducciones i18n completas), **GR-07** (accesibilidad aria) y **GR-11** (Zero Fake Data).

---

## 1. 🎯 Visión Estratégica & Propósito

Esta sección expande Servicios Mallorca transformándolo de un directorio de negocios a una **plataforma insular de utilidad pública diaria**:

| Pilar Estratégico            | Impacto Operativo                                                                                                                                               | Beneficio para el Usuario                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Autoridad E-E-A-T Máxima** | Posicionamiento en búsquedas institucionales de alto volumen ("cita previa itv mallorca", "empadronarse en palma", "tarjeta ciudadana descuentos").             | Información 100% contrastada sin intermediarios especulativos ni anuncios engañosos.     |
| **Sinergia Directorio-Guía** | Cada trámite recomienda servicios profesionales contrastados del directorio (ej: gestorías, traductores jurados, clínicas de reconocimiento, talleres pre-ITV). | Conversión natural hacia los negocios locales del catálogo sin intrusión publicitaria.   |
| **Retención del Usuario**    | Checklist interactivo que recuerda al ciudadano qué documentos tiene preparados para su cita en la OAC o PAC.                                                   | Utilidad inmediata en el bolsillo mediante almacenamiento local seguro (`localStorage`). |
| **Comunidad Internacional**  | Disponibilidad íntegra en los 4 idiomas oficiales de la plataforma: Español, Catalán, Inglés y Alemán.                                                          | Inclusión total de la comunidad residente extranjera y expatriada en la vida insular.    |

---

## 2. 🗺️ Arquitectura de Rutas & Navegación

Las nuevas páginas se integran de forma coherente dentro de la estructura multi-idioma de Astro:

```
src/pages/
├── [...locale]/
│   ├── guias/
│   │   ├── index.astro        # Hub principal de Guías y Trámites al Ciudadano
│   │   └── [slug].astro       # Ficha interactiva y paso a paso de cada trámite oficial
│   └── estadisticas/
│       └── index.astro        # Data Hub de Mallorca (indicadores oficiales IBESTAT)
```

### 2.1. Estructura de URLs por Idioma

| Idioma         | Hub de Guías | Ejemplo Guía Individual           | Data Hub Estadístico |
| -------------- | ------------ | --------------------------------- | -------------------- |
| **Castellano** | `/es/guias`  | `/es/guias/empadronamiento-palma` | `/es/estadisticas`   |
| **Català**     | `/ca/guias`  | `/ca/guias/empadronamiento-palma` | `/ca/estadisticas`   |
| **English**    | `/en/guias`  | `/en/guias/empadronamiento-palma` | `/en/estadisticas`   |
| **Deutsch**    | `/de/guias`  | `/de/guias/empadronamiento-palma` | `/de/estadisticas`   |

---

## 3. 📐 Wireframes y Arquitectura de Componentes

### 3.1. Hub de Guías (`/guias/index.astro`)

```
┌────────────────────────────────────────────────────────────────────────┐
│  [Hero] 🏛️ Guías Oficiales & Trámites Ciudadanos de Mallorca           │
│  "Información administrativa clara, oficial y paso a paso (2026)"      │
│  [Buscador de trámites en tiempo real con filtro por categoría]       │
├────────────────────────────────────────────────────────────────────────┤
│  Filtros: [Todos] [Padrón & DNI] [Transporte] [Sanidad] [ITV] [Vivienda]│
├────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────┐ │
│  │ 📋 Padrón Municipal   │  │ 🚗 ITV Mallorca       │  │ 🏥 Ib-Salut │ │
│  │ Ajuntament de Palma   │  │ Consell de Mallorca   │  │ Govern CAIB │ │
│  │ Coste: Gratuito       │  │ 5 Estaciones          │  │ Tarjeta TSI │ │
│  │ Canal: Online/OAC     │  │ Cita previa directa   │  │ PAC cercano │ │
│  │ [Ver Guía Paso a Paso]│  │ [Ver Guía Paso a Paso]│  │ [Ver Guía]  │ │
│  └───────────────────────┘  └───────────────────────┘  └─────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│  [Banner de Alerta Oficial: Avisos del BOIB / Ayudas Activas / Becas]  │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.2. Ficha de Trámite Detallada (`/guias/[slug].astro`)

1. **Header de Identidad Institucional:**
   - Badge del organismo emisor (`Govern CAIB`, `Consell de Mallorca`, `Ajuntament de Palma`).
   - Título oficial claro + fecha de última auditoría de normativa.
   - Matriz rápida: **Coste / Tasas** (ej: 0€ o tasa oficial), **Tiempo de resolución**, **Canales de tramitación** (Online / Presencial).
2. **Checklist Interactivo de Documentación Requerida:**
   - Lista de requisitos con checkboxes interactivos (`<input type="checkbox">` sincronizados con `localStorage`).
   - El ciudadano puede marcar lo que ya tiene en su carpeta antes de salir de casa o iniciar el trámite.
   - Avisos contextuales (ej: _"El contrato de alquiler debe tener el depósito de fianza acreditado en el IBAVI"_).
3. **Paso a Paso Secuencial:**
   - Pasos numerados con badges visuales de canal (`💻 En Línea con Cl@ve / Certificado Digital` o `🏢 En Oficina Presencial`).
   - Botón de enlace exterior directo a la Sede Electrónica Oficial, destacado con icono de candado SSL y badge:
     `[Tramitar en Sede Oficial (caib.es) ↗]`.
4. **Oficinas Físicas & Cita Previa:**
   - Tarjetas con dirección exacta, zona geográfica de Mallorca, teléfono oficial y botón de cómo llegar en Google Maps.
5. **Preguntas Frecuentes Desplegables (FAQ):**
   - `<details class="faq-item">` accesible por teclado con microformato Schema.org `FAQPage`.
6. **Servicios Relacionados del Directorio Local:**
   - Carrusel o grid de negocios homologados de Servicios Mallorca que ayudan al usuario con ese trámite (ej: talleres mecánicos para pre-ITV, gestorías administrativas, clínicas dentales concertadas).

---

## 4. 📊 Data Hub Insular (`/estadisticas/index.astro`)

Para cumplir **GR-09** y **GR-10** (rendimiento máximo y build < 60s), el Data Hub no utiliza librerías JavaScript de gráficas pesadas (como Chart.js o D3 de 500KB).

Se implementa mediante **Micro-Gráficos SVG Nativos y Barras de Progreso CSS**:

```html
<!-- Componente StatProgressBar.astro -->
<div class="stat-bar-container">
  <div class="stat-bar-header">
    <span class="stat-label">Población empadronada en Palma</span>
    <strong class="stat-value">423.512 hab. (IBESTAT)</strong>
  </div>
  <div class="stat-track" role="progressbar" aria-valuenow="53" aria-valuemin="0" aria-valuemax="100">
    <div class="stat-fill" style="width: 53.4%; background: var(--color-gold);"></div>
  </div>
  <span class="stat-caption">Representa el 53,4% de la población total de Mallorca</span>
</div>
```

### Métricas Insulares Cubiertas por IBESTAT:

1. **Demografía Insular:** Población por comarcas (Palma, Raiguer, Pla, Llevant, Migjorn, Tramuntana) y evolución anual.
2. **Mercado Laboral & Empresas:** Empresas activas inscritas en la Seguridad Social por sector (Servicios, Comercio, Hostelería, Industria, Construcción).
3. **Turismo Sostenible:** Proporción de plazas turísticas regladas (Hoteles vs Viviendas ETV autorizadas).
4. **Movilidad:** Viajeros en la red de autobuses TIB y metro/tren SFM vs EMT Palma.

---

## 5. 🗄️ Esquema de Datos Canónico

### 5.1. Almacén de Guías Ciudadanas (`src/data/citizenGuides.ts`)

```typescript
import type { OfficialEntity, VerificationConfidenceLevel } from "./types";

export interface GuideStep {
  stepNumber: number;
  title: Record<"es" | "ca" | "en" | "de", string>;
  description: Record<"es" | "ca" | "en" | "de", string>;
  channel: "online" | "presencial" | "ambos";
  officialUrl?: string;
  importantNotice?: Record<"es" | "ca" | "en" | "de", string>;
}

export interface GuideDocument {
  id: string;
  name: Record<"es" | "ca" | "en" | "de", string>;
  isMandatory: boolean;
  helpTip?: Record<"es" | "ca" | "en" | "de", string>;
}

export interface GuideOffice {
  name: string;
  address: string;
  municipality: string;
  zone: string;
  phone: string;
  appointmentUrl: string;
  coordinates: { lat: number; lng: number };
}

export interface CitizenGuide {
  id: string;
  slug: string;
  title: Record<"es" | "ca" | "en" | "de", string>;
  summary: Record<"es" | "ca" | "en" | "de", string>;
  category: "padron" | "transporte" | "salud" | "extranjeria" | "vehiculos" | "vivienda" | "tributos";
  officialEntity: OfficialEntity;
  officialSourceUrl: string;
  officialLastAudited: string; // YYYY-MM-DD
  fee: {
    isFree: boolean;
    amount?: number;
    currency: "EUR";
    description?: Record<"es" | "ca" | "en" | "de", string>;
  };
  estimatedTime: Record<"es" | "ca" | "en" | "de", string>;
  documents: GuideDocument[];
  steps: GuideStep[];
  offices: GuideOffice[];
  faqs: Array<{
    question: Record<"es" | "ca" | "en" | "de", string>;
    answer: Record<"es" | "ca" | "en" | "de", string>;
  }>;
  relatedServiceCategories: string[]; // Slugs de categorías en src/data/categories.ts
  relatedPostSlugs?: string[]; // Slugs de artículos en src/data/posts.ts
}
```

---

## 6. 🎨 Sistema de Estilos & Accesibilidad (Tokens CSS de `global.css`)

Conforme a **GR-01**, los nuevos componentes utilizarán exclusivamente las variables nativas del proyecto:

```css
/* Paleta y Tokens para Componentes de la Guía */
.guide-badge-official {
  background: var(--color-gold-bg, rgba(212, 160, 23, 0.12));
  color: var(--color-gold-text, #b8860b);
  border: 1px solid var(--color-gold, #d4a017);
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.guide-step-card {
  background: var(--color-bg-card, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.guide-step-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* Responsividad Estricta (GR-02) */
@media (max-width: 640px) {
  .guide-step-card {
    padding: 1rem;
  }
}
```

---

## 7. 🛡️ Protocolo Antifraude & Seguridad en Enlaces Externos (GR-13)

Las búsquedas administrativas están frecuentemente asediadas por portales fraudulentos que cobran intermediación por citas gratuitas (DGT, ITV, Extranjería, Padrón).

Para proteger al ciudadano:

1. **Protocolo Seguro de Enlaces:**
   - Todos los enlaces a sedes oficiales deben llevar:
     `target="_blank" rel="noopener noreferrer nofollow"`.
   - Incluirán un aviso visual con icono gubernamental:
     `🏛️ Enlace Oficial a la Sede Electrónica de [Organismo]`.
2. **Caja de Advertencia Institucional:**
   - Toda guía de trámite gratuito (ej: empadronamiento, cita previa ITV) incluirá un banner:
     > ⚠️ **Aviso de Seguridad:** La solicitud de cita previa en el Ajuntament de Palma y las administraciones públicas es **100% gratuita**. Nunca introduzcas datos de tarjeta bancaria en portales de terceros.

---

## 8. 🧪 Plan de Validación y Testing

Se integrarán las siguientes suites de test unitarias y de integridad:

1. **`tests/unit/citizenGuides.test.ts`:**
   - Valida que todas las guías tienen slug único.
   - Comprueba paridad en los 4 idiomas (`es`, `ca`, `en`, `de`) para títulos, resúmenes y pasos.
   - Verifica que las coordenadas de oficinas físicas están dentro de los límites geográficos de Mallorca (lat: 39.15–40.0, lng: 2.25–3.55).
2. **`tests/unit/officialLinks.test.ts`:**
   - Valida que todas las URLs oficiales apuntan a dominios institucionales autorizados (`caib.es`, `palma.cat`, `conselldemallorca.cat`, `ibsalut.es`, `gob.es`).
3. **`npm run typecheck && npm test && npm run validate:taxonomy`:**
   - Verificación continua antes de cualquier commit.
