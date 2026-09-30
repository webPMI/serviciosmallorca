import type { ServiceItem } from "../types.ts";
import { ccaAndratxService } from "./cca-andratx.ts";
import { esBaluardMuseuService } from "./es-baluard-museu.ts";
import { fundacioMiroMallorcaService } from "./fundacio-miro-mallorca.ts";
import { galeriaBaroService } from "./galeria-baro.ts";
import { galeria_horrach_moya_palma } from "./galeria-horrach-moya-palma.ts";
import { galeriaKewenigService } from "./galeria-kewenig.ts";
import { galeriaMaiorService } from "./galeria-maior.ts";
import { galeriaPelairesService } from "./galeria-pelaires.ts";
import { l21_gallery_palma } from "./l21-gallery-palma.ts";
import { museuSaBassaBlancaService } from "./museu-sa-bassa-blanca.ts";

export { ccaAndratxService } from "./cca-andratx.ts";
export { esBaluardMuseuService } from "./es-baluard-museu.ts";
export { fundacioMiroMallorcaService } from "./fundacio-miro-mallorca.ts";
export { galeriaBaroService } from "./galeria-baro.ts";
export { galeria_horrach_moya_palma } from "./galeria-horrach-moya-palma.ts";
export { galeriaKewenigService } from "./galeria-kewenig.ts";
export { galeriaMaiorService } from "./galeria-maior.ts";
export { galeriaPelairesService } from "./galeria-pelaires.ts";
export { l21_gallery_palma } from "./l21-gallery-palma.ts";
export { museuSaBassaBlancaService } from "./museu-sa-bassa-blanca.ts";

export const GALERIAS_MUSEOS_SERVICES: ServiceItem[] = [
  ccaAndratxService,
  esBaluardMuseuService,
  fundacioMiroMallorcaService,
  galeriaBaroService,
  galeria_horrach_moya_palma,
  galeriaKewenigService,
  galeriaMaiorService,
  galeriaPelairesService,
  l21_gallery_palma,
  museuSaBassaBlancaService,
];
