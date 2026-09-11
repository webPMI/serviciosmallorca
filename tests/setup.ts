import { afterEach } from "vitest";
import { _resetTableInitializedForTesting } from "../src/lib/d1Logger";

// Configuración global para entorno de pruebas
if (typeof process !== "undefined") {
  process.env.NODE_ENV = "test";
}

afterEach(() => {
  // Limpieza del estado de la tabla e historial de deduplicación entre pruebas
  _resetTableInitializedForTesting();
});
