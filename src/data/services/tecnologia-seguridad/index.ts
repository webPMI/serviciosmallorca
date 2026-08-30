import type { ServiceItem } from "../types.ts";
import { balearRedesFibraWifiMallorca } from "./balear-redes-fibra-wifi-mallorca.ts";
import { digitalCinemaMallorca } from "./digital-cinema-mallorca.ts";
import { electricidadSoller } from "./electricidad-climatizacion-soller.ts";
import { electricidadBinissalem } from "./electricidad-domotica-binissalem.ts";
import { solarArta } from "./energia-solar-arta.ts";
import { fibwiTelecomunicaciones } from "./fibwi-telecomunicaciones.ts";
import { knxSmartHomeDomoticaMallorca } from "./knx-smart-home-domotica-mallorca.ts";
import { prosegurSeguridadVillasBaleares } from "./prosegur-seguridad-villas-baleares.ts";
import { smartHomeDomoticaMallorcaKnx } from "./smart-home-domotica-mallorca-knx.ts";
import { trablisaSeguridad } from "./trablisa.ts";

export {
  balearRedesFibraWifiMallorca,
  digitalCinemaMallorca,
  electricidadSoller,
  electricidadBinissalem,
  solarArta,
  fibwiTelecomunicaciones,
  knxSmartHomeDomoticaMallorca,
  prosegurSeguridadVillasBaleares,
  smartHomeDomoticaMallorcaKnx,
  trablisaSeguridad,
};

export const SEGURIDAD_SERVICES: ServiceItem[] = [
  balearRedesFibraWifiMallorca,
  digitalCinemaMallorca,
  electricidadSoller,
  electricidadBinissalem,
  solarArta,
  fibwiTelecomunicaciones,
  knxSmartHomeDomoticaMallorca,
  prosegurSeguridadVillasBaleares,
  smartHomeDomoticaMallorcaKnx,
  trablisaSeguridad,
];
