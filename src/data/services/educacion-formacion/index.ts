import type { ServiceItem } from "../types.ts";
import { agoraPortalsInternationalSchool } from "./agora-portals-international-school.ts";
import { euroaulaDeutscheSprachschulePalma } from "./euroaula-deutsche-sprachschule-palma.ts";
import { kingRichardThirdCollegePortals } from "./king-richard-third-college-portals.ts";
import { palmaBusinessSchoolExecutive } from "./palma-business-school-executive.ts";
import { theBritishSchoolOfMallorca } from "./the-british-school-of-mallorca.ts";

export {
  agoraPortalsInternationalSchool,
  euroaulaDeutscheSprachschulePalma,
  kingRichardThirdCollegePortals,
  palmaBusinessSchoolExecutive,
  theBritishSchoolOfMallorca,
};

export const EDUCACION_SERVICES: ServiceItem[] = [
  agoraPortalsInternationalSchool,
  euroaulaDeutscheSprachschulePalma,
  kingRichardThirdCollegePortals,
  palmaBusinessSchoolExecutive,
  theBritishSchoolOfMallorca,
];
