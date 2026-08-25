import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    ...seo({
      title: "Cenník — chatbot, kalkulačka a konfigurátor",
      description:
        "Chatbot na mieru od 497 € jednorazovo a 10 € mesačne. Kalkulačka alebo konfigurátor od 500 € jednorazovo a 10 € mesačne. Presnú cenu dohodneme vopred.",
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
    setup: "od 497 €",
    monthly: "10 € / mesiac",
    copy: "Odpovede podľa vašich podkladov, doplnenie potrebných údajov a odoslanie dopytu na e-mail.",
    preset: "inquiry" as const,
  },
  {
    index: "02",
    name: "Kalkulačka",
    setup: "od 500 €",
    monthly: "10 € / mesiac",
    copy: "Orientačný výpočet ceny, spotreby alebo rozsahu podľa pravidiel vašej ponuky.",
    preset: "calculator" as const,
  },
  {
    index: "03",
    name: "Konfigurátor",
    setup: "od 500 €",
    monthly: "10 € / mesiac",
    copy: "Krokový výber produktu alebo služby s dostupnými variantmi, rozmermi a doplnkami.",
    preset: "product" as const,
  },
] as const;

function PricingPage() {
  return (
    <div className="sp-page pricing-page--rebrand">
      <header className="sp-hero">
        <div className="container-page">
          <p className="section-kicker">CENA</p>
          <h1>
            Vopred viete, <em>za čo platíte.</em>
          </h1>
          <p className="sp-hero-lead">
            Cena závisí od toho, čo má riešenie vedieť. Základnú cenu vidíte hneď a presný rozsah si
            odsúhlasíme pred začiatkom práce.
          </p>
        </div>
      </header>

      <section className="sp-section">
        <div className="container-page pricing-table">
          <div className="pricing-table__head" aria-hidden="true">
            <span>RIEŠENIE</span>
            <span>VYTVORENIE</span>
            <span>PREVÁDZKA</span>
            <span>ČO OBSAHUJE</span>
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
                Pozrieť ukážku <ArrowRight size={14} />
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
              Návrh otázok a krokov, vizuálne prispôsobenie, implementácia do dohodnutého rozsahu a
              nasadenie na web.
            </p>
          </div>
          <div>
            <p className="section-kicker">MESAČNE</p>
            <p>Prevádzka riešenia a bežná technická údržba podľa aktuálne dohodnutých podmienok.</p>
          </div>
          <div>
            <p className="section-kicker">AK TREBA NIEČO NAVYŠE</p>
            <p>
              Väčšie integrácie, nové vetvy alebo rozsiahlejšie rozšírenia naceníme samostatne ešte
              pred tým, ako na nich začneme pracovať.
            </p>
          </div>
        </div>
      </section>

      <section className="pricing-bridge">
        <div className="container-page pricing-bridge__grid">
          <div>
            <p className="section-kicker">PRESNÁ CENA</p>
            <h2 className="section-title">
              Stačí nám povedať, <em>čo má web robiť.</em>
            </h2>
          </div>
          <div>
            <p>
              Krátko popíšte, čo má zákazník na webe zvládnuť. Povieme vám, aké riešenie dáva zmysel
              a koľko bude stáť.
            </p>
            <button
              type="button"
              className="button-primary"
              onClick={() => openSiteAssistant({ source: "pricing-final" })}
            >
              Chcem návrh riešenia <ArrowRight size={15} />
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
