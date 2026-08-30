import type { ServiceItem } from "../types.ts";
import { bilingualNanniesVillasMallorca } from "./bilingual-nannies-villas-mallorca.ts";
import { cuidadoYSaludMallorcaCare } from "./cuidado-y-salud-mallorca-care.ts";
import { guarderiaBilingueSantaCatalina } from "./guarderia-bilingue-santa-catalina.ts";
import { mallorcaHomeNursingCare } from "./mallorca-home-nursing-care.ts";
import { residenciaSeniorValldemossaLuxury } from "./residencia-senior-valldemossa-luxury.ts";

export {
  bilingualNanniesVillasMallorca,
  cuidadoYSaludMallorcaCare,
  guarderiaBilingueSantaCatalina,
  mallorcaHomeNursingCare,
  residenciaSeniorValldemossaLuxury,
};

export const SOCIALES_SERVICES: ServiceItem[] = [
  bilingualNanniesVillasMallorca,
  cuidadoYSaludMallorcaCare,
  guarderiaBilingueSantaCatalina,
  mallorcaHomeNursingCare,
  residenciaSeniorValldemossaLuxury,
];
