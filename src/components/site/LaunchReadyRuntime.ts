import { openSiteAssistant } from "@/lib/site-assistant";
import type { AssistantPreset } from "@/types/assistant";

const HERO_PICK = ".lp-hero-pick";
const SMALL_FLASHLIGHT_TARGETS =
  ".lp-hero-pick[data-choice-flashlight], .lp-chip[data-choice-flashlight]";

function presetFromHeroChoice(button: HTMLElement): AssistantPreset {
  const label = (button.textContent ?? "").toLocaleLowerCase("sk");
  if (label.includes("konfigurátor")) return "product";
  if (label.includes("kalkula")) return "calculator";
  if (label.includes("sprievod")) return "advisor";
  return "inquiry";
}

function normalizeChoiceFlashlight(): void {
  document.querySelectorAll<HTMLElement>(SMALL_FLASHLIGHT_TARGETS).forEach((item) => {
    item.removeAttribute("data-choice-flashlight");
  });
  const card = document.querySelector<HTMLElement>(".lp-assistant-card");
  if (card && card.dataset.choiceFlashlight !== "true") {
    card.setAttribute("data-choice-flashlight", "true");
  }
}

function installLaunchReadyRuntime(): void {
  if (document.documentElement.dataset.launchReadyRuntime === "true") return;
  document.documentElement.dataset.launchReadyRuntime = "true";

  const normalizeSoon = () => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(normalizeChoiceFlashlight));
  };
  normalizeSoon();
  window.setTimeout(normalizeChoiceFlashlight, 180);

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

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLElement>(HERO_PICK);
    if (!button) return;
    const preset = presetFromHeroChoice(button);
    window.setTimeout(() => openSiteAssistant({ source: "hero-choice", preset }), 0);
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
