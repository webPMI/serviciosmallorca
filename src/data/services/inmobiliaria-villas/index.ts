import type { ServiceItem } from "../types.ts";
import { firstMallorca } from "./first-mallorca.ts";
import { engelVolkersMallorca } from "./engel-volkers-mallorca.ts";
import { balearicProperties } from "./balearic-properties.ts";

export { firstMallorca, engelVolkersMallorca, balearicProperties };

/**
 * Catálogo Sectorial: Inmobiliaria, Villas de Lujo & Fincas en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const INMOBILIARIA_SERVICES: ServiceItem[] = [firstMallorca, engelVolkersMallorca, balearicProperties];
