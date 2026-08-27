# 🚀 Plan Maestro de Ejecución y Escalabilidad (Production Roadmap)

Este documento contiene la hoja de ruta detallada para la construcción, el mantenimiento y la escalabilidad de la plataforma Servicios Mallorca. El objetivo es pasar de una infraestructura de desarrollo a una plataforma de grado industrial capaz de manejar miles de negocios con alta fidelidad.

---

## 📊 Metodología de Gestión

- **Estado de Tarea:** [Pendiente] | [En Proceso] | [Bloqueado] | [Completado]
- **Prioridad:** P0 (Crítico/Inmediato), P1 (Alto/Estratégico), P2 (Medio/Mejora), P3 (Bajo/Futuro).
- **Validación:** Cada tarea requiere el visto bueno del Agente Maestro tras cumplir los criterios de éxito definidos.

---

## 🏗️ Pilar 1: Arquitectura de Datos y Rendimiento (Core)

### 1.1 Migración a Base de Datos de Producción

- [ ] **Tarea 1.1.1:** Configuración de PostgreSQL + PostGIS para geolocalización de alta precisión.
- [ ] **Tarea 1.1.2:** Migración del esquema de `src/data/services/` a tablas relacionales.
- [1.1.3] Implementación de índices espaciales para consultas "Cerca de mí" en < 100ms.
- [ ] **Tarea 1.1.4:** Diseño de la estructura de "Trazabilidad de Auditoría" (Logs de cambios por negocio).

### 1.2 Motor de Ingesta y Verificación (Data Pipeline)

- [ ] **Tarea 1.2.1:** Desarrollo del `VerificationEngine` para detección de discrepancias telefónicas y de ubicación.
- [ ] **Tarea 1.2.2:** Implementación de "Filtro de Calidad Visual" (detección de imágenes borrosas o marcas de agua).
- [ ] **Tarea 1.2.3:** Automatización del flujo de minería multicanal (Web, Maps, Redes Sociales).
- [ ] **Tarea 1.2.4:** Creación del sistema de puntuación de confianza (`confidenceScore`).

### 1.3 Optimización de Carga (Edge & Rendering)

- [ ] **Tarea 1.3.1:** Implementar `Lazy Loading` de galerías y reseñas en `ServiceCard.astro`.
- [ ] **Tarea 1.3.2:** Configuración de caché de borde (Edge Cache) para las rutas más accedidas.
- [ ] **Tarea 1.3.3:** Optimización de recursos estáticos para asegurar carga < 1.5s en móviles.

---

## 🗺️ Pilar 2: Experiencia de Usuario y Conversión (UX/UI)

### 2.1 Motor de "SmartMatch" y Recomendaciones

- [ ] **Tarea 2.1.1:** Desarrollo del algoritmo de afinidad por tags (Deporte ➔ Bienestar).
- [ ] **Tarea 2.1.2:** Implementación de "Rutas de Experiencia" dinámicas (ej: Ruta de Tatuajes en Palma).
- [ ] **Tarea 2.1.3:** Motor de búsqueda con "Filtros de Intención" (Pet Friendly, Accesibilidad, Horarios).

### 2.2 Conversión de Alto Impacto (Conversion)

- [ ] **Tarea 2.2.1:** Implementar botones de "Acción Directa" contextuales (Reservar, Llamar, WhatsApp).
- [ ] **Tarea 2.2.2:** Integración de "Reseñas Destacadas" con métricas de sentiment analysis.
- [Tarea 2.2.3] Módulo de "Ofertas Destacadas" para negocios con promociones activas.

### 2.3 Accesibilidad y Localización

- [ ] **Tarea 2.3.1:** Auditoría de accesibilidad WCAG 2.1 en todos los componentes de navegación.
- [ ] **Tarea 2-2.2:** Refinamiento de las traducciones del motor de traducción para el mercado DACH.

---

## 🎨 Pilar 3: Contenidos y Autoridad (SEO & Growth)

### 1. Motor de Contenidos Dinámicos

- [ ] **Tarea 3.1.1:** Generador de artículos de blog basados en "Tours de Experienca".
- [ ] **Tarea 3.1.2:** Automatización de noticias locales (RSS + Scraper de Prensa Balear).
- [ ] **Tarea 3.1.3:** Sistema de "Marcadores de Autoridad" para negocios con menciones en medios.

### 2. SEO de Alta Autoridad

- [ ] **Tarea 3.2.1:** Implementación de datos estructurados Schema.org en todas las fichas.
- [ ] **Tarea 3.2.2:** Estrategia de palabras clave de "Larga Cola" para categorías de nicho.
- [ ] **Tarea 3.2.3:** Optimización de imágenes con metadatos alt y pesos mínimos.

---

## 🛡️ Pilar 4: Seguridad y Cumplimiento (Governance)

### 4.1 Privacidad y Datos (RGPD)

- [ ] **Tarea 4.1.1:** Sistema de gestión de consentimiento de cookies (CMP).
- [ ] **Tarea 4.1.2:** Implementación de derecho al olvido y exportación de datos de usuario.

### 4.2 Auditoría y Resiliencia

- [ ] **Tarea 4.2.1:** Dashboard de monitoreo de salud del catálogo (Errores de minería, alertas de datos).
- [ ] **Tarea 4.2.2:** Sistema de respaldo de datos (Backup diario a S3/Cloud Storage).

---

## 🚀 Estrategia de Ejecución de Tareas (Sprint Workflow)

1. **Definición del Sprint:** Selección de tareas de cada pilar (máx 5 por sprint).
2. **Asignación de Agentes:** Distribución según el dominio especializado del agente.
3. **Verificación de Calidad:** Revisión del agente maestro contra las Golden Rules.
4. **Despliegue:** Sincronización continua con GitHub y Cloudflare.
