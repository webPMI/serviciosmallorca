import { DEPORTES_SERVICES } from '../src/data/services/deportes-fitness/index.ts';

console.log(`Total de servicios de deportes: ${DEPORTES_SERVICES.length}`);

for (const s of DEPORTES_SERVICES) {
  console.log(`${s.slug.padEnd(45)} | ${s.name.padEnd(40)} | ${s.phone.padEnd(16)} | ${s.website}`);
}
