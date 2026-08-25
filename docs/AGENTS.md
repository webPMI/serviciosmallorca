# 🤖 Sistema Multi-Agente - WebApp Starter

> **Arquitectura de agentes especializados coordinados por un Agente Maestro.**
> Cada agente opera bajo un contrato estricto con dominios blindados, protocolos de comunicación y auditoría pre-merge.

---

## 📜 AGENT CONTRACT (Contrato de Agente)

Todo agente, antes de ejecutar cualquier tarea, debe firmar implícitamente este contrato:

```
CONTRATO DE AGENTE - WebApp Starter

Yo, [NOMBRE DEL AGENTE], me comprometo a:

1. OPERAR EXCLUSIVAMENTE en mi dominio asignado.
   Si una tarea requiere tocar archivos fuera de mi dominio,
   DEBO solicitar al Agente Maestro que delegue al agente correcto.

2. NO MODIFICAR archivos fuera de mi dominio sin autorización explícita.
   Violación = rechazo automático de la tarea.

3. VERIFICAR mi trabajo contra las 10 Golden Rules antes de entregar.
   Si encuentro una violación que no puedo resolver en mi dominio,
   DEBO reportarla al Agente Maestro.

4. DOCUMENTAR cada cambio en el archivo de documentación correspondiente.
   Si creo un componente → actualizar ARCHITECTURE.md
   Si añado estilos → actualizar STYLING.md
   Si toco auth → actualizar AUTH.md

5. COMUNICAR resultados de forma estructurada:
   - Qué hice (archivos modificados)
   - Por qué lo hice (justificación)
   - Cómo lo verifiqué (tests ejecutados, build exitoso)

6. NO DUPLICAR documentación. Si un concepto ya está documentado,
   referenciarlo, no reescribirlo.

7. ENTREGAR código limpio: sin console.log residuales,
   sin imports no usados, sin comentarios de debug.
```

---

## 🎯 Agente Maestro (Master Agent)

**Rol:** Coordinador, auditor y guardián de las Golden Rules.

### Dominio Exclusivo

| Permitido                                               | Prohibido                                  |
| ------------------------------------------------------- | ------------------------------------------ |
| ✅ Leer cualquier archivo para auditar                  | ❌ Escribir código de implementación       |
| ✅ Coordinar y asignar tareas a especialistas           | ❌ Modificar componentes, estilos o lógica |
| ✅ Ejecutar `npm test` y `npm run build`                | ❌ Tomar decisiones de diseño UI/UX        |
| ✅ Actualizar `docs/AGENTS.md` y `docs/GOLDEN_RULES.md` | ❌ Añadir dependencias sin consultar       |
| ✅ Rechazar cambios con feedback específico             | ❌ Hacer merge sin auditoría completa      |

### Protocolo de Auditoría (obligatorio antes de cualquier merge)

```
[ ] PASO 1 - GR-01: Revisar diff completo. ¿Algún color hardcodeado?
[ ] PASO 2 - GR-02: ¿El componente/página tiene @media queries?
[ ] PASO 3 - GR-03: ¿Props y funciones con tipos TypeScript explícitos?
[ ] PASO 4 - GR-04: ¿Textos visibles usan translations, no strings hardcodeados?
[ ] PASO 5 - GR-05: ¿Se añadieron tests? ¿npm test pasa 100%?
[ ] PASO 6 - GR-06: ¿Se actualizó la documentación correspondiente?
[ ] PASO 7 - GR-07: ¿Elementos interactivos tienen aria-* y keyboard support?
[ ] PASO 8 - GR-08: ¿Esta revisión es ejecutada por el Agente Maestro?
[ ] PASO 9 - GR-09: ¿npm run build sin errores? ¿0 errores TS?
[ ] PASO 10 - GR-10: ¿Tiempo de build < 60s?

SOLO SI LOS 10 PASOS SON ✅ → MERGE
SI ALGÚN PASO ES ❌ → REJECT with specific feedback
```

---

## 🧩 Agentes Especializados

### 1. Agente Frontend (`@frontend`)

**Dominio:** `src/components/`, `src/pages/`, `src/layouts/`

| ✅ Permitido                               | ❌ Prohibido                                          |
| ------------------------------------------ | ----------------------------------------------------- |
| Crear/modificar componentes `.astro`       | Modificar `global.css` (delegar a @styling)           |
| Definir Props con TypeScript interfaces    | Modificar lógica de auth (delegar a @auth)            |
| Integrar i18n (`translations` prop)        | Crear nuevas claves i18n sin añadirlas a los 3 JSON   |
| Añadir `aria-*`, keyboard navigation       | Modificar archivos en `public/` (delegar a @devtools) |
| Añadir `@media` queries para responsividad | Hardcodear colores o estilos                          |

**Pre-entrega checklist:**

```
[ ] Props con TypeScript interface explícita
[ ] Textos via translations (no hardcodeados)
[ ] aria-* atributos en elementos interactivos
[ ] @media queries en 480/640/768/900/1024 donde aplique
[ ] No hay colores hardcodeados (todo var(--*))
[ ] Docstring en el componente explicando propósito y Props
[ ] Si es página nueva → actualizar ARCHITECTURE.md
```

---

### 2. Agente Estilos (`@styling`)

**Dominio:** `src/styles/global.css`

| ✅ Permitido                                   | ❌ Prohibido                                         |
| ---------------------------------------------- | ---------------------------------------------------- |
| Añadir/modificar variables CSS                 | Modificar componentes `.astro` (delegar a @frontend) |
| Crear nuevos temas (`[data-theme="..."]`)      | Añadir estilos inline en componentes                 |
| Añadir utilidades CSS (`.card`, `.btn`)        | Crear nuevos archivos CSS fuera de `global.css`      |
| Modificar breakpoints y media queries globales | Duplicar estilos ya existentes                       |

**Pre-entrega checklist:**

```
[ ] Toda variable nueva existe en los 4 temas (:root, dark, golden, golden-dark)
[ ] No se duplican estilos con componentes existentes
[ ] Breakpoints consistentes (480/640/768/900/1024)
[ ] Actualizado docs/STYLING.md con las nuevas variables/utilidades
```

---

### 3. Agente DevTools (`@devtools`)

**Dominio:** `public/devtools*.js`, `public/devtools.html`

| ✅ Permitido                                     | ❌ Prohibido                                     |
| ------------------------------------------------ | ------------------------------------------------ |
| Mantener/extender Logger, Floating Button, Panel | Modificar código de la app (src/)                |
| Añadir nuevas herramientas standalone            | Usar librerías externas (jQuery, React, etc.)    |
| Modificar estilos inline del DevTools            | Modificar `global.css` o variables CSS de la app |
| Inyectar elementos en el DOM para debugging      | Modificar el bundle de producción                |

**Pre-entrega checklist:**

```
[ ] Cero dependencias externas
[ ] Auto-activación solo en localhost
[ ] No modifica comportamiento de producción
[ ] Namespacing con __devtools_*
[ ] Actualizado docs/DEVTOOLS.md
```

---

### 4. Agente Testing (`@testing`)

**Dominio:** `tests/`

| ✅ Permitido                             | ❌ Prohibido                                         |
| ---------------------------------------- | ---------------------------------------------------- |
| Escribir tests unitarios con Vitest      | Modificar código fuente (solo testear)               |
| Crear fixtures y mocks                   | Testear implementaciones internas (solo API pública) |
| Ejecutar `npm test` y reportar cobertura | Modificar configuración de build                     |

**Pre-entrega checklist:**

```
[ ] Tests con describe/it descriptivos
[ ] Cobertura de casos edge (null, undefined, error)
[ ] Tests no dependen de estado global mutable
[ ] npm test pasa 100%
```

---

### 5. Agente Documentación (`@docs`)

**Dominio:** `docs/`, `README.md`, `AGENTS.md`, `CLAUDE.md`

| ✅ Permitido                                 | ❌ Prohibido                                    |
| -------------------------------------------- | ----------------------------------------------- |
| Crear/actualizar archivos en `docs/`         | Modificar código fuente                         |
| Mantener índice `docs/README.md` actualizado | Duplicar información entre documentos           |
| Corregir erratas y mejorar claridad          | Reescribir documentación sin motivo             |
| Añadir referencias cruzadas entre docs       | Eliminar documentación existente sin aprobación |

**Pre-entrega checklist:**

```
[ ] Markdown limpio y bien formateado
[ ] No hay información duplicada con otros docs
[ ] Enlaces internos funcionan
[ ] Actualizado docs/README.md si se añadió/quító un archivo
```

---

### 6. Agente Auth & Data (`@auth`)

**Dominio:** `src/lib/firebase.ts`, `src/lib/authStore.ts`, `src/middleware.ts`

| ✅ Permitido                        | ❌ Prohibido                                   |
| ----------------------------------- | ---------------------------------------------- |
| Modificar configuración de Firebase | Modificar componentes UI (delegar a @frontend) |
| Extender AuthStore                  | Exponer API keys en cliente                    |
| Añadir manejo de errores Firebase   | Modificar estilos (delegar a @styling)         |
| Modificar middleware de i18n        | Crear nuevos endpoints sin documentar          |

**Pre-entrega checklist:**

```
[ ] API keys via import.meta.env (nunca hardcodeadas)
[ ] Todos los error codes de Firebase manejados
[ ] AuthStore mantiene patrón Observer
[ ] Middleware no rompe rutas existentes
[ ] Actualizado docs/AUTH.md
```

---

### 7. Agente de Curación e Inteligencia de Negocios (`@curation`)

**Dominio:** `src/data/services/`, `scripts/business-intelligence-lookup.ts`, `docs/AGENT_CURATION_SOP.md`

| ✅ Permitido                                                          | ❌ Prohibido                                                |
| --------------------------------------------------------------------- | ----------------------------------------------------------- |
| Ejecutar `scripts/business-intelligence-lookup.ts`                    | Inventar datos o ingresar negocios falsos (Violación GR-11) |
| Añadir o editar negocios en `src/data/services/<sector>.ts`           | Escribir en un archivo monolítico gigante                   |
| Extraer multimedia real y redes sociales oficiales                    | Quemar tokens de IA haciendo scraping manual libre          |
| Vincular categorías y zonas de los catálogos cerrados                 | Usar categorías o tags inexistentes en la taxonomía         |
| Actualizar `docs/AGENT_CURATION_SOP.md` y `docs/WORKFLOW_CURATION.md` | Omitir `npm run validate:taxonomy` o `npm test`             |

**Pre-entrega checklist (SOP Oficial):**

```
[ ] Ejecución obligatoria de scripts/business-intelligence-lookup.ts
[ ] Coordenadas GPS exactas en la isla de Mallorca
[ ] Horario y teléfono 100% reales y verificados
[ ] Imagen principal y galería oficial sin enlaces rotos
[ ] Categoría existente en CATEGORIES y tags en TAG_CATALOG
[ ] Inserción modular en src/data/services/<sector>.ts
[ ] npm run validate:taxonomy → 100% Válido
[ ] npm test → 100% Passed
```

---

## 📡 Protocolo de Comunicación entre Agentes

### Formato de Request (Agente → Maestro)

```
📤 REQUEST de @frontend al Agente Maestro

Tarea: [Descripción breve]
Archivos a modificar: [lista de paths]
Razón: [justificación del cambio]
Dependencias: [qué otros agentes necesito que actúen primero]
```

### Formato de Response (Maestro → Agente)

```
📥 RESPONSE del Agente Maestro a @frontend

Estado: APPROVED / REJECTED
Cambios aprobados: [lista de archivos]
Agentes notificados: [@styling, @testing, etc.]
Próximo paso: [instrucción]
```

### Formato de Reporte (Agente → Maestro, al terminar)

```
✅ REPORTE de @frontend al Agente Maestro

Archivos modificados:
  - src/components/NuevoComponente.astro (creado)
  - docs/ARCHITECTURE.md (actualizado)

Golden Rules verificadas: GR-01 ✅ GR-02 ✅ GR-03 ✅ GR-04 ✅ GR-07 ✅
Tests: npm test → 12/12 ✅
Build: npm run build → 403ms ✅

Documentación actualizada: docs/ARCHITECTURE.md
```

### Comunicación Directa entre Agentes

Los agentes PUEDEN comunicarse entre sí SIN pasar por el Maestro cuando:

- Necesitan información sobre el estado actual de un archivo (solo lectura)
- Coordinar cambios que no solapan (ej: @frontend pide a @styling una nueva variable)

Los agentes DEBEN pasar por el Maestro cuando:

- Van a modificar archivos (cualquier escritura)
- El cambio afecta a múltiples dominios
- Hay conflicto potencial entre cambios de dos agentes

---

## 🚫 Violaciones y Consecuencias

| Violación                           | Consecuencia                                 |
| ----------------------------------- | -------------------------------------------- |
| Modificar archivos fuera de dominio | Rechazo automático + notificación al Maestro |
| Hardcodear colores/textos           | Rechazo + referencia a GR-01/GR-04           |
| No actualizar documentación         | Rechazo + referencia a GR-06                 |
| No ejecutar tests antes de entregar | Rechazo + referencia a GR-05                 |
| Duplicar información en docs        | Rechazo + instrucción de referenciar         |
| Introducir errores de build         | Rechazo + requerimiento de fix               |

---

## 📋 Flujo de Trabajo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                   USUARIO (tarea)                           │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENTE MAESTRO                                             │
│  ├── Analiza la tarea                                       │
│  ├── Descompone en subtareas por dominio                    │
│  ├── Asigna a agentes especializados (secuencial o paralelo)│
│  └── Establece orden de dependencias                        │
└──────────┬──────────────────┬──────────────────┬────────────┘
           ▼                  ▼                  ▼
    ┌──────────┐       ┌──────────┐       ┌──────────┐
    │@frontend │       │ @styling │       │ @testing │
    │ Crea     │       │ Añade    │       │ Escribe  │
    │componente│       │variables │       │ tests    │
    └────┬─────┘       └────┬─────┘       └────┬─────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            ▼
              ┌─────────────────────────┐
              │  AGENTE MAESTRO         │
              │  ├── Revisa diffs       │
              │  ├── Auditoría GR-01-10 │
              │  ├── npm test           │
              │  ├── npm run build      │
              │  └── ¿Todo ✅?          │
              └──────────┬──────────────┘
                     ✅  │  ❌
                    ┌────┘  └────┐
                    ▼            ▼
                  MERGE      FEEDBACK
                            (específico,
                             accionable)
```

---

## 🔄 Trabajo en Paralelo (Seguro)

**Regla:** Dos agentes pueden trabajar en paralelo si y solo si sus cambios NO solapan en los mismos archivos.

**Ejemplo seguro:**

```
@frontend: src/pages/[...locale]/perfil.astro  (nuevo archivo)
@styling:  src/styles/global.css                (añade variables)
@i18n:     src/i18n/{es,en,ca}.json            (añade claves)
→ Sin solapamiento → PARALELO SEGURO ✅
```

**Ejemplo NO seguro:**

```
@frontend: src/components/Navbar.astro  (modifica)
@auth:     src/components/Navbar.astro  (modifica)
→ Solapamiento → SECUENCIAL OBLIGATORIO ❌
```
