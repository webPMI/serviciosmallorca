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
  currentLocale: "es" | "en" | "ca" | "de";
  translations: Record<string, string>;
}

// ❌ INCORRECTO
const { data } = Astro.props; // sin tipo
```

---

## GR-04: Internacionalización Completa

**Todo texto visible DEBE pasar por el sistema i18n.** Las claves deben existir en los 4 archivos de locale (`es.json`, `en.json`, `ca.json`, `de.json`) con el mismo nombre. Los contenidos de negocio (shortDescription, fullDescription, specialties, etc.) deben estar redactados en los 4 idiomas; si un locale falta, la UI hará fallback a `en`/`es` pero no debe quedar texto vacío.

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

## GR-11: Veracidad, Búsqueda Continua y Transparencia de Verificación (Zero Fake Data)

**Todo servicio, empresa, teléfono, dirección física, sitio web y dato publicado en Servicios Mallorca DEBE ser real y contrastado exhaustivamente contra fuentes públicas oficiales.**

- ❌ **Prohibido atribuir verificación oficial sin intervención humana:** NUNCA se debe afirmar de cara al usuario que un negocio está "100% verificado" si el proceso no ha sido formalmente validado por un representante humano del propio negocio.
- ✅ **Comunicación Clara y Honesta:** Se comunicará que realizamos una búsqueda continua en fuentes oficiales (Google Maps, registros y sitios web oficiales) aplicando pasos exhaustivos de contraste, invitando a la comunidad y a los propios titulares a corroborar y sugerir cambios.
- ❌ PROHIBIDO incluir empresas, números de teléfono, correos electrónicos o reseñas ficticias o inventadas.
- ✅ Cada ficha de servicio debe tener enlaces operativos a su web oficial, teléfono de atención real y dirección física verídica en Mallorca.

---

## GR-12: Protocolo de Indexación y Fidelidad de Datos Google Maps (90%+ Re-indexación)

**El 90%+ de la estructura de datos de cada ficha DEBE re-indexarse y sincronizarse directamente desde los perfiles oficiales de Google Maps / Google Business Profile.**

- ✅ **Nombre Comercial Oficial:** Nombre exacto registrado en Google Maps.
- ✅ **Ubicación & Coordenadas GPS:** Dirección completa con calle, número, código postal y coordenadas geográficas (`lat`, `lng`) verificadas en Mallorca.
- ✅ **Calificación y Reseñas Reales:** Puntuación (1.0 - 5.0) y contador verídico de reseñas públicas de Google.
- ✅ **Horario Operativo Real:** Días y franjas horarias reales de atención al cliente extraídas de la ficha de Google Maps.
- ✅ **Indexación Multiplataforma de Mapas:** Cada ficha debe incluir enlace directo oficial a Google Maps (`googleMapsUrl`), Apple Maps (`appleMapsUrl`) y Bing Maps (`bingMapsUrl`), además del Schema.org enriquecido con `hasMap` y `GeoCoordinates`.

---

## GR-13: Seguridad del Usuario, Protección de Datos y No-Exposición de Backend

**La seguridad de la información, el blindaje de credenciales, la privacidad de los usuarios y la no-exposición de la arquitectura interna son PRIORIDADES INMUTABLES en todo el sistema.**

- 🛑 **Prohibición de Exponer el Stack Backend en UI Pública (Security by Minimization):** Queda terminantemente PROHIBIDO revelar nombres de proveedores de hosting, motores de base de datos, bindings internos o detalles de infraestructura de backend (ej. Cloudflare Workers, D1, Firestore) en textos, mensajes o interfaces visibles al usuario final, con el fin de evitar el reconocimiento y mapeo de vectores de ataque.
- ✅ **Reglas Firestore Blindadas:** Todo cambio en colecciones o documentos debe estar explícitamente autorizado en `firestore.rules` siguiendo el principio de mínimo privilegio. La mutación de roles de usuario desde cliente está terminantemente prohibida.
- ✅ **Cabeceras de Seguridad HTTP:** Todo renderizado SSR debe aplicar cabeceras `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y `Cache-Control: no-store` en rutas privadas (`/dashboard`, `/profile`).
- ✅ **Validación Estricta de Carga Útil:** Los campos de texto libre deben poseer límites de longitud (`withinLength`), y los enlaces/avatares deben validar protocolo `https://`.
- ✅ **Derechos ARCO Inmediatos:** El sistema debe ofrecer siempre mecanismos accesibles y sin trabas para que cualquier usuario o titular de negocio ejerza su derecho de acceso, rectificación o supresión de datos.

---

---

## GR-14: Sincronización Continua con GitHub (Pre-Flight Git Fetch)

**Antes de iniciar cualquier sesión de trabajo o si han transcurrido varias horas (> 12h o un nuevo día), es MANDATORIO e INMUTABLE verificar si el repositorio en GitHub (`origin/main`) avanzó con nuevos commits y sincronizar el entorno local antes de continuar.**

- ✅ **Protocolo de Inicio Obligatorio:** Ejecutar siempre `git fetch origin` y `git status` para comprobar si el repositorio remoto tiene cambios pendientes.
- ✅ **Actualización Previa a la Edición:** Si existen commits remotos (`ahead` en origin), hacer `git pull` antes de comenzar a escribir código o minar negocios para evitar bifurcaciones, colisiones de curación y deuda técnica.
- ❌ **Prohibido:** Empezar a trabajar en local con un repositorio desactualizado respecto al upstream de GitHub.

---

## GR-15: Telemetría, Logs Resilientes y Control de Calidad en Producción (Cloudflare D1)

Todo fallo crítico, excepción SSR, error en cliente y evento financiero anómalo DEBE registrarse de forma estructurada y persistente en el sistema de telemetría D1 (`src/lib/d1Logger.ts`), aplicando deduplicación inteligente para prevenir sobrecarga por errores masivos repetidos.

- ✅ **Cero `try...catch` Silenciosos:** Queda terminantemente prohibido usar bloques `catch (e) {}` vacíos que oculten errores. Deben registrarse con nivel (`ERROR`, `FATAL`, `SECURITY`, `WARN`) y categoría (`SSR`, `API`, `AUTH`, `PAYMENT`, `DATABASE`, `TAXONOMY`, `CLIENT_JS`).
- ✅ **Deduplicación Anti-Spam (Zero Flooding):** El sistema agrupa ráfagas de errores idénticos en ventanas de 5 minutos mediante fingerprint hashing (`level:category:msg:status:url`), evitando saturar D1 si miles de usuarios sufren la misma caída. Los eventos de `SECURITY` y `PAYMENT` siempre se registran sin excepción.
- ✅ **Captura Universal SSR:** Todo renderizado en `src/middleware.ts` captura excepciones 500 y las persiste en la tabla `server_error_logs` con `stack trace`, URL, método, IP y User-Agent.
- ✅ **Telemetría de Cliente en Segundo Plano:** Los errores de JavaScript en el navegador se reportan a `/api/logs/ingest` usando `navigator.sendBeacon` sin bloquear la experiencia del usuario, con deduplicación en memoria del cliente.
- ✅ **Modo Resiliente / Zero-Crash:** El logger debe operar de forma segura y sin arrojar excepciones si el binding de base de datos no está disponible.
- 📖 Consulta la documentación completa en [docs/LOGGING_AND_QUALITY_CONTROL.md](LOGGING_AND_QUALITY_CONTROL.md).

---

## GR-16: Registro de Versiones, Changelog y Trazabilidad Temporal de Despliegues

**Todo despliegue a producción, release o ciclo de actualización técnica o de catálogo DEBE registrarse fehacientemente con su versión semántica, fecha y hora exacta de compilación (timestamp UTC/Europe-Madrid) en `src/data/changelog.ts` y documentarse en el Centro de Actualizaciones (`/actualizaciones`).**

- ✅ **Fidelidad Temporal Obligatoria:** Actualizar `PLATFORM_LAST_BUILD_TIMESTAMP` con la fecha y hora ISO 8601 exacta del despliegue para que los usuarios y auditores conozcan con precisión la frescura de los datos.
- ✅ **Registro de Novedades y Correcciones:** Toda nueva funcionalidad (`FEATURE`), arreglo (`FIX`), optimización (`PERFORMANCE`), ajuste de seguridad (`SECURITY`) o curación de catálogo debe incorporarse al array `CHANGELOG_RELEASES` en los 4 idiomas oficiales (`es`, `en`, `ca`, `de`).
- ✅ **Banner Informativo de Versión:** Toda versión preliminar debe comunicar su estado mediante el componente `BetaBanner.astro` permitiendo acceso instantáneo al registro de cambios y al canal de feedback de la comunidad.
- ❌ **Prohibido:** Desplegar cambios de calado a producción sin actualizar el changelog o dejando fechas y horas desactualizadas respecto al commit de despliegue.

---

## Auditoría del Agente Maestro

Antes de aceptar cualquier cambio, el Agente Maestro verifica:

```
[ ] GR-01: ¿Todos los colores usan variables CSS?
[ ] GR-02: ¿El componente es responsive?
[ ] GR-03: ¿Props y funciones tienen tipos TypeScript?
[ ] GR-04: ¿Textos visibles usan i18n (es, en, ca, de)?
[ ] GR-05: ¿Hay tests para el nuevo código?
[ ] GR-06: ¿Está documentado en docs/?
[ ] GR-07: ¿Elementos interactivos tienen aria-*?
[ ] GR-08: ¿Pasó la revisión del Agente Maestro?
[ ] GR-09: ¿Build sin errores? ¿Tests pasando?
[ ] GR-10: ¿Build time < 60s?
[ ] GR-11: ¿Información y servicios 100% reales y verificados (Zero Fake Data)?
[ ] GR-12: ¿Fidelidad de datos Google Maps (coordenadas, horarios, reseñas y multi-mapas)?
[ ] GR-13: ¿Seguridad de datos de usuario, cabeceras HTTP y reglas Firestore blindadas?
[ ] GR-14: ¿Repositorio local sincronizado con la última versión de GitHub (Pre-Flight Git Fetch)?
[ ] GR-15: ¿Telemetría y registro de errores conectado a Cloudflare D1 sin catch silenciosos?
[ ] GR-16: ¿Versión, fecha y hora exacta de actualización registradas en src/data/changelog.ts y visibles en /actualizaciones?
```
