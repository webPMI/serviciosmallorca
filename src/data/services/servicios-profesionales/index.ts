import type { ServiceItem } from "../types.ts";
import { bufeteFrau } from "./bufete-frau.ts";
import { illeslexAbogados } from "./illeslex-abogados.ts";
import { cuatrecasasPalma } from "./cuatrecasas-palma.ts";
import { rataCorner } from "./rata-corner.ts";
import { caPatroMarch } from "./ca-s-patro-march.ts";
import { palmaPadelClub } from "./palma-padel-club.ts";
import { pinsPadelSantaPonsa } from "./pins-padel-santa-ponsa.ts";

export {
  bufeteFrau,
  illeslexAbogados,
  cuatrecasasPalma,
  rataCorner,
  caPatroMarch,
  palmaPadelClub,
  pinsPadelSantaPonsa,
};

/**
 * Catálogo Sectorial: Servicios Profesionales, Deportes & Asesoría en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const PROFESIONALES_SERVICES: ServiceItem[] = [
  bufeteFrau,
  illeslexAbogados,
  cuatrecasasPalma,
  rataCorner,
  caPatroMarch,
  palmaPadelClub,
  pinsPadelSantaPonsa,
];

/**
 * Servicios públicos (filtro de negocios incompletos para usuarios)
 */
export const PUBLIC_PROFESIONALES_SERVICES: ServiceItem[] = PROFESIONALES_SERVICES.filter(
  (service) => service.status !== "incomplete_admin_only",
);
