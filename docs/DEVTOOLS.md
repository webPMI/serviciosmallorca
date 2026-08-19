# 🛠️ DevTools Suite - WebApp Starter

> **Dominio del Agente DevTools (`@devtools`)**

La DevTools Suite es un conjunto de herramientas standalone (vanilla JS, 0 dependencias) que se activan automáticamente en localhost.

---

## Componentes

### 📋 Logger (`devtools-logger.js`)

Intercepta `console.log`, `warn`, `error`, `info`, `debug` y los almacena en un buffer circular de 500 entradas.

**API:** `window.__devtoolsLogger`

```js
var L = window.__devtoolsLogger;
L.getCount(); // número de entradas
L.getEntries(); // buffer completo
L.getByLevel("error"); // solo errores
L.getLast(50); // últimas 50 entradas
L.exportText(); // texto formateado
L.exportJSON(true); // JSON pretty-printed
L.clear(); // vaciar buffer
L.subscribe(fn); // callback por cada log
```

**Integración:** Envía logs vía `postMessage({ type: '__DT_LOG', payload })` al DevTools Panel.

---

### 🎯 Floating Button (`devtools-floating.js`)

Botón flotante draggable (🛠️) con menú contextual y atajos de teclado.

**Características:**

- Posicionable (drag & drop, persiste en `localStorage`)
- Context-aware: detecta la página actual y ofrece acciones específicas
- Auto-persistente en navegación SPA (Astro View Transitions)
- Menu con: Quick Nav, Logs stats, Quick Fill, DevTools tools

**Atajos de teclado globales (`Ctrl+Shift`):**

| Tecla | Acción                        |
| ----- | ----------------------------- |
| `D`   | Disable DevTools              |
| `H`   | Go Home                       |
| `L`   | Go Login                      |
| `E`   | Go Register                   |
| `B`   | Go Dashboard                  |
| `T`   | Toggle Dark/Light             |
| `1-4` | Set theme                     |
| `F`   | Fill form (context-sensitive) |
| `R`   | Reload page                   |
| `K`   | Open DevTools Panel           |

---

### 🖥️ DevTools Panel (`devtools.html`)

Panel completo accesible en `/devtools.html`.

**Paneles:**

| Panel                | Funcionalidad                                        |
| -------------------- | ---------------------------------------------------- |
| 🔑 Login Autofill    | Rellenar `#email` + `#password`, submit rápido       |
| 📝 Register Autofill | Rellenar nombre, email, password, confirm            |
| 🔒 Forgot Autofill   | Rellenar email de recuperación                       |
| 🎨 Theme & Locale    | Forzar tema (4 opciones) y locale                    |
| 💾 localStorage      | Tabla de keys, delete, clear, copy JSON              |
| 👤 Auth State        | Leer `window.authStore.getState()` de la app         |
| ⚡ Quick Actions     | Clear storage, reload, hard reset, inyectar floating |
| 📋 App Logs          | Logs en tiempo real (recibe vía postMessage)         |

**Logs en tiempo real:**

- Recibe logs vía `postMessage` del Logger de la app
- Filtro por nivel: All / Errors / Warnings / Info / Logs / Debug
- Auto-scroll toggle
- Copy + Clear buttons

---

## Activación

En **localhost** (`localhost`, `127.0.0.1`, `[::1]`), el DevTools se activa automáticamente.

En **producción**, requiere el flag `?devtools` en la URL.

La cookie `__devtools_enabled=1` persiste la activación por 1 año.

---

## Arquitectura de Comunicación

```
┌─────────────────────────────────────────────────┐
│  App (localhost)                                │
│  ├── devtools-logger.js                         │
│  │   └── postMessage('__DT_LOG', entry)         │
│  ├── devtools-floating.js                       │
│  │   └── window.__devtoolsLogger API             │
│                                                  │
│  DevTools Panel (devtools.html)                  │
│  └── window.addEventListener('message', ...)     │
│      └── addAppLogEntry(entry)                   │
│          └── renderAppLogs()                     │
└─────────────────────────────────────────────────┘
```

## Reglas del Agente DevTools

- ✅ Cero dependencias externas (vanilla JS puro)
- ✅ No modificar el bundle de producción
- ✅ Auto-activación solo en localhost
- ✅ Todos los estilos inline o via style element (no CSS externo)
- ✅ Namespacing con `__devtools_*` para evitar colisiones
- ❌ No usar librerías externas (React, jQuery, etc.)
- ❌ No modificar el DOM de la app salvo para inyectar el floating button
