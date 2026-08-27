/**
 * src/lib/historicalHub.ts
 *
 * 🏛️ OBSERVATORIO DE MEMORIA HISTÓRICA & LONGEVIDAD COMERCIAL DE MALLORCA
 *
 * Módulo de inteligencia de negocio para inversores, investigadores, residentes y turistas.
 * Analiza la resiliencia comercial balear, comercios centenarios (+100 años), negocios emblemáticos
 * (+30 a +50 años) y el registro histórico de cierres clasificados por causa económica y urbanística.
 */

import { SERVICES } from "../data/services/index.ts";
import type { ServiceItem, ClosureReason, HistoricalSignificance } from "../data/services/types.ts";

export interface LongevityBreakdown {
  centenaryCount: number; // +100 años
  heritage50Count: number; // +50 a +99 años
  landmark30Count: number; // +30 a +49 años
  pioneer10Count: number; // +10 a +29 años
  totalHistoricalTracked: number;
}

export interface SectorResilienceMetric {
  sector: string;
  totalTracked: number;
  averageYearsInOperation: number;
  oldestBusinessYear: number;
  oldestBusinessName: string;
  activeCount: number;
  closedCount: number;
}

export interface HistoricalBusinessFilterParams {
  minYears?: number;
  significance?: HistoricalSignificance;
  status?: "all" | "open_only" | "closed_only";
  zone?: string;
  category?: string;
  closureReason?: ClosureReason;
}

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Calcula los años de actividad de un negocio (reales o históricos).
 */
export function getYearsOfOperation(service: ServiceItem): number {
  if (typeof service.yearsInOperation === "number" && service.yearsInOperation > 0) {
    return service.yearsInOperation;
  }
  if (service.foundedYear) {
    const endYear = service.closureYear || CURRENT_YEAR;
    return Math.max(1, endYear - service.foundedYear);
  }
  return 0;
}

/**
 * Determina la significancia histórica asignada automáticamente si no fue fijada manualmente.
 */
export function resolveHistoricalSignificance(service: ServiceItem): HistoricalSignificance {
  if (service.historicalSignificance) return service.historicalSignificance;
  const years = getYearsOfOperation(service);
  if (years >= 100) return "centenary_heritage";
  if (years >= 30) return "historical_landmark";
  if (years >= 10) return "commercial_pioneer";
  return "standard";
}

/**
 * Filtra negocios con valor histórico y longevidad comprobada.
 */
export function getHistoricalBusinesses(params: HistoricalBusinessFilterParams = {}): ServiceItem[] {
  return SERVICES.filter((service) => {
    const years = getYearsOfOperation(service);
    const minYears = params.minYears ?? 10;
    if (years < minYears) return false;

    if (params.significance && resolveHistoricalSignificance(service) !== params.significance) {
      return false;
    }

    if (params.status === "open_only" && service.status === "permanently_closed") {
      return false;
    }
    if (params.status === "closed_only" && service.status !== "permanently_closed") {
      return false;
    }

    if (params.zone && service.zone !== params.zone) {
      return false;
    }

    if (params.category && service.category !== params.category) {
      return false;
    }

    if (params.closureReason && service.closureReason !== params.closureReason) {
      return false;
    }

    return true;
  }).sort((a, b) => getYearsOfOperation(b) - getYearsOfOperation(a));
}

/**
 * Obtiene los comercios centenarios de Mallorca (+100 años de historia ininterrumpida o legado documentado).
 */
export function getCentenaryBusinesses(): ServiceItem[] {
  return getHistoricalBusinesses({ minYears: 100 });
}

/**
 * Devuelve el desglose estadístico de longevidad del tejido empresarial en la isla.
 */
export function getLongevityStatistics(): LongevityBreakdown {
  let centenary = 0;
  let heritage50 = 0;
  let landmark30 = 0;
  let pioneer10 = 0;

  for (const s of SERVICES) {
    const y = getYearsOfOperation(s);
    if (y >= 100) centenary++;
    else if (y >= 50) heritage50++;
    else if (y >= 30) landmark30++;
    else if (y >= 10) pioneer10++;
  }

  return {
    centenaryCount: centenary,
    heritage50Count: heritage50,
    landmark30Count: landmark30,
    pioneer10Count: pioneer10,
    totalHistoricalTracked: centenary + heritage50 + landmark30 + pioneer10,
  };
}

/**
 * Calcula la métrica de resiliencia y supervivencia empresarial por sector.
 */
export function getSectorResilienceMetrics(): SectorResilienceMetric[] {
  const bySector = new Map<string, ServiceItem[]>();

  for (const s of SERVICES) {
    const cat = s.category || "otros";
    const list = bySector.get(cat) || [];
    list.push(s);
    bySector.set(cat, list);
  }

  const metrics: SectorResilienceMetric[] = [];

  for (const [sector, items] of bySector.entries()) {
    const historicalItems = items.filter((s) => getYearsOfOperation(s) >= 5);
    if (historicalItems.length === 0) continue;

    let totalYears = 0;
    let oldestYear = CURRENT_YEAR;
    let oldestName = "";
    let active = 0;
    let closed = 0;

    for (const s of historicalItems) {
      const y = getYearsOfOperation(s);
      totalYears += y;
      const fYear = s.foundedYear || CURRENT_YEAR - y;
      if (fYear < oldestYear) {
        oldestYear = fYear;
        oldestName = s.name;
      }
      if (s.status === "permanently_closed") closed++;
      else active++;
    }

    metrics.push({
      sector,
      totalTracked: historicalItems.length,
      averageYearsInOperation: Math.round((totalYears / historicalItems.length) * 10) / 10,
      oldestBusinessYear: oldestYear,
      oldestBusinessName: oldestName,
      activeCount: active,
      closedCount: closed,
    });
  }

  return metrics.sort((a, b) => b.averageYearsInOperation - a.averageYearsInOperation);
}
