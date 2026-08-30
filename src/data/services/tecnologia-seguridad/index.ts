import type { ServiceItem } from "../types.ts";
import { digitalCinemaMallorca } from "./digital-cinema-mallorca.ts";
import { electricidadSoller } from "./electricidad-climatizacion-soller.ts";
import { electricidadBinissalem } from "./electricidad-domotica-binissalem.ts";
import { solarArta } from "./energia-solar-arta.ts";
import { fibwiTelecomunicaciones } from "./fibwi-telecomunicaciones.ts";
import { knxSmartHomeDomoticaMallorca } from "./knx-smart-home-domotica-mallorca.ts";
import { prosegurSeguridadVillasBaleares } from "./prosegur-seguridad-villas-baleares.ts";
import { trablisaSeguridad } from "./trablisa.ts";

export {
  digitalCinemaMallorca,
  electricidadSoller,
  electricidadBinissalem,
  solarArta,
  fibwiTelecomunicaciones,
  knxSmartHomeDomoticaMallorca,
  prosegurSeguridadVillasBaleares,
  trablisaSeguridad,
};

export const SEGURIDAD_SERVICES: ServiceItem[] = [
  digitalCinemaMallorca,
  electricidadSoller,
  electricidadBinissalem,
  solarArta,
  fibwiTelecomunicaciones,
  knxSmartHomeDomoticaMallorca,
  prosegurSeguridadVillasBaleares,
  trablisaSeguridad,
];
