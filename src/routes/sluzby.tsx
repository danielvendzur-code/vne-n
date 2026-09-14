import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import type { AssistantPreset } from "@/types/assistant";
import "./subpage-hero-refresh.css";
import "./sales-pages-refinement.css";

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
    business:
      "Získava vrstvu asistovaného výberu bez toho, aby zákazník musel poznať celý katalóg.",
    preset: "advisor",
  },
];

function ServicesPage() {
  return (
    <div className="sp-page services-page services-page--image-hero">
      <header className="sp-hero">
        <div className="container-page">
          <div className="subpage-hero-copy">
            <p className="section-kicker">ČO TVORÍME</p>
            <h1>
              Nástroje, ktoré posunú zákazníka <em>k výsledku.</em>
            </h1>
            <p className="sp-hero-lead">
              Nezačíname technológiou. Najprv určujeme, čo má človek na vašom webe zistiť,
              vypočítať, vybrať alebo odoslať.
            </p>
          </div>
          <figure className="subpage-hero-visual">
            <img
              src={`${import.meta.env.BASE_URL}work/portfolio/koverta.webp`}
              alt="Ukážka webu Koverta s interaktívnym konfigurátorom prístrešku"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={1440}
              height={1000}
            />
            <figcaption>Ukážka riešenia / Koverta</figcaption>
          </figure>
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

      <section className="sp-section services-audiences">
        <div className="container-page services-audiences__intro">
          <div>
            <p className="section-kicker">PRE KOHO</p>
            <h2>Iný problém pri službách. Iný pri e-shope.</h2>
          </div>
          <div>
            <p>
              Nástroj nevyberáme podľa názvu firmy, ale podľa rozhodnutia, ktoré má zákazník na webe
              zvládnuť. Pri službách ide častejšie o cenu a presné zadanie; pri e-shope o výber
              správneho produktu alebo variantu.
            </p>
          </div>
        </div>

        <div className="container-page services-audiences__list">
          <article className="services-audience services-audience--services">
            <div className="services-audience__heading">
              <span>01</span>
              <h3>Firmy so službami</h3>
            </div>
            <div className="services-audience__body">
              <p>
                Keď cenu alebo zadanie nemožno vyriešiť jedným statickým formulárom. Typicky pomôže
                kalkulačka, krátky krokový konfigurátor alebo chatbot, ktorý zozbiera presné
                podklady.
              </p>
              <ul>
                <li>orientačný výpočet</li>
                <li>presné zadanie dopytu</li>
                <li>výber variantu služby</li>
                <li>vysvetlenie možností</li>
              </ul>
            </div>
            <button
              type="button"
              className="site-cta site-cta--secondary services-audience__action"
              onClick={() =>
                openSiteAssistant({
                  source: "services-audience-services",
                  preset: "calculator",
                })
              }
            >
              Riešenie pre služby <ArrowRight size={15} />
            </button>
          </article>

          <article className="services-audience services-audience--shop">
            <div className="services-audience__heading">
              <span>02</span>
              <h3>E-shopy</h3>
            </div>
            <div className="services-audience__body">
              <p>
                Keď má zákazník veľa produktov, parametrov alebo variantov a nevie, ktorý zvoliť.
                Najčastejšie pomôže produktový poradca alebo riadený výber podľa konkrétnych
                potrieb.
              </p>
              <ul>
                <li>produktový poradca</li>
                <li>výber kompatibilného variantu</li>
                <li>produktové otázky</li>
                <li>prechod na konkrétny produkt</li>
              </ul>
            </div>
            <button
              type="button"
              className="site-cta site-cta--secondary services-audience__action"
              onClick={() =>
                openSiteAssistant({
                  source: "services-audience-shop",
                  preset: "advisor",
                })
              }
            >
              Riešenie pre e-shop <ArrowRight size={15} />
            </button>
          </article>
        </div>
      </section>

      <section className="pricing-bridge">
        <div className="container-page pricing-bridge__grid">
          <div>
            <p className="section-kicker">ĎALŠÍ KROK</p>
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
