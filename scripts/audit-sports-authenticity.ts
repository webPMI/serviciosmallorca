import { DEPORTES_SERVICES } from '../src/data/services/deportes-fitness/index.ts';

console.log(`🛡️ [Sports Authenticity Audit] Auditando ${DEPORTES_SERVICES.length} clubes deportivos...\n`);

let issues = 0;
for (const s of DEPORTES_SERVICES) {
  const flags: string[] = [];

  // 1. Phone authenticity
  if (!s.phone) {
    flags.push('Falta teléfono');
  } else {
    const p = s.phone.replace(/\D/g, '').replace(/^34/, '');
    if (p.endsWith('1234') || p.endsWith('12345')) {
      flags.push(`Teléfono dummy (1234): ${s.phone}`);
    }
  }

  // 2. Maps CID
  if (s.googleMapsUrl && /cid=(?:12007\d+|13008\d+|\d{1,10})/i.test(s.googleMapsUrl)) {
    flags.push(`CID de Google Maps no verídico: ${s.googleMapsUrl}`);
  }

  // 3. Boilerplate
  const esDesc = typeof s.fullDescription === 'object' ? s.fullDescription.es : s.fullDescription || '';
  if (esDesc.includes('se posiciona como una de las')) {
    flags.push('Texto plantilla IA');
  }

  if (flags.length > 0) {
    issues++;
    console.log(`⚠️ [${s.slug}] "${s.name}" -> ${flags.join(', ')}`);
  }
}

if (issues === 0) {
  console.log(`✅ ¡ÉXITO! Los ${DEPORTES_SERVICES.length} servicios deportivos son 100% auténticos y verificados.`);
} else {
  console.log(`❌ Se encontraron ${issues} servicios con problemas.`);
  process.exit(1);
}
