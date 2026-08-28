# 🔒 Gemini Bridge — Puente local IA ⇄ Gemini + Análisis de Comunicación

> Dominio: `@maestro` / `@curation` · Script: `scripts/gemini-bridge.ts` · Tests: `tests/unit/geminiBridge.test.ts`

Sistema local (**un solo archivo**, **0 dependencias**) que conecta las herramientas locales del
proyecto con el modelo Gemini que usa Google Antigravity, y sirve una interfaz web para
**analizar la comunicación**: chat, latencia, tokens, errores, historial, búsqueda y exportación
JSON/Markdown.

---

## ⚠️ Nota de veracidad (GR-11)

- **"Gemini 3.7" no existe.** Google Antigravity (el IDE agéntico de Google) usa **Gemini 3 Pro**,
  disponible en la API como `gemini-3-pro-preview`.
- Antigravity **no expone una API local pública** para apps de terceros. El canal soportado y
  seguro para hablar con ese mismo modelo es la **Gemini API oficial** (Google AI Studio), que es
  lo que implementa este bridge. El modelo es configurable, así que cualquier ID válido funciona
  (`gemini-2.5-flash`, `gemini-2.5-pro`, etc.).

---

## Inicio rápido

1. `cp .env.example .env` y define `GEMINI_API_KEY` (clave gratuita: <https://aistudio.google.com/apikey>)
2. `npm run gemini:bridge`
3. Abre **http://127.0.0.1:8785**

Sin API key el servidor arranca igualmente: la UI muestra un banner de setup y `/api/chat`
responde `503` con instrucciones. El análisis de comunicación funciona en cuanto haya tráfico.

## Endpoints

| Método | Ruta                            | Descripción                                                            |
| ------ | ------------------------------- | ---------------------------------------------------------------------- |
| GET    | `/`                             | Panel de análisis (chat + registro de comunicaciones)                  |
| POST   | `/api/chat`                     | `{ message, system?, model?, history? }` → texto + usage + latencyMs   |
| GET    | `/api/comms?limit=&q=&errors=1` | Registro de comunicaciones (más reciente primero, con búsqueda)        |
| GET    | `/api/stats`                    | Agregados: OK/errores, latencia media/p95, tokens, desglose por modelo |
| GET    | `/api/health`                   | Estado, modelo y si hay API key (nunca su valor)                       |
| POST   | `/api/comms/clear`              | Vacía el registro en memoria                                           |
| GET    | `/api/export?format=md\|json`   | Exporta el registro como archivo adjunto                               |

## Seguridad (GR-13)

- Bind **solo en 127.0.0.1** (no existe opción de exponerlo) + validación de cabecera `Host`
  (anti DNS-rebinding).
- API key **solo** desde `process.env` / `.env`; nunca viaja al navegador y se **redacta** en
  logs y errores (`redactSecrets`).
- Rate limiting por IP (ventana fija de 60 s): 20/min en `/api/chat`, 240/min en el resto.
- Payload máximo **256 KB**; timeouts de socket (115 s) y de upstream (110 s).
- CSP con **nonce por petición**, `X-Frame-Options: DENY`, `nosniff`, `no-referrer`, `no-store`.
- UI con escape HTML (anti-XSS), sin `eval`, sin dependencias externas (vanilla JS, convención
  DevTools del proyecto).
- Ring buffer de **500 comunicaciones** en memoria; persistencia JSONL opcional en
  `.gemini-bridge/` (gitignored, datos privados que no se suben nunca).

## Configuración

| Variable                | Default                | Descripción                                       |
| ----------------------- | ---------------------- | ------------------------------------------------- |
| `GEMINI_API_KEY`        | —                      | Clave de AI Studio (requerida para chatear)       |
| `GEMINI_MODEL`          | `gemini-3-pro-preview` | Cualquier ID de modelo válido de la Gemini API    |
| `GEMINI_BRIDGE_PORT`    | `8785`                 | Puerto local del servidor                         |
| `GEMINI_BRIDGE_PERSIST` | `0`                    | `1` → persiste en `.gemini-bridge/comm-log.jsonl` |

Flags CLI: `--port=N`, `--model=ID`, `--persist`, `--help`.

## Tests (GR-05)

```bash
npx vitest run tests/unit/geminiBridge.test.ts
```

La suite levanta el bridge y un **stub local** del upstream (inyectado vía `GEMINI_BASE_URL`
interno del factory) y cubre: health sin fugas de key, CSP/nonce, chat con eco, multi-turno con
historial, errores 400/413/403/429/503/404, ring buffer `maxEntries` y exportación MD/JSON.

## Excepciones de Golden Rules (justificadas)

- **GR-01 / GR-04 no aplican**: es una herramienta standalone local (como la DevTools Suite),
  con estilos inline e interfaz en español; no forma parte del bundle ni de las páginas del sitio.
- GR-09/GR-10 intactos: el bridge no interviene en `npm run build` del sitio.
