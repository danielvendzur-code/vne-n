(() => {
  "use strict";

  if (window.__DV_ASSISTANT_LOADER_ACTIVE__) return;
  window.__DV_ASSISTANT_LOADER_ACTIVE__ = true;

  const normalizeSource = (value) =>
    String(value || "")
      .trim()
      .replace(/\/embed\.js(?=([?#]|$))/, `/${"widget" + ".js"}`);

  const SOURCE = normalizeSource(
    document.documentElement.dataset.assistantSource ||
      "https://danielvendzur-code.github.io/moj.chatbot.backend/embed.js",
  );
  const HOST_ID = "dv-assistant-root";
  const FALLBACK_ID = "dv-assistant-fallback";
  const OPEN_EVENT = "site-assistant:open";
  const MOUNT_TIMEOUT = 9000;
  const WIDGET_RELEASE = "premium-motion-20260825-v7";

  let settled = false;
  let pendingOpen = null;

  const internalHref = (pathname) => {
    const basePath = document.documentElement.dataset.basePath || "/vne-n";
    const segments = [basePath, pathname]
      .map((segment) => String(segment).replace(/^\/+|\/+$/g, ""))
      .filter(Boolean);

    return `/${segments.join("/")}`;
  };

  const hasMountedWidget = () => {
    const host = document.getElementById(HOST_ID);
    if (!host || host.childElementCount === 0 || typeof window.openSiteAssistant !== "function") {
      return false;
    }

    return Boolean(window.openSiteAssistant.__siteAssistantEmbed || host.id === HOST_ID);
  };

  const rememberEarlyOpen = (event) => {
    if (hasMountedWidget()) return;
    pendingOpen = event?.detail || { entry: "builder" };
  };

  window.addEventListener(OPEN_EVENT, rememberEarlyOpen);

  const handOffPendingOpen = () => {
    window.removeEventListener(OPEN_EVENT, rememberEarlyOpen);
    if (!pendingOpen || typeof window.openSiteAssistant !== "function") return;
    const options = pendingOpen;
    pendingOpen = null;
    window.openSiteAssistant(options);
  };

  const showFallback = () => {
    if (settled || hasMountedWidget() || document.getElementById(FALLBACK_ID)) return;
    settled = true;
    window.removeEventListener(OPEN_EVENT, rememberEarlyOpen);

    const anchor = document.createElement("a");
    anchor.id = FALLBACK_ID;
    anchor.href = internalHref("/kontakt");
    anchor.setAttribute("aria-label", "Otvoriť krátke zadanie");
    anchor.innerHTML = `
      <span aria-hidden="true">
        <svg width="42" height="42" viewBox="0 0 112 112" fill="none" focusable="false">
          <path d="M92.9 81.1C97.4 80.8 100.6 78.6 100.6 75.6V12.6C100.6 7.9 96.4 5.3 93 7.6L59.9 36.7C58 38.5 55 38.5 53.1 36.7L20 7.6C16.6 5.3 12.4 7.9 12.4 12.6V76.1C12.4 78.9 14.7 81.1 17.5 81.1H31.7L33.5 104.5L57.5 81.1H80.9C82.9 81.1 84.6 79.5 84.6 77.5V32.9"
                stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M28.6 65.1V32.9L53.4 57.5C55.1 59.2 57.9 59.2 59.6 57.5L84.6 32.9"
                stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <span><strong>Môj Chatbot</strong><small>Otvoriť krátke zadanie</small></span>
    `;
    Object.assign(anchor.style, {
      position: "fixed",
      right: "max(16px, env(safe-area-inset-right))",
      bottom: "max(16px, env(safe-area-inset-bottom))",
      zIndex: "2147483000",
      display: "inline-flex",
      alignItems: "center",
      gap: "11px",
      minHeight: "64px",
      padding: "10px 16px 10px 12px",
      border: "1px solid rgba(11,47,32,.14)",
      borderRadius: "20px",
      color: "#0b2f20",
      background: "#ffffff",
      boxShadow: "0 24px 58px -38px rgba(11,47,32,.48)",
      fontFamily: '"Inter Tight", "Segoe UI Variable", system-ui, sans-serif',
      textDecoration: "none",
      transition:
        "background-color 320ms cubic-bezier(.16,1,.3,1), border-color 320ms cubic-bezier(.16,1,.3,1), transform 320ms cubic-bezier(.16,1,.3,1)",
    });

    const icon = anchor.firstElementChild;
    if (icon instanceof HTMLElement) {
      Object.assign(icon.style, {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#b9ed4d",
        background: "transparent",
        filter: "none",
        transition: "color 520ms cubic-bezier(.16,1,.3,1)",
      });
    }

    const copy = anchor.lastElementChild;
    if (copy instanceof HTMLElement) {
      Object.assign(copy.style, { display: "grid", gap: "2px", lineHeight: "1.1" });
      const strong = copy.querySelector("strong");
      const small = copy.querySelector("small");
      if (strong instanceof HTMLElement) {
        Object.assign(strong.style, { color: "#0b2f20", fontSize: "13px", fontWeight: "680" });
      }
      if (small instanceof HTMLElement) {
        Object.assign(small.style, { color: "#536159", fontSize: "11px" });
      }
    }

    anchor.onmouseenter = () => {
      anchor.style.borderColor = "rgba(25,131,79,.34)";
      anchor.style.background = "#f5f9f2";
      anchor.style.transform = "translateY(-2px)";
      if (icon instanceof HTMLElement) icon.style.color = "#19834f";
    };
    anchor.onmouseleave = () => {
      anchor.style.borderColor = "rgba(11,47,32,.14)";
      anchor.style.background = "#ffffff";
      anchor.style.transform = "translateY(0)";
      if (icon instanceof HTMLElement) icon.style.color = "#b9ed4d";
    };

    document.body.appendChild(anchor);
  };

  const confirmMount = (script) => {
    const startedAt = Date.now();
    const check = () => {
      if (hasMountedWidget()) {
        settled = true;
        document.getElementById(FALLBACK_ID)?.remove();
        handOffPendingOpen();
        return;
      }
      if (Date.now() - startedAt >= MOUNT_TIMEOUT) {
        script.remove();
        showFallback();
        return;
      }
      window.setTimeout(check, 180);
    };
    check();
  };

  const start = () => {
    if (settled || hasMountedWidget()) return;
    document.documentElement.dataset.basePath =
      document.documentElement.dataset.basePath || "/vne-n";

    const now = new Date();
    const buildKey = [
      now.getUTCFullYear(),
      String(now.getUTCMonth() + 1).padStart(2, "0"),
      String(now.getUTCDate()).padStart(2, "0"),
      String(now.getUTCHours()).padStart(2, "0"),
      String(Math.floor(now.getUTCMinutes() / 5) * 5).padStart(2, "0"),
    ].join("");

    const script = document.createElement("script");
    const separator = SOURCE.includes("?") ? "&" : "?";
    script.src = `${SOURCE}${separator}v=${WIDGET_RELEASE}-${buildKey}`;
    script.async = true;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.dataset.dvAssistantSource = SOURCE;
    script.onload = () => confirmMount(script);
    script.onerror = () => {
      script.remove();
      showFallback();
    };
    document.head.appendChild(script);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
