# 📊 Guía Maestra de Auditoría por Sectores — Servicios Mallorca

Esta guía documenta la suite de auditoría y análisis sectorial del catálogo de **Servicios Mallorca**, diseñada para auditar fichas negocio a negocio o sector a sector, garantizando el cumplimiento estricto de **GR-11 (Zero Fake Data)** y **GR-12 (Fidelidad Maps)**.

---

## 🎯 1. Comandos Principales de Auditoría Sectorial

| Comando                                      | Propósito                                            | Salida                                                                         |
| :------------------------------------------- | :--------------------------------------------------- | :----------------------------------------------------------------------------- |
| `npm run audit:sector`                       | Tablero ejecutivo comparativo de los **22 sectores** | Tabla comparativa de sectores, fichas, % teléfonos válidos, maps, i18n y score |
| `npm run audit:sector <sector>`              | Deep-dive ficha a ficha de un sector específico      | Detalle tabular de cada negocio (teléfono, web, maps, zona, score)             |
| `npm run audit:sector -- --json`             | Exportación integral en JSON                         | Estructura para pipelines CI/CD y telemetría                                   |
| `npm run audit:fake -- --sector=<sector>`    | Detección de anomalías sintéticas y boilerplate      | Verificación de teléfonos dummy, CIDs inventados y texto plantilla IA          |
| `npm run audit:honesty -- --sector=<sector>` | Auditoría de fidelidad multi-mapa                    | Chequeo de CIDs reales vs búsquedas simuladas                                  |
| `npm run audit:refresh -- --sector=<sector>` | Verificación concurrente de salud web                | Peticiones HTTP en paralelo para comprobar sitios web activos                  |

---

## 🗂️ 2. Mapa de los 22 Sectores del Catálogo

A continuación se detallan los identificadores aceptados por los comandos CLI (`<sector>`) y su ubicación física en el código:

| Clave CLI (`<sector>`)       | Carpeta en `src/data/services/`               | Nombre del Módulo / Array  | Fichas Actuales |
| :--------------------------- | :-------------------------------------------- | :------------------------- | :-------------- |
| `agricultura-productores`    | `src/data/services/agricultura-productores/`  | `AGRICULTURA_SERVICES`     | 27              |
| `alojamiento-turismo`        | `src/data/services/alojamiento-turismo/`      | `ALOJAMIENTO_SERVICES`     | 51              |
| `arte-tatuajes`              | `src/data/services/arte-tatuajes/`            | `TATTOO_SERVICES`          | 11              |
| `artesania-manufactura`      | `src/data/services/artesania-manufactura/`    | `ARTESANIA_SERVICES`       | 34              |
| `deportes-fitness`           | `src/data/services/deportes-fitness/`         | `DEPORTES_SERVICES`        | 115             |
| `educacion-formacion`        | `src/data/services/educacion-formacion/`      | `EDUCACION_SERVICES`       | 30              |
| `entretenimiento-ocio`       | `src/data/services/entretenimiento-ocio/`     | `ENTRETENIMIENTO_SERVICES` | 13              |
| `finanzas-seguros`           | `src/data/services/finanzas-seguros/`         | `FINANZAS_SERVICES`        | 26              |
| `galerias-arte-exposiciones` | `src/data/services/galerias-museos/`          | `GALERIAS_MUSEOS_SERVICES` | 10              |
| `gastronomia-restaurantes`   | `src/data/services/gastronomia-restaurantes/` | `RESTAURANT_SERVICES`      | 221             |
| `hogar-limpieza`             | `src/data/services/hogar-limpieza/`           | `HOGAR_SERVICES`           | 26              |
| `inmobiliaria-villas`        | `src/data/services/inmobiliaria-villas/`      | `INMOBILIARIA_SERVICES`    | 23              |
| `jardineria-piscinas`        | `src/data/services/jardineria-piscinas/`      | `JARDINERIA_SERVICES`      | 25              |
| `mascotas-veterinaria`       | `src/data/services/mascotas-veterinaria/`     | `MASCOTAS_SERVICES`        | 24              |
| `motor-transporte`           | `src/data/services/motor-transporte/`         | `TRANSPORTE_SERVICES`      | 31              |
| `nautica-charter`            | `src/data/services/nautica-charter/`          | `NAUTICA_SERVICES`         | 41              |
| `reformas-construccion`      | `src/data/services/reformas-construccion/`    | `REFORMAS_SERVICES`        | 48              |
| `retail-comercio`            | `src/data/services/retail-comercio/`          | `RETAIL_SERVICES`          | 24              |
| `servicios-profesionales`    | `src/data/services/servicios-profesionales/`  | `PROFESIONALES_SERVICES`   | 27              |
| `servicios-sociales`         | `src/data/services/servicios-sociales/`       | `SOCIALES_SERVICES`        | 25              |
| `spas-bienestar`             | `src/data/services/spas-bienestar/`           | `SPAS_SERVICES`            | 72              |
| `tecnologia-seguridad`       | `src/data/services/tecnologia-seguridad/`     | `SEGURIDAD_SERVICES`       | 25              |

---

## 🔍 3. Indicadores Evaluados por Ficha

Cada ficha en un sector es evaluada bajo 7 criterios obligatorios:

1. **Autenticidad de Teléfono (GR-11):**
   - Rechazo terminante de terminaciones sintéticas (`1234`, `12345`).
   - Rechazo de prefijos dummy (`971 000`, `971 77 12`).
   - Verificación de formato oficial balear (`871`, `971`, `6XX`, `7XX`) o números corporativos contrastados.
2. **Fidelidad Google Maps (GR-12):**
   - **Ficha real (Listing):** Posee un `cid=` con más de 14 dígitos verídico verificado en Google Maps.
   - **Sin Ficha (Honesto / Absent):** En ausencia de listing oficial contrastado, el campo `googleMapsUrl` debe ser `undefined` y la UI declara honestamente _"Sin ficha en mapas"_.
   - **Prohibición:** Prohibido inyectar URLs de búsqueda sintética (`maps/search`, `?q=`, `/search/?api=`) o CIDs secuenciales.
3. **Disponibilidad y Validez Web:**
   - Debe tener URL HTTPS válida apuntando al dominio oficial del negocio o sus canales de reserva contrastados.
4. **Geolocalización Insular:**
   - Las coordenadas `{ lat, lng }` deben encontrarse dentro del polígono geográfico de la isla de Mallorca (Bounding Box: `lat` 39.0 a 40.1, `lng` 2.2 a 3.6).
5. **Cobertura Lingüística Cuatrilingüe (GR-04):**
   - Disponibilidad simultánea de textos descriptivos y especialidades en los 4 idiomas oficiales del portal: **Español (ES)**, **Inglés (EN)**, **Catalán (CA)** y **Alemán (DE)**.
6. **Estructura de los 5 Pilares:**
   - Social Proof (reseñas contrastadas o rating oficial).
   - Storytelling del fundador/origen del negocio.
   - Especialidades del servicio en Mallorca.
   - Galería fotográfica con imágenes físicas presentes en `/public/images/`.
7. **Score de Confianza (Confidence Score):**
   - Mínimo $\ge 80\%$ para estatus de verificación aprobada.

---

## 🚀 4. Ejemplos Prácticos de Uso

### Ejemplo A: Inspeccionar el sector Deportes y Fitness

```bash
npm run audit:sector deportes-fitness
```

Salida esperada:

- Cabecera con estadísticas de las 115 fichas del sector.
- Tabla detallando cada club o centro deportivo con su teléfono verificado, estado de ficha de maps y puntuación de confianza.

### Ejemplo B: Inspeccionar el sector Restaurantes y Gastronomía

```bash
npm run audit:sector gastronomia-restaurantes
```

### Ejemplo C: Inspeccionar Spas y Centros Médicos

```bash
npm run audit:sector spas-bienestar
```

### Ejemplo D: Detectar si existen números dummy o plantillas IA en un sector

```bash
npm run audit:fake -- --sector=reformas-construccion
```

### Ejemplo E: Auditar honestidad de mapas en un sector

```bash
npm run audit:honesty -- --sector=nautica-charter
```

---

## 🛡️ 5. Protocolo de Remediación ante Incidencias

Si un sector reporta estado `🚨 ATENCION` o `🚨 CRITICO`:

1. Identificar los slugs señalados en la tabla por la marca `❌ DUMMY` o `🚨 anomalías`.
2. Abrir el archivo modular correspondiente en `src/data/services/<sector>/<slug>.ts`.
3. Cruzar el teléfono con la web oficial o el registro empresarial balear y actualizar con el número contrastado.
4. Si el negocio no cuenta con ficha física en Google Maps, asegurar que `googleMapsUrl: undefined`.
5. Ejecutar la validación del sector:
   ```bash
   npm run audit:sector <sector>
   ```
6. Revalidar la suite global antes de cualquier commit:
   ```bash
   npm run prepush
   ```
