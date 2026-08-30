import type { ServiceItem } from "../types.ts";
import { bodega4KilosVinicolaFelanitx } from "./bodega-4-kilos-vinicola-felanitx.ts";
import { bodegaRibasConsellVinos } from "./bodega-ribas-consell-vinos.ts";
import { bodegasJoseLFerrerBinissalem } from "./bodegas-jose-l-ferrer-binissalem.ts";
import { embutidosCanCompanyPorcNegre } from "./embutidos-can-company-porc-negre.ts";
import { florDeSalEsTrenc } from "./flor-de-sal-es-trenc.ts";
import { formatgesDeMallorcaQueseriaArta } from "./formatges-de-mallorca-queseria-arta.ts";
import { ginEvaMallorcaArtisanDistillery } from "./gin-eva-mallorca-artisan-distillery.ts";
import { oliSolivellasAlcudia } from "./oli-solivellas-alcudia.ts";
import { sonMoraguesValldemossaAceite } from "./son-moragues-valldemossa-aceite.ts";

export {
  bodega4KilosVinicolaFelanitx,
  bodegaRibasConsellVinos,
  bodegasJoseLFerrerBinissalem,
  embutidosCanCompanyPorcNegre,
  florDeSalEsTrenc,
  formatgesDeMallorcaQueseriaArta,
  ginEvaMallorcaArtisanDistillery,
  oliSolivellasAlcudia,
  sonMoraguesValldemossaAceite,
};

export const AGRICULTURA_SERVICES: ServiceItem[] = [
  bodega4KilosVinicolaFelanitx,
  bodegaRibasConsellVinos,
  bodegasJoseLFerrerBinissalem,
  embutidosCanCompanyPorcNegre,
  florDeSalEsTrenc,
  formatgesDeMallorcaQueseriaArta,
  ginEvaMallorcaArtisanDistillery,
  oliSolivellasAlcudia,
  sonMoraguesValldemossaAceite,
];
