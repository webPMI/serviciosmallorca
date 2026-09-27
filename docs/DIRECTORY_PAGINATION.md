# 📄 Paginación SSR del Directorio `/servicios` — Actuación tras el error 1102

> Documento vivo (GR-06). Decisión de arquitectura + measurements. La lógica vive en
> `src/lib/directoryPagination.ts` y `src/lib/directoryIntents.ts` (puras y testeadas, GR-05).

---

## 1. Incidente que la motiva

El **27 de nueve de 2026**, durante una verificación de producción, el directorio
`/es/servicios` devolvió **`error 1102`** (Worker exceeded resource limits) y luego **503**
en varias peticiones consecutivas sin caché.

Medición del documento HTML generado por el servidor (cache-miss):

| Métrica | Antes | Después |
| ------- | ----- | ------- |
| Tamaño del HTML | **5,5 MB** (5.507.736 bytes) | **~485 KB** |
| Fichas renderizadas | 953 (todas) | 48 (una página) |
| Tiempo de render (producción) | 6,0 s | — (medir tras desplegar) |
| Páginas de directorio | 1 (gigante) | 20 |

Causa raíz: la página renderizaba **`SERVICES.map(...)` con las ~953 fichas** y ocultaba las
que noFiltered con `style="display:none"`. El HTML contenía el catálogo entero aunque el
visitante solo fuera a ver 48 resultados. Con tráfico o crawlers, ese render de 6 s y 5,5 MB
consume el presupuesto de CPU del Worker y provoca 1102 → 503 para el usuario.

## 2. Decisión

**Paginación en el servidor con URLs reales** (`?pagina=N`), no "cargar más" en cliente:

- Cada página es un documento pequeño, **cacheable de forma independiente** y con
  presupuesto de CPU acotado → desaparece el riesgo de 1102.
- Cada página es una **URL rastreable**: imprescindible para el posicionamiento en
  buscadores y para los agentes de IA (GEO), que era el objetivo de la campaña GEO/GEO-IA.
- Sin JavaScript la paginación funciona igual (enlaces `<a>` reales), lo que mejora la
  accesibilidad y el rastreo.

### Parámetros soportados

| Parámetro | Ejemplo | Nota |
| --------- | ------- | ---- |
| `pagina` | `?pagina=3` | 1-based; fuera de rango se normaliza (nunca vacía) |
| `categoria` | `?categoria=tecnologia-seguridad` | Se conserva al paginar |
| `zona` | `?zona=palma` | Se conserva al paginar |
| `q` | `?q=tattoo` | Se conserva al paginar |
| `intencion` | `?intencion=accessible` | Filtro rápido, resuelto **en servidor** |

`buildDirectoryHref()` garantiza que **paginar nunca pierde el contexto**: la página 1
omite `?pagina=` para mantener la URL canónica limpia.

## 3. Los filtros rápidos pasaron a servidor (importante)

Los chips "Abierto ahora / Inglés-Alemán / Con terraza / Pet friendly / Accesible" eran
`<button>` con filtrado en cliente. Con paginación eso habría sido **incorrecto**: el
cliente solo tendría las 48 fichas de la página actual y devolvería resultados falsos
("no hay resultados" cuando sí los hay en la página 3).

Solución aplicada:

1. Los chips son ahora **enlaces reales** (`<a href="…?intencion=…">`) → funcionan sin JS.
2. La lógica se extrajo a `src/lib/directoryIntents.ts`, **una única implementación**
   usada por el SSR (antes estaba duplicada entre los `data-*` de cada tarjeta y una
   heurística `isBusinessCurrentlyOpen()` dentro del script inline).
3. Se eliminaron ~4 KB de JavaScript muerto del cliente.
4. El buscador instantáneo **se mantiene** cuando el resultado cabe en una página; si hay
   paginación, delega en el servidor (el formulario ya es `GET`) para no dar resultados
   parciales, y se muestra un aviso al usuario.

## 4. Descubrimiento lateral: rendimiento real

- Se eliminaron 5 `data-*` por ficha (`schedule`, `status`, `multilingual`, `terrace`, `pet`,
  `accessible`) que solo existían para el filtrado en cliente ahora eliminado: menos HTML.
- `renderPage` está **memoizado** por `(locale, params)` para que la paginación no repita
  el cálculo de ranking en cada petición.

## 5. Verificación (local, dev server)

| URL | Resultado |
| --- | --------- |
| `/es/servicios` | 485 KB · 48 fichas · nav "Página 1 de 20" · destacados visibles |
| `/es/servicios?pagina=2` | 490 KB · 48 fichas · "Página 2 de 20" |
| `/es/servicios?pagina=20` | 441 KB · 41 fichas (última parcial) · "Página 20 de 20" |
| `/es/servicios?categoria=tecnologia-seguridad&pagina=2` | 25 fichas (cabe en 1 página → sin nav) |
| `/es/servicios?intencion=accessible` | contador 227 fichas · chip activo · destacados ocultos |
| `/es/servicios?intencion=accessible&pagina=2` | "Página 2 de 5" · la intención se conserva en los enlaces |

- `npx tsc --noEmit` → 0 errores
- `npx vitest run` → 100 ficheros / 889 tests en verde (25 nuevos de paginación e intenciones)
- `npm run build` → OK

## 6. Pendiente

- [ ] **Desplegar** y volver a medir `/es/servicios` en producción (objetivo: < 1 MB y sin 1102).
- [ ] Registrar esta decisión en `docs/README.md` y en `src/data/changelog.ts` cuando el
      árbol de trabajo esté limpio (otro agente tenía cambios en curso).
- [ ] Considerar `rel="prev"/"next"` en el `<head>`: `BaseLayout.astro` no expone un slot
      `head`, por lo que ahora solo se emiten `<a rel="prev">` / `<a rel="next">` (válido para
      descubrimiento de crawlers) más todas las páginas en `sitemap.xml`.
