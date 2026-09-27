# ⚡ Auditoría de Performance y Plan de Optimización — Servicios Mallorca

> Documento vivo (GR-06). Mediciones reales sobre el build y producción del 2026-09-27.
> Cada punto indica **evidencia**, **impacto** y **estado**. Nada aquí es suposición.

---

## 1. Resumen ejecutivo

| # | Hallazgo | Impacto | Estado |
| - | -------- | ------- | ------ |
| P1 | `/es/servicios` generaba **5,5 MB** de HTML (953 fichas, 6,0 s) → `error 1102` | 🔴 Caída del catálogo (503) | ✅ **Resuelto** (paginación SSR) |
| P2 | Chunk JS de **6 MB** con el catálogo completo, alcanzable desde páginas públicas | 🔴 6 MB de JS en el móvil del visitante | ✅ **Resuelto** (import dinámico eliminado) |
| P3 | El chunk de 6 MB sigue cargándose en los 2 dashboards | 🟠 Admin lento en móvil | 🟡 **Pendiente** (ver §4.1) |
| P4 | CSS inlinado por página (`_slug_.css` 54 KB + `Footer.css` 48 KB) | 🟡 Repetición por página | 🟡 **Pendiente** (§4.2) |
| P5 | Sin `<link rel="prev/next">` en `<head>` (BaseLayout no expone slot `head`) | 🟢 Menor para rastreo | 🟡 **Pendiente** (§4.3) |

---

## 2. P1 · Paginación del directorio (resuelto)

Detalle completo en [`DIRECTORY_PAGINATION.md`](DIRECTORY_PAGINATION.md).

- 5,5 MB → **485 KB** por página (−91 %), 48 fichas/página, 20 páginas rastreables.
- Los filtros rápidos pasaron a servidor (enlaces reales) para no dar resultados falsos.

## 3. P2 · El catálogo de 6 MB en el bundle público (resuelto)

**Causa raíz:** `src/lib/serviceActions.ts` resolvía el slug de una ficha con un
`import()` dinámico de `src/data/services/index.ts`. Vite lo empaquetaba como chunk
compartido, de modo que **cualquier página cuyo script importase `serviceActions`
descargaba el catálogo entero**.

Alcanzaba a páginas públicas:

| Página | Motivo | Estado |
| ------ | ------ | ------ |
| `/es/servicios/[slug]` | `scripts/service-detail-client.ts` → `serviceActions` | ✅ Corregido |
| `/es/servicios/nuevo` | script inline → `serviceActions` | ✅ Corregido |

**Solución:** el slug viaja en la propia solicitud (`serviceSlug` se guarda en el claim) y
los paneles (que ya cargan el catálogo) lo resuelven antes de llamar. Se eliminó el
`import()` dinámico.

**Verificación sobre el build:** el chunk `services.*.js` (6.067 KB) solo es referenciado por
`DashboardAdmin` y `DashboardManager`. La Home **nunca** lo cargó (`MallorcaNewsFeed` usa el
catálogo solo en el frontmatter del servidor).

## 4. Optimizaciones pendientes (priorizadas)

### 4.1 · Sacar el catálogo de 6 MB de los dashboards 🟠
`DashboardAdmin.astro` y `DashboardManager.astro` importan `SERVICES` en el **script de
cliente** para pintar tablas y desplegables. Con 953 fichas eso son 6 MB de JS en el
navegador del administrador.

Opciones, de menor a mayor esfuerzo:
1. **Renderizado en servidor**: pasar al script solo un array ligero
   (`{ id, slug, name, status, rating, verified }`) y usar el catálogo completo solo en el
   frontmatter del componente. Es el mismo patrón que ya aplicamos con la isla
   `#service-static-data` en la ficha.
2. Cargar el catálogo bajo demanda (import dinámico al abrir la pestaña de Quality Control).
3. Paginar también las tablas del dashboard.

### 4.2 · Reducir el CSS por página 🟡
`dist/client/_astro` suma **416 KB de CSS**; los mayores son `_slug_.css` (54 KB) y
`Footer.css` (48 KB), que se descargan en cada página por estar en el layout.

- Extraer el CSS del `Footer` y de los bloques de la ficha a `global.css` cacheable
  (el navegador lo reutiliza entre páginas en lugar de repetirlo en cada documento).
- Auditar reglas duplicadas entre `global.css` y los `<style>` locales de componentes
  (`class="item-*"` del admin, por ejemplo, ya se movieron una vez con éxito).

### 4.3 · `rel="prev/next"` en el `<head>` 🟢
`BaseLayout.astro` **no expone un slot `head`**, por lo que hoy solo se emiten
`<a rel="prev">` / `<a rel="next">` (válidos para descubrimiento) y todas las páginas del
directorio en `sitemap.xml`.

Propuesta: añadir `<slot name="head" />` dentro de `<head>` en `BaseLayout.astro` y
aprovecharlo también para canonical/hreflang puntuales. ⚠️ Toca el layout compartido:
coordinar antes de aplicarlo.

### 4.4 · Otras comprobaciones recomendadas (sin medir aún)
- **Imágenes**: verificar `loading="lazy"` + `width`/`height` en `ServiceCard` (CLS y peso).
- **`llms-full.txt` / `agents.json`**: verificar tamaño y coste de generación por visita.
- **KW SESSION**: revisar si sigue usándose; una binding menos es una opción menos que mantener.
- **Vite**: la build avisa de *chunk size*; los chunks pequeños de página conviven con el
  monolito de 6 MB, así que conviene medir el efecto de 4.1 antes de tocar límites.

## 5. Método de medición (reproducible)

```bash
# 1. Peso real de una respuesta sin caché
curl.exe -s -o NUL -w "HTTP %{http_code} | %{size_download} B | %{time_total}s" -m 25 "https://serviciosmallorca.com/es/servicios?_cb=UNICO"

# 2. Chunk más pesado del build
Get-ChildItem dist/client/_astro -File | Sort-Object Length -Descending | Select-Object -First 10

# 3. Quién arrastra un chunk
Get-ChildItem dist/client/_astro -Filter *.js | Select-String -Pattern "services\." -List
```

> ⚠️ No repitas la medición 1 en bucle: descargar varias veces seguidas la misma página
> sin caché puede llevar al Worker a `error 1102` por exceso de CPU. Fue justo lo que
> pasó al medir las 5,5 MB de forma reiterada, y es el motivo de P1.
