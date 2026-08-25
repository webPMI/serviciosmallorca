import type { ServiceItem } from "../types.ts";
import { bufeteFrau } from "./bufete-frau.ts";
import { illeslexAbogados } from "./illeslex-abogados.ts";

export { bufeteFrau, illeslexAbogados };

/**
 * Catálogo Sectorial: Servicios Profesionales, Abogados & Asesoría Fiscal en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const PROFESIONALES_SERVICES: ServiceItem[] = [
  bufeteFrau,
  illeslexAbogados,
];
