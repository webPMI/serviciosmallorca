import type { ServiceItem } from "../types.ts";
import { canJuanito } from "./can-juanito.ts";
import { jardineriaMediterraneaPaisajismoPalma } from "./jardineria-mediterranea-paisajismo-palma.ts";
import { mallorcaPoolCareSantaPonsa } from "./mallorca-pool-care-santa-ponsa.ts";
import { mantenimientoPiscinasSalinasCalvia } from "./mantenimiento-piscinas-salinas-calvia.ts";
import { piscinasPonentAndratx } from "./piscinas-spas-ponent-andratx.ts";
import { viverosSantaMaria } from "./viveros-santa-maria.ts";

export {
  canJuanito,
  jardineriaMediterraneaPaisajismoPalma,
  mallorcaPoolCareSantaPonsa,
  mantenimientoPiscinasSalinasCalvia,
  piscinasPonentAndratx,
  viverosSantaMaria,
};

export const JARDINERIA_SERVICES: ServiceItem[] = [
  canJuanito,
  jardineriaMediterraneaPaisajismoPalma,
  mallorcaPoolCareSantaPonsa,
  mantenimientoPiscinasSalinasCalvia,
  piscinasPonentAndratx,
  viverosSantaMaria,
];
