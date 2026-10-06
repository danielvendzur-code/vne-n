(() => {
  "use strict";

  if (window.__DV_ASSISTANT_LOADER_ACTIVE__) return;
  window.__DV_ASSISTANT_LOADER_ACTIVE__ = true;

  const normalizeSource = (value) =>
    String(value || "")
      .trim()
      .replace(/\/embed\.js(?=([?#]|$))/, `/${"widget" + ".js"}`);

  const internalSource = () =>
    `${document.documentElement.dataset.basePath || ""}/assistant/widget.js`;
  const SOURCE = normalizeSource(
    document.documentElement.dataset.assistantSource || internalSource(),
  );
  const HOST_ID = "dv-assistant-root";
  const FALLBACK_ID = "dv-assistant-fallback";
  const OPEN_EVENT = "site-assistant:open";
  const MOUNT_TIMEOUT = 9000;
  const RETRY_DELAY = 5000;
  const WIDGET_RELEASE = "product-motion-20261006-v28";

  let settled = false;
  let loading = false;
  let pendingOpen = null;
  let retryTimer = null;

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

  const removeFallback = () => {
    document.getElementById(FALLBACK_ID)?.remove();
  };

  const showFallback = () => {
    if (settled || hasMountedWidget() || document.getElementById(FALLBACK_ID)) return;

    const anchor = document.createElement("a");
    anchor.id = FALLBACK_ID;
    anchor.href = internalHref("/kontakt");
    anchor.setAttribute("aria-label", "Otvoriť Môj Chatbot");
    anchor.innerHTML = `
      <svg width="50" height="50" viewBox="0 0 100 100" fill="currentColor" focusable="false" aria-hidden="true">
        <path d="M6 46.5A29 29 0 0 1 64 46.5Z" />
        <path d="M36 53.5H94A29 29 0 0 1 93.01 61C91.7 65.8 92.34 67.76 93.43 72.64L96.1 84.6L84.14 81.93C79.26 80.84 77.34 80.21 72.51 81.51A29 29 0 0 1 36 53.5Z" />
      </svg>
    `;
    Object.assign(anchor.style, {
      position: "fixed",
      right: "max(18px, env(safe-area-inset-right))",
      bottom: "max(18px, env(safe-area-inset-bottom))",
      zIndex: "40",
      width: "72px",
      height: "72px",
      display: "grid",
      placeItems: "center",
      padding: "10px",
      border: "1px solid rgba(28,22,18,.16)",
      borderRadius: "50%",
      color: "#1C1612",
      background: "#FFFCF7",
      boxShadow: "0 18px 40px -26px rgba(28,22,18,.52), inset 0 1px 0 rgba(255,255,255,.9)",
      textDecoration: "none",
      overflow: "hidden",
      cursor: "pointer",
      transition: "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
    });

    anchor.onmouseenter = () => {
      anchor.style.borderColor = "rgba(28,22,18,.34)";
      anchor.style.boxShadow =
        "0 20px 44px -24px rgba(28,22,18,.58), inset 0 1px 0 rgba(255,255,255,.9)";
      anchor.style.transform = "translateY(-2px)";
    };
    anchor.onmouseleave = () => {
      anchor.style.borderColor = "rgba(28,22,18,.16)";
      anchor.style.boxShadow =
        "0 18px 40px -26px rgba(28,22,18,.52), inset 0 1px 0 rgba(255,255,255,.9)";
      anchor.style.transform = "translateY(0)";
    };
    anchor.onclick = (event) => {
      if (!hasMountedWidget()) return;
      event.preventDefault();
      removeFallback();
      settled = true;
      window.openSiteAssistant({ entry: "builder" });
    };

    document.body.appendChild(anchor);
  };

  const completeMount = () => {
    if (!hasMountedWidget()) return false;
    settled = true;
    loading = false;
    if (retryTimer !== null) {
      window.clearTimeout(retryTimer);
      retryTimer = null;
    }
    removeFallback();
    handOffPendingOpen();
    return true;
  };

  const scheduleRetry = () => {
    if (settled || retryTimer !== null) return;
    retryTimer = window.setTimeout(() => {
      retryTimer = null;
      start();
    }, RETRY_DELAY);
  };

  const confirmMount = () => {
    const startedAt = Date.now();
    const check = () => {
      if (completeMount()) return;
      if (Date.now() - startedAt >= MOUNT_TIMEOUT) {
        loading = false;
        showFallback();
        scheduleRetry();
        return;
      }
      window.setTimeout(check, 500);
    };
    check();
  };

  const start = () => {
    if (settled || loading) return;
    if (completeMount()) return;

    loading = true;
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
    script.onload = () => confirmMount();
    script.onerror = () => {
      loading = false;
      script.remove();
      showFallback();
      scheduleRetry();
    };
    document.head.appendChild(script);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
