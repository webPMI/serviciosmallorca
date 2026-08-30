import type { ServiceItem } from "../types.ts";
import { bioPestControlMallorcaPalmeras } from "./bio-pest-control-mallorca-palmeras.ts";
import { cristalLimpMallorcaAlturas } from "./cristal-limp-mallorca-alturas.ts";
import { mallorcaCleanAndCareVillas } from "./mallorca-clean-and-care-villas.ts";
import { mudanzasMallorcaExpressTransporte } from "./mudanzas-mallorca-express-transporte.ts";
import { serviciosIntegralesFincasTramuntana } from "./servicios-integrales-fincas-tramuntana.ts";

export {
  bioPestControlMallorcaPalmeras,
  cristalLimpMallorcaAlturas,
  mallorcaCleanAndCareVillas,
  mudanzasMallorcaExpressTransporte,
  serviciosIntegralesFincasTramuntana,
};

export const HOGAR_SERVICES: ServiceItem[] = [
  bioPestControlMallorcaPalmeras,
  cristalLimpMallorcaAlturas,
  mallorcaCleanAndCareVillas,
  mudanzasMallorcaExpressTransporte,
  serviciosIntegralesFincasTramuntana,
];
