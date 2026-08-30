import type { ServiceItem } from "../types.ts";
import { belmondLaResidenciaDeia } from "./belmond-la-residencia-deia.ts";
import { canBordoyGrandHousePalma } from "./can-bordoy-grand-house-palma.ts";
import { capRocatHotelPalmaBay } from "./cap-rocat-hotel-palma-bay.ts";
import { castellSonClaretCalvia } from "./castell-son-claret-calvia.ts";
import { fincaEcoturismoCanFeliuPorreres } from "./finca-ecoturismo-can-feliu-porreres.ts";
import { fincaSerenaMallorcaMontuiri } from "./finca-serena-mallorca-montuiri.ts";
import { mallorcaBalloonsManacor } from "./mallorca-balloons-manacor.ts";
import { mallorcaHikingToursSoller } from "./mallorca-hiking-tours-soller.ts";
import { prediSonJaumellCapdepera } from "./predi-son-jaumell-capdepera.ts";
import { sonBrullHotelSpaPollensa } from "./son-brull-hotel-spa-pollensa.ts";

export {
  belmondLaResidenciaDeia,
  canBordoyGrandHousePalma,
  capRocatHotelPalmaBay,
  castellSonClaretCalvia,
  fincaEcoturismoCanFeliuPorreres,
  fincaSerenaMallorcaMontuiri,
  mallorcaBalloonsManacor,
  mallorcaHikingToursSoller,
  prediSonJaumellCapdepera,
  sonBrullHotelSpaPollensa,
};

export const ALOJAMIENTO_SERVICES: ServiceItem[] = [
  belmondLaResidenciaDeia,
  canBordoyGrandHousePalma,
  capRocatHotelPalmaBay,
  castellSonClaretCalvia,
  fincaEcoturismoCanFeliuPorreres,
  fincaSerenaMallorcaMontuiri,
  mallorcaBalloonsManacor,
  mallorcaHikingToursSoller,
  prediSonJaumellCapdepera,
  sonBrullHotelSpaPollensa,
];
