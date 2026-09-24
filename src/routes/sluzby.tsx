import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ShClosing, ShPage, ShPageHero, ShSectionHead } from "@/components/site/SubPage";
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
    title: "Firmy so službami",
    copy: "Keď cenu alebo zadanie nemožno vyriešiť jedným statickým formulárom. Typicky pomôže kalkulačka, krátky krokový konfigurátor alebo chatbot, ktorý zozbiera presné podklady.",
    tags: [
      "orientačný výpočet",
      "presné zadanie dopytu",
      "výber variantu služby",
      "vysvetlenie možností",
    ],
    cta: "Riešenie pre služby",
    preset: "calculator" as const,
  },
  {
    index: "02",
    title: "E-shopy",
    copy: "Keď má zákazník veľa produktov, parametrov alebo variantov a nevie, ktorý zvoliť. Najčastejšie pomôže produktový poradca alebo riadený výber podľa konkrétnych potrieb.",
    tags: [
      "produktový poradca",
      "výber kompatibilného variantu",
      "produktové otázky",
      "prechod na konkrétny produkt",
    ],
    cta: "Riešenie pre e-shop",
    preset: "advisor" as const,
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

      <section className="sh-section shp-section--pure">
        <div className="sh-wrap shp-split">
          <ShSectionHead
            eyebrow="Pre koho"
            title="Iný problém pri službách. Iný pri e-shope."
            lead="Nástroj nevyberáme podľa názvu firmy, ale podľa rozhodnutia, ktoré má zákazník na webe zvládnuť. Pri službách ide častejšie o cenu a presné zadanie; pri e-shope o výber správneho produktu alebo variantu."
          />
          <div className="shp-audiences">
            {audiences.map((audience, index) => (
              <article
                className={`shp-card shp-audience${index === 0 ? " shp-card--dark" : ""}`}
                key={audience.title}
                data-reveal
                style={{ "--d": index } as CSSProperties}
              >
                <span className="shp-num">{audience.index}</span>
                <h3>{audience.title}</h3>
                <p>{audience.copy}</p>
                <ul className="shp-tags">
                  {audience.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`sh-btn sh-btn--sm ${index === 0 ? "sh-btn--lime" : "sh-btn--dark"}`}
                  onClick={() =>
                    openSiteAssistant({
                      source: `services-audience-${index === 0 ? "services" : "shop"}`,
                      preset: audience.preset,
                    })
                  }
                >
                  {audience.cta} <ArrowRight size={16} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ShClosing
        title="Neviete, čo sa hodí práve vám?"
        copy="Stručne opíšte, čo dnes zákazníkom vysvetľujete, počítate alebo vyberáte. Navrhneme najjednoduchší funkčný smer."
      >
        <button
          type="button"
          className="sh-btn sh-btn--lime"
          onClick={() => openSiteAssistant({ source: "services-final" })}
        >
          Vyskladať riešenie <ArrowRight size={18} aria-hidden="true" />
        </button>
        <Link to="/kontakt" className="sh-link">
          Kontakt
        </Link>
      </ShClosing>
    </ShPage>
  );
}
