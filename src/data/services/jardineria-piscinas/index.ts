import type { ServiceItem } from "../types.ts";
import { canJuanito } from "./can-juanito.ts";
import { piscinasPonentAndratx } from "./piscinas-spas-ponent-andratx.ts";
import { viverosSantaMaria } from "./viveros-santa-maria.ts";

export { canJuanito, piscinasPonentAndratx, viverosSantaMaria };

export const JARDINERIA_SERVICES: ServiceItem[] = [canJuanito, piscinasPonentAndratx, viverosSantaMaria];
