/**
 * 📋 DevTools Logger - WebApp Starter
 *
 * Logger profesional con buffer circular de 500 entradas.
 * Intercepta console.log, warn, error, info, debug.
 * Expone API: window.__devtoolsLogger
 *
 * Integración con DevTools: los logs se envían vía postMessage al DevTools Panel
 * y también se almacenan en memoria para consulta desde el floating button.
 */
(function () {
  "use strict";

  if (window.__devtoolsLogger) return; // singleton

  var MAX_ENTRIES = 500;
  var buffer = [];
  var originalConsole = {};
  var LEVELS = ["debug", "info", "log", "warn", "error"];

  // ==========================================================================
  // LOGGER API
  // ==========================================================================
  var logger = {
    /** @returns {Array} copia del buffer completo */
    getEntries: function () {
      return buffer.slice();
    },

    /** @returns {number} número de entradas */
    getCount: function () {
      return buffer.length;
    },

    /** Limpiar buffer */
    clear: function () {
      buffer.length = 0;
    },

    /** Obtener entradas filtradas por nivel */
    getByLevel: function (level) {
      return buffer.filter(function (e) {
        return e.level === level;
      });
    },

    /** Obtener las últimas N entradas */
    getLast: function (n) {
      n = n || 50;
      return buffer.slice(-n);
    },

    /** Exportar como JSON string */
    exportJSON: function (pretty) {
      return JSON.stringify(buffer, null, pretty ? 2 : 0);
    },

    /** Exportar como texto legible */
    exportText: function () {
      return buffer
        .map(function (e) {
          var time = new Date(e.timestamp).toISOString();
          var level = e.level.toUpperCase().padEnd(5, " ");
          var args = e.args
            .map(function (a) {
              if (a === null) return "null";
              if (a === undefined) return "undefined";
              if (typeof a === "object") {
                try {
                  return JSON.stringify(a, null, 0);
                } catch (ex) {
                  return "[Object]";
                }
              }
              return String(a);
            })
            .join(" ");
          return "[" + time + "] " + level + " | " + args;
        })
        .join("\n");
    },

    /** Suscribirse a nuevos logs (callback recibe entry) */
    subscribe: function (fn) {
      if (!this._subscribers) this._subscribers = [];
      this._subscribers.push(fn);
      return function unsubscribe() {
        var idx = this._subscribers.indexOf(fn);
        if (idx >= 0) this._subscribers.splice(idx, 1);
      }.bind(this);
    },

    /** Añadir entrada manualmente */
    add: function (level, args) {
      pushEntry(level, args);
    },
  };

  window.__devtoolsLogger = logger;

  // ==========================================================================
  // INTERNAL: push entry
  // ==========================================================================
  function pushEntry(level, args) {
    var entry = {
      timestamp: Date.now(),
      level: level,
      args: Array.prototype.slice.call(args),
      stack: null,
    };

    // Capturar stack trace para errores
    if (level === "error" || level === "warn") {
      try {
        throw new Error();
      } catch (e) {
        var stack = e.stack || "";
        // Limpiar: quitar las primeras líneas (este archivo)
        var lines = stack.split("\n").slice(3);
        entry.stack = lines.join("\n").trim();
      }
    }

    // Buffer circular
    buffer.push(entry);
    if (buffer.length > MAX_ENTRIES) {
      buffer.shift();
    }

    // Notificar suscriptores
    if (logger._subscribers) {
      logger._subscribers.forEach(function (fn) {
        try {
          fn(entry);
        } catch (e) {
          /* silencioso */
        }
      });
    }

    // Enviar vía postMessage al DevTools panel (si existe target)
    try {
      window.postMessage({ type: "__DT_LOG", payload: entry }, "*");
    } catch (e) {
      /* cross-origin */
    }
  }

  // ==========================================================================
  // INTERCEPT console.*
  // ==========================================================================
  LEVELS.forEach(function (level) {
    if (console[level]) {
      originalConsole[level] = console[level].bind(console);
      console[level] = function () {
        // Llamar al original
        try {
          originalConsole[level].apply(console, arguments);
        } catch (e) {}

        // Almacenar en buffer
        pushEntry(level, arguments);
      };
    }
  });

  // También interceptar console.assert (como error si falla)
  if (console.assert) {
    var origAssert = console.assert.bind(console);
    console.assert = function (condition) {
      origAssert.apply(console, arguments);
      if (!condition) {
        var args = Array.prototype.slice.call(arguments, 1);
        pushEntry("error", ["Assertion failed:"].concat(args));
      }
    };
  }

  // ==========================================================================
  // GLOBAL ERROR & TELEMETRY PERSISTENCE (DEPLOYMENT HEALTH MONITOR)
  // ==========================================================================
  var CRASH_STORAGE_KEY = "sm_production_error_log";
  var MAX_CRASH_ENTRIES = 50;

  function diagnoseErrorReason(msg, stack) {
    var text = (String(msg) + " " + String(stack || "")).toLowerCase();
    if (text.includes("is not a function") || text.includes("undefined is not an object")) {
      return "PROP_OR_FUNCTION_UNDEFINED: Se intentó invocar una función o prop no pasada al componente (posible prop omitida en Astro).";
    }
    if (text.includes("networkerror") || text.includes("failed to fetch") || text.includes("load failed")) {
      return "NETWORK_FAILURE: Fallo de conectividad o endpoint inaccesible en producción.";
    }
    if (text.includes("permission-denied") || text.includes("missing or insufficient permissions")) {
      return "SECURITY_RULES_DENIED: Bloqueo de seguridad de Firestore Rules o autorización insuficiente.";
    }
    if (text.includes("null") || text.includes("cannot read properties of undefined")) {
      return "NULL_POINTER_EXCEPTION: Intento de acceder a propiedades de un objeto nulo o indefinido.";
    }
    if (text.includes("chunkloaderror") || text.includes("loading chunk")) {
      return "ASSET_STALE_CACHE: Versión de build obsoleta en caché del cliente.";
    }
    return "UNKNOWN_RUNTIME_EXCEPTION: Error no clasificado en tiempo de ejecución.";
  }

  function recordCrashDump(crashData) {
    try {
      var raw = localStorage.getItem(CRASH_STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      list.unshift(crashData);
      if (list.length > MAX_CRASH_ENTRIES) list.pop();
      localStorage.setItem(CRASH_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      /* localStorage quota o privado */
    }
  }

  logger.getCrashLogs = function () {
    try {
      var raw = localStorage.getItem(CRASH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  logger.clearCrashLogs = function () {
    try {
      localStorage.removeItem(CRASH_STORAGE_KEY);
    } catch (e) {}
  };

  logger.diagnoseError = diagnoseErrorReason;

  // Interceptar errores globales síncronos
  window.addEventListener("error", function (event) {
    var errorObj = event.error || {};
    var reason = diagnoseErrorReason(event.message || errorObj.message, errorObj.stack);
    var crashData = {
      timestamp: Date.now(),
      isoDate: new Date().toISOString(),
      type: "UNHANDLED_ERROR",
      message: event.message || String(errorObj),
      filename: event.filename || "unknown",
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      stack: errorObj.stack || null,
      pathname: window.location.pathname,
      search: window.location.search,
      userAgent: navigator.userAgent,
      diagnosticReason: reason,
    };

    pushEntry("error", ["[CRASH DETECTADO]", crashData.message, reason, crashData]);
    recordCrashDump(crashData);
  });

  // Interceptar rechazos de promesas no capturadas
  window.addEventListener("unhandledrejection", function (event) {
    var reasonStr = event.reason
      ? event.reason.stack || event.reason.message || String(event.reason)
      : "Unknown rejection";
    var diagnostic = diagnoseErrorReason(reasonStr, event.reason && event.reason.stack);
    var crashData = {
      timestamp: Date.now(),
      isoDate: new Date().toISOString(),
      type: "UNHANDLED_PROMISE_REJECTION",
      message: reasonStr,
      pathname: window.location.pathname,
      search: window.location.search,
      userAgent: navigator.userAgent,
      diagnosticReason: diagnostic,
    };

    pushEntry("error", ["[PROMISE REJECTION]", reasonStr, diagnostic, crashData]);
    recordCrashDump(crashData);
  });

  // ==========================================================================
  // LOG ARCHIVO CARGADO
  // ==========================================================================
  var nativeLog = originalConsole.log || function () {};
  nativeLog(
    "%c📋 DevTools & Health Logger active %c| %cbuffer: " + MAX_ENTRIES + " entries %c| %cwindow.__devtoolsLogger",
    "color:#00d4aa;font-weight:bold",
    "",
    "color:#ffa502",
    "",
    "color:#8899aa",
  );
})();
