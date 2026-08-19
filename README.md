# 🚀 WebApp Starter

> Plantilla base moderna con Astro, i18n, Firebase Auth, sistema multi-tema y DevTools Suite.

[![Astro](https://img.shields.io/badge/Astro-7.1.3-FF5D01?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0.7-6E9F18?logo=vitest)](https://vitest.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.16.0-FFCA28?logo=firebase)](https://firebase.google.com/)

## ⚡ Quick Start

```bash
npm install
npm run dev
# → http://localhost:4321/es/
```

En localhost, el **DevTools Suite** se activa automáticamente:

- 🎯 **Floating Button** (🛠️) - menú contextual draggable
- 📋 **Logger** - intercepta todos los `console.*`
- 🖥️ **DevTools Panel** - `/devtools.html`

Atajos: `Ctrl+Shift+H/L/E/B/D/T/1-4/F`

## 📚 Documentación

Toda la documentación está en [`docs/`](docs/README.md):

| Documento                               | Descripción                       |
| --------------------------------------- | --------------------------------- |
| [GOLDEN_RULES.md](docs/GOLDEN_RULES.md) | 🥇 Reglas inmutables del proyecto |
| [AGENTS.md](docs/AGENTS.md)             | 🤖 Sistema multi-agente           |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | 🏗️ Arquitectura del proyecto      |
| [DEVELOPMENT.md](docs/DEVELOPMENT.md)   | 🛠️ Guía de desarrollo             |
| [STYLING.md](docs/STYLING.md)           | 🎨 Sistema de estilos y temas     |
| [I18N.md](docs/I18N.md)                 | 🌍 Internacionalización           |
| [AUTH.md](docs/AUTH.md)                 | 🔐 Autenticación                  |
| [DEVTOOLS.md](docs/DEVTOOLS.md)         | 🛠️ DevTools Suite                 |

## 🎨 Sistema Multi-Tema

4 temas disponibles vía dropdown selector en el Navbar:

| Tema           | Descripción                        |
| -------------- | ---------------------------------- |
| 🌿 Green Light | Default · Verde bosque sobre claro |
| 🌙 Green Dark  | Verde esmeralda sobre oscuro       |
| ☀️ Gold Light  | Dorado premium sobre crema         |
| ✨ Gold Dark   | Dorado sobre espresso oscuro       |

## 🌍 i18n

- 🇪🇸 Español (default) · 🇬🇧 English · 🇦🇩 Català
- 94+ claves de traducción con paridad verificada por tests

## 🧪 Testing

```bash
npm test          # 12 tests · 2 suites
npm run build     # SSR build con @astrojs/node
```

## 🤖 Sistema Multi-Agente

El proyecto se gestiona mediante un **Agente Maestro** que coordina agentes especializados:

- `@frontend` · `@styling` · `@devtools` · `@testing` · `@docs` · `@auth`

Ver [docs/AGENTS.md](docs/AGENTS.md) para el flujo completo.
