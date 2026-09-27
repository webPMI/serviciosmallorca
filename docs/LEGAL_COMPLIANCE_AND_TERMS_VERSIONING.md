# ⚖️ Marco de Cumplimiento Legal, Versionado de Normas y Auditoría RGPD (2026)

Este documento detalla la arquitectura de seguridad jurídica y cumplimiento normativo implementada en **Servicios Mallorca** para prevenir sanciones administrativas, multas de la **Agencia Española de Protección de Datos (AEPD)**, reclamaciones de Consumo (Consum de les Illes Balears) e infracciones del marco europeo de comercio digital.

---

## 🏛️ 1. Marco Jurídico y Legislación Aplicable

La plataforma está blindada conforme a las cinco normativas clave del ecosistema digital en España y la Unión Europea:

| Normativa                          | Ámbito de Aplicación                    | Medida Técnica Implementada                                                                                                    |
| ---------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **RGPD (Reglamento UE 2016/679)**  | Protección de Datos Personales          | Consentimiento demostrable (Art. 7), trazabilidad de consentimientos, derechos ARCO-POL descargables.                          |
| **LOPD-GDD (Ley Orgánica 3/2018)** | Garantía de Derechos Digitales (España) | Registro inmutable de aceptación, no cesión de datos a terceros y canal directo de revocación.                                 |
| **LSSI-CE (Ley 34/2002)**          | Servicios de Sociedad de la Información | Aviso Legal (Art. 10), contratación electrónica (Arts. 27/28) y Banner de Cookies (Art. 22.2).                                 |
| **LGDCU (RDL 1/2007)**             | Defensa de Consumidores y Usuarios      | Información precontractual (Art. 97) y renuncia informada al desistimiento para servicios digitales instantáneos (Art. 103.m). |
| **DSA (Reglamento UE 2022/2065)**  | Ley Europea de Servicios Digitales      | Normas comunitarias transparentes, mediación de controversias y canal para retirar contenidos ilícitos.                        |

---

## 🔄 2. Motor de Versionado de Términos (`CURRENT_LEGAL_VERSION = "2026.2"`)

El motor central reside en [`src/lib/legalComplianceEngine.ts`](file:///c:/Users/ink.enzo/Desktop/p/servicios-mallorca/src/lib/legalComplianceEngine.ts).

### Protocolo de Actualización Obligatoria:

1. **Identificador de Versión:** Cada revisión sustancial de los términos de servicio, políticas fiscales o pasarela de pago incrementa la constante `CURRENT_LEGAL_VERSION` (ej. `2026.2` ➔ `2026.3`).
2. **Detección Automática:** En cada carga de página, [`LegalTermsUpdateModal.astro`](file:///c:/Users/ink.enzo/Desktop/p/servicios-mallorca/src/components/LegalTermsUpdateModal.astro) verifica si el usuario autenticado tiene registrado un consentimiento coincidente con `CURRENT_LEGAL_VERSION`.
3. **Bloqueo Preventivo e Información Clara:** Si el usuario tiene una versión previa o no tiene registro, se abre el modal bloqueante informando en lenguaje claro de los cambios normativos introducidos.
4. **Consentimiento Demostrable:** El usuario debe marcar activamente la casilla de verificación y pulsar _"Aceptar y Continuar en la Plataforma"_.
5. **Derecho a Disentir (Logout Seguro):** Conforme al RGPD, si el usuario no desea aceptar los nuevos términos, dispone del botón _"Rechazar y Cerrar Sesión"_, cerrando su sesión de inmediato para garantizar que no se traten sus datos bajo las nuevas directrices.

---

## 🛒 3. Protección Precontractual en Pasarela de Pago (`HonorCheckoutModal.astro`)

De conformidad con el **Art. 103.m de la LGDCU**, la venta o cobro de servicios digitales con ejecución inmediata (como posicionamiento prioritario en el Cuadro de Honor o aportaciones comunitarias) requiere una advertencia y consentimiento previo para evitar que el comprador solicite devoluciones fraudulentas tras recibir la visibilidad:

1. **Casilla de Términos y Privacidad:** Aceptación formal de las condiciones de contratación y fiscalidad (IVA al 21%).
2. **Casilla de Renuncia al Desistimiento:**
   > _"Consiento expresamente que la activación y posicionamiento digital comience de forma inmediata tras el pago y renuncio al derecho de desistimiento de 14 días conforme al Art. 103 de la LGDCU."_
3. **Validación de Bloqueo:** La función `validateCheckoutLegalConsent()` impide la conexión con la pasarela Stripe si alguna de las casillas no está marcada.
4. **Registro Transaccional:** Cada pago completado guarda un registro de consentimiento con código de factura oficial (`INV-HONOR-YYYY-...`).

---

## 👤 4. Panel de Cumplimiento RGPD en el Perfil de Usuario (`ProfileForm.astro`)

En la sección de seguridad del perfil del usuario se expone la tarjeta **📜 Consentimientos y Cumplimiento Legal (RGPD)**:

- **Versión Vigente Aceptada:** Muestra el número de versión (ej. `v2026.2`).
- **Estado de Aceptación:** `✅ Al día con la normativa vigente`.
- **Marca Temporal:** Fecha y hora exacta de la aceptación.
- **Botón "Descargar Certificado RGPD":** Genera un archivo `.txt` formal con todos los datos técnicos del consentimiento para que el usuario pueda acreditar su conformidad o presentarlo ante organismos de control.
- **Ejercicio de Derechos ARCO-POL:** Acceso directo a los canales de baja, supresión de datos, rectificación y oposición.

---

## 🍪 5. Banner y Gestor de Cookies AEPD (`CookieConsentBanner.astro`)

Cumple estrictamente con la _Guía sobre el uso de cookies_ de la AEPD:

1. **Opciones Simétricas:** Botones equivalentes para _"Aceptar Todas"_ y _"Solo Necesarias (Rechazar)"_.
2. **Configuración Granular:** Drawer interactivo con selectores para:
   - **Técnicas / Necesarias:** Siempre activas (autenticación, carrito, seguridad).
   - **Analíticas y Rendimiento:** Desactivables por el usuario.
   - **Personalización:** Desactivables por el usuario.
3. **Persistencia:** Almacena la decisión en `sm_cookie_preferences_v2` con fecha de autorización.
