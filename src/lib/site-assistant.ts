import type { AssistantEntry, AssistantPreset, OpenSiteAssistantOptions } from "@/types/assistant";

export type { AssistantEntry, AssistantPreset, OpenSiteAssistantOptions };

export const SITE_ASSISTANT_OPEN_EVENT = "site-assistant:open";

export interface SiteAssistantContext {
  entry?: AssistantEntry;
  preset?: AssistantPreset;
  source?: string;
  projectSlug?: string;
  category?: string;
}

let pendingExternalOpen: number | null = null;

function tryOpenExternalAssistant(): boolean {
  const root = document.getElementById("derat-widget-host")?.shadowRoot;
  const frame = root?.getElementById("derat-frame");
  const trigger = root?.getElementById("derat-mobile-bubble");

  if (!frame?.classList.contains("derat-ready") || !(trigger instanceof HTMLButtonElement)) {
    return false;
  }

  trigger.click();
  return true;
}

function normalizeContext(context?: SiteAssistantContext): OpenSiteAssistantOptions {
  if (context?.entry) {
    return { entry: context.entry, preset: context.preset };
  }

  if (context?.source?.includes("project")) {
    return { entry: "inquiry", preset: "inquiry" };
  }

  return { entry: "builder" };
}

export function openSiteAssistant(context?: SiteAssistantContext): void {
  if (typeof window === "undefined") return;

  if (pendingExternalOpen !== null) {
    window.clearInterval(pendingExternalOpen);
    pendingExternalOpen = null;
  }

  if (tryOpenExternalAssistant()) return;

  const deadline = performance.now() + 9000;
  pendingExternalOpen = window.setInterval(() => {
    if (tryOpenExternalAssistant() || performance.now() >= deadline) {
      if (pendingExternalOpen !== null) window.clearInterval(pendingExternalOpen);
      pendingExternalOpen = null;
    }
  }, 100);

  // Keep the legacy event as a harmless fallback for older embedded builds.
  window.dispatchEvent(
    new CustomEvent<OpenSiteAssistantOptions>(SITE_ASSISTANT_OPEN_EVENT, {
      detail: normalizeContext(context),
    }),
  );
}

export function installSiteAssistantGlobal(): () => void {
  window.openSiteAssistant = openSiteAssistant;

  return () => {
    if (window.openSiteAssistant === openSiteAssistant) {
      delete (window as Partial<Window>).openSiteAssistant;
    }
  };
}
