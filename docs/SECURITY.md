# 🛡️ Seguridad del Usuario y Protección de Datos — Servicios Mallorca

> **Documento Oficial de Seguridad, Privacidad y Cumplimiento Normativo (RGPD / LOPDGDD / LSSI-CE)**
> Define las directrices técnicas, arquitectónicas y organizativas para salvaguardar la privacidad, integridad y derechos de los usuarios y empresas en Servicios Mallorca.

---

## 1. Principios Rectores de Seguridad

1. **Privacidad por Diseño y por Defecto (Privacy by Design & Default):** Toda nueva funcionalidad minimiza la recogida de datos personales al mínimo imprescindible para su operativa.
2. **Principio de Mínimo Privilegio (PoLP):** Cada rol (`guest`, `user`, `manager`, `admin`) accede exclusivamente a los documentos y campos indispensables.
3. **Cero Tolerancia a Escalada de Privilegios:** La asignación y mutación de roles está blindada a nivel de reglas de seguridad de base de datos (`firestore.rules`), impidiendo cualquier modificación desde el cliente.
4. **Transparencia y Ejercicio de Derechos ARCO:** Facilitación directa y sin fricciones de los derechos de Acceso, Rectificación, Supresión, Oposición, Limitación y Portabilidad.

---

## 2. Arquitectura de Seguridad Firestore

Las reglas de Firestore (`firestore.rules`) constituyen la primera línea de defensa del sistema:

### 2.1 Protección de la Colección `users` (`users/{uid}`)

- **Lectura:** Un usuario solo puede leer su propio perfil (`request.auth.uid == uid`). Los roles `manager` y `admin` cuentan con permisos de lectura para auditoría y soporte.
- **Creación:** En el registro, el rol se fija forzosamente en `user`.
- **Actualización:** Un usuario únicamente puede modificar sus propios datos de presentación (`displayName`, `photoURL`). Se valida que:
  - El campo `role` no cambie (`request.resource.data.role == resource.data.role`).
  - El campo `email` no sea alterado directamente desde cliente.
  - La URL del avatar (`photoURL`) cumpla obligatoriamente el protocolo seguro `https://` o sea nula, previniendo inyección de pixels de rastreo o esquemas maliciosos `javascript:`.
  - La longitud de campos esté limitada (`displayName <= 120` caracteres).
- **Borrado:** Exclusivo para administradores y procesos de baja formal RGPD.

### 2.2 Reclamaciones, Altas y Supresiones (`service_claims`, `service_submissions`, `service_deletion_requests`)

- **Aislamiento por UID:** Solo el solicitante autenticado puede consultar el estado de sus solicitudes (`resource.data.applicantUid == request.auth.uid`).
- **Límites de carga útil:** Bloqueo de ataques por desbordamiento (`verificationProof <= 2000` caracteres, `description <= 5000` caracteres).

### 2.3 Reportes de la Comunidad (`service_reports`) y Reseñas (`reviews`)

- **Autenticación e Integridad:** Las reseñas requieren `authorUid == request.auth.uid` y validación de rango numérico estricto (`rating >= 1 && rating <= 5`).
- **Anti-Spam en Reportes:** Requiere validación de estructura de claves mínimas obligatorias y control de longitud.

---

## 3. Seguridad de Autenticación y Cuentas

1. **Gestión de Credenciales (Firebase Auth):**
   - Las contraseñas se almacenan con hashing seguro derivado (Scrypt/PBKDF2) administrado por la infraestructura de Google Identity Platform.
   - Medidor de fortaleza de contraseña interactivo en cliente (mínimo 6 caracteres, verificación de números, mayúsculas y símbolos).
   - Reautenticación exigida (`auth/requires-recent-login`) para cambios de credenciales críticas.
2. **Cuentas Federadas (Google OAuth):**
   - Cuando el usuario inicia sesión mediante Google, el sistema oculta los formularios de contraseña tradicional y delega la gestión de credenciales en los estándares de Google Identity.
3. **Control de Sesión:**
   - Cierre de sesión centralizado con purga de estado en cliente y revocación de tokens.

---

## 4. Seguridad de Transporte y Cabeceras HTTP (SSR Middleware)

El middleware de Astro (`src/middleware.ts`) inyecta automáticamente cabeceras de seguridad en todas las respuestas del servidor:

| Cabecera                    | Valor                                          | Propósito                                                                       |
| --------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `X-Frame-Options`           | `SAMEORIGIN`                                   | Protección contra Clickjacking (evita incrustación en iframes de terceros).     |
| `X-Content-Type-Options`    | `nosniff`                                      | Evita que el navegador interprete archivos con tipos MIME incorrectos.          |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Protege URLs privadas de fugas en enlaces externos.                             |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=(self)` | Restringe el acceso a APIs de hardware del dispositivo.                         |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Fuerza comunicación 100% HTTPS segura.                                          |
| `Cache-Control`             | `no-store, no-cache, must-revalidate`          | Bloquea almacenamiento en caché de páginas privadas (`/dashboard`, `/profile`). |

---

## 5. Cumplimiento Legal y Derechos del Usuario (RGPD / LOPDGDD)

1. **Derecho de Supresión / Baja de Negocios:** Cualquier propietario o titular de un servicio en Mallorca puede solicitar la baja inmediata de su ficha a través del botón y modal oficial presente en la ficha del servicio o vía `/privacidad`.
2. **Reclamación y Verificación:** Los negocios pueden ser reclamados mediante verificación de titularidad (CIF / documento acreditativo) evaluada por el equipo de administración.
3. **Publicidad y Cookies de Google AdSense:** Información transparente sobre cookies de terceros, enlace directo a la configuración de personalización de anuncios de Google (`adssettings.google.com`) y cumplimiento de las directrices para editores de Google.

---

## 6. Checklist de Seguridad para Nuevos Desarrollos

Antes de aprobar cualquier funcionalidad que involucre datos:

- [ ] ¿Se valida que ningún dato sensible se guarde en `localStorage` no cifrado?
- [ ] ¿El formulario valida longitudes máximas y protocolos `https://`?
- [ ] ¿Las reglas de Firestore bloquean escrituras directas no autorizadas?
- [ ] ¿Los textos legales y de consentimiento están disponibles en los 4 idiomas (`es`, `en`, `ca`, `de`)?
- [ ] ¿Las llamadas a bases de datos usan tipos estrictos de TypeScript?

---

## 7. Campaña de Endurecimiento y Cobertura de Seguridad v2 (28/08/2026)

Ampliación de testing orientada a **verificar —no solo declarar—** las garantías de este documento:

| Cobertura nueva       | Suite / Herramienta                                    | Qué verifica                                                                                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cabeceras HTTP SSR    | `tests/unit/middlewareSecurityHeaders.test.ts`         | Las 6 cabeceras de §4 en rutas locale/no-locale, `no-store` en rutas privadas, flags de cookie `locale`, negociación Markdown y **redirección raíz 302 con cabeceras** (fix aplicado)                                                                                 |
| Reglas Firestore      | `tests/unit/firestoreRulesStatic.test.ts`              | Análisis estático de `firestore.rules`: deny-all global, inmutabilidad de rol/email, `https://` en `photoURL`, límites de longitud, aislamiento por UID, ratings acotados, bids ≥ 1 €, prohibición de `write: if true`                                                |
| Bridge IA adversarial | `tests/unit/geminiBridge.security.test.ts`             | Fugas de API key en todas las superficies, pollution (`__proto__`), vectores XSS servidos como JSON, spoofing de Host (DNS-rebinding), JSON profundo, métodos incorrectos, path traversal de modelo                                                                   |
| Auditoría de secretos | `npm run audit:security` (`scripts/security-audit.ts`) | Escaneo de claves/secretos hardcodeados en `src/`, `scripts/`, `public/`, `tests/`, `docs/` (Google/OpenAI/privadas/JWT/DB-creds + genérico); `.env`/`.gemini-bridge` no trackeados; `npm audit --omit=dev` opcional con `--deps`. Exit 1 con hallazgos: apto para CI |

**Hallazgo real y remediación (28/08/2026, primer pase de `audit:security`):**
`src/lib/firebase.ts` contenía la configuración Firebase **hardcodeada** (violación de
«API keys solo via `import.meta.env`»). Migrada a variables `PUBLIC_FIREBASE_*`; los valores
reales viven ahora solo en `.env` (local, gitignored). ⚠️ **Acción requerida del owner:** añadir
las variables `PUBLIC_FIREBASE_*` al entorno de build de Cloudflare antes del próximo deploy
(Astro las inlinea durante el build). Las claves Web de Firebase no son secretas por diseño (la
protección real está en `firestore.rules` + dominios autorizados + App Check), pero la rotación
sin redeploy exige que vivan en el entorno, no en el código.

**Hardening aplicado (28/08/2026):** la redirección raíz (`/` → `/{locale}`) ahora incluye las
cabeceras de seguridad de §4 (antes el 302 se devolvía sin ellas; detectado por la nueva suite).

**Recomendación futura (no bloqueante):** evaluar una `Content-Security-Policy` estricta en
producción una vez inventariados los scripts inline de terceros (AdSense, Firebase SDK), idealmente
en modo `Report-Only` durante unas semanas antes de forzarla.
