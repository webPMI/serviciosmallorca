import type { ServiceItem } from "../types.ts";
import { roigPremium } from "./roig-premium.ts";
import { autocaresTransunion } from "./autocares-transunion.ts";
import { garajeAutoPla } from "./garaje-auto-pla.ts";
import { bergantinosBikes } from "./bergantinos-bikes.ts";
import { tallerHermanosBestard } from "./taller-hermanos-bestard.ts";
import { mallorcaCyclingCenter } from "./mallorca-cycling-center-muro.ts";
import { talleresAutoInca } from "./talleres-auto-inca.ts";

export {
  roigPremium,
  autocaresTransunion,
  garajeAutoPla,
  bergantinosBikes,
  tallerHermanosBestard,
  mallorcaCyclingCenter,
  talleresAutoInca,
};

/**
 * Catálogo Sectorial: Movilidad, Transporte VIP & Chófer en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const TRANSPORTE_SERVICES: ServiceItem[] = [
  roigPremium,
  autocaresTransunion,
  garajeAutoPla,
  bergantinosBikes,
  tallerHermanosBestard,
  mallorcaCyclingCenter,
  talleresAutoInca,
];
