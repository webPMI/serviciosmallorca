# ⚖️ Cumplimiento Legal y Ético - Servicios Mallorca

Este documento establece las restricciones inmutables y las directrices éticas que rigen el comportamiento de todos los agentes del sistema. El incumplimiento de estas reglas conlleva el rechazo inmediato de la tarea y la intervención del Agente Maestro.

## 🚫 Las 4 Líneas Rojas (Prohibiciones Absolas)

### 1. No Extracción de Datos Privados (PII - No-Go)

Está terminantemente prohibido recolectar, procesar o mostrar datos que puedan identificar a personas físicas fuera de un contexto comercial público.

- **Datos Prohibidos:** DNI, pasaportes, números de teléfono personales, correos privados, direcciones de domicilios privados.
- **Acción:** Si un scraper detecta un número de teléfono, este solo será aceptado si está vinculado explícitamente a un perfil de negocio o empresa.

### 2. Propiedad Intelectual y Copyright (Uso Justo)

El agente no debe copiar y pegar textos largos de sitios web externos (Plagio).

- **Regla de Síntesis:** El agente debe extraer la idea, los datos clave y redactar un contenido nuevo, original y multilingüe para nuestra plataforma.
- **Atribución:** Siempre debe incluir el enlace a la fuente original para que el usuario pueda verificar la información y el negocio pueda recibir el tráfico.

### 3. Respeto a los Términos de Servicio (Anti-Scraping Agresivo)

Los agentes no deben intentar saltar sistemas de seguridad, CAPTCHAs, ni acceder a áreas privadas o "solo miembros".

- **Estrategia:** Utilizaremos búsquedas públicas y métodos de extracción pasiva para evitar conflictos con las APIs de las redes sociales o sitios web.
- **Evitación de Bloqueos:** No se deben realizar peticiones en alta frecuencia que puedan interpretarse como un ataque DoS.

### 4. Transparencia Comercial (Sin Engaño)

No debemos presentar productos o servicios de terceros como si fueran propios de la plataforma.

- **Marcas:** Si mostramos un logo o un nombre de marca, debe ir acompañado del aviso de "Proveedor Externo" o "Enlace a sitio oficial".
- **Honestidad en el Score:** El `confidenceScore` debe reflejar la veracidad real de los datos, sin inflar puntuaciones para cumplir objetivos.

---

## 🛡️ Protocolo de Mitigación

En caso de detectar una situación de riesgo durante la curación de un negocio:

1.  **Bloqueo de Datos:** El agente debe detener la recolección de ese punto de datos específico.
2.  **Alertar al Maestro:** El agente debe informar inmediatamente: _"Alerta de Riesgo: El sitio web X contiene información que podría infringir la política de [Privacidad/Copyright]."_
3.  **Acción Humana:** El Agente Maestro decidirá si la información se procesa con cautela o se descarta del catálogo.

## 🌍 Cumplimiento Regional (GDPR / LOPDGDD)

Como operamos en el territorio balear, el sistema debe garantizar:

- **Derecho al Olvido:** Si un negocio solicita su baja, sus datos deben eliminarse de la base de datos de curación en < 72h.
- **Minimización de Datos:** Solo recolectamos lo estrictamente necesario para la descripción del servicio en la vitrina.

---

_Última actualización: 2026-08-25_
