import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ShPage } from "@/components/site/SubPage";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "@/components/site/ContactPricingRefinement.css";

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
    monthly: "od 10 € / mesiac",
    copy: "Odpovede z vašich podkladov alebo pomoc s výberom produktu.",
    action: "Vyskúšať poradcu",
    preset: "advisor" as const,
  },
  {
    index: "02",
    name: "Kalkulačka",
    setup: "od 447 €",
    monthly: "od 10 € / mesiac",
    copy: "Výpočet ceny, spotreby alebo rozsahu podľa vašich pravidiel.",
    action: "Vyskúšať kalkulačku",
    preset: "calculator" as const,
  },
  {
    index: "03",
    name: "Krokový konfigurátor",
    setup: "od 447 €",
    monthly: "od 10 € / mesiac",
    copy: "Výber rozmerov, variantov a doplnkov bez 3D modelu.",
    action: "Vyskúšať konfigurátor",
    preset: "product" as const,
  },
] as const;

const combinations = [
  { title: "Chatbot + kalkulačka", copy: "Odpoveď na otázku aj výpočet ceny." },
  { title: "Chatbot + konfigurátor", copy: "Vysvetlenie možností aj výber zostavy." },
  { title: "Poradca + konfigurátor", copy: "Odporúčanie produktu aj jeho nastavenie." },
  { title: "Všetko spolu", copy: "Rozhovor, výber a výpočet v jednom nástroji." },
] as const;

function PricingPage() {
  return (
    <ShPage className="shp-pricing cp-pricing">
      <header className="cp-pricing__intro">
        <div className="sh-wrap cp-pricing__intro-grid">
          <div>
            <p className="cp-kicker">Cenník</p>
            <h1>Koľko stojí váš nástroj</h1>
          </div>
          <div className="cp-pricing__intro-copy">
            <p>
              Toto sú ceny za základný rozsah. Presnú sumu dohodneme podľa vášho webu, pravidiel a
              potrebných napojení ešte pred vývojom.
            </p>
            <Link to="/kontakt" className="sh-btn sh-btn--dark">
              Zistiť cenu pre môj web <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <section className="cp-pricing__prices" id="baliky" aria-label="Ceny riešení">
        <div className="sh-wrap">
          <div className="cp-pricing__column-head" aria-hidden="true">
            <span>Riešenie</span>
            <span>Vytvorenie</span>
            <span>Prevádzka</span>
            <span>Ukážka</span>
          </div>
          <div className="cp-pricing__rows">
            {pricing.map((item) => (
              <article className="cp-price-row" key={item.name}>
                <div className="cp-price-row__name">
                  <span className="cp-price-row__index" aria-hidden="true">
                    {item.index}
                  </span>
                  <div>
                    <h2>{item.name}</h2>
                    <p>{item.copy}</p>
                  </div>
                </div>
                <div className="cp-price-row__setup">
                  <span className="cp-price-row__mobile-label">Vytvorenie</span>
                  <strong>{item.setup}</strong>
                </div>
                <div className="cp-price-row__monthly">
                  <span className="cp-price-row__mobile-label">Prevádzka</span>
                  <span>{item.monthly}</span>
                </div>
                <button
                  type="button"
                  className="sh-link sh-link--dark cp-price-row__action"
                  onClick={() =>
                    openSiteAssistant({
                      source: `pricing-${item.name.toLowerCase()}`,
                      preset: item.preset,
                    })
                  }
                >
                  {item.action} <ArrowUpRight size={18} aria-hidden="true" />
                </button>
              </article>
            ))}
            <article className="cp-price-row cp-price-row--3d">
              <div className="cp-price-row__name">
                <span className="cp-price-row__index" aria-hidden="true">
                  04
                </span>
                <div>
                  <h2>3D konfigurátor</h2>
                  <p>Interaktívny model s rozmermi, farbami a produktovou logikou.</p>
                </div>
              </div>
              <div className="cp-price-row__setup">
                <span className="cp-price-row__mobile-label">Vytvorenie</span>
                <strong>podľa rozsahu</strong>
              </div>
              <div className="cp-price-row__monthly">
                <span className="cp-price-row__mobile-label">Prevádzka</span>
                <span>podľa riešenia</span>
              </div>
              <Link to="/3d-konfigurator" className="sh-link sh-link--dark cp-price-row__action">
                Pozrieť konfigurátor <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </article>
          </div>
          <p className="cp-pricing__price-note">
            Každý nástroj funguje aj samostatne. Pri 3D rozhoduje rozsah modelu, možnosti a
            napojenia, preto ho naceníme individuálne.
          </p>
        </div>
      </section>

      <section className="cp-pricing__scope" aria-labelledby="pricing-scope-title">
        <div className="sh-wrap cp-pricing__scope-grid">
          <div>
            <p className="cp-kicker">Čo je v cene</p>
            <h2 id="pricing-scope-title">Od návrhu po nasadenie.</h2>
          </div>
          <dl className="cp-pricing__scope-list">
            <div>
              <dt>Vytvorenie</dt>
              <dd>Návrh otázok a krokov, dizajn, dohodnutá funkčnosť a nasadenie na váš web.</dd>
            </div>
            <div>
              <dt>Prevádzka</dt>
              <dd>Chod nástroja a bežná technická údržba podľa dohodnutých podmienok.</dd>
            </div>
            <div>
              <dt>Rozšírenia</dt>
              <dd>3D modely, väčšie integrácie a nové funkcie naceníme vopred samostatne.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="cp-pricing__combinations" aria-labelledby="pricing-combinations-title">
        <div className="sh-wrap cp-pricing__scope-grid">
          <div>
            <p className="cp-kicker">Keď potrebujete viac</p>
            <h2 id="pricing-combinations-title">Funkcie vieme spojiť.</h2>
            <p className="cp-pricing__combinations-copy">
              Zákazník môže položiť otázku, vybrať produkt aj zistiť cenu na jednom mieste.
              Kombináciu naceníme podľa rozsahu.
            </p>
          </div>
          <div className="cp-pricing__combination-list">
            {combinations.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => openSiteAssistant({ source: `pricing-combo-${index + 1}` })}
              >
                <span>
                  <strong>{item.title}</strong>
                  <span>{item.copy}</span>
                </span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="cp-pricing__closing">
        <div className="sh-wrap">
          <h2>Pošlite nám váš web.</h2>
          <p>Navrhneme rozsah a povieme vám presnú cenu.</p>
          <div className="cp-pricing__closing-actions">
            <Link to="/kontakt" className="sh-btn sh-btn--dark">
              Napísať nám <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="sh-link sh-link--dark"
              onClick={() => openSiteAssistant({ source: "pricing-final" })}
            >
              Pomôcť s výberom <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </ShPage>
  );
}
