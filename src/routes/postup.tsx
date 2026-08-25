import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

const steps = [
  {
    index: "01",
    title: "Pochopenie",
    output: "Jasne pomenovaný problém a cieľ nástroja.",
    copy: "Prejdeme web, ponuku a situácie, ktoré dnes riešite ručne. Určíme, čo má zákazník zistiť, vypočítať, vybrať alebo odoslať.",
  },
  {
    index: "02",
    title: "Návrh",
    output: "Schválená cesta zákazníka a rozsah prvej verzie.",
    copy: "Navrhneme otázky, rozhodovaciu logiku, výstupy a podobu rozhrania. Pred vývojom viete, čo presne sa bude diať po jednotlivých krokoch.",
  },
  {
    index: "03",
    title: "Vývoj",
    output: "Funkčná verzia na otestovanie.",
    copy: "Postavíme rozhranie a dohodnutú logiku. Otestujeme výpočty, formuláre, konfiguráciu a správanie na desktopoch aj mobiloch.",
  },
  {
    index: "04",
    title: "Nasadenie",
    output: "Nástroj na reálnom webe a overený ďalší krok.",
    copy: "Nasadíme riešenie, preveríme odosielanie dopytov alebo výsledkov a doladíme detaily podľa reálneho použitia.",
  },
] as const;

const processJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Ako prebieha tvorba digitálneho predajného nástroja Môj Chatbot",
  description: "Štyri kroky od pochopenia procesu po nasadenie riešenia na web.",
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: `${step.copy} Výstup: ${step.output}`,
  })),
});

export const Route = createFileRoute("/postup")({
  head: () => ({
    ...seo({
      title: "Ako to funguje — od briefu po živý web",
      description:
        "Štyri konkrétne kroky od pochopenia procesu cez návrh a vývoj až po nasadenie chatbota, kalkulačky alebo konfigurátora.",
      path: "/postup",
    }),
    scripts: [
      { type: "application/ld+json", children: processJsonLd },
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Ako to funguje", path: "/postup" }]),
      },
    ],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <div className="sp-page process-page--rebrand">
      <header className="sp-hero">
        <div className="container-page">
          <p className="section-kicker">PROCESS</p>
          <h1>
            Od prvého briefu <em>po živý web.</em>
          </h1>
          <p className="sp-hero-lead">
            Každý krok má konkrétny výstup. Klient vie, čo sa práve rozhoduje, čo dostane a kedy má
            zmysel pokračovať ďalej.
          </p>
        </div>
      </header>

      <section className="sp-section">
        <div className="container-page process-page-grid">
          <aside className="process-page-intro">
            <p className="section-kicker">QUESTION → OUTCOME</p>
            <p>
              Technológia je až druhá. Najprv musí byť jasné, čo má byť výsledkom pre zákazníka a
              pre firmu.
            </p>
          </aside>
          <ol className="process-list">
            {steps.map((step) => (
              <li key={step.index}>
                <span>{step.index}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.copy}</p>
                  <p className="process-output">
                    <b>Výstup:</b> {step.output}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pricing-bridge">
        <div className="container-page pricing-bridge__grid">
          <div>
            <p className="section-kicker">START</p>
            <h2 className="section-title">
              Začnime tým, čo dnes <em>riešite ručne.</em>
            </h2>
          </div>
          <div>
            <p>
              Nemusíte vedieť, či potrebujete chatbot, kalkulačku, konfigurátor alebo produktového
              poradcu. Stačí popísať proces a výsledok, ktorý chcete.
            </p>
            <button
              type="button"
              className="button-primary"
              onClick={() => openSiteAssistant({ source: "process-final" })}
            >
              Vyskladať riešenie <ArrowRight size={15} />
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
