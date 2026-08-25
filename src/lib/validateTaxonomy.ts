import { SUPER_SECTORS, CATEGORIES } from "../data/categories.ts";
import { MALLORCA_ZONES } from "../data/zones.ts";
import { TAG_CATALOG } from "../data/tags.ts";

export interface TaxonomyIntegrityResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Valida la integridad estructural de toda la taxonomía:
 * - Super-sectores únicos y completos
 * - Categorías vinculadas a un sector existente
 * - Zonas y etiquetas bien formadas
 */
export function validateTaxonomyIntegrity(): TaxonomyIntegrityResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sectorIds = new Set<string>();
  const categoryIds = new Set<string>();

  // 1. Validar SuperSectores
  for (const sector of SUPER_SECTORS) {
    if (!sector.id || sector.id.trim() === "") {
      errors.push(`SuperSector sin ID encontrado`);
    } else if (sectorIds.has(sector.id)) {
      errors.push(`SuperSector ID duplicado: "${sector.id}"`);
    } else {
      sectorIds.add(sector.id);
    }

    if (!sector.name.es || !sector.name.en || !sector.name.ca) {
      errors.push(`SuperSector "${sector.id}" no tiene traducciones trilingües completas`);
    }
  }

  // 2. Validar Categorías
  for (const cat of CATEGORIES) {
    if (!cat.id || cat.id.trim() === "") {
      errors.push(`Categoría sin ID encontrada`);
    } else if (categoryIds.has(cat.id)) {
      errors.push(`Categoría ID duplicada: "${cat.id}"`);
    } else {
      categoryIds.add(cat.id);
    }

    if (!sectorIds.has(cat.sectorId)) {
      errors.push(`Categoría "${cat.id}" referencia un sector inexistente: "${cat.sectorId}"`);
    }

    if (!cat.synonyms || cat.synonyms.length === 0) {
      warnings.push(`Categoría "${cat.id}" no tiene sinónimos definidos para búsqueda`);
    }
  }

  // 3. Validar Zonas
  if (MALLORCA_ZONES.length === 0) {
    errors.push("El catálogo de zonas MALLORCA_ZONES está vacío");
  }

  // 4. Validar Tags
  if (TAG_CATALOG.length === 0) {
    errors.push("El catálogo de etiquetas TAG_CATALOG está vacío");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
