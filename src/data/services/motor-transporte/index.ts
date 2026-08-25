import type { ServiceItem } from "../types.ts";
import { roigPremium } from "./roig-premium.ts";

export { roigPremium };

/**
 * Catálogo Sectorial: Movilidad, Transporte VIP & Chófer en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const TRANSPORTE_SERVICES: ServiceItem[] = [
  roigPremium,
];
