import fs from 'node:fs';
import path from 'node:path';
import { validateServicesList } from '../src/lib/validateServices.ts';
import { SERVICES } from '../src/data/services/index.ts';

const filesToFix = [
  {
    path: 'src/data/services/educacion-formacion/academia-aleman-deutsch-zentrum-palma.ts',
    varName: 'academia_aleman_deutsch_zentrum_palma',
    category: 'academias-idiomas-formacion',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos').map(x => x === 'aud:empresas' ? 'aud:b2b' : x)
  },
  {
    path: 'src/data/services/educacion-formacion/academia-ingles-british-corner-palma.ts',
    varName: 'academia_ingles_british_corner_palma',
    category: 'academias-idiomas-formacion',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos').map(x => x === 'aud:empresas' ? 'aud:b2b' : x)
  },
  {
    path: 'src/data/services/educacion-formacion/academia-oposiciones-mallorca-prepara.ts',
    varName: 'academia_oposiciones_mallorca_prepara',
    category: 'academias-idiomas-formacion',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos')
  },
  {
    path: 'src/data/services/educacion-formacion/autoescuela-palma-conduir.ts',
    varName: 'autoescuela_palma_conduir',
    category: 'academias-idiomas-formacion',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos' && x !== 'aud:jovenes')
  },
  {
    path: 'src/data/services/educacion-formacion/escuela-cocina-palma-terra-cuina.ts',
    varName: 'escuela_cocina_palma_terra_cuina',
    category: 'academias-idiomas-formacion',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos' && x !== 'aud:turistas')
  },
  {
    path: 'src/data/services/educacion-formacion/escuela-vela-palma-escola-de-vela.ts',
    varName: 'escuela_vela_palma_escola_de_vela',
    category: 'academias-idiomas-formacion',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos' && x !== 'aud:deportistas')
  },
  {
    path: 'src/data/services/salud-bienestar/clinica-dental-calvia-nova.ts',
    varName: 'clinica_dental_calvia_nova',
    cleanTags: (t) => t.filter(x => x !== 'aud:turistas').map(x => x === 'aud:expats' ? 'aud:expat' : x)
  },
  {
    path: 'src/data/services/salud-bienestar/clinica-dental-dr-puerto-soller.ts',
    varName: 'clinica_dental_dr_puerto_soller',
    cleanTags: (t) => t.filter(x => x !== 'aud:residentes').map(x => x === 'aud:expats' ? 'aud:expat' : x)
  },
  {
    path: 'src/data/services/salud-bienestar/clinica-nutricion-dietetic-alcudia.ts',
    varName: 'clinica_nutricion_dietetic_alcudia',
    cleanTags: (t) => t.filter(x => x !== 'aud:deportistas').map(x => x === 'zona:port-dalcudia' ? 'zona:port-d-alcudia' : x)
  },
  {
    path: 'src/data/services/salud-bienestar/clinica-osteopatia-inca-salus.ts',
    varName: 'clinica_osteopatia_inca_salus',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos' && x !== 'aud:deportistas')
  },
  {
    path: 'src/data/services/salud-bienestar/clinica-psicologia-palma-mente-sana.ts',
    varName: 'clinica_psicologia_palma_mente_sana',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos')
  },
  {
    path: 'src/data/services/salud-bienestar/clinica-veterinaria-alcudia-animalia.ts',
    varName: 'clinica_veterinaria_alcudia_animalia',
    cleanTags: (t) => t.filter(x => x !== 'aud:mascotas' && x !== 'aud:residentes')
  },
  {
    path: 'src/data/services/salud-bienestar/dermatologia-estetica-dr-riera-palma.ts',
    varName: 'dermatologia_estetica_dr_riera_palma',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos')
  },
  {
    path: 'src/data/services/salud-bienestar/optica-vision-plus-palma.ts',
    varName: 'optica_vision_plus_palma',
    cleanTags: (t) => t.filter(x => x !== 'aud:adultos' && x !== 'aud:deportistas')
  }
];

async function testAll() {
  const newServices = [];

  for (const item of filesToFix) {
    const full = path.resolve(item.path);
    const mod = await import('file://' + full.replace(/\\/g, '/'));
    const s = { ...(mod.service || Object.values(mod)[0]) };
    if (item.category) s.category = item.category;
    if (item.cleanTags && s.tags) s.tags = item.cleanTags(s.tags);
    newServices.push(s);
  }

  // Also load the other 2
  const gMod = await import('file://' + path.resolve('src/data/services/gastronomia-restaurantes/restaurante-sa-foradada-deia-arros-leña.ts').replace(/\\/g, '/'));
  newServices.push(Object.values(gMod)[0]);

  const nMod = await import('file://' + path.resolve('src/data/services/nautica-charter/escola-de-vela-balear-escola-nàutica-palma.ts').replace(/\\/g, '/'));
  newServices.push(Object.values(nMod)[0]);

  console.log(`Testing all ${newServices.length} together with existing ${SERVICES.length} services...`);
  const all = [...SERVICES, ...newServices];
  const res = validateServicesList(all);
  console.log('Valid:', res.valid);
  if (!res.valid) {
    console.log('Errors:', res.errors);
  } else {
    console.log('🎉 ALL 16 SERVICES PASS 100% VALIDATION WITH ZERO CONFLICTS!');
  }
}

testAll();
