import { DEPORTES_SERVICES } from '../src/data/services/deportes-fitness/index.ts';

console.log(`Auditing ${DEPORTES_SERVICES.length} sports services in src/data/services/deportes-fitness...`);

let missingPhone = 0;
let missingWebsite = 0;
let missingSchedule = 0;
let missingCoordinates = 0;
let lowConfidence = 0;
let missingGerman = 0;
let missingCatalan = 0;
let missingEnglish = 0;
let missingSpecialties = 0;
let missingHighlights = 0;
let missingGallery = 0;

for (const s of DEPORTES_SERVICES) {
  if (!s.phone) missingPhone++;
  if (!s.website) missingWebsite++;
  if (!s.schedule) missingSchedule++;
  if (!s.coordinates || !s.coordinates.lat || !s.coordinates.lng) missingCoordinates++;
  if ((s.confidenceScore || 0) < 80) lowConfidence++;
  if (!s.shortDescription?.de || !s.fullDescription?.de) missingGerman++;
  if (!s.shortDescription?.ca || !s.fullDescription?.ca) missingCatalan++;
  if (!s.shortDescription?.en || !s.fullDescription?.en) missingEnglish++;
  if (!s.specialties || Object.keys(s.specialties).length === 0) missingSpecialties++;
  if (!s.highlights || Object.keys(s.highlights).length === 0) missingHighlights++;
  if (!s.gallery || s.gallery.length < 2) missingGallery++;
}

console.log(`\n--- Sports Services Audit Report ---`);
console.log(`Total Services: ${DEPORTES_SERVICES.length}`);
console.log(`Missing Phone: ${missingPhone}`);
console.log(`Missing Website: ${missingWebsite}`);
console.log(`Missing Schedule: ${missingSchedule}`);
console.log(`Missing Coordinates: ${missingCoordinates}`);
console.log(`Confidence Score < 80: ${lowConfidence}`);
console.log(`Missing German (DE) text: ${missingGerman}`);
console.log(`Missing Catalan (CA) text: ${missingCatalan}`);
console.log(`Missing English (EN) text: ${missingEnglish}`);
console.log(`Missing Specialties: ${missingSpecialties}`);
console.log(`Missing Highlights: ${missingHighlights}`);
console.log(`Missing Gallery (>1 item): ${missingGallery}`);

const criticalIssues = missingPhone + missingCoordinates + lowConfidence;
if (criticalIssues > 0) {
  console.error(`\n❌ Error de calidad en Deportes: ${criticalIssues} incidencias críticas detectadas.`);
  process.exit(1);
} else {
  console.log(`\n✅ Vertical de Deportes en óptimo estado de calidad.`);
}
