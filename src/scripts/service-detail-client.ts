import { auth, db } from "../lib/firebase";
import {
  createServiceClaim,
  createServiceDeletionRequest,
  createServiceReport,
  type ReportCategory,
} from "../lib/serviceActions";
import { getServiceOverride } from "../lib/serviceOverrides";
import { initAutomaticClickTracking } from "../lib/conversionTracking";

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

        // CORRECCIÓN CRÍTICA #6: Sanitización de inputs
        const name = (document.getElementById("claim-name") as HTMLInputElement).value.trim();
        const email = (document.getElementById("claim-email") as HTMLInputElement).value.trim().toLowerCase();
        const phone = (document.getElementById("claim-phone") as HTMLInputElement).value.trim();
        const cif = (document.getElementById("claim-cif") as HTMLInputElement).value.trim();

        // Validación básica de sanitización
        if (!name || name.length < 2) {
          throw new Error("El nombre debe tener al menos 2 caracteres");
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("El correo electrónico no es válido");
        }
        if (!phone || phone.length < 9) {
          throw new Error("El teléfono debe tener al menos 9 caracteres");
        }
        if (!cif || cif.length < 3) {
          throw new Error("El CIF/documento debe tener al menos 3 caracteres");
        }

        // CORRECCIÓN BAJA #4: Usar ID único con timestamp
        const claimId = `claim-${serviceId}-${user.uid}-${Date.now()}`;

        await createServiceClaim(db, {
          id: claimId,
          serviceId,
          serviceName,
          applicantUid: user.uid,
          applicantName: name,
          applicantEmail: email,
          applicantPhone: phone,
          verificationProof: cif,
        });

        if (alertSuccess) alertSuccess.style.display = "block";
        claimForm.reset();
        setTimeout(() => {
          if (claimModal) claimModal.style.display = "none";
        }, 2500);
      } catch (err: any) {
        // CORRECCIÓN MEDIA #3: Manejo específico de errores
        let errorMessage = "Error al procesar la reclamación";

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

  // Dynamic Override Live Hydration (Overlay Pattern)
  async function hydrateDynamicOverrides() {
    try {
      const slug = window.location.pathname.split("/").filter(Boolean).pop();
      if (!slug) return;

      const override = await getServiceOverride(db, slug);
      if (!override) return;

      if (override.phone) {
        document.querySelectorAll(".phone-display-text").forEach((el) => (el.textContent = override.phone!));
      }
      if (override.whatsapp) {
        document.querySelectorAll(".btn-contact-whatsapp").forEach((btn) => {
          btn.setAttribute("href", `https://wa.me/${override.whatsapp!.replace(/[^0-9]/g, "")}`);
        });
      }
      if (override.website) {
        document.querySelectorAll(".btn-contact-web").forEach((btn) => {
          btn.setAttribute("href", override.website!);
        });
      }
      if (override.schedule) {
        document.querySelectorAll(".schedule-display-text").forEach((el) => (el.textContent = override.schedule!));
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
    } catch {
      // Graceful degradation
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
