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
