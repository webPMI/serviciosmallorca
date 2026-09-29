import { auth, db } from "../lib/firebase";
import {
  createServiceClaim,
  createServiceDeletionRequest,
  createServiceReport,
  buildClaimId,
  type ReportCategory,
} from "../lib/serviceActions";
import { getServiceOverride, mergeServiceWithOverride } from "../lib/serviceOverrides";
import { checkRateLimit } from "../lib/managerSecurityEngine";
import { reportClientFailure } from "../lib/clientTelemetry";
import { initAutomaticClickTracking } from "../lib/conversionTracking";
import {
  validatePhoneInput,
  validateEmailInput,
  validateTaxIdOrDocument,
  sanitizeText,
} from "../lib/ownershipValidation";
import type { ServiceItem } from "../data/services/types";

/** Etiquetas i18n servidas por la isla JSON `#service-static-data` (GR-04). */
interface OverlaySnapshotLabels {
  statusSeasonalClosure?: string;
  statusPermanentlyClosed?: string;
  claimDuplicate?: string;
  claimAlreadyClaimed?: string;
  claimRateLimited?: string;
}

/** Instantánea estática de la ficha publicada (Overlay Pattern · INV-07). */
type OverlaySnapshot = Partial<ServiceItem> & { labels?: OverlaySnapshotLabels };

let cachedOverlaySnapshot: OverlaySnapshot | null | undefined;

/** Lee (una sola vez) la instantánea estática publicada por el servidor. */
function readOverlaySnapshot(): OverlaySnapshot | null {
  if (cachedOverlaySnapshot !== undefined) return cachedOverlaySnapshot;
  const el = document.getElementById("service-static-data");
  if (!el?.textContent) {
    cachedOverlaySnapshot = null;
    return null;
  }
  try {
    cachedOverlaySnapshot = JSON.parse(el.textContent) as OverlaySnapshot;
  } catch (error) {
    reportClientFailure("overlay/parse-snapshot", error, { category: "CLIENT_JS" });
    cachedOverlaySnapshot = null;
  }
  return cachedOverlaySnapshot;
}

/** Etiquetas i18n para los avisos dinámicos (sin textos hardcodeados en el cliente). */
function overlayLabels(): OverlaySnapshotLabels {
  return readOverlaySnapshot()?.labels ?? {};
}

/** Clave de idioma segura derivada del documento SSR. */
function currentLocaleKey(): "es" | "en" | "ca" | "de" {
  const lang = (document.documentElement.lang || "es").slice(0, 2);
  return lang === "en" || lang === "ca" || lang === "de" ? lang : "es";
}

export function initServiceDetailClient() {
  initAutomaticClickTracking();

  // Gallery Thumbnail Swapper
  const mainDisplayImg = document.getElementById("detail-main-display-img") as HTMLImageElement;
  const thumbBtns = document.querySelectorAll(".thumb-btn");

  thumbBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const newSrc = btn.getAttribute("data-img-url");
      if (newSrc && mainDisplayImg) {
        mainDisplayImg.src = newSrc;
        mainDisplayImg.style.display = "block";
        mainDisplayImg.classList.add("is-loaded");
        const fallbackBanner = mainDisplayImg.parentElement?.querySelector(
          ".service-img-fallback-banner",
        ) as HTMLElement;
        if (fallbackBanner) fallbackBanner.style.display = "none";
        thumbBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      }
    });
  });

  // 1-Click Copy Information
  document.querySelectorAll(".btn-copy-info").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy-text");
      if (textToCopy) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          const original = btn.textContent;
          btn.textContent = "✓";
          setTimeout(() => {
            btn.textContent = original;
          }, 1500);
        } catch {
          // Fallback
        }
      }
    });
  });

  const claimModal = document.getElementById("claim-modal");
  const deleteModal = document.getElementById("delete-modal");
  const reportModal = document.getElementById("report-modal");

  // Share Service Button Fallback
  const shareBtn = document.getElementById("share-service-btn");
  const shareModal = document.getElementById("social-share-modal");
  if (shareBtn && shareModal) {
    shareBtn.addEventListener("click", () => {
      shareModal.style.display = "flex";
    });
  }

  // CORRECCIÓN CRÍTICA #1: Consolidar event listeners duplicados en un solo bloque
  // Abrir modales mediante selector universal [data-open-modal]
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-open-modal");
      if (!modalId) return;
      const targetModal = document.getElementById(modalId);
      if (!targetModal) return;

      targetModal.style.display = "flex";
      const user = auth.currentUser;

      if (modalId === "claim-modal") {
        const emailInput = document.getElementById("claim-email") as HTMLInputElement;
        const nameInput = document.getElementById("claim-name") as HTMLInputElement;
        if (user && emailInput && !emailInput.value) emailInput.value = user.email || "";
        if (user && nameInput && !nameInput.value) nameInput.value = user.displayName || "";
      } else if (modalId === "report-modal") {
        const emailInput = document.getElementById("report-email") as HTMLInputElement;
        if (user && emailInput && !emailInput.value) emailInput.value = user.email || "";
      } else if (modalId === "delete-modal") {
        const emailInput = document.getElementById("delete-email") as HTMLInputElement;
        if (user && emailInput && !emailInput.value) emailInput.value = user.email || "";
      }
    });
  });

  // Close modals
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close-modal");
      if (modalId) {
        const targetModal = document.getElementById(modalId);
        if (targetModal) targetModal.style.display = "none";
      }
    });
  });

  // Handle Claim Submission
  const claimForm = document.getElementById("claim-form") as HTMLFormElement;
  if (claimForm) {
    claimForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const user = auth.currentUser;
      const alertSuccess = document.getElementById("claim-alert-success");
      const alertError = document.getElementById("claim-alert-error");
      const submitBtn = document.getElementById("claim-submit-btn") as HTMLButtonElement;

      if (alertSuccess) alertSuccess.style.display = "none";
      if (alertError) alertError.style.display = "none";

      // CORRECCIÓN MEDIA #7: Deshabilitar botón al inicio para evitar múltiples clics
      if (submitBtn) submitBtn.disabled = true;

      if (!user) {
        if (alertError) {
          const currentUrl = window.location.pathname + window.location.search;
          const prefix = currentUrl.startsWith("/en")
            ? "/en/"
            : currentUrl.startsWith("/ca")
              ? "/ca/"
              : currentUrl.startsWith("/de")
                ? "/de/"
                : "/es/";
          alertError.innerHTML = `Debes iniciar sesión con tu cuenta para reclamar este negocio. <a href="${prefix}login?returnTo=${encodeURIComponent(currentUrl)}&intent=claim" style="color: var(--color-accent, #ffd700); text-decoration: underline; font-weight: bold; margin-left: 6px;">👉 Iniciar Sesión aquí</a>`;
          alertError.style.display = "block";
        }
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      try {
        // CORRECCIÓN MEDIA #2: Verificar que db está inicializado
        if (!db) {
          throw new Error("Firebase no está inicializado correctamente");
        }

        const serviceId = (document.getElementById("claim-service-id") as HTMLInputElement).value;
        const serviceName = (document.getElementById("claim-service-name") as HTMLInputElement).value;

        // CORRECCIÓN CRÍTICA #6: Sanitización y validación unificada (P1-4)
        const name = sanitizeText((document.getElementById("claim-name") as HTMLInputElement).value, 100);
        const email = sanitizeText(
          (document.getElementById("claim-email") as HTMLInputElement).value,
          120,
        ).toLowerCase();
        const phone = sanitizeText((document.getElementById("claim-phone") as HTMLInputElement).value, 30);
        const cif = sanitizeText((document.getElementById("claim-cif") as HTMLInputElement).value, 255);

        if (name.length < 2) {
          throw new Error("El nombre debe tener al menos 2 caracteres");
        }
        const emailCheck = validateEmailInput(email);
        if (!emailCheck.valid) {
          throw new Error(emailCheck.error || "El correo electrónico no es válido");
        }
        const phoneCheck = validatePhoneInput(phone);
        if (!phoneCheck.valid) {
          throw new Error(phoneCheck.error || "El teléfono debe tener al menos 9 caracteres");
        }
        const proofCheck = validateTaxIdOrDocument(cif);
        if (!proofCheck.valid) {
          throw new Error(proofCheck.error || "El CIF/documento debe tener al menos 3 caracteres");
        }

        // INV-04: ID determinista → una única reclamación por usuario y negocio (inmune a dobles clics)
        const claimId = buildClaimId(serviceId, user.uid);

        // INV-06/GR-15: control de tasa anti-bombardeo antes de tocar Firestore
        const gate = checkRateLimit(`claim:${user.uid}`, 3, 15 * 60 * 1000);
        if (!gate.allowed) {
          throw new Error(overlayLabels().claimRateLimited || "Demasiadas solicitudes seguidas.");
        }

        const serviceSlug = window.location.pathname.split("/").filter(Boolean).pop() || serviceId;
        const isProofUrl = /^https:\/\/.+/i.test(cif);

        await createServiceClaim(db, {
          id: claimId,
          serviceId,
          serviceSlug,
          serviceName,
          applicantUid: user.uid,
          applicantName: name,
          applicantEmail: email,
          applicantPhone: phone,
          verificationProof: cif,
          businessTaxId: isProofUrl ? "" : cif.toUpperCase(),
          documentUrl: isProofUrl ? cif : undefined,
          verificationMethod: isProofUrl ? "official_document" : "manual_notarial",
        });

        if (alertSuccess) alertSuccess.style.display = "block";
        claimForm.reset();
        setTimeout(() => {
          if (claimModal) claimModal.style.display = "none";
        }, 2500);
      } catch (err: any) {
        // GR-15: ningún fallo se queda mudo (consola + telemetría D1 con deduplicación)
        reportClientFailure("claim/submit", err, {
          category: "DATABASE",
          resource: window.location.pathname.split("/").filter(Boolean).pop(),
        });

        let errorMessage = "Error al procesar la reclamación";
        const labels = overlayLabels();

        if (err?.code === "duplicate_claim") {
          errorMessage = labels.claimDuplicate || err.message;
        } else if (err?.code === "already_claimed") {
          errorMessage = labels.claimAlreadyClaimed || err.message;
        } else if (err?.code === "rate_limited") {
          errorMessage = labels.claimRateLimited || err.message;
        } else if (err.code === "firestore/permission-denied") {
          errorMessage = "No tienes permisos para realizar esta acción";
        } else if (err.code === "firestore/unavailable") {
          errorMessage = "Servicio no disponible. Por favor, intenta más tarde";
        } else if (err.message) {
          errorMessage = err.message;
        }

        if (alertError) {
          alertError.textContent = errorMessage;
          alertError.style.display = "block";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Handle Deletion Request
  const deleteForm = document.getElementById("delete-form") as HTMLFormElement;
  if (deleteForm) {
    deleteForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const user = auth.currentUser;
      const alertSuccess = document.getElementById("delete-alert-success");
      const alertError = document.getElementById("delete-alert-error");
      const submitBtn = document.getElementById("delete-submit-btn") as HTMLButtonElement;

      if (alertSuccess) alertSuccess.style.display = "none";
      if (alertError) alertError.style.display = "none";

      if (submitBtn) submitBtn.disabled = true;

      try {
        // CORRECCIÓN MEDIA #2: Verificar que db está inicializado
        if (!db) {
          throw new Error("Firebase no está inicializado correctamente");
        }

        const serviceId = (document.getElementById("delete-service-id") as HTMLInputElement).value;
        const serviceName = (document.getElementById("delete-service-name") as HTMLInputElement).value;

        // CORRECCIÓN CRÍTICA #6: Sanitización de inputs
        const email = (document.getElementById("delete-email") as HTMLInputElement).value.trim().toLowerCase();
        const reason = (document.getElementById("delete-reason") as HTMLTextAreaElement).value.trim();

        // Validación básica
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("El correo electrónico no es válido");
        }
        if (!reason || reason.length < 10) {
          throw new Error("El motivo debe tener al menos 10 caracteres");
        }

        const reqId = `del-${serviceId}-${Date.now()}`;
        await createServiceDeletionRequest(db, {
          id: reqId,
          serviceId,
          serviceName,
          applicantUid: user?.uid || "anonymous",
          applicantEmail: email,
          reason,
        });

        if (alertSuccess) alertSuccess.style.display = "block";
        deleteForm.reset();
        setTimeout(() => {
          if (deleteModal) deleteModal.style.display = "none";
        }, 2500);
      } catch (err: any) {
        // CORRECCIÓN MEDIA #3: Manejo específico de errores
        let errorMessage = "Error al solicitar la baja";

        if (err.code === "firestore/permission-denied") {
          errorMessage = "No tienes permisos para realizar esta acción";
        } else if (err.code === "firestore/unavailable") {
          errorMessage = "Servicio no disponible. Por favor, intenta más tarde";
        } else if (err.message) {
          errorMessage = err.message;
        }

        if (alertError) {
          alertError.textContent = errorMessage;
          alertError.style.display = "block";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Handle Report Form
  const reportForm = document.getElementById("report-form") as HTMLFormElement;
  if (reportForm) {
    reportForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const alertSuccess = document.getElementById("report-alert-success");
      const alertError = document.getElementById("report-alert-error");
      const submitBtn = document.getElementById("report-submit-btn") as HTMLButtonElement;

      if (alertSuccess) alertSuccess.style.display = "none";
      if (alertError) alertError.style.display = "none";

      if (submitBtn) submitBtn.disabled = true;

      try {
        // CORRECCIÓN MEDIA #2: Verificar que db está inicializado
        if (!db) {
          throw new Error("Firebase no está inicializado correctamente");
        }

        const serviceId = (document.getElementById("report-service-id") as HTMLInputElement).value;
        const serviceName = (document.getElementById("report-service-name") as HTMLInputElement).value;
        const category = (document.getElementById("report-category") as HTMLSelectElement).value as ReportCategory;

        // CORRECCIÓN CRÍTICA #6: Sanitización de inputs
        const description = (document.getElementById("report-description") as HTMLTextAreaElement).value.trim();
        const reporterEmail = (document.getElementById("report-email") as HTMLInputElement).value.trim().toLowerCase();

        // Validación básica
        if (!description || description.length < 10) {
          throw new Error("Por favor, describe el error o la mejora que propones (mínimo 10 caracteres)");
        }
        if (reporterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)) {
          throw new Error("El correo electrónico no es válido");
        }

        const user = auth.currentUser;
        const reportId = `rep-${serviceId}-${Date.now()}`;
        await createServiceReport(db, {
          id: reportId,
          serviceId,
          serviceName,
          category,
          description,
          reporterUid: user?.uid,
          reporterEmail: reporterEmail || user?.email || undefined,
        });

        if (alertSuccess) alertSuccess.style.display = "block";
        reportForm.reset();
        setTimeout(() => {
          if (reportModal) reportModal.style.display = "none";
        }, 2500);
      } catch (err: any) {
        // CORRECCIÓN MEDIA #3: Manejo específico de errores
        let errorMessage = "Error al enviar el reporte";

        if (err.code === "firestore/permission-denied") {
          errorMessage = "No tienes permisos para realizar esta acción";
        } else if (err.code === "firestore/unavailable") {
          errorMessage = "Servicio no disponible. Por favor, intenta más tarde";
        } else if (err.message) {
          errorMessage = err.message;
        }

        if (alertError) {
          alertError.textContent = errorMessage;
          alertError.style.display = "block";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Dynamic Override Live Hydration (Overlay Pattern · INV-07)
  // Fusión con el MISMO motor que usa la capa estática: lo que el titular guarda se publica.
  async function hydrateDynamicOverrides() {
    try {
      const slug = window.location.pathname.split("/").filter(Boolean).pop();
      if (!slug) return;

      const override = await getServiceOverride(db, slug);
      if (!override) return;

      const snapshot = readOverlaySnapshot();
      const merged: ServiceItem | null = snapshot ? mergeServiceWithOverride(snapshot as ServiceItem, override) : null;
      const localeKey = currentLocaleKey();

      const phone = override.phone || merged?.phone;
      if (phone) {
        document.querySelectorAll(".phone-display-text").forEach((el) => (el.textContent = phone));
      }

      const whatsapp = override.whatsapp || merged?.whatsapp;
      if (whatsapp) {
        document.querySelectorAll(".btn-contact-whatsapp").forEach((btn) => {
          btn.setAttribute("href", `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`);
        });
      }

      const website = override.website || merged?.website;
      if (website) {
        document.querySelectorAll(".btn-contact-web").forEach((btn) => {
          btn.setAttribute("href", website);
        });
      }

      const email = override.email || merged?.email;
      if (email) {
        document.querySelectorAll(".email-display-text").forEach((el) => (el.textContent = email));
      }

      const rawSchedule = override.schedule || merged?.schedule;
      const schedule = typeof rawSchedule === "string" ? rawSchedule : undefined;
      if (schedule) {
        document.querySelectorAll(".schedule-display-text").forEach((el) => (el.textContent = schedule));
      }

      // Descripción del titular (antes se guardaba y nunca se publicaba)
      const description =
        override.fullDescription?.[localeKey] || merged?.fullDescription?.[localeKey] || merged?.fullDescription?.es;
      const descParagraph = document.getElementById("service-desc-paragraph");
      if (description && descParagraph) {
        descParagraph.textContent = description;
        descParagraph.removeAttribute("hidden");
      }

      // Destacados del titular (reconstrucción segura con textContent: cero inyección HTML)
      const highlights = override.highlights?.[localeKey]?.length
        ? override.highlights[localeKey]
        : merged?.highlights?.[localeKey];
      const highlightsList = document.querySelector("#destacados .highlights-list");
      if (highlights?.length && highlightsList) {
        highlightsList.textContent = "";
        highlights.forEach((item) => {
          const li = document.createElement("li");
          li.className = "highlight-item";
          const icon = document.createElement("span");
          icon.className = "check-icon";
          icon.textContent = "✓";
          const text = document.createElement("span");
          text.textContent = item;
          li.append(icon, text);
          highlightsList.appendChild(li);
        });
      }

      // Servicios incluidos declarados por el titular
      const provided = override.servicesProvided?.[localeKey]?.length
        ? override.servicesProvided[localeKey]
        : merged?.servicesProvided?.[localeKey];
      const chips = document.querySelector(".services-chips");
      if (provided?.length && chips) {
        chips.textContent = "";
        provided.forEach((item) => {
          const chip = document.createElement("span");
          chip.className = "service-chip";
          chip.textContent = `🔹 ${item}`;
          chips.appendChild(chip);
        });
      }

      // Aviso de estado operativo declarado por el titular (cierre estacional o definitivo)
      const status = override.status || merged?.status;
      const snapshotLabels = snapshot?.labels ?? {};
      const statusMessage =
        status === "seasonal_closure"
          ? snapshotLabels.statusSeasonalClosure
          : status === "permanently_closed"
            ? snapshotLabels.statusPermanentlyClosed
            : "";
      const noticeAnchor = document.querySelector(".transparency-notice-box");
      if (statusMessage && noticeAnchor && !document.getElementById("override-status-notice")) {
        const statusNotice = document.createElement("div");
        statusNotice.id = "override-status-notice";
        statusNotice.className = "transparency-notice-box unverified-notice-box";
        statusNotice.setAttribute("role", "status");
        statusNotice.textContent = statusMessage;
        noticeAnchor.parentElement?.insertBefore(statusNotice, noticeAnchor);
      }

      // Si el negocio ha sido reclamado formalmente o verificado como titular
      if (override.isClaimed && override.claimedByUid) {
        const unverifiedBox = document.querySelector(".unverified-notice-box");
        if (unverifiedBox) {
          unverifiedBox.className = "transparency-notice-box verified-owner-box";
          unverifiedBox.innerHTML = `
            <div class="notice-header">
              <span class="notice-badge verified-badge" style="background: rgba(16, 185, 129, 0.2); color: var(--color-success, #10b981); border: 1px solid rgba(16, 185, 129, 0.4);">
                👑 Ficha Oficial Gestionada por el Titular
              </span>
            </div>
            <p class="notice-text" style="margin: 0; font-size: 0.88rem; color: var(--color-text-secondary);">
              Este comercio ha sido formalmente auditado, reclamado y verificado por su titular registrado.
            </p>
          `;
        }

        const ownerBox = document.querySelector(".business-owner-box");
        if (ownerBox) {
          ownerBox.innerHTML = `
            <div class="owner-box-header">
              <span class="owner-icon">👑</span>
              <div>
                <strong style="color: var(--color-success, #10b981);">Titular Oficial Verificado</strong>
                <p>Ficha administrada y contrastada directamente por la empresa.</p>
              </div>
            </div>
          `;
        }
      }
    } catch (error) {
      // Degradación elegante… pero nunca silenciosa (GR-15)
      reportClientFailure("hydrate/overrides", error, { category: "DATABASE" });
    }
  }

  // Quick Nav Pills Active State & Smooth Scroll-Spy
  const quickNavPills = document.querySelectorAll(".quick-nav-pill");
  if (quickNavPills.length > 0) {
    quickNavPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        quickNavPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              quickNavPills.forEach((pill) => {
                const href = pill.getAttribute("href");
                if (href === `#${id}`) {
                  quickNavPills.forEach((p) => p.classList.remove("active"));
                  pill.classList.add("active");
                }
              });
            }
          }
        });
      },
      {
        rootMargin: "-120px 0px -60% 0px",
        threshold: 0.1,
      },
    );

    document.querySelectorAll(".section-box[id]").forEach((section) => {
      observer.observe(section);
    });
  }

  // Community Boost Trigger Listener
  const boostBtn = document.getElementById("boost-service-btn");
  if (boostBtn) {
    boostBtn.addEventListener("click", () => {
      const serviceId = boostBtn.getAttribute("data-service-id") || "";
      const serviceName = boostBtn.getAttribute("data-service-name") || "";
      const serviceSlug = boostBtn.getAttribute("data-service-slug") || "";

      window.dispatchEvent(
        new CustomEvent("open-honor-checkout", {
          detail: {
            serviceId,
            serviceName,
            serviceSlug,
            minBid: 1.0,
          },
        }),
      );
    });
  }

  hydrateDynamicOverrides();

  // Auto-reabrir modal tras autenticación fluida si viene con intent
  const urlParams = new URLSearchParams(window.location.search);
  const intent = urlParams.get("intent");
  if (intent === "boost") {
    const serviceId = urlParams.get("serviceId") || boostBtn?.getAttribute("data-service-id") || "";
    const serviceName = urlParams.get("serviceName") || boostBtn?.getAttribute("data-service-name") || "";
    const serviceSlug = urlParams.get("serviceSlug") || boostBtn?.getAttribute("data-service-slug") || "";
    const minBid = Number(urlParams.get("amount") || urlParams.get("minBid") || "1.00");

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("open-honor-checkout", {
          detail: {
            serviceId,
            serviceName,
            serviceSlug,
            minBid,
          },
        }),
      );
    }, 200);
  } else if (intent === "claim" && claimModal) {
    setTimeout(() => {
      claimModal.style.display = "flex";
    }, 200);
  }
}
