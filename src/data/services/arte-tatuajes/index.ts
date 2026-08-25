import type { ServiceItem } from "../types.ts";
import { kuyenArtTattoo } from "./kuyen-art-tattoo.ts";
import { boxTattooPiercing } from "./box-tattoo-piercing.ts";
import { macatelaTattoo } from "./macatela-tattoo.ts";
import { urbanSoulTattoo } from "./urban-soul-tattoo.ts";
import { goodLuckTattoo } from "./good-luck-tattoo.ts";
import { vidriosGordiola } from "./vidrios-gordiola-algaida.ts";
import { artesaniaCerasPalma } from "./artesania-ceras-palma.ts";
import { teixitsVicens } from "./teixits-vicens-pollensa.ts";

export {
  kuyenArtTattoo,
  boxTattooPiercing,
  macatelaTattoo,
  urbanSoulTattoo,
  goodLuckTattoo,
  vidriosGordiola,
  artesaniaCerasPalma,
  teixitsVicens,
};

/**
 * Catálogo Sectorial: Arte, Tatuajes & Artesanía en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const TATTOO_SERVICES: ServiceItem[] = [
  kuyenArtTattoo,
  boxTattooPiercing,
  macatelaTattoo,
  urbanSoulTattoo,
  goodLuckTattoo,
  vidriosGordiola,
  artesaniaCerasPalma,
  teixitsVicens,
];
