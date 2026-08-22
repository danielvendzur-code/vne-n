import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    ...seo({
      title: "Cenník — chatbot, kalkulačka a konfigurátor",
      description:
        "Chatbot na mieru 350 € jednorazovo a 10 € mesačne. Kalkulačka alebo konfigurátor od 400 € jednorazovo a 10 € mesačne. Presnú cenu dohodneme vopred.",
      path: "/cennik",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Cena", path: "/cennik" }]),
      },
    ],
  }),
  component: PricingPage,
});

const pricing = [
  {
    index: "01",
    name: "Chatbot",
    setup: "350 €",
    monthly: "10 € / mesiac",
    copy: "Odpovede podľa vašich podkladov, zber kontextu a dopyt na e-mail.",
    preset: "inquiry" as const,
  },
  {
    index: "02",
    name: "Kalkulačka",
    setup: "od 400 €",
    monthly: "10 € / mesiac",
    copy: "Výpočet ceny, spotreby alebo rozsahu podľa vašich pravidiel a vstupov zákazníka.",
    preset: "calculator" as const,
  },
  {
    index: "03",
    name: "Konfigurátor",
    setup: "od 400 €",
    monthly: "10 € / mesiac",
    copy: "Krokový výber produktu alebo služby s variantmi, rozmermi a doplnkami.",
    preset: "product" as const,
  },
] as const;

function PricingPage() {
  return (
    <div className="sp-page pricing-page--rebrand">
      <header className="sp-hero">
        <div className="container-page">
          <p className="section-kicker">WHAT IT COSTS</p>
          <h1>
            Cena bez balíčkov, <em>ktoré nepotrebujete.</em>
          </h1>
          <p className="sp-hero-lead">
            Každé riešenie má cenu za vytvorenie a mesačný poplatok za prevádzku. Ak sa mení rozsah,
            pravidlá alebo integrácie, presnú cenu potvrdíme pred začiatkom.
          </p>
        </div>
      </header>

      <section className="sp-section">
        <div className="container-page pricing-table">
          <div className="pricing-table__head" aria-hidden="true">
            <span>RIEŠENIE</span>
            <span>SETUP</span>
            <span>PREVÁDZKA</span>
            <span>ROZSAH</span>
            <span />
          </div>
          {pricing.map((item) => (
            <article className="pricing-row" key={item.name}>
              <div className="pricing-row__name">
                <span>{item.index}</span>
                <h2>{item.name}</h2>
              </div>
              <strong>{item.setup}</strong>
              <strong>{item.monthly}</strong>
              <p>{item.copy}</p>
              <button
                type="button"
                className="text-link"
                onClick={() =>
                  openSiteAssistant({
                    source: `pricing-${item.name.toLowerCase()}`,
                    preset: item.preset,
                  })
                }
              >
                Vybrať <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="sp-section">
        <div className="container-page pricing-notes">
          <div>
            <p className="section-kicker">V CENE VYTVORENIA</p>
            <p>
              Návrh otázok a toku, vizuálne prispôsobenie, implementácia do dohodnutého rozsahu a
              nasadenie na web.
            </p>
          </div>
          <div>
            <p className="section-kicker">MESAČNE</p>
            <p>Prevádzka riešenia a bežná technická údržba podľa aktuálne dohodnutých podmienok.</p>
          </div>
          <div>
            <p className="section-kicker">VOLITEĽNÁ PRÁCA</p>
            <p>
              Komplexnejšie integrácie, nové rozhodovacie vetvy alebo väčšie rozšírenia oceníme
              samostatne ešte pred realizáciou.
            </p>
          </div>
        </div>
      </section>

      <section className="pricing-bridge">
        <div className="container-page pricing-bridge__grid">
          <div>
            <p className="section-kicker">PRESNÁ CENA</p>
            <h2 className="section-title">
              Najprv si ujasnime <em>rozsah.</em>
            </h2>
          </div>
          <div>
            <p>
              Krátko popíšte, čo má zákazník na webe spraviť. Z toho vieme povedať, či stačí základ
              alebo treba vlastnú logiku navyše.
            </p>
            <button
              type="button"
              className="button-primary"
              onClick={() => openSiteAssistant({ source: "pricing-final" })}
            >
              Vyskladať rozsah <ArrowRight size={15} />
            </button>
            <Link to="/kontakt" className="text-link pricing-inline-link">
              Kontakt <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
