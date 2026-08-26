# 🤖 SOP: Protocolo de Curación Atómica & Aseguramiento de Calidad

> **Dominio del Agente Curador (`@curation`) y Agente Maestro**

Este documento define el protocolo inmutable para procesar, auditar y enriquecer nuevos negocios en el catálogo de **Servicios Mallorca** bajo las reglas **GR-11 (Zero Fake Data)** y **GR-12 (Fidelidad Geográfica)**.

---

## 🎯 Pilares Inmutables de Calidad

1. **Veracidad y Cero Datos Dummy (GR-11):** Toda información debe ser verificable en fuentes oficiales (Web propia, Google Maps, Registro de Comercio, Prensa Balear).
2. **Geolocalización Real en Mallorca (GR-12):** Coordenadas métricas validadas dentro del polígono geográfico de la isla.
3. **Imágenes Reales y Verificadas:** Prohibido el uso de imágenes de bancos de stock genéricos (Shutterstock, iStock, Unsplash), placeholders o URLs rotas.
4. **Matriz de Capacidades e Intención:** Clasificación estructurada de capacidades (`petFriendly`, `wheelchairAccessible`, `kidsArea`, `terrace`, `emergency24h`, etc.).

---

## 🔄 Protocolo de Curación en 4 Fases

### Fase 1: Minería y Recolección Multicanal

- Ejecución de `scripts/business-intelligence-lookup.ts "<Nombre>"` o ingesta por lotes con `scripts/batch-ingest.ts`.
- Extracción de teléfonos, coordenadas GPS, horarios oficiales, reseñas y enlaces sociales.

### Fase 2: Triangulación y Validación Cruzada (`verificationEngine.ts`)

El motor evalúa 5 variables con puntuación estricta (0 a 100%):

- **Verificación Telefónica Cruzada (Max 25 pts):** Doble/triple coincidencia entre Web, Maps y WhatsApp. _Cualquier discrepancia crítica penaliza a $\le 5$ pts_.
- **Precisión Geográfica (Max 25 pts):** Coordenadas validadas dentro de Mallorca (`MIN_LAT: 39.15, MAX_LAT: 40.0, MIN_LNG: 2.25, MAX_LNG: 3.55`).
- **Disponibilidad Web HTTP 200 (Max 20 pts):** Descarte de dominios 404 o 500.
- **Redes Sociales Activas (Max 15 pts):** Instagram, Facebook, TikTok verificados.
- **Reputación y Reseñas Reales (Max 15 pts):** Calificación $\ge 4.0$ en Google Maps / plataformas oficiales.

**Ruteo por Confidence Score:**

- $\ge 80\% \rightarrow$ **Approved** (Aprobado para publicación directa).
- $< 80\% \rightarrow$ **Needs Review** (Enviado a la cola de revisión manual con advertencias).

### Fase 3: Validación Estructural de Imágenes (`validateImageQuality`)

- **Filtro Anti-Stock:** Rechaza automáticamente dominios como `shutterstock.com`, `istockphoto.com`, `gettyimages.com`, `unsplash.com`, `freepik.com`, `pexels.com`.
- **Filtro Anti-Placeholder:** Rechaza patrones `placeholder`, `1x1`, `dummy`, `spinner`, `favicon`.
- **Auditoría Global:** Ejecución obligatoria de `npm run audit:images`.

### Fase 4: Enriquecimiento Multilingüe y Capacidades

1. **Taxonomía Dinámica:** Asignar `sectors: string[]`, `specialties: string[]` y `capabilities: BusinessCapabilities`.
2. **Traducción Nativa:** Textos en 4 idiomas (`es`, `en`, `ca`, `de`) usando `src/lib/translator.ts`.
3. **Publicación y Tests:** Registro del módulo individual en `src/data/services/<sector>/` y ejecución de `npm run typecheck && npm test && npm run validate:taxonomy && npm run build`.

---

## 🛡️ Control de Calidad Post-Ingesta

1. **Alerta de Anomalías por Sector (`npm run audit:anomaly`):**
   - Si un lote presenta más de un **10% de caída de confianza o estados `needs_review`**, el monitor congela el proceso y genera una alerta inmediata.
2. **Muestreo Aleatorio del 5%:**
   - Auditoría humana periódica del 5% del catálogo por parte del Agente Maestro.
