import type { ServiceItem } from "../types.ts";
import { balearicProperties } from "./balearic-properties.ts";
import { engelVolkersMallorca } from "./engel-volkers-mallorca.ts";
import { firstMallorca } from "./first-mallorca.ts";
import { mallorcaSothebysRealty } from "./mallorca-sothebys-realty.ts";

export { balearicProperties, engelVolkersMallorca, firstMallorca, mallorcaSothebysRealty };

export const INMOBILIARIA_SERVICES: ServiceItem[] = [
  balearicProperties,
  engelVolkersMallorca,
  firstMallorca,
  mallorcaSothebysRealty,
];
