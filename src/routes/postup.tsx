import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ShClosing, ShPage, ShPageHero, ShSectionHead } from "@/components/site/SubPage";
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
      title: "Ako to funguje — od zadania po živý web",
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
    <ShPage>
      <ShPageHero
        eyebrow="Postup"
        title="Od prvého zadania"
        accent="po živý web."
        lead="Každý krok má konkrétny výstup. Viete, čo sa práve rozhoduje, čo dostanete a kedy má zmysel pokračovať ďalej."
        visual={{
          src: `${import.meta.env.BASE_URL}work/live/derat.webp`,
          alt: "Ukážka živého projektu DERAT s interaktívnym predajným nástrojom",
          width: 1600,
          height: 1000,
          caption: "Živá realizácia / DERAT",
        }}
      />

      <section className="sh-section">
        <div className="sh-wrap shp-split">
          <ShSectionHead
            eyebrow="Otázka → výsledok"
            title="Technológia je až druhá."
            lead="Najprv musí byť jasné, čo má byť výsledkom pre zákazníka a pre firmu. Až potom staviame."
          />
          <ol className="sh-timeline shp-timeline">
            {steps.map((step, order) => (
              <li key={step.index} data-reveal style={{ "--d": order } as CSSProperties}>
                <b>{step.index}</b>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.copy}</p>
                  <p className="shp-output">
                    <strong>Výstup:</strong> {step.output}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ShClosing
        title="Začnime tým, čo dnes riešite ručne."
        copy="Nemusíte vedieť, či potrebujete chatbot, kalkulačku, konfigurátor alebo produktového poradcu. Stačí popísať proces a výsledok, ktorý chcete."
      >
        <button
          type="button"
          className="sh-btn sh-btn--lime"
          onClick={() => openSiteAssistant({ source: "process-final" })}
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
