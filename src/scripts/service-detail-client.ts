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

  // Open modals via data-open-modal
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-open-modal");
      if (modalId) {
        const targetModal = document.getElementById(modalId);
        if (targetModal) {
          targetModal.style.display = "flex";
        }
      }
    });
  });

  // Share Service Button Fallback
  const shareBtn = document.getElementById("share-service-btn");
  const shareModal = document.getElementById("social-share-modal");
  if (shareBtn && shareModal) {
    shareBtn.addEventListener("click", () => {
      shareModal.style.display = "flex";
    });
  }

  // Modal open/close helpers
  const claimModal = document.getElementById("claim-modal");
  const deleteModal = document.getElementById("delete-modal");
  const reportModal = document.getElementById("report-modal");
  const openClaimBtn = document.getElementById("open-claim-modal-btn");
  const openDeleteBtn = document.getElementById("open-delete-modal-btn");
  const openReportBtn = document.getElementById("open-report-modal-btn");

  if (openClaimBtn && claimModal) {
    openClaimBtn.addEventListener("click", () => {
      claimModal.style.display = "flex";
      const user = auth.currentUser;
      const emailInput = document.getElementById("claim-email") as HTMLInputElement;
      const nameInput = document.getElementById("claim-name") as HTMLInputElement;
      if (user && emailInput && !emailInput.value) {
        emailInput.value = user.email || "";
      }
      if (user && nameInput && !nameInput.value) {
        nameInput.value = user.displayName || "";
      }
    });
  }

  if (openDeleteBtn && deleteModal) {
    openDeleteBtn.addEventListener("click", () => {
      deleteModal.style.display = "flex";
      const user = auth.currentUser;
      const emailInput = document.getElementById("delete-email") as HTMLInputElement;
      if (user && emailInput && !emailInput.value) {
        emailInput.value = user.email || "";
      }
    });
  }

  if (openReportBtn && reportModal) {
    openReportBtn.addEventListener("click", () => {
      reportModal.style.display = "flex";
      const user = auth.currentUser;
      const emailInput = document.getElementById("report-email") as HTMLInputElement;
      if (user && emailInput && !emailInput.value) {
        emailInput.value = user.email || "";
      }
    });
  }

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
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        const serviceId = (document.getElementById("claim-service-id") as HTMLInputElement).value;
        const serviceName = (document.getElementById("claim-service-name") as HTMLInputElement).value;
        const name = (document.getElementById("claim-name") as HTMLInputElement).value;
        const email = (document.getElementById("claim-email") as HTMLInputElement).value;
        const phone = (document.getElementById("claim-phone") as HTMLInputElement).value;
        const cif = (document.getElementById("claim-cif") as HTMLInputElement).value;

        const claimId = `claim-${serviceId}-${user.uid.slice(0, 8)}`;
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
        if (alertError) {
          alertError.textContent = `Error al procesar la reclamación: ${err.message || err}`;
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
        const serviceId = (document.getElementById("delete-service-id") as HTMLInputElement).value;
        const serviceName = (document.getElementById("delete-service-name") as HTMLInputElement).value;
        const email = (document.getElementById("delete-email") as HTMLInputElement).value;
        const reason = (document.getElementById("delete-reason") as HTMLTextAreaElement).value;

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
        if (alertError) {
          alertError.textContent = `Error al solicitar la baja: ${err.message || err}`;
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

      const serviceId = (document.getElementById("report-service-id") as HTMLInputElement).value;
      const serviceName = (document.getElementById("report-service-name") as HTMLInputElement).value;
      const category = (document.getElementById("report-category") as HTMLSelectElement).value as ReportCategory;
      const description = (document.getElementById("report-description") as HTMLTextAreaElement).value.trim();
      const reporterEmail = (document.getElementById("report-email") as HTMLInputElement).value.trim();

      if (!description) {
        if (alertError) {
          alertError.textContent = "Por favor, describe el error o la mejora que propones.";
          alertError.style.display = "block";
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
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
        if (alertError) {
          alertError.textContent = `Error al enviar el reporte: ${err.message || err}`;
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
