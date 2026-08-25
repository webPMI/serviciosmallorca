# 🛠️ Ecosistema de Utilidades (Toolkit de Usuario)

Este documento sirve como el catálogo oficial de las herramientas gratuitas que ofrece la plataforma para potenciar la experiencia de los usuarios en Mallorca. El objetivo es ofrecer valor añadido que vaya más allá de la simple consulta de negocios.

## 🎯 Filosofía del Ecosistema
1.  **Accesibilidad:** Todas las herramientas deben ser gratuitas y de fácil acceso.
2.  **Utilidad Real:** Cada herramienta debe resolver un problema práctico (planificación, creación de contenido, gestión de datos).
3.  **Diseño Consistente:** Deben seguir estrictamente el sistema de diseño de la plataforma (variables CSS, tipografía, botones).
4.  **Privacidad por Diseño:** No recolectar datos personales a menos que sea estrictamente necesario para la funcionalidad de la herramienta.

---

## 🛠️ Inventario de Herramientas

### 🎨 Visual & Contenido
- **Image Web Editor:** Editor ligero integrado para ajustar brillo, contraste, recortar y redimensionar imágenes antes de ser compartidas o subidas a perfiles.
- **Auralist:** (En desarrollo) Herramienta de curación sonora y listas de reproducción para ambientar experiencias en la isla.

### 📍 Planificación y Geolocalización
- **Mapa de Coordenadas:** Conversor y visualizador de coordenadas GPS para planificar rutas y puntos de interés precisos.
- **Calculadora de Distancias:** Herramienta para calcular tiempos y distancias entre diferentes puntos de Mallorca.

### 💼 Herramientas de Negocio (B2B)
- **Generador de Códigos QR:** Crea códigos QR personalizados para que los negocios en el directorio puedan enlazar directamente a su perfil con un solo escaneo.
- **Calculadora de Presupuestos:** Herramienta básica para que autónomos y negocios puedan calcular precios con impuestos incluidos de forma rápida.

---

## 🚀 Roadmap de Expansión
*   **Integrador de Menús:** Herramienta para convertir fotos de menús físicos en texto estructurado para buscadores.
*   **Planificador de Rutas:** Generador de itinerarios personalizados basados en categorías de interés (ej: "Ruta de Tatuajes en Calvià").
*   **Conversor de Monedas:** Conversor en tiempo real para turistas.

---

## 📝 Reglas de Desarrollo para el Agente `@devtools`
Para añadir una nueva herramienta, el agente debe:
1.  Definir la funcionalidad en esta sección.
2.  Crear el componente en la carpeta `public/` o `src/components/` según su complejidad.
3.  Asegurarse de que la herramienta sea "Standalone" (no dependa de la carga de un negocio específico).
4.  Documentar el funcionamiento en `docs/DEVTOOLS.md`.
