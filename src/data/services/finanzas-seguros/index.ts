import type { ServiceItem } from "../types.ts";
import { balearicBrokerSegurosYatesVillas } from "./balearic-broker-seguros-yates-villas.ts";
import { lionsgateCapitalMortgageBrokers } from "./lionsgate-capital-mortgage-brokers.ts";
import { mallorcaMortgagesInternationalBuyers } from "./mallorca-mortgages-international-buyers.ts";
import { sanitasSaludInternacionalMallorca } from "./sanitas-salud-internacional-mallorca.ts";
import { wealthManagementTaxMallorca } from "./wealth-management-tax-mallorca.ts";

export {
  balearicBrokerSegurosYatesVillas,
  lionsgateCapitalMortgageBrokers,
  mallorcaMortgagesInternationalBuyers,
  sanitasSaludInternacionalMallorca,
  wealthManagementTaxMallorca,
};

export const FINANZAS_SERVICES: ServiceItem[] = [
  balearicBrokerSegurosYatesVillas,
  lionsgateCapitalMortgageBrokers,
  mallorcaMortgagesInternationalBuyers,
  sanitasSaludInternacionalMallorca,
  wealthManagementTaxMallorca,
];
