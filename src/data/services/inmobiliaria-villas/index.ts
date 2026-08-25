import type { ServiceItem } from "../types.ts";
import { firstMallorca } from "./first-mallorca.ts";
import { engelVolkersMallorca } from "./engel-volkers-mallorca.ts";

export { firstMallorca, engelVolkersMallorca };

/**
 * Catálogo Sectorial: Inmobiliaria, Villas de Lujo & Fincas en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const INMOBILIARIA_SERVICES: ServiceItem[] = [
  firstMallorca,
  engelVolkersMallorca,
];
