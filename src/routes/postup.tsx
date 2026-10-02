import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { ShPage } from "@/components/site/SubPage";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "@/components/site/ProcessReview.css";

const steps = [
  {
    index: "01",
    label: "Zadanie",
    title: "Pozrieme sa na váš web",
    output: "Dohodnuté zadanie a cieľ.",
    copy: "Prejdeme ponuku a otázky zákazníkov. Vyberieme, čo má nový nástroj vyriešiť.",
  },
  {
    index: "02",
    label: "Návrh",
    title: "Ukážeme vám návrh",
    output: "Návrh rozhrania a zoznam funkcií.",
    copy: "Uvidíte obrazovky aj celý výber zákazníka. Spolu doladíme otázky a výsledok.",
  },
  {
    index: "03",
    label: "Vývoj",
    title: "Postavíme pracovnú verziu",
    output: "Odkaz na verziu, ktorú si môžete vyskúšať.",
    copy: "Napojíme podklady a výpočty. Otestujeme výber aj odoslanie dopytu na počítači a mobile.",
  },
  {
    index: "04",
    label: "Spustenie",
    title: "Spustíme ho na vašom webe",
    output: "Funkčný nástroj na vašom webe.",
    copy: "Vložíme nástroj na web a overíme, že vám prichádzajú dopyty. Po spustení pomôžeme s úpravami.",
  },
] as const;

const previews = [
  {
    title: "Web, z ktorého vychádzame",
    copy: "Príklad DERAT: zákazník si má vedieť vypočítať cenu služby.",
    layout: "web",
    images: [
      {
        src: "work/process/derat-before.webp",
        alt: "Pôvodný web DERAT pred pridaním kalkulačky",
        width: 1600,
        height: 1000,
      },
    ],
  },
  {
    title: "Otázky a výber zákazníka",
    copy: "Ukážka rozhrania: výber služby a priestoru pred výpočtom ceny.",
    layout: "flow",
    images: [
      {
        src: "work/derat-kalkulacka/01-sluzba.webp",
        alt: "Kalkulačka DERAT: zákazník si vyberá službu",
        width: 600,
        height: 1276,
      },
      {
        src: "work/derat-kalkulacka/03-priestor.webp",
        alt: "Kalkulačka DERAT: zákazník vyberá typ priestoru",
        width: 600,
        height: 1276,
      },
    ],
  },
  {
    title: "Rozmery, doplnky a výpočet ceny",
    copy: "Ukážka pracovného rozhrania, ktoré si pred spustením prejdeme spolu.",
    layout: "flow",
    images: [
      {
        src: "work/derat-kalkulacka/04-rozloha.webp",
        alt: "Kalkulačka DERAT: zadanie rozlohy a prepočítaná cena",
        width: 600,
        height: 1276,
      },
      {
        src: "work/derat-kalkulacka/05-doplnky.webp",
        alt: "Kalkulačka DERAT: výber doplnkov k službe",
        width: 600,
        height: 1276,
      },
    ],
  },
  {
    title: "Hotový nástroj na webe",
    copy: "Zákazník vybaví výber aj dopyt priamo na webe DERAT.",
    layout: "web",
    images: [
      {
        src: "work/process/derat-after.webp",
        alt: "Web DERAT s otvorenou kalkulačkou služieb",
        width: 1600,
        height: 1000,
      },
    ],
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

function PhasePreview() {
  const [activePhase, setActivePhase] = useState(1);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const preview = previews[activePhase];

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % steps.length;
    else if (event.key === "ArrowLeft") next = (index + steps.length - 1) % steps.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = steps.length - 1;
    else return;
    event.preventDefault();
    setActivePhase(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <div className="ppr-preview">
      <p className="ppr-preview__label">Pozrite si postup na príklade DERAT</p>
      <div className="ppr-preview__tabs" role="tablist" aria-label="Fázy tvorby nástroja">
        {steps.map((step, index) => (
          <button
            key={step.index}
            type="button"
            role="tab"
            id={`process-phase-${index}`}
            aria-controls="process-phase-preview"
            aria-selected={activePhase === index}
            tabIndex={activePhase === index ? 0 : -1}
            ref={(element) => {
              tabsRef.current[index] = element;
            }}
            onClick={() => setActivePhase(index)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
          >
            <span>{step.index}</span> {step.label}
          </button>
        ))}
      </div>
      <div
        id="process-phase-preview"
        className="ppr-preview__panel"
        role="tabpanel"
        aria-labelledby={`process-phase-${activePhase}`}
        tabIndex={0}
      >
        <figure className="ppr-preview__visual" data-layout={preview.layout} key={activePhase}>
          {preview.images.map((image) => (
            <img
              key={image.src}
              src={`${import.meta.env.BASE_URL}${image.src}`}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="eager"
              decoding="async"
            />
          ))}
        </figure>
        <div className="ppr-preview__caption" aria-live="polite">
          <h2>{preview.title}</h2>
          <p>{preview.copy}</p>
        </div>
      </div>
    </div>
  );
}

function ProcessPage() {
  return (
    <ShPage className="ppr-process">
      <header className="ppr-opening">
        <div className="sh-wrap ppr-opening__layout">
          <div className="ppr-opening__copy">
            <p className="ppr-kicker">Ako spolupracujeme</p>
            <h1>Takto vznikne váš nástroj.</h1>
            <p className="ppr-opening__lead">
              Pošlete nám web a poviete, čo potrebujete. My pripravíme návrh, postavíme verziu na
              vyskúšanie a spustíme ju u vás.
            </p>
            <Link to="/kontakt" className="sh-btn sh-btn--dark">
              Prebrať projekt <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <PhasePreview />
        </div>
      </header>

      <section className="ppr-details" aria-labelledby="ppr-details-title">
        <div className="sh-wrap ppr-details__layout">
          <header className="ppr-details__head" data-reveal>
            <p className="ppr-kicker">Od zadania po spustenie</p>
            <h2 id="ppr-details-title">Štyri kroky, ktoré si prejdeme spolu.</h2>
            <p>Pred vývojom uvidíte návrh. Pred spustením si nástroj vyskúšate.</p>
          </header>
          <ol className="ppr-steps">
            {steps.map((step) => (
              <li key={step.index} data-reveal>
                <span className="ppr-steps__index">{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                <p className="ppr-steps__output">{step.output}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ppr-closing" aria-labelledby="ppr-closing-title">
        <div className="sh-wrap ppr-closing__layout">
          <div>
            <h2 id="ppr-closing-title">Začnime vaším webom.</h2>
            <p>Napíšte, čo by mal zákazník vybaviť. Navrhneme ďalší krok.</p>
          </div>
          <div className="ppr-closing__actions">
            <Link to="/kontakt" className="sh-btn sh-btn--dark">
              Napísať nám <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="sh-btn sh-btn--lime"
              onClick={() => openSiteAssistant({ source: "process-final" })}
            >
              Otvoriť chat <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </ShPage>
  );
}
