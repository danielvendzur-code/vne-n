import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ShPage, ShPageHero, ShSectionHead } from "@/components/site/SubPage";
import { Eyebrow } from "@/components/site/StudioHome";
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
    business:
      "Získava vrstvu asistovaného výberu bez toho, aby zákazník musel poznať celý katalóg.",
    preset: "advisor",
  },
];

const audiences = [
  {
    index: "01",
    title: "Zákazník potrebuje cenu.",
    copy: "Pri službách mu pomôže krátky výpočet. Vy dostanete rozmery, miesto aj kontakt v jednom zadaní.",
    image: "work/live/derat.webp",
    alt: "Web DERAT s kalkulačkou ceny služieb",
    caption: "DERAT / služby",
    cta: "Pozrieť príklad",
    to: "/projekty/derat" as const,
  },
  {
    index: "02",
    title: "Zákazník sa potrebuje rozhodnúť.",
    copy: "Pri produktoch mu pomôžeme zúžiť výber. Podľa toho, čo hľadá a ako bude produkt používať.",
    image: "work/solutions/poradca-kava.webp",
    alt: "Produktový poradca pri výbere kávy",
    caption: "Produktový poradca / výber kávy",
    cta: "Prebrať môj e-shop",
    to: "/kontakt" as const,
  },
];

function ServicesPage() {
  return (
    <ShPage>
      <ShPageHero
        eyebrow="Čo tvoríme"
        title="Nástroje, ktoré posunú zákazníka"
        accent="k výsledku."
        lead="Nezačíname technológiou. Najprv určujeme, čo má človek na vašom webe zistiť, vypočítať, vybrať alebo odoslať."
        visual={{
          src: `${import.meta.env.BASE_URL}work/koverta/konfigurator-pergola.webp`,
          alt: "3D konfigurátor Koverta: bioklimatická pergola s posedením a výberom umiestnenia",
          width: 1600,
          height: 841,
          caption: "3D konfigurátor / Koverta",
        }}
      />

      <section className="sh-section">
        <div className="sh-wrap">
          <ShSectionHead
            eyebrow="Nástroje"
            title="Štyri nástroje. Samostatne, v kombinácii aj všetky spolu."
            lead="Každý rieši iné rozhodnutie zákazníka. Keď to dáva zmysel, spojíme ich do jedného rozhrania."
          />
          <div className="shp-grid-2">
            {tools.map((tool, index) => (
              <article
                className="shp-card"
                key={tool.name}
                data-reveal
                style={{ "--d": index % 2 } as CSSProperties}
              >
                <span className="shp-num">{tool.index}</span>
                <h2 className="shp-card__title">{tool.name}</h2>
                <p>{tool.copy}</p>
                <ul className="shp-rows">
                  <li>
                    <b>Zákazník</b>
                    <span>{tool.customer}</span>
                  </li>
                  <li>
                    <b>Firma</b>
                    <span>{tool.business}</span>
                  </li>
                </ul>
                <button
                  type="button"
                  className="sh-btn sh-btn--dark sh-btn--sm"
                  onClick={() =>
                    openSiteAssistant({
                      source: `services-${tool.name.toLowerCase()}`,
                      preset: tool.preset,
                      category: tool.name,
                    })
                  }
                >
                  Vyskladať tento smer <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sh-section sr-audiences" aria-labelledby="sr-audiences-title">
        <div className="sh-wrap">
          <ShSectionHead
            eyebrow="Pre koho"
            title="Čo potrebuje zákazník zistiť?"
            lead="Cenu služby alebo správny produkt. Tu sú dva príklady."
          />
          <h2 id="sr-audiences-title" className="sr-visually-hidden">
            Riešenia pre služby a e-shopy
          </h2>
          <div className="sr-audiences__list">
            {audiences.map((audience) => (
              <article className="sr-audience" key={audience.index}>
                <div className="sr-audience__copy">
                  <span className="sr-audience__index">
                    {audience.index} / {audience.caption}
                  </span>
                  <h3>{audience.title}</h3>
                  <p>{audience.copy}</p>
                  <Link to={audience.to} className="sh-link">
                    {audience.cta} <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
                <figure
                  className="sr-audience__visual"
                  data-portrait={audience.index === "02" || undefined}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${audience.image}`}
                    alt={audience.alt}
                    width={1600}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sh-section sr-closing" aria-labelledby="sr-closing-title">
        <div className="sh-wrap sr-closing__layout">
          <div>
            <Eyebrow>Váš projekt</Eyebrow>
            <h2 id="sr-closing-title">Ukážte nám váš web.</h2>
            <p>
              Napíšte, na čo sa zákazníci pýtajú alebo čo im chcete uľahčiť. Ozveme sa s návrhom
              ďalšieho kroku.
            </p>
          </div>
          <div className="sr-closing__actions">
            <Link to="/kontakt" className="sh-btn sh-btn--dark">
              Prebrať projekt <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="sh-link sh-link--dark"
              onClick={() => openSiteAssistant({ source: "services-final" })}
            >
              Alebo nám napíšte v chate <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </ShPage>
  );
}
