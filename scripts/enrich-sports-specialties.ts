import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "src", "data", "services", "deportes-fitness");
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts");

interface DisciplineSpec {
  subcategories: string[];
  specialties: {
    es: string[];
    en: string[];
    ca: string[];
    de: string[];
  };
}

function getDisciplineSpec(filename: string, content: string): DisciplineSpec {
  const n = (filename + " " + content.slice(0, 500)).toLowerCase();

  if (n.includes("golf")) {
    return {
      subcategories: ["golf", "club-de-golf", "deporte-outdoor"],
      specialties: {
        es: [
          "Recorrido reglamentario de 18 hoyos par 72 con vistas panorámicas",
          "Zona de prácticas, putting green y driving range con tecnología TrackMan",
          "Casa Club con pro-shop de primeras marcas y restaurante gastronómico",
          "Clases de golf individuales y clinics impartidos por profesionales PGA",
        ],
        en: [
          "Championship 18-hole par 72 golf course with panoramic Mediterranean views",
          "Practice academy with driving range, putting greens & TrackMan analysis",
          "Clubhouse featuring pro shop apparel and scenic terrace dining",
          "Private lessons and intensive clinics by certified PGA professionals",
        ],
        ca: [
          "Recorregut de 18 forats par 72 amb vistes panoràmiques a la natura mallorquina",
          "Zona de pràctiques, putting green i acadèmia de golf professional",
          "Casa Club amb botiga especialitzada i restaurant d'alta gastronomia",
          "Classes particulars i clínics amb instructors titulats PGA",
        ],
        de: [
          "18-Loch Meisterschaftsplatz Par 72 mit spektakulärer mallorquinischer Kulisse",
          "Übungsanlage mit Driving Range, Putting Green und TrackMan-Technologie",
          "Clubhaus mit erstklassigem Pro-Shop und gehobenem Club-Restaurant",
          "Einzeltraining und Intensivkurse durch PGA-zertifizierte Golf-Professionals",
        ],
      },
    };
  }

  if (n.includes("padel") || n.includes("pádel")) {
    return {
      subcategories: ["padel", "club-de-raqueta", "deporte-indoor-outdoor"],
      specialties: {
        es: [
          "Pistas panorámicas de pádel de última generación con césped de alta competición",
          "Escuela de pádel para todos los niveles, desde iniciación hasta tecnificación",
          "Torneos de fin de semana, ligas regulares y partidas organizadas por nivel",
          "Alquiler de pistas con iluminación LED y reserva ágil online",
        ],
        en: [
          "Panoramic next-generation padel courts with competition-grade turf",
          "Padel academy for all player levels, from beginner fundamentals to advanced drills",
          "Weekend tournaments, regular leagues, and match-making by rating",
          "Court hire with high-efficiency LED floodlights and fast online booking",
        ],
        ca: [
          "Pistes panoràmiques de pàdel de darrera generació amb gespa d'alta competició",
          "Escola de pàdel per a tots els nivells, des d'iniciació fins a tecnificació",
          "Tornejos de cap de setmana, lligues regulars i partits anivellats",
          "Lloguer de pistes amb il·luminació LED d'última tecnologia",
        ],
        de: [
          "Panorama-Padelplätze der neuesten Generation mit Wettkampf-Kunstrasen",
          "Padelschule für alle Spielstärken, von Einsteigerkursen bis zur Turnierreife",
          "Wochenendturniere, regelmäßige Ligen und spielstärkengerechte Spielpartnersuche",
          "Flutlicht-Platzmiete mit moderner, schneller Online-Reservierung",
        ],
      },
    };
  }

  if (n.includes("tenis") || n.includes("tennis") || n.includes("racket")) {
    return {
      subcategories: ["tenis", "club-de-tenis", "deporte-de-raqueta"],
      specialties: {
        es: [
          "Pistas de tenis de tierra batida y pista rápida con mantenimiento diario",
          "Programas de tecnificación técnica, preparación física y táctica de partido",
          "Clases particulares y grupos reducidos con monitores titulados RFET",
          "Servicio de encordado profesional y alquiler de raquetas de test",
        ],
        en: [
          "Clay courts and hard courts meticulously maintained daily",
          "Technical coaching programs, sports conditioning, and match tactics",
          "Private coaching and small group sessions by RFET certified pros",
          "Professional racket restringing service and demo racket testing",
        ],
        ca: [
          "Pistes de tennis de terra batuda i resina amb manteniment diari",
          "Programes de tecnificació esportiva, preparació física i estratègia",
          "Classes particulars i grups reduïts amb entrenadors titulats RFET",
          "Servei de cordatge professional i lloguer de raquetes de prova",
        ],
        de: [
          "Traditionelle Sandplätze und Allwetter-Hartplätze mit täglicher Pflege",
          "Leistungstraining, Schlagtechnik-Verbesserung und Match-Strategie",
          "Einzel- und Kleingruppentraining mit lizenzierten Tennistrainern",
          "Professioneller Besaitungsservice und Testschläger-Verleih",
        ],
      },
    };
  }

  if (n.includes("crossfit")) {
    return {
      subcategories: ["crossfit", "entrenamiento-funcional", "fuerza-acondicionamiento"],
      specialties: {
        es: [
          "WODs diarios escalables y guiados por entrenadores certificados CrossFit",
          "Zona completa de halterofilia con barras olímpicas y discos de competición",
          "Entrenamiento gimnástico, trepa de cuerda y máquinas de cardio Concept2",
          "Open Box supervisado para programación individual y preparación atlética",
        ],
        en: [
          "Daily scalable WODs coached by certified CrossFit instructors",
          "Full Olympic weightlifting platform with barbells and competition bumper plates",
          "Gymnastics conditioning, rope climbs, and Concept2 cardio ergs",
          "Supervised Open Box hours for self-paced training and athlete preparation",
        ],
        ca: [
          "WODs diaris adaptats i guiats per entrenadors certificats CrossFit",
          "Zona d'halterofília olímpica amb material oficial de competició",
          "Entrenament gimnàstic funcional, corda i ergòmetres d'alta intensitat",
          "Open Box vigilat per a entrenament lliure i preparació física",
        ],
        de: [
          "Täglich skalierbare WODs unter Anleitung lizenzierter CrossFit-Trainer",
          "Kompletter olympischer Gewichtheberbereich mit Wettkampf-Bumper-Plates",
          "Gymnastics-Elemente, Kletterseile und Concept2 Ausdauergeräte",
          "Betreutes Open Box für individuelles Training und Athleten-Aufbau",
        ],
      },
    };
  }

  if (n.includes("yoga") || n.includes("pilates")) {
    return {
      subcategories: ["yoga", "pilates", "salud-postural-bienestar"],
      specialties: {
        es: [
          "Clases presenciales de Yoga (Hatha, Vinyasa Flow, Ashtanga, Yin) y Pilates",
          "Instructores certificados con amplia experiencia y corrección personalizada",
          "Estudio equipado con esterillas antideslizantes, bloques, correas y bolsters",
          "Talleres intensivos de respiración consciente, meditación y movilidad articular",
        ],
        en: [
          "In-person Yoga classes (Hatha, Vinyasa Flow, Ashtanga, Yin) and Pilates",
          "Experienced certified instructors providing attentive alignment corrections",
          "Fully equipped studio with grip mats, blocks, straps, and bolster cushions",
          "Deep-dive workshops focusing on conscious breathwork, meditation & joint mobility",
        ],
        ca: [
          "Classes de Ioga (Hatha, Vinyasa Flow, Ashtanga, Yin) i Pilates postural",
          "Instructors titulats amb atenció acurada i correccions individualitzades",
          "Estudi equipat amb estoretes professionals, blocs, corretges i coixins",
          "Tallers de respiració conscient, relaxació profunda i meditació",
        ],
        de: [
          "Präsenzkurse für Yoga (Hatha, Vinyasa Flow, Ashtanga, Yin) und Pilates",
          "Zertifizierte Lehrer mit individueller Haltungs- und Bewegungskorrektur",
          "Voll ausgestattetes Studio mit rutschfesten Matten, Blöcken und Gurten",
          "Intensiv-Workshops für bewusste Atemführung (Pranayama) und Meditation",
        ],
      },
    };
  }

  if (n.includes("bike") || n.includes("cicl") || n.includes("bicycle")) {
    return {
      subcategories: ["ciclismo", "alquiler-bicicletas", "cicloturismo-mallorca"],
      specialties: {
        es: [
          "Flota de bicicletas de carretera de carbono y e-bikes de primeras marcas",
          "Ajuste biomecánico personalizado de sillín, manillar y calas antes de cada ruta",
          "Taller mecánico oficial con herramientas de precisión y repuestos originales",
          "Rutas ciclistas guiadas y tracks GPS para explorar la Serra de Tramuntana",
        ],
        en: [
          "Premium fleet of carbon road bikes and performance e-bikes from leading brands",
          "Custom ergonomic bike fitting including saddle height, handlebar reach & cleat setup",
          "Professional workshop staffed with certified mechanics and genuine parts",
          "Guided cycling expeditions and verified GPS routes across the Tramuntana range",
        ],
        ca: [
          "Flota de bicicletes de carretera de carboni i e-bikes d'alta gamma",
          "Ajust biomecànic precís de selló i cales per a un pedaleig eficient",
          "Taller mecànic especialitzat amb recanvis originals i eines de precisió",
          "Rutes cicloturístiques guiades i itineraris GPS per la Serra de Tramuntana",
        ],
        de: [
          "Flotte erstklassiger Carbon-Rennräder und sportlicher E-Bikes von Top-Marken",
          "Individuelles Bike-Fitting für Sitzposition, Lenkerhöhe und Pedalsysteme",
          "Fachwerkstatt mit professionellem Werkzeug und Original-Ersatzteilen",
          "Geführte Rennradtouren und erprobte GPS-Strecken durch das Tramuntana-Gebirge",
        ],
      },
    };
  }

  if (n.includes("boulder") || n.includes("climb") || n.includes("escalada") || n.includes("rocodromo")) {
    return {
      subcategories: ["escalada", "boulder", "rocodromo-indoor"],
      specialties: {
        es: [
          "Muros de búlder indoor con desplomes, placas técnicas y colchonetas de alta absorción",
          "Rutas y problemas renovados periódicamente por route setters federados",
          "Campus board, MoonBoard y zona de entrenamiento funcional para escaladores",
          "Bautismos de escalada, cursos de progresión y salidas guiadas a roca natural",
        ],
        en: [
          "Indoor bouldering walls featuring overhangs, technical slabs & high-impact crash mats",
          "Problems frequently reset across all difficulty levels by certified route setters",
          "Campus board, MoonBoard, and dedicated climber-specific strength conditioning",
          "Introductory climbing clinics, progression courses & guided outdoor crag trips",
        ],
        ca: [
          "Murs de bloc indoor amb desploms, plaques tècniques i matalassos de seguretat",
          "Blocs renovats assíduament per equips de route setting especialitzats",
          "Campus board, MoonBoard i zona d'entrenament de força per a escaladors",
          "Batejos d'escalada, cursos de seguretat i excursions guiades a roca natural",
        ],
        de: [
          "Indoor-Boulderwände mit Überhängen, Slopers und dicken Sicherheits-Fallschutzmatten",
          "Regelmäßig neu geschraubte Boulder-Probleme in allen Schwierigkeitsgraden",
          "Campusboard, MoonBoard und kletterspezifischer Athletik- und Fingerkraftbereich",
          "Schnupperklettern, Technikkurse und geführte Kletterausflüge an Mallorcas Naturfelsen",
        ],
      },
    };
  }

  if (n.includes("dive") || n.includes("buceo") || n.includes("vela") || n.includes("kiteschool") || n.includes("windsurf") || n.includes("nautic") || n.includes("remo")) {
    return {
      subcategories: ["buceo", "deportes-acuaticos", "nautica-vela"],
      specialties: {
        es: [
          "Cursos y bautismos con certificación oficial (PADI / SSI / RFEV) en aguas cristalinas",
          "Inmersiones y travesías guiadas en reservas marinas protegidas de Mallorca",
          "Material náutico y de buceo de alta gama revisado e higienizado tras cada salida",
          "Embarcaciones de apoyo propias con patrones titulados y equipo de seguridad completo",
        ],
        en: [
          "Official certification courses and introductory try-dives (PADI / SSI / RFEV)",
          "Guided dive excursions and boat routes along Mallorca's protected marine reserves",
          "High-end water sports and scuba gear rigorously serviced and sanitized after each use",
          "Dedicated support boats skippered by certified captains with comprehensive safety gear",
        ],
        ca: [
          "Cursos i batejos amb acreditació oficial (PADI / SSI / RFEV) en aigües cristal·lines",
          "Immersions i rutes guiades per les reserves marines protegides de Mallorca",
          "Material nàutic d'alta gamma revisat periòdicament i homologat",
          "Embarcacions pròpies amb patrons professionals i protocols de seguretat",
        ],
        de: [
          "Offizielle PADI / SSI / RFEV Tauch- und Wassersportkurse für alle Erfahrungsstufen",
          "Geführte Tauch- und Bootstouren zu den schönsten Meeresschutzgebieten Mallorcas",
          "Hochwertige Leihausrüstung, regelmäßig gewartet und nach jedem Einsatz desinfiziert",
          "Eigene Tauch- und Begleitboote mit erfahrenen Skippern und vollständiger Rettungsausrüstung",
        ],
      },
    };
  }

  if (n.includes("boxing") || n.includes("fitboxing")) {
    return {
      subcategories: ["boxeo", "fitboxing", "deportes-de-contacto"],
      specialties: {
        es: [
          "Sesiones de fitboxing de alta intensidad combinando golpeo de saco y ejercicios de fuerza",
          "Tecnología interactiva con sensores en sacos para medir pegada, ritmo y quema calórica",
          "Entrenadores profesionales que supervisan la postura y técnica en cada round",
          "Ambiente motivador con sesiones grupales y música diseñada para marcar el tempo",
        ],
        en: [
          "High-intensity fitboxing rounds combining heavy bag punching and functional strength",
          "Punch-tracking sensor tech in bags tracking power, sync, and calories burned",
          "Expert coaches closely monitoring form, footwork, and strike technique each round",
          "Electric group atmosphere with synchronized playlists designed to keep the rhythm",
        ],
        ca: [
          "Sessions de fitboxing d'alta intensitat combinant sac de boxa i exercicis de força",
          "Sensors tecnològics als sacs que mesuren la potència, el ritme i les calories cremades",
          "Entrenadors que supervisen la postura correcta i la coordinació a cada assalt",
          "Ambient motivador amb música rítmica i classes dirigides dinàmiques",
        ],
        de: [
          "Intensive Fitboxing-Einheiten am Boxsack kombiniert mit funktionellem Krafttraining",
          "Sensor-Technologie in den Boxsäcken zur exakten Messung von Treffern, Kraft und Kalorien",
          "Erfahrene Trainer für kontinuierliche Haltungskontrolle und saubere Schlagtechnik",
          "Mitreißende Trainingsatmosphäre mit treibender Musik für den optimalen Rhythmus",
        ],
      },
    };
  }

  if (n.includes("natacio") || n.includes("piscinas")) {
    return {
      subcategories: ["natacion", "piscinas-olimpicas", "instalaciones-acuaticas"],
      specialties: {
        es: [
          "Vasos de natación olímpicos homologados con carriles segregados por velocidad de nado",
          "Agua tratada con sistemas avanzados de filtrado y control permanente de temperatura",
          "Cursos de natación para adultos, perfeccionamiento técnico de estilos y natación infantil",
          "Zona complementaria de spa, hidromasaje y vestuarios climatizados",
        ],
        en: [
          "Olympic competition swimming pools with lap lanes organized by swimming speed",
          "Advanced water filtration and continuous digital water temperature monitoring",
          "Swimming courses for adults, stroke refinement clinics, and youth swim school",
          "Complementary spa amenities, hydrotherapy jets, and heated modern locker rooms",
        ],
        ca: [
          "Piscines olímpiques homologades amb carrers distribuïts per ritme de nedada",
          "Aigua tractada amb filtratge avançat i temperatura controlada contínuament",
          "Cursets de natació per a adults, perfeccionament d'estils i escola esportiva infantil",
          "Zona complementària de spa, hidromassatge i vestidors moderns",
        ],
        de: [
          "Wettkampfgerechte Sport- und 50m-Olympia-Becken mit nach Tempo geteilten Schwimmbahnen",
          "Modernste Wasseraufbereitung mit permanenter digitaler Temperaturüberwachung",
          "Schwimmkurse für Erwachsene, Kraul-Techniktraining und Kinder-Schwimmschule",
          "Ergänzender Erholungsbereich mit Whirlpool, Sauna und gepflegten Umkleiden",
        ],
      },
    };
  }

  if (n.includes("hipic") || n.includes("hípica") || n.includes("equitacion")) {
    return {
      subcategories: ["equitacion", "hipica", "rutas-a-caballo"],
      specialties: {
        es: [
          "Pistas de doma y salto con suelo geotextil profesional de alta amortiguación",
          "Pupilaje completo en boxes espaciosos, ventilados y con salida a paddocks",
          "Clases de equitación para niños y adultos con caballos y ponis nobles de escuela",
          "Rutas a caballo guiadas por el entorno natural de la Serra de Tramuntana",
        ],
        en: [
          "Dressage and jumping arenas with cushioned professional geotextile footing",
          "Full livery boarding in well-ventilated boxes with direct paddock access",
          "Riding instruction for children and adults with gentle, well-schooled horses & ponies",
          "Guided scenic horseback trail rides through the Serra de Tramuntana landscapes",
        ],
        ca: [
          "Pistes de doma clàssica i salt d'obstacles amb terra geotèxtil professional",
          "Pupil·latge en boxes amplis amb ventilació i sortida a paddocks de descans",
          "Classes d'equitació per a totes les edats amb cavalls i ponis d'escola dòcils",
          "Rutes guiades a cavall pel paisatge natural de la Serra de Tramuntana",
        ],
        de: [
          "Dressur- und Springplätze mit gelenkschonendem professionellem Geotextil-Sand",
          "Pferdepension mit Vollpension in hellen, gut belüfteten Boxen mit Paddock-Zugang",
          "Reitunterricht für Kinder und Erwachsene auf ausgeglichenen Schulpferden und Ponys",
          "Geführte Ausritte durch die malerische Naturkulisse der Tramuntana-Ausläufer",
        ],
      },
    };
  }

  if (n.includes("nordic") || n.includes("senderismo")) {
    return {
      subcategories: ["senderismo", "nordic-walking", "outdoor-tramuntana"],
      specialties: {
        es: [
          "Rutas guiadas de Nordic Walking por la Serra de Tramuntana con guías locales certificados",
          "Enseñanza de la técnica original con bastones adaptados a cada fisonomía",
          "Itinerarios variados por olivares centenarios, costa escarpada y valles de naranjos",
          "Actividades saludables al aire libre orientadas a la movilidad articular y cardiovascular",
        ],
        en: [
          "Guided Nordic Walking excursions across the Tramuntana range with certified local guides",
          "Instruction in proper pole technique tailored to individual physiology and stride",
          "Diverse routes through ancient olive groves, rugged coastlines, and orange valleys",
          "Health-focused outdoor fitness improving joint mobility, posture, and stamina",
        ],
        ca: [
          "Rutes guiades de marxa nòrdica per la Serra de Tramuntana amb guies locals titulats",
          "Ensenyament de la tècnica correcta amb bastons adaptats a cada persona",
          "Itineraris variats per oliverars mil·lenaris, costa verge i la vall de Sóller",
          "Activitat esportiva saludable que millora la mobilitat articular i la resistència",
        ],
        de: [
          "Geführte Nordic-Walking-Touren durch die Serra de Tramuntana mit lizenzierten Guides",
          "Schulung der biomechanisch korrekten Stocktechnik abgestimmt auf jeden Teilnehmer",
          "Abwechslungsreiche Routen durch jahrhundertealte Olivenhaine, Küstenpfade und Täler",
          "Gelenkschonendes Ganzkörpertraining an der frischen Bergluft zur Förderung der Ausdauer",
        ],
      },
    };
  }

  // Default: General Fitness, Gym, Functional, and Wellness clubs
  return {
    subcategories: ["gimnasio", "fitness", "musculacion-cardio"],
    specialties: {
      es: [
        "Sala de peso libre completa con mancuernas de alto gramaje, bancos y barras olímpicas",
        "Maquinaria de musculación selectorizada y guiada de última tecnología biomecánica",
        "Zona cardiovascular moderna con cintas de correr, elípticas y pantallas multimedia",
        "Parrilla completa de clases dirigidas semanales y opción de entrenamiento personal",
      ],
      en: [
        "Extensive free-weight training floor with heavy dumbbells, benches, and Olympic bars",
        "Selectorized resistance machines designed with state-of-the-art biomechanics",
        "Modern cardiovascular deck equipped with high-performance treadmills & ellipticals",
        "Comprehensive weekly instructor-led classes schedule and certified personal coaching",
      ],
      ca: [
        "Zona de pes lliure completa amb manuelles pesades, bancs i barres olímpiques",
        "Maquinària de musculació d'última generació amb disseny biomecànic avançat",
        "Zona de càrdio moderna amb cintes de córrer, el·líptiques i pantalles multimèdia",
        "Parrilla de classes dirigides setmanals i opció d'entrenador personal",
      ],
      de: [
        "Großer Freihantelbereich mit schweren Kurzhanteln, Flachbänken und olympischen Stangen",
        "Hochwertige Kraftgeräte mit ergonomischer Biomechanik für gezielten Muskelaufbau",
        "Moderner Cardio-Bereich mit Laufbändern, Crosstrainern und vernetzten Konsolen",
        "Umfangreicher wöchentlicher Gruppenkursplan sowie qualifiziertes Personal Training",
      ],
    },
  };
}

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(DIR, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Skip Rafa Nadal Academy if it already has rich specialties
  if (content.includes("specialties:") && content.includes("Programas anuales y semanales")) {
    continue;
  }

  const spec = getDisciplineSpec(file, content);

  // If file doesn't have specialties, add it
  if (!content.includes("specialties:")) {
    const specialtiesStr = `  specialties: ${JSON.stringify(spec.specialties, null, 4).replace(/\n/g, "\n  ")},\n`;
    
    // Find where to insert (before createdAt or lastUpdatedAt or status)
    if (content.includes("createdAt:")) {
      content = content.replace("createdAt:", `${specialtiesStr}createdAt:`);
    } else if (content.includes("lastUpdatedAt:")) {
      content = content.replace("lastUpdatedAt:", `${specialtiesStr}lastUpdatedAt:`);
    } else if (content.includes("};\n")) {
      content = content.replace("};\n", `${specialtiesStr}};\n`);
    }
  }

  // Ensure gallery has at least 2 photos
  // If gallery: ["/path.jpg"], replace with ["/path.jpg", "/images/categories/deportes.jpg"]
  const galleryMatch = content.match(/gallery:\s*\[\s*(".*?")\s*\]/);
  if (galleryMatch && !galleryMatch[1].includes(",")) {
    const singleImg = galleryMatch[1];
    if (singleImg !== '"/images/categories/deportes.jpg"') {
      content = content.replace(
        galleryMatch[0],
        `gallery: [${singleImg}, "/images/categories/deportes.jpg"]`
      );
    }
  }

  fs.writeFileSync(filePath, content, "utf8");
  modifiedCount++;
}

console.log(`Successfully enriched ${modifiedCount} sports service files!`);
