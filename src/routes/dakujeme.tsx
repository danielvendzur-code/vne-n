import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ShPage, ShPageHero } from "@/components/site/SubPage";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/dakujeme")({
  head: () => ({
    ...seo({
      title: "Máme to — Môj Chatbot",
      description: "Potvrdenie prijatia zadania pre tím Môj Chatbot.",
      path: "/dakujeme",
      noindex: true,
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Máme to", path: "/dakujeme" }]),
      },
    ],
  }),
  component: ThankYouPage,
});

const nextSteps = [
  "Prejdeme zadanie a váš web.",
  "Navrhneme najjednoduchší funkčný smer.",
  "Dohodneme rozsah, cenu a ďalší krok.",
];

function ThankYouPage() {
  return (
    <ShPage>
      <ShPageHero
        eyebrow="Zadanie prijaté"
        title="Máme"
        accent="to."
        lead="Zadanie je odoslané. Ozveme sa do jedného pracovného dňa s ďalším krokom a podľa rozsahu aj s konkrétnou cenou."
        compact
      >
        <Link to="/projekty" className="sh-btn sh-btn--lime">
          Pozrieť realizácie <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <button
          type="button"
          className="sh-btn sh-btn--ghost"
          onClick={() => openSiteAssistant({ source: "thank-you" })}
        >
          Doplniť detail
        </button>
        <Link to="/" className="sh-link">
          Späť na úvod
        </Link>
      </ShPageHero>

      <section className="sh-section" aria-label="Čo bude nasledovať">
        <div className="sh-wrap shp-grid-3">
          {nextSteps.map((step, index) => (
            <article
              className="shp-card"
              key={step}
              data-reveal
              style={{ "--d": index } as CSSProperties}
            >
              <span className="shp-num">0{index + 1}</span>
              <h2 className="shp-card__title">{step}</h2>
            </article>
          ))}
        </div>
      </section>
    </ShPage>
  );
}
