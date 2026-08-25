import type { ServiceItem } from "../types.ts";
import { canJuanito } from "./can-juanito.ts";
import { piscinasPonentAndratx } from "./piscinas-spas-ponent-andratx.ts";

export { canJuanito, piscinasPonentAndratx };

/**
 * Catálogo Sectorial: Jardinería, Paisajismo & Piscinas en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const JARDINERIA_SERVICES: ServiceItem[] = [canJuanito, piscinasPonentAndratx];
