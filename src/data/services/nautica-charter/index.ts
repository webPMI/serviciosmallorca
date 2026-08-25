import type { ServiceItem } from "../types.ts";
import { oasisCatamaran } from "./oasis-catamaran.ts";
import { mallorcaGlobalCharter } from "./mallorca-global-charter.ts";
import { attractionCatamarans } from "./attraction-catamarans.ts";

export { oasisCatamaran, mallorcaGlobalCharter, attractionCatamarans };

/**
 * Catálogo Sectorial: Náutica, Chárter & Actividades Marítimas en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const NAUTICA_SERVICES: ServiceItem[] = [oasisCatamaran, mallorcaGlobalCharter, attractionCatamarans];
