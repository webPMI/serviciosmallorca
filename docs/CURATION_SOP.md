# 🤖 SOP: Curación de Negocios de Alta Fidelidad

Este documento define el protocolo estricto para el agente `@curation` al procesar nuevos negocios en el catálogo de Servicios Mallorca. El objetivo es pasar de un "registro de datos" a una "vitrina de confianza".

## 🎯 Objetivos Principales

1.  **Veracidad Absoluda (GR-11):** Cero datos ficticios. Todo dato debe ser extraído de fuentes oficiales o verificables.
2.  **Fidelidad de Datos (GR-12):** Garantizar que la ubicación, horarios y servicios coincidan con la realidad balear.
3.  **Enriquecimiento de Valor:** Transformar datos planos en contenido atractivo (Storytelling, Especialidades, Noticias).
4.  **Confianza Automatizada:** Asignar un `confidenceScore` basado en la triangulación de fuentes.

---

## 🔄 Flujo de Trabajo Paso a Paso

### Fase 1: Minería Multicanal (Data Harvesting)

Utiliza el script `scripts/business-intelligence-lookup.ts` para obtener la "Huella Digital" del negocio:

1.  **Web Scrape:** Extraer metadatos, teléfono, email, descripción y galería de fotos.
2.  **Social Deep Dive:** Buscar enlaces en bio (Linktree, Beacons) y extraer perfiles de Instagram, TikTok, YouTube y Facebook.
3.  **Dorks de Respaldo:** Si la web falla o es pobre, usa los dorks generados para buscar menciones en buscadores y directorios locales.

### Fase 2: Validación y Triangulación (The Audit)

Antes de procesar la información, debes realizar el **Triaje de Confianza**:

- **Triangulación Telefónica:** ¿Coincide el número de la Web con el de Google Maps y el de WhatsApp?
  - _Coincidencia:_ Puntaje +25.
  - _Discrepancia:_ Marcar como `needs_review` y priorizar verificación manual.
- **Verificación Geográfica:** Confirmar que las coordenadas GPS estén dentro de los límites de Mallorca.
- **Estado de Actividad:** Verificar si la web devuelve HTTP 200 y si hay actividad reciente en redes sociales.

### Fase 3: Enriquecimiento de Contenido (Copywriting)

Transforma los datos crudos en contenido de alta calidad:

1.  **Especialidades de la Casa:** Identifica 3-5 productos/servicios clave mediante análisis de palabras clave en la web y redes sociales.
2.  **Historia de Autor (Storytelling):** Redacta un párrafo emocional y profesional sobre el origen del negocio (basado en la descripción web o prensa).
3.  **Traducción Nativa:** Genera contenido en Español, Inglés y Catalán con tono natural y local.

### Fase 4: Publicación y Registro

1.  **Generar Objeto `ServiceItem`:** Rellenar todos los campos requeridos por `src/data/services/types.ts`.
2.  **Asignación de Confidence Score:**
    - `> 85%`: Publicar automáticamente como `verified`.
    - `60% - 85%`: Publicar como `needs_review` (requiere validación humana).
    - `< 60%`: Mantener en cola de revisión manual.
3.  **Sincronización:** Crear el archivo `.ts` en la carpeta correspondiente y registrarlo en el `index.ts` global.

---

## 📝 Reglas de Calidad y Estilo

- **No a los Datos Ficticios:** Si no hay un dato (ej: premios, tienda online), el campo debe omitirse limpiamente. No inventes "N/A" o "No disponible".
- **Tono de Voz:** Profesional, acogedor y experto. Evitar adjetivos genéricos como "excelente" o "maravilloso". Usar descripciones basadas en hechos.
- **Links Vivos:** Todos los enlaces de redes sociales y sitios web deben ser verificados (HTTP 200).
- **SEO Local:** Asegurar que los tags incluyan zonas específicas de Mallorca (ej: "Portixol", "Casco Antiguo").

---

## 🛠️ Herramientas Disponibles

- **Scraper:** `scripts/business-intelligence-lookup.ts` (Minería profunda).
- **Validator:** `src/lib/verificationEngine.ts` (Cálculo de confianza y validación geo).
- **Data:** `src/data/services/` (Destino de producción).
