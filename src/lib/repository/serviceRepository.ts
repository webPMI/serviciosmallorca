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
   * Consulta dinámica con soporte para grafos de relación, sectores múltiples,
   * matriz de capacidades e intención de usuario, y geolocalización Haversine.
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

    // 4. Filtro por Categoría / Sectores Múltiples (Grafo de relaciones)
    if (params.category) {
      result = result.filter((s) => {
        return (
          s.category === params.category ||
          s.secondaryCategories?.includes(params.category!) ||
          s.sectors?.includes(params.category!)
        );
      });
    }

    if (params.sectors && params.sectors.length > 0) {
      result = result.filter((s) => {
        return params.sectors!.some(
          (sec) =>
            s.sectorId === sec ||
            s.category === sec ||
            s.sectors?.includes(sec) ||
            s.secondaryCategories?.includes(sec),
        );
      });
    }

    // 5. Filtro por Especialidades
    if (params.specialties && params.specialties.length > 0) {
      result = result.filter((s) => {
        return params.specialties!.some((spec) => {
          if (s.tags?.includes(spec) || s.tags?.includes(`product:${spec}`) || s.features?.includes(spec)) {
            return true;
          }
          if (!s.specialties) return false;
          if (Array.isArray(s.specialties)) {
            return s.specialties.includes(spec);
          }
          return Boolean(
            s.specialties.es?.includes(spec) ||
            s.specialties.en?.includes(spec) ||
            s.specialties.ca?.includes(spec) ||
            s.specialties.de?.includes(spec),
          );
        });
      });
    }

    // 6. Filtro por Matriz de Capacidades (Intención de Usuario)
    if (params.capabilities) {
      const caps = params.capabilities;
      result = result.filter((s) => {
        // Pet friendly
        if (caps.petFriendly) {
          const isPet =
            s.capabilities?.petFriendly ||
            s.amenities?.includes("pet_friendly") ||
            s.features?.includes("pet_friendly");
          if (!isPet) return false;
        }
        // Wheelchair / Accesibilidad PMR
        if (caps.wheelchairAccessible) {
          const isPmr =
            s.capabilities?.wheelchairAccessible ||
            s.amenities?.includes("wheelchair_accessible") ||
            s.features?.includes("accessible");
          if (!isPmr) return false;
        }
        // Kids Area
        if (caps.kidsArea) {
          const isKids =
            s.capabilities?.kidsArea || s.targetAudience?.includes("familias") || s.amenities?.includes("kids_area");
          if (!isKids) return false;
        }
        // Urgencias 24h
        if (caps.emergency24h) {
          if (!s.emergency24h && !s.capabilities?.emergency24h) return false;
        }
        // Servicio en Villa / Domicilio
        if (caps.inVillaService) {
          if (!s.inVillaService && !s.capabilities?.inVillaService) return false;
        }
        // Terraza
        if (caps.terrace) {
          const hasTerrace =
            s.capabilities?.terrace || s.amenities?.includes("terrace") || s.features?.includes("terrace");
          if (!hasTerrace) return false;
        }
        // Vistas al Mar
        if (caps.seaViews) {
          const hasSea =
            s.capabilities?.seaViews || s.amenities?.includes("sea_views") || s.features?.includes("sea_views");
          if (!hasSea) return false;
        }
        // Reserva Online
        if (caps.onlineBooking) {
          const hasBooking = s.capabilities?.onlineBooking || (s.website && s.website.startsWith("http"));
          if (!hasBooking) return false;
        }
        return true;
      });
    }

    // 7. Filtro por Sector Macro
    if (params.sectorId) {
      result = result.filter((s) => s.sectorId === params.sectorId || s.sectors?.includes(params.sectorId!));
    }

    // 8. Filtro por Zona Geográfica
    if (params.zone) {
      result = result.filter((s) => s.zone === params.zone);
    }

    // 9. Filtro por Puntuación Mínima
    if (params.minRating !== undefined) {
      result = result.filter((s) => (s.rating || 0) >= (params.minRating ?? 0));
    }

    // 10. Filtro por Etiquetas (Tags)
    if (params.tags && params.tags.length > 0) {
      result = result.filter((s) => {
        if (!s.tags || s.tags.length === 0) return false;
        return params.tags!.every((tag) => s.tags!.includes(tag));
      });
    }

    // 11. Filtro por Texto Libre (Búsqueda inteligente)
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
        let matchSpecs = false;
        if (s.specialties) {
          if (Array.isArray(s.specialties)) {
            matchSpecs = s.specialties.some((sp) => sp.toLowerCase().includes(q));
          } else {
            matchSpecs = Boolean(
              s.specialties.es?.some((sp) => sp.toLowerCase().includes(q)) ||
              s.specialties.en?.some((sp) => sp.toLowerCase().includes(q)) ||
              s.specialties.ca?.some((sp) => sp.toLowerCase().includes(q)) ||
              s.specialties.de?.some((sp) => sp.toLowerCase().includes(q)),
            );
          }
        }
        return matchName || matchDesc || matchAddress || matchTags || matchSpecs;
      });
    }

    // 12. Filtro Geo-espacial (Radio en Km usando Haversine)
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

    // 13. Ordenación
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

    // 14. Paginación
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
