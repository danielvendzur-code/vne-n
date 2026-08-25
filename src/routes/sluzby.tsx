import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import type { AssistantPreset } from "@/types/assistant";

export const Route = createFileRoute("/sluzby")({
  head: () => ({
    ...seo({
      title: "Chatboty, kalkulačky, konfigurátory a produktoví poradcovia na mieru",
      description:
        "Digitálne predajné nástroje na mieru pre e-shopy aj firmy so službami: chatbot, kalkulačka, konfigurátor a produktový poradca.",
      path: "/sluzby",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Riešenia", path: "/sluzby" }]),
      },
    ],
  }),
  component: ServicesPage,
});

const tools: Array<{
  index: string;
  name: string;
  copy: string;
  customer: string;
  business: string;
  preset: AssistantPreset;
}> = [
  {
    index: "01",
    name: "Chatbot",
    copy: "Odpovie na otázky, vysvetlí ponuku a zistí, čo zákazník potrebuje.",
    customer: "Dostane odpoveď a jasný ďalší krok bez hľadania po webe.",
    business: "Dostane kontakt spolu s kontextom, ktorý sa dá ďalej riešiť.",
    preset: "inquiry",
  },
  {
    index: "02",
    name: "Kalkulačka",
    copy: "Zoberie rozmery, množstvo alebo ďalšie vstupy a prepočíta ich podľa vašich pravidiel.",
    customer: "Vidí orientačnú cenu, spotrebu alebo rozsah ešte pred kontaktovaním firmy.",
    business: "Dostane rovnaké vstupy aj výsledok pripravený pre ďalšiu ponuku.",
    preset: "calculator",
  },
  {
    index: "03",
    name: "Konfigurátor",
    copy: "Rozdelí zložitý výber na jednoduché kroky a ukáže iba relevantné možnosti.",
    customer: "Poskladá si variant, rozmery, materiál alebo doplnky bez chaosu.",
    business: "Dostane hotovú špecifikáciu namiesto neúplného formulára.",
    preset: "product",
  },
  {
    index: "04",
    name: "Produktový poradca",
    copy: "Pomôže zúžiť ponuku podľa použitia, preferencií, parametrov alebo rozpočtu.",
    customer: "Rýchlejšie sa dostane k produktu alebo variantu, ktorý mu dáva zmysel.",
    business: "Získava guided-selling vrstvu bez toho, aby zákazník musel poznať celý katalóg.",
    preset: "product",
  },
];

function ServicesPage() {
  return (
    <div className="sp-page">
      <header className="sp-hero">
        <div className="container-page">
          <p className="section-kicker">WHAT WE BUILD</p>
          <h1>
            Nástroje, ktoré posunú zákazníka <em>k výsledku.</em>
          </h1>
          <p className="sp-hero-lead">
            Nezačíname technológiou. Najprv určujeme, čo má človek na vašom webe zistiť, vypočítať,
            vybrať alebo odoslať.
          </p>
        </div>
      </header>

      <section className="sp-section">
        <div className="container-page tool-rows">
          {tools.map((tool) => (
            <article className="sp-service" key={tool.name}>
              <div className="sp-service-head">
                <span className="sp-service-index">{tool.index}</span>
                <h2>{tool.name}</h2>
                <p>{tool.copy}</p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() =>
                    openSiteAssistant({
                      source: `services-${tool.name.toLowerCase()}`,
                      preset: tool.preset,
                      category: tool.name,
                    })
                  }
                >
                  Vyskladať tento smer <ArrowRight size={15} />
                </button>
              </div>
              <div className="sp-service-rows">
                <div className="sp-service-row">
                  <span>Zákazník</span>
                  <p>{tool.customer}</p>
                </div>
                <div className="sp-service-row">
                  <span>Firma</span>
                  <p>{tool.business}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sp-section">
        <div className="container-page audience__grid">
          <div className="audience__copy">
            <p className="section-kicker">WHERE IT WORKS / SERVICES</p>
            <h2 className="section-title">
              Pre firmy <em>so službami.</em>
            </h2>
            <p>
              Keď zákazník potrebuje cenu, vysvetlenie, konfiguráciu alebo musí firme poslať
              presnejšie zadanie, interaktívny nástroj skráti cestu medzi otázkou a kontaktom.
            </p>
            <ul className="plain-list">
              <li>orientačný výpočet</li>
              <li>kvalifikácia dopytu</li>
              <li>konfigurácia zákazky</li>
              <li>zber potrebných údajov</li>
            </ul>
          </div>
          <div className="audience__copy">
            <p className="section-kicker">WHERE IT WORKS / E-COMMERCE</p>
            <h2 className="section-title">
              Pre <em>e-shopy.</em>
            </h2>
            <p>
              Keď je výber produktu zložitý, poradca môže viesť zákazníka cez parametre a
              preferencie, porovnať možnosti a dostať ho k relevantnému produktu alebo variantu.
            </p>
            <ul className="plain-list">
              <li>produktový poradca</li>
              <li>výber variantu</li>
              <li>produktové otázky</li>
              <li>guided selling pred nákupom</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pricing-bridge">
        <div className="container-page pricing-bridge__grid">
          <div>
            <p className="section-kicker">NEXT STEP</p>
            <h2 className="section-title">
              Neviete, čo sa hodí <em>práve vám?</em>
            </h2>
          </div>
          <div>
            <p>
              Stručne opíšte, čo dnes zákazníkom vysvetľujete, počítate alebo vyberáte. Navrhneme
              najjednoduchší funkčný smer.
            </p>
            <button
              type="button"
              className="button-primary"
              onClick={() => openSiteAssistant({ source: "services-final" })}
            >
              Vyskladať riešenie <ArrowRight size={15} />
            </button>
            <Link to="/kontakt" className="text-link" style={{ marginLeft: "1rem" }}>
              Kontakt <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
