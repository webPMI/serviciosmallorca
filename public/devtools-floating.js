/**
 * 🛠️ DevTools Floating Button v3 — WebApp Starter
 *
 * Context-aware floating button with:
 *   - Hover submenus for Quick Nav & DevTools
 *   - Live inline log console (last 15 entries, auto-refresh)
 *   - Badge counter for errors/warnings
 *
 * Activation: auto on localhost (`__devtools_enabled=1` cookie).
 * Keyboard: Ctrl+Shift+D to disable, Ctrl+Shift+H/L/E/B/T/R/K/F/1-4.
 */

(function () {
  "use strict";

  // ==========================================================================
  // KEYS & STATE
  // ==========================================================================
  var D = "__devtools_enabled";
  var ROOT_ID = "__devtools_floating_root";
  var POS_KEY = "__devtools_float_pos";
  var THEME_KEY = "webapp-theme";
  var LOG_REFRESH_INTERVAL = null;
  var LOG_MAX_SHOWN = 15;

  function isOn() {
    var m = document.cookie.match(new RegExp("(?:^|;\\s*)" + D + "=([^;]+)"));
    return !!(m && m[1] === "1");
  }
  if (!isOn()) return;
  if (window.__devtoolsFloatingInstance) return;
  window.__devtoolsFloatingInstance = true;

  // ==========================================================================
  // CSS INJECTION
  // ==========================================================================
  (function injectCSS() {
    if (document.getElementById("__devtools_floating_css")) return;
    var s = document.createElement("style");
    s.id = "__devtools_floating_css";
    s.textContent = [
      "@keyframes __dtFadeIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}",
      "@keyframes __dtSlideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}",
      "#" + ROOT_ID + '{position:fixed;z-index:999998;font-family:"Segoe UI",system-ui,sans-serif}',
      ".__dt_btn{width:44px;height:44px;border-radius:50%;background:#16213e;border:2px solid #00d4aa;color:#00d4aa;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(0,212,170,.35);transition:transform .15s,box-shadow .15s;user-select:none;line-height:1;position:relative}",
      ".__dt_btn:hover{transform:scale(1.12);box-shadow:0 6px 32px rgba(0,212,170,.5)}",
      ".__dt_badge{position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:#ff4757;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1;box-shadow:0 2px 8px rgba(255,71,87,.4)}",
      ".__dt_badge.is-warn{background:#ffa502}",
      ".__dt_badge.is-hidden{display:none}",
      ".__dt_overlay{position:fixed;inset:0;z-index:999996;background:rgba(0,0,0,.2)}",
      ".__dt_menu{position:absolute;width:310px;max-width:calc(100vw-16px);background:#16213e;border:1px solid #2a3a5e;border-radius:12px;box-shadow:0 16px 48px rgba(0,0,0,.65);animation:__dtFadeIn .15s ease;overflow:hidden}",
      ".__dt_menu_hdr{padding:12px 16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#8899aa;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #2a3a5e}",
      ".__dt_menu_page{font-size:9px;color:#00d4aa;font-weight:700}",
      ".__dt_menu_item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 16px;background:transparent;border:none;color:#e0e0e0;font-family:inherit;font-size:13px;cursor:pointer;text-align:left;transition:background .1s;position:relative}",
      ".__dt_menu_item:hover{background:#1f3460}",
      ".__dt_menu_item .__dt_arrow{font-size:10px;color:#8899aa;margin-left:auto}",
      ".__dt_menu_div{height:1px;background:#2a3a5e;margin:0}",
      ".__dt_submenu{position:absolute;left:100%;top:0;width:220px;background:#16213e;border:1px solid #2a3a5e;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.6);z-index:999999;display:none;animation:__dtFadeIn .12s ease}",
      ".__dt_menu_item:hover > .__dt_submenu{display:block}",
      ".__dt_submenu .__dt_menu_item{padding:8px 14px;font-size:12px}",
      /* Live console */
      '.__dt_console{max-height:200px;overflow-y:auto;padding:4px 0;font-size:11px;font-family:"Fira Code","Cascadia Code",Consolas,monospace}',
      ".__dt_console_line{display:flex;padding:2px 16px;gap:8px;line-height:1.5;border-bottom:1px solid rgba(42,58,94,.4)}",
      ".__dt_console_line:hover{background:#1f3460}",
      ".__dt_console_level{flex-shrink:0;font-weight:700;font-size:9px;text-transform:uppercase;width:48px}",
      ".__dt_console_msg{flex:1;color:#c0c8d8;word-break:break-all;white-space:pre-wrap}",
      ".__dt_console_empty{text-align:center;color:#667;padding:12px;font-size:11px}",
      ".__dt_console::-webkit-scrollbar{width:4px}",
      ".__dt_console::-webkit-scrollbar-track{background:transparent}",
      ".__dt_console::-webkit-scrollbar-thumb{background:#2a3a5e;border-radius:2px}",
      ".__dt_menu::-webkit-scrollbar{width:4px}",
      ".__dt_menu::-webkit-scrollbar-track{background:transparent}",
      ".__dt_menu::-webkit-scrollbar-thumb{background:#2a3a5e;border-radius:2px}",
    ].join("");
    document.head.appendChild(s);
  })();

  // ==========================================================================
  // PAGE DETECTION
  // ==========================================================================
  function detectPage() {
    var p = window.location.pathname.toLowerCase();
    if (p.includes("/login")) return "login";
    if (p.includes("/register")) return "register";
    if (p.includes("/forgot-password")) return "forgotPassword";
    if (p.includes("/dashboard")) return "dashboard";
    return "home";
  }

  var PAGE_NAMES = {
    home: "🏠 Home",
    login: "🔑 Login",
    register: "📝 Register",
    forgotPassword: "🔒 Forgot Password",
    dashboard: "📊 Dashboard",
  };

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  function getTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem(THEME_KEY, t);
  }

  function fillField(sel, val) {
    var el = document.querySelector(sel);
    if (!el) return false;
    var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(el, val);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function submitForm(sel) {
    var f = document.querySelector(sel);
    if (!f) return false;
    var btn = f.querySelector('button[type="submit"]');
    if (btn) btn.click();
    else f.requestSubmit();
    return true;
  }

  // ==========================================================================
  // TOAST
  // ==========================================================================
  function toast(msg, type) {
    type = type || "info";
    var c = document.getElementById("__dt_toasts");
    if (!c) {
      c = document.createElement("div");
      c.id = "__dt_toasts";
      c.style.cssText =
        "position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:999999;pointer-events:none;";
      document.body.appendChild(c);
    }
    var colors = { success: "#2ed573", error: "#ff4757", info: "#00d4aa", warn: "#ffa502" };
    var el = document.createElement("div");
    el.style.cssText =
      'padding:10px 18px;border-radius:8px;font-size:12px;font-weight:600;font-family:"Segoe UI",system-ui,sans-serif;background:' +
      (colors[type] || colors.info) +
      ";color:" +
      (type === "info" ? "#1a1a2e" : "#fff") +
      ";box-shadow:0 4px 20px rgba(0,0,0,.35);pointer-events:auto;max-width:340px;animation:__dtSlideIn .2s ease;";
    el.textContent = msg;
    c.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 2800);
  }

  // ==========================================================================
  // BADGE COUNTER
  // ==========================================================================
  function updateBadge() {
    var badge = document.getElementById("__dt_badge");
    if (!badge) return;
    var logger = window.__devtoolsLogger;
    var errCount = logger ? logger.getByLevel("error").length : 0;
    var wrnCount = logger ? logger.getByLevel("warn").length : 0;
    if (errCount > 0) {
      badge.textContent = errCount;
      badge.className = "__dt_badge";
    } else if (wrnCount > 0) {
      badge.textContent = wrnCount;
      badge.className = "__dt_badge is-warn";
    } else {
      badge.className = "__dt_badge is-hidden";
    }
  }

  // ==========================================================================
  // LIVE CONSOLE RENDERER
  // ==========================================================================
  var LEVEL_COLORS = { error: "#ff4757", warn: "#ffa502", info: "#00d4aa", log: "#c0c8d8", debug: "#8899aa" };
  var LEVEL_LABELS = { error: "ERROR", warn: "WARN", info: "INFO", log: "LOG", debug: "DEBUG" };

  function renderConsole(container) {
    if (!container) return;
    var logger = window.__devtoolsLogger;
    if (!logger) {
      container.innerHTML = '<div class="__dt_console_empty">📋 Logger not loaded</div>';
      return;
    }

    var entries = logger.getEntries();
    if (!entries || entries.length === 0) {
      container.innerHTML = '<div class="__dt_console_empty">📋 No logs yet — interact with the page</div>';
      return;
    }

    // Show last N entries (newest at the bottom)
    var shown = entries.slice(-LOG_MAX_SHOWN);
    var html = "";
    for (var i = 0; i < shown.length; i++) {
      var e = shown[i];
      var level = e.level || "log";
      var msg = String(e.message || e.args || "").substring(0, 120);
      html +=
        '<div class="__dt_console_line">' +
        '<span class="__dt_console_level" style="color:' +
        (LEVEL_COLORS[level] || "#c0c8d8") +
        '">' +
        (LEVEL_LABELS[level] || "LOG") +
        "</span>" +
        '<span class="__dt_console_msg">' +
        escapeHtml(msg) +
        "</span>" +
        "</div>";
    }
    container.innerHTML = html;
    // Auto-scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
  }

  // ==========================================================================
  // MENU BUILDERS
  // ==========================================================================
  function makeItem(text, fn, opts) {
    opts = opts || {};
    var el = document.createElement("button");
    el.className = "__dt_menu_item";
    el.innerHTML = "<span>" + text + "</span>";
    if (opts.submenu) {
      el.innerHTML += '<span class="__dt_arrow">▶</span>';
      el.appendChild(opts.submenu);
    }
    el.addEventListener("click", function (e) {
      if (!opts.submenu || !opts.submenu.contains(e.target)) {
        closeMenu();
        fn();
      }
    });
    return el;
  }

  function makeSubmenu(items) {
    var sub = document.createElement("div");
    sub.className = "__dt_submenu";
    items.forEach(function (item) {
      var btn = document.createElement("button");
      btn.className = "__dt_menu_item";
      btn.innerHTML = "<span>" + item.text + "</span>";
      btn.addEventListener("click", function () {
        closeMenu();
        item.fn();
      });
      sub.appendChild(btn);
    });
    return sub;
  }

  // ==========================================================================
  // BUILD FLOATING BUTTON + MENU
  // ==========================================================================
  function build() {
    if (document.getElementById(ROOT_ID)) return;

    var root = document.createElement("div");
    root.id = ROOT_ID;
    document.body.appendChild(root);

    // ---- Floating button ----
    var btn = document.createElement("div");
    btn.className = "__dt_btn";
    btn.innerHTML = '🛠️<span id="__dt_badge" class="__dt_badge is-hidden"></span>';
    btn.title = "Click: menu | Drag: move | Hover submenus: Quick Nav & DevTools | Ctrl+Shift+D: disable";
    root.appendChild(btn);

    // Restore position
    var pos = (function () {
      try {
        return JSON.parse(localStorage.getItem(POS_KEY));
      } catch (e) {
        return null;
      }
    })();
    if (pos && typeof pos.x === "number") {
      root.style.right = "auto";
      root.style.bottom = "auto";
      root.style.left = Math.max(0, Math.min(pos.x, window.innerWidth - 60)) + "px";
      root.style.top = Math.max(0, Math.min(pos.y, window.innerHeight - 60)) + "px";
    } else {
      root.style.right = "24px";
      root.style.bottom = "24px";
    }

    updateBadge();

    // ---- DRAG ----
    var dragging = false,
      sx = 0,
      sy = 0,
      sl = 0,
      st = 0,
      moved = false;

    function savePos() {
      var l = parseInt(root.style.left) || 0,
        t = parseInt(root.style.top) || 0;
      localStorage.setItem(POS_KEY, JSON.stringify({ x: l, y: t }));
    }

    btn.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      sx = e.clientX;
      sy = e.clientY;
      var rect = root.getBoundingClientRect();
      sl = rect.left;
      st = rect.top;
      root.style.right = "auto";
      root.style.bottom = "auto";
      root.style.left = sl + "px";
      root.style.top = st + "px";
      e.stopPropagation();
    });

    window.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - sx,
        dy = e.clientY - sy;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
      root.style.left = Math.max(0, Math.min(sl + dx, window.innerWidth - 52)) + "px";
      root.style.top = Math.max(0, Math.min(st + dy, window.innerHeight - 52)) + "px";
    });

    btn.addEventListener("mouseup", function (e) {
      if (!dragging) return;
      dragging = false;
      savePos();
      if (!moved) {
        e.stopPropagation();
        showMenu();
      }
    });

    window.addEventListener("mouseup", function () {
      if (dragging) {
        dragging = false;
        savePos();
      }
    });

    // ---- MENU ----
    var menuEl = null,
      overlay = null,
      consoleEl = null,
      isOpen = false;

    function closeMenu() {
      if (LOG_REFRESH_INTERVAL) {
        clearInterval(LOG_REFRESH_INTERVAL);
        LOG_REFRESH_INTERVAL = null;
      }
      if (overlay) {
        overlay.remove();
        overlay = null;
      }
      if (menuEl) {
        menuEl.remove();
        menuEl = null;
      }
      consoleEl = null;
      isOpen = false;
      updateBadge();
    }

    function showMenu() {
      if (isOpen) {
        closeMenu();
        return;
      }

      overlay = document.createElement("div");
      overlay.className = "__dt_overlay";
      overlay.addEventListener("click", closeMenu);
      document.body.appendChild(overlay);

      menuEl = document.createElement("div");
      menuEl.className = "__dt_menu";
      root.appendChild(menuEl);

      // ---- Header ----
      var hdr = document.createElement("div");
      hdr.className = "__dt_menu_hdr";
      hdr.innerHTML =
        '<span>🛠️ DevTools</span><span class="__dt_menu_page">' + (PAGE_NAMES[detectPage()] || "") + "</span>";
      menuEl.appendChild(hdr);

      // ---- Section 1: PAGE ACTIONS ----
      var page = detectPage();
      var pageItems = [];
      switch (page) {
        case "login":
          pageItems = [
            {
              text: "🔑 Fill Login Form",
              fn: function () {
                fillField("#email", "test@webapp.com");
                fillField("#password", "Test1234!");
                toast("✅ Login filled", "success");
              },
            },
            {
              text: "⚡ Fill & Submit",
              fn: function () {
                fillField("#email", "admin@webapp.com");
                fillField("#password", "Admin1234!");
                submitForm("#login-form");
                toast("⚡ Submitted", "success");
              },
            },
            {
              text: "🧹 Reset Form",
              fn: function () {
                var f = document.querySelector("#login-form");
                if (f) f.reset();
                toast("🧹 Cleared", "info");
              },
            },
          ];
          break;
        case "register":
          pageItems = [
            {
              text: "📝 Fill Register",
              fn: function () {
                fillField("#name", "Test User");
                fillField("#email", "new@webapp.com");
                fillField("#password", "StrongP@ss1");
                fillField("#confirmPassword", "StrongP@ss1");
                toast("✅ Register filled", "success");
              },
            },
            {
              text: "🧹 Reset Form",
              fn: function () {
                var f = document.querySelector("#register-form");
                if (f) f.reset();
                toast("🧹 Cleared", "info");
              },
            },
          ];
          break;
        case "forgotPassword":
          pageItems = [
            {
              text: "📧 Fill Email",
              fn: function () {
                fillField("#email", "test@webapp.com");
                toast("✅ Email filled", "success");
              },
            },
            {
              text: "🧹 Reset Form",
              fn: function () {
                var f = document.querySelector("#forgot-password-form");
                if (f) f.reset();
                toast("🧹 Cleared", "info");
              },
            },
          ];
          break;
        case "dashboard":
          pageItems = [
            {
              text: "👤 Auth State",
              fn: function () {
                var a = window["authStore"];
                if (a && a.getState) {
                  var st = a.getState();
                  toast("User: " + (st.user ? st.user.email : "null") + " | Role: " + st.role, "info");
                } else toast("authStore not found", "error");
              },
            },
            {
              text: "🔝 Scroll to Top",
              fn: function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
              },
            },
          ];
          break;
        case "home":
          pageItems = [
            {
              text: "🔽 Scroll to Features",
              fn: function () {
                var el = document.querySelector("#features");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              },
            },
            {
              text: "🔝 Scroll to Top",
              fn: function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
              },
            },
          ];
          break;
      }

      // Page actions section
      var paHdr = document.createElement("div");
      paHdr.className = "__dt_menu_hdr";
      paHdr.textContent = "🎯 " + (PAGE_NAMES[page] || "Page") + " Actions";
      paHdr.style.borderBottom = "none";
      menuEl.appendChild(paHdr);
      pageItems.forEach(function (pi) {
        menuEl.appendChild(makeItem(pi.text, pi.fn));
      });

      // ---- Separator ----
      var sep1 = document.createElement("div");
      sep1.className = "__dt_menu_div";
      menuEl.appendChild(sep1);

      // ---- Section 2: QUICK NAV (hover submenu) ----
      var qnItems = [];
      if (page !== "home")
        qnItems.push({
          text: "🏠 Home",
          fn: function () {
            location.href = "./";
          },
        });
      if (page !== "login")
        qnItems.push({
          text: "🔑 Login",
          fn: function () {
            location.href = "./login";
          },
        });
      if (page !== "register")
        qnItems.push({
          text: "📝 Register",
          fn: function () {
            location.href = "./register";
          },
        });
      if (page !== "dashboard")
        qnItems.push({
          text: "📊 Dashboard",
          fn: function () {
            location.href = "./dashboard";
          },
        });
      qnItems.push({
        text: "🔒 Forgot Password",
        fn: function () {
          location.href = "./forgot-password";
        },
      });
      menuEl.appendChild(makeItem("🧭 Quick Nav", function () {}, { submenu: makeSubmenu(qnItems) }));

      // ---- Section 3: DEVTOOLS (hover submenu) ----
      var dtItems = [
        {
          text: "🎨 Toggle Dark/Light",
          fn: function () {
            var t = getTheme();
            setTheme(t === "dark" ? "light" : "dark");
            toast("🎨 " + (t === "dark" ? "Light" : "Dark"), "success");
          },
        },
        {
          text: "💾 Dump localStorage",
          fn: function () {
            var o = {};
            for (var i = 0; i < localStorage.length; i++) {
              var k = localStorage.key(i);
              if (k) o[k] = localStorage.getItem(k);
            }
            console.log("localStorage:\n" + JSON.stringify(o, null, 2));
            toast("📋 " + localStorage.length + " keys → console", "info");
          },
        },
        {
          text: "🗑️ Clear localStorage",
          fn: function () {
            var n = localStorage.length;
            localStorage.clear();
            toast("🗑️ Cleared (" + n + " keys)", "info");
          },
        },
        {
          text: "🔄 Reload Page",
          fn: function () {
            window.location.reload();
          },
        },
        {
          text: "🔴 Disable DevTools",
          fn: function () {
            document.cookie = D + "=;path=/;expires=Thu,01 Jan 1970 00:00:00 GMT;SameSite=Lax";
            window.location.reload();
          },
        },
      ];
      menuEl.appendChild(makeItem("🛠️ DevTools", function () {}, { submenu: makeSubmenu(dtItems) }));

      // ---- Separator ----
      var sep2 = document.createElement("div");
      sep2.className = "__dt_menu_div";
      menuEl.appendChild(sep2);

      // ---- Section 4: LIVE CONSOLE ----
      var logHdr = document.createElement("div");
      logHdr.className = "__dt_menu_hdr";
      logHdr.style.borderBottom = "none";
      var logger = window.__devtoolsLogger;
      var logCount = logger ? logger.getCount() : 0;
      var errCount = logger ? logger.getByLevel("error").length : 0;
      logHdr.innerHTML =
        "<span>📋 Live Console (" +
        logCount +
        " entries" +
        (errCount ? ", " + errCount + " err" : "") +
        ")</span>" +
        '<span style="cursor:pointer;font-size:11px;color:#00d4aa" id="__dt_clr_logs">Clear</span>';
      menuEl.appendChild(logHdr);

      // Click handler for "Clear"
      var clrBtn = logHdr.querySelector("#__dt_clr_logs");
      if (clrBtn) {
        clrBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var l = window.__devtoolsLogger;
          if (l) {
            l.clear();
            updateBadge();
          }
          if (consoleEl) renderConsole(consoleEl);
        });
      }

      // Console container
      var consoleDiv = document.createElement("div");
      consoleDiv.className = "__dt_console";
      menuEl.appendChild(consoleDiv);
      consoleEl = consoleDiv;

      // Initial render
      renderConsole(consoleEl);

      // Auto-refresh live console every 800ms
      LOG_REFRESH_INTERVAL = setInterval(function () {
        if (consoleEl && isOpen) {
          var prevCount = logger ? logger.getCount() : 0;
          renderConsole(consoleEl);
          var newCount = logger ? logger.getCount() : 0;
          // Update header count if changed
          if (prevCount !== newCount && logHdr) {
            var eCount = logger ? logger.getByLevel("error").length : 0;
            logHdr.innerHTML =
              "<span>📋 Live Console (" +
              newCount +
              " entries" +
              (eCount ? ", " + eCount + " err" : "") +
              ")</span>" +
              '<span style="cursor:pointer;font-size:11px;color:#00d4aa" id="__dt_clr_logs">Clear</span>';
            var newClr = logHdr.querySelector("#__dt_clr_logs");
            if (newClr) {
              newClr.addEventListener("click", function (ev) {
                ev.stopPropagation();
                var l = window.__devtoolsLogger;
                if (l) {
                  l.clear();
                  updateBadge();
                }
                if (consoleEl) renderConsole(consoleEl);
              });
            }
          }
        }
      }, 800);

      // ---- Position ----
      var br = btn.getBoundingClientRect();
      var mw = 310;
      var l = Math.max(8, Math.min(br.right - mw, window.innerWidth - mw - 8));
      var t = br.bottom + 10;
      if (t + 520 > window.innerHeight) t = br.top - 520 - 10;
      if (t < 8) t = 8;
      menuEl.style.position = "fixed";
      menuEl.style.left = l + "px";
      menuEl.style.top = t + "px";
      isOpen = true;
    }
  }

  // ==========================================================================
  // INIT + SPA PERSISTENCE
  // ==========================================================================
  build();
  setInterval(updateBadge, 3000);

  document.addEventListener("astro:page-load", function () {
    window.__devtoolsFloatingInstance = false;
    setTimeout(function () {
      if (!document.getElementById(ROOT_ID)) {
        window.__devtoolsFloatingInstance = true;
        build();
      }
    }, 100);
  });

  // ==========================================================================
  // GLOBAL KEYBOARD SHORTCUTS
  // ==========================================================================
  document.addEventListener("keydown", function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (document.querySelector(".__dt_overlay")) return;
    var ctrlShift = e.ctrlKey && e.shiftKey;
    if (!ctrlShift) return;
    var handled = true;
    switch (e.key) {
      case "D":
        e.preventDefault();
        document.cookie = D + "=;path=/;expires=Thu,01 Jan 1970 00:00:00 GMT;SameSite=Lax";
        window.location.reload();
        break;
      case "H":
        e.preventDefault();
        location.href = "./";
        break;
      case "L":
        e.preventDefault();
        location.href = "./login";
        break;
      case "E":
        e.preventDefault();
        location.href = "./register";
        break;
      case "B":
        e.preventDefault();
        location.href = "./dashboard";
        break;
      case "T":
        e.preventDefault();
        var cur = getTheme();
        setTheme(cur === "dark" ? "light" : "dark");
        toast("🎨 " + (cur === "dark" ? "Light" : "Dark"), "success");
        break;
      case "1":
        e.preventDefault();
        setTheme("light");
        toast("🎨 Green Light", "success");
        break;
      case "2":
        e.preventDefault();
        setTheme("dark");
        toast("🎨 Green Dark", "success");
        break;
      case "3":
        e.preventDefault();
        setTheme("golden");
        toast("🎨 Gold Light", "success");
        break;
      case "4":
        e.preventDefault();
        setTheme("golden-dark");
        toast("🎨 Gold Dark", "success");
        break;
      case "F":
        e.preventDefault();
        var p = detectPage();
        if (p === "login") {
          fillField("#email", "test@webapp.com");
          fillField("#password", "Test1234!");
          toast("✅ Login filled", "success");
        } else if (p === "register") {
          fillField("#name", "Test User");
          fillField("#email", "new@webapp.com");
          fillField("#password", "StrongP@ss1");
          fillField("#confirmPassword", "StrongP@ss1");
          toast("✅ Register filled", "success");
        } else if (p === "forgotPassword") {
          fillField("#email", "test@webapp.com");
          toast("✅ Email filled", "success");
        } else handled = false;
        break;
      case "R":
        e.preventDefault();
        window.location.reload();
        break;
      case "K":
        e.preventDefault();
        toast("🛠️ Use floating button menu for DevTools", "info");
        break;
      default:
        handled = false;
    }
    if (handled) console.log("%c⌨️ Ctrl+Shift+" + e.key + "%c executed", "color:#00d4aa", "");
  });

  console.log(
    "%c🛠️ DevTools active %c| %c🛠️ for menu %c| %cCtrl+Shift+D to disable",
    "color:#00d4aa;font-weight:bold",
    "",
    "color:#ffa502",
    "",
    "color:#8899aa",
  );
})();
