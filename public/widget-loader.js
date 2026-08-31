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
  const RETRY_DELAY = 5000;
  const WIDGET_RELEASE = "round-one-stroke-launcher-20260831-v15";
  const LOGO_CYCLE_MS = 4000;
  const DARK_LOGO = [11, 47, 32];
  const PALE_LOGO = [185, 237, 77];
  const ONE_STROKE =
    "M24 71.2L24.003 32.706L24.036 31.781L24.105 31.189L24.182 30.865L24.232 30.728L24.356 30.512L24.433 30.436L24.519 30.383L24.617 30.355L24.724 30.35L24.841 30.367L25.101 30.46L25.392 30.622L25.708 30.843L26.397 31.412L51.128 54.139L52.684 55.54L53.007 55.788L53.319 55.976L53.748 56.177L54.156 56.322L54.584 56.435L55.085 56.526L55.54 56.573L55.942 56.588L56.46 56.573L56.915 56.526L57.306 56.459L57.739 56.353L58.152 56.216L58.589 56.024L58.903 55.847L59.195 55.638L59.808 55.11L60.872 54.139L84.506 32.412L85.781 31.257L86.292 30.843L86.608 30.622L86.899 30.46L87.033 30.404L87.276 30.35L87.383 30.355L87.481 30.383L87.567 30.436L87.644 30.512L87.768 30.728L87.86 31.019L87.924 31.374L87.964 31.781L87.994 32.464L88 33.2L87.996 80.578L87.977 81.4L87.928 81.748L87.856 81.994L87.758 82.229L87.637 82.45L87.493 82.658L87.289 82.891L87.056 83.099L86.821 83.265L86.567 83.406L86.351 83.5L86.008 83.607L85.699 83.665L85.396 83.685L83.431 83.7L56.39 83.702L55.164 83.75L54.45 83.832L53.76 83.972L53.317 84.107L53.102 84.189L52.89 84.28L52.479 84.491L51.888 84.87L51.321 85.307L50.591 85.955L33.344 102.732L32.645 103.395L32.312 103.688L31.995 103.941L31.561 104.219L31.308 104.319L31.193 104.339L31.088 104.337L30.992 104.312L30.907 104.262L30.831 104.189L30.764 104.094L30.706 103.979L30.612 103.693L30.52 103.148L30.471 102.498L30.445 101.536L30.255 87.664L30.208 86.455L30.125 85.785L30.033 85.375L29.973 85.184L29.822 84.833L29.729 84.675L29.504 84.399L29.222 84.18L29.062 84.09L28.706 83.945L28.309 83.841L28.098 83.803L27.652 83.748L27.183 83.717L26.2 83.7L14.562 83.69L13.567 83.65L13.14 83.597L12.757 83.521L12.325 83.405L11.968 83.282L11.623 83.138L11.238 82.945L10.923 82.759L10.624 82.555L10.341 82.334L10.032 82.055L9.788 81.799L9.562 81.528L9.355 81.243L9.141 80.894L8.98 80.582L8.821 80.203L8.727 79.923L8.624 79.521L8.563 79.144L8.525 78.619L8.5 76.201L8.5 15.161L8.521 12.799L8.57 11.868L8.646 11.258L8.787 10.64L9.021 9.978L9.324 9.358L9.526 9.024L9.747 8.704L9.986 8.4L10.242 8.111L10.728 7.644L11.179 7.282L11.657 6.958L12.073 6.718L12.504 6.504L13.036 6.285L13.49 6.134L14.043 5.991L14.509 5.904L15.071 5.841L15.632 5.822L16.095 5.841L16.644 5.907L17.094 6L17.465 6.117L17.872 6.3L18.216 6.494L18.605 6.747L19.205 7.185L20.802 8.456L52.743 34.696L53.052 34.919L53.411 35.124L53.848 35.316L54.261 35.453L54.749 35.57L55.254 35.647L55.712 35.682L56.173 35.686L56.632 35.659L57.028 35.609L57.47 35.523L57.844 35.422L58.252 35.277L58.589 35.124L58.948 34.919L59.199 34.743L92.652 8.551L93.961 7.541L94.935 6.832L95.467 6.487L95.911 6.245L96.292 6.082L96.719 5.958L97.215 5.868L97.791 5.823L98.36 5.841L98.919 5.919L99.388 6.034L99.843 6.191L100.284 6.39L100.707 6.629L101.175 6.958L101.553 7.282L101.905 7.644L102.178 7.973L102.479 8.4L102.748 8.862L102.946 9.273L103.12 9.707L103.267 10.163L103.407 10.738L103.492 11.258L103.548 11.868L103.588 12.983L103.6 14.927L103.6 77.593L103.581 79.749L103.554 80.241L103.486 80.688L103.361 81.1L103.16 81.551L102.897 81.99L102.614 82.367L102.286 82.732L101.814 83.168L101.334 83.54L100.741 83.929L100.156 84.255L99.598 84.525L98.928 84.804L98.217 85.056L97.485 85.275L96.6 85.5";

  let settled = false;
  let loading = false;
  let pendingOpen = null;
  let retryTimer = null;
  let fallbackFrame = 0;

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

  const logoOffset = (progress) => {
    if (progress < 0.01) return 1;
    if (progress < 0.36) return 1 - (progress - 0.01) / 0.35;
    if (progress < 0.52) return 0;
    if (progress < 0.87) return (progress - 0.52) / 0.35;
    return 1;
  };

  const logoOpacity = (offset) => {
    if (offset <= 0.965) return 1;
    if (offset >= 0.995) return 0;
    return 1 - (offset - 0.965) / 0.03;
  };

  const logoColor = (progress) => {
    let mix = 0;
    if (progress >= 0.01 && progress < 0.36) {
      mix = (progress - 0.01) / 0.35;
    } else if (progress >= 0.36 && progress < 0.52) {
      mix = 1;
    } else if (progress >= 0.52 && progress < 0.87) {
      mix = 1 - (progress - 0.52) / 0.35;
    }

    const channel = (index) =>
      Math.round(DARK_LOGO[index] + (PALE_LOGO[index] - DARK_LOGO[index]) * mix);
    return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
  };

  const stopFallbackAnimation = () => {
    if (!fallbackFrame) return;
    window.cancelAnimationFrame(fallbackFrame);
    fallbackFrame = 0;
  };

  const removeFallback = () => {
    stopFallbackAnimation();
    document.getElementById(FALLBACK_ID)?.remove();
  };

  const showFallback = () => {
    if (settled || hasMountedWidget() || document.getElementById(FALLBACK_ID)) return;

    const anchor = document.createElement("a");
    anchor.id = FALLBACK_ID;
    anchor.href = internalHref("/kontakt");
    anchor.setAttribute("aria-label", "Otvoriť Môj Chatbot");
    anchor.innerHTML = `
      <svg width="50" height="50" viewBox="0 0 112 112" fill="none" focusable="false" aria-hidden="true">
        <path d="${ONE_STROKE}" pathLength="1" stroke="currentColor" stroke-width="7.75"
          stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1" />
      </svg>
    `;
    Object.assign(anchor.style, {
      position: "fixed",
      right: "max(18px, env(safe-area-inset-right))",
      bottom: "max(18px, env(safe-area-inset-bottom))",
      zIndex: "2147483000",
      width: "72px",
      height: "72px",
      display: "grid",
      placeItems: "center",
      padding: "10px",
      border: "0",
      borderRadius: "50%",
      color: "#0b2f20",
      background: "rgba(200,240,106,.08)",
      boxShadow: "none",
      backdropFilter: "blur(8px) saturate(1.03)",
      WebkitBackdropFilter: "blur(8px) saturate(1.03)",
      textDecoration: "none",
      overflow: "hidden",
      cursor: "pointer",
      transition: "background-color 180ms ease, transform 180ms ease",
    });

    const stroke = anchor.querySelector("path");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (stroke instanceof SVGPathElement) {
      if (reducedMotion) {
        stroke.style.strokeDashoffset = "0";
        stroke.style.opacity = "1";
        stroke.style.color = "#19834f";
      } else {
        const startedAt = performance.now();
        const tick = (now) => {
          if (!document.getElementById(FALLBACK_ID)) {
            fallbackFrame = 0;
            return;
          }
          const progress = ((now - startedAt) % LOGO_CYCLE_MS) / LOGO_CYCLE_MS;
          const offset = logoOffset(progress);
          stroke.style.strokeDashoffset = offset.toFixed(4);
          stroke.style.opacity = logoOpacity(offset).toFixed(4);
          stroke.style.color = logoColor(progress);
          fallbackFrame = window.requestAnimationFrame(tick);
        };
        tick(startedAt);
      }
    }

    anchor.onmouseenter = () => {
      anchor.style.background = "rgba(200,240,106,.14)";
      anchor.style.boxShadow = "none";
      anchor.style.transform = "translateY(-2px)";
    };
    anchor.onmouseleave = () => {
      anchor.style.background = "rgba(200,240,106,.08)";
      anchor.style.boxShadow = "none";
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
      if (Date.now() - startedAt >= MOUNT_TIMEOUT) showFallback();
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