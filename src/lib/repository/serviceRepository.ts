import { SERVICES } from "../../data/services/index.ts";
import type { ServiceItem } from "../../data/services/types.ts";
import { calculateHaversineDistance } from "../geoUtils.ts";
import type { PaginatedResult, ServiceQueryParams, ServiceWithDistance } from "./types.ts";

export class ServiceRepository {
  private data: ServiceItem[];

  constructor(customData?: ServiceItem[]) {
    this.data = customData || SERVICES;
  }

  /**
   * Obtiene un negocio por su slug único
   */
  public async getBySlug(slug: string): Promise<ServiceItem | null> {
    const item = this.data.find((s) => s.slug === slug);
    return item || null;
  }

  /**
   * Obtiene un negocio por su ID técnico
   */
  public async getById(id: string): Promise<ServiceItem | null> {
    const item = this.data.find((s) => s.id === id);
    return item || null;
  }

  /**
   * Consulta dinámica con soporte para filtros de texto, categoría, zona, rating y geolocalización
   */
  public async query(params: ServiceQueryParams = {}): Promise<PaginatedResult<ServiceWithDistance>> {
    let result: ServiceWithDistance[] = [...this.data];

    // 1. Filtro por Estado (por defecto solo abiertos y públicos a menos que se especifique 'all')
    if (params.status !== "all") {
      result = result.filter((s) => s.status !== "incomplete_admin_only" && s.status !== "permanently_closed");
    }

    // 2. Filtro por Verificación
    if (params.verifiedOnly) {
      result = result.filter((s) => s.verified);
    }

    // 3. Filtro por Destacados
    if (params.featuredOnly) {
      result = result.filter((s) => s.featured);
    }

    // 4. Filtro por Categoría
    if (params.category) {
      result = result.filter((s) => s.category === params.category);
    }

    // 5. Filtro por Sector Macro
    if (params.sectorId) {
      result = result.filter((s) => s.sectorId === params.sectorId);
    }

    // 6. Filtro por Zona Geográfica
    if (params.zone) {
      result = result.filter((s) => s.zone === params.zone);
    }

    // 7. Filtro por Puntuación Mínima
    if (params.minRating !== undefined) {
      result = result.filter((s) => (s.rating || 0) >= (params.minRating ?? 0));
    }

    // 8. Filtro por Etiquetas (Tags)
    if (params.tags && params.tags.length > 0) {
      result = result.filter((s) => {
        if (!s.tags || s.tags.length === 0) return false;
        return params.tags!.every((tag) => s.tags!.includes(tag));
      });
    }

    // 9. Filtro por Texto Libre (Búsqueda inteligente)
    if (params.query && params.query.trim().length > 0) {
      const q = params.query.toLowerCase().trim();
      result = result.filter((s) => {
        const matchName = s.name.toLowerCase().includes(q);
        const matchDesc =
          s.shortDescription.es.toLowerCase().includes(q) ||
          s.shortDescription.en?.toLowerCase().includes(q) ||
          s.shortDescription.de?.toLowerCase().includes(q) ||
          s.shortDescription.ca?.toLowerCase().includes(q);
        const matchAddress = s.address.toLowerCase().includes(q);
        const matchTags = s.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        return matchName || matchDesc || matchAddress || matchTags;
      });
    }

    // 10. Filtro Geo-espacial (Radio en Km usando Haversine)
    if (params.geo) {
      const { lat, lng, radiusKm } = params.geo;
      result = result
        .map((s) => {
          if (!s.coordinates) return s;
          const dist = calculateHaversineDistance(lat, lng, s.coordinates.lat, s.coordinates.lng);
          return {
            ...s,
            distanceKm: Number(dist.toFixed(2)),
          };
        })
        .filter((s) => s.distanceKm !== undefined && s.distanceKm <= radiusKm);
    }

    // 11. Ordenación
    const sortBy = params.sortBy || (params.geo ? "distance" : "rating");
    const sortOrder = params.sortOrder || (sortBy === "distance" ? "asc" : "desc");

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "distance") {
        comparison = (a.distanceKm || 99999) - (b.distanceKm || 99999);
      } else if (sortBy === "rating") {
        comparison = (a.rating || 0) - (b.rating || 0);
      } else if (sortBy === "reviews") {
        comparison = (a.reviewCount || 0) - (b.reviewCount || 0);
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    // 12. Paginación
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.max(1, Math.min(100, params.pageSize || 20));
    const total = result.length;
    const totalPages = Math.ceil(total / pageSize);
    const offset = (page - 1) * pageSize;
    const items = result.slice(offset, offset + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
      hasMore: page < totalPages,
    };
  }

  /**
   * Obtiene los negocios más cercanos a unas coordenadas GPS dadas
   */
  public async getNearby(
    lat: number,
    lng: number,
    radiusKm: number = 10,
    limit: number = 5,
  ): Promise<ServiceWithDistance[]> {
    const res = await this.query({
      geo: { lat, lng, radiusKm },
      sortBy: "distance",
      sortOrder: "asc",
      pageSize: limit,
    });
    return res.items;
  }
}

// Instancia singleton por defecto
export const defaultRepository = new ServiceRepository();
