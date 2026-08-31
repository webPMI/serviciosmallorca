import type { ServiceItem } from "../types.ts";
import { adrianQuetglas } from "./adrian-quetglas.ts";
import { barBosch } from "./bar-bosch.ts";
import { barEspanyaPalma } from "./bar-espanya-palma.ts";
import { barSHostalMontuiri } from "./bar-s-hostal-montuiri.ts";
import { beach_club_illetes_mhares_sea_club_calvia } from "./beach-club-illetes-mhares-sea-club-calvia.ts";
import { bensDavall } from "./bens-davall.ts";
import { bodegaBarahonaCasaManolo } from "./bodega-barahona-casa-manolo.ts";
import { bodegaBiniagual } from "./bodega-biniagual.ts";
import { bodegaCanVidalet } from "./bodega-can-vidalet-pollensa.ts";
import { bodegaCastellMiquel } from "./bodega-castell-miquel.ts";
import { bodegaSonPrim } from "./bodega-son-prim-sencelles.ts";
import { bodegas7103PetitCellerSantaMaria } from "./bodegas-7103-petit-celler-santa-maria.ts";
import { bodegasAngelSantaMaria } from "./bodegas-angel-santa-maria.ts";
import { bodegasAvaViSencelles } from "./bodegas-ava-vi-sencelles.ts";
import { bodegasBordoyLlucmajor } from "./bodegas-bordoy-llucmajor.ts";
import { bodegasButxetMuro } from "./bodegas-butxet-muro.ts";
import { bodegasCanAxartellPollenca } from "./bodegas-can-axartell-pollenca.ts";
import { bodegasCanColetoPetra } from "./bodegas-can-coleto-petra.ts";
import { bodegasCanFeliuPorreres } from "./bodegas-can-feliu-porreres.ts";
import { bodegasCanMajoralAlgaida } from "./bodegas-can-majoral-algaida.ts";
import { bodegasCanRamisSencelles } from "./bodegas-can-ramis-sencelles.ts";
import { bodegasCanVerduraBinissalem } from "./bodegas-can-verdura-binissalem.ts";
import { bodegasCanXanetPollensa } from "./bodegas-can-xanet-pollensa.ts";
import { bodegasCondeDeSuyrotColoniaSantPere } from "./bodegas-conde-de-suyrot-colonia-sant-pere.ts";
import { bodegasEsVergerEsporles } from "./bodegas-es-verger-esporles.ts";
import { bodegasGalmesIRibotSantaMargalida } from "./bodegas-galmes-i-ribot-santa-margalida.ts";
import { bodegasJaumeDePuntiroSantaMaria } from "./bodegas-jaume-de-puntiro-santa-maria.ts";
import { bodegasJoseLFerrer } from "./bodegas-jose-l-ferrer.ts";
import { bodegasMaciaBatle } from "./bodegas-macia-batle.ts";
import { bodegasMesquidaMoraPorreres } from "./bodegas-mesquida-mora-porreres.ts";
import { bodegasOliverMoraguesAlgaida } from "./bodegas-oliver-moragues-algaida.ts";
import { bodegasRamanyaSantaMaria } from "./bodegas-ramanya-santa-maria.ts";
import { bodegasSantaCatarinaSencelles } from "./bodegas-santa-catarina-sencelles.ts";
import { bodegasSebastiaPastorSantaMaria } from "./bodegas-sebastia-pastor-santa-maria.ts";
import { bodegasSonArtiguesPorreres } from "./bodegas-son-artigues-porreres.ts";
import { bodegasSonBordilsInca } from "./bodegas-son-bordils-inca.ts";
import { bodegasSonCampanerSencelles } from "./bodegas-son-campaner-sencelles.ts";
import { bodegasSonJulianaSantaEugenia } from "./bodegas-son-juliana-santa-eugenia.ts";
import { bodegasSonPuigPuigpunyent } from "./bodegas-son-puig-puigpunyent.ts";
import { bodegasSonRamonLlubi } from "./bodegas-son-ramon-llubi.ts";
import { bodegasSonVivesBanyalbufar } from "./bodegas-son-vives-banyalbufar.ts";
import { bodegasTiannaNegreBinissalem } from "./bodegas-tianna-negre-binissalem.ts";
import { bodegasViReiLlucmajor } from "./bodegas-vi-rei-llucmajor.ts";
import { bodegasVinaTaujanaSantaEugenia } from "./bodegas-vina-taujana-santa-eugenia.ts";
import { bodegasVinsMiquelGelabert } from "./bodegas-vins-miquel-gelabert.ts";
import { bodegasVinsNadalBinissalem } from "./bodegas-vins-nadal-binissalem.ts";
import { bodegasVinsToniGelabertManacor } from "./bodegas-vins-toni-gelabert-manacor.ts";
import { bodegasVinyesMortitx } from "./bodegas-vinyes-mortitx.ts";
import { caNEduardo } from "./ca-n-eduardo.ts";
import { caNaToneta } from "./ca-na-toneta.ts";
import { caNantunaFornalutx } from "./ca-nantuna-fornalutx.ts";
import { caNignasiInca } from "./ca-nignasi-inca.ts";
import { canBoquetaSoller } from "./can-boqueta-soller.ts";
import { canCompany } from "./can-company-sineu.ts";
import { canCostaValldemossa } from "./can-costa-valldemossa.ts";
import { canJoanDeSAigoPalma } from "./can-joan-de-saigo-palma.ts";
import { canMarchManacor } from "./can-march-manacor.ts";
import { canMiquelPalma } from "./can-miquel-palma.ts";
import { canNofrePalma } from "./can-nofre-palma.ts";
import { canPintxoSoller } from "./can-pintxo-soller.ts";
import { canPomar } from "./can-pomar-campos.ts";
import { canTorratPlayaPalma } from "./can-torrat-playa-palma.ts";
import { carniceriaCaNaFina } from "./carniceria-ca-na-fina-soller.ts";
import { carniceriaCanMatas } from "./carniceria-can-matas-soller.ts";
import { carniceriaCanToni } from "./carniceria-can-toni-porreres.ts";
import { carniceriaCanXarrier } from "./carniceria-can-xarrier-algaida.ts";
import { carniceriaCanXim } from "./carniceria-can-xim-alaro.ts";
import { casXorcSoller } from "./cas-xorc-soller.ts";
import { casaJacintoGenovaBrasas } from "./casa-jacinto-genova-brasas.ts";
import { cassaiBeachHouse } from "./cassai-beach-house-colonia-sant-jordi.ts";
import { cellerBarRandaAlgaida } from "./celler-bar-randa-algaida.ts";
import { cellerCaNIgnasiInca } from "./celler-ca-n-ignasi-inca.ts";
import { cellerCanAmer } from "./celler-can-amer.ts";
import { cellerCanCarrossaLloseta } from "./celler-can-carrossa-lloseta.ts";
import { cellerCanFontSineu } from "./celler-can-font-sineu.ts";
import { cellerCanMarron } from "./celler-can-marron-inca.ts";
import { cellerCanRipoll } from "./celler-can-ripoll-inca.ts";
import { celler_can_verdura_binissalem_vins_autoctons } from "./celler-can-verdura-binissalem-vins-autoctons.ts";
import { cellerElMoliPollenca } from "./celler-el-moli-pollenca.ts";
import { cellerEsCellerPetra } from "./celler-es-celler-petra.ts";
import { cellerEsMoliSantanyi } from "./celler-es-moli-santanyi.ts";
import { cellerPagesPalma } from "./celler-pages-palma.ts";
import { cellerSaFondaMuro } from "./celler-sa-fonda-muro.ts";
import { cellerSaPlacaLloseta } from "./celler-sa-placa-lloseta.ts";
import { cellerSaPremsa } from "./celler-sa-premsa.ts";
import { cellerSaSiniSantaMaria } from "./celler-sa-sini-santa-maria.ts";
import { cellerSaTravessaInca } from "./celler-sa-travessa-inca.ts";
import { cellerSaVinyaBinissalem } from "./celler-sa-vinya-binissalem.ts";
import { celler_son_sant_marti_muro_tradicional } from "./celler-son-sant-marti-muro-tradicional.ts";
import { cellerSonToreoSineu } from "./celler-son-toreo-sineu.ts";
import { dinsSantiTaura } from "./dins-santi-taura.ts";
import { elBungalowCiudadJardin } from "./el-bungalow-ciudad-jardin.ts";
import { elCaminoTapasBarPalma } from "./el-camino-tapas-bar-palma.ts";
import { elCaminoPalma } from "./el-camino.ts";
import { elCastilloDelBosque } from "./el-castillo-del-bosque-felanitx.ts";
import { esGuixEscorca } from "./es-guix-escorca.ts";
import { esVergerAlaro } from "./es-verger-alaro.ts";
import { feraPalma } from "./fera-palma.ts";
import { fetASollerFabricaGelats } from "./fet-a-soller-fabrica-gelats.ts";
import { formatgesSaCanova } from "./formatges-sa-canova-campos.ts";
import { fornCanGelabertBinissalem } from "./forn-can-gelabert-binissalem.ts";
import { fornCanPacoCampos } from "./forn-can-paco-campos.ts";
import { fornDeLaSoca } from "./forn-de-la-soca.ts";
import { fornDeSantJoan } from "./forn-de-sant-joan.ts";
import { fornDesTeatre } from "./forn-des-teatre-palma.ts";
import { fornFondoPalma } from "./forn-fondo-palma.ts";
import { forn_fondo_pasteleria_historica_palma } from "./forn-fondo-pasteleria-historica-palma.ts";
import { fornGelabertLlubi } from "./forn-gelabert-llubi.ts";
import { fornNouMuro } from "./forn-nou-muro.ts";
import { fornSaPelleteria } from "./forn-sa-pelleteria-palma.ts";
import { fornSantFrancesc } from "./forn-sant-francesc-inca.ts";
import { heladeriaSaFabricaDeGelatsSoller } from "./heladeria-sa-fabrica-de-gelats-soller.ts";
import { ilTanoSantaCatalina } from "./il-tano-santa-catalina.ts";
import { laCantinaClubNauticCalaRatjada } from "./la-cantina-club-nautic-cala-ratjada.ts";
import { laHaciendaPeguera } from "./la-hacienda-peguera.ts";
import { laTerrazaAlcanada } from "./la-terraza-alcanada.ts";
import { lasOlasSantaPonsa } from "./las-olas-santa-ponsa.ts";
import { laudatSantanyi } from "./laudat-santanyi.ts";
import { losPatosPlayaMuro } from "./los-patos-playa-muro.ts";
import { marYMarPeguera } from "./mar-y-mar-peguera.ts";
import { mercatCobertInca } from "./mercat-cobert-inca.ts";
import { mercatOlivarPalma } from "./mercat-olivar-palma.ts";
import { mercatPereGarauPalma } from "./mercat-pere-garau-palma.ts";
import { mercatSantaCatalinaPalma } from "./mercat-santa-catalina-palma.ts";
import { miceliSelva } from "./miceli-selva.ts";
import { namaDeia } from "./nama-deia.ts";
import { oliDeJornets } from "./oli-de-jornets-sencelles.ts";
import { pastisseriaCanMolinasValldemossa } from "./pastisseria-can-molinas-valldemossa.ts";
import { portPetitCalaDor } from "./port-petit-cala-dor.ts";
import { porxadaDeSaTorreCanyamel } from "./porxada-de-sa-torre-canyamel.ts";
import { puraVidaCalaFiguera } from "./pura-vida-cala-figuera.ts";
import { quinceCantinaPortoCristo } from "./quince-cantina-porto-cristo.ts";
import { restauranteAgapantoPortSoller } from "./restaurante-agapanto-port-soller.ts";
import { restauranteAndreuGenestra } from "./restaurante-andreu-genestra.ts";
import { restauranteAromataPalma } from "./restaurante-aromata-palma.ts";
import { restaurante_arrosseria_sa_cranca_palma_paseo_maritimo } from "./restaurante-arrosseria-sa-cranca-palma-paseo-maritimo.ts";
import { restauranteBaibenPortals } from "./restaurante-baiben-portals.ts";
import { restauranteBarPlayaCalaBarques } from "./restaurante-bar-playa-cala-barques.ts";
import { restauranteCaNAmerLloseta } from "./restaurante-ca-n-amer-lloseta.ts";
import { restauranteCaNOlesaPollenca } from "./restaurante-ca-n-olesa-pollenca.ts";
import { restauranteCafeNouSoller } from "./restaurante-cafe-nou-soller.ts";
import { restauranteCalDimoniAlgaida } from "./restaurante-cal-dimoni-algaida.ts";
import { restauranteCanGavellaCanPicafort } from "./restaurante-can-gavella-can-picafort.ts";
import { restauranteCanPedro } from "./restaurante-can-pedro-genova.ts";
import { restauranteCanPescadorPlayaDeMuro } from "./restaurante-can-pescador-playa-de-muro.ts";
import { restauranteCanTroncaSantJoan } from "./restaurante-can-tronca-sant-joan.ts";
import { restauranteClubDeMarPalma } from "./restaurante-club-de-mar-palma.ts";
import { restauranteClubDeVelaPortAndratx } from "./restaurante-club-de-vela-port-andratx.ts";
import { restauranteClubNauticArenal } from "./restaurante-club-nautic-arenal.ts";
import { restauranteClubNauticCalaGamba } from "./restaurante-club-nautic-cala-gamba.ts";
import { restauranteClubNauticCanPicafort } from "./restaurante-club-nautic-can-picafort.ts";
import { restauranteClubNauticPortitxol } from "./restaurante-club-nautic-portitxol.ts";
import { restauranteClubNauticPortoCristo } from "./restaurante-club-nautic-porto-cristo.ts";
import { restauranteClubNauticPortocolom } from "./restaurante-club-nautic-portocolom.ts";
import { restauranteClubNauticSEstanyol } from "./restaurante-club-nautic-s-estanyol.ts";
import { restauranteClubNauticSaRapita } from "./restaurante-club-nautic-sa-rapita.ts";
import { restauranteCmSanAntonioCanPastilla } from "./restaurante-cm-san-antonio-can-pastilla.ts";
import { restauranteCnArenal } from "./restaurante-cn-arenal.ts";
import { restauranteCnCalaRatjada } from "./restaurante-cn-cala-ratjada.ts";
import { restauranteCnCanPicafort } from "./restaurante-cn-can-picafort.ts";
import { restauranteCnColoniaSantPere } from "./restaurante-cn-colonia-sant-pere.ts";
import { restauranteCnPortocolom } from "./restaurante-cn-portocolom.ts";
import { restauranteCnSEstanyol } from "./restaurante-cn-s-estanyol.ts";
import { restauranteCoastByEast } from "./restaurante-coast-by-east.ts";
import { restauranteDukePalma } from "./restaurante-duke-palma.ts";
import { restauranteElOlivoDeia } from "./restaurante-el-olivo-deia.ts";
import { restauranteElPenon1957Palma } from "./restaurante-el-penon-1957-palma.ts";
import { restauranteEmilioInnobar } from "./restaurante-emilio-innobar.ts";
import { restauranteEsBergantPortoPetro } from "./restaurante-es-bergant-porto-petro.ts";
import { restauranteEsCanyisPortSoller } from "./restaurante-es-canyis-port-soller.ts";
import { restauranteEsCellerDePetra } from "./restaurante-es-celler-de-petra.ts";
import { restauranteEsCruceVilafranca } from "./restaurante-es-cruce-vilafranca.ts";
import { restauranteEsRacoDesPortSoller } from "./restaurante-es-raco-des-port-soller.ts";
import { restauranteFlanigan } from "./restaurante-flanigan.ts";
import { restauranteGolfAlcanada } from "./restaurante-golf-alcanada.ts";
import { restauranteIlletaCampDeMar } from "./restaurante-illeta-camp-de-mar.ts";
import { restauranteLArcadaCalaFiguera } from "./restaurante-l-arcada-cala-figuera.ts";
import { restauranteLaCaracolaPortoPetro } from "./restaurante-la-caracola-porto-petro.ts";
import { restauranteLaCuevaPortoCristo } from "./restaurante-la-cueva-porto-cristo.ts";
import { restauranteLasTerrazasBendinat } from "./restaurante-las-terrazas-bendinat.ts";
import { restauranteLuna36Soller } from "./restaurante-luna-36-soller.ts";
import { restauranteMacaDeCastro } from "./restaurante-maca-de-castro.ts";
import { restauranteMarDeNudos } from "./restaurante-mar-de-nudos.ts";
import { restauranteMarIVentBanyalbufar } from "./restaurante-mar-i-vent-banyalbufar.ts";
import { restauranteMarcFosh } from "./restaurante-marc-fosh.ts";
import { restauranteMiradorDeCabrera } from "./restaurante-mirador-de-cabrera.ts";
import { restauranteMiradorSesBarquesFornalutx } from "./restaurante-mirador-ses-barques-fornalutx.ts";
import { restauranteMiramarPortAlcudia } from "./restaurante-miramar-port-alcudia.ts";
import { restauranteNautilusPortSoller } from "./restaurante-nautilus-port-soller.ts";
import { restauranteOlaDelMar } from "./restaurante-ola-del-mar.ts";
import { restauranteRcnPortPollenca } from "./restaurante-rcn-port-pollenca.ts";
import { restauranteRitziPortals } from "./restaurante-ritzi-portals.ts";
import { restauranteRocamarPortAndratx } from "./restaurante-rocamar-port-andratx.ts";
import { restauranteSaBarcaPortSoller } from "./restaurante-sa-barca-port-soller.ts";
import { restaurante_sa_canterella_deia_vistas_mar } from "./restaurante-sa-canterella-deia-vistas-mar.ts";
import { restaurante_sa_llobatera_sineu_celler } from "./restaurante-sa-llobatera-sineu-celler.ts";
import { restaurante_sa_lloca_alcudia_puerto_marisco } from "./restaurante-sa-lloca-alcudia-puerto-marisco.ts";
import { restauranteSaRoquetaPortixol } from "./restaurante-sa-roqueta-portixol.ts";
import { restauranteSaVinyaEsCapdella } from "./restaurante-sa-vinya-es-capdella.ts";
import { restauranteSesOliveresPortSoller } from "./restaurante-ses-oliveres-port-soller.ts";
import { restauranteSonFlorianaCalaBona } from "./restaurante-son-floriana-cala-bona.ts";
import { restauranteStagierBar } from "./restaurante-stagier-bar.ts";
import { restaurante_tierra_palma_cocina_mallorquina_contemporanea } from "./restaurante-tierra-palma-cocina-mallorquina-contemporanea.ts";
import { restauranteToquePalma } from "./restaurante-toque-palma.ts";
import { restauranteYachtClubCalaDor } from "./restaurante-yacht-club-cala-dor.ts";
import { restauranteZaranda } from "./restaurante-zaranda.ts";
import { rusticoPizzeriaPeguera } from "./rustico-pizzeria-peguera.ts";
import { saCuinaDeNainaSencelles } from "./sa-cuina-de-naina-sencelles.ts";
import { saLlotjaPortocolom } from "./sa-llotja-portocolom.ts";
import { saLlumRestaurantPollensa } from "./sa-llum-restaurant-pollensa.ts";
import { saTorreSantaEugenia } from "./sa-torre-santa-eugenia.ts";
import { sieteFuegosSantaPonsa } from "./siete-fuegos-santa-ponsa.ts";
import { stayPortDePollenca } from "./stay-port-de-pollenca.ts";
import { terraePortDePollenca } from "./terrae-port-de-pollenca.ts";
import { terraeRestaurantPortPollensa } from "./terrae-restaurant-port-pollensa.ts";
import { trespaisPortAndratx } from "./trespais-port-andratx.ts";
import { vandalPalma } from "./vandal-palma.ts";
import { vinoDelMarPortAdriano } from "./vino-del-mar-port-adriano.ts";

export { adrianQuetglas } from "./adrian-quetglas.ts";
export { barBosch } from "./bar-bosch.ts";
export { barEspanyaPalma } from "./bar-espanya-palma.ts";
export { barSHostalMontuiri } from "./bar-s-hostal-montuiri.ts";
export { beach_club_illetes_mhares_sea_club_calvia } from "./beach-club-illetes-mhares-sea-club-calvia.ts";
export { bensDavall } from "./bens-davall.ts";
export { bodegaBarahonaCasaManolo } from "./bodega-barahona-casa-manolo.ts";
export { bodegaBiniagual } from "./bodega-biniagual.ts";
export { bodegaCanVidalet } from "./bodega-can-vidalet-pollensa.ts";
export { bodegaCastellMiquel } from "./bodega-castell-miquel.ts";
export { bodegaSonPrim } from "./bodega-son-prim-sencelles.ts";
export { bodegas7103PetitCellerSantaMaria } from "./bodegas-7103-petit-celler-santa-maria.ts";
export { bodegasAngelSantaMaria } from "./bodegas-angel-santa-maria.ts";
export { bodegasAvaViSencelles } from "./bodegas-ava-vi-sencelles.ts";
export { bodegasBordoyLlucmajor } from "./bodegas-bordoy-llucmajor.ts";
export { bodegasButxetMuro } from "./bodegas-butxet-muro.ts";
export { bodegasCanAxartellPollenca } from "./bodegas-can-axartell-pollenca.ts";
export { bodegasCanColetoPetra } from "./bodegas-can-coleto-petra.ts";
export { bodegasCanFeliuPorreres } from "./bodegas-can-feliu-porreres.ts";
export { bodegasCanMajoralAlgaida } from "./bodegas-can-majoral-algaida.ts";
export { bodegasCanRamisSencelles } from "./bodegas-can-ramis-sencelles.ts";
export { bodegasCanVerduraBinissalem } from "./bodegas-can-verdura-binissalem.ts";
export { bodegasCanXanetPollensa } from "./bodegas-can-xanet-pollensa.ts";
export { bodegasCondeDeSuyrotColoniaSantPere } from "./bodegas-conde-de-suyrot-colonia-sant-pere.ts";
export { bodegasEsVergerEsporles } from "./bodegas-es-verger-esporles.ts";
export { bodegasGalmesIRibotSantaMargalida } from "./bodegas-galmes-i-ribot-santa-margalida.ts";
export { bodegasJaumeDePuntiroSantaMaria } from "./bodegas-jaume-de-puntiro-santa-maria.ts";
export { bodegasJoseLFerrer } from "./bodegas-jose-l-ferrer.ts";
export { bodegasMaciaBatle } from "./bodegas-macia-batle.ts";
export { bodegasMesquidaMoraPorreres } from "./bodegas-mesquida-mora-porreres.ts";
export { bodegasOliverMoraguesAlgaida } from "./bodegas-oliver-moragues-algaida.ts";
export { bodegasRamanyaSantaMaria } from "./bodegas-ramanya-santa-maria.ts";
export { bodegasSantaCatarinaSencelles } from "./bodegas-santa-catarina-sencelles.ts";
export { bodegasSebastiaPastorSantaMaria } from "./bodegas-sebastia-pastor-santa-maria.ts";
export { bodegasSonArtiguesPorreres } from "./bodegas-son-artigues-porreres.ts";
export { bodegasSonBordilsInca } from "./bodegas-son-bordils-inca.ts";
export { bodegasSonCampanerSencelles } from "./bodegas-son-campaner-sencelles.ts";
export { bodegasSonJulianaSantaEugenia } from "./bodegas-son-juliana-santa-eugenia.ts";
export { bodegasSonPuigPuigpunyent } from "./bodegas-son-puig-puigpunyent.ts";
export { bodegasSonRamonLlubi } from "./bodegas-son-ramon-llubi.ts";
export { bodegasSonVivesBanyalbufar } from "./bodegas-son-vives-banyalbufar.ts";
export { bodegasTiannaNegreBinissalem } from "./bodegas-tianna-negre-binissalem.ts";
export { bodegasViReiLlucmajor } from "./bodegas-vi-rei-llucmajor.ts";
export { bodegasVinaTaujanaSantaEugenia } from "./bodegas-vina-taujana-santa-eugenia.ts";
export { bodegasVinsMiquelGelabert } from "./bodegas-vins-miquel-gelabert.ts";
export { bodegasVinsNadalBinissalem } from "./bodegas-vins-nadal-binissalem.ts";
export { bodegasVinsToniGelabertManacor } from "./bodegas-vins-toni-gelabert-manacor.ts";
export { bodegasVinyesMortitx } from "./bodegas-vinyes-mortitx.ts";
export { caNEduardo } from "./ca-n-eduardo.ts";
export { caNaToneta } from "./ca-na-toneta.ts";
export { caNantunaFornalutx } from "./ca-nantuna-fornalutx.ts";
export { caNignasiInca } from "./ca-nignasi-inca.ts";
export { canBoquetaSoller } from "./can-boqueta-soller.ts";
export { canCompany } from "./can-company-sineu.ts";
export { canCostaValldemossa } from "./can-costa-valldemossa.ts";
export { canJoanDeSAigoPalma } from "./can-joan-de-saigo-palma.ts";
export { canMarchManacor } from "./can-march-manacor.ts";
export { canMiquelPalma } from "./can-miquel-palma.ts";
export { canNofrePalma } from "./can-nofre-palma.ts";
export { canPintxoSoller } from "./can-pintxo-soller.ts";
export { canPomar } from "./can-pomar-campos.ts";
export { canTorratPlayaPalma } from "./can-torrat-playa-palma.ts";
export { carniceriaCaNaFina } from "./carniceria-ca-na-fina-soller.ts";
export { carniceriaCanMatas } from "./carniceria-can-matas-soller.ts";
export { carniceriaCanToni } from "./carniceria-can-toni-porreres.ts";
export { carniceriaCanXarrier } from "./carniceria-can-xarrier-algaida.ts";
export { carniceriaCanXim } from "./carniceria-can-xim-alaro.ts";
export { casXorcSoller } from "./cas-xorc-soller.ts";
export { casaJacintoGenovaBrasas } from "./casa-jacinto-genova-brasas.ts";
export { cassaiBeachHouse } from "./cassai-beach-house-colonia-sant-jordi.ts";
export { cellerBarRandaAlgaida } from "./celler-bar-randa-algaida.ts";
export { cellerCaNIgnasiInca } from "./celler-ca-n-ignasi-inca.ts";
export { cellerCanAmer } from "./celler-can-amer.ts";
export { cellerCanCarrossaLloseta } from "./celler-can-carrossa-lloseta.ts";
export { cellerCanFontSineu } from "./celler-can-font-sineu.ts";
export { cellerCanMarron } from "./celler-can-marron-inca.ts";
export { cellerCanRipoll } from "./celler-can-ripoll-inca.ts";
export { celler_can_verdura_binissalem_vins_autoctons } from "./celler-can-verdura-binissalem-vins-autoctons.ts";
export { cellerElMoliPollenca } from "./celler-el-moli-pollenca.ts";
export { cellerEsCellerPetra } from "./celler-es-celler-petra.ts";
export { cellerEsMoliSantanyi } from "./celler-es-moli-santanyi.ts";
export { cellerPagesPalma } from "./celler-pages-palma.ts";
export { cellerSaFondaMuro } from "./celler-sa-fonda-muro.ts";
export { cellerSaPlacaLloseta } from "./celler-sa-placa-lloseta.ts";
export { cellerSaPremsa } from "./celler-sa-premsa.ts";
export { cellerSaSiniSantaMaria } from "./celler-sa-sini-santa-maria.ts";
export { cellerSaTravessaInca } from "./celler-sa-travessa-inca.ts";
export { cellerSaVinyaBinissalem } from "./celler-sa-vinya-binissalem.ts";
export { celler_son_sant_marti_muro_tradicional } from "./celler-son-sant-marti-muro-tradicional.ts";
export { cellerSonToreoSineu } from "./celler-son-toreo-sineu.ts";
export { dinsSantiTaura } from "./dins-santi-taura.ts";
export { elBungalowCiudadJardin } from "./el-bungalow-ciudad-jardin.ts";
export { elCaminoTapasBarPalma } from "./el-camino-tapas-bar-palma.ts";
export { elCaminoPalma } from "./el-camino.ts";
export { elCastilloDelBosque } from "./el-castillo-del-bosque-felanitx.ts";
export { esGuixEscorca } from "./es-guix-escorca.ts";
export { esVergerAlaro } from "./es-verger-alaro.ts";
export { feraPalma } from "./fera-palma.ts";
export { fetASollerFabricaGelats } from "./fet-a-soller-fabrica-gelats.ts";
export { formatgesSaCanova } from "./formatges-sa-canova-campos.ts";
export { fornCanGelabertBinissalem } from "./forn-can-gelabert-binissalem.ts";
export { fornCanPacoCampos } from "./forn-can-paco-campos.ts";
export { fornDeLaSoca } from "./forn-de-la-soca.ts";
export { fornDeSantJoan } from "./forn-de-sant-joan.ts";
export { fornDesTeatre } from "./forn-des-teatre-palma.ts";
export { fornFondoPalma } from "./forn-fondo-palma.ts";
export { forn_fondo_pasteleria_historica_palma } from "./forn-fondo-pasteleria-historica-palma.ts";
export { fornGelabertLlubi } from "./forn-gelabert-llubi.ts";
export { fornNouMuro } from "./forn-nou-muro.ts";
export { fornSaPelleteria } from "./forn-sa-pelleteria-palma.ts";
export { fornSantFrancesc } from "./forn-sant-francesc-inca.ts";
export { heladeriaSaFabricaDeGelatsSoller } from "./heladeria-sa-fabrica-de-gelats-soller.ts";
export { ilTanoSantaCatalina } from "./il-tano-santa-catalina.ts";
export { laCantinaClubNauticCalaRatjada } from "./la-cantina-club-nautic-cala-ratjada.ts";
export { laHaciendaPeguera } from "./la-hacienda-peguera.ts";
export { laTerrazaAlcanada } from "./la-terraza-alcanada.ts";
export { lasOlasSantaPonsa } from "./las-olas-santa-ponsa.ts";
export { laudatSantanyi } from "./laudat-santanyi.ts";
export { losPatosPlayaMuro } from "./los-patos-playa-muro.ts";
export { marYMarPeguera } from "./mar-y-mar-peguera.ts";
export { mercatCobertInca } from "./mercat-cobert-inca.ts";
export { mercatOlivarPalma } from "./mercat-olivar-palma.ts";
export { mercatPereGarauPalma } from "./mercat-pere-garau-palma.ts";
export { mercatSantaCatalinaPalma } from "./mercat-santa-catalina-palma.ts";
export { miceliSelva } from "./miceli-selva.ts";
export { namaDeia } from "./nama-deia.ts";
export { oliDeJornets } from "./oli-de-jornets-sencelles.ts";
export { pastisseriaCanMolinasValldemossa } from "./pastisseria-can-molinas-valldemossa.ts";
export { portPetitCalaDor } from "./port-petit-cala-dor.ts";
export { porxadaDeSaTorreCanyamel } from "./porxada-de-sa-torre-canyamel.ts";
export { puraVidaCalaFiguera } from "./pura-vida-cala-figuera.ts";
export { quinceCantinaPortoCristo } from "./quince-cantina-porto-cristo.ts";
export { restauranteAgapantoPortSoller } from "./restaurante-agapanto-port-soller.ts";
export { restauranteAndreuGenestra } from "./restaurante-andreu-genestra.ts";
export { restauranteAromataPalma } from "./restaurante-aromata-palma.ts";
export { restaurante_arrosseria_sa_cranca_palma_paseo_maritimo } from "./restaurante-arrosseria-sa-cranca-palma-paseo-maritimo.ts";
export { restauranteBaibenPortals } from "./restaurante-baiben-portals.ts";
export { restauranteBarPlayaCalaBarques } from "./restaurante-bar-playa-cala-barques.ts";
export { restauranteCaNAmerLloseta } from "./restaurante-ca-n-amer-lloseta.ts";
export { restauranteCaNOlesaPollenca } from "./restaurante-ca-n-olesa-pollenca.ts";
export { restauranteCafeNouSoller } from "./restaurante-cafe-nou-soller.ts";
export { restauranteCalDimoniAlgaida } from "./restaurante-cal-dimoni-algaida.ts";
export { restauranteCanGavellaCanPicafort } from "./restaurante-can-gavella-can-picafort.ts";
export { restauranteCanPedro } from "./restaurante-can-pedro-genova.ts";
export { restauranteCanPescadorPlayaDeMuro } from "./restaurante-can-pescador-playa-de-muro.ts";
export { restauranteCanTroncaSantJoan } from "./restaurante-can-tronca-sant-joan.ts";
export { restauranteClubDeMarPalma } from "./restaurante-club-de-mar-palma.ts";
export { restauranteClubDeVelaPortAndratx } from "./restaurante-club-de-vela-port-andratx.ts";
export { restauranteClubNauticArenal } from "./restaurante-club-nautic-arenal.ts";
export { restauranteClubNauticCalaGamba } from "./restaurante-club-nautic-cala-gamba.ts";
export { restauranteClubNauticCanPicafort } from "./restaurante-club-nautic-can-picafort.ts";
export { restauranteClubNauticPortitxol } from "./restaurante-club-nautic-portitxol.ts";
export { restauranteClubNauticPortoCristo } from "./restaurante-club-nautic-porto-cristo.ts";
export { restauranteClubNauticPortocolom } from "./restaurante-club-nautic-portocolom.ts";
export { restauranteClubNauticSEstanyol } from "./restaurante-club-nautic-s-estanyol.ts";
export { restauranteClubNauticSaRapita } from "./restaurante-club-nautic-sa-rapita.ts";
export { restauranteCmSanAntonioCanPastilla } from "./restaurante-cm-san-antonio-can-pastilla.ts";
export { restauranteCnArenal } from "./restaurante-cn-arenal.ts";
export { restauranteCnCalaRatjada } from "./restaurante-cn-cala-ratjada.ts";
export { restauranteCnCanPicafort } from "./restaurante-cn-can-picafort.ts";
export { restauranteCnColoniaSantPere } from "./restaurante-cn-colonia-sant-pere.ts";
export { restauranteCnPortocolom } from "./restaurante-cn-portocolom.ts";
export { restauranteCnSEstanyol } from "./restaurante-cn-s-estanyol.ts";
export { restauranteCoastByEast } from "./restaurante-coast-by-east.ts";
export { restauranteDukePalma } from "./restaurante-duke-palma.ts";
export { restauranteElOlivoDeia } from "./restaurante-el-olivo-deia.ts";
export { restauranteElPenon1957Palma } from "./restaurante-el-penon-1957-palma.ts";
export { restauranteEmilioInnobar } from "./restaurante-emilio-innobar.ts";
export { restauranteEsBergantPortoPetro } from "./restaurante-es-bergant-porto-petro.ts";
export { restauranteEsCanyisPortSoller } from "./restaurante-es-canyis-port-soller.ts";
export { restauranteEsCellerDePetra } from "./restaurante-es-celler-de-petra.ts";
export { restauranteEsCruceVilafranca } from "./restaurante-es-cruce-vilafranca.ts";
export { restauranteEsRacoDesPortSoller } from "./restaurante-es-raco-des-port-soller.ts";
export { restauranteFlanigan } from "./restaurante-flanigan.ts";
export { restauranteGolfAlcanada } from "./restaurante-golf-alcanada.ts";
export { restauranteIlletaCampDeMar } from "./restaurante-illeta-camp-de-mar.ts";
export { restauranteLArcadaCalaFiguera } from "./restaurante-l-arcada-cala-figuera.ts";
export { restauranteLaCaracolaPortoPetro } from "./restaurante-la-caracola-porto-petro.ts";
export { restauranteLaCuevaPortoCristo } from "./restaurante-la-cueva-porto-cristo.ts";
export { restauranteLasTerrazasBendinat } from "./restaurante-las-terrazas-bendinat.ts";
export { restauranteLuna36Soller } from "./restaurante-luna-36-soller.ts";
export { restauranteMacaDeCastro } from "./restaurante-maca-de-castro.ts";
export { restauranteMarDeNudos } from "./restaurante-mar-de-nudos.ts";
export { restauranteMarIVentBanyalbufar } from "./restaurante-mar-i-vent-banyalbufar.ts";
export { restauranteMarcFosh } from "./restaurante-marc-fosh.ts";
export { restauranteMiradorDeCabrera } from "./restaurante-mirador-de-cabrera.ts";
export { restauranteMiradorSesBarquesFornalutx } from "./restaurante-mirador-ses-barques-fornalutx.ts";
export { restauranteMiramarPortAlcudia } from "./restaurante-miramar-port-alcudia.ts";
export { restauranteNautilusPortSoller } from "./restaurante-nautilus-port-soller.ts";
export { restauranteOlaDelMar } from "./restaurante-ola-del-mar.ts";
export { restauranteRcnPortPollenca } from "./restaurante-rcn-port-pollenca.ts";
export { restauranteRitziPortals } from "./restaurante-ritzi-portals.ts";
export { restauranteRocamarPortAndratx } from "./restaurante-rocamar-port-andratx.ts";
export { restauranteSaBarcaPortSoller } from "./restaurante-sa-barca-port-soller.ts";
export { restaurante_sa_canterella_deia_vistas_mar } from "./restaurante-sa-canterella-deia-vistas-mar.ts";
export { restaurante_sa_llobatera_sineu_celler } from "./restaurante-sa-llobatera-sineu-celler.ts";
export { restaurante_sa_lloca_alcudia_puerto_marisco } from "./restaurante-sa-lloca-alcudia-puerto-marisco.ts";
export { restauranteSaRoquetaPortixol } from "./restaurante-sa-roqueta-portixol.ts";
export { restauranteSaVinyaEsCapdella } from "./restaurante-sa-vinya-es-capdella.ts";
export { restauranteSesOliveresPortSoller } from "./restaurante-ses-oliveres-port-soller.ts";
export { restauranteSonFlorianaCalaBona } from "./restaurante-son-floriana-cala-bona.ts";
export { restauranteStagierBar } from "./restaurante-stagier-bar.ts";
export { restaurante_tierra_palma_cocina_mallorquina_contemporanea } from "./restaurante-tierra-palma-cocina-mallorquina-contemporanea.ts";
export { restauranteToquePalma } from "./restaurante-toque-palma.ts";
export { restauranteYachtClubCalaDor } from "./restaurante-yacht-club-cala-dor.ts";
export { restauranteZaranda } from "./restaurante-zaranda.ts";
export { rusticoPizzeriaPeguera } from "./rustico-pizzeria-peguera.ts";
export { saCuinaDeNainaSencelles } from "./sa-cuina-de-naina-sencelles.ts";
export { saLlotjaPortocolom } from "./sa-llotja-portocolom.ts";
export { saLlumRestaurantPollensa } from "./sa-llum-restaurant-pollensa.ts";
export { saTorreSantaEugenia } from "./sa-torre-santa-eugenia.ts";
export { sieteFuegosSantaPonsa } from "./siete-fuegos-santa-ponsa.ts";
export { stayPortDePollenca } from "./stay-port-de-pollenca.ts";
export { terraePortDePollenca } from "./terrae-port-de-pollenca.ts";
export { terraeRestaurantPortPollensa } from "./terrae-restaurant-port-pollensa.ts";
export { trespaisPortAndratx } from "./trespais-port-andratx.ts";
export { vandalPalma } from "./vandal-palma.ts";
export { vinoDelMarPortAdriano } from "./vino-del-mar-port-adriano.ts";

export const RESTAURANT_SERVICES: ServiceItem[] = [
  adrianQuetglas,
  barBosch,
  barEspanyaPalma,
  barSHostalMontuiri,
  beach_club_illetes_mhares_sea_club_calvia,
  bensDavall,
  bodegaBarahonaCasaManolo,
  bodegaBiniagual,
  bodegaCanVidalet,
  bodegaCastellMiquel,
  bodegaSonPrim,
  bodegas7103PetitCellerSantaMaria,
  bodegasAngelSantaMaria,
  bodegasAvaViSencelles,
  bodegasBordoyLlucmajor,
  bodegasButxetMuro,
  bodegasCanAxartellPollenca,
  bodegasCanColetoPetra,
  bodegasCanFeliuPorreres,
  bodegasCanMajoralAlgaida,
  bodegasCanRamisSencelles,
  bodegasCanVerduraBinissalem,
  bodegasCanXanetPollensa,
  bodegasCondeDeSuyrotColoniaSantPere,
  bodegasEsVergerEsporles,
  bodegasGalmesIRibotSantaMargalida,
  bodegasJaumeDePuntiroSantaMaria,
  bodegasJoseLFerrer,
  bodegasMaciaBatle,
  bodegasMesquidaMoraPorreres,
  bodegasOliverMoraguesAlgaida,
  bodegasRamanyaSantaMaria,
  bodegasSantaCatarinaSencelles,
  bodegasSebastiaPastorSantaMaria,
  bodegasSonArtiguesPorreres,
  bodegasSonBordilsInca,
  bodegasSonCampanerSencelles,
  bodegasSonJulianaSantaEugenia,
  bodegasSonPuigPuigpunyent,
  bodegasSonRamonLlubi,
  bodegasSonVivesBanyalbufar,
  bodegasTiannaNegreBinissalem,
  bodegasViReiLlucmajor,
  bodegasVinaTaujanaSantaEugenia,
  bodegasVinsMiquelGelabert,
  bodegasVinsNadalBinissalem,
  bodegasVinsToniGelabertManacor,
  bodegasVinyesMortitx,
  caNEduardo,
  caNaToneta,
  caNantunaFornalutx,
  caNignasiInca,
  canBoquetaSoller,
  canCompany,
  canCostaValldemossa,
  canJoanDeSAigoPalma,
  canMarchManacor,
  canMiquelPalma,
  canNofrePalma,
  canPintxoSoller,
  canPomar,
  canTorratPlayaPalma,
  carniceriaCaNaFina,
  carniceriaCanMatas,
  carniceriaCanToni,
  carniceriaCanXarrier,
  carniceriaCanXim,
  casXorcSoller,
  casaJacintoGenovaBrasas,
  cassaiBeachHouse,
  cellerBarRandaAlgaida,
  cellerCaNIgnasiInca,
  cellerCanAmer,
  cellerCanCarrossaLloseta,
  cellerCanFontSineu,
  cellerCanMarron,
  cellerCanRipoll,
  celler_can_verdura_binissalem_vins_autoctons,
  cellerElMoliPollenca,
  cellerEsCellerPetra,
  cellerEsMoliSantanyi,
  cellerPagesPalma,
  cellerSaFondaMuro,
  cellerSaPlacaLloseta,
  cellerSaPremsa,
  cellerSaSiniSantaMaria,
  cellerSaTravessaInca,
  cellerSaVinyaBinissalem,
  celler_son_sant_marti_muro_tradicional,
  cellerSonToreoSineu,
  dinsSantiTaura,
  elBungalowCiudadJardin,
  elCaminoTapasBarPalma,
  elCaminoPalma,
  elCastilloDelBosque,
  esGuixEscorca,
  esVergerAlaro,
  feraPalma,
  fetASollerFabricaGelats,
  formatgesSaCanova,
  fornCanGelabertBinissalem,
  fornCanPacoCampos,
  fornDeLaSoca,
  fornDeSantJoan,
  fornDesTeatre,
  fornFondoPalma,
  forn_fondo_pasteleria_historica_palma,
  fornGelabertLlubi,
  fornNouMuro,
  fornSaPelleteria,
  fornSantFrancesc,
  heladeriaSaFabricaDeGelatsSoller,
  ilTanoSantaCatalina,
  laCantinaClubNauticCalaRatjada,
  laHaciendaPeguera,
  laTerrazaAlcanada,
  lasOlasSantaPonsa,
  laudatSantanyi,
  losPatosPlayaMuro,
  marYMarPeguera,
  mercatCobertInca,
  mercatOlivarPalma,
  mercatPereGarauPalma,
  mercatSantaCatalinaPalma,
  miceliSelva,
  namaDeia,
  oliDeJornets,
  pastisseriaCanMolinasValldemossa,
  portPetitCalaDor,
  porxadaDeSaTorreCanyamel,
  puraVidaCalaFiguera,
  quinceCantinaPortoCristo,
  restauranteAgapantoPortSoller,
  restauranteAndreuGenestra,
  restauranteAromataPalma,
  restaurante_arrosseria_sa_cranca_palma_paseo_maritimo,
  restauranteBaibenPortals,
  restauranteBarPlayaCalaBarques,
  restauranteCaNAmerLloseta,
  restauranteCaNOlesaPollenca,
  restauranteCafeNouSoller,
  restauranteCalDimoniAlgaida,
  restauranteCanGavellaCanPicafort,
  restauranteCanPedro,
  restauranteCanPescadorPlayaDeMuro,
  restauranteCanTroncaSantJoan,
  restauranteClubDeMarPalma,
  restauranteClubDeVelaPortAndratx,
  restauranteClubNauticArenal,
  restauranteClubNauticCalaGamba,
  restauranteClubNauticCanPicafort,
  restauranteClubNauticPortitxol,
  restauranteClubNauticPortoCristo,
  restauranteClubNauticPortocolom,
  restauranteClubNauticSEstanyol,
  restauranteClubNauticSaRapita,
  restauranteCmSanAntonioCanPastilla,
  restauranteCnArenal,
  restauranteCnCalaRatjada,
  restauranteCnCanPicafort,
  restauranteCnColoniaSantPere,
  restauranteCnPortocolom,
  restauranteCnSEstanyol,
  restauranteCoastByEast,
  restauranteDukePalma,
  restauranteElOlivoDeia,
  restauranteElPenon1957Palma,
  restauranteEmilioInnobar,
  restauranteEsBergantPortoPetro,
  restauranteEsCanyisPortSoller,
  restauranteEsCellerDePetra,
  restauranteEsCruceVilafranca,
  restauranteEsRacoDesPortSoller,
  restauranteFlanigan,
  restauranteGolfAlcanada,
  restauranteIlletaCampDeMar,
  restauranteLArcadaCalaFiguera,
  restauranteLaCaracolaPortoPetro,
  restauranteLaCuevaPortoCristo,
  restauranteLasTerrazasBendinat,
  restauranteLuna36Soller,
  restauranteMacaDeCastro,
  restauranteMarDeNudos,
  restauranteMarIVentBanyalbufar,
  restauranteMarcFosh,
  restauranteMiradorDeCabrera,
  restauranteMiradorSesBarquesFornalutx,
  restauranteMiramarPortAlcudia,
  restauranteNautilusPortSoller,
  restauranteOlaDelMar,
  restauranteRcnPortPollenca,
  restauranteRitziPortals,
  restauranteRocamarPortAndratx,
  restauranteSaBarcaPortSoller,
  restaurante_sa_canterella_deia_vistas_mar,
  restaurante_sa_llobatera_sineu_celler,
  restaurante_sa_lloca_alcudia_puerto_marisco,
  restauranteSaRoquetaPortixol,
  restauranteSaVinyaEsCapdella,
  restauranteSesOliveresPortSoller,
  restauranteSonFlorianaCalaBona,
  restauranteStagierBar,
  restaurante_tierra_palma_cocina_mallorquina_contemporanea,
  restauranteToquePalma,
  restauranteYachtClubCalaDor,
  restauranteZaranda,
  rusticoPizzeriaPeguera,
  saCuinaDeNainaSencelles,
  saLlotjaPortocolom,
  saLlumRestaurantPollensa,
  saTorreSantaEugenia,
  sieteFuegosSantaPonsa,
  stayPortDePollenca,
  terraePortDePollenca,
  terraeRestaurantPortPollensa,
  trespaisPortAndratx,
  vandalPalma,
  vinoDelMarPortAdriano,
];
