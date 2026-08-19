# 🥇 Golden Rules - WebApp Starter

> **Reglas inmutables que todo agente y desarrollador DEBE respetar.**
> El Agente Maestro audita cada cambio contra estas reglas antes de cualquier merge.

---

## GR-01: Estilos Centralizados

**Todo color, sombra, borde, tipografía y espaciado DEBE definirse en `src/styles/global.css` mediante variables CSS.**

- ✅ `color: var(--color-primary)` - CORRECTO
- ❌ `color: #2d6a4f` - PROHIBIDO
- ❌ `background: rgba(45, 106, 79, 0.1)` - PROHIBIDO (usar `var(--color-primary-bg)`)

**Excepción:** Solo colores de marca de terceros en SVG (Google `#4285F4`, etc.)

---

## GR-02: Responsividad Obligatoria

**Todo componente y página DEBE ser responsive.** Breakpoints estándar:

| Breakpoint        | Uso                                                |
| ----------------- | -------------------------------------------------- |
| `480px`           | Small mobile - forms compactos, botones full-width |
| `640px`           | Mobile - hamburger menu, grids 1 columna           |
| `768px` - `900px` | Tablet - reorganización de layouts                 |
| `1024px`          | Desktop - estado base                              |

- ✅ Todo componente con `@media` queries donde sea necesario
- ❌ Componente sin media queries en producción

---

## GR-03: TypeScript Estricto

**Props y funciones deben tener tipos explícitos.**

```typescript
// ✅ CORRECTO
interface Props {
  currentLocale: "es" | "en" | "ca";
  translations: Record<string, string>;
}

// ❌ INCORRECTO
const { data } = Astro.props; // sin tipo
```

---

## GR-04: Internacionalización Completa

**Todo texto visible DEBE pasar por el sistema i18n.** Las claves deben existir en los 3 archivos de locale (`es.json`, `en.json`, `ca.json`) con el mismo nombre.

- ✅ `{translations["nav.home"]}`
- ❌ `Inicio` (hardcodeado)

---

## GR-05: Testing Requerido

**Todo nuevo feature o fix DEBE incluir tests.** Cobertura mínima de tests unitarios para:

- Utilidades (i18n, helpers)
- Componentes críticos (forms, auth)
- Sistema de temas

Comando: `npm test` (Vitest)

---

## GR-06: Documentación Actualizada

**Todo nuevo componente, página o utilidad DEBE estar documentado** en los archivos correspondientes de `docs/`.

- Componentes → docstring en el archivo `.astro`
- Arquitectura → `docs/ARCHITECTURE.md`
- Estilos → `docs/STYLING.md`

---

## GR-07: Accesibilidad

**Atributos ARIA obligatorios** en elementos interactivos:

- ✅ `aria-label`, `aria-expanded`, `aria-current`, `role`
- ✅ Navegación por teclado (tabindex, keyboard events)
- ✅ Contraste suficiente (WCAG AA mínimo)

---

## GR-08: Agente Maestro

**Todo cambio debe ser coordinado por el Agente Maestro:**

1. Agente especializado implementa el cambio
2. Agente Maestro audita contra las Golden Rules
3. Agente Maestro ejecuta `npm test` y `npm run build`
4. Si todo pasa → merge. Si falla → rechazar con feedback

---

## GR-09: Zero Console Errors

**La aplicación no debe tener errores en consola ni warnings de TypeScript.**

- `npm run build` debe completarse sin errores
- `npm test` debe pasar 100%
- TypeScript: 0 errores en `astro check`

---

## GR-10: Performance

**El tiempo de build no debe exceder 60 segundos en desarrollo local.**

- Optimizar imports (no cargar Firebase completo si no es necesario)
- Lazy loading de componentes pesados
- Assets optimizados (SVG, WebP)

---

## Auditoría del Agente Maestro

Antes de aceptar cualquier cambio, el Agente Maestro verifica:

```
[ ] GR-01: ¿Todos los colores usan variables CSS?
[ ] GR-02: ¿El componente es responsive?
[ ] GR-03: ¿Props y funciones tienen tipos TypeScript?
[ ] GR-04: ¿Textos visibles usan i18n?
[ ] GR-05: ¿Hay tests para el nuevo código?
[ ] GR-06: ¿Está documentado en docs/?
[ ] GR-07: ¿Elementos interactivos tienen aria-*?
[ ] GR-08: ¿Pasó la revisión del Agente Maestro?
[ ] GR-09: ¿Build sin errores? ¿Tests pasando?
[ ] GR-10: ¿Build time < 60s?
```
