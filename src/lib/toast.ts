/**
 * 🔔 Global Toast Notification System — WebApp Starter
 *
 * Provides a lightweight, accessible, and reactive toast system.
 * Works seamlessly across all client-side scripts.
 *
 * Usage:
 *   import { toast } from "../lib/toast";
 *   toast.success("¡Guardado correctamente!");
 *   toast.error("Hubo un problema al procesar los datos");
 *   toast.warning("Sesión próxima a expirar");
 *   toast.info("Nueva actualización disponible");
 */

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number; // ms, default 4000, 0 for persistent
  icon?: string;
}

export interface ToastDetail extends ToastOptions {
  id: string;
  type: ToastType;
  duration: number;
}

const DEFAULT_ICONS: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

/**
 * Dispatches a toast notification event to the global container.
 */
export function showToast(options: ToastOptions | string, type: ToastType = "info"): void {
  if (typeof window === "undefined") return;

  const payload: ToastOptions =
    typeof options === "string" ? { message: options, type } : { ...options, type: options.type || type };

  const finalToast: ToastDetail = {
    id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: payload.type || "info",
    title: payload.title,
    message: payload.message,
    duration: payload.duration !== undefined ? payload.duration : 4000,
    icon: payload.icon || DEFAULT_ICONS[payload.type || "info"],
  };

  window.dispatchEvent(
    new CustomEvent<ToastDetail>("app:toast", {
      detail: finalToast,
    }),
  );
}

/**
 * Convenient shortcut helpers for all toast types.
 */
export const toast = {
  success: (message: string, options?: Omit<ToastOptions, "message" | "type">): void => {
    showToast({ ...options, message, type: "success" });
  },
  error: (message: string, options?: Omit<ToastOptions, "message" | "type">): void => {
    showToast({ ...options, message, type: "error" });
  },
  warning: (message: string, options?: Omit<ToastOptions, "message" | "type">): void => {
    showToast({ ...options, message, type: "warning" });
  },
  info: (message: string, options?: Omit<ToastOptions, "message" | "type">): void => {
    showToast({ ...options, message, type: "info" });
  },
  show: showToast,
};

// Attach to window for easy debugging if in browser
if (typeof window !== "undefined") {
  (window as any).toast = toast;
}
