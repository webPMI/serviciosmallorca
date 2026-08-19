# 🛠️ Guía de Desarrollo - WebApp Starter

## Requisitos

- **Node.js** >= 22.12.0
- **npm** >= 10.x
- **Firebase** project configurado (variables de entorno en `.env`)

## Setup Inicial

```bash
# Instalar dependencias
npm install

# Crear archivo .env con variables de Firebase
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:4321/es/
```

## Comandos

| Comando               | Descripción                                       |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build`       | Build de producción (SSR con @astrojs/node)       |
| `npm run preview`     | Vista previa del build de producción              |
| `npm test`            | Ejecutar tests unitarios (Vitest)                 |
| `npm run test:watch`  | Tests en modo watch                               |
| `npm run astro check` | TypeScript type checking                          |

## Estructura de Desarrollo

### Flujo Git recomendado

```
main ← feature/nombre ← PR → review → merge
```

### Convenciones de Código

**Nombrado de archivos:**

- Componentes: `PascalCase.astro`
- Utilidades: `camelCase.ts`
- JSON: `snake_case.json` (locale files)
- Páginas: `kebab-case.astro`

**Commits:**

```
feat: añadir página de perfil de usuario
fix: corregir responsive en dashboard
docs: actualizar golden rules
refactor: migrar estilos a variables CSS
test: añadir tests para login form
```

## Development Server

Cuando se inicia en modo background:

```bash
astro dev --background    # Inicia en background
astro dev status          # Ver estado
astro dev logs            # Ver logs
astro dev stop            # Detener
```

## Testing

```bash
# Todos los tests
npm test

# Watch mode
npm run test:watch

# Test específico
npx vitest run tests/unit/i18n.test.ts
```

**Estructura de tests:**

```
tests/
└── unit/
    ├── i18n.test.ts              # Utilidades i18n & paridad de claves
    ├── theme.test.ts             # Sistema de temas
    ├── permissions.test.ts       # RBAC & permisos
    ├── userProfile.test.ts       # Helpers de Firestore & perfil
    ├── toast.test.ts             # Sistema de notificaciones toast
    ├── toggleMobileMenu.test.ts  # Menú móvil accesible
    └── scrollAwareNavbar.test.ts # Comportamiento scroll-aware del Navbar
```

## Sistema Global de Notificaciones (Toast)

Disponible en cualquier script del frontend mediante `src/lib/toast.ts`:

```typescript
import { toast } from "../lib/toast";

toast.success("¡Operación completada con éxito!");
toast.error("Error al conectar con el servidor", { title: "Error" });
toast.warning("Tu sesión expirará pronto", { duration: 6000 });
toast.info("Nueva versión disponible", { icon: "🚀" });
```

El contenedor accesible `<ToastContainer />` está integrado en `BaseLayout.astro`.

## DevTools

En localhost, el DevTools se activa automáticamente:

- **Logger**: intercepta todos los `console.*` (buffer 500 entradas)
- **Floating Button** 🛠️: menú contextual draggable (esquina inferior derecha)
- **DevTools Panel**: `/devtools.html`

Atajos de teclado: `Ctrl+Shift+H/L/E/B/D/T/1-4`

## Variables de Entorno

```env
PUBLIC_FIREBASE_API_KEY=xxx
PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=xxx
PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
PUBLIC_FIREBASE_APP_ID=xxx
```
