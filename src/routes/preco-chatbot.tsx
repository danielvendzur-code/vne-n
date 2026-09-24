import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ShClosing, ShPage, ShPageHero, ShSectionHead } from "@/components/site/SubPage";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/preco-chatbot")({
  head: () => ({
    ...seo({
      title: "Čo interaktívny nástroj prinesie webu",
      description:
        "Chatbot, kalkulačka, konfigurátor alebo produktový poradca môže odpovedať, počítať, pomáhať s výberom a pripraviť použiteľný ďalší krok.",
      path: "/preco-chatbot",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Čo to prinesie webu", path: "/preco-chatbot" }]),
      },
    ],
  }),
  component: WhyPage,
});

const outcomes = [
  {
    index: "01",
    title: "Odpoveď bez hľadania",
    copy: "Návštevník sa môže opýtať konkrétne a dostať odpoveď z podkladov firmy namiesto preklikávania všeobecných textov.",
  },
  {
    index: "02",
    title: "Výpočet z reálnych vstupov",
    copy: "Ak sa cena alebo rozsah dá určiť pravidlami, zákazník môže dostať orientačný výsledok ešte pred kontaktom.",
  },
  {
    index: "03",
    title: "Jednoduchší výber",
    copy: "Pri produktoch alebo službách s viacerými možnosťami môže konfigurátor viesť človeka iba cez relevantné rozhodnutia.",
  },
  {
    index: "04",
    title: "Lepší kontext pre firmu",
    copy: "Dopyt môže obsahovať odpovede a parametre, ktoré by ste inak zisťovali v prvom telefonáte alebo e-maile.",
  },
] as const;

function WhyPage() {
  return (
    <ShPage>
      <ShPageHero
        eyebrow="Prečo to funguje"
        title="Menej slepých miest medzi otázkou"
        accent="a ďalším krokom."
        lead="Hodnota nie je v tom, že na webe „je AI“. Hodnota je v tom, že človek vie rýchlejšie zistiť, vybrať alebo vypočítať to, čo potrebuje."
        visual={{
          src: `${import.meta.env.BASE_URL}work/solutions/poradca-kava.webp`,
          alt: "Produktový poradca pre e-shop s kávou: výber chuti cez štyri otázky",
          width: 640,
          height: 1116,
          portrait: true,
        }}
      />

      <section className="sh-section">
        <div className="sh-wrap">
          <ShSectionHead eyebrow="Čo sa zmení" title="Štyri veci, ktoré web začne robiť za vás" />
          <div className="shp-grid-4">
            {outcomes.map((item, index) => (
              <article
                className={`shp-card${index === 3 ? " shp-card--dark" : ""}`}
                key={item.index}
                data-reveal
                style={{ "--d": index } as CSSProperties}
              >
                <span className="shp-num">{item.index}</span>
                <h2 className="shp-card__title">{item.title}</h2>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ShClosing
        title="Má to zmysel u vás?"
        copy="Najrýchlejšie to zistíme z vášho konkrétneho procesu. Popíšte, čo zákazník potrebuje a čo dnes vybavujete ručne."
      >
        <button
          type="button"
          className="sh-btn sh-btn--lime"
          onClick={() => openSiteAssistant({ source: "why-page" })}
        >
          Vyskladať riešenie <ArrowRight size={18} aria-hidden="true" />
        </button>
        <Link to="/projekty" className="sh-link">
          Realizácie
        </Link>
      </ShClosing>
    </ShPage>
  );
}
