import type { ServiceItem } from "../types.ts";
import { oasisCatamaran } from "./oasis-catamaran.ts";
import { mallorcaGlobalCharter } from "./mallorca-global-charter.ts";

export { oasisCatamaran, mallorcaGlobalCharter };

/**
 * Catálogo Sectorial: Náutica, Chárter & Actividades Marítimas en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const NAUTICA_SERVICES: ServiceItem[] = [
  oasisCatamaran,
  mallorcaGlobalCharter,
];
