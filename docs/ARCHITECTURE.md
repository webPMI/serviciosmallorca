# 🏗️ Arquitectura Completa — Servicios Mallorca

## 1. Stack Tecnológico

| Capa                   | Tecnología                        | Versión / Tipo                                   |
| ---------------------- | --------------------------------- | ------------------------------------------------ |
| **Framework Web**      | Astro (SSR)                       | ^7.1.3 (@astrojs/cloudflare Edge adapter)        |
| **Runtime / Edge**     | Cloudflare Pages                  | nodejs_compat (Ultra baja latencia)              |
| **Autenticación & DB** | Firebase Auth + Cloud Firestore   | ^12.16.0 (`serviciosmallorca`)                   |
| **Monetización**       | Google AdSense                    | `ca-pub-1988580228487420` (`ads.txt` verificado) |
| **Testing**            | Vitest                            | ^3.0.7 (70+ unit tests)                          |
| **Tipado**             | TypeScript                        | ^6.0.3 (Strict mode)                             |
| **Estilos**            | CSS Variables + Custom Properties | Nativo (Dark, Light, Golden, Golden-Dark)        |

---

## 2. Estructura de Directorios

```
servicios-mallorca/
├── wrangler.json               # Configuración de Cloudflare Pages
├── public/
├── src/
├── scripts/
├── tests/
├── docs/
└── AGENTS.md
```

## 3. Módulos de Inteligencia y Curación

### 🔬 Motor de Minería (`scripts/`)
El sistema utiliza un orquestador de búsqueda que puede ejecutar:
- **Deep Scraping:** Extracción de metadatos, precios, imágenes y redes sociales de sitios web oficiales.
- **Social Analysis:** Extracción de enlaces de bio (Linktree, Instagram, TikTok) y validación de contenido.
- **Cross-Reference:** Validación cruzada de datos entre múltiples fuentes (Google Maps, Directorios, Web).
- **Data Enrichment:** Generación automática de especialidades, historias de autor y búsqueda de noticias locales.

### 🛠️ Ecosistema de Utilidades (`public/`, `src/components/`)
Herramientas gratuitas para el usuario:
- **Image Web Editor:** Edición rápida de contenido visual.
- **Auralist:** Curación de audio y contenido sonoro.
- **Geolocalización:** Herramientas de mapas y coordenadas.
- **Calculadoras:** Herramientas de presupuestos y conversiones.

## 4. Flujo de Datos y Validación

1. **Input:** Búsqueda por nombre/geolocalización.
2. **Minería:** `scripts/business-intelligence-lookup.ts` extrae datos crudos.
3. **Auditoría:** `src/lib/verificationEngine.ts` valida la veracidad y genera un `confidenceScore`.
4. **Curación:** Agente `@curation` redacta el contenido en 3 idiomas y asigna especialidades.
5. **Publicación:** El negocio se inserta en `src/data/services/` y se refleja en la UI.

---

## 5. Módulos de Negocio (Catálogo)

| Sector | Especialidades Clave |
| --- | --- |
| **Gastronomía** | Restaurantes, Menús, Especialidades, Reservas |
| **Arte & Tatuajes** | Estudios, Galería, Piercing, Artistas |
| **Náutica** | Charters, Mantenimiento, Yates, Deportes Acuáticos |
| **Servicios** | Estética, Bienestar, Salud, B2B |

---

## 6. Roadmap de Desarrollo

- [x] Refactorización Modular de la URL de Servicios.
- [x] Motor de Minería y Vitrina E-Commerce.
- [x] Protocolo de Curación de Alta Fidelidad.
- [ ] Dashboard de Verificación y Gestión de Alertas.
- [ ] Sistema de Notificaciones en Tiempo Real.
- [ ] Integración con APIs de Reservas Directas.
