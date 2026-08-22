import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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

function ThankYouPage() {
  return (
    <div className="thank-you-page">
      <div className="container-page thank-you-page__inner">
        <p className="section-kicker">ZADANIE PRIJATÉ</p>
        <h1>
          Máme <em>to.</em>
        </h1>
        <p className="thank-you-page__copy">
          Zadanie je odoslané. Ozveme sa do jedného pracovného dňa s ďalším krokom a podľa rozsahu
          aj s konkrétnou cenou.
        </p>

        <div className="thank-you-page__next" aria-label="Čo bude nasledovať">
          <div>
            <span>01</span>
            <p>Prejdeme zadanie a váš web.</p>
          </div>
          <div>
            <span>02</span>
            <p>Navrhneme najjednoduchší funkčný smer.</p>
          </div>
          <div>
            <span>03</span>
            <p>Dohodneme rozsah, cenu a ďalší krok.</p>
          </div>
        </div>

        <div className="thank-you-page__actions">
          <Link to="/projekty" className="button-primary">
            Pozrieť realizácie <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            className="text-link"
            onClick={() => openSiteAssistant({ source: "thank-you" })}
          >
            Doplniť detail <ArrowRight size={15} />
          </button>
          <Link to="/" className="text-link">
            Späť na úvod
          </Link>
        </div>
      </div>
    </div>
  );
}
