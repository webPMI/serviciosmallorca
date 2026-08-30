import type { ServiceItem } from "../types.ts";
import { centroVeterinarioPortalsNous } from "./centro-veterinario-portals-nous.ts";
import { clinicaVeterinariaPortAndratx } from "./clinica-veterinaria-port-andratx.ts";
import { clinicaVeterinariaSollerTramuntana } from "./clinica-veterinaria-soller-tramuntana.ts";
import { fincaCanPaulinoDogResortLlucmajor } from "./finca-can-paulino-dog-resort-llucmajor.ts";
import { hospitalVeterinarioAragoPalma } from "./hospital-veterinario-arago-palma.ts";
import { hospitalVeterinarioCanisMallorca } from "./hospital-veterinario-canis-mallorca.ts";
import { mallorcaDogTrainerBehaviour } from "./mallorca-dog-trainer-behaviour.ts";
import { petSpaGroomingSantaCatalina } from "./pet-spa-grooming-santa-catalina.ts";

export {
  centroVeterinarioPortalsNous,
  clinicaVeterinariaPortAndratx,
  clinicaVeterinariaSollerTramuntana,
  fincaCanPaulinoDogResortLlucmajor,
  hospitalVeterinarioAragoPalma,
  hospitalVeterinarioCanisMallorca,
  mallorcaDogTrainerBehaviour,
  petSpaGroomingSantaCatalina,
};

export const MASCOTAS_SERVICES: ServiceItem[] = [
  centroVeterinarioPortalsNous,
  clinicaVeterinariaPortAndratx,
  clinicaVeterinariaSollerTramuntana,
  fincaCanPaulinoDogResortLlucmajor,
  hospitalVeterinarioAragoPalma,
  hospitalVeterinarioCanisMallorca,
  mallorcaDogTrainerBehaviour,
  petSpaGroomingSantaCatalina,
];
