import type { ServiceItem } from "../types.ts";
import { roigPremium } from "./roig-premium.ts";
import { autocaresTransunion } from "./autocares-transunion.ts";
import { garajeAutoPla } from "./garaje-auto-pla.ts";

export { roigPremium, autocaresTransunion, garajeAutoPla };

/**
 * Catálogo Sectorial: Movilidad, Transporte VIP & Chófer en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const TRANSPORTE_SERVICES: ServiceItem[] = [roigPremium, autocaresTransunion, garajeAutoPla];
