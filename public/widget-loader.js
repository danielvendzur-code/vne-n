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
    // Ikona je kreslená, nie znak z písma. Textový symbol sa v niektorých
    // písmach vykreslil s vlastným pozadím a pod ikonou ostávala škvrna.
    anchor.innerHTML = `
      <span aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" focusable="false">
          <path d="M12 3.2 13.7 9l5.8 1.7-5.8 1.7L12 18.2l-1.7-5.8L4.5 10.7 10.3 9 12 3.2Z"
                fill="currentColor" />
          <path d="M18.6 15.4 19.4 18l2.6.8-2.6.8-.8 2.6-.8-2.6-2.6-.8 2.6-.8.8-2.6Z"
                fill="currentColor" opacity="0.62" />
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
      gap: "10px",
      minHeight: "58px",
      padding: "10px 15px",
      border: "1px solid rgba(255,199,157,.22)",
      borderRadius: "18px",
      color: "#faf5ef",
      background: "#12100e",
      boxShadow: "0 24px 58px -38px rgba(0,0,0,.98)",
      fontFamily: '"Inter Tight", "Segoe UI Variable", system-ui, sans-serif',
      textDecoration: "none",
    });

    const icon = anchor.firstElementChild;
    if (icon instanceof HTMLElement) {
      Object.assign(icon.style, {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffc79d",
        background: "transparent",
        filter: "none",
      });
    }

    const copy = anchor.lastElementChild;
    if (copy instanceof HTMLElement) {
      Object.assign(copy.style, { display: "grid", gap: "2px", lineHeight: "1.1" });
      const strong = copy.querySelector("strong");
      const small = copy.querySelector("small");
      if (strong instanceof HTMLElement) {
        Object.assign(strong.style, { fontSize: "13px", fontWeight: "680" });
      }
      if (small instanceof HTMLElement) {
        Object.assign(small.style, { color: "#c9beb4", fontSize: "11px" });
      }
    }

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
