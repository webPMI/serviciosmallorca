# 📚 Documentación - WebApp Starter

## Índice

| Documento                                                                | Descripción                                                                                                                   | Audiencia                           |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **[GOLDEN_RULES.md](GOLDEN_RULES.md)**                                   | 🥇 Reglas inmutables del proyecto (13 reglas incl. Seguridad & Zero Fake Data)                                                | Todos los agentes y desarrolladores |
| [**BUSINESS_REGISTRATION_PROCESS.md**](BUSINESS_REGISTRATION_PROCESS.md) | 🏢 Proceso oficial de registro, curación, verificación y publicación de negocios                                              | Editores, @maestro, @frontend       |
| **[BUSINESS_DISCOVERY_SOP.md](BUSINESS_DISCOVERY_SOP.md)**               | 🔎 SOP del checklist maestro: descubrir, minar y priorizar negocios de Mallorca (categoría→puntaje→alfabético)                | Editores y agentes                  |
| **[SPORTS_FITNESS_SECTION.md](SPORTS_FITNESS_SECTION.md)**               | 🏋️ Vertical Deportiva: taxonomía (12 categorías), SEO, espacios públicos gratuitos y plan de activación F0→F5                 | Editores, @maestro, @frontend       |
| **[TOPS_SEO_PLAYBOOK.md](TOPS_SEO_PLAYBOOK.md)**                         | 🏆 Playbook Tops & Destacados: motores de ranking reales, SOP de tops editoriales, criterios `featured` y plan SEO 90 días    | Editores, @maestro, @frontend       |
| **[DATA_VERIFICATION_PROTOCOL.md](DATA_VERIFICATION_PROTOCOL.md)**       | 🔍 Protocolo de prospección, validación y verificación Google Maps (Zero Fake Data)                                           | Editores, @maestro, @frontend       |
| **[SECURITY.md](SECURITY.md)**                                           | 🛡️ Seguridad del usuario, arquitectura Firestore, cabeceras HTTP y RGPD/LOPDGDD                                               | @auth, @frontend, @maestro          |
| **[MONETIZATION_GROWTH.md](MONETIZATION_GROWTH.md)**                     | 📈 Estrategia maestra: crecimiento automático, flujo de interacción AdSense, proyecciones de ingresos y coste 10€/año         | Owner, @maestro, editores           |
| **[FORUM_COMMUNITY_ROADMAP.md](FORUM_COMMUNITY_ROADMAP.md)**             | 💬 Roadmap del foro: bolsa de trabajo (principal), vivienda, mercado, eventos y avisos; esquema Firestore y fases F1-F5       | @auth, @frontend, editores          |
| **[FORUM_UI_UX_SPEC.md](FORUM_UI_UX_SPEC.md)**                           | 🔧 Spec técnica del foro: auditoría anti-XSS, wireframes V1-V5, firma de lib jobs.ts, catálogo i18n y criterios de aceptación | @frontend, @auth, @testing          |
| **[F1_IMPLEMENTATION_PACKAGE.md](F1_IMPLEMENTATION_PACKAGE.md)**         | 🚀 Paquete listo para merge de Fase 1: safeDom anti-XSS completo, taxonomía, rules delta, tests e i18n x3                     | @frontend, @auth                    |
| **[SCALABILITY_AND_ARCHITECTURE.md](SCALABILITY_AND_ARCHITECTURE.md)**   | 🏗️ Arquitectura escalable, fases de crecimiento, monetización y SEO                                                           | Desarrolladores y editores          |
| **[WORKFLOW_CURATION.md](WORKFLOW_CURATION.md)**                         | 🎯 Protocolo de curación diaria (5 servicios/día) y control anti-duplicados                                                   | Editores y agentes                  |
| **[TAXONOMY.md](TAXONOMY.md)**                                           | 🗂️ Sistema de clasificación: Sectores, Categorías, Tipos de Servicio y Etiquetas                                              | Todos los agentes y editores        |
| **[TAXONOMY_SCALE.md](TAXONOMY_SCALE.md)**                               | 🚀 Mapa de escalado masivo: 20 super-sectores, ~160 categorías, todos los negocios de Mallorca                                | Todos los agentes y editores        |
| **[AGENTS.md](AGENTS.md)**                                               | 🤖 Sistema multi-agente: roles, responsabilidades, flujos                                                                     | Agentes y desarrolladores           |
| **[ARCHITECTURE.md](ARCHITECTURE.md)**                                   | 🏗️ Arquitectura completa del proyecto: stack, estructura, flujo de datos                                                      | Desarrolladores                     |
| **[DEVELOPMENT.md](DEVELOPMENT.md)**                                     | 🛠️ Guía de desarrollo: setup, comandos, flujo de trabajo                                                                      | Desarrolladores                     |
| **[TOOLS.md](TOOLS.md)**                                                 | 🛠️ Tools & infraestructura: scripts, ESLint, Prettier, Git Hooks, MCP                                                         | @maestro, @todos                    |
| **[STYLING.md](STYLING.md)**                                             | 🎨 Sistema de estilos: temas, variables CSS, responsividad                                                                    | @frontend, @styling                 |
| **[I18N.md](I18N.md)**                                                   | 🌍 Internacionalización: locales, flujo de detección, traducciones                                                            | @frontend                           |
| **[AUTH.md](AUTH.md)**                                                   | 🔐 Autenticación: Firebase, roles, flujos de auth                                                                             | @auth, @frontend                    |
| **[DEVTOOLS.md](DEVTOOLS.md)**                                           | 🛠️ DevTools Suite: logger, floating button, panel                                                                             | @devtools                           |
| **[email-templates.md](email-templates.md)**                             | 📧 Plantillas de correo de Firebase Auth                                                                                      | @auth                               |

## Quick Links

### Para empezar a desarrollar

1. Leer [GOLDEN_RULES.md](GOLDEN_RULES.md) - obligatorio
2. Leer [AGENTS.md](AGENTS.md) - entender el flujo multi-agente
3. Leer [DEVELOPMENT.md](DEVELOPMENT.md) - setup y comandos

### Por dominio

- **Negocio & Monetización**: [MONETIZATION_GROWTH.md](MONETIZATION_GROWTH.md), [SCALABILITY_AND_ARCHITECTURE.md](SCALABILITY_AND_ARCHITECTURE.md)
- **Foro & Comunidad**: [FORUM_COMMUNITY_ROADMAP.md](FORUM_COMMUNITY_ROADMAP.md), [FORUM_UI_UX_SPEC.md](FORUM_UI_UX_SPEC.md), [F1_IMPLEMENTATION_PACKAGE.md](F1_IMPLEMENTATION_PACKAGE.md)
- **SEO & Contenido**: [TAXONOMY.md](TAXONOMY.md), [TAXONOMY_SCALE.md](TAXONOMY_SCALE.md), [WORKFLOW_CURATION.md](WORKFLOW_CURATION.md)
- **Frontend**: [ARCHITECTURE.md](ARCHITECTURE.md), [STYLING.md](STYLING.md), [I18N.md](I18N.md)
- **Auth**: [AUTH.md](AUTH.md), [email-templates.md](email-templates.md)
- **DevTools**: [DEVTOOLS.md](DEVTOOLS.md)
- **Testing**: [DEVELOPMENT.md](DEVELOPMENT.md#testing)
- **Tools & CI**: [TOOLS.md](TOOLS.md)

## Flujo de Trabajo

```text
1. Usuario asigna tarea al Agente Maestro
2. Agente Maestro descompone y asigna a especialistas
3. Especialistas implementan siguiendo sus docs de dominio
4. Agente Maestro audita con GOLDEN_RULES.md
5. npm test + npm run build
6. Merge si pasa todo ✅
```
