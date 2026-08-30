import type { ServiceItem } from "../types.ts";
import { autocaresTransunion } from "./autocares-transunion.ts";
import { bergantinosBikes } from "./bergantinos-bikes.ts";
import { boschCarServicePalmaCentro } from "./bosch-car-service-palma-centro.ts";
import { classicCarRentalMallorcaTramuntana } from "./classic-car-rental-mallorca-tramuntana.ts";
import { garajeAutoPla } from "./garaje-auto-pla.ts";
import { mallorcaCyclingCenter } from "./mallorca-cycling-center-muro.ts";
import { mallorcaPrivateChauffeurLimousine } from "./mallorca-private-chauffeur-limousine.ts";
import { roigPremium } from "./roig-premium.ts";
import { tallerHermanosBestard } from "./taller-hermanos-bestard.ts";
import { tallerLlevantManacor } from "./taller-mecanico-llevant-manacor.ts";
import { talleresAutoInca } from "./talleres-auto-inca.ts";
import { vespamallorcaScooterRentalPalma } from "./vespamallorca-scooter-rental-palma.ts";

export {
  autocaresTransunion,
  bergantinosBikes,
  boschCarServicePalmaCentro,
  classicCarRentalMallorcaTramuntana,
  garajeAutoPla,
  mallorcaCyclingCenter,
  mallorcaPrivateChauffeurLimousine,
  roigPremium,
  tallerHermanosBestard,
  tallerLlevantManacor,
  talleresAutoInca,
  vespamallorcaScooterRentalPalma,
};

export const TRANSPORTE_SERVICES: ServiceItem[] = [
  autocaresTransunion,
  bergantinosBikes,
  boschCarServicePalmaCentro,
  classicCarRentalMallorcaTramuntana,
  garajeAutoPla,
  mallorcaCyclingCenter,
  mallorcaPrivateChauffeurLimousine,
  roigPremium,
  tallerHermanosBestard,
  tallerLlevantManacor,
  talleresAutoInca,
  vespamallorcaScooterRentalPalma,
];
