# 🎨 Sistema de Estilos - WebApp Starter

> **Dominio del Agente Estilos (`@styling`)** - `src/styles/global.css`

## Sistema de Temas

El proyecto usa **4 temas** mediante el atributo `data-theme` en `<html>`:

| Tema         | Selector                     | Paleta                           |
| ------------ | ---------------------------- | -------------------------------- |
| Green Light  | `:root` (default)            | Verde `#2d6a4f` sobre `#f8faf9`  |
| Green Dark   | `[data-theme="dark"]`        | Verde `#40916c` sobre `#0f172a`  |
| Golden Light | `[data-theme="golden"]`      | Dorado `#d4a017` sobre `#fdf8f0` |
| Golden Dark  | `[data-theme="golden-dark"]` | Dorado `#d4a017` sobre `#1a1205` |

## Variables CSS por Categoría

### Marca & Paleta Principal

```css
--color-primary       /* Color principal */
--color-primary-light /* Variante clara */
--color-primary-dark  /* Variante oscura */
--color-accent        /* Color de acento */
--color-accent-hover  /* Hover del acento */
```

### Superficies & Fondos

```css
--color-bg             /* Fondo principal */
--color-surface        /* Superficie de tarjetas */
--color-surface-hover  /* Hover de superficies */
--color-surface-border /* Bordes de superficies */
--color-white          /* Blanco (varía por tema) */
```

### Vidrio / Glassmorphism

```css
--glass-bg       /* Fondo translucent */
--glass-border   /* Borde translucent */
--glass-shadow   /* Sombra del glass */
--glass-backdrop /* blur del backdrop */
```

### Texto

```css
--color-text        /* Texto principal */
--color-text-light  /* Texto secundario */
--color-text-muted  /* Texto terciario/deshabilitado */
```

### Colores de Estado

```css
--color-success / --color-success-light / --color-success-bg / --color-success-border
--color-danger  / --color-danger-light  / --color-danger-bg  / --color-danger-border
--color-warning / --color-warning-light / --color-warning-bg / --color-warning-border
--color-info
```

### Colores de Rol

```css
--color-role-user       /* Primary por defecto */
--color-role-manager      /* Azul #3b82f6 */
--color-role-admin      /* Púrpura #8b5cf6 */
--color-role-*-bg       /* Fondo con opacidad */
--color-role-*-border   /* Borde con opacidad */
```

### Sombras

```css
--shadow-sm    /* Sutil */
--shadow       /* Normal */
--shadow-md    /* Medio */
--shadow-lg    /* Grande */
--shadow-glow  /* Brillo (primary/accent) */
```

## Utilidades CSS

### Componentes base

- `.card` - Tarjeta estándar con hover lift
- `.card-glass` - Tarjeta glassmórfica
- `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-accent` / `.btn-outline`
- `.badge` / `.badge-primary` / `.badge-accent`
- `.text-gradient` - Texto con gradiente

### Layout

- `.container` - Contenedor centrado (`max-width: 1200px`)
- `.section` - Sección con padding vertical
- `.grid-auto` - Grid responsivo (`repeat(auto-fit, minmax(280px, 1fr))`)
- `.flex-center` - Flexbox centrado

### Utilidades

- `.hover-lift` - Elevación en hover
- `.fade-in` - Animación de entrada

## Breakpoints

| Breakpoint | Uso principal           |
| ---------- | ----------------------- |
| `480px`    | Small mobile            |
| `640px`    | Mobile (hamburger menu) |
| `768px`    | Tablet                  |
| `900px`    | Dashboard grid collapse |
| `1024px`   | Desktop                 |

## Añadir un Nuevo Tema

1. Crear bloque `[data-theme="nombre"]` en `global.css`
2. Definir TODAS las variables (usar los temas existentes como template)
3. Añadir el tema a `VALID_THEMES` en:
   - `src/layouts/BaseLayout.astro`
   - `public/devtools-floating.js`
   - `public/devtools.html` (panel Theme & Locale)

## Reglas del Agente Estilos

- ✅ Usar siempre `var(--*)` para colores
- ✅ Toda variable nueva debe tener contraparte en los 4 temas
- ✅ Breakpoints consistentes con el proyecto
- ❌ No hardcodear colores en componentes
- ❌ No duplicar estilos entre componentes
