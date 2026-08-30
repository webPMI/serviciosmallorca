import type { ServiceItem } from "../types.ts";
import { ANYTIME_FITNESS_SANTA_CATALINA } from "./anytime-fitness-santa-catalina.ts";
import { ASHTANGA_YOGA_SHALA_MALLORCA_SANTA_CATALINA } from "./ashtanga-yoga-shala-mallorca-santa-catalina.ts";
import { B_FIT_MALLORCA_PALMANOVA } from "./b-fit-mallorca-palmanova.ts";
import { BODHANA_WELLNESS_YOGA_CAN_PASTILLA } from "./bodhana-wellness-yoga-can-pastilla.ts";
import { BODY_VIP_FITNESS_INCA } from "./body-vip-fitness-inca.ts";
import { BROOKLYN_FITBOXING_PALMA_CENTRO } from "./brooklyn-fitboxing-palma-centro.ts";
import { BROOKLYN_FITBOXING_SON_HUGO_PALMA } from "./brooklyn-fitboxing-son-hugo-palma.ts";
import { CAPDEPERA_GOLF_ARTA } from "./capdepera-golf-arta.ts";
import { centro_buceo_padi_dive_mallorca_port_andratx } from "./centro-buceo-padi-dive-mallorca-port-andratx.ts";
import { CLUB_DE_GOLF_ALCANADA_ALCUDIA } from "./club-de-golf-alcanada-alcudia.ts";
import { CLUB_TENIS_ALARO } from "./club-tenis-alaro.ts";
import { CLUB_TENIS_ANDRATX } from "./club-tenis-andratx.ts";
import { CLUB_TENIS_CALVIA_COSTA_DEN_BLANES } from "./club-tenis-calvia-costa-den-blanes.ts";
import { CLUB_TENIS_FELANITX } from "./club-tenis-felanitx.ts";
import { CLUB_TENIS_PADEL_PORTOL } from "./club-tenis-padel-portol.ts";
import { CLUB_TENIS_POLLENSA } from "./club-tenis-pollensa.ts";
import { CLUB_TENIS_PORRERES } from "./club-tenis-porreres.ts";
import { CLUB_TENIS_PORTO_CRISTO_MANACOR } from "./club-tenis-porto-cristo-manacor.ts";
import { CLUB_TENIS_SANTA_EUGENIA } from "./club-tenis-santa-eugenia.ts";
import { CLUB_TENIS_SOLLER_VALLE } from "./club-tenis-soller-valle.ts";
import { CROSSFIT_070_PALMA } from "./crossfit-070-palma.ts";
import { CROSSFIT_BLAU_SON_MOIX } from "./crossfit-blau-son-moix.ts";
import { CROSSFIT_CALVIA_EL_TORO } from "./crossfit-calvia-el-toro.ts";
import { CROSSFIT_CAN_PASTILLA } from "./crossfit-can-pastilla.ts";
import { CROSSFIT_DRAGON_PALMA } from "./crossfit-dragon-palma.ts";
import { CROSSFIT_INCA_BOX } from "./crossfit-inca-box.ts";
import { CROSSFIT_LLUCMAJOR_BOX } from "./crossfit-llucmajor-box.ts";
import { CROSSFIT_MALLORCA_SANTA_PONCA } from "./crossfit-mallorca-santa-ponca.ts";
import { CROSSFIT_MANACOR_BOX } from "./crossfit-manacor-box.ts";
import { CROSSFIT_MORRO_DEN_FELIU_MARRATXI } from "./crossfit-morro-den-feliu-marratxi.ts";
import { CROSSFIT_POLLENSA_BOX } from "./crossfit-pollensa-box.ts";
import { CROSSFIT_PORTIXOL_PALMA } from "./crossfit-portixol-palma.ts";
import { CROSSFIT_SANTANYI_BOX } from "./crossfit-santanyi-box.ts";
import { CROSSFIT_TRAMUNTANA_PALMA } from "./crossfit-tramuntana-palma.ts";
import { diving_scuba_mallorca_port_pollensa_center } from "./diving-scuba-mallorca-port-pollensa-center.ts";
import { ELITE_FITNESS_PORT_ANDRATX } from "./elite-fitness-port-andratx.ts";
import { ES_CAU_BOULDER_FELANITX } from "./es-cau-boulder-felanitx.ts";
import { F45_TRAINING_PALMA_CENTRO } from "./f45-training-palma-centro.ts";
import { FIT_CLUB_MALLORCA_SON_BUGADELLES } from "./fit-club-mallorca-son-bugadelles.ts";
import { FIT_POINT_PADEL_FITNESS_PALMA } from "./fit-point-padel-fitness-palma.ts";
import { FREEFORM_BOULDER_GYM_PALMA_CENTRO } from "./freeform-boulder-gym-palma-centro.ts";
import { GOLF_DE_ANDRATX_CAMP_DE_MAR } from "./golf-de-andratx-camp-de-mar.ts";
import { GOLF_MAIORIS_LLUCMAJOR } from "./golf-maioris-llucmajor.ts";
import { GOLF_SANTA_PONSA_CALVIA } from "./golf-santa-ponsa-calvia.ts";
import { GOLF_SON_GUAL_PALMA } from "./golf-son-gual-palma.ts";
import { golf_son_muntaner_palma_arabella_hotel } from "./golf-son-muntaner-palma-arabella-hotel.ts";
import { GOLF_SON_MUNTANER_PALMA } from "./golf-son-muntaner-palma.ts";
import { GOLF_SON_QUINT_PALMA } from "./golf-son-quint-palma.ts";
import { GOLF_SON_VIDA_PALMA } from "./golf-son-vida-palma.ts";
import { HOT_YOGA_PALMA_AVENIDAS } from "./hot-yoga-palma-avenidas.ts";
import { HUERZELER_BICYCLE_HOLIDAYS_PLAYA_MURO } from "./huerzeler-bicycle-holidays-playa-muro.ts";
import { ILLES_CENTRES_BENESTAR_ARAGO_PALMA } from "./illes-centres-benestar-arago-palma.ts";
import { ILLES_CENTRES_BENESTAR_CALVIA } from "./illes-centres-benestar-calvia.ts";
import { ILLES_CENTRES_BENESTAR_INCA } from "./illes-centres-benestar-inca.ts";
import { ILLES_CENTRES_BENESTAR_MARRATXI } from "./illes-centres-benestar-marratxi.ts";
import { ILLES_CENTRES_BENESTAR_SON_RAPINYA } from "./illes-centres-benestar-son-rapinya.ts";
import { IRON_BOX_MALLORCA_FELANITX } from "./iron-box-mallorca-felanitx.ts";
import { MALLORCA_BIKE_HIRE_PORT_POLLENSA } from "./mallorca-bike-hire-port-pollensa.ts";
import { MALLORCA_CLIMBING_SCHOOL_VALLDEMOSSA } from "./mallorca-climbing-school-valldemossa.ts";
import { MALLORCA_DIVING_CENTER_PORT_POLLENSA } from "./mallorca-diving-center-port-pollensa.ts";
import { MALLORCA_KITESCHOOL_SA_MARINA } from "./mallorca-kiteschool-sa-marina.ts";
import { MATCH_POINT_PADEL_INDOOR_PALMA } from "./match-point-padel-indoor-palma.ts";
import { MCFIT_PALMA_SON_MALFERIT } from "./mcfit-palma-son-malferit.ts";
import { NANO_BICYCLES_PALMA_CENTRO } from "./nano-bicycles-palma-centro.ts";
import { NORDIC_WALKING_TRAMUNTANA_SOLLER } from "./nordic-walking-tramuntana-soller.ts";
import { open_marratxi_padel_indoor_club } from "./open-marratxi-padel-indoor-club.ts";
import { PADEL_FACTORY_MALLORCA_MARRATXI } from "./padel-factory-mallorca-marratxi.ts";
import { PADEL_INDOOR_MANACOR } from "./padel-indoor-manacor.ts";
import { PADEL_LLUCMAJOR_CLUB } from "./padel-llucmajor-club.ts";
import { padelindoor_mallorca_club_son_hugo_palma } from "./padelindoor-mallorca-club-son-hugo-palma.ts";
import { PALACIO_MUNICIPAL_DEPORTES_SON_MOIX } from "./palacio-municipal-deportes-son-moix.ts";
import { PALMA_BOXING_CLUB_SON_ARMADAMS } from "./palma-boxing-club-son-armadams.ts";
import { PALMA_RACKET_CLUB_SON_RAPINYA } from "./palma-racket-club-son-rapinya.ts";
import { PILATES_STUDIO_PALMA_PASEO_MALLORCA } from "./pilates-studio-palma-paseo-mallorca.ts";
import { PINS_PADEL_CLUB_PALMA } from "./pins-padel-club-palma.ts";
import { PISCINAS_OLIMPICAS_SON_HUGO_PALMA } from "./piscinas-olimpicas-son-hugo-palma.ts";
import { PRANA_YOGA_STUDIO_PALMA } from "./prana-yoga-studio-palma.ts";
import { PRO_CYCLE_HIRE_ALCUDIA_POLLENSA } from "./pro-cycle-hire-alcudia-pollensa.ts";
import { PULA_GOLF_RESORT_SON_SERVERA } from "./pula-golf-resort-son-servera.ts";
import { PURE_SALT_YOGA_PORT_ADRIANO } from "./pure-salt-yoga-port-adriano.ts";
import { REAL_GOLF_DE_BENDINAT } from "./real-golf-de-bendinat.ts";
import { ROCK_N_PALMA_ROCODROMO_SON_CASTELLO } from "./rock-n-palma-rocodromo-son-castello.ts";
import { ROCK_SPORT_CLIMBING_ALARO } from "./rock-sport-climbing-alaro.ts";
import { SAMADHI_YOGA_POLLENSA } from "./samadhi-yoga-pollensa.ts";
import { SANTA_MARIA_TENNIS_PADEL } from "./santa-maria-tennis-padel.ts";
import { SANTANYI_YOGA_SHALA } from "./santanyi-yoga-shala.ts";
import { STUDIO_1_PERSONAL_TRAINING_PALMA } from "./studio-1-personal-training-palma.ts";
import { SYNERGYM_PALMA_ESCORXADOR } from "./synergym-palma-escorxador.ts";
import { SYNERGYM_PALMA_SAN_FERNANDO } from "./synergym-palma-san-fernando.ts";
import { T_GOLF_CALVIA_MAGALUF } from "./t-golf-calvia-magaluf.ts";
import { T_GOLF_PALMA_PUNTIRO } from "./t-golf-palma-puntiro.ts";
import { TENNIS_ACADEMY_MALLORCA_PEGUERA } from "./tennis-academy-mallorca-peguera.ts";
import { TENNIS_CLUB_INCA_RAIGUER } from "./tennis-club-inca-raiguer.ts";
import { THE_YOGA_HUB_SOLLER } from "./the-yoga-hub-soller.ts";
import { TOP_GYM_PALMA_GENERAL_RIERA } from "./top-gym-palma-general-riera.ts";
import { TRAMUNTANA_CLIMBING_GUIDES_SOLLER } from "./tramuntana-climbing-guides-soller.ts";
import { TRAMUNTANA_FLOW_YOGA_ALARO } from "./tramuntana-flow-yoga-alaro.ts";
import { UDYR_SPORT_PADEL_MARRATXI } from "./udyr-sport-padel-marratxi.ts";
import { URBAN_CROSSFIT_PALMA } from "./urban-crossfit-palma.ts";
import { VALL_D_OR_GOLF_CALADOR } from "./vall-d-or-golf-calador.ts";
import { VIVAGYM_CARDENAL_ROSSELL_PALMA } from "./vivagym-cardenal-rossell-palma.ts";
import { VIVAGYM_SON_FUSTER_PALMA } from "./vivagym-son-fuster-palma.ts";
import { VIVAGYM_SON_MOIX_PALMA } from "./vivagym-son-moix-palma.ts";
import { WINDSURF_STATION_POLLENSA_BAY } from "./windsurf-station-pollensa-bay.ts";
import { YOGA_MALLORCA_PORTIXOL } from "./yoga-mallorca-portixol.ts";

export { ANYTIME_FITNESS_SANTA_CATALINA } from "./anytime-fitness-santa-catalina.ts";
export { ASHTANGA_YOGA_SHALA_MALLORCA_SANTA_CATALINA } from "./ashtanga-yoga-shala-mallorca-santa-catalina.ts";
export { B_FIT_MALLORCA_PALMANOVA } from "./b-fit-mallorca-palmanova.ts";
export { BODHANA_WELLNESS_YOGA_CAN_PASTILLA } from "./bodhana-wellness-yoga-can-pastilla.ts";
export { BODY_VIP_FITNESS_INCA } from "./body-vip-fitness-inca.ts";
export { BROOKLYN_FITBOXING_PALMA_CENTRO } from "./brooklyn-fitboxing-palma-centro.ts";
export { BROOKLYN_FITBOXING_SON_HUGO_PALMA } from "./brooklyn-fitboxing-son-hugo-palma.ts";
export { CAPDEPERA_GOLF_ARTA } from "./capdepera-golf-arta.ts";
export { centro_buceo_padi_dive_mallorca_port_andratx } from "./centro-buceo-padi-dive-mallorca-port-andratx.ts";
export { CLUB_DE_GOLF_ALCANADA_ALCUDIA } from "./club-de-golf-alcanada-alcudia.ts";
export { CLUB_TENIS_ALARO } from "./club-tenis-alaro.ts";
export { CLUB_TENIS_ANDRATX } from "./club-tenis-andratx.ts";
export { CLUB_TENIS_CALVIA_COSTA_DEN_BLANES } from "./club-tenis-calvia-costa-den-blanes.ts";
export { CLUB_TENIS_FELANITX } from "./club-tenis-felanitx.ts";
export { CLUB_TENIS_PADEL_PORTOL } from "./club-tenis-padel-portol.ts";
export { CLUB_TENIS_POLLENSA } from "./club-tenis-pollensa.ts";
export { CLUB_TENIS_PORRERES } from "./club-tenis-porreres.ts";
export { CLUB_TENIS_PORTO_CRISTO_MANACOR } from "./club-tenis-porto-cristo-manacor.ts";
export { CLUB_TENIS_SANTA_EUGENIA } from "./club-tenis-santa-eugenia.ts";
export { CLUB_TENIS_SOLLER_VALLE } from "./club-tenis-soller-valle.ts";
export { CROSSFIT_070_PALMA } from "./crossfit-070-palma.ts";
export { CROSSFIT_BLAU_SON_MOIX } from "./crossfit-blau-son-moix.ts";
export { CROSSFIT_CALVIA_EL_TORO } from "./crossfit-calvia-el-toro.ts";
export { CROSSFIT_CAN_PASTILLA } from "./crossfit-can-pastilla.ts";
export { CROSSFIT_DRAGON_PALMA } from "./crossfit-dragon-palma.ts";
export { CROSSFIT_INCA_BOX } from "./crossfit-inca-box.ts";
export { CROSSFIT_LLUCMAJOR_BOX } from "./crossfit-llucmajor-box.ts";
export { CROSSFIT_MALLORCA_SANTA_PONCA } from "./crossfit-mallorca-santa-ponca.ts";
export { CROSSFIT_MANACOR_BOX } from "./crossfit-manacor-box.ts";
export { CROSSFIT_MORRO_DEN_FELIU_MARRATXI } from "./crossfit-morro-den-feliu-marratxi.ts";
export { CROSSFIT_POLLENSA_BOX } from "./crossfit-pollensa-box.ts";
export { CROSSFIT_PORTIXOL_PALMA } from "./crossfit-portixol-palma.ts";
export { CROSSFIT_SANTANYI_BOX } from "./crossfit-santanyi-box.ts";
export { CROSSFIT_TRAMUNTANA_PALMA } from "./crossfit-tramuntana-palma.ts";
export { diving_scuba_mallorca_port_pollensa_center } from "./diving-scuba-mallorca-port-pollensa-center.ts";
export { ELITE_FITNESS_PORT_ANDRATX } from "./elite-fitness-port-andratx.ts";
export { ES_CAU_BOULDER_FELANITX } from "./es-cau-boulder-felanitx.ts";
export { F45_TRAINING_PALMA_CENTRO } from "./f45-training-palma-centro.ts";
export { FIT_CLUB_MALLORCA_SON_BUGADELLES } from "./fit-club-mallorca-son-bugadelles.ts";
export { FIT_POINT_PADEL_FITNESS_PALMA } from "./fit-point-padel-fitness-palma.ts";
export { FREEFORM_BOULDER_GYM_PALMA_CENTRO } from "./freeform-boulder-gym-palma-centro.ts";
export { GOLF_DE_ANDRATX_CAMP_DE_MAR } from "./golf-de-andratx-camp-de-mar.ts";
export { GOLF_MAIORIS_LLUCMAJOR } from "./golf-maioris-llucmajor.ts";
export { GOLF_SANTA_PONSA_CALVIA } from "./golf-santa-ponsa-calvia.ts";
export { GOLF_SON_GUAL_PALMA } from "./golf-son-gual-palma.ts";
export { golf_son_muntaner_palma_arabella_hotel } from "./golf-son-muntaner-palma-arabella-hotel.ts";
export { GOLF_SON_MUNTANER_PALMA } from "./golf-son-muntaner-palma.ts";
export { GOLF_SON_QUINT_PALMA } from "./golf-son-quint-palma.ts";
export { GOLF_SON_VIDA_PALMA } from "./golf-son-vida-palma.ts";
export { HOT_YOGA_PALMA_AVENIDAS } from "./hot-yoga-palma-avenidas.ts";
export { HUERZELER_BICYCLE_HOLIDAYS_PLAYA_MURO } from "./huerzeler-bicycle-holidays-playa-muro.ts";
export { ILLES_CENTRES_BENESTAR_ARAGO_PALMA } from "./illes-centres-benestar-arago-palma.ts";
export { ILLES_CENTRES_BENESTAR_CALVIA } from "./illes-centres-benestar-calvia.ts";
export { ILLES_CENTRES_BENESTAR_INCA } from "./illes-centres-benestar-inca.ts";
export { ILLES_CENTRES_BENESTAR_MARRATXI } from "./illes-centres-benestar-marratxi.ts";
export { ILLES_CENTRES_BENESTAR_SON_RAPINYA } from "./illes-centres-benestar-son-rapinya.ts";
export { IRON_BOX_MALLORCA_FELANITX } from "./iron-box-mallorca-felanitx.ts";
export { MALLORCA_BIKE_HIRE_PORT_POLLENSA } from "./mallorca-bike-hire-port-pollensa.ts";
export { MALLORCA_CLIMBING_SCHOOL_VALLDEMOSSA } from "./mallorca-climbing-school-valldemossa.ts";
export { MALLORCA_DIVING_CENTER_PORT_POLLENSA } from "./mallorca-diving-center-port-pollensa.ts";
export { MALLORCA_KITESCHOOL_SA_MARINA } from "./mallorca-kiteschool-sa-marina.ts";
export { MATCH_POINT_PADEL_INDOOR_PALMA } from "./match-point-padel-indoor-palma.ts";
export { MCFIT_PALMA_SON_MALFERIT } from "./mcfit-palma-son-malferit.ts";
export { NANO_BICYCLES_PALMA_CENTRO } from "./nano-bicycles-palma-centro.ts";
export { NORDIC_WALKING_TRAMUNTANA_SOLLER } from "./nordic-walking-tramuntana-soller.ts";
export { open_marratxi_padel_indoor_club } from "./open-marratxi-padel-indoor-club.ts";
export { PADEL_FACTORY_MALLORCA_MARRATXI } from "./padel-factory-mallorca-marratxi.ts";
export { PADEL_INDOOR_MANACOR } from "./padel-indoor-manacor.ts";
export { PADEL_LLUCMAJOR_CLUB } from "./padel-llucmajor-club.ts";
export { padelindoor_mallorca_club_son_hugo_palma } from "./padelindoor-mallorca-club-son-hugo-palma.ts";
export { PALACIO_MUNICIPAL_DEPORTES_SON_MOIX } from "./palacio-municipal-deportes-son-moix.ts";
export { PALMA_BOXING_CLUB_SON_ARMADAMS } from "./palma-boxing-club-son-armadams.ts";
export { PALMA_RACKET_CLUB_SON_RAPINYA } from "./palma-racket-club-son-rapinya.ts";
export { PILATES_STUDIO_PALMA_PASEO_MALLORCA } from "./pilates-studio-palma-paseo-mallorca.ts";
export { PINS_PADEL_CLUB_PALMA } from "./pins-padel-club-palma.ts";
export { PISCINAS_OLIMPICAS_SON_HUGO_PALMA } from "./piscinas-olimpicas-son-hugo-palma.ts";
export { PRANA_YOGA_STUDIO_PALMA } from "./prana-yoga-studio-palma.ts";
export { PRO_CYCLE_HIRE_ALCUDIA_POLLENSA } from "./pro-cycle-hire-alcudia-pollensa.ts";
export { PULA_GOLF_RESORT_SON_SERVERA } from "./pula-golf-resort-son-servera.ts";
export { PURE_SALT_YOGA_PORT_ADRIANO } from "./pure-salt-yoga-port-adriano.ts";
export { REAL_GOLF_DE_BENDINAT } from "./real-golf-de-bendinat.ts";
export { ROCK_N_PALMA_ROCODROMO_SON_CASTELLO } from "./rock-n-palma-rocodromo-son-castello.ts";
export { ROCK_SPORT_CLIMBING_ALARO } from "./rock-sport-climbing-alaro.ts";
export { SAMADHI_YOGA_POLLENSA } from "./samadhi-yoga-pollensa.ts";
export { SANTA_MARIA_TENNIS_PADEL } from "./santa-maria-tennis-padel.ts";
export { SANTANYI_YOGA_SHALA } from "./santanyi-yoga-shala.ts";
export { STUDIO_1_PERSONAL_TRAINING_PALMA } from "./studio-1-personal-training-palma.ts";
export { SYNERGYM_PALMA_ESCORXADOR } from "./synergym-palma-escorxador.ts";
export { SYNERGYM_PALMA_SAN_FERNANDO } from "./synergym-palma-san-fernando.ts";
export { T_GOLF_CALVIA_MAGALUF } from "./t-golf-calvia-magaluf.ts";
export { T_GOLF_PALMA_PUNTIRO } from "./t-golf-palma-puntiro.ts";
export { TENNIS_ACADEMY_MALLORCA_PEGUERA } from "./tennis-academy-mallorca-peguera.ts";
export { TENNIS_CLUB_INCA_RAIGUER } from "./tennis-club-inca-raiguer.ts";
export { THE_YOGA_HUB_SOLLER } from "./the-yoga-hub-soller.ts";
export { TOP_GYM_PALMA_GENERAL_RIERA } from "./top-gym-palma-general-riera.ts";
export { TRAMUNTANA_CLIMBING_GUIDES_SOLLER } from "./tramuntana-climbing-guides-soller.ts";
export { TRAMUNTANA_FLOW_YOGA_ALARO } from "./tramuntana-flow-yoga-alaro.ts";
export { UDYR_SPORT_PADEL_MARRATXI } from "./udyr-sport-padel-marratxi.ts";
export { URBAN_CROSSFIT_PALMA } from "./urban-crossfit-palma.ts";
export { VALL_D_OR_GOLF_CALADOR } from "./vall-d-or-golf-calador.ts";
export { VIVAGYM_CARDENAL_ROSSELL_PALMA } from "./vivagym-cardenal-rossell-palma.ts";
export { VIVAGYM_SON_FUSTER_PALMA } from "./vivagym-son-fuster-palma.ts";
export { VIVAGYM_SON_MOIX_PALMA } from "./vivagym-son-moix-palma.ts";
export { WINDSURF_STATION_POLLENSA_BAY } from "./windsurf-station-pollensa-bay.ts";
export { YOGA_MALLORCA_PORTIXOL } from "./yoga-mallorca-portixol.ts";

export const DEPORTES_SERVICES: ServiceItem[] = [
  ANYTIME_FITNESS_SANTA_CATALINA,
  ASHTANGA_YOGA_SHALA_MALLORCA_SANTA_CATALINA,
  B_FIT_MALLORCA_PALMANOVA,
  BODHANA_WELLNESS_YOGA_CAN_PASTILLA,
  BODY_VIP_FITNESS_INCA,
  BROOKLYN_FITBOXING_PALMA_CENTRO,
  BROOKLYN_FITBOXING_SON_HUGO_PALMA,
  CAPDEPERA_GOLF_ARTA,
  centro_buceo_padi_dive_mallorca_port_andratx,
  CLUB_DE_GOLF_ALCANADA_ALCUDIA,
  CLUB_TENIS_ALARO,
  CLUB_TENIS_ANDRATX,
  CLUB_TENIS_CALVIA_COSTA_DEN_BLANES,
  CLUB_TENIS_FELANITX,
  CLUB_TENIS_PADEL_PORTOL,
  CLUB_TENIS_POLLENSA,
  CLUB_TENIS_PORRERES,
  CLUB_TENIS_PORTO_CRISTO_MANACOR,
  CLUB_TENIS_SANTA_EUGENIA,
  CLUB_TENIS_SOLLER_VALLE,
  CROSSFIT_070_PALMA,
  CROSSFIT_BLAU_SON_MOIX,
  CROSSFIT_CALVIA_EL_TORO,
  CROSSFIT_CAN_PASTILLA,
  CROSSFIT_DRAGON_PALMA,
  CROSSFIT_INCA_BOX,
  CROSSFIT_LLUCMAJOR_BOX,
  CROSSFIT_MALLORCA_SANTA_PONCA,
  CROSSFIT_MANACOR_BOX,
  CROSSFIT_MORRO_DEN_FELIU_MARRATXI,
  CROSSFIT_POLLENSA_BOX,
  CROSSFIT_PORTIXOL_PALMA,
  CROSSFIT_SANTANYI_BOX,
  CROSSFIT_TRAMUNTANA_PALMA,
  diving_scuba_mallorca_port_pollensa_center,
  ELITE_FITNESS_PORT_ANDRATX,
  ES_CAU_BOULDER_FELANITX,
  F45_TRAINING_PALMA_CENTRO,
  FIT_CLUB_MALLORCA_SON_BUGADELLES,
  FIT_POINT_PADEL_FITNESS_PALMA,
  FREEFORM_BOULDER_GYM_PALMA_CENTRO,
  GOLF_DE_ANDRATX_CAMP_DE_MAR,
  GOLF_MAIORIS_LLUCMAJOR,
  GOLF_SANTA_PONSA_CALVIA,
  GOLF_SON_GUAL_PALMA,
  golf_son_muntaner_palma_arabella_hotel,
  GOLF_SON_MUNTANER_PALMA,
  GOLF_SON_QUINT_PALMA,
  GOLF_SON_VIDA_PALMA,
  HOT_YOGA_PALMA_AVENIDAS,
  HUERZELER_BICYCLE_HOLIDAYS_PLAYA_MURO,
  ILLES_CENTRES_BENESTAR_ARAGO_PALMA,
  ILLES_CENTRES_BENESTAR_CALVIA,
  ILLES_CENTRES_BENESTAR_INCA,
  ILLES_CENTRES_BENESTAR_MARRATXI,
  ILLES_CENTRES_BENESTAR_SON_RAPINYA,
  IRON_BOX_MALLORCA_FELANITX,
  MALLORCA_BIKE_HIRE_PORT_POLLENSA,
  MALLORCA_CLIMBING_SCHOOL_VALLDEMOSSA,
  MALLORCA_DIVING_CENTER_PORT_POLLENSA,
  MALLORCA_KITESCHOOL_SA_MARINA,
  MATCH_POINT_PADEL_INDOOR_PALMA,
  MCFIT_PALMA_SON_MALFERIT,
  NANO_BICYCLES_PALMA_CENTRO,
  NORDIC_WALKING_TRAMUNTANA_SOLLER,
  open_marratxi_padel_indoor_club,
  PADEL_FACTORY_MALLORCA_MARRATXI,
  PADEL_INDOOR_MANACOR,
  PADEL_LLUCMAJOR_CLUB,
  padelindoor_mallorca_club_son_hugo_palma,
  PALACIO_MUNICIPAL_DEPORTES_SON_MOIX,
  PALMA_BOXING_CLUB_SON_ARMADAMS,
  PALMA_RACKET_CLUB_SON_RAPINYA,
  PILATES_STUDIO_PALMA_PASEO_MALLORCA,
  PINS_PADEL_CLUB_PALMA,
  PISCINAS_OLIMPICAS_SON_HUGO_PALMA,
  PRANA_YOGA_STUDIO_PALMA,
  PRO_CYCLE_HIRE_ALCUDIA_POLLENSA,
  PULA_GOLF_RESORT_SON_SERVERA,
  PURE_SALT_YOGA_PORT_ADRIANO,
  REAL_GOLF_DE_BENDINAT,
  ROCK_N_PALMA_ROCODROMO_SON_CASTELLO,
  ROCK_SPORT_CLIMBING_ALARO,
  SAMADHI_YOGA_POLLENSA,
  SANTA_MARIA_TENNIS_PADEL,
  SANTANYI_YOGA_SHALA,
  STUDIO_1_PERSONAL_TRAINING_PALMA,
  SYNERGYM_PALMA_ESCORXADOR,
  SYNERGYM_PALMA_SAN_FERNANDO,
  T_GOLF_CALVIA_MAGALUF,
  T_GOLF_PALMA_PUNTIRO,
  TENNIS_ACADEMY_MALLORCA_PEGUERA,
  TENNIS_CLUB_INCA_RAIGUER,
  THE_YOGA_HUB_SOLLER,
  TOP_GYM_PALMA_GENERAL_RIERA,
  TRAMUNTANA_CLIMBING_GUIDES_SOLLER,
  TRAMUNTANA_FLOW_YOGA_ALARO,
  UDYR_SPORT_PADEL_MARRATXI,
  URBAN_CROSSFIT_PALMA,
  VALL_D_OR_GOLF_CALADOR,
  VIVAGYM_CARDENAL_ROSSELL_PALMA,
  VIVAGYM_SON_FUSTER_PALMA,
  VIVAGYM_SON_MOIX_PALMA,
  WINDSURF_STATION_POLLENSA_BAY,
  YOGA_MALLORCA_PORTIXOL,
];
