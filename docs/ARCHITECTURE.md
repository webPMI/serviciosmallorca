# 🏗️ Arquitectura - WebApp Starter

## Stack Tecnológico

| Capa       | Tecnología                        | Versión    |
| ---------- | --------------------------------- | ---------- |
| Framework  | Astro (SSR)                       | ^7.1.3     |
| Runtime    | Node.js                           | >=22.12.0  |
| Adapter    | @astrojs/node                     | standalone |
| Auth       | Firebase Auth + Firestore         | ^12.16.0   |
| Testing    | Vitest                            | ^3.0.7     |
| TypeScript |                                   | ^6.0.3     |
| Estilos    | CSS Variables + custom properties | nativo     |

## Estructura del Proyecto

```
webApp-plantilla/
├── public/                    # Archivos estáticos (no procesados por Astro)
│   ├── devtools.html          # Panel DevTools standalone (HTML+JS vanilla)
│   ├── devtools-floating.js   # Floating Button draggable + context-aware
│   ├── devtools-logger.js     # Logger con buffer circular de 500 entradas
│   └── favicon.*              # Favicons
├── src/
│   ├── i18n/                  # Internacionalización
│   │   ├── index.ts           # Utilidades i18n (carga, detección, rutas)
│   │   ├── es.json            # Español (default)
│   │   ├── en.json            # Inglés
│   │   └── ca.json            # Catalán
│   ├── layouts/
│   │   └── BaseLayout.astro   # Layout base (head, meta, theme init, devtools init)
│   ├── pages/
│   │   └── [...locale]/       # Páginas con prefijo de idioma
│   │       ├── index.astro    # Homepage
│   │       ├── login.astro    # Login
│   │       ├── register.astro # Register
│   │       ├── forgot-password.astro  # Recuperación de contraseña
│   │       ├── dashboard.astro        # Dashboard
│   │       ├── privacy.astro          # Política de privacidad
│   │       └── terms.astro           # Términos y condiciones
│   ├── components/            # Componentes reutilizables
│   │   ├── Navbar.astro           # Navbar dinámico (4 variantes según rol)
│   │   ├── NavbarPublic.astro     # Navbar público (visitantes)
│   │   ├── NavbarUser.astro       # Navbar usuario estándar
│   │   ├── NavbarManager.astro    # Navbar manager
│   │   ├── NavbarAdmin.astro      # Navbar admin
│   │   ├── Footer.astro           # Footer con links legales y controles
│   │   ├── LoginForm.astro        # Formulario de login
│   │   ├── RegisterForm.astro     # Formulario de registro
│   │   ├── ForgotPasswordForm.astro # Formulario de recuperación
│   │   ├── ThemeSwitcher.astro    # Dropdown selector de temas
│   │   └── LanguageSwitcher.astro # Selector de idioma
│   ├── lib/                   # Bibliotecas core
│   │   ├── firebase.ts        # Configuración de Firebase
│   │   ├── authStore.ts       # Store reactivo de autenticación (patrón Observer)
│   │   ├── scrollAwareNavbar.ts # Comportamiento scroll-aware para navbars (hide on scroll down)
│   │   ├── toggleMobileMenu.ts  # Lógica compartida de toggle de menú móvil (elimina duplicación)
│   │   └── initAuthNavbar.ts     # Inicializador de auth + logout para navbars autenticados
│   ├── middleware.ts          # Middleware de detección de idioma y redirección
│   └── styles/
│       └── global.css         # Sistema centralizado de estilos y variables CSS
├── tests/
│   └── unit/
│       ├── i18n.test.ts              # Tests de utilidades i18n
│       ├── theme.test.ts             # Tests del sistema de temas
│       └── scrollAwareNavbar.test.ts # Tests del comportamiento scroll-aware
├── docs/                      # Documentación
├── astro.config.mjs           # Configuración de Astro (i18n, adapter)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Sistema de Temas

El proyecto soporta **4 temas**:

| Tema           | `data-theme`  | Paleta                                | Descripción         |
| -------------- | ------------- | ------------------------------------- | ------------------- |
| 🌿 Green Light | `light`       | Verde bosque sobre fondo claro        | Tema por defecto    |
| 🌙 Green Dark  | `dark`        | Verde esmeralda sobre fondo oscuro    | Modo oscuro clásico |
| ☀️ Gold Light  | `golden`      | Dorado premium sobre fondo crema      | Tema premium claro  |
| ✨ Gold Dark   | `golden-dark` | Dorado brillante sobre fondo espresso | Tema premium oscuro |

**Sistema de variables CSS:**

- Todas las variables definidas en `:root` con contrapartes en `[data-theme="dark"]`, `[data-theme="golden"]`, `[data-theme="golden-dark"]`
- Categorías: primary, surface, glass, text, success, danger, warning, role-specific, shadows, footer

## Sistema de Autenticación

**Flujo:**

1. Firebase Auth (`src/lib/firebase.ts`) + Firestore para roles
2. `AuthStore` (`src/lib/authStore.ts`) - patrón Observer con suscriptores
3. Roles: `guest` → `user` → `manager` → `admin`
4. El Navbar detecta el rol y muestra la variante correspondiente

## Internacionalización (i18n)

**Flujo:**

1. `middleware.ts` detecta idioma (cookie → Accept-Language → default 'es')
2. Redirección a `/[locale]/` (prefijo obligatorio)
3. Los componentes reciben `translations` como prop
4. Claves con dot notation: `nav.home`, `auth.login.title`, etc.

## DevTools Suite

**Componentes standalone (vanilla JS, 0 dependencias):**

- **devtools-logger.js**: Intercepta console.*, buffer circular 500 entradas, API `window.__devtoolsLogger`
- **devtools-floating.js**: Botón flotante draggable + menú contextual, auto-persistente en navegación SPA
- **devtools.html**: Panel completo con autofill, state inspectors, visualización de logs en tiempo real

## Flujo de Datos

```
URL → middleware.ts (detecta locale)
  → [locale]/pagina.astro
    → BaseLayout.astro (head, theme init, devtools init)
    → Navbar (dinámico según authStore)
    → Componentes (reciben translations + datos)
    → Footer
```
