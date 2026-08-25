# 🔎 SOP de Descubrimiento & Checklist Maestro de Negocios — Servicios Mallorca

> **Estándar Operativo** para descubrir, listar y priorizar los negocios de Mallorca que alimentan
> el catálogo oficial. Cumple **GR-11 (Zero Fake Data)**: ninguna entrada proviene de datos inventados;
> el checklist se nutre del catálogo indexado (fuente verificada) o de candidatos minados de fuentes oficiales.

---

## 🎯 Objetivo

Mantener un **checklist central y vigente** de todos los negocios de Mallorca que queremos cubrir,
organizado de forma **inmutable**:

1. **Tipo / Categoría** (orden alfabético del sector).
2. **Calidad / Puntaje** (Quality Rank Score ponderado, de mejor a peor).
3. **Nombre** (alfabético, A–Z).

Este documento es la base operativa para el pipeline de curación diaria
([`docs/WORKFLOW_CURATION.md`](WORKFLOW_CURATION.md)).

---

## 🧱 Arquitectura

| Ruta                                     | Responsabilidad                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| `scripts/discover-businesses.ts`         | Motor de descubrimiento y generador del checklist (`--mine`, `--file`, `--ingest-verified`). |
| `scripts/discovery-targets.json`         | Dataset editable de candidatos **reales** (nombre + web oficial + hints).                    |
| `docs/BUSINESS_DISCOVERY_CHECKLIST.md`   | Checklist humano (tabla por categoría con casillas `[x]` / `[ ]`).                           |
| `docs/BUSINESS_DISCOVERY_CHECKLIST.json` | Datos estructurados (fuente de verdad para futuros procesos/exports).                        |

## 👣 Flujo de trabajo recomendado

### Fase A — Descubrir (Blueprint, sin red)

```bash
npm run discover
```

Genera el checklist desde el catálogo indexado y añade el **Blueprint de Descubrimiento por Sector**
(búsquedas en Google Maps) para localizar nuevos negocios legítimos.

### Fase B — Declarar candidatos reales

Añade a `scripts/discovery-targets.json` cada negocio real hallado en la Fase A:

```json
{
  "name": "Nombre Comercial",
  "website": "https://weboficial.com",
  "categoryHint": "tecnologia-seguridad",
  "zoneHint": "palma"
}
```

### Fase C — Minería y verificación (GR-11)

```bash
npm run discover:mine
```

El motor ejecuta `harvestBusinessIntelligence` sobre cada candidato y calcula el **Confidence Score**.

- `verified` (≥80 %) → aparece como **Pendiente** `⏳` para curar.
- Menos del 80 % o con discrepancias → **Triaje / Revisar** `⚠️`.
- Si ya existe en el catálogo → **Indexado** `✅` (se marca automáticamente, sin duplicar).

### Fase D — Curar e indexar

Sigue el [AGENT_CURATION_SOP.md](AGENT_CURATION_SOP.md) (4 pasos atómicos) para cada negocio
"pendiente/revisar" y crea `src/data/services/<sector>/<slug>.ts`. Al regenerar, el checklist lo
reflejará como **Indexado**.

## 🧠 Reglas de oro

- **GR-11 (Zero Fake Data):** prohibido escribir candidatos sin contrastar. El script jamás inventa:
  solo procesa el catálogo o candidatos que tú declaras.
- **Orden inmutable:** Categoría → Puntaje → Alfabético. No alteres el orden en el script.
- **Sin duplicados:** el motor descarta candidatos cuyo `id`/`name` ya esté en el catálogo.
- **Fidelidad multi-mapa (GR-12):** cada negocio debe enlazar su ficha oficial de Google/Apple/Bing Maps.

## 🧪 Verificación de entrega

Antes de dar por buena una ingesta nueva, ejecuta:

```bash
npm run typecheck && npm test && npm run validate:taxonomy
```

Actualización del índice DOC: ver [`docs/README.md`](README.md). Regenera el checklist siempre que cambie el catálogo.
