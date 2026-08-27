import type { ServiceItem } from "../types.ts";
import { canJuanito } from "./can-juanito.ts";
import { piscinasPonentAndratx } from "./piscinas-spas-ponent-andratx.ts";
import { viverosSantaMaria } from "./viveros-santa-maria.ts";

export { canJuanito, piscinasPonentAndratx, viverosSantaMaria };

/**
 * Catálogo Sectorial: Jardinería, Paisajismo & Piscinas en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const JARDINERIA_SERVICES: ServiceItem[] = [canJuanito, piscinasPonentAndratx, viverosSantaMaria];
