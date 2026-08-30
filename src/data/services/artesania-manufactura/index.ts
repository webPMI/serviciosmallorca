import type { ServiceItem } from "../types.ts";
import { carminaShoemakerIncaPalma } from "./carmina-shoemaker-inca-palma.ts";
import { ceramicaTerraCuitaPortol } from "./ceramica-terra-cuita-portol.ts";
import { lafioreVidrioArtesanal } from "./lafiore-vidrio-artesanal.ts";
import { pedraDeSantanyiCanteresArtesanes } from "./pedra-de-santanyi-canteres-artesanes.ts";
import { teixitsVicensArtesaniaPollensa } from "./teixits-vicens-artesania-pollensa.ts";
import { vidriosGordiola } from "./vidrios-gordiola-algaida.ts";

export {
  carminaShoemakerIncaPalma,
  ceramicaTerraCuitaPortol,
  lafioreVidrioArtesanal,
  pedraDeSantanyiCanteresArtesanes,
  teixitsVicensArtesaniaPollensa,
  vidriosGordiola,
};

export const ARTESANIA_SERVICES: ServiceItem[] = [
  carminaShoemakerIncaPalma,
  ceramicaTerraCuitaPortol,
  lafioreVidrioArtesanal,
  pedraDeSantanyiCanteresArtesanes,
  teixitsVicensArtesaniaPollensa,
  vidriosGordiola,
];
