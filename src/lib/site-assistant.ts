/**
 * Integration surface for the future website chatbot.
 * All contact-related actions on the site call openSiteAssistant().
 * The real implementation will be injected later.
 */

export interface SiteAssistantContext {
  source?: string;
  projectSlug?: string;
  category?: string;
}

declare global {
  interface Window {
    __siteAssistant?: {
      open: (context?: SiteAssistantContext) => void;
    };
  }
}

export function openSiteAssistant(context?: SiteAssistantContext): void {
  if (typeof window === "undefined") return;
  const impl = window.__siteAssistant;
  if (impl?.open) {
    impl.open(context);
    return;
  }
  // eslint-disable-next-line no-console
  console.info("Site assistant not connected.", context ?? {});
}
