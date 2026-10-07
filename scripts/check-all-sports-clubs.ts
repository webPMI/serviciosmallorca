import { DEPORTES_SERVICES } from '../src/data/services/deportes-fitness/index.ts';

console.log(`🏟️ Total de servicios deportivos registrados: ${DEPORTES_SERVICES.length}\n`);

const sorted = [...DEPORTES_SERVICES].sort((a, b) => a.name.localeCompare(b.name));
sorted.forEach((item, index) => {
  console.log(`${(index + 1).toString().padStart(3, ' ')}. [${item.slug}] "${item.name}" | ${item.phone} | ${item.website}`);
});
