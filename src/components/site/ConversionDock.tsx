import { useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { openSiteAssistant } from "@/lib/site-assistant";

export function ConversionDock() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hidden =
    pathname.startsWith("/kontakt") ||
    pathname.startsWith("/dakujeme") ||
    pathname.startsWith("/farby");

  if (hidden) return null;

  return (
    <button
      type="button"
      className="site-assistant-dock"
      onClick={() => openSiteAssistant({ source: "sticky-site-cta" })}
      aria-label="Otvoriť chatbota a krátke zadanie"
    >
      <span className="site-assistant-dock__icon" aria-hidden="true">
        <MessageCircle size={19} />
      </span>
      <span className="site-assistant-dock__copy">
        <strong>Spýtať sa chatbota</strong>
        <small>Odpovieme do 1 pracovného dňa</small>
      </span>
    </button>
  );
}
