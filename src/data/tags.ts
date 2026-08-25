/**
 * Catálogo CERRADO de etiquetas (Nivel 4 transversal) — docs/TAXONOMY.md §5.
 *
 * Regla de oro (P-02): una `tag` nunca es texto libre. Siempre `dominio:valor`,
 * en minúsculas kebab-case ASCII, y debe existir en este catálogo para poder
 * asignarse a un `ServiceItem`. Mostrar al usuario vía i18n:
 * `translations[tagI18nKey(tag)]` → `tags.<dominio>.<valor>` (GR-04).
 *
 * Para ampliar un dominio: añade entradas aquí y documenta el cambio en
 * docs/TAXONOMY.md §5.2. Nunca introduzcas tags directamente en services.ts.
 */
import { MALLORCA_ZONES, type LocalizedText } from "./zones.ts";

export const TAG_DOMAINS = ["zona", "product", "mod", "amb", "aud", "temps"] as const;
export type TagDomain = (typeof TAG_DOMAINS)[number];

export interface TagDef {
  /** Id técnico completo: "product:lujo" */
  id: string;
  domain: TagDomain;
  label: LocalizedText;
}

function def(domain: TagDomain, value: string, es: string, en: string, ca: string): TagDef {
  return { id: `${domain}:${value}`, domain, label: { es, en, ca } };
}

/** Normaliza texto libre a slug kebab-case ASCII (translitera à/ñ/ç… → a/n/c). */
export function normalizeToKebabAscii(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ------------------------------------------------------------------ */
/* Catálogos estáticos (dominios no geográficos)                       */
/* ------------------------------------------------------------------ */

/** Segmento de producto/precio y estilos especializados — docs/TAXONOMY.md §5.2 */
const PRODUCT_TAGS: TagDef[] = [
  def("product", "lujo", "Lujo", "Luxury", "Luxe"),
  def("product", "premium", "Premium", "Premium", "Premium"),
  def("product", "accesible", "Accesible", "Affordable", "Assequible"),
  def("product", "familiar", "Familiar", "Family-friendly", "Familiar"),
  def("product", "adultos", "Solo adultos", "Adults only", "Només adults"),
  def("product", "fine-line", "Fine Line", "Fine Line", "Fine Line"),
  def("product", "piercing-titanio", "Piercing Titanio", "Titanium Piercing", "Pírcing Titani"),
  def("product", "traditional", "Tradicional", "Traditional", "Tradicional"),
  def("product", "neotradicional", "Neotradicional", "Neotraditional", "Neotradicional"),
  def("product", "realismo", "Realismo", "Realism", "Realisme"),
  def("product", "blackwork", "Blackwork", "Blackwork", "Blackwork"),
  def("product", "lettering", "Lettering", "Lettering", "Lettering"),
];

/** Modalidad de prestación */
const MOD_TAGS: TagDef[] = [
  def("mod", "a-domicilio", "A domicilio", "At home", "A domicili"),
  def("mod", "en-local", "En local", "In-store", "Al local"),
  def("mod", "online", "Online", "Online", "En línia"),
  def("mod", "hibrido", "Híbrido", "Hybrid", "Híbrid"),
  def("mod", "cita-previa", "Cita previa", "By appointment", "Cita prèvia"),
  def("mod", "walk-in", "Walk-in (Sin cita)", "Walk-in", "Sense cita"),
];

/** Extras/equipación incluidos */
const AMB_TAGS: TagDef[] = [
  def("amb", "patron", "Con patrón incluido", "Skipper included", "Amb patró inclòs"),
  def("amb", "conductor", "Con conductor incluido", "Driver included", "Amb conductor inclòs"),
  def("amb", "catering", "Con catering incluido", "Catering included", "Amb càtering inclòs"),
];

/** Audiencia objetivo */
const AUD_TAGS: TagDef[] = [
  def("aud", "familias", "Familias", "Families", "Famílies"),
  def("aud", "parejas", "Parejas", "Couples", "Parelles"),
  def("aud", "expat", "Expatriados", "Expats", "Expatriats"),
  def("aud", "b2b", "Empresas (B2B)", "Business (B2B)", "Empreses (B2B)"),
  def("aud", "seniors", "Seniors", "Seniors", "Sèniors"),
];

/** Estacionalidad */
const TEMPS_TAGS: TagDef[] = [
  def("temps", "verano", "Verano", "Summer", "Estiu"),
  def("temps", "invierno", "Invierno", "Winter", "Hivern"),
  def("temps", "todo-el-ano", "Todo el año", "All year round", "Tot l'any"),
];

/* ------------------------------------------------------------------ */
/* Etiquetas geográficas derivadas (zona:*)                            */
/* ------------------------------------------------------------------ */

/**
 * Deriva las etiquetas `zona:<slug>` automáticamente desde
 * `MALLORCA_ZONES` (macro-zona) y `popularAreas` (núcleo fino),
 * garantizando paridad entre geografía y taxonomía de etiquetas.
 */
export function buildZoneTags(): TagDef[] {
  const tags: TagDef[] = [];
  for (const zone of MALLORCA_ZONES) {
    tags.push(def("zona", zone.id, zone.name.es, zone.name.en, zone.name.ca));
    for (const area of zone.popularAreas) {
      const value = normalizeToKebabAscii(area);
      // Los topónimos propios no se traducen (GR-12: fidelidad al nombre oficial)
      tags.push(def("zona", value, area, area, area));
    }
  }
  return tags;
}

/* ------------------------------------------------------------------ */
/* Índice y API pública                                                */
/* ------------------------------------------------------------------ */

const TAG_INDEX = new Map<string, TagDef>();
for (const tag of [...PRODUCT_TAGS, ...MOD_TAGS, ...AMB_TAGS, ...AUD_TAGS, ...TEMPS_TAGS, ...buildZoneTags()]) {
  if (!TAG_INDEX.has(tag.id)) TAG_INDEX.set(tag.id, tag);
}

/** Catálogo global deduplicado (única fuente válida de tags). */
export const TAG_CATALOG: TagDef[] = [...TAG_INDEX.values()];

/** Parsea "dominio:valor"; null si el dominio es desconocido o el formato inválido. */
export function parseTag(tag: string): { domain: TagDomain; value: string } | null {
  const sep = tag.indexOf(":");
  if (sep <= 0 || sep === tag.length - 1) return null;
  const rawDomain = tag.slice(0, sep);
  if (!(TAG_DOMAINS as readonly string[]).includes(rawDomain)) return null;
  return { domain: rawDomain as TagDomain, value: tag.slice(sep + 1) };
}

/** Patrón técnico: `^[a-z]+:[a-z0-9]+(-[a-z0-9]+)*$` (kebab-case ASCII). */
export function isTagPattern(tag: string): boolean {
  return /^[a-z]+:[a-z0-9]+(-[a-z0-9]+)*$/.test(tag);
}

/** Una tag es válida si cumple patrón, dominio conocido y existe en el catálogo. */
export function isValidTag(tag: string): boolean {
  return isTagPattern(tag) && parseTag(tag) !== null && TAG_INDEX.has(tag);
}

/** Clave i18n de visualización: "product:lujo" → "tags.product.lujo". */
export function tagI18nKey(tag: string): string | null {
  const parsed = parseTag(tag);
  return parsed ? `tags.${parsed.domain}.${parsed.value}` : null;
}

export function getTagById(id: string): TagDef | undefined {
  return TAG_INDEX.get(id);
}

export function getTagsByDomain(domain: TagDomain): TagDef[] {
  return TAG_CATALOG.filter((t) => t.domain === domain);
}
