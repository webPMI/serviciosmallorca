import type { ServiceItem } from "../types.ts";
import { dinsSantiTaura } from "./dins-santi-taura.ts";
import { caNEduardo } from "./ca-n-eduardo.ts";
import { adrianQuetglas } from "./adrian-quetglas.ts";
import { caNaToneta } from "./ca-na-toneta.ts";
import { vandalPalma } from "./vandal-palma.ts";

export { dinsSantiTaura, caNEduardo, adrianQuetglas, caNaToneta, vandalPalma };

/**
 * Catálogo Sectorial: Hostelería, Gastronomía & Restaurantes de Alta Cocina.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const RESTAURANT_SERVICES: ServiceItem[] = [
  dinsSantiTaura,
  caNEduardo,
  adrianQuetglas,
  caNaToneta,
  vandalPalma,
];
