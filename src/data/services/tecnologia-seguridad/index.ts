import type { ServiceItem } from "../types.ts";
import { digitalCinemaMallorca } from "./digital-cinema-mallorca.ts";
import { electricidadSoller } from "./electricidad-climatizacion-soller.ts";
import { electricidadBinissalem } from "./electricidad-domotica-binissalem.ts";
import { solarArta } from "./energia-solar-arta.ts";
import { fibwiTelecomunicaciones } from "./fibwi-telecomunicaciones.ts";
import { trablisaSeguridad } from "./trablisa.ts";

export {
  digitalCinemaMallorca,
  electricidadSoller,
  electricidadBinissalem,
  solarArta,
  fibwiTelecomunicaciones,
  trablisaSeguridad,
};

export const SEGURIDAD_SERVICES: ServiceItem[] = [
  digitalCinemaMallorca,
  electricidadSoller,
  electricidadBinissalem,
  solarArta,
  fibwiTelecomunicaciones,
  trablisaSeguridad,
];
