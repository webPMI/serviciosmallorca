import type { ServiceItem, BusinessCapabilities } from "../../data/services/types.ts";

export interface GeoQueryParams {
  lat: number;
  lng: number;
  radiusKm: number;
}

export interface ServiceQueryParams {
  category?: string;
  sectorId?: string;
  sectors?: string[];
  specialties?: string[];
  capabilities?: Partial<BusinessCapabilities>;
  zone?: string;
  tags?: string[];
  minRating?: number;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  status?: "open" | "all";
  geo?: GeoQueryParams;
  query?: string;
  sortBy?: "rating" | "reviews" | "distance" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ServiceWithDistance extends ServiceItem {
  distanceKm?: number;
}
