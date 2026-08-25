import type { ServiceItem } from "../types.ts";
import { trablisaSeguridad } from "./trablisa.ts";
import { digitalCinemaMallorca } from "./digital-cinema-mallorca.ts";

export { trablisaSeguridad, digitalCinemaMallorca };

/**
 * Catálogo Sectorial: Tecnología, Seguridad & Domótica en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const SEGURIDAD_SERVICES: ServiceItem[] = [trablisaSeguridad, digitalCinemaMallorca];
