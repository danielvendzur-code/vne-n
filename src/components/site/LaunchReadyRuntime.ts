import { openSiteAssistant } from "@/lib/site-assistant";
import type { AssistantPreset } from "@/types/assistant";

const SMALL_FLASHLIGHT_TARGETS = ".lp-chip[data-choice-flashlight]";
const MOBILE_MOTION_SELECTOR = [
  ".lp-heading",
  ".lp-comparison",
  ".lp-project",
  ".lp-live-tools",
  ".lp-caps-row",
  ".lp-faq-item",
  // Karty časovej osi sem nepatria: majú vlastné odhaľovanie viazané na to,
  // kam dorástla čiara. Doplnková animácia s `both` ho prebíjala a karta sa
  // objavila skôr, než k nej os dorazila.
  ".lp-final-card",
  ".derat-story__mobile-slide",
  ".sp-hero",
  ".sp-service",
  ".sp-project-card",
  ".sp-detail-block",
  ".sp-cta",
  ".rz-card",
  ".contact-card",
  ".contact-expect",
].join(", ");

function normalizeChoiceFlashlight(): void {
  document.querySelectorAll<HTMLElement>(SMALL_FLASHLIGHT_TARGETS).forEach((item) => {
    item.removeAttribute("data-choice-flashlight");
  });
}

function installMobileMotion() {
  const mobile = window.matchMedia("(max-width: 820px)");
  const registered = new WeakSet<Element>();
  let intersection: IntersectionObserver | null = null;

  const ensureObserver = () => {
    if (intersection || !mobile.matches) return;
    intersection = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.dataset.mobileMotion = "seen";
          intersection?.unobserve(element);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -7% 0px" },
    );
  };

  const prepare = (root: ParentNode = document) => {
    if (!mobile.matches) return;
    ensureObserver();
    if (!intersection) return;

    const candidates: HTMLElement[] = [];
    if (root instanceof HTMLElement && root.matches(MOBILE_MOTION_SELECTOR)) {
      candidates.push(root);
    }
    candidates.push(...Array.from(root.querySelectorAll<HTMLElement>(MOBILE_MOTION_SELECTOR)));

    candidates.forEach((element, index) => {
      if (registered.has(element)) return;
      registered.add(element);
      element.dataset.mobileMotion = "pending";
      element.style.setProperty("--mobile-motion-delay", `${(index % 4) * 55}ms`);
      intersection?.observe(element);
    });
  };

  const resetForDesktop = () => {
    document.querySelectorAll<HTMLElement>("[data-mobile-motion]").forEach((element) => {
      element.removeAttribute("data-mobile-motion");
      element.style.removeProperty("--mobile-motion-delay");
    });
    intersection?.disconnect();
    intersection = null;
  };

  const onMediaChange = () => {
    if (mobile.matches) prepare();
    else resetForDesktop();
  };

  mobile.addEventListener("change", onMediaChange);
  prepare();

  return {
    prepare,
    disconnect() {
      mobile.removeEventListener("change", onMediaChange);
      intersection?.disconnect();
    },
  };
}

function installLaunchReadyRuntime(): void {
  if (document.documentElement.dataset.launchReadyRuntime === "true") return;
  document.documentElement.dataset.launchReadyRuntime = "true";

  const mobileMotion = installMobileMotion();
  const normalizeSoon = () => {
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        normalizeChoiceFlashlight();
        mobileMotion.prepare();
      }),
    );
  };
  normalizeSoon();
  window.setTimeout(() => {
    normalizeChoiceFlashlight();
    mobileMotion.prepare();
  }, 180);

  const observer = new MutationObserver((records) => {
    if (
      records.some(
        (record) =>
          record.type === "childList" ||
          (record.type === "attributes" && record.attributeName === "data-choice-flashlight"),
      )
    ) {
      normalizeSoon();
    }
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-choice-flashlight"],
  });

  /* The old swipe handler captures the pointer on the tab rail. Releasing it
     immediately after React's pointer-down handler keeps swiping available on
     the rail while ordinary button taps reach the Chatbot/Konfigurátor onClick. */
  document.addEventListener(
    "pointerdown",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest<HTMLElement>(".cw-tabs > button");
      if (!button) return;
      const tabs = button.closest<HTMLElement>(".cw-tabs");
      if (!tabs) return;
      const pointerId = event.pointerId;
      queueMicrotask(() => {
        try {
          if (tabs.hasPointerCapture(pointerId)) tabs.releasePointerCapture(pointerId);
        } catch {
          // Pointer capture is optional; a normal click still works without it.
        }
      });
    },
    true,
  );
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installLaunchReadyRuntime, { once: true });
  } else {
    installLaunchReadyRuntime();
  }
}
