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

    // Starší iframe build označoval globálnu funkciu cez
    // __siteAssistantEmbed. Aktuálny priamy build sa spoľahlivo rozpozná
    // podľa skutočného React hosta `dv-assistant-root`.
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
        <svg width="38" height="38" viewBox="0 0 112 112" fill="none" focusable="false">
          <path d="M69 103L69 88H82C93 88 101 80 101 69V23C101 14 91 10 84 17L64 37C59 42 53 42 48 37L28 17C21 10 11 14 11 23V69C11 80 19 88 30 88H54L69 103Z"
                stroke="currentColor" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round" />
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
      minHeight: "62px",
      padding: "10px 16px 10px 12px",
      border: "1px solid rgba(11,47,32,.14)",
      borderRadius: "20px",
      color: "#0b2f20",
      background: "#ffffff",
      boxShadow: "0 24px 58px -38px rgba(11,47,32,.48)",
      fontFamily: '"Inter Tight", "Segoe UI Variable", system-ui, sans-serif',
      textDecoration: "none",
    });

    const icon = anchor.firstElementChild;
    if (icon instanceof HTMLElement) {
      Object.assign(icon.style, {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#b9ed4d",
        background: "transparent",
        filter: "drop-shadow(0 5px 10px rgba(25,131,79,.18))",
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
      if (icon instanceof HTMLElement) icon.style.color = "#19834f";
    };
    anchor.onmouseleave = () => {
      anchor.style.borderColor = "rgba(11,47,32,.14)";
      anchor.style.background = "#ffffff";
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
    script.src = `${SOURCE}?v=${buildKey}`;
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
