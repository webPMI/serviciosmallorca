/**
 * displacementNotificationEngine.ts
 *
 * ⚡ MOTOR DE NOTIFICACIONES DE DESPLAZAMIENTO Y RIVALIDAD COMERCIAL (2026)
 *
 * Cuando el Comercio A (antiguo #1) es superado por el Comercio B (nuevo #1 por +1€),
 * este motor genera la alerta en tiempo real y el enlace de recuperación inmediata con 1 clic.
 */

export interface DisplacementAlert {
  id: string;
  category: string;
  categoryTitle: string;
  displacedServiceId: string;
  displacedServiceName: string;
  displacedContactEmail?: string;
  newLeaderServiceId: string;
  newLeaderServiceName: string;
  newLeaderBidEuros: number;
  counterBidPriceEuros: number;
  oneClickReclaimUrl: string;
  timestamp: string;
  read: boolean;
}

const DISPLACEMENT_STORAGE_KEY = "sm_displacement_alerts";

/**
 * Genera el payload de notificación de desplazamiento cuando un nuevo récord toma el puesto #1.
 */
export function createDisplacementAlert(params: {
  category: string;
  categoryTitle: string;
  displacedServiceId: string;
  displacedServiceName: string;
  displacedContactEmail?: string;
  newLeaderServiceId: string;
  newLeaderServiceName: string;
  newLeaderBidEuros: number;
  locale?: string;
}): DisplacementAlert {
  const counterBid = Number((params.newLeaderBidEuros + 1.0).toFixed(2));
  const lang = params.locale || "es";
  const reclaimUrl = `/${lang}/cuadro-de-honor?intent=boost&serviceId=${encodeURIComponent(params.displacedServiceId)}&serviceName=${encodeURIComponent(params.displacedServiceName)}&minBid=${counterBid}&category=${encodeURIComponent(params.category)}`;

  const alert: DisplacementAlert = {
    id: `displace_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    category: params.category,
    categoryTitle: params.categoryTitle,
    displacedServiceId: params.displacedServiceId,
    displacedServiceName: params.displacedServiceName,
    displacedContactEmail: params.displacedContactEmail,
    newLeaderServiceId: params.newLeaderServiceId,
    newLeaderServiceName: params.newLeaderServiceName,
    newLeaderBidEuros: params.newLeaderBidEuros,
    counterBidPriceEuros: counterBid,
    oneClickReclaimUrl: reclaimUrl,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // Guardar en almacenamiento local si estamos en entorno con localStorage
  if (typeof localStorage !== "undefined") {
    try {
      const existing: DisplacementAlert[] = JSON.parse(localStorage.getItem(DISPLACEMENT_STORAGE_KEY) || "[]");
      existing.unshift(alert);
      localStorage.setItem(DISPLACEMENT_STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
    } catch (err) {
      console.warn("Could not persist displacement alert:", err);
    }
  }

  return alert;
}

/**
 * Obtiene las alertas de desplazamiento activas para un negocio o usuario.
 */
export function getActiveDisplacementAlerts(serviceId?: string): DisplacementAlert[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const all: DisplacementAlert[] = JSON.parse(localStorage.getItem(DISPLACEMENT_STORAGE_KEY) || "[]");
    if (!serviceId) return all;
    return all.filter((a) => a.displacedServiceId === serviceId);
  } catch {
    return [];
  }
}

/**
 * Marca una alerta como leída.
 */
export function markDisplacementAlertAsRead(alertId: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    const all: DisplacementAlert[] = JSON.parse(localStorage.getItem(DISPLACEMENT_STORAGE_KEY) || "[]");
    const match = all.find((a) => a.id === alertId);
    if (match) {
      match.read = true;
      localStorage.setItem(DISPLACEMENT_STORAGE_KEY, JSON.stringify(all));
    }
  } catch (err) {
    console.warn("Could not mark alert as read:", err);
  }
}
