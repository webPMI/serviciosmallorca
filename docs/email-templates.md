# Guía de Configuración y Personalización de Correos (Firebase Auth)

Esta guía explica cómo personalizar las plantillas de correos electrónicos de **Firebase Auth** (Restablecimiento de Contraseña, Verificación de Email, etc.) para que muestren la identidad de marca del proyecto.

---

## 1. Configuración del Idioma Dinámico en el Código

En el frontend ya está configurada la asignación dinámica del idioma según la localización del usuario (`es`, `en`, `ca`):

```typescript
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";

// Asigna automáticamente 'es', 'en' o 'ca' según la ruta
auth.languageCode = document.documentElement.lang || "es";

await sendPasswordResetEmail(auth, userEmail);
```

---

## 2. Personalizar la Plantilla en la Consola de Firebase

Para cambiar el remitente, asunto y mensaje corporativo:

1. Ingresa a la **[Consola de Firebase](https://console.firebase.google.com/)**.
2. Selecciona tu proyecto de Firebase.
3. En el menú lateral, ve a **Authentication** > pestaña **Templates** (Plantillas).
4. Selecciona **Password reset** (Restablecimiento de contraseña) y haz clic en el icono de edición ✏️.

---

## 3. Ejemplo Profesional de Mensaje

### 📌 Datos del Remitente y Asunto

- **Sender Name (Nombre del remitente)**: `WebApp Starter`
- **Reply-to (Correo de respuesta)**: `soporte@tu-dominio.com` (o tu correo de soporte)
- **Subject (Asunto)**: `Restablece tu contraseña de WebApp Starter`

---

### ✉️ Ejemplo de Cuerpo del Mensaje (Español)

```text
Hola %DISPLAY_NAME%,

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en WebApp Starter.

Para crear una nueva contraseña y recuperar el acceso a tu cuenta, haz clic en el siguiente enlace:

%LINK%

Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña actual seguirá siendo la misma.

Este enlace expirará automáticamente por razones de seguridad.

—
El equipo de WebApp Starter
https://tu-dominio.com
```

---

### ✉️ Ejemplo de Cuerpo del Mensaje (Inglés / English)

```text
Hi %DISPLAY_NAME%,

We received a request to reset the password for your WebApp Starter account.

To create a new password and get back to your account, please click the link below:

%LINK%

If you didn't request a password reset, you can safely ignore this email. Your current password will remain unchanged.

This link will expire automatically for security reasons.

—
The WebApp Starter Team
https://your-domain.com
```

---

## 4. Dominio Personalizado de Envío (Opcional - Recomendado para Producción)

Por defecto, los correos se envían desde `noreply@tu-proyecto.firebaseapp.com`.

Para enviar correos desde tu propio dominio (ej. `noreply@tu-dominio.com`):

1. En **Authentication** > **Templates** > haz clic en **Authorized domains** / **Custom domain**.
2. Añade tu dominio y sigue las instrucciones para añadir los registros **DNS (DKIM / SPF / TXT)** en tu proveedor de dominio (Cloudflare, GoDaddy, Namecheap, etc.).
