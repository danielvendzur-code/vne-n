import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { CtaBand, PageIntro } from "@/components/site/motion-primitives";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/dakujeme")({
  head: () => ({
    ...seo({
      title: "Ďakujeme za dopyt",
      description: "Potvrdenie prijatia dopytu pre tím Môj Chatbot.",
      path: "/dakujeme",
      noindex: true,
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Ďakujeme", path: "/dakujeme" }]),
      },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <div className="sp-page">
      <PageIntro
        eyebrow="Dopyt odoslaný"
        title={
          <>
            Ďakujeme. <em>Zadanie máme.</em>
          </>
        }
        lead="Dopyt je odoslaný tímu Môj Chatbot. Odpovieme do 1 pracovného dňa s odporúčaným riešením, rozsahom a ďalším krokom."
      >
        <div className="sp-hero-chips">
          <span className="chip">
            <CheckCircle2 aria-hidden="true" /> Dopyt prijatý
          </span>
          <span className="chip">Odpoveď do 1 pracovného dňa</span>
        </div>
      </PageIntro>

      <section className="sp-section">
        <CtaBand
          kicker="Kým sa ozveme"
          title="Môžete si pozrieť reálne realizácie alebo doplniť zadanie cez chatbota."
          lead="Ak vám napadne ďalší detail, nemusíte vypĺňať formulár znova."
        >
          <Link to="/projekty" className="sp-button sp-button--primary">
            Pozrieť realizácie <ArrowRight aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="sp-button sp-button--ghost"
            onClick={() => openSiteAssistant({ source: "thank-you" })}
          >
            <MessageCircle aria-hidden="true" /> Doplniť zadanie
          </button>
          <Link to="/" className="sp-button sp-button--ghost">
            Späť na úvod
          </Link>
        </CtaBand>
      </section>
    </div>
  );
}
