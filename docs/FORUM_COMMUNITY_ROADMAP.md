# Roadmap Foro y Comunidad — Servicios Mallorca

> **Documento maestro de planificacion** para la evolucion del foro comunitario hacia una plataforma hyperlocal con la **Bolsa de Trabajo** como categoria principal.
>
> Este documento define la taxonomia de categorias, la especificacion detallada de la bolsa de empleo, el modelo de datos, la integracion con monetizacion y el plan de implementacion por fases.

---

## Indice

1. Vision y Objetivos Estrategicos
2. Estado Actual del Foro (lo que ya existe)
3. Taxonomia Propuesta: 5 Categorias Principales
4. Bolsa de Trabajo — Especificacion Detallada (PRINCIPAL)
5. Modelo de Datos Firestore (Evolucion)
6. Integracion con Monetizacion AdSense
7. Requisitos i18n (GR-04)
8. Moderacion y Seguridad
9. Plan de Implementacion por Fases (F1-F5)

---

## 1. Vision y Objetivos Estrategicos

El foro pasa de ser un apendice conversacional a ser el **motor de retencion diaria** de la plataforma. Un usuario que consulta la bolsa de trabajo vuelve cada dia; un usuario que vuelve cada dia multiplica las impresiones de anuncios.

### 1.1 Objetivos medibles

|| Objetivo | Metrica | Target Fase 2 |
|| ------------------------------------- | ------------------------------ | -------------- |
|| Habito diario | Usuarios recurrentes semanales | 40%+ del total |
|| Contenido generado por usuarios (UGC) | Temas nuevos/semana | 25+ |
|| Bolsa de trabajo activa | Ofertas activas simultaneas | 50+ |
|| Profundidad | Respuestas por tema | 5+ media |
|| SEO por UGC | Paginas de tema indexadas | 500+ |

---

## 2. Estado Actual del Foro (lo que ya existe)

|| Componente | Estado | Ubicacion |
|| -------------------------------------------------- | ----------- | ------------------------------------------- |
|| Listado de temas con filtro por categoria | Funcional | src/pages/[...locale]/comunidad/index.astro |
|| Creacion de temas (auth requerida) | Funcional | comunidad/nuevo.astro |
|| Detalle de tema con respuestas | Funcional | comunidad/[slug].astro |
|| Sistema de likes en temas | Funcional | toggleTopicLike() |
|| Respuestas anidadas planas (1 nivel) | Funcional | addForumReply() |
|| Contadores repliesCount/likesCount | Funcional | Firestore increment |
|| Reglas Firestore (lectura publica, escritura auth) | Desplegadas | firestore.rules sec. forum_topics |
|| Tests unitarios del modulo | Funcionales | tests/unit/community.test.ts |

---

## 3. Taxonomia Propuesta: 5 Categorias Principales

### 3.1 Tabla resumen

|| # | Categoria | id | Icono | Subcategorias | Potencial retencion |
|| --- | -------------------------------- | ------------- | ----- | ----------------------------------------------------------- | -------------------------- |
|| 1 | **Bolsa de Trabajo** | empleo | 💼 | ofertas / solicitudes | MUY ALTO (consulta diaria) |
|| 2 | **Formacion y Cursos** | formacion | 🎓 | profesionales / idiomas / hosteleria / oficios / tecnologia | MEDIO-ALTO (estacional) |
|| 3 | **Servicios e Intercambios** | intercambios | 🤝 | trueque / habilidades / colaboracion / ayuda mutua | ALTO (recurrente) |
|| 4 | **Turismo y Experiencias** | turismo | 🏝️ | recomendaciones / experiencias / guias / rutas | MEDIO-ALTO (evergreen) |
|| 5 | **Emprendimiento y Networking** | emprendimiento| 💼 | socios / networking / consejos / oportunidades | MEDIO (eventual) |

### 3.2 Justificacion de cada categoria

#### 3.2.1 Bolsa de Trabajo (PRINCIPAL)

La economia mallorquina combina turismo estacional masivo, construccion, hosteleria y servicios con alta rotacion de personal. Hay demanda doble: empresas que no encuentran personal y trabajadores que buscan empleo o encargos puntuales.

- **Ofertas**: negocios verificados del directorio publican vacantes -> sinergia directa con GR-12 y el rol manager existente
- **Solicitudes**: personas ofrecen su perfil o buscan encargos (gig economy: fontanero por horas, camarero fin de semana)
- Reutiliza CATEGORIES (sectores) y MALLORCA_ZONES de src/data/ para filtros coherentes

#### 3.2.2 Formacion y Cursos

Alta demanda de formacion continua en Mallorca, especialmente en hosteleria/turismo, idiomas (aleman, ingles para trabajadores extranjeros) y reciclaje profesional. Subcategorias: cursos profesionales, idiomas, hosteleria/turismo, oficios, tecnologia.

#### 3.2.3 Servicios e Intercambios

Economia colaborativa creciente, especialmente en zonas rurales de Mallorca. Trueque de servicios, intercambio de habilidades, colaboracion vecinal y ayuda mutua. Potencial alto de interacciones recurrentes.

#### 3.2.4 Turismo y Experiencias

Aprovecha el expertise local para contenido valioso: recomendaciones de lugares, experiencias turisticas autenticas, guias locales y rutas secretas. Contenido evergreen que atrae tanto turistas como residentes.

#### 3.2.5 Emprendimiento y Networking

Mallorca tiene ecosistema emprendedor activo pero fragmentado. Busqueda de socios, networking empresarial, consejos para emprendedores y oportunidades de negocio. Retencion media pero alto valor cualitativo.

### 3.3 Tipos TypeScript (propuesta F1)

```typescript
// src/lib/community.ts
export type ForumCategory =
  // nuevas principales
  | "empleo"
  | "formacion"
  | "intercambios"
  | "turismo"
  | "emprendimiento"
  // legacy (solo lectura progresiva)
  | "recomendaciones"
  | "preguntas"
  | "experiencias"
  | "guias"
  | "todas";
```

---

## 4. Bolsa de Trabajo — Especificacion Detallada (PRINCIPAL)

### 4.1 Tipos de publicacion

|| Tipo | id | Quien publica | Verificacion |
|| ----------------------------- | ------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
|| **Oferta de empleo** | oferta | Empresas y particulares que buscan trabajador | Badge Empresa Verificada si el autor es manager de un negocio verificado del directorio |
|| **Solicitud / Busco trabajo** | demanda | Personas que buscan empleo u ofrecen servicios puntuales | Cuenta autenticada; badge opcional Perfil Completo |

### 4.2 Esquema de datos (TypeScript)

```typescript
// src/lib/jobs.ts (propuesta F2)
export type JobKind = "oferta" | "demanda";

export type JobContractType =
  "indefinido" | "temporal" | "media-jornada" | "practicas" | "por-encargo" | "sin-especificar";

export interface JobMeta {
  kind: JobKind;
  sector: string; // id de CATEGORIES existente
  zone: string; // id de MALLORCA_ZONES existente
  contractType: JobContractType;
  salaryRange?: string;
  experienceRequired?: boolean;
  applyWhatsApp?: string; // E.164 validado
  applyEmail?: string;
  applyUrl?: string;
}

// forum_topics se amplia con campo opcional:
// jobMeta?: JobMeta   (presente solo si category === "empleo")
```

### 4.3 Ciclo de vida y expiracion (compatible Firebase Spark)

```text
[Publicar] -> status: active, expiresAt = createdAt + 30 dias
Query SIEMPRE filtra: status == active AND expiresAt > now()
[Autor] puede renovar (+30d) o archivar manualmente
[Purga RGPD] documentos archived > 90 dias: borrado manual mensual
```

---

## 5. Modelo de Datos Firestore (Evolucion)

### 5.1 Indices compuestos requeridos

|| Query | Indice |
|| -------------------------- | ---------------------------------------------------------- |
|| Bolsa activa por categoria | category ASC + status ASC + expiresAt ASC + createdAt DESC |
|| Mis temas | authorUid ASC + createdAt DESC |
|| Feed general existente | category ASC + createdAt DESC (ya existe) |

### 5.2 Reglas de seguridad (delta propuesto)

```text
match /forum_topics/{topicId} {
  allow read: if true;
  allow create: if isSignedIn()
    && request.resource.data.authorUid == request.auth.uid
    && ((request.resource.data.category != 'empleo')
        || (request.resource.data.jobMeta.kind in ['oferta','demanda']
            && request.resource.data.jobMeta.sector is string
            && request.resource.data.jobMeta.zone is string));
  allow update, delete: if isOwner() || isAdmin();
}
```

---

## 6. Integracion con Monetizacion AdSense

|| Efecto | Mecanismo | Estimacion |
|| -------------------- | ----------------------------------------- | ------------------------------------------ |
|| Frecuencia de visita | Consulta diaria de ofertas nuevas | +30-50% sesiones/semana por usuario activo |
|| Paginas por sesion | Listado -> detalle -> relacionados | +1.5 paginas |
|| Impresiones nuevas | In-feed ads dentro de listados de empleo | slot cada 5 anuncios |
|| Contenido indexable | Cada oferta = pagina unica con Schema.org | +500 URLs SEO a medio plazo |

---

## 7. Requisitos i18n (GR-04)

```text
forum.cat.empleo / formacion / intercambios / turismo / emprendimiento
forum.cat.empleo.desc ... (descripcion corta de categoria)
jobs.kind.oferta / jobs.kind.demanda
jobs.form.title / sector / zone / contract / salary / apply
```

---

## 8. Moderacion y Seguridad

- Auth obligatoria para publicar
- Filtro lexico F2 para palabras clave prohibidas
- Reporte comunitario -> cola admin
- Primeros posts en revision
- RGPD: prohibido DNI/NIE completo, direccion exacta, datos bancarios

---

## 9. Plan de Implementacion por Fases

|| Fase | Accion | Prioridad |
|| ---- | ------ | --------- |
|| F1 | Implementar taxonomia 5 categorias + tipos TypeScript | Alta |
|| F2 | Bolsa de trabajo: jobMeta, validacion, expiracion | Alta |
|| F3 | Interfaz publica: filtros, listado, detalle | Alta |
|| F4 | Moderacion: reportes, admin panel | Media |
|| F5 | Optimizacion SEO + Schema.org para ofertas | Media |

---

**Estado del documento:** ✅ Version optimizada 5 categorías
**Última actualización:** 2025-01-09
