import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
    <div className="sp-page">
      <header className="sp-hero">
        <div className="container-page">
          <p className="section-kicker">WHY IT WORKS</p>
          <h1>
            Menej slepých miest medzi otázkou a <em>ďalším krokom.</em>
          </h1>
          <p className="sp-hero-lead">
            Hodnota nie je v tom, že na webe „je AI“. Hodnota je v tom, že človek vie rýchlejšie
            zistiť, vybrať alebo vypočítať to, čo potrebuje.
          </p>
        </div>
      </header>

      <section className="sp-section">
        <div className="container-page process-list">
          {outcomes.map((item) => (
            <article className="benefit-row" key={item.index}>
              <span>{item.index}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-bridge">
        <div className="container-page pricing-bridge__grid">
          <div>
            <p className="section-kicker">FIT</p>
            <h2 className="section-title">
              Má to zmysel <em>u vás?</em>
            </h2>
          </div>
          <div>
            <p>
              Najrýchlejšie to zistíme z vášho konkrétneho procesu. Popíšte, čo zákazník potrebuje a
              čo dnes vybavujete ručne.
            </p>
            <button
              type="button"
              className="button-primary"
              onClick={() => openSiteAssistant({ source: "why-page" })}
            >
              Vyskladať riešenie <ArrowRight size={15} />
            </button>
            <Link to="/projekty" className="text-link pricing-inline-link">
              Realizácie <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
