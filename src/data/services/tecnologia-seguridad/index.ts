import type { ServiceItem } from "../types.ts";
import { trablisaSeguridad } from "./trablisa.ts";
import { digitalCinemaMallorca } from "./digital-cinema-mallorca.ts";
import { electricidadBinissalem } from "./electricidad-domotica-binissalem.ts";
import { solarArta } from "./energia-solar-arta.ts";
import { electricidadSoller } from "./electricidad-climatizacion-soller.ts";
import { fibwiTelecomunicaciones } from "./fibwi-telecomunicaciones.ts";

export {
  trablisaSeguridad,
  digitalCinemaMallorca,
  electricidadBinissalem,
  solarArta,
  electricidadSoller,
  fibwiTelecomunicaciones,
};

/**
 * Catálogo Sectorial: Tecnología, Seguridad & Domótica en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const SEGURIDAD_SERVICES: ServiceItem[] = [
  trablisaSeguridad,
  digitalCinemaMallorca,
  electricidadBinissalem,
  solarArta,
  electricidadSoller,
  fibwiTelecomunicaciones,
];
