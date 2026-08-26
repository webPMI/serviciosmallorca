# 🎨 Sistema de Estilos & Diseño — Servicios Mallorca

> **Dominio del Agente Estilos (`@styling`)** — `src/styles/global.css` & `src/styles/service-detail.css`

---

## 1. Sistema de Temas (Mediterranean Palette)

El proyecto prioriza por defecto la paleta **Mediterránea Dorada (Golden)** y soporta 4 temas mediante el atributo `data-theme` en `<html>`:

| Tema             | Selector                                      | Paleta                                        | Uso Principal         |
| :--------------- | :-------------------------------------------- | :-------------------------------------------- | :-------------------- |
| **Golden Light** | `[data-theme="golden"]` _(Default)_           | Dorado `#d4a017` sobre arena cálido `#fdf8f0` | Tema oficial diurno   |
| **Golden Dark**  | `[data-theme="golden-dark"]` _(Default Dark)_ | Dorado `#d4a017` sobre noche balear `#1a1205` | Tema oficial nocturno |
| **Green Light**  | `:root` / `[data-theme="green"]`              | Verde pino `#2d6a4f` sobre `#f8faf9`          | Alternativo natural   |
| **Green Dark**   | `[data-theme="dark"]`                         | Verde esmeralda `#40916c` sobre `#0f172a`     | Alternativo oscuro    |

### Script Anti-FOUC en `BaseLayout.astro`

El tema se inicializa en el `<head>` antes del renderizado HTML para evitar parpadeos:

```js
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const defaultTheme = prefersDark ? "golden-dark" : "golden";
const theme = savedTheme || defaultTheme;
document.documentElement.setAttribute("data-theme", theme);
```

---

## 2. Micro-Animaciones & Skeleton Shimmer Loader

### Shimmer Wave para Carga de Imágenes (`ServiceImage.astro`)

```css
.service-img-skeleton {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: var(--color-surface-hover, #e2e8f0);
  overflow: hidden;
}

.skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: skeleton-wave 1.6s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes skeleton-wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

### Transición Suave de Imágenes (_Zero Layout Shift_)

```css
.service-real-img {
  opacity: 0;
  transform: scale(1.02);
  transition:
    opacity 0.4s ease-out,
    transform 0.4s ease-out;
}

.service-real-img.is-loaded {
  opacity: 1;
  transform: scale(1);
}
```

---

## 3. Componentes y Badges del Sistema de Grafos

### Píldoras de Capacidades (`.service-capabilities-row` & `.cap-pill`)

Diseñadas para identificar rápidamente atributos de intención de búsqueda:

```css
.service-capabilities-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.35rem 0 0.5rem 0;
}

.cap-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.68rem;
  font-weight: 500;
  padding: 0.15rem 0.45rem;
  border-radius: var(--border-radius-full, 9999px);
  background: var(--color-surface, #f8fafc);
  border: 1px solid var(--color-surface-border, #e2e8f0);
  color: var(--color-text, #334155);
}
```

### Botones de Acción Inteligente (`.smart-action-btn`)

Botones contextuales que varían automáticamente por sector:

- Gastronomía: _"Reserva Mesa"_ / _"Ver Carta"_.
- Estética y Tatuajes: _"Pedir Presupuesto"_ / _"Pedir Cita"_.
- Urgencias y Reformas: _"Llamar 24h"_ / _"WhatsApp Directo"_.

---

## 4. Breakpoints y Diseño Adaptable (GR-02)

| Breakpoint | Ancho (px)       | Comportamiento                                                                         |
| :--------- | :--------------- | :------------------------------------------------------------------------------------- |
| **xs**     | `< 480px`        | Móvil compacto: Selector de idioma sin texto (solo bandera/código), grid de 1 columna. |
| **sm**     | `480px - 640px`  | Móvil amplio: Tarjetas de servicio en columna completa, acciones en fila.              |
| **md**     | `641px - 768px`  | Tablet: Grid de 2 columnas para el catálogo, menú hamburguesa activo.                  |
| **lg**     | `769px - 1024px` | Portátil: Grid de 3 columnas, barra de navegación expandida.                           |
| **xl**     | `> 1024px`       | Desktop: Grid de 3-4 columnas, layout extendido con mapa lateral.                      |
