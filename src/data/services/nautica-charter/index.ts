import type { ServiceItem } from "../types.ts";
import { oasisCatamaran } from "./oasis-catamaran.ts";
import { mallorcaGlobalCharter } from "./mallorca-global-charter.ts";
import { attractionCatamarans } from "./attraction-catamarans.ts";
import { clubNauticPortitxol } from "./club-nautic-portitxol.ts";
import { varaderoPortitxol } from "./varadero-portitxol-services.ts";
import { zoeaBuceoMallorca } from "./zoea-mallorca-buceo.ts";
import { varaderoAlcudiamar } from "./varadero-alcudiamar.ts";
import { skualoAlcudia } from "./skualo-alcudia-diving.ts";

export {
  oasisCatamaran,
  mallorcaGlobalCharter,
  attractionCatamarans,
  clubNauticPortitxol,
  varaderoPortitxol,
  zoeaBuceoMallorca,
  varaderoAlcudiamar,
  skualoAlcudia,
};

/**
 * Catálogo Sectorial: Náutica, Chárter & Actividades Marítimas en Mallorca.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const NAUTICA_SERVICES: ServiceItem[] = [
  oasisCatamaran,
  mallorcaGlobalCharter,
  attractionCatamarans,
  clubNauticPortitxol,
  varaderoPortitxol,
  zoeaBuceoMallorca,
  varaderoAlcudiamar,
  skualoAlcudia,
];
