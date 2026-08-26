import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SITE_ORIGIN } from "@/config/site";

const COFFEE_ORIGIN = "https://kava-chatbot-backend.vercel.app";

const DEMOS = {
  praziarnicka: "Pražiarnička",
  diamonds: "Diamonds Roastery",
  kaffa: "Kaffa Roastery",
  vitazov: "Káva Víťazov",
  concept: "Concept Coffee Roasters",
  jolka: "Pražiareň Jolka",
} as const;

type DemoSlug = keyof typeof DEMOS;

export const Route = createFileRoute("/ukazka/$slug")({
  head: () => ({
    meta: [
      { title: "Ukážka kávového poradcu — Môj Chatbot" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  component: CoffeeDemoPage,
});

function CoffeeDemoPage() {
  const { slug } = Route.useParams();
  const demoSlug = slug as DemoSlug;
  const brand = DEMOS[demoSlug];

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const hideSiteAssistant = () => {
      for (const id of ["dv-assistant-root", "dv-assistant-fallback"]) {
        const node = document.getElementById(id);
        if (node instanceof HTMLElement) node.style.setProperty("display", "none", "important");
      }
    };

    hideSiteAssistant();
    const observer = new MutationObserver(hideSiteAssistant);
    observer.observe(document.body, { childList: true, subtree: false });

    return () => {
      observer.disconnect();
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      for (const id of ["dv-assistant-root", "dv-assistant-fallback"]) {
        const node = document.getElementById(id);
        if (node instanceof HTMLElement) node.style.removeProperty("display");
      }
    };
  }, []);

  if (!brand) {
    return (
      <main
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2147483647,
          display: "grid",
          placeItems: "center",
          padding: 24,
          background: "#f2f0e8",
          color: "#111310",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 12px" }}>Ukážka sa nenašla.</h1>
          <a href="/" style={{ color: "inherit" }}>
            Späť na mojchatbot.sk
          </a>
        </div>
      </main>
    );
  }

  const publicOrigin = SITE_ORIGIN.replace(/\/$/, "");
  const publicDemoUrl = `${publicOrigin}/ukazka/${demoSlug}`;
  const source = `${COFFEE_ORIGIN}/ukazka/${demoSlug}?public=${encodeURIComponent(publicDemoUrl)}`;

  return (
    <main
      aria-label={`Ukážka kávového poradcu pre ${brand}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <iframe
        src={source}
        title={`Kávový poradca — ${brand}`}
        allow="clipboard-write"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
          background: "#fff",
        }}
      />
    </main>
  );
}
