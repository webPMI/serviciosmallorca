# Roadmap Foro y Comunidad — Servicios Mallorca

> **Documento maestro de planificacion** para la evolucion del foro comunitario hacia una plataforma hyperlocal con la **Bolsa de Trabajo** como categoria principal.
>
> Este documento define la taxonomia de categorias, la especificacion detallada de la bolsa de empleo, el modelo de datos, la integracion con monetizacion y el plan de implementacion por fases.
>
> **Relacion con otros documentos**: Estado actual en ARCHITECTURE.md; reglas de negocio en GOLDEN_RULES.md (GR-04 i18n, GR-05 tests, GR-07 accesibilidad, GR-11 Zero Fake Data); ciclo de engagement en MONETIZATION_GROWTH.md (sec. 3.2.2); seguridad en SECURITY.md y firestore.rules.

---

## Indice

1. Vision y Objetivos Estrategicos
2. Estado Actual del Foro (lo que ya existe)
3. Taxonomia Propuesta: 6 Categorias Principales
4. Bolsa de Trabajo — Especificacion Detallada (PRINCIPAL)
5. Modelo de Datos Firestore (Evolucion)
6. Integracion con Monetizacion AdSense
7. Requisitos i18n (GR-04)
8. Moderacion y Seguridad
9. Plan de Implementacion por Fases (F1-F5)
10. Checklist de Cumplimiento Golden Rules

---

## 1. Vision y Objetivos Estrategicos

El foro pasa de ser un apendice conversacional a ser el **motor de retencion diaria** de la plataforma. Un usuario que consulta la bolsa de trabajo vuelve cada dia; un usuario que vuelve cada dia multiplica las impresiones de anuncios documentadas en MONETIZATION_GROWTH.md (sec. 3).

### 1.1 Objetivos medibles

| Objetivo                              | Metrica                        | Target Fase 2  |
| ------------------------------------- | ------------------------------ | -------------- |
| Habito diario                         | Usuarios recurrentes semanales | 40%+ del total |
| Contenido generado por usuarios (UGC) | Temas nuevos/semana            | 25+            |
| Bolsa de trabajo activa               | Ofertas activas simultaneas    | 50+            |
| Profundidad                           | Respuestas por tema            | 5+ media       |
| SEO por UGC                           | Paginas de tema indexadas      | 500+           |

### 1.2 Por que estas categorias funcionan en Mallorca

Cada categoria responde a una necesidad REAL y verificable de residentes y trabajadores de la isla (principio GR-11 aplicado a comunidades): el empleo y la vivienda son los dos mayores problemas estructurales de Mallorca segun el debate publico insular; el mercado de segunda mano y los eventos completan el habito diario de consulta.

---

## 2. Estado Actual del Foro (lo que ya existe)

### 2.1 Capacidades implementadas

| Componente                                         | Estado      | Ubicacion                                   |
| -------------------------------------------------- | ----------- | ------------------------------------------- |
| Listado de temas con filtro por categoria          | Funcional   | src/pages/[...locale]/comunidad/index.astro |
| Creacion de temas (auth requerida)                 | Funcional   | comunidad/nuevo.astro                       |
| Detalle de tema con respuestas                     | Funcional   | comunidad/[slug].astro                      |
| Sistema de likes en temas                          | Funcional   | toggleTopicLike()                           |
| Respuestas anidadas planas (1 nivel)               | Funcional   | addForumReply()                             |
| Contadores repliesCount/likesCount                 | Funcional   | Firestore increment                         |
| Reglas Firestore (lectura publica, escritura auth) | Desplegadas | firestore.rules sec. forum_topics           |
| Tests unitarios del modulo                         | Funcionales | tests/unit/community.test.ts                |

### 2.2 Limitaciones actuales a resolver

| Limitacion                                                                    | Impacto                                                       | Solucion prevista                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| Solo 4 categorias genericas (recomendaciones, preguntas, experiencias, guias) | No captura casos de uso concretos con demanda real            | Nueva taxonomia de 6 categorias (sec. 3)                |
| Firebase Spark NO incluye Cloud Functions                                     | Imposible expiracion automatica ni notificaciones server-side | Expiracion lazy en query + badge cliente (sec. 4.3)     |
| Sin campos estructurados por tipo de tema                                     | Un empleo no puede filtrarse por zona/jornada                 | jobMeta discriminada (sec. 5)                           |
| Sin moderacion activa ni reportes                                             | Riesgo spam al crecer                                         | Cola admin + reportes (sec. 8)                          |
| Sin busqueda full-text                                                        | Dificil encontrar temas antiguos                              | Filtros estructurados primero; busqueda cliente despues |

---

## 3. Taxonomia Propuesta: 6 Categorias Principales

La bolsa de trabajo es la categoria estrella; las otras 4 nuevas se disenaron para el contexto mallorquin y la categoria Cafe absorbe el contenido legacy sin migracion forzosa.

### 3.1 Tabla resumen

| #   | Categoria                  | id       | Icono | Subcategorias                                    | Potencial retencion        |
| --- | -------------------------- | -------- | ----- | ------------------------------------------------ | -------------------------- |
| 1   | **Bolsa de Trabajo**       | empleo   | 💼    | ofertas / solicitudes                            | MUY ALTO (consulta diaria) |
| 2   | **Vivienda y Alquileres**  | vivienda | 🏠    | larga-estancia / compartir / traspasos           | ALTO (busqueda intensiva)  |
| 3   | **Compra-Venta y Mercado** | mercado  | 🛒    | segunda-mano / herramientas / vehiculos / gratis | ALTO (recurrente)          |
| 4   | **Eventos y Quedadas**     | eventos  | 📅    | cultura / deporte / networking / solidario       | MEDIO-ALTO (estacional)    |
| 5   | **Avisos y Vecindario**    | avisos   | 🚨    | perdidos / alertas / recomendaciones             | MEDIO (habito local)       |
| 6   | **Cafe Comunidad**         | cafe     | ☕    | preguntas / experiencias / guias (legacy)        | MEDIO (social)             |

### 3.2 Justificacion de cada categoria nueva

#### 3.2.1 Empleo — Bolsa de Trabajo (PRINCIPAL)

La economia mallorquina combina turismo estacional masivo, construccion, hosteleria y servicios con alta rotacion de personal. Hay demanda doble: empresas que no encuentran personal y trabajadores que buscan empleo o encargos puntuales.

- **Ofertas**: negocios verificados del directorio publican vacantes -> sinergia directa con GR-12 y el rol manager existente
- **Solicitudes**: personas ofrecen su perfil o buscan encargos (gig economy: fontanero por horas, camarero fin de semana)
- Reutiliza CATEGORIES (sectores) y MALLORCA_ZONES de src/data/ para filtros coherentes

#### 3.2.2 Vivienda y Alquileres

El acceso a la vivienda es el principal problema de quienes trabajan en la isla. Subcategorias: larga-estancia (alquiler anual, el mas demandado), compartir (companeros/habitacion) y traspasos (cesion de locales y negocios, practica habitual). Nota legal: solo anuncios entre particulares; agentes inmobiliarios deben usar el directorio de servicios.

#### 3.2.3 Compra-Venta y Mercado (Segunda Mano)

Los clasificados generan el mayor trafico recurrente en foros locales probados. Nichos mallorquines: herramientas-material (construccion y jardin), vehiculos (coches, motos, bicis, embarcaciones ligeras), segunda-mano general y gratis (regalo vecinal).

#### 3.2.4 Eventos y Quedadas

Calendario insular denso (ferias, santos patrones, conciertos, mercadillos). Subcategorias: cultura-fiestas, deporte-outdoor (rutas Serra de Tramuntana), networking-business y solidario-voluntariado.

#### 3.2.5 Avisos y Vecindario

Cola social que crea habito diario: mascotas perdidas/encontradas, alertas de fraude o cortes, recomendaciones rapidas de vecinos (absorbe la legacy recomendaciones).

#### 3.2.6 Cafe Comunidad (contenedor legacy)

Absorbe sin migracion los temas actuales: preguntas, experiencias y guias pasan a subcategorias. Los slugs existentes NO cambian (compatibilidad SEO).

### 3.3 Mapping legacy -> nueva taxonomia

| ForumCategory actual | Destino nuevo                       |
| -------------------- | ----------------------------------- |
| recomendaciones      | cafe.recomendaciones (subcategoria) |
| preguntas            | cafe.preguntas (subcategoria)       |
| experiencias         | cafe.experiencias (subcategoria)    |
| guias                | cafe.guias (subcategoria)           |
| todas                | filtro global (se mantiene)         |

Estrategia de compatibilidad: el tipo ForumCategory se amplia (union) sin eliminar valores legacy; los temas antiguos conservan su categoria original que se renderiza dentro de Cafe mediante mapping en cliente. Cero migracion de datos requerida.

```typescript
// src/lib/community.ts (propuesta F1)
export type ForumCategory =
  // nuevas principales
  | "empleo"
  | "vivienda"
  | "mercado"
  | "eventos"
  | "avisos"
  | "cafe"
  // legacy (solo lectura progresiva)
  | "recomendaciones"
  | "preguntas"
  | "experiencias"
  | "guias"
  | "todas";
```

---

---

## 4. Bolsa de Trabajo — Especificacion Detallada (PRINCIPAL)

### 4.1 Tipos de publicacion

La bolsa opera con dos tipos complementarios dentro de la categoria empleo:

| Tipo                          | id      | Quien publica                                            | Verificacion                                                                            |
| ----------------------------- | ------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Oferta de empleo**          | oferta  | Empresas y particulares que buscan trabajador            | Badge Empresa Verificada si el autor es manager de un negocio verificado del directorio |
| **Solicitud / Busco trabajo** | demanda | Personas que buscan empleo u ofrecen servicios puntuales | Cuenta autenticada; badge opcional Perfil Completo                                      |

### 4.2 Esquema de datos (TypeScript)

```typescript
// src/lib/jobs.ts (propuesta F2)
export type JobKind = "oferta" | "demanda";

export type JobContractType =
  | "indefinido"
  | "temporal" // temporada turistica: caso dominante en Mallorca
  | "media-jornada"
  | "practicas"
  | "por-encargo" // gig economy
  | "sin-especificar";

export interface JobMeta {
  kind: JobKind;
  sector: string; // id de CATEGORIES existente (ej: reformas-hogar)
  zone: string; // id de MALLORCA_ZONES existente (ej: palma)
  contractType: JobContractType;
  salaryRange?: string; // texto libre opcional ej: 1200-1500 EUR/mes
  experienceRequired?: boolean;
  // contacto: NUNCA datos personales sensibles en texto publico (RGPD)
  applyWhatsApp?: string; // E.164 validado en cliente
  applyEmail?: string;
  applyUrl?: string;
}

// forum_topics se amplia con campo opcional:
// jobMeta?: JobMeta   (presente solo si category === "empleo")
```

Reglas de validacion en cliente (y espejo en firestore.rules donde sea posible):

- titulo: 10-120 caracteres
- descripcion: 30-5000 caracteres
- sector y zone DEBEN existir en los arrays de src/data/ (anti-injection)
- applyWhatsApp regex ^\\+[0-9]{7,15}$
- Maximo 1 oferta activa por uid cada 24h (rate limit cliente + regla)

### 4.3 Ciclo de vida y expiracion (compatible Firebase Spark)

Firebase Spark (free tier) no incluye Cloud Functions, por lo que la expiracion se resuelve con evaluacion lazy:

```text
[Publicar] -> status: active, expiresAt = createdAt + 30 dias
     |
     v  (lectura)
Query SIEMPRE filtra: status == active AND expiresAt > now()
     |
     +--> si expira pero nadie lo archiva: simplemente deja de aparecer
     |
[Autor] puede renovar (+30d) o archivar manualmente desde Mi Panel
     |
[Purga RGPD] documentos archived > 90 dias: borrado manual mensual
              (script npm run purge:forum --dry-run primero)
```

Ventaja del modelo lazy: cero coste de infraestructura, cero funciones serverless, y el listado siempre muestra solo ofertas vigentes. Contador visual en la ficha: Esta oferta caduca en X dias (urgencia que mejora respuesta).

### 4.4 Confianza y anti-fraude (alineado GR-11)

| Mecanismo                  | Detalle                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Auth obligatoria           | Nunca se publica empleo anonimo; guest solo lectura                                                                             |
| Empresa Verificada         | Si authorUid es manager con negocio verificado -> badge + enlace a su ficha del directorio                                      |
| Prohibiciones absolutas    | Pagas para inscribirte, esquemas piramidales/MLM, ventas puerta a puerta comisionista, ofertas sin actividad real               |
| Filtro lexico F2           | Lista negra de palabras clave bloquea publicacion y sugiere revision                                                            |
| Reporte comunitario        | Boton Denunciar en cada tema -> cola admin (sec. 8)                                                                             |
| Primeros posts en revision | Las primeras 3 publicaciones de una cuenta nueva requieren aprobacion admin                                                     |
| Datos reales               | El empleo vinculado a un negocio del directorio hereda la verificacion triple ya documentada en MONETIZATION_GROWTH.md sec. 6.1 |

### 4.5 RGPD y datos personales

- PROHIBIDO incluir en texto publico: DNI/NIE completo, direccion exacta de domicilio, datos bancarios, fotos de documentos
- El contacto se realiza via WhatsApp/email/enlace externo elegido por el autor — la plataforma no almacena CVs
- Derecho de supresion: el autor borra su tema desde Mi Panel en cualquier momento (ya existe patron en fichas de servicio)
- Minimizacion: expiresAt + purga 90d limitan la vida de datos por defecto

### 4.6 Flujos UX principales

#### Publicar una oferta (empresa)

```text
/es/comunidad/nuevo?cat=empleo
  -> (auth gate si guest: login/register)
  -> Formulario dinamico:
     Tipo: Oferta de empleo
     Puesto* | Sector* (CATEGORIES select) | Zona* (MALLORCA_ZONES)
     Tipo contrato* | Salario opcional | Descripcion*
     Contacto*: WhatsApp / Email / URL (al menos uno)
  -> Preview -> Publicar -> aparece con badge Empresa Verificada si aplica
```

#### Buscar trabajo (demanda)

Mismo formulario con campos invertidos: Que se te da bien*, Experiencia breve, Zonas donde puedes trabajar, Disponibilidad inmediata (checkbox).

#### Explorar la bolsa

- Chips de filtro apilados: [Ofertas|Solicitudes] x [Sector] x [Zona]
- Orden por defecto: mas recientes; toggle Caduca pronto primero
- Tarjeta de listado muestra: badge tipo, puesto, zona, contrato, caducidad, respuestas
- Paginacion cursor-based (startAfter) para escalar sin coste

#### Contactar

Boton WhatsApp con mensaje preconfigurado y atribucion (mismo patron que fichas de servicio): text=Hola, veo tu anuncio en Servicios Mallorca...

---

## 5. Modelo de Datos Firestore (Evolucion)

### 5.1 Decision: extender forum_topics vs coleccion nueva

Se elige **extender forum_topics** con jobMeta opcional:

- Las respuestas publicas (Q&A sobre el empleo) reutilizan forum_replies intacto
- Un unico feed unificado en /comunidad mantiene la UX simple
- Evita duplicar reglas, indices y componentes de tarjeta

Contra: documentos algo heterogeneos -> mitigado con validacion condicional en rules.

### 5.2 Indices compuestos requeridos (firestore.indexes.json)

| Query                      | Indice                                                     |
| -------------------------- | ---------------------------------------------------------- |
| Bolsa activa por categoria | category ASC + status ASC + expiresAt ASC + createdAt DESC |
| Mis temas                  | authorUid ASC + createdAt DESC                             |
| Feed general existente     | category ASC + createdAt DESC (ya existe)                  |

### 5.3 Reglas de seguridad (firestore.rules) — delta propuesto

```text
match /forum_topics/{topicId} {
  allow read: if true;                       // lectura publica (SEO/UGC)
  allow create: if isSignedIn()
    && request.resource.data.authorUid == request.auth.uid
    // empleo: campos estructurados validados
    && ((request.resource.data.category != 'empleo')
        || (request.resource.data.jobMeta.kind in ['oferta','demanda']
            && request.resource.data.jobMeta.sector is string
            && request.resource.data.jobMeta.zone is string));
  allow update, delete: if isOwner() || isAdmin();   // autor o admin
}
```

Nota: la regla de rate-limit 24h no es expresable en rules sin contador extra; se aplica en cliente + revision manual. Se documenta como limite conocido.

---

## 6. Integracion con Monetizacion AdSense

### 6.1 Impacto directo en ingresos

La bolsa de trabajo convierte visitas ocasionales en habito diario, el multiplicador mas potente del modelo RPM documentado en MONETIZATION_GROWTH.md sec. 7:

| Efecto               | Mecanismo                                 | Estimacion                                 |
| -------------------- | ----------------------------------------- | ------------------------------------------ |
| Frecuencia de visita | Consulta diaria de ofertas nuevas         | +30-50% sesiones/semana por usuario activo |
| Paginas por sesion   | Listado -> detalle -> relacionados        | +1.5 paginas                               |
| Impresiones nuevas   | In-feed ads dentro de listados de empleo  | slot cada 5 anuncios                       |
| Contenido indexable  | Cada oferta = pagina unica con Schema.org | +500 URLs SEO a medio plazo                |

### 6.2 Placements especificos del foro/bolsa

| Ubicacion                | Formato                      | Notas                                     |
| ------------------------ | ---------------------------- | ----------------------------------------- |
| Listado comunidad (feed) | In-Feed fluid cada 4-5 temas | Ya planificado en MONETIZATION sec. 2.2.5 |
| Detalle de oferta        | In-Article tras descripcion  | Alto viewability                          |
| Entre respuestas largas  | In-Feed cada 5 respuestas    | Solo si hilo > 8 respuestas               |
| Sidebar desktop bolsa    | Rectangle sticky             | Pagina de mayor permanencia               |

### 6.3 Producto B2B futuro: Destacar Oferta (Fase 3 monetizacion)

Alineado con SCALABILITY sec. 4.2: las empresas verificadas podran destacar su vacante 7 dias (top del listado + badge Destacada). Debe etiquetarse claramente para cumplir politicas AdSense y no degradar confianza. Precio sugerido: desde 5 EUR/anuncio — primera via de ingreso directo distinta de AdSense.

---

## 7. Requisitos i18n (GR-04)

Toda cadena visible nueva debe existir en es.json, en.json y ca.json con paridad verificada por tests existentes.

### 7.1 Claves nuevas (extracto)

```text
forum.cat.empleo / vivienda / mercado / eventos / avisos / cafe
forum.cat.empleo.desc ... .cafe.desc        (descripcion corta de categoria)
jobs.kind.oferta / jobs.kind.demanda
jobs.form.title / sector / zone / contract / salary / apply
jobs.contract.indefinido / temporal / media-jornada / practicas / por-encargo
jobs.badge.verified / jobs.expires.in / jobs.expired
jobs.error.contactRequired / jobs.error.rateLimit24h
market.form.price / market.status.reserved
events.form.date / avisos.report
```

Convencion: prefijo por dominio (forum._, jobs._, market._, events._) siguiendo el patron dot-notation documentado en I18N.md.

---

## 8. Moderacion y Seguridad

### 8.1 Roles y capacidades

| Accion                 | guest | user | manager     | admin |
| ---------------------- | ----- | ---- | ----------- | ----- |
| Leer foro/bolsa        | Si    | Si   | Si          | Si    |
| Publicar tema/empleo   | No    | Si   | Si (+badge) | Si    |
| Editar/borrar propio   | —     | Si   | Si          | Si    |
| Denunciar tema         | No    | Si   | Si          | Si    |
| Moderar/cualquier tema | No    | No   | No          | Si    |
| Ver cola de revision   | No    | No   | No          | Si    |

### 8.2 Cola de moderacion (extension DashboardAdmin)

El DashboardAdmin existente anade pestana Foro: temas reportados, primeras publicaciones de cuentas nuevas, y empleos marcados por filtro lexico. Acciones: Aprobar / Eliminar + motivo / Banear autor (flag en users doc).

### 8.3 Rate limiting cliente (sin Cloud Functions)

- 1 tema nuevo cada 10 minutos por uid (localStorage timestamp + validacion server-side suave via contador en users)
- Max 3 respuestas consecutivas sin interaccion de otros usuarios
- Limites de longitud ya existentes en rules se mantienen

## 9. Plan de Implementacion por Fases (F1-F5)

Cada fase termina con npm run check (lint + typecheck + tests) y build < 60s antes de merge, segun el protocolo del Agente Maestro.

| Fase   | Alcance                | Tareas clave                                                                                                                                  | Tests nuevos                                              | Riesgo |
| ------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------ |
| **F1** | Taxonomia y filtros    | Ampliar ForumCategory; mapping legacy Cafe; chips UI; i18n 3 locales; ads in-feed comunidad                                                   | community.test: categorias validas + paridad i18n         | BAJO   |
| **F2** | Bolsa de Trabajo MVP   | jobMeta schema; formulario dinamico oferta/demanda; expiracion lazy; badge Empresa Verificada; contacto WhatsApp atribuido; indices Firestore | jobs.test: validacion jobMeta, expiracion, regex contacto | MEDIO  |
| **F3** | Mercado (compra-venta) | Campos precio y estado (disponible/reservado/vendido); foto obligatoria URL; filtro gratis                                                    | market.test: estados y transiciones                       | MEDIO  |
| **F4** | Eventos + Avisos       | Campo fecha evento con orden proximos primero; subcategorias perdidos/alertas                                                                 | events.test: orden por fecha futura                       | BAJO   |
| **F5** | Moderacion avanzada    | Pestana Foro en DashboardAdmin; reportes; cola primeros-posts; script purge:forum RGPD                                                        | moderation.test: permisos y cola                          | MEDIO  |

### 9.1 Dependencias entre fases

```text
F1 (taxonomia) ──> F2 (empleo) ──> F5 (moderacion completa)
       \\
        \\──> F3 (mercado) ──> F4 (eventos/avisos)
```

F2 puede arrancar en paralelo a F3/F4 tras F1 (no solapan archivos salvo i18n JSON, que se coordina por claves).

### 9.2 Criterios de exito por fase

- F1: las 6 categorias visibles y filtrables; legacy accesible dentro de Cafe
- F2: ciclo completo publicar-oferta -> filtrar -> contactar -> caducar verificado e2e manual + unit
- F3-F4: altas de prueba reales por categoria sin datos falsos (GR-11)
- F5: un tema denunciado se resuelve desde dashboard en < 3 clicks

---

## 10. Checklist de Cumplimiento Golden Rules

Aplicar a cada fase antes del merge:

```text
[ ] GR-01: estilos del foro/bolsa usan var(--color-*) de global.css
[ ] GR-02: responsive en breakpoints 480/640/768/900/1024 (listados y formularios)
[ ] GR-03: Props e interfaces TypeScript explicitas (ForumCategory, JobMeta)
[ ] GR-04: toda cadena nueva via translations en es/en/ca con paridad
[ ] GR-05: tests unitarios de cada fase listados en sec. 9
[ ] GR-06: este documento actualizado al cerrar cada fase
[ ] GR-07: aria-label en filtros, formularios y botones de accion; teclado completo
[ ] GR-09: cero errores consola; reglas firestore desplegadas y testeadas
[ ] GR-10: build < 60s tras anadir paginas nuevas
[ ] GR-11: cero empleos/viviendas/productos ficticios; solo contenido real de usuarios verificados
[ ] GR-12: ofertas vinculadas a negocios reutilizan datos Google Maps verificados
```

---

_Documento de planificacion creado bajo el sistema multi-agente de Servicios Mallorca. Revisar al cierre de cada fase._
