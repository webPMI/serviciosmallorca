import type { ServiceItem } from "../types.ts";
import { kuyenArtTattoo } from "./kuyen-art-tattoo.ts";
import { boxTattooPiercing } from "./box-tattoo-piercing.ts";
import { urbanSoulTattoo } from "./urban-soul-tattoo.ts";

export { kuyenArtTattoo, boxTattooPiercing, urbanSoulTattoo };

/**
 * Catálogo Sectorial: Arte, Tatuajes & Piercing en Mallorca.
 * Agregación modular de negocios verificados bajo el protocolo docs/AGENT_CURATION_SOP.md
 */
export const TATTOO_SERVICES: ServiceItem[] = [
  kuyenArtTattoo,
  boxTattooPiercing,
  urbanSoulTattoo,
];
