import type { ServiceItem } from "../types.ts";
import { bufeteFrau } from "./bufete-frau.ts";
import { illeslexAbogados } from "./illeslex-abogados.ts";
import { caPatroMarch } from "./ca-s-patro-march.ts";

export { bufeteFrau, illeslexAbogados, caPatroMarch };

/**
 * Catálogo Sectorial: Servicios Profesionales, Abogados & Asesoría Fiscal en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const PROFESIONALES_SERVICES: ServiceItem[] = [
  bufeteFrau,
  illeslexAbogados,
  caPatroMarch, // INCOMPLETO - Solo visible para administradores (status: incomplete_admin_only)
];

/**
 * Servicios públicos (filtro de negocios incompletos para usuarios)
 */
export const PUBLIC_PROFESIONALES_SERVICES: ServiceItem[] = PROFESIONALES_SERVICES.filter(
  (service) => service.status !== "incomplete_admin_only",
);
