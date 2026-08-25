# 🔐 Autenticación y Gestión de Roles — Servicios Mallorca

> **Dominio del Agente Auth & Data (`@auth`)**

## 1. Stack de Autenticación y Base de Datos

| Componente        | Tecnología                                        | Propósito                                      |
| ----------------- | ------------------------------------------------- | ---------------------------------------------- |
| **Auth Provider** | Firebase Authentication                           | Email/Password, Google Sign-In, Password Reset |
| **Database**      | Cloud Firestore (`serviciosmallorca`)             | Perfiles, roles, claims B2B, altas y bajas     |
| **Auth UI**       | `LoginForm`, `RegisterForm`, `ForgotPasswordForm` | Formularios accesibles 100% multilingües       |

---

## 2. Matriz de Roles y Niveles de Acceso

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    GUEST     │      │     USER     │      │   MANAGER    │      │    ADMIN     │
│ (Visitante)  │ ───> │   (Cliente)  │ ───> │  (Negocio)   │ ───> │(Superusuario)│
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
```

| Rol           | Descripción                    | Capacidades en Servicios Mallorca                                                | Navbar          |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------- | --------------- |
| **`guest`**   | Visitante anónimo              | Consulta catálogo, lee blog, usa filtros y contacto directo                      | `NavbarPublic`  |
| **`user`**    | Usuario cliente                | Guarda favoritos, deja reseñas, solicita reclamar negocio y propone altas        | `NavbarUser`    |
| **`manager`** | Titular verificado de negocio  | Gestiona y personaliza la información de su empresa verificada                   | `NavbarManager` |
| **`admin`**   | Administrador de la plataforma | Aprueba/rechaza reclamaciones, modera altas, procesa bajas RGPD y gestiona roles | `NavbarAdmin`   |

---

## 3. Flujos de Operaciones de Negocio (B2B)

### 3.1 Reclamación de Ficha Existente (_Service Claim_)

1. El titular accede a su negocio en `/servicios/[slug]`.
2. Pulsa **"Reclamar este negocio"** y completa el formulario con su CIF y teléfono de contacto.
3. Se crea un documento en la colección `service_claims` con estado `pending`.
4. El administrador revisa la acreditación desde `/dashboard` y pulsa **"Aprobar"**.
5. El sistema escala automáticamente el rol del usuario a **`manager`** y le asigna el servicio.

### 3.2 Solicitud de Baja / Supresión (_Right to Erasure - RGPD_)

1. El titular solicita la retirada de la ficha desde `/servicios/[slug]` indicando el motivo.
2. Se registra en `service_deletion_requests`.
3. El administrador procesa la solicitud y la ficha queda retirada del catálogo.

### 3.3 Propuesta de Nuevo Negocio (_Service Submission_)

1. Cualquier empresa o autónomo accede a `/servicios/nuevo`.
2. Completa los datos comerciales, zona, categoría y descripción.
3. Se registra en `service_submissions` para validación editorial previa a su publicación oficial.

---

## 4. Reglas de Seguridad Firestore (`firestore.rules`)

Desplegadas en el proyecto oficial `serviciosmallorca`:

- `users/{uid}`: Lectura propia o de administradores; modificación de rol reservada exclusivamente para `admin`.
- `services/{serviceId}`: Lectura pública; escritura restringida a `admin` y `manager` titular.
- `service_claims/{claimId}`: Creación por usuario autenticado; moderación solo por `admin`.
- `service_submissions/{submissionId}`: Creación por usuario; moderación solo por `admin`.
- `service_deletion_requests/{requestId}`: Creación por usuario; tramitación solo por `admin`.

---

## 5. Módulo de Acciones Firestore (`src/lib/serviceActions.ts`)

- `createServiceClaim(db, claim)`: Registro de reclamación.
- `updateClaimStatus(db, id, "approved", uid)`: Aprobación y escalación de rol a `manager`.
- `createServiceSubmission(db, submission)`: Envío de propuesta de negocio.
- `createServiceDeletionRequest(db, request)`: Solicitud formal de baja.
