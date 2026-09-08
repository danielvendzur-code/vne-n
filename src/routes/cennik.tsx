import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    ...seo({
      title: "Cenník — chatbot, kalkulačka, konfigurátor a produktový poradca",
      description:
        "Chatbot alebo produktový poradca na mieru od 347 € jednorazovo a 10 € mesačne. Kalkulačka alebo konfigurátor od 447 € jednorazovo a 10 € mesačne. Presnú cenu dohodneme vopred.",
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
    name: "Chatbot / produktový poradca",
    setup: "od 347 €",
    monthly: "10 € / mesiac",
    copy: "Odpovedá na otázky, pomáha s výberom a môže zákazníka posunúť priamo na vhodný produkt alebo ďalší krok.",
    preset: "advisor" as const,
  },
  {
    index: "02",
    name: "Kalkulačka",
    setup: "od 447 €",
    monthly: "10 € / mesiac",
    copy: "Samostatný výpočet ceny, spotreby alebo rozsahu podľa vašich pravidiel. Chatbot nie je podmienkou.",
    preset: "calculator" as const,
  },
  {
    index: "03",
    name: "Konfigurátor",
    setup: "od 447 €",
    monthly: "10 € / mesiac",
    copy: "Samostatný krokový výber produktu alebo služby s variantmi, rozmermi, farbami a doplnkami.",
    preset: "product" as const,
  },
] as const;

const combinations = [
  {
    title: "Chatbot + kalkulačka",
    copy: "Zákazník sa môže najprv opýtať a potom si cenu vypočítať bez opustenia jedného rozhrania.",
  },
  {
    title: "Chatbot + konfigurátor",
    copy: "Chatbot vysvetlí možnosti a konfigurátor následne prevedie zákazníka presným výberom.",
  },
  {
    title: "Poradca + konfigurátor",
    copy: "Poradca odporučí vhodný smer a zákazník si potom vyskladá konkrétny variant produktu.",
  },
] as const;

function PricingPage() {
  return (
    <div className="sp-page pricing-page--rebrand">
      <header className="sp-hero pricing-hero" data-nav-tone="light">
        <div className="container-page pricing-hero__layout">
          <div className="pricing-hero__copy">
            <span className="pricing-hero__eyebrow">CENNÍK / MÔJ CHATBOT</span>
            <h1>
              Jasná cena. <em>Jasný rozsah.</em>
            </h1>
            <p className="sp-hero-lead">
              Každý nástroj môže fungovať samostatne. Ak dáva zmysel kombinácia, spojíme chatbot,
              kalkulačku, konfigurátor alebo produktového poradcu do jedného riešenia.
            </p>
            <div className="pricing-hero__actions">
              <a href="#baliky" className="site-cta site-cta--primary">
                Pozrieť ceny <ArrowRight size={16} />
              </a>
              <Link to="/kontakt" className="site-cta site-cta--secondary">
                Chcem presnú cenu <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="pricing-hero__facts" aria-label="Základný prehľad cien">
            <div className="pricing-hero__fact">
              <span>CHATBOT / PORADCA</span>
              <strong>od 347 €</strong>
              <small>vytvorenie</small>
            </div>
            <div className="pricing-hero__fact">
              <span>KALKULAČKA / KONFIGURÁTOR</span>
              <strong>od 447 €</strong>
              <small>vytvorenie</small>
            </div>
            <div className="pricing-hero__fact">
              <span>TECHNICKÁ PREVÁDZKA</span>
              <strong>10 €</strong>
              <small>mesačne</small>
            </div>
            <p className="pricing-tax-note">
              Ceny „od“ sú informatívne. Venaco s.r.o. je platiteľ DPH; v konkrétnej ponuke vždy
              uvedieme základ dane, DPH aj celkovú cenu.{" "}
              <Link to="/pravne-informacie">Právne informácie</Link>
            </p>
          </div>
        </div>
      </header>

      <section className="sp-section pricing-catalog" id="baliky" data-nav-tone="light">
        <div className="container-page pricing-catalog__intro">
          <span className="section-kicker">CELÝ CENNÍK</span>
          <h2>Vyberte nástroj podľa toho, čo má návštevník zvládnuť.</h2>
          <p>
            Samostatný chatbot, kalkulačka aj konfigurátor majú vlastnú cenu a vlastný účel.
            Kombinovať ich budeme iba vtedy, keď to zjednoduší cestu zákazníka.
          </p>
        </div>

        <div className="container-page pricing-table">
          <div className="pricing-table__head" aria-hidden="true">
            <span>RIEŠENIE</span>
            <span>VYTVORENIE</span>
            <span>PREVÁDZKA</span>
            <span>ČO OBSAHUJE</span>
            <span />
          </div>

          <div className="pricing-card-grid">
            {pricing.map((item) => (
              <article className="pricing-row" key={item.name}>
                <div className="pricing-row__top">
                  <span>{item.index}</span>
                  <h2>{item.name}</h2>
                </div>
                <p>{item.copy}</p>
                <div className="pricing-row__prices">
                  <div>
                    <span>Vytvorenie</span>
                    <strong>{item.setup}</strong>
                  </div>
                  <div>
                    <span>Prevádzka</span>
                    <strong>{item.monthly}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="site-cta site-cta--secondary pricing-row__action"
                  onClick={() =>
                    openSiteAssistant({
                      source: `pricing-${item.name.toLowerCase()}`,
                      preset: item.preset,
                    })
                  }
                >
                  Vyskúšať tento typ <ArrowRight size={15} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-combine" data-nav-tone="light">
        <div className="container-page pricing-combine__head">
          <span className="section-kicker">SAMOSTATNE AJ SPOLU</span>
          <h2>Nemusíte si vybrať medzi chatbotom a konfigurátorom.</h2>
          <p>
            Každá funkcia vie fungovať sama. Pri zložitejšom predaji ich vieme spojiť tak, aby
            zákazník necítil prechod medzi rozhovorom, výpočtom a výberom produktu.
          </p>
        </div>
        <div className="container-page pricing-combine__grid">
          {combinations.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sp-section pricing-notes-section" data-nav-tone="light">
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

      <section className="pricing-bridge" data-nav-tone="light">
        <div className="container-page pricing-bridge__grid">
          <div>
            <p className="section-kicker">PRESNÁ CENA</p>
            <h2 className="section-title">
              Stačí nám povedať, <em>čo má web robiť.</em>
            </h2>
          </div>
          <div>
            <p>
              Krátko popíšte, čo má zákazník na webe zvládnuť. Povieme vám, či stačí jeden nástroj
              alebo dáva zmysel kombinácia a koľko bude stáť.
            </p>
            <button
              type="button"
              className="site-cta site-cta--primary"
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
