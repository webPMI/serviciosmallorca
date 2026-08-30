import type { ServiceItem } from "../types.ts";
import { canJuanito } from "./can-juanito.ts";
import { jardineriaMediterraneaPaisajismoPalma } from "./jardineria-mediterranea-paisajismo-palma.ts";
import { mantenimientoPiscinasSalinasCalvia } from "./mantenimiento-piscinas-salinas-calvia.ts";
import { piscinasPonentAndratx } from "./piscinas-spas-ponent-andratx.ts";
import { viverosSantaMaria } from "./viveros-santa-maria.ts";

export {
  canJuanito,
  jardineriaMediterraneaPaisajismoPalma,
  mantenimientoPiscinasSalinasCalvia,
  piscinasPonentAndratx,
  viverosSantaMaria,
};

export const JARDINERIA_SERVICES: ServiceItem[] = [
  canJuanito,
  jardineriaMediterraneaPaisajismoPalma,
  mantenimientoPiscinasSalinasCalvia,
  piscinasPonentAndratx,
  viverosSantaMaria,
];
