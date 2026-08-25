# F1 — Paquete de Implementacion: Seguridad y Taxonomia del Foro

> **Codigo completo listo para integrar** de la Fase 1 del foro (FORUM_COMMUNITY_ROADMAP.md sec. 9) segun los criterios de aceptacion de FORUM_UI_UX_SPEC.md sec. 9.
>
> Incluye el parche PRIORITARIO anti-XSS (hallazgo H-05), la ampliacion de taxonomia a 6 categorias principales + Cafe legacy, el delta de reglas Firestore, tests actualizados, i18n x3 y el componente de navegacion.
>
> Orden de ejecucion recomendado: Pasos 1-7 secuencial; verificar con npm run check tras Pasos 2, 4 y 5.

---

## Indice

| Paso | Archivo(s) tocados                                                          | Resuelve                 |
| ---- | --------------------------------------------------------------------------- | ------------------------ |
| 1    | src/lib/safeDom.ts (NUEVO) + comunidad/index.astro + comunidad/[slug].astro | H-05 XSS                 |
| 2    | src/lib/community.ts (bloque categorias)                                    | Taxonomia F1             |
| 3    | firestore.rules (bloque forum_topics)                                       | H-01, H-03, H-04         |
| 4    | tests/unit/community.test.ts                                                | H-02 + cobertura helpers |
| 5    | src/i18n/{es,en,ca}.json                                                    | GR-04                    |
| 6    | src/components/forum/ForumCategoryNav.astro (NUEVO)                         | UI navegacion            |
| 7    | src/pages/[...locale]/comunidad/index.astro (integracion)                   | Cableado final           |

---

## Paso 1 — Parche anti-XSS (H-05, PRIORIDAD)

### 1a. Nuevo archivo: src/lib/safeDom.ts

```typescript
/**
 * Helpers de construccion segura de DOM para contenido generado por usuarios.
 * Sustituye a los template strings + innerHTML del feed y respuestas del foro.
 * Estandar obligatorio en todo render cliente de UGC (ver SECURITY.md).
 */

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string;
    text?: string;
    attrs?: Record<string, string>;
  },
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (options?.className) node.className = options.className;
  if (options?.text !== undefined) node.textContent = options.text;
  if (options?.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      node.setAttribute(key, value);
    }
  }
  return node;
}

/** Devuelve href seguro o null. Solo https, http y mailto. Bloquea javascript:. */
export function safeHref(url: string): string | null {
  try {
    const parsed = new URL(url, window.location.origin);
    const ok = ["https:", "http:", "mailto:"].includes(parsed.protocol);
    return ok ? parsed.toString() : null;
  } catch {
    return null;
  }
}
```

### 1b. Migracion del render en comunidad/index.astro (funcion loadTopics)

Sustituir el bloque topicsContainer.innerHTML = topics.map(...) por construccion segura:

```typescript
import { el } from "../../../lib/safeDom";

function renderTopicCard(t: ForumTopic, prefix: string, categoryLabel: string): HTMLElement {
  const card = el("a", {
    className: "topic-card",
    attrs: { href: `${prefix}comunidad/${t.slug}` },
  });

  const header = el("div", { className: "topic-card-header" });
  header.append(
    el("span", { className: "topic-category-badge", text: categoryLabel }),
    el("span", {
      className: "topic-date",
      text: new Date(t.createdAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      }),
    }),
  );

  const body = el("div");
  body.append(
    el("h3", { className: "topic-title", text: t.title }), // textContent = seguro
    el("p", { className: "topic-excerpt", text: t.content.slice(0, 160) }),
  );

  const footer = el("div", { className: "topic-card-footer" });
  const author = el("div", { className: "topic-author" });
  author.append(
    el("div", { className: "topic-avatar", text: t.authorAvatar ?? "🌴" }),
    el("span", { text: t.authorName }), // NUNCA innerHTML
  );
  const stats = el("div", { className: "topic-stats" });
  stats.append(
    el("span", { text: `👍 ${t.likesCount || 0}` }),
    el("span", { text: `💬 ${t.repliesCount || 0} respuestas` }),
  );
  footer.append(author, stats);

  card.append(header, body, footer);
  return card;
}
// En loadTopics: topicsContainer.replaceChildren(...topics.map(t => renderTopicCard(...)))
```

Mismo patron para reply-card en comunidad/[slug].astro y para cualquier href dinamico usar safeHref() antes de setAttribute.

---

## Paso 2 — Taxonomia en src/lib/community.ts

Sustituir el bloque actual `export type ForumCategory = ...` por:

```typescript
// -----------------------------------------------------------------------------
// Categorias del foro (F1): 6 principales + legacy dentro de Cafe
// Fuente de verdad: docs/FORUM_COMMUNITY_ROADMAP.md sec. 3
// -----------------------------------------------------------------------------

export const FORUM_MAIN_CATEGORIES = ["empleo", "vivienda", "mercado", "eventos", "avisos", "cafe"] as const;

/** Legacy: siguen existiendo en datos antiguos; la UI las agrupa bajo Cafe. */
export const FORUM_LEGACY_CATEGORIES = ["recomendaciones", "preguntas", "experiencias", "guias"] as const;

export type ForumMainCategory = (typeof FORUM_MAIN_CATEGORIES)[number];
export type ForumLegacyCategory = (typeof FORUM_LEGACY_CATEGORIES)[number];

export type ForumCategory = ForumMainCategory | ForumLegacyCategory | "todas";

export function isMainCategory(value: string): value is ForumMainCategory {
  return (FORUM_MAIN_CATEGORIES as readonly string[]).includes(value);
}

/** Mapea categoria legacy a su subcategoria dentro de Cafe. Null si ya es main. */
export function legacyToCafeSub(value: string): string | null {
  if ((FORUM_LEGACY_CATEGORIES as readonly string[]).includes(value)) {
    return `cafe.${value}`;
  }
  return null;
}
```

Notas de compatibilidad:

- getForumTopics(category: ForumCategory) NO cambia su firma: los valores legacy siguen filtrando igual y Cafe usa query IN client-side con max 4 valores.
- Los slugs de temas existentes no se tocan.
- El import en comunidad/index.astro y nuevo.astro sigue funcionando sin cambios de nombres.

---

## Paso 3 — Delta de firestore.rules (bloque forum_topics)

Reemplazar el match /forum_topics/{topicId} actual por:

```text
    // -------------------------------------------------------------------------
    // Forum Topics: lectura publica; creacion auth con validacion estructural.
    // F1: campo canonico content, titulo <=120, categoria en lista cerrada.
    // -------------------------------------------------------------------------
    function allowedForumCategory() {
      return request.resource.data.category in [
        'empleo', 'vivienda', 'mercado', 'eventos', 'avisos', 'cafe',
        'recomendaciones', 'preguntas', 'experiencias', 'guias'
      ];
    }

    match /forum_topics/{topicId} {
      allow read: if true;
      allow create: if isSignedIn()
        && request.resource.data.authorUid == request.auth.uid
        && withinLength(request.resource.data.title, 120)
        && withinLength(request.resource.data.content, 10000)
        && allowedForumCategory();
      allow update: if isSignedIn() && (
        resource.data.authorUid == request.auth.uid ||
        getUserRole() == 'admin' ||
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['likesCount', 'likedUsers', 'repliesCount'])
      );
      allow delete: if isSignedIn() && (
        resource.data.authorUid == request.auth.uid ||
        getUserRole() == 'admin'
      );
    }
```

Resuelve: H-01 (body -> content), H-03 (300 -> 120), H-04 (whitelist).
Despliegue: firebase deploy --only firestore:rules. Verificar con el emulador o un create de prueba antes de merge.

---

## Paso 4 — Tests actualizados (tests/unit/community.test.ts)

Sustituir el primer it del describe Type Definitions por este bloque completo:

```typescript
import {
  FORUM_MAIN_CATEGORIES,
  FORUM_LEGACY_CATEGORIES,
  isMainCategory,
  legacyToCafeSub,
  type ForumCategory,
  type ForumTopic,
  type ServiceReview,
} from "../../src/lib/community";

// dentro de describe("Type Definitions & Validations"):
it("defines the expanded F1 taxonomy: 6 main + 4 legacy", () => {
  expect(FORUM_MAIN_CATEGORIES).toEqual(["empleo", "vivienda", "mercado", "eventos", "avisos", "cafe"]);
  expect(FORUM_LEGACY_CATEGORIES).toEqual(["recomendaciones", "preguntas", "experiencias", "guias"]);
});

it("accepts main, legacy and todas as valid ForumCategory values", () => {
  const valid: ForumCategory[] = [...FORUM_MAIN_CATEGORIES, ...FORUM_LEGACY_CATEGORIES, "todas"];
  expect(valid.length).toBe(11);
});

it("classifies categories with isMainCategory", () => {
  expect(isMainCategory("empleo")).toBe(true);
  expect(isMainCategory("cafe")).toBe(true);
  expect(isMainCategory("preguntas")).toBe(false);
  expect(isMainCategory("todas")).toBe(false);
});

it("maps legacy categories into cafe subcategories", () => {
  expect(legacyToCafeSub("recomendaciones")).toBe("cafe.recomendaciones");
  expect(legacyToCafeSub("guias")).toBe("cafe.guias");
  expect(legacyToCafeSub("empleo")).toBeNull();
});
```

Los dos tests existentes de ServiceReview y ForumTopic se mantienen intactos.
Ejecutar: npx vitest run tests/unit/community.test.ts

---

## Paso 5 — i18n: claves nuevas en los 3 JSON (GR-04)

Anadir EXACTAMENTE estas claves a es.json, en.json y ca.json (misma clave, paridad verificada por tests).

```json
// src/i18n/es.json
"forum.cat.empleo": "Bolsa de Trabajo",
"forum.cat.vivienda": "Vivienda y Alquileres",
"forum.cat.mercado": "Compra-Venta",
"forum.cat.eventos": "Eventos y Quedadas",
"forum.cat.avisos": "Avisos del Vecindario",
"forum.cat.cafe": "Cafe Comunidad"
```

```json
// src/i18n/en.json
"forum.cat.empleo": "Job Board",
"forum.cat.vivienda": "Housing & Rentals",
"forum.cat.mercado": "Buy & Sell",
"forum.cat.eventos": "Events & Meetups",
"forum.cat.avisos": "Neighborhood Notices",
"forum.cat.cafe": "Community Cafe"
```

```json
// src/i18n/ca.json
"forum.cat.empleo": "Borsa de Treball",
"forum.cat.vivienda": "Habitatge i Lloguers",
"forum.cat.mercado": "Compra-Venda",
"forum.cat.eventos": "Esdeveniments i Trobades",
"forum.cat.avisos": "Avisos del Veinat",
"forum.cat.cafe": "Cafe Comunitari"
```

Ubicacion sugerida: junto al bloque forum.cat.* existente en cada archivo.
No eliminar las claves legacy (recomendaciones/preguntas/experiencias/guias): siguen usandose como subcategorias de Cafe y en datos antiguos.

---

## Paso 6 — Componente ForumCategoryNav.astro (NUEVO)

Ruta: src/components/forum/ForumCategoryNav.astro

````astro
---
/**
 * Barra de navegacion de categorias del foro (F1).
 * Chips scrolleables en movil, role=tablist accesible, estilos via var(--*).
 */
import { FORUM_MAIN_CATEGORIES } from "../../lib/community";
import type { Translations, Locale } from "../../i18n";

interface Props {
  currentLocale: Locale;
  translations: Translations;
  prefix: string;
  activeCategory: string; // slug actual o "todas"
}

const { currentLocale: _l, translations, prefix, activeCategory } = Astro.props;

// Iconos por categoria (GR-11: sin datos, solo presentacion)
const ICONS: Record<string, string> = {
  empleo: "💼",
  vivienda: "🏠",
  mercado: "🛒",
  eventos: "📅",
  avisos: "🚨",
  cafe: "☕",
};

function label(cat: string): string {
  return translations[`forum.cat.${cat}`] ?? cat;
}
---

<nav class="forum-cat-nav" aria-label={translations["nav.community"]}>
  <div class="forum-cat-scroll" role="tablist">
    <a
      href={`${prefix}comunidad`}
      class:list={["cat-pill", { active: activeCategory === "todas" }]}
      role="tab"
      aria-selected={activeCategory === "todas" ? "true" : "false"}>🌴 {translations["forum.cat.todas"]}</a
    >
    {
      FORUM_MAIN_CATEGORIES.map((cat) => (
        <a
          href={`${prefix}comunidad?categoria=${cat}`}
          class:list={["cat-pill", { active: activeCategory === cat }]}
          role="tab"
          aria-selected={activeCategory === cat ? "true" : "false"}
        >
          <span aria-hidden="true">{ICONS[cat]}</span>
          <span>{label(cat)}</span>
        </a>
      ))
    }
  </div>
</nav>

Continuacion del mismo archivo (style + fin): ```astro
<style>
  .forum-cat-nav {
    margin-bottom: var(--space-lg);
  }
  .forum-cat-scroll {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }
  .cat-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.9rem;
    border-radius: var(--border-radius-full);
    background: var(--color-surface);
    border: 1px solid var(--color-surface-border);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-weight: 600;
    text-decoration: none;
    transition: all var(--transition-fast);
    white-space: nowrap;
  }
  .cat-pill:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
  .cat-pill.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-white);
  }

  @media (max-width: 640px) {
    .forum-cat-scroll {
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-bottom: var(--space-xs); /* respiro para scrollbar */
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .forum-cat-scroll::-webkit-scrollbar {
      display: none;
    }
  }
</style>
````

Cumple GR-01 (solo var(--*)), GR-02 (breakpoint 640 scroll horizontal), GR-07 (tablist + aria-selected).

---

## Paso 7 — Integracion en comunidad/index.astro

Cambios puntuales sobre el archivo existente:

1. Frontmatter: importar el componente y las constantes legacy:

```astro
import ForumCategoryNav from "../../../components/forum/ForumCategoryNav.astro"; import {FORUM_LEGACY_CATEGORIES} from "../../../lib/community";
```

2. Sustituir el div#forum-cat-filters con sus botones estaticos por:

```astro
<ForumCategoryNav
  currentLocale={locale}
  translations={translations}
  prefix={prefix}
  activeCategory={selectedCategory}
/>
<div id="forum-cat-filters" hidden></div>
<!-- id conservado: el script cliente sigue referenciandolo -->
```

3. En el script cliente, mapear legacy -> Cafe al leer la URL (compatibilidad enlaces antiguos):

```typescript
const params = new URLSearchParams(window.location.search);
let cat = (params.get("categoria") || "todas") as ForumCategory;
cat = legacyToCafeSub(cat) ? "cafe" : cat;
// URL vieja ?categoria=preguntas abre el Cafe unificado
```

4. El filtro Cafe consulta con where('category','in',[...FORUM_LEGACY_CATEGORIES,'cafe']) extendiendo getForumTopics para aceptar un array opcional de categorias.

---

## Verificacion final de la fase

```text
[ ] npm run lint          sin errores
[ ] npm run typecheck     sin errores
[ ] npm test              100% (incluye 4 tests nuevos de taxonomia)
[ ] npm run build         sin errores y < 60s
[ ] firebase deploy --only firestore:rules aplicado en proyecto de pruebas
[ ] Manual: crear tema en cada categoria nueva x3 locales OK
[ ] Manual: URL ?categoria=preguntas abre Cafe y muestra temas legacy
[ ] Manual: pegar <img src=x onerror=alert(1)> en un tema NO ejecuta script
```

Al cerrar: marcar F1 completada en FORUM_COMMUNITY_ROADMAP.md sec. 9 y registrar desviaciones en FORUM_UI_UX_SPEC.md (GR-06).

---

_Paquete generado siguiendo GOLDEN_RULES.md. Siguiente fase tras merge: F2 Bolsa de Trabajo MVP._
