import type { ServiceItem } from "../types.ts";
import { dinsSantiTaura } from "./dins-santi-taura.ts";
import { caNEduardo } from "./ca-n-eduardo.ts";
import { adrianQuetglas } from "./adrian-quetglas.ts";
import { caNaToneta } from "./ca-na-toneta.ts";
import { vandalPalma } from "./vandal-palma.ts";
import { elCaminoPalma } from "./el-camino.ts";
import { fornDeSantJoan } from "./forn-de-sant-joan.ts";
import { restauranteFlanigan } from "./restaurante-flanigan.ts";
import { restauranteMarcFosh } from "./restaurante-marc-fosh.ts";
import { bensDavall } from "./bens-davall.ts";
import { barBosch } from "./bar-bosch.ts";
import { cellerSaPremsa } from "./celler-sa-premsa.ts";
import { cellerCanAmer } from "./celler-can-amer.ts";
import { fornDeLaSoca } from "./forn-de-la-soca.ts";
import { bodegaRibas } from "./bodega-ribas.ts";
import { ilTanoSantaCatalina } from "./il-tano-santa-catalina.ts";
import { canMiquelPalma } from "./can-miquel-palma.ts";
import { fornFondoPalma } from "./forn-fondo-palma.ts";
import { carniceriaCaNaFina } from "./carniceria-ca-na-fina-soller.ts";
import { fornSantFrancesc } from "./forn-sant-francesc-inca.ts";
import { bodegasJoseLFerrer } from "./bodegas-jose-l-ferrer.ts";
import { canPomar } from "./can-pomar-campos.ts";
import { bodegaBiniagual } from "./bodega-biniagual.ts";
import { canCompany } from "./can-company-sineu.ts";
import { formatgesSaCanova } from "./formatges-sa-canova-campos.ts";
import { oliDeJornets } from "./oli-de-jornets-sencelles.ts";
import { bodegaCastellMiquel } from "./bodega-castell-miquel.ts";
import { fornDesTeatre } from "./forn-des-teatre-palma.ts";
import { carniceriaCanMatas } from "./carniceria-can-matas-soller.ts";
import { cellerCanRipoll } from "./celler-can-ripoll-inca.ts";
import { fornGelabertLlubi } from "./forn-gelabert-llubi.ts";
import { carniceriaCanToni } from "./carniceria-can-toni-porreres.ts";
import { fornSaPelleteria } from "./forn-sa-pelleteria-palma.ts";
import { bodegaSonPrim } from "./bodega-son-prim-sencelles.ts";
import { cellerCanMarron } from "./celler-can-marron-inca.ts";
import { fornCanGelabertBinissalem } from "./forn-can-gelabert-binissalem.ts";
import { carniceriaCanXarrier } from "./carniceria-can-xarrier-algaida.ts";
import { carniceriaCanXim } from "./carniceria-can-xim-alaro.ts";
import { cellerEsCellerPetra } from "./celler-es-celler-petra.ts";
import { fornCanPacoCampos } from "./forn-can-paco-campos.ts";
import { restauranteCanPedro } from "./restaurante-can-pedro-genova.ts";
import { fornNouMuro } from "./forn-nou-muro.ts";
import { restauranteZaranda } from "./restaurante-zaranda.ts";
import { restauranteMacaDeCastro } from "./restaurante-maca-de-castro.ts";
import { restauranteAndreuGenestra } from "./restaurante-andreu-genestra.ts";
import { restauranteToquePalma } from "./restaurante-toque-palma.ts";
import { restauranteOlaDelMar } from "./restaurante-ola-del-mar.ts";
import { restauranteEmilioInnobar } from "./restaurante-emilio-innobar.ts";
import { restauranteDukePalma } from "./restaurante-duke-palma.ts";
import { restauranteRitziPortals } from "./restaurante-ritzi-portals.ts";
import { restauranteBaibenPortals } from "./restaurante-baiben-portals.ts";
import { restauranteCoastByEast } from "./restaurante-coast-by-east.ts";
import { restauranteMarDeNudos } from "./restaurante-mar-de-nudos.ts";
import { restauranteAromataPalma } from "./restaurante-aromata-palma.ts";
import { restauranteStagierBar } from "./restaurante-stagier-bar.ts";
import { restauranteLasTerrazasBendinat } from "./restaurante-las-terrazas-bendinat.ts";
import { marYMarPeguera } from "./mar-y-mar-peguera.ts";
import { laHaciendaPeguera } from "./la-hacienda-peguera.ts";
import { stayPortDePollenca } from "./stay-port-de-pollenca.ts";
import { canBoquetaSoller } from "./can-boqueta-soller.ts";
import { trespaisPortAndratx } from "./trespais-port-andratx.ts";
import { laTerrazaAlcanada } from "./la-terraza-alcanada.ts";
import { vinoDelMarPortAdriano } from "./vino-del-mar-port-adriano.ts";
import { lasOlasSantaPonsa } from "./las-olas-santa-ponsa.ts";
import { casXorcSoller } from "./cas-xorc-soller.ts";
import { namaDeia } from "./nama-deia.ts";
import { pastisseriaCanMolinasValldemossa } from "./pastisseria-can-molinas-valldemossa.ts";
import { terraePortDePollenca } from "./terrae-port-de-pollenca.ts";
import { laudatSantanyi } from "./laudat-santanyi.ts";
import { portPetitCalaDor } from "./port-petit-cala-dor.ts";
import { feraPalma } from "./fera-palma.ts";
import { miceliSelva } from "./miceli-selva.ts";
import { bodegasMaciaBatle } from "./bodegas-macia-batle.ts";
import { porxadaDeSaTorreCanyamel } from "./porxada-de-sa-torre-canyamel.ts";
import { bodegasVinsMiquelGelabert } from "./bodegas-vins-miquel-gelabert.ts";
import { caNantunaFornalutx } from "./ca-nantuna-fornalutx.ts";
import { fetASollerFabricaGelats } from "./fet-a-soller-fabrica-gelats.ts";
import { esVergerAlaro } from "./es-verger-alaro.ts";

export {
  esVergerAlaro,
  caNantunaFornalutx,
  fetASollerFabricaGelats,
  porxadaDeSaTorreCanyamel,
  bodegasVinsMiquelGelabert,
  feraPalma,
  miceliSelva,
  bodegasMaciaBatle,
  terraePortDePollenca,
  laudatSantanyi,
  portPetitCalaDor,
  casXorcSoller,
  namaDeia,
  pastisseriaCanMolinasValldemossa,
  vinoDelMarPortAdriano,
  lasOlasSantaPonsa,
  trespaisPortAndratx,
  laTerrazaAlcanada,
  stayPortDePollenca,
  canBoquetaSoller,
  marYMarPeguera,
  laHaciendaPeguera,
  restauranteToquePalma,
  dinsSantiTaura,
  caNEduardo,
  adrianQuetglas,
  caNaToneta,
  vandalPalma,
  elCaminoPalma,
  fornDeSantJoan,
  restauranteFlanigan,
  restauranteMarcFosh,
  bensDavall,
  barBosch,
  cellerSaPremsa,
  cellerCanAmer,
  fornDeLaSoca,
  bodegaRibas,
  ilTanoSantaCatalina,
  canMiquelPalma,
  fornFondoPalma,
  carniceriaCaNaFina,
  fornSantFrancesc,
  bodegasJoseLFerrer,
  canPomar,
  bodegaBiniagual,
  canCompany,
  formatgesSaCanova,
  oliDeJornets,
  bodegaCastellMiquel,
  fornDesTeatre,
  carniceriaCanMatas,
  cellerCanRipoll,
  fornGelabertLlubi,
  carniceriaCanToni,
  fornSaPelleteria,
  bodegaSonPrim,
  cellerCanMarron,
  fornCanGelabertBinissalem,
  carniceriaCanXarrier,
  carniceriaCanXim,
  cellerEsCellerPetra,
  fornCanPacoCampos,
  restauranteCanPedro,
  fornNouMuro,
  restauranteZaranda,
  restauranteMacaDeCastro,
  restauranteAndreuGenestra,
  restauranteOlaDelMar,
  restauranteEmilioInnobar,
  restauranteDukePalma,
  restauranteRitziPortals,
  restauranteBaibenPortals,
  restauranteCoastByEast,
  restauranteMarDeNudos,
  restauranteAromataPalma,
  restauranteStagierBar,
  restauranteLasTerrazasBendinat,
};

/**
 * Catálogo Sectorial: Hostelería, Gastronomía & Restaurantes de Alta Cocina.
 * Negocios 100% reales y verificados bajo la regla estricta Zero Fake Data (GR-11).
 */
export const RESTAURANT_SERVICES: ServiceItem[] = [
  dinsSantiTaura,
  caNEduardo,
  adrianQuetglas,
  caNaToneta,
  vandalPalma,
  elCaminoPalma,
  fornDeSantJoan,
  restauranteFlanigan,
  restauranteMarcFosh,
  bensDavall,
  barBosch,
  cellerSaPremsa,
  cellerCanAmer,
  fornDeLaSoca,
  bodegaRibas,
  ilTanoSantaCatalina,
  canMiquelPalma,
  fornFondoPalma,
  carniceriaCaNaFina,
  fornSantFrancesc,
  bodegasJoseLFerrer,
  canPomar,
  bodegaBiniagual,
  canCompany,
  formatgesSaCanova,
  oliDeJornets,
  bodegaCastellMiquel,
  fornDesTeatre,
  carniceriaCanMatas,
  cellerCanRipoll,
  fornGelabertLlubi,
  carniceriaCanToni,
  fornSaPelleteria,
  bodegaSonPrim,
  cellerCanMarron,
  fornCanGelabertBinissalem,
  carniceriaCanXarrier,
  carniceriaCanXim,
  cellerEsCellerPetra,
  fornCanPacoCampos,
  restauranteCanPedro,
  fornNouMuro,
  restauranteZaranda,
  restauranteMacaDeCastro,
  restauranteAndreuGenestra,
  restauranteToquePalma,
  restauranteOlaDelMar,
  restauranteEmilioInnobar,
  restauranteDukePalma,
  restauranteRitziPortals,
  restauranteBaibenPortals,
  restauranteCoastByEast,
  restauranteMarDeNudos,
  restauranteAromataPalma,
  restauranteStagierBar,
  restauranteLasTerrazasBendinat,
  marYMarPeguera,
  laHaciendaPeguera,
  stayPortDePollenca,
  canBoquetaSoller,
  trespaisPortAndratx,
  laTerrazaAlcanada,
  vinoDelMarPortAdriano,
  lasOlasSantaPonsa,
  casXorcSoller,
  namaDeia,
  pastisseriaCanMolinasValldemossa,
  terraePortDePollenca,
  laudatSantanyi,
  portPetitCalaDor,
  feraPalma,
  miceliSelva,
  bodegasMaciaBatle,
  porxadaDeSaTorreCanyamel,
  bodegasVinsMiquelGelabert,
  caNantunaFornalutx,
  fetASollerFabricaGelats,
  esVergerAlaro,
];
