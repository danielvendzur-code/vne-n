(() => {
  "use strict";

  if (window.__DV_ASSISTANT_LOADER_ACTIVE__) return;
  window.__DV_ASSISTANT_LOADER_ACTIVE__ = true;

  const SOURCES = [
    "https://danielvendzur-code.github.io/moj.chatbot.backend/widget.js",
    "https://moj-chatbot-backend.vercel.app/widget.js",
  ];
  const ROOT_ID = "dv-assistant-root";
  const FALLBACK_ID = "dv-assistant-fallback";
  const MOUNT_TIMEOUT = 9000;

  let sourceIndex = 0;
  let settled = false;

  const hasMountedWidget = () => {
    const root = document.getElementById(ROOT_ID);
    return Boolean(root && root.childElementCount > 0);
  };

  const removeFallback = () => {
    document.getElementById(FALLBACK_ID)?.remove();
  };

  const showFallback = () => {
    if (settled || hasMountedWidget() || document.getElementById(FALLBACK_ID)) return;
    settled = true;

    const anchor = document.createElement("a");
    anchor.id = FALLBACK_ID;
    anchor.href = `${document.documentElement.dataset.basePath || "/vne-n"}/kontakt`;
    anchor.setAttribute("aria-label", "Otvoriť krátky dopyt");
    anchor.innerHTML = `
      <span aria-hidden="true">✦</span>
      <span><strong>AI Assistant</strong><small>Otvoriť krátky dopyt</small></span>
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
      padding: "10px 14px",
      border: "1px solid rgba(185,214,255,.4)",
      borderRadius: "20px",
      color: "#f7f9fc",
      background:
        "linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.018)),rgba(8,13,23,.9)",
      boxShadow:
        "0 24px 58px rgba(0,0,0,.48),0 18px 44px -28px rgba(52,120,246,.82),inset 0 1px rgba(255,255,255,.13)",
      backdropFilter: "blur(22px) saturate(150%)",
      fontFamily: "inherit",
      textDecoration: "none",
    });

    const icon = anchor.firstElementChild;
    if (icon instanceof HTMLElement) {
      Object.assign(icon.style, {
        display: "grid",
        width: "36px",
        height: "36px",
        placeItems: "center",
        border: "1px solid rgba(166,211,255,.42)",
        borderRadius: "13px",
        color: "#dcecff",
        background: "linear-gradient(145deg,rgba(52,120,246,.46),rgba(20,54,120,.55))",
        boxShadow: "inset 0 1px rgba(255,255,255,.18)",
        fontSize: "16px",
        fontWeight: "900",
      });
    }

    const copy = anchor.lastElementChild;
    if (copy instanceof HTMLElement) {
      Object.assign(copy.style, { display: "grid", gap: "2px", lineHeight: "1.1" });
      const strong = copy.querySelector("strong");
      const small = copy.querySelector("small");
      if (strong instanceof HTMLElement) {
        Object.assign(strong.style, { fontSize: "13px", fontWeight: "800" });
      }
      if (small instanceof HTMLElement) {
        Object.assign(small.style, { color: "#aebbd0", fontSize: "11px" });
      }
    }

    document.body.appendChild(anchor);
  };

  const confirmMount = (script) => {
    const startedAt = Date.now();
    const check = () => {
      if (hasMountedWidget()) {
        settled = true;
        removeFallback();
        return;
      }
      if (Date.now() - startedAt >= MOUNT_TIMEOUT) {
        script.remove();
        loadNext();
        return;
      }
      window.setTimeout(check, 250);
    };
    check();
  };

  const loadNext = () => {
    if (settled || hasMountedWidget()) return;
    const source = SOURCES[sourceIndex++];
    if (!source) {
      showFallback();
      return;
    }

    const script = document.createElement("script");
    script.src = `${source}?v=20260723-apple-liquid-controls-v1`;
    script.async = true;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.dataset.dvAssistantSource = source;
    script.onload = () => confirmMount(script);
    script.onerror = () => {
      script.remove();
      loadNext();
    };
    document.head.appendChild(script);
  };

  const start = () => {
    document.documentElement.dataset.basePath =
      document.documentElement.dataset.basePath || "/vne-n";
    loadNext();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
