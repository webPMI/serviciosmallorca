# 🔐 Autenticación - WebApp Starter

> **Dominio del Agente Auth & Data (`@auth`)**

## Stack de Autenticación

| Componente    | Tecnología                                  |
| ------------- | ------------------------------------------- |
| Auth Provider | Firebase Authentication                     |
| Database      | Firestore (roles de usuario)                |
| Auth UI       | LoginForm, RegisterForm, ForgotPasswordForm |

## Configuración de Firebase (`src/lib/firebase.ts`)

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};
```

## Roles de Usuario

| Rol         | Acceso                                       | Navbar          |
| ----------- | -------------------------------------------- | --------------- |
| `guest`     | Páginas públicas (home, login, register)     | `NavbarPublic`  |
| `user`      | Dashboard básico                             | `NavbarUser`    |
| \`manager\` | Dashboard + gestión de clientes              | `NavbarManager` |
| `admin`     | Dashboard + analíticas + gestión de usuarios | `NavbarAdmin`   |

## Flujo de Autenticación

### Login

```
LoginForm → signInWithEmailAndPassword(email, password)
          → Google Sign-In (signInWithPopup)
          → authStore detecta cambio → actualiza Navbar
```

### Register

```
RegisterForm → createUserWithEmailAndPassword(email, password)
             → updateProfile(displayName)
             → authStore detecta cambio → actualiza Navbar
```

### Forgot Password

```
ForgotPasswordForm → sendPasswordResetEmail(auth, email)
                   → Firebase envía email con link de restablecimiento
```

## AuthStore (`src/lib/authStore.ts`)

**Patrón:** Observer (pub/sub)

```typescript
class AuthStore {
  private state: AuthState = { user: null, role: "guest", loading: true };

  // Suscribirse a cambios de auth
  authStore.subscribe(({ user, role, loading }) => {
    // Actualizar UI según rol
  });

  // Obtener estado actual
  const state = authStore.getState();

  // Logout
  await authStore.logout();
}
```

**Detección de rol:**

1. Custom Claims de Firebase (`user.getIdTokenResult().claims.role`)
2. Documento Firestore (`users/{uid}.role`)
3. Default: `"user"`

## Componentes de Auth & Perfil

| Componente                 | IDs del formulario                             | Campos                                                                             |
| -------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| `LoginForm.astro`          | `#login-form`                                  | `#email`, `#password`                                                              |
| `RegisterForm.astro`       | `#register-form`                               | `#name`, `#email`, `#password`, `#confirmPassword`                                 |
| `ForgotPasswordForm.astro` | `#forgot-password-form`                        | `#email`                                                                           |
| `ProfileForm.astro`        | `#profile-info-form`, `#profile-password-form` | `#profile-name`, `#profile-custom-photo`, `#new-password`, `#confirm-new-password` |

## Módulo de Perfil Firestore (`src/lib/userProfile.ts`)

Gestiona la sincronización del documento `users/{uid}`:

- `createUserProfile(db, input)`: Crea la ficha con `role: "user"`, `displayName`, `email`, `createdAt`, `updatedAt`.
- `getUserProfile(db, uid)`: Lee la ficha y rol desde Firestore.
- `updateUserProfile(db, uid, data)`: Actualiza `displayName`, `photoURL` y renueva `updatedAt`.

## Manejo de Errores de Firebase

```typescript
// Códigos comunes manejados:
auth/invalid-credential     → "Correo o contraseña incorrectos"
auth/user-not-found         → "Usuario no encontrado"
auth/wrong-password         → "Contraseña incorrecta"
auth/email-already-in-use   → "El email ya está registrado"
auth/weak-password          → "Contraseña muy débil"
auth/too-many-requests      → "Demasiados intentos"
```

## Reglas del Agente Auth

- ✅ Manejar todos los códigos de error de Firebase
- ✅ Usar `import.meta.env` para API keys (nunca hardcodear)
- ✅ El AuthStore debe ser reactivo (suscriptores)
- ❌ No exponer tokens o secretos en el cliente
- ❌ No usar Firebase Admin SDK en el frontend
