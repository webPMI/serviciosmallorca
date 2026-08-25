import type { ServiceItem } from "../types.ts";
import { kuyenArtTattoo } from "./kuyen-art-tattoo.ts";
import { boxTattooPiercing } from "./box-tattoo-piercing.ts";

export { kuyenArtTattoo, boxTattooPiercing };

/**
 * Catálogo Sectorial: Arte, Tatuajes & Piercing en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const TATTOO_SERVICES: ServiceItem[] = [
  kuyenArtTattoo,
  boxTattooPiercing,
];
