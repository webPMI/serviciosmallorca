import type { ServiceItem } from "../types.ts";
import { balearicProperties } from "./balearic-properties.ts";
import { engelVolkersMallorca } from "./engel-volkers-mallorca.ts";
import { firstMallorca } from "./first-mallorca.ts";
import { kensingtonFinestPropertiesPalma } from "./kensington-finest-properties-palma.ts";
import { lucasFoxMallorcaInmobiliaria } from "./lucas-fox-mallorca-inmobiliaria.ts";
import { mallorcaSothebysRealty } from "./mallorca-sothebys-realty.ts";
import { portAndratxLivingProperties } from "./port-andratx-living-properties.ts";

export {
  balearicProperties,
  engelVolkersMallorca,
  firstMallorca,
  kensingtonFinestPropertiesPalma,
  lucasFoxMallorcaInmobiliaria,
  mallorcaSothebysRealty,
  portAndratxLivingProperties,
};

export const INMOBILIARIA_SERVICES: ServiceItem[] = [
  balearicProperties,
  engelVolkersMallorca,
  firstMallorca,
  kensingtonFinestPropertiesPalma,
  lucasFoxMallorcaInmobiliaria,
  mallorcaSothebysRealty,
  portAndratxLivingProperties,
];
