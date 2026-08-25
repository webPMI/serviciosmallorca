# 🚀 Taxonomía de Escalado Completo — Todos los Negocios de Mallorca

> **Mapa de crecimiento masivo.** Proyección exhaustiva de la taxonomía para cubrir **miles de negocios reales** de Mallorca, más allá de las 7 categorías iniciales.
>
> **Fuente de verdad de clasificación:** `docs/TAXONOMY.md` (sistema conceptual, 4 niveles y convenciones). Este documento proyecta **QUÉ** categorías y tipos de servicio debe soportar el sistema para escalar, pero **NO activa** nada en `src/data/` hasta que cada categoría tenga negocios reales verificados (**GR-11** / **GR-12**).

| Referencia             | Detalle                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Sistema conceptual** | [docs/TAXONOMY.md](TAXONOMY.md)                                                                                                 |
| **Reglas**             | GR-06, GR-04, GR-08, GR-11, GR-12                                                                                               |
| **Enfoque de datos**   | Basado en Clasificación CNAE y la Clasificación de Distribución Internacional CCAE, adaptado al tejido económico insular balear |

---

## 1. Por qué es necesario este mapa de escalado

Las **7 categorías actuales** cubren solo una fracción del tejido empresarial mallorquín (reformas, náutica, salud, gastronomía, motor, servicios profesionales y arte). Mallorca, como economía turística de altísima densidad, agrupa actividad en **~20 macrodóminios** con **~200 categorías** y **miles de tipos de negocio**:

| Escenario                 | Categorías activas | Tipos de servicio | Negocios modelables |
| ------------------------- | ------------------ | ----------------- | ------------------- |
| Actual                    | 7                  | ~44               | ~30 verificados     |
| **Proyectado (este doc)** | **~200**           | **~4.000+**       | **miles reales**    |

> El objetivo no es llenar la web con categorías vacías, sino disponer del **esquema completo** para ir activando categorías a medida que se curan negocios reales (P-04 de `TAXONOMY.md`, GR-11).

---

## 2. Metodología de proyección

1. **Inventario económico:** se lista toda la actividad económica de Mallorca usando CNAE a 2 dígitos + subsectores turísticos locales.
2. **Agrupación en 20 super-sectores** (nivel 1) que ya existen como `Sector` en la taxonomía.
3. **Descomposición en categorías** (nivel 2) y **tipos de servicio** (nivel 3).
4. **Priorización por densidad turística y demanda** (los super-sectores turísticos escalan primero).
5. **Revisión de gobernanza:** toda categoría se activa solo con negocios verificados.

---

## 3. Mapa de Super-Sectores (Nivel 1)

Resumen de los 20 dominios macroeconómicos:

| Código | Super-sector                             | Categorías | Prioridad           |
| ------ | ---------------------------------------- | ---------- | ------------------- |
| SS-01  | 🍽️ Hostelería & Gastronomía              | 8          | 🔴 Alta (turística) |
| SS-02  | 🏨 Alojamiento & Turismo                 | 8          | 🔴 Alta             |
| SS-03  | 🏗️ Construcción, Reformas & Inmobiliario | 13         | 🔴 Alta             |
| SS-04  | ⛵ Náutica & Actividades Marítimas       | 8          | 🔴 Alta             |
| SS-05  | 🧬 Salud, Bienestar & Belleza            | 12         | 🔴 Alta             |
| SS-06  | 🚗 Movilidad, Motor & Transporte         | 10         | 🟠 Media-alta       |
| SS-07  | 💼 Servicios Profesionales & Empresa     | 13         | 🟠 Media-alta       |
| SS-08  | 🛍️ Retail, Moda & Comercio               | 9          | 🟠 Media-alta       |
| SS-09  | 🎓 Educación & Formación                 | 8          | 🟡 Media            |
| SS-10  | 🎭 Entretenimiento, Cultura & Ocio       | 9          | 🟡 Media            |
| SS-11  | ⚽ Deportes & Aire Libre                 | 9          | 🟠 Media-alta       |
| SS-12  | 🧹 Hogar, Limpieza & Mantenimiento       | 8          | 🟠 Media-alta       |
| SS-13  | 🐾 Mascotas & Veterinaria                | 6          | 🟡 Media            |
| SS-14  | 🌾 Agricultura & Productores Locales     | 8          | 🟡 Media            |
| SS-15  | 🏺 Artesanía, Manufactura & Piedra       | 7          | 🟢 Nicho            |
| SS-16  | 💻 Tecnología, Telecom & Digital         | 6          | 🟠 Media-alta       |
| SS-17  | 🏡 Bienes Raíces (detalle)               | 6          | 🔴 Alta             |
| SS-18  | 🤝 Servicios Sociales & Asistencia       | 5          | 🟡 Media            |
| SS-19  | 🛡️ Seguridad & Emergencias               | 4          | 🟡 Media            |
| SS-20  | 💰 Finanzas & Seguros                    | 4          | 🟡 Media            |

---

## 4. Taxonomía Detallada por Super-Sector (proyección completa)

> Cada categoría aparece como posible `category` futura en `src/data/categories.ts`. Los "tipos de negocio" alimentan el campo `servicesProvided` y el catálogo de tipos (`TAXONOMY.md` §4.3).

### SS-01 — 🍽️ Hostelería & Gastronomía

| Categoría (id propuesto)   | Tipos de negocio / servicios                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `restaurantes`             | Cocina mallorquina · parrilla/barbacoa · marina/bay · fusión · italiano · asiático · gastronómico (estrella) · vegetariano/vegano · marisquería |
| `bares-cafeterias`         | Cafetería de especialidad · brunch · cocktail bar · pub irlandés · tetería · cafetería de playa                                                 |
| `chiringuitos-beach-clubs` | Beach club · chiringuito de playa · chill out · club de día                                                                                     |
| `catering-eventos`         | Catering para bodas · catering corporativo · food truck · catering a domicilio                                                                  |
| `chef-privado`             | Chef a domicilio en villa · chef privado yates · showcooking · cursos de cocina                                                                 |
| `bodegas-catas`            | Bodega mallorquina · cata de vinos · enoturismo · vermutería · destilería/craft gin                                                             |
| `panaderias-reposteria`    | Obrador de pan · pastelería · ensaimadas tradicionales · heladería artesana · turrón                                                            |
| `street-food`              | Food truck · mercado gastronómico (sineu/olivar) · kebab/gourmet                                                                                |

### SS-02 — 🏨 Alojamiento & Turismo

| Categoría (id propuesto) | Tipos de negocio / servicios                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `hotels-resorts`         | Hotel urbano · hotel boutique · all-inclusive · adult only · hotel rural (posada)                          |
| `villas-apartamentos`    | Villa privada de lujo · apartamento turístico · agroturismo · boutique resort                              |
| `albergues-hostales`     | Hostal · albergue juvenil · guest house                                                                    |
| `campings-glamping`      | Camping · glamping · bungalow park                                                                         |
| `agencias-viajes`        | Agencia emisora · touroperador · agencia online · travel designer                                          |
| `guies-excursions`       | Guía turístico · guía de montaña · free tour · excursión privada                                           |
| `activitats-turisme`     | Visitas guiadas · tours gastronómicos · tour en segway · talleres locales · caza de tesoros (teambuilding) |
| `tours-experiencies`     | Sunset sailing · viaje en globo · paseo en helicóptero · safari 4x4 · ruta en catamarán                    |

### SS-03 — 🏗️ Construcción, Reformas & Inmobiliario

| Categoría (id propuesto) | Tipos de negocio / servicios                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `reformas-integrals`     | Reforma integral de vivienda · rehabilitación · cambio de uso · obra nueva                                |
| `fontaneria`             | Fontanería general · calefacción · desatascos · instalación de gas                                        |
| `electricitat`           | Electricista · instalaciones eléctricas · domótica · iluminación profesional                              |
| `climatitzacio`          | Aire acondicionado · aerotermia · ventilación · frío industrial                                           |
| `fusteria-carpinteria`   | Carpintería · ebanistería · cocinas a medida · puertas y ventanas                                         |
| `pintura-decoracio`      | Pintor · empapelado · estuco veneciano · pintura decorativa · revestimientos                              |
| `paletes-obres`          | Albañilería · mampostería · colocación de solados · estructura/hormigón                                   |
| `piscines-jardins`       | Construcción de piscinas · mantenimiento de piscinas · jardinería · riego automático · piscinas naturales |
| `energia-solar`          | Placas solares · autoconsumo · certificación energética · bomba de calor                                  |
| `immobiliaries`          | Compraventa · alquiler residencial · alquiler vacacional · inversión                                      |
| `gestors-patrimoni`      | Property manager · community manager fincas · administradores de fincas                                   |
| `arquitectes-enginyers`  | Arquitecto · aparejador · ingeniero de obra · interiorista · topógrafo                                    |
| `instaladors-oficis`     | Instalación de placas · carpintería metálica · cerrajería · instalación de alarmas                        |

### SS-04 — ⛵ Náutica & Actividades Marítimas

| Categoría (id propuesto) | Tipos de negocio / servicios                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `xarter-barc`            | Chárter de velero · chárter de catamarán · chárter de lancha · chárter sin patrón         |
| `iots-luxe`              | Yate de motor · megayate · chárter de lujo con tripulación · broker de yates              |
| `escoles-nautiques`      | Escuela de vela · curso de patrón · PNB · PER · escuela de motonáutica                    |
| `astillers-manteniment`  | Astillero · varadero · mantenimiento de motores marinos · limpieza de casco · antifouling |
| `marines-amarrers`       | Puerto deportivo · marina · alquiler de amarre · consignatario                            |
| `excursions-maritimes`   | Excursión en barco · viajes a Cabrera · sunset cruise · paseo en golondrina               |
| `fishing-xarter`         | Chárter de pesca deportiva · pesca con mosca · pesca al curricán                          |
| `busseig-aquatics`       | Centro de buceo · snorkel · bautismo de buceo · kayak · paddle surf · moto de agua        |

### SS-05 — 🧬 Salud, Bienestar & Belleza

| Categoría (id propuesto) | Tipos de negocio / servicios                                                        |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `cliniques-mediques`     | Clínica médica · medicina general · especialidades · análisis clínicos              |
| `cliniques-dentals`      | Clínica dental · ortodoncia · implantes · estética dental                           |
| `fisioterapia`           | Fisioterapia · osteopatía · quiropráctica · rehabilitación deportiva · quiromasaje  |
| `salut-mental`           | Psicólogo · psiquiatra · terapia de pareja · coaching                               |
| `spas-benestar`          | Spa · balneario · circuito de aguas · masajes · rituales                            |
| `nutricio`               | Dietista · nutricionista · asesoría nutricional · intolerancias                     |
| `medicina-estetica`      | Medicina estética · rellenos · bótox · depilación láser · mesoterapia               |
| `perruqueries-barberies` | Peluquería unisex · barbería · peinados de evento · tratamiento capilar · extensión |
| `centres-estetica`       | Centro de estética · manicura/pedicura · maquillaje · cejas/pestañas · bronceado    |
| `tatuatges-piercing`     | Estudio de tatuaje · piercing · tattoo realismo · fine line · cover-up              |
| `farmacies`              | Farmacia · parafarmacia · ortopedia · herbolario                                    |
| `centres-optica`         | Óptica · audiología · contactología                                                 |

### SS-06 — 🚗 Movilidad, Motor & Transporte

| Categoría (id propuesto) | Tipos de negocio / servicios                                                            |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `transfers-aeroport`     | Transfer aeropuerto PMI · transfer puerto · servicio puerta a puerta · grupo/banquetes  |
| `xofers-privats`         | Chófer privado · limusina · VTC ejecutivo · seguridad personal / escolta                |
| `lloguer-cotxes`         | Alquiler de coches · alquiler de lujo · alquiler de furgonetas · alquiler 4x4 · renting |
| `lloguer-motos-quads`    | Alquiler de motos · scooters · quads · buggies                                          |
| `tallers-mecanics`       | Taller mecánico · chapa y pintura · neumáticos · eléctricos / híbridos · diagnosis      |
| `concessionaris`         | Concesionario oficial · venta de ocasión · compraventa · renting                        |
| `transport-mercaderies`  | Transporte de mercancías · mudanzas · paquetería · distribución última milla            |
| `taxis-vtc`              | Taxi de Palma · taxi aeropuerto · VTC · radio taxi                                      |
| `mobilitat-electrica`    | Punto de recarga · venta e-motos · patinetes eléctricos · servicios de carsharing       |
| `bicicletes`             | Alquiler de bicicletas · e-bikes · taller de bicis · rutas en bici                      |

### SS-07 — 💼 Servicios Profesionales & Empresa

| Categoría (id propuesto)   | Tipos de negocio / servicios                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `advocats`                 | Abogado · bufete de abogados · laboralista · mercantilista · extranjería · penal           |
| `notaries-registres`       | Notaría · registro de la propiedad · gestorías administrativas                             |
| `gestories`                | Gestoría fiscal · asesoría laboral · contabilidad · legalización de sociedades             |
| `assessors-internacionals` | Asesoría internacional · expat tax · fiscalidad no residentes · golden visa                |
| `inbound-estrategia`       | Consultoría estratégica · consultoría de negocio · intermediación comercial                |
| `marketing-publicitat`     | Agencia de marketing · publicidad · SEO/SEM · community management · branding              |
| `disseny-grafic`           | Diseño gráfico · diseño de packaging · identidad corporativa · ilustración                 |
| `fotografia-video`         | Fotógrafo de bodas · estudio de fotografía · producción de vídeo · drone / aéreo · retoque |
| `auditoria-consultoria`    | Auditoría de cuentas · consultoría fiscal-pericial · due diligence                         |
| `seguros`                  | Corredor de seguros · agencia de seguros · mediador · prestación de salud                  |
| `recursos-humans`          | ETT · headhunting · selección de personal · formación laboral                              |
| `traduccio-idiomes`        | Traducción oficial (jurada) · interpretación · agencia de idiomas                          |
| `desenvolupament-web`      | Agencia web · desarrollo a medida · e-commerce · aplicaciones móviles · cloud              |

### SS-08 — 🛍️ Retail, Moda & Comercio

| Categoría (id propuesto)   | Tipos de negocio / servicios                                                            |
| -------------------------- | --------------------------------------------------------------------------------------- |
| `moda-textil`              | Tienda de ropa · moda de lujo · boutique · ropa de segunda mano · marcaje/estampación   |
| `calçat-complements`       | Zapatería · complementos · bolsos · marroquinería                                       |
| `joieries-rellotgeries`    | Joyería · relojería · platería · reparación de joyas                                    |
| `electronica`              | Tienda de electrónica · móviles · reparación de móviles · videojuegos                   |
| `alimentacio-supermercats` | Supermercado · mercado municipal · tienda de delicatessen · colmado gourmet · panadería |
| `interior-llar`            | Tienda de decoración · mobiliario · textil hogar · iluminación · menaje                 |
| `floristeries-jardineria`  | Floristería · plantas y jardinería · tienda de bonsáis                                  |
| `llibres-papereria`        | Librería · papelería · imprenta · regalo                                                |
| `esportiu-outdoor`         | Tienda de deporte · outdoor · surf shop · ciclismo · fitness                            |

### SS-09 — 🎓 Educación & Formación

| Categoría (id propuesto) | Tipos de negocio / servicios                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `colegis-guarderis`      | Colegio concertado · internacional · guardería / escuela infantil · actividades extraescolares |
| `academies-idiomes`      | Academia de inglés · de alemán · de español para extranjeros · preparación de exámenes         |
| `academies-reforç`       | Academia de refuerzo · clases particulares · apoyo escolar                                     |
| `formacio-online`        | Cursos online · formación profesional · bootcamp · certificaciones                             |
| `autoescoles`            | Autoescuela · clases de conducir · recuperación de puntos                                      |
| `escoles-musica-art`     | Academia de música · clases de guitarra/piano · escuela de teatro · clases de pintura          |
| `esports-formatius`      | Escuela de fútbol · escuela de tenis · campus deportivos · escuela de natación                 |
| `escoles-oficis`         | Formación profesional oficial · escuela de hostelería · escuela de pilotos                     |

### SS-10 — 🎭 Entretenimiento, Cultura & Ocio

| Categoría (id propuesto) | Tipos de negocio / servicios                                                         |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `events-bodas`           | Organizador de bodas · wedding planner · empresa de eventos · celebraciones privadas |
| `decoracio-events`       | Decoración floral · montaje de eventos · carpas y mobiliario · iluminación de evento |
| `animacio-musica`        | DJ · música en directo · banda · espectáculo flamenco · mago/animador infantil       |
| `pirotecnia`             | Fuegos artificiales · castillos pirotécnicos · espectáculo de luces                  |
| `cine-teatre`            | Cine · teatro · auditorio · sala de conciertos                                       |
| `parcs-attraccions`      | Parque acuático · parque de atracciones · parques temáticos · minigolf               |
| `experiencies-cultura`   | Museo · galería de arte · ruta cultural · talleres de arte · patrimonio              |
| `esports-oci`            | Gaming center · sala de escape · laser tag · realidad virtual · bowling              |
| `nightlife`              | Discoteca · sala de fiestas · pub de copas · club nocturno                           |

### SS-11 — ⚽ Deportes & Aire Libre

| Categoría (id propuesto) | Tipos de negocio / servicios                                                          |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `gimnasos-box`           | Gimnasio · box crossfit · estudio de fitness · pilates/yoga · entrenamiento funcional |
| `personal-training`      | Entrenador personal · coach de bienestar · preparación física · online coach          |
| `esports-aqua`           | Deportes acuáticos · surf · windsurf · kitesurf · wakeboard · jet ski                 |
| `senderisme-trekking`    | Ruta de senderismo · trekk por la Tramuntana · guía de montaña · trail                |
| `golf`                   | Campo de golf · club de golf · escuela de golf · pitch & putt                         |
| `cicloturisme`           | Ruta en bici · club ciclista · gravel · MTB · alquiler con guía                       |
| `equitacio`              | Centro ecuestre · escuela de hípica · rutas a caballo · horse resort                  |
| `padel-tenis`            | Pista de pádel · club de tenis · escuela de pádel · alquiler de pista                 |
| `esports-aventura`       | Tirolina · escalada · rafting · puenting · quad · paintball · disc golf               |

### SS-12 — 🧹 Hogar, Limpieza & Mantenimiento

| Categoría (id propuesto) | Tipos de negocio / servicios                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `neteja-llar`            | Limpieza doméstica · empresa de limpieza · limpieza de fin de obra · planchado           |
| `neteja-professional`    | Limpieza de oficinas · de comunidades · industrial · de piscinas                         |
| `control-plagues`        | Eliminación de plagas · fumigación · termitas · roedores                                 |
| `mudances-flegates`      | Mudanza · flete · transporte de mobiliario · guardamuebles                               |
| `seguretat-llar`         | Instalación de alarmas · videovigilancia · cerrajería · cajas fuertes                    |
| `reparacions-llar`       | Handyman · reparación de electrodomésticos · reparación de muebles · cristalero          |
| `jardineria-paisatgisme` | Mantenimiento de jardín · paisajismo · poda · riego automático · diseño de exteriores    |
| `gestio-residus`         | Recogida de residuos · alquiler de contenedor · gestor de residuos · limpieza de solares |

### SS-13 — 🐾 Mascotas & Veterinaria

| Categoría (id propuesto) | Tipos de negocio / servicios                                            |
| ------------------------ | ----------------------------------------------------------------------- |
| `cliniques-veterinaries` | Clínica veterinaria · hospital veterinario · centros de urgencias       |
| `botigues-mascotes`      | Tienda de mascotas · pet shop · alimentación especializada · accesorios |
| `estetica-mascotes`      | Peluquería canina · grooming · spa para mascotas                        |
| `passigadors-guarderis`  | Paseador de perros · guardería canina · pet sitting                     |
| `ensinistrament`         | Adiestramiento canino · educación canina · consultor de conducta        |
| `proteccions-adopcions`  | Protectora de animales · asociación de rescate · adopción · refugio     |

### SS-14 — 🌾 Agricultura & Productores Locales

| Categoría (id propuesto) | Tipos de negocio / servicios                                                |
| ------------------------ | --------------------------------------------------------------------------- |
| `vinyes-bodegues`        | Bodega · viñedo · productor de vino de Mallorca · cellar cooperativa        |
| `oli-olivareres`         | Productor de aceite · molino de aceite · almazaras · DOP Oli de Mallorca    |
| `productes-mallorquins`  | Ensaimades · sobrasada · embutido · queso mahonés · productor gourmet       |
| `mercats-productors`     | Mercado de productores · mercado local · cesta de la huerta · venta directa |
| `fruites-hortalisses`    | Finca agrícola · huerta ecológica · frutería de km 0 · invernaderos         |
| `ramaderies-granges`     | Ganadería · granja · quesería · avícola                                     |
| `apicultura-mel`         | Apicultor · productor de miel · productos de la colmena                     |
| `jardineria-viuers`      | Vivero · cultivo de plantas · flor cortada · árboles frutales               |

### SS-15 — 🏺 Artesanía, Manufactura & Piedra

| Categoría (id propuesto) | Tipos de negocio / servicios                                               |
| ------------------------ | -------------------------------------------------------------------------- |
| `pedra-mallorquina`      | Cantería · piedra de Santanyí · piedra de Binissalem · artesanía en piedra |
| `ceramica-alfareria`     | Cerámica · alfarería · azulejería artesanal · talleres de cerámica         |
| `vidre-artesanal`        | Vidrio soplado · vitrales · taller de vidrio                               |
| `textil-tradicional`     | Encaje de Mallorca (lènyes) · tejidos tradicionales · bordados             |
| `mobles-artesans`        | Ebanistería artesanal · mueble rústico · forja · herrería artística        |
| `impressio-serigrafia`   | Imprenta · serigrafía · grabado · artes gráficas                           |
| `orfebreria-joieria`     | Orfebre · joyería artesanal · esmalte · diseño de joyas                    |

### SS-16 — 💻 Tecnología, Telecom & Digital

| Categoría (id propuesto)     | Tipos de negocio / servicios                                                     |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `desenvolupament-programari` | Desarrollo de software · desarrollo web · aplicaciones · SaaS · ERP              |
| `marketing-digital`          | Agencia digital · SEO/SEM · social media · email marketing · analítica           |
| `reparacio-dispositius`      | Reparación de móviles · ordenadores · tablets · consolas · recuperación de datos |
| `telecomunicacions`          | Operador de fibra · instalación de redes · telefonía · WiFi profesional          |
| `ciberseguretat`             | Consultoría de ciberseguridad · auditoría · protección de datos (GDPR)           |
| `streaming-media`            | Producción audiovisual · streaming · podcast · fotografía 360 / VR               |

### SS-17 — 🏡 Bienes Raíces (detalle)

| Categoría (id propuesto) | Tipos de negocio / servicios                                                           |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `compravenda-propietats` | Compraventa de vivienda · de fincas · de locales · de suelo · de activos prime         |
| `lloguer-residencial`    | Alquiler residencial · de larga estancia · de temporada · alquiler con opción a compra |
| `lloguer-vacacional`     | Alquiler vacacional · gestión Airbnb · property manager turístico · check-in service   |
| `gestio-patrimonial`     | Family office · gestión patrimonial · inversión inmobiliaria · due diligence           |
| `taxacions`              | Tasación hipotecaria · peritaje · valoración                                           |
| `promocio-inmobiliaria`  | Promotor inmobiliario · desarrollo de proyectos · obra nueva · broker de inversión     |

### SS-18 — 🤝 Servicios Sociales & Asistencia

| Categoría (id propuesto) | Tipos de negocio / servicios                                                        |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `cures-persones`         | Ayuda a domicilio · cuidado de mayores · acompañamiento · respiro familiar          |
| `cangurs-nens`           | Canguro · niñera · au pair · guardería de noche                                     |
| `dependencia`            | Centros de día · residencia de mayores · atención a dependientes                    |
| `sanitaris-domicili`     | Enfermería a domicilio · fisioterapia a domicilio · rehabilitación · teleasistencia |
| `integracio-social`      | ONG · asociaciones · servicios de integración · voluntariado                        |

### SS-19 — 🛡️ Seguridad & Emergencias

| Categoría (id propuesto) | Tipos de negocio / servicios                                       |
| ------------------------ | ------------------------------------------------------------------ |
| `empreses-seguretat`     | Vigilancia de seguridad · seguridad en eventos · seguridad en obra |
| `investigacio-privada`   | Detective privado · investigación · localización de personas       |
| `proteccio-civil`        | Emergencias · rescate · coordinación de emergencias                |
| `seguretat-msi`          | Seguridad marítima · guardia de puerto · seguridad en yates        |

### SS-20 — 💰 Finanzas & Seguros

| Categoría (id propuesto) | Tipos de negocio / servicios                                                     |
| ------------------------ | -------------------------------------------------------------------------------- |
| `assessors-financers`    | Asesor financiero · private banking · planificación patrimonial · mesa de dinero |
| `mitjans-assegurances`   | Correduría de seguros · mediador · gestor de siniestros · aseguradora            |
| `hipoteques-financacio`  | Broker hipotecario · financiación · préstamos · consolidación de deudas          |
| `banca-privada`          | Oficina bancaria · banca privada · family office · gestión de tesorería          |

---

## 5. Cardinalidad Proyectada por Super-Sector

> Estimación orientativa del número real (no ficticio) de negocios potenciales en Mallorca por dominio, basada en densidad empresarial insular (INE / Registro Mercantil / directorios locales públicos). **Cifras de planificación, no de datos publicados.**

| Super-sector              | Categorías | Tipos      | Negocios potenciales (Mallorca) |
| ------------------------- | ---------- | ---------- | ------------------------------- |
| Hostelería & Gastronomía  | 8          | 60+        | 2.500+                          |
| Alojamiento & Turismo     | 8          | 55+        | 1.200+                          |
| Construcción & Reformas   | 13         | 90+        | 1.800+                          |
| Náutica                   | 8          | 55+        | 700+                            |
| Salud & Bienestar         | 12         | 85+        | 1.400+                          |
| Movilidad & Motor         | 10         | 70+        | 1.100+                          |
| Servicios Profesionales   | 13         | 90+        | 1.900+                          |
| Retail & Comercio         | 9          | 65+        | 2.000+                          |
| Educación                 | 8          | 50+        | 400+                            |
| Entretenimiento & Ocio    | 9          | 60+        | 500+                            |
| Deportes & Aire Libre     | 9          | 65+        | 800+                            |
| Hogar & Mantenimiento     | 8          | 55+        | 600+                            |
| Mascotas                  | 6          | 35+        | 250+                            |
| Agricultura & Productores | 8          | 50+        | 350+                            |
| Artesanía & Piedra        | 7          | 45+        | 200+                            |
| Tecnología & Digital      | 6          | 40+        | 700+                            |
| Bienes Raíces             | 6          | 40+        | 600+                            |
| Servicios Sociales        | 5          | 35+        | 300+                            |
| Seguridad                 | 4          | 25+        | 150+                            |
| Finanzas & Seguros        | 4          | 30+        | 250+                            |
| **TOTAL**                 | **~160**   | **~1.100** | **≈ 18.000 potenciales**        |

> **Lectura honesta:** NO se pretende publicar 18.000. Es el **techo de planificación** (volumen total de actividad económica de la isla). El ritmo real lo marca el protocolo de curación (5 servicios/día → ~1.800/año) y la verificación (GR-11/GR-12). Con la **muestra real de Google Maps** de Mallorca (más de 50.000 comercios indexados), el techo es incluso superior.

---

## 6. Cómo se activa este escalado (sin romper el sistema)

Todo el crecimiento respeta `TAXONOMY.md` §9 (migración no destructiva). Fases de activación de esta proyección:

| Fase  | Acción                                                                                      | Qué toca                                 |
| ----- | ------------------------------------------------------------------------------------------- | ---------------------------------------- |
| SC-F1 | Asignar a cada categoría nueva su `sectorId` del nivel 1 (ya definido §4)                   | solo documentación                       |
| SC-F2 | Activar categorías de SS-01..SS-05 (las prioritarias) con sus primeros negocios verificados | `src/data/categories.ts` + `services.ts` |
| SC-F3 | Crear el catálogo global de tipos (`servicesProvided`) como `.ts` con ids i18n              | `src/data/serviceTypes.ts`               |
| SC-F4 | Activar el resto de super-sectores por oleadas según demanda SEO                            | `services.ts` + tests                    |
| SC-F5 | Automatizar la generación del mapa de categorías (sitemap dinámico) y facetas de filtro     | `pages/` + i18n                          |

**Regla innegociable:** una categoría del mapa **solo se activa** cuando existe al menos **1 negocio real verificado** que la ocupe (P-04 + GR-11). Nunca se publica una categoría vacía.

---

## 7. Relación con el resto de la documentación

- **`TAXONOMY.md`** — sistema conceptual, convenciones, modelo `ServiceItem`, tags y migración.
- **`WORKFLOW_CURATION.md`** — cómo se curan los 5 negocios/día (asignándoles su categoría de este mapa).
- **`SCALABILITY_AND_ARCHITECTURE.md`** — fases de crecimiento del pipeline (0→200→1.000+).
- **`ARCHITECTURE.md`** — estructura de `src/data/` y esquema Firestore.
- **`GOLDEN_RULES.md`** — GR-11 (Zero Fake Data), GR-12 (fidelidad Maps) son el filtro para activar categorías.
- **`STYLING.md`** / **`I18N.md`** — cada categoría nueva necesita variable CSS e i18n en 3 idiomas.
