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
import { cassaiBeachHouse } from "./cassai-beach-house-colonia-sant-jordi.ts";
import { puraVidaCalaFiguera } from "./pura-vida-cala-figuera.ts";
import { esGuixEscorca } from "./es-guix-escorca.ts";
import { saLlotjaPortocolom } from "./sa-llotja-portocolom.ts";
import { bodegaCanVidalet } from "./bodega-can-vidalet-pollensa.ts";
import { losPatosPlayaMuro } from "./los-patos-playa-muro.ts";
import { caNignasiInca } from "./ca-nignasi-inca.ts";
import { restauranteGolfAlcanada } from "./restaurante-golf-alcanada.ts";
import { laCantinaClubNauticCalaRatjada } from "./la-cantina-club-nautic-cala-ratjada.ts";
import { canNofrePalma } from "./can-nofre-palma.ts";
import { cellerSaTravessa } from "./celler-sa-travessa-inca.ts";
import { bodegasAngelSantaMaria } from "./bodegas-angel-santa-maria.ts";
import { sieteFuegosSantaPonsa } from "./siete-fuegos-santa-ponsa.ts";
import { canCostaValldemossa } from "./can-costa-valldemossa.ts";
import { bodegasVinyesMortitx } from "./bodegas-vinyes-mortitx.ts";
import { bodegaBarahonaCasaManolo } from "./bodega-barahona-casa-manolo.ts";
import { restauranteClubNauticArenal } from "./restaurante-club-nautic-arenal.ts";
import { elBungalowCiudadJardin } from "./el-bungalow-ciudad-jardin.ts";
import { elCastilloDelBosque } from "./el-castillo-del-bosque-felanitx.ts";
import { saCuinaDeNainaSencelles } from "./sa-cuina-de-naina-sencelles.ts";
import { canPintxoSoller } from "./can-pintxo-soller.ts";
import { canMarchManacor } from "./can-march-manacor.ts";
import { bodegasBordoyLlucmajor } from "./bodegas-bordoy-llucmajor.ts";
import { canTorratPlayaPalma } from "./can-torrat-playa-palma.ts";
import { canJoanDeSAigoPalma } from "./can-joan-de-saigo-palma.ts";
import { saTorreSantaEugenia } from "./sa-torre-santa-eugenia.ts";
import { quinceCantinaPortoCristo } from "./quince-cantina-porto-cristo.ts";
import { bodegasButxetMuro } from "./bodegas-butxet-muro.ts";
import { bodegasCanMajoralAlgaida } from "./bodegas-can-majoral-algaida.ts";
import { barEspanyaPalma } from "./bar-espanya-palma.ts";
import { bodegasCanColetoPetra } from "./bodegas-can-coleto-petra.ts";
import { restauranteClubNauticSaRapita } from "./restaurante-club-nautic-sa-rapita.ts";
import { restauranteSonFlorianaCalaBona } from "./restaurante-son-floriana-cala-bona.ts";
import { restauranteClubNauticPortocolom } from "./restaurante-club-nautic-portocolom.ts";
import { bodegasSonRamonLlubi } from "./bodegas-son-ramon-llubi.ts";
import { restauranteClubNauticCanPicafort } from "./restaurante-club-nautic-can-picafort.ts";
import { cellerEsMoliSantanyi } from "./celler-es-moli-santanyi.ts";
import { bodegasSebastiaPastorSantaMaria } from "./bodegas-sebastia-pastor-santa-maria.ts";
import { restauranteClubNauticCalaGamba } from "./restaurante-club-nautic-cala-gamba.ts";
import { restauranteSaVinyaEsCapdella } from "./restaurante-sa-vinya-es-capdella.ts";
import { bodegasViReiLlucmajor } from "./bodegas-vi-rei-llucmajor.ts";
import { restauranteRcnPortPollenca } from "./restaurante-rcn-port-pollenca.ts";
import { cellerSaVinyaBinissalem } from "./celler-sa-vinya-binissalem.ts";
import { bodegasRamanyaSantaMaria } from "./bodegas-ramanya-santa-maria.ts";
import { restauranteSaRoquetaPortixol } from "./restaurante-sa-roqueta-portixol.ts";
import { cellerElMoliPollenca } from "./celler-el-moli-pollenca.ts";
import { bodegasJaumeDePuntiroSantaMaria } from "./bodegas-jaume-de-puntiro-santa-maria.ts";
import { restauranteEsCanyisPortSoller } from "./restaurante-es-canyis-port-soller.ts";
import { bodegasTiannaNegreBinissalem } from "./bodegas-tianna-negre-binissalem.ts";
import { restauranteElPenon1957Palma } from "./restaurante-el-penon-1957-palma.ts";
import { restauranteClubNauticSEstanyol } from "./restaurante-club-nautic-s-estanyol.ts";
import { restauranteCanTroncaSantJoan } from "./restaurante-can-tronca-sant-joan.ts";
import { bodegasSonBordilsInca } from "./bodegas-son-bordils-inca.ts";
import { restauranteCmSanAntonioCanPastilla } from "./restaurante-cm-san-antonio-can-pastilla.ts";
import { cellerPagesPalma } from "./celler-pages-palma.ts";
import { bodegasSonVivesBanyalbufar } from "./bodegas-son-vives-banyalbufar.ts";
import { restauranteClubNauticPortoCristo } from "./restaurante-club-nautic-porto-cristo.ts";
import { restauranteCaNOlesaPollenca } from "./restaurante-ca-n-olesa-pollenca.ts";
import { bodegasCanFeliuPorreres } from "./bodegas-can-feliu-porreres.ts";
import { restauranteCnColoniaSantPere } from "./restaurante-cn-colonia-sant-pere.ts";
import { cellerSonToreoSineu } from "./celler-son-toreo-sineu.ts";
import { bodegasSonPuigPuigpunyent } from "./bodegas-son-puig-puigpunyent.ts";
import { restauranteClubNauticPortitxol } from "./restaurante-club-nautic-portitxol.ts";
import { cellerSaSiniSantaMaria } from "./celler-sa-sini-santa-maria.ts";
import { bodegasOliverMoraguesAlgaida } from "./bodegas-oliver-moragues-algaida.ts";
import { restauranteClubDeVelaPortAndratx } from "./restaurante-club-de-vela-port-andratx.ts";
import { restauranteMiramarPortAlcudia } from "./restaurante-miramar-port-alcudia.ts";
import { bodegasVinsNadalBinissalem } from "./bodegas-vins-nadal-binissalem.ts";
import { restauranteCnCalaRatjada } from "./restaurante-cn-cala-ratjada.ts";
import { restauranteMarIVentBanyalbufar } from "./restaurante-mar-i-vent-banyalbufar.ts";
import { bodegasCondeDeSuyrotColoniaSantPere } from "./bodegas-conde-de-suyrot-colonia-sant-pere.ts";
import { restauranteCnCanPicafort } from "./restaurante-cn-can-picafort.ts";
import { cellerSaFondaMuro } from "./celler-sa-fonda-muro.ts";
import { bodegasEsVergerEsporles } from "./bodegas-es-verger-esporles.ts";
import { restauranteYachtClubCalaDor } from "./restaurante-yacht-club-cala-dor.ts";
import { cellerCanFontSineu } from "./celler-can-font-sineu.ts";
import { bodegasSonCampanerSencelles } from "./bodegas-son-campaner-sencelles.ts";
import { restauranteClubDeMarPalma } from "./restaurante-club-de-mar-palma.ts";
import { restauranteCaNAmerLloseta } from "./restaurante-ca-n-amer-lloseta.ts";
import { bodegasSonJulianaSantaEugenia } from "./bodegas-son-juliana-santa-eugenia.ts";
import { restauranteCnArenal } from "./restaurante-cn-arenal.ts";
import { restauranteCnPortocolom } from "./restaurante-cn-portocolom.ts";
import { bodegasCanAxartellPollenca } from "./bodegas-can-axartell-pollenca.ts";

export {
  restauranteCnArenal,
  restauranteCnPortocolom,
  bodegasCanAxartellPollenca,
  restauranteClubDeMarPalma,
  restauranteCaNAmerLloseta,
  bodegasSonJulianaSantaEugenia,
  restauranteYachtClubCalaDor,
  cellerCanFontSineu,
  bodegasSonCampanerSencelles,
  restauranteCnCanPicafort,
  cellerSaFondaMuro,
  bodegasEsVergerEsporles,
  restauranteCnCalaRatjada,
  restauranteMarIVentBanyalbufar,
  bodegasCondeDeSuyrotColoniaSantPere,
  restauranteClubDeVelaPortAndratx,
  restauranteMiramarPortAlcudia,
  bodegasVinsNadalBinissalem,
  restauranteClubNauticPortitxol,
  cellerSaSiniSantaMaria,
  bodegasOliverMoraguesAlgaida,
  restauranteCnColoniaSantPere,
  cellerSonToreoSineu,
  bodegasSonPuigPuigpunyent,
  restauranteClubNauticPortoCristo,
  restauranteCaNOlesaPollenca,
  bodegasCanFeliuPorreres,
  restauranteCmSanAntonioCanPastilla,
  cellerPagesPalma,
  bodegasSonVivesBanyalbufar,
  restauranteClubNauticSEstanyol,
  restauranteCanTroncaSantJoan,
  bodegasSonBordilsInca,
  restauranteEsCanyisPortSoller,
  bodegasTiannaNegreBinissalem,
  restauranteElPenon1957Palma,
  restauranteSaRoquetaPortixol,
  cellerElMoliPollenca,
  bodegasJaumeDePuntiroSantaMaria,
  restauranteRcnPortPollenca,
  cellerSaVinyaBinissalem,
  bodegasRamanyaSantaMaria,
  restauranteClubNauticCalaGamba,
  restauranteSaVinyaEsCapdella,
  bodegasViReiLlucmajor,
  restauranteClubNauticCanPicafort,
  cellerEsMoliSantanyi,
  bodegasSebastiaPastorSantaMaria,
  restauranteSonFlorianaCalaBona,
  restauranteClubNauticPortocolom,
  bodegasSonRamonLlubi,
  barEspanyaPalma,
  bodegasCanColetoPetra,
  restauranteClubNauticSaRapita,
  quinceCantinaPortoCristo,
  bodegasButxetMuro,
  bodegasCanMajoralAlgaida,
  canTorratPlayaPalma,
  canJoanDeSAigoPalma,
  saTorreSantaEugenia,
  canPintxoSoller,
  canMarchManacor,
  bodegasBordoyLlucmajor,
  elBungalowCiudadJardin,
  elCastilloDelBosque,
  saCuinaDeNainaSencelles,
  bodegasVinyesMortitx,
  bodegaBarahonaCasaManolo,
  restauranteClubNauticArenal,
  bodegasAngelSantaMaria,
  sieteFuegosSantaPonsa,
  canCostaValldemossa,
  laCantinaClubNauticCalaRatjada,
  canNofrePalma,
  cellerSaTravessa,
  losPatosPlayaMuro,
  caNignasiInca,
  restauranteGolfAlcanada,
  esGuixEscorca,
  saLlotjaPortocolom,
  bodegaCanVidalet,
  cassaiBeachHouse,
  puraVidaCalaFiguera,
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
  cassaiBeachHouse,
  puraVidaCalaFiguera,
  esGuixEscorca,
  saLlotjaPortocolom,
  bodegaCanVidalet,
  losPatosPlayaMuro,
  caNignasiInca,
  restauranteGolfAlcanada,
  laCantinaClubNauticCalaRatjada,
  canNofrePalma,
  cellerSaTravessa,
  bodegasAngelSantaMaria,
  sieteFuegosSantaPonsa,
  canCostaValldemossa,
  bodegasVinyesMortitx,
  bodegaBarahonaCasaManolo,
  restauranteClubNauticArenal,
  elBungalowCiudadJardin,
  elCastilloDelBosque,
  saCuinaDeNainaSencelles,
  canPintxoSoller,
  canMarchManacor,
  bodegasBordoyLlucmajor,
  canTorratPlayaPalma,
  canJoanDeSAigoPalma,
  saTorreSantaEugenia,
  quinceCantinaPortoCristo,
  bodegasButxetMuro,
  bodegasCanMajoralAlgaida,
  barEspanyaPalma,
  bodegasCanColetoPetra,
  restauranteClubNauticSaRapita,
  restauranteSonFlorianaCalaBona,
  restauranteClubNauticPortocolom,
  bodegasSonRamonLlubi,
  restauranteClubNauticCanPicafort,
  cellerEsMoliSantanyi,
  bodegasSebastiaPastorSantaMaria,
  restauranteClubNauticCalaGamba,
  restauranteSaVinyaEsCapdella,
  bodegasViReiLlucmajor,
  restauranteRcnPortPollenca,
  cellerSaVinyaBinissalem,
  bodegasRamanyaSantaMaria,
  restauranteSaRoquetaPortixol,
  cellerElMoliPollenca,
  bodegasJaumeDePuntiroSantaMaria,
  restauranteEsCanyisPortSoller,
  bodegasTiannaNegreBinissalem,
  restauranteElPenon1957Palma,
  restauranteClubNauticSEstanyol,
  restauranteCanTroncaSantJoan,
  bodegasSonBordilsInca,
  restauranteCmSanAntonioCanPastilla,
  cellerPagesPalma,
  bodegasSonVivesBanyalbufar,
  restauranteClubNauticPortoCristo,
  restauranteCaNOlesaPollenca,
  bodegasCanFeliuPorreres,
  restauranteCnColoniaSantPere,
  cellerSonToreoSineu,
  bodegasSonPuigPuigpunyent,
  restauranteClubNauticPortitxol,
  cellerSaSiniSantaMaria,
  bodegasOliverMoraguesAlgaida,
  restauranteClubDeVelaPortAndratx,
  restauranteMiramarPortAlcudia,
  bodegasVinsNadalBinissalem,
  restauranteCnCalaRatjada,
  restauranteMarIVentBanyalbufar,
  bodegasCondeDeSuyrotColoniaSantPere,
  restauranteCnCanPicafort,
  cellerSaFondaMuro,
  bodegasEsVergerEsporles,
  restauranteYachtClubCalaDor,
  cellerCanFontSineu,
  bodegasSonCampanerSencelles,
  restauranteClubDeMarPalma,
  restauranteCaNAmerLloseta,
  bodegasSonJulianaSantaEugenia,
  restauranteCnArenal,
  restauranteCnPortocolom,
  bodegasCanAxartellPollenca,
];
