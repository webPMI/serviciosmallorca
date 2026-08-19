# 📚 Documentación - WebApp Starter

## Índice

| Documento                                    | Descripción                                                              | Audiencia                           |
| -------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------- |
| **[GOLDEN_RULES.md](GOLDEN_RULES.md)**       | 🥇 Reglas inmutables del proyecto (10 reglas)                            | Todos los agentes y desarrolladores |
| **[AGENTS.md](AGENTS.md)**                   | 🤖 Sistema multi-agente: roles, responsabilidades, flujos                | Agentes y desarrolladores           |
| **[ARCHITECTURE.md](ARCHITECTURE.md)**       | 🏗️ Arquitectura completa del proyecto: stack, estructura, flujo de datos | Desarrolladores                     |
| **[DEVELOPMENT.md](DEVELOPMENT.md)**         | 🛠️ Guía de desarrollo: setup, comandos, flujo de trabajo                 | Desarrolladores                     |
| **[TOOLS.md](TOOLS.md)**                     | 🛠️ Tools & infraestructura: scripts, ESLint, Prettier, Git Hooks, MCP    | @maestro, @todos                    |
| **[STYLING.md](STYLING.md)**                 | 🎨 Sistema de estilos: temas, variables CSS, responsividad               | @frontend, @styling                 |
| **[I18N.md](I18N.md)**                       | 🌍 Internacionalización: locales, flujo de detección, traducciones       | @frontend                           |
| **[AUTH.md](AUTH.md)**                       | 🔐 Autenticación: Firebase, roles, flujos de auth                        | @auth, @frontend                    |
| **[DEVTOOLS.md](DEVTOOLS.md)**               | 🛠️ DevTools Suite: logger, floating button, panel                        | @devtools                           |
| **[email-templates.md](email-templates.md)** | 📧 Plantillas de correo de Firebase Auth                                 | @auth                               |

## Quick Links

### Para empezar a desarrollar

1. Leer [GOLDEN_RULES.md](GOLDEN_RULES.md) - obligatorio
2. Leer [AGENTS.md](AGENTS.md) - entender el flujo multi-agente
3. Leer [DEVELOPMENT.md](DEVELOPMENT.md) - setup y comandos

### Por dominio

- **Frontend**: [ARCHITECTURE.md](ARCHITECTURE.md), [STYLING.md](STYLING.md), [I18N.md](I18N.md)
- **Auth**: [AUTH.md](AUTH.md), [email-templates.md](email-templates.md)
- **DevTools**: [DEVTOOLS.md](DEVTOOLS.md)
- **Testing**: [DEVELOPMENT.md](DEVELOPMENT.md#testing)
- **Tools & CI**: [TOOLS.md](TOOLS.md)

## Flujo de Trabajo

```
1. Usuario asigna tarea al Agente Maestro
2. Agente Maestro descompone y asigna a especialistas
3. Especialistas implementan siguiendo sus docs de dominio
4. Agente Maestro audita con GOLDEN_RULES.md
5. npm test + npm run build
6. Merge si pasa todo ✅
```
