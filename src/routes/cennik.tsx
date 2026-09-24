import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Eyebrow } from "@/components/site/StudioHome";
import { ShClosing, ShPage, ShPageHero, ShSectionHead } from "@/components/site/SubPage";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    ...seo({
      title: "Cenník — chatbot, kalkulačka, konfigurátor a produktový poradca",
      description:
        "Chatbot alebo produktový poradca na mieru od 347 € jednorazovo. Kalkulačka alebo krokový konfigurátor od 447 €. 3D konfigurátory naceňujeme podľa rozsahu modelu, logiky a integrácií.",
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
    name: "Krokový konfigurátor",
    setup: "od 447 €",
    monthly: "10 € / mesiac",
    copy: "Samostatný krokový výber produktu alebo služby s variantmi, rozmermi, farbami a doplnkami — bez 3D modelu.",
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
  {
    title: "Všetko spolu",
    copy: "Chatbot, kalkulačka, konfigurátor aj poradca v jednom nástroji. Cenu povieme podľa rozsahu vopred.",
  },
] as const;

function PricingPage() {
  return (
    <ShPage className="shp-pricing">
      <ShPageHero
        eyebrow="Cenník / Môj Chatbot"
        title="Jasná cena."
        accent="Jasný rozsah."
        lead="Každý nástroj môže fungovať samostatne. Ak dáva zmysel kombinácia, spojíme chatbot, kalkulačku, konfigurátor alebo produktového poradcu do jedného riešenia."
      >
        <a href="#baliky" className="sh-btn sh-btn--lime">
          Pozrieť ceny <ArrowRight size={18} aria-hidden="true" />
        </a>
        <Link to="/kontakt" className="sh-btn sh-btn--ghost">
          Chcem presnú cenu <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </ShPageHero>

      <section className="shp-price-band" aria-label="Základný prehľad cien">
        <div className="sh-wrap">
          <div className="shp-price-facts">
            <div className="shp-price-fact" data-reveal style={{ "--d": 0 } as CSSProperties}>
              <span>Chatbot / poradca</span>
              <strong>od 347 €</strong>
              <small>vytvorenie</small>
            </div>
            <div className="shp-price-fact" data-reveal style={{ "--d": 1 } as CSSProperties}>
              <span>Kalkulačka / krokový výber</span>
              <strong>od 447 €</strong>
              <small>vytvorenie</small>
            </div>
            <div className="shp-price-fact" data-reveal style={{ "--d": 2 } as CSSProperties}>
              <span>Technická prevádzka</span>
              <strong>10 €</strong>
              <small>mesačne pri štandardných riešeniach</small>
            </div>
          </div>
        </div>
      </section>

      <section className="sh-section" id="baliky">
        <div className="sh-wrap">
          <ShSectionHead
            eyebrow="Celý cenník"
            title="Najprv typ riešenia. Potom presný rozsah."
            lead="Chatbot, kalkulačka a jednoduchší krokový konfigurátor majú orientačnú cenu od. Pri 3D konfigurátore cenu neurčujeme jedným číslom — závisí od modelu, možností, pravidiel a napojení."
          />
          <div className="shp-plans">
            {pricing.map((item, index) => (
              <article
                className="shp-plan"
                key={item.name}
                data-reveal
                style={{ "--d": index } as CSSProperties}
              >
                <span className="shp-num">{item.index}</span>
                <h3>{item.name}</h3>
                <p>{item.copy}</p>
                <dl>
                  <div>
                    <dt>Vytvorenie</dt>
                    <dd>{item.setup}</dd>
                  </div>
                  <div>
                    <dt>Prevádzka</dt>
                    <dd>{item.monthly}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="sh-btn sh-btn--dark sh-btn--sm"
                  onClick={() =>
                    openSiteAssistant({
                      source: `pricing-${item.name.toLowerCase()}`,
                      preset: item.preset,
                    })
                  }
                >
                  Vyskúšať tento typ <ArrowRight size={16} aria-hidden="true" />
                </button>
              </article>
            ))}

            <article
              className="shp-plan shp-plan--3d"
              data-reveal
              style={{ "--d": 3 } as CSSProperties}
            >
              <span className="shp-num">04</span>
              <h3>3D konfigurátor</h3>
              <p>
                Interaktívny 3D model s rozmermi, farbami, variantmi, doplnkami a produktovou
                logikou. Rozsah sa môže výrazne líšiť, preto ho nenaceňujeme ako krokový
                konfigurátor.
              </p>
              <dl>
                <div>
                  <dt>Vytvorenie</dt>
                  <dd>podľa rozsahu</dd>
                </div>
                <div>
                  <dt>Prevádzka</dt>
                  <dd>podľa riešenia</dd>
                </div>
              </dl>
              <Link to="/3d-konfigurator" className="sh-btn sh-btn--lime sh-btn--sm">
                Pozrieť 3D konfigurátor <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="sh-section shp-section--pure">
        <div className="sh-wrap">
          <div className="sh-combo" data-reveal>
            <div className="sh-combo__intro">
              <Eyebrow tone="dark">SAMOSTATNE AJ SPOLU</Eyebrow>
              <h3>Nemusíte si vybrať iba jedno riešenie.</h3>
              <p>
                Každá funkcia vie fungovať sama. Pri zložitejšom predaji ich spojíme tak, aby
                zákazník necítil prechod medzi rozhovorom, výpočtom a výberom produktu.
              </p>
            </div>
            <ul className="sh-combo__list">
              {combinations.map((item, index) => (
                <li
                  key={item.title}
                  data-all={index === combinations.length - 1 ? "true" : undefined}
                >
                  <button
                    type="button"
                    onClick={() => openSiteAssistant({ source: `pricing-combo-${index + 1}` })}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.copy}</span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sh-section">
        <div className="sh-wrap shp-grid-3">
          <article className="shp-card" data-reveal style={{ "--d": 0 } as CSSProperties}>
            <p className="shp-contact__label">V CENE VYTVORENIA</p>
            <p>
              Návrh otázok a krokov, vizuálne prispôsobenie, implementácia do dohodnutého rozsahu a
              nasadenie na web.
            </p>
          </article>
          <article className="shp-card" data-reveal style={{ "--d": 1 } as CSSProperties}>
            <p className="shp-contact__label">MESAČNE</p>
            <p>Prevádzka riešenia a bežná technická údržba podľa aktuálne dohodnutých podmienok.</p>
          </article>
          <article className="shp-card" data-reveal style={{ "--d": 2 } as CSSProperties}>
            <p className="shp-contact__label">AK TREBA NIEČO NAVYŠE</p>
            <p>
              3D modely, väčšie integrácie, nové vetvy alebo rozsiahlejšie rozšírenia naceníme
              samostatne ešte pred tým, ako na nich začneme pracovať.
            </p>
          </article>
        </div>
      </section>

      <ShClosing
        title="Stačí nám povedať, čo má web robiť."
        copy="Krátko popíšte, čo má zákazník na webe zvládnuť. Povieme vám, či stačí jeden nástroj alebo dáva zmysel kombinácia a koľko bude stáť."
      >
        <button
          type="button"
          className="sh-btn sh-btn--lime"
          onClick={() => openSiteAssistant({ source: "pricing-final" })}
        >
          Chcem návrh riešenia <ArrowRight size={18} aria-hidden="true" />
        </button>
        <Link to="/kontakt" className="sh-link">
          Kontakt
        </Link>
      </ShClosing>
    </ShPage>
  );
}
