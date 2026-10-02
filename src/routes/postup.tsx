import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { ShPage, ShPageHero } from "@/components/site/SubPage";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "@/components/site/ServicesProcessRefinement.css";

const steps = [
  {
    index: "01",
    title: "Pozrieme sa na váš web",
    output: "Dohodnuté zadanie a cieľ.",
    copy: "Prejdeme ponuku a otázky zákazníkov. Vyberieme, čo má nový nástroj vyriešiť.",
  },
  {
    index: "02",
    title: "Ukážeme vám návrh",
    output: "Návrh rozhrania a zoznam funkcií.",
    copy: "Uvidíte obrazovky aj celý výber zákazníka. Spolu doladíme otázky a výsledok.",
  },
  {
    index: "03",
    title: "Postavíme pracovnú verziu",
    output: "Odkaz na verziu, ktorú si môžete vyskúšať.",
    copy: "Napojíme podklady a výpočty. Otestujeme výber aj odoslanie dopytu na počítači a mobile.",
  },
  {
    index: "04",
    title: "Spustíme ho na vašom webe",
    output: "Funkčný nástroj na vašom webe.",
    copy: "Vložíme nástroj na web a overíme, že vám prichádzajú dopyty. Po spustení pomôžeme s úpravami.",
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

/** Časová os sa pri scrolle vypĺňa a kroky, ku ktorým čitateľ došiel,
 *  sa zvýraznia. Pri obmedzenom pohybe ostáva os statická. */
function useTimelineProgress() {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const line = window.innerHeight * 0.6;
      const progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
      list.style.setProperty("--progress", progress.toFixed(3));
      list.querySelectorAll<HTMLElement>(":scope > li").forEach((item) => {
        item.dataset.reached = String(item.getBoundingClientRect().top + 28 < line);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return ref;
}

function ProcessPage() {
  const timelineRef = useTimelineProgress();
  return (
    <ShPage className="spr-process">
      <ShPageHero
        eyebrow="Postup"
        title="Od prvého zadania"
        accent="po živý web."
        lead="Najprv návrh, potom verzia na vyskúšanie. Pred spustením si všetko prejdeme spolu."
        visual={{
          src: `${import.meta.env.BASE_URL}work/live/derat.webp`,
          alt: "Ukážka živého projektu DERAT s interaktívnym predajným nástrojom",
          width: 1600,
          height: 1000,
          caption: "Živá realizácia / DERAT",
        }}
      />

      <section className="sh-section spr-process-detail" aria-labelledby="spr-process-title">
        <div className="sh-wrap spr-process-detail__layout">
          <header className="spr-process-detail__head" data-reveal>
            <p className="spr-kicker">Ako spolupracujeme</p>
            <h2 id="spr-process-title">Pri každom kroku viete, čo dostanete.</h2>
            <p>
              Od prvého rozhovoru po spustenie na vašom webe. Návrh aj pracovnú verziu vám ukážeme v
              prehliadači.
            </p>
            <Link to="/kontakt" className="sh-link sh-link--dark">
              Prebrať projekt <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </header>
          <ol className="spr-timeline" ref={timelineRef}>
            {steps.map((step) => (
              <li key={step.index} data-reveal>
                <span className="spr-timeline__index">{step.index}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                  <p className="spr-timeline__output">
                    <span>Dostanete</span>
                    {step.output}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sh-section spr-closing" aria-labelledby="spr-process-closing-title">
        <div className="sh-wrap spr-closing__layout">
          <div>
            <h2 id="spr-process-closing-title">Poďme sa pozrieť na váš web.</h2>
            <p>Napíšte, čo by mal zákazník vybaviť. Navrhneme ďalší krok.</p>
          </div>
          <div className="spr-closing__actions">
            <Link to="/kontakt" className="sh-btn sh-btn--dark">
              Napísať nám <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="sh-link sh-link--dark"
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
