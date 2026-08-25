import type { ServiceItem } from "../types.ts";
import { arabellaSpa } from "./arabella-spa.ts";
import { sonBrullSpa } from "./son-brull-spa.ts";
import { bodynaSpaMaricel } from "./bodyna-spa-maricel.ts";
import { belmondLaResidenciaSpa } from "./belmond-la-residencia-spa.ts";

export { arabellaSpa, sonBrullSpa, bodynaSpaMaricel, belmondLaResidenciaSpa };

/**
 * Catálogo Sectorial: Spas, Bienestar, Masajes & Estética en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const SPAS_SERVICES: ServiceItem[] = [arabellaSpa, sonBrullSpa, bodynaSpaMaricel, belmondLaResidenciaSpa];
