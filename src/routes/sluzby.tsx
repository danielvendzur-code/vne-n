import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ShPage } from "@/components/site/SubPage";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import type { AssistantPreset } from "@/types/assistant";
import "@/components/site/ServicesProcessRefinement.css";

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
  result: string;
  cta: string;
  preset: AssistantPreset;
}> = [
  {
    index: "01",
    name: "Chatbot",
    copy: "Odpovie na otázky z vašich podkladov. Keď treba, vypýta si kontakt a pošle vám zhrnutie rozhovoru.",
    result: "Pre zákazníkov, ktorí sa chcú najprv opýtať.",
    cta: "Vyskúšať chatbota",
    preset: "inquiry",
  },
  {
    index: "02",
    name: "Kalkulačka",
    copy: "Zákazník zadá rozmery či množstvo a hneď uvidí cenu. Výpočet funguje podľa vašich pravidiel.",
    result: "Pre služby a produkty, kde cenu treba spočítať.",
    cta: "Vyskúšať kalkulačku",
    preset: "calculator",
  },
  {
    index: "03",
    name: "Konfigurátor",
    copy: "Prevedie zákazníka výberom rozmerov, materiálov a doplnkov. Vy dostanete presnú zostavu.",
    result: "Pre ponuku, ktorú si zákazník skladá na mieru.",
    cta: "Vyskúšať konfigurátor",
    preset: "product",
  },
  {
    index: "04",
    name: "Produktový poradca",
    copy: "Opýta sa na použitie a rozpočet. Z ponuky odporučí konkrétne produkty a vysvetlí rozdiely.",
    result: "Pre e-shopy s veľkým výberom.",
    cta: "Vyskúšať poradcu",
    preset: "advisor",
  },
];

const audiences = [
  {
    title: "Cena služby bez ďalšieho telefonátu",
    copy: "Na webe DERAT zákazník zadá priestor, rozlohu a lokalitu. Spočíta si orientačnú cenu a odošle dopyt so všetkými podkladmi.",
    image: "work/live/derat.webp",
    width: 1600,
    height: 1000,
    alt: "Web DERAT s kalkulačkou ceny služieb",
    caption: "DERAT",
    type: "Kalkulačka pre služby",
    cta: "Pozrieť projekt",
    to: "/projekty/derat" as const,
  },
  {
    title: "Správny produkt z celej ponuky",
    copy: "Pár otázok o chuti a príprave kávy pomôže zákazníkovi vybrať konkrétny produkt. Nemusí prechádzať celý katalóg ani rozumieť všetkým parametrom.",
    image: "work/solutions/poradca-kava.webp",
    width: 640,
    height: 1116,
    alt: "Produktový poradca pri výbere kávy",
    caption: "Výber kávy",
    type: "Produktový poradca",
    cta: "Vyskúšať poradcu",
    preset: "advisor" as const,
  },
];

function ServicesPage() {
  return (
    <ShPage className="spr-services">
      <header className="spr-service-hero">
        <div className="sh-wrap spr-service-hero__layout">
          <div className="spr-service-hero__copy">
            <p className="spr-kicker">Riešenia pre váš web</p>
            <h1>
              Uľahčite ľuďom <em>výber na webe.</em>
            </h1>
            <p className="spr-service-hero__lead">
              Odpoveď na otázku, výpočet ceny alebo produkt na mieru. Postavíme nástroj, s ktorým
              zákazník vybaví viac priamo u vás.
            </p>
            <a href="#spr-tools" className="sh-btn sh-btn--lime">
              Pozrieť riešenia <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <Link to="/3d-konfigurator" className="spr-service-hero__visual">
            <img
              src={`${import.meta.env.BASE_URL}work/koverta/model-pergola.webp`}
              alt="Pergola Koverta, ktorú si zákazník môže zostaviť v 3D konfigurátore"
              width={1200}
              height={824}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <span className="spr-service-hero__caption">
              <span>
                Koverta <small>3D konfigurátor pergoly</small>
              </span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </header>

      <section className="sh-section spr-tools" id="spr-tools" aria-labelledby="spr-tools-title">
        <div className="sh-wrap">
          <header className="spr-section-head" data-reveal>
            <p className="spr-kicker">Čo vieme postaviť</p>
            <h2 id="spr-tools-title">Vyberte podľa toho, čo má zákazník vybaviť.</h2>
          </header>
          <div className="spr-tools__grid">
            {tools.map((tool) => (
              <article className="spr-tool" key={tool.name} data-reveal>
                <span className="spr-tool__index">{tool.index}</span>
                <h3>{tool.name}</h3>
                <p>{tool.copy}</p>
                <p className="spr-tool__result">{tool.result}</p>
                <button
                  type="button"
                  className="sh-link sh-link--dark"
                  onClick={() =>
                    openSiteAssistant({
                      source: `services-${tool.name.toLowerCase()}`,
                      preset: tool.preset,
                      category: tool.name,
                    })
                  }
                >
                  {tool.cta} <ArrowUpRight size={18} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
          <div className="spr-tools__note">
            <p>Nástroje môžu fungovať samostatne aj spolu v jednom rozhraní.</p>
            <Link to="/kontakt" className="sh-link sh-link--dark">
              Prebrať váš web <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="sh-section spr-examples" aria-labelledby="spr-examples-title">
        <div className="sh-wrap">
          <header className="spr-section-head" data-reveal>
            <p className="spr-kicker">V praxi</p>
            <h2 id="spr-examples-title">Ako to vyzerá na webe</h2>
          </header>
          <div className="spr-examples__grid">
            {audiences.map((audience) => (
              <article className="spr-example" key={audience.caption} data-reveal>
                <figure
                  className="spr-example__visual"
                  data-portrait={!!audience.preset || undefined}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${audience.image}`}
                    alt={audience.alt}
                    width={audience.width}
                    height={audience.height}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="spr-example__meta">
                  <span>{audience.caption}</span>
                  <span>{audience.type}</span>
                </div>
                <h3>{audience.title}</h3>
                <p>{audience.copy}</p>
                {audience.preset ? (
                  <button
                    type="button"
                    className="sh-link sh-link--dark"
                    onClick={() =>
                      openSiteAssistant({ source: "services-coffee", preset: audience.preset })
                    }
                  >
                    {audience.cta} <ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                ) : (
                  <Link to={audience.to} className="sh-link sh-link--dark">
                    {audience.cta} <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sh-section spr-closing" aria-labelledby="spr-services-closing-title">
        <div className="sh-wrap spr-closing__layout">
          <div>
            <h2 id="spr-services-closing-title">Čo by mal vybaviť váš web?</h2>
            <p>Pošlite nám odkaz a napíšte, čo zákazníci potrebujú. Navrhneme, kde začať.</p>
          </div>
          <Link to="/kontakt" className="sh-btn sh-btn--dark">
            Napísať nám <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </ShPage>
  );
}
