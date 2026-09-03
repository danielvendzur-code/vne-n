import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./AwardHome.css";
import "./KageLanding.css";

type FlowMode = "chatbot" | "calculator" | "configurator";

type FlowStage = {
  index: string;
  label: string;
  title: string;
  copy: string;
  artifact: string;
};

const flowModes: Record<FlowMode, { label: string; stages: FlowStage[] }> = {
  chatbot: {
    label: "Chatbot",
    stages: [
      {
        index: "01",
        label: "OTÁZKA",
        title: "Návštevník napíše, čo potrebuje.",
        copy: "Začne obyčajnou otázkou priamo na vašom webe.",
        artifact: "Dobrý deň, čo by ste mi odporučili?",
      },
      {
        index: "02",
        label: "DOPLNENIE",
        title: "Web sa spýta na dôležité údaje.",
        copy: "Doplní iba informácie potrebné na správnu odpoveď.",
        artifact: "Typ služby / miesto / termín",
      },
      {
        index: "03",
        label: "ODPOVEĎ",
        title: "Návštevník dostane jasnú odpoveď.",
        copy: "Hneď vie, aké má možnosti a čo môže urobiť ďalej.",
        artifact: "Odpoveď / možnosti / ďalší krok",
      },
      {
        index: "04",
        label: "DOPYT",
        title: "Vy dostanete pripravený kontakt.",
        copy: "Spolu s kontaktom príde aj zhrnutie celej požiadavky.",
        artifact: "Kontakt + zhrnutie požiadavky",
      },
    ],
  },
  calculator: {
    label: "Kalkulačka",
    stages: [
      {
        index: "01",
        label: "ZAČIATOK",
        title: "Návštevník chce poznať cenu.",
        copy: "Výpočet začne hneď, bez telefonátu alebo čakania.",
        artifact: "Koľko to bude približne stáť?",
      },
      {
        index: "02",
        label: "ÚDAJE",
        title: "Zadá niekoľko jednoduchých údajov.",
        copy: "Vyberie rozmer, množstvo, variant alebo potrebné doplnky.",
        artifact: "Rozmer / množstvo / variant",
      },
      {
        index: "03",
        label: "VÝPOČET",
        title: "Web cenu prepočíta.",
        copy: "Použije váš cenník a pravidlá, ktoré už vo firme máte.",
        artifact: "Vaše pravidlá + váš cenník",
      },
      {
        index: "04",
        label: "VÝSLEDOK",
        title: "Ukáže výsledok a ďalší krok.",
        copy: "Návštevník vie, s čím počítať, a môže rovno odoslať dopyt.",
        artifact: "Odhad ceny + pripravený dopyt",
      },
    ],
  },
  configurator: {
    label: "Konfigurátor",
    stages: [
      {
        index: "01",
        label: "VÝBER",
        title: "Návštevník si vyberie, čo hľadá.",
        copy: "Začne jednoduchou voľbou namiesto preklikávania celej ponuky.",
        artifact: "Čo potrebujem?",
      },
      {
        index: "02",
        label: "MOŽNOSTI",
        title: "Web ukáže vhodné možnosti.",
        copy: "Rozmery, modely, farby a doplnky zobrazí v správnom poradí.",
        artifact: "Len možnosti, ktoré viete dodať",
      },
      {
        index: "03",
        label: "KONTROLA",
        title: "Skontroluje celý výber.",
        copy: "Nedovolí zvoliť kombináciu, ktorú neviete dodať alebo vyrobiť.",
        artifact: "Kontrola kombinácií",
      },
      {
        index: "04",
        label: "ZOSTAVA",
        title: "Hotovú zostavu odošle vám.",
        copy: "Spolu s kontaktom dostanete presný výber návštevníka.",
        artifact: "Zostava + kontakt",
      },
    ],
  },
};

const tools = [
  {
    index: "01",
    name: "Chatbot",
    statement: "Odpovedá na otázky a pripraví dopyt.",
    copy: "Keď zákazníci často riešia rovnaké otázky alebo potrebujú poradiť.",
    preset: "inquiry" as const,
    cta: "Vyskladať chatbota",
  },
  {
    index: "02",
    name: "Kalkulačka",
    statement: "Vypočíta orientačnú cenu.",
    copy: "Keď cenu mení rozmer, množstvo, model, montáž alebo doplnky.",
    preset: "calculator" as const,
    cta: "Vyskladať kalkulačku",
  },
  {
    index: "03",
    name: "Konfigurátor",
    statement: "Prevedie zákazníka výberom.",
    copy: "Keď si zákazník skladá riešenie z viacerých dostupných možností.",
    preset: "product" as const,
    cta: "Vyskladať konfigurátor",
  },
  {
    index: "04",
    name: "Produktový poradca",
    statement: "Pomôže vybrať správny produkt.",
    copy: "Keď má e-shop veľa podobných produktov a zákazník nevie, ktorý je preňho vhodný.",
    preset: "product" as const,
    cta: "Vyskladať poradcu",
  },
];

const process = [
  [
    "01",
    "Ukážete nám web a ponuku",
    "Zistíme, čo zákazníci najčastejšie hľadajú, riešia a pýtajú sa.",
  ],
  ["02", "Navrhneme jednoduchý postup", "Určíme, čo má zákazník vidieť, vybrať alebo napísať."],
  [
    "03",
    "Riešenie vytvoríme a otestujeme",
    "Pripravíme dizajn, logiku aj napojenia a otestujeme desktop aj mobil.",
  ],
  [
    "04",
    "Nasadíme ho na váš web",
    "Zapojíme hotové riešenie a overíme formuláre, dopyty aj bežné používanie.",
  ],
] as const;

const featuredProjects = [
  {
    slug: "koverta",
    name: "Koverta",
    domain: "koverta.sk",
    href: "https://koverta.sk/",
    type: "E-commerce · dopytový asistent",
    result: "Asistent zistí typ produktu, rozmery a použitie ešte pred odoslaním dopytu.",
    siteImage: `${import.meta.env.BASE_URL}work/portfolio/koverta.webp`,
    alt: "Domovská stránka Koverta s modernou pergolou",
  },
  {
    slug: "derat",
    name: "DERAT",
    domain: "derat.sk",
    href: "https://derat.sk/",
    type: "Služby · kalkulačka a dopyt",
    result: "Kalkulačka prevedie návštevníka od problému k orientačnej cene a dopytu.",
    siteImage: `${import.meta.env.BASE_URL}work/live/derat.webp`,
    alt: "Domovská stránka reálne nasadeného webu DERAT",
  },
  {
    slug: "mojplot",
    name: "Môj Plot",
    domain: "mojplot.sk",
    href: "https://mojplot.sk/",
    type: "E-commerce · produktová kalkulačka",
    result: "Zákazník si vyberie typ oplotenia a pokračuje priamo k výpočtu alebo kontaktu.",
    siteImage: `${import.meta.env.BASE_URL}work/live/mojplot.webp`,
    alt: "Domovská stránka Môj Plot s ponukou kvalitných plotov",
  },
  {
    slug: "webko",
    name: "WEBKO",
    domain: "webko.sk",
    href: "https://www.webko.sk/",
    type: "Prezentačný web · získavanie dopytov",
    result: "Jasná prezentácia služieb vedie návštevníka priamo ku kontaktu a zadaniu webu.",
    siteImage: `${import.meta.env.BASE_URL}work/live/webko.webp`,
    alt: "Tmavá domovská stránka WEBKO s ukážkou webových realizácií",
  },
] as const;

// WEBKO remains in the realizations grid, but the approved hero composition
// intentionally uses only three overlapping website previews.
const heroProjects = featuredProjects.slice(0, 3);

const outcomeGroups = [
  {
    label: "FIRMA SO SLUŽBAMI",
    title: "Z otázky vznikne pripravený dopyt.",
    preset: "inquiry" as const,
    rows: [
      ["Návštevník hľadá odpoveď", "Web mu ju poskytne okamžite"],
      ["Cena závisí od viacerých údajov", "Kalkulačka pripraví orientačný výsledok"],
      ["Firma sa opakovane dopýtava", "Kontakt príde spolu s potrebným kontextom"],
    ],
  },
  {
    label: "E-SHOP",
    title: "Z ponuky vznikne jednoduchý výber.",
    preset: "product" as const,
    rows: [
      ["Zákazník porovnáva veľa možností", "Poradca zúži výber podľa potrieb"],
      ["Nevie, ktorý variant je vhodný", "Konfigurátor ukáže iba platné kombinácie"],
      ["Odíde bez rozhodnutia", "Web ho dovedie k produktu alebo dopytu"],
    ],
  },
] as const;

function ProjectVisual({
  project,
  eager = false,
}: {
  project: (typeof featuredProjects)[number];
  eager?: boolean;
}) {
  return (
    <span className={`project-composite project-composite--${project.slug}`}>
      <img
        className="project-composite__site"
        src={project.siteImage}
        alt={project.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
      />
    </span>
  );
}

function TypedLine({ text, startAt }: { text: string; startAt: number }) {
  const words = text.split(" ");

  return (
    <span className="typed-line" aria-hidden="true">
      {words.map((word, wordIndex) => {
        const wordOffset =
          startAt +
          words.slice(0, wordIndex).reduce((total, item) => total + item.length, 0) +
          wordIndex;
        return (
          <span className="typed-word" key={`${word}-${wordIndex}`}>
            {Array.from(word).map((character, characterIndex) => (
              <span
                className="typed-character"
                key={`${character}-${characterIndex}`}
                style={{ "--character-index": wordOffset + characterIndex } as CSSProperties}
              >
                {character}
              </span>
            ))}
            {wordIndex < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </span>
  );
}

function HeroCollage() {
  return (
    <div className="hybrid-hero__collage" aria-label="Vybrané živé realizácie">
      {heroProjects.map((project, index) => (
        <a
          key={project.name}
          className={`hybrid-hero__case hybrid-hero__case--${index + 1}`}
          href={project.href}
          target="_blank"
          rel="noreferrer"
        >
          <ProjectVisual project={project} eager />
          <span>
            0{index + 1} / {project.name}
          </span>
        </a>
      ))}
    </div>
  );
}

function presetForMode(mode: FlowMode): "inquiry" | "calculator" | "product" {
  if (mode === "calculator") return "calculator";
  if (mode === "configurator") return "product";
  return "inquiry";
}

const flowPanels = (viewport: HTMLElement) =>
  Array.from(viewport.querySelectorAll<HTMLElement>("[data-flow-stage]"));

/** Scroll offset of a stage inside its own scroller, independent of layout. */
const flowStageOffset = (viewport: HTMLElement, panel: HTMLElement) =>
  panel.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft;

const scrollToFlowStage = (viewport: HTMLElement, index: number, smooth: boolean) => {
  const panel = flowPanels(viewport)[index];
  if (!panel) return;

  viewport.scrollTo({
    left: flowStageOffset(viewport, panel),
    behavior: smooth ? "smooth" : "auto",
  });
};

const nearestFlowStage = (viewport: HTMLElement) => {
  let closest = 0;
  let smallest = Number.POSITIVE_INFINITY;

  flowPanels(viewport).forEach((panel, index) => {
    const distance = Math.abs(flowStageOffset(viewport, panel) - viewport.scrollLeft);
    if (distance >= smallest) return;
    smallest = distance;
    closest = index;
  });

  return closest;
};

/**
 * 03 / Ako to funguje.
 *
 * The four stages live in one native horizontal scroller: the page keeps its
 * own vertical scrolling at all times (no pinned section, no wheel capture and
 * no programmatic window.scrollTo), and the stages are moved by swipe, drag,
 * the step buttons or the keyboard. The active stage is read from an
 * IntersectionObserver inside the scroller, so nothing runs on page scroll.
 */
function FlowStory() {
  const [mode, setMode] = useState<FlowMode>("chatbot");
  const [activeStage, setActiveStage] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const stages = flowModes[mode].stages;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || typeof IntersectionObserver === "undefined") return undefined;

    const panels = flowPanels(viewport);
    if (panels.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = panels.indexOf(entry.target as HTMLElement);
          if (index < 0) return;
          setActiveStage((current) => (current === index ? current : index));
        });
      },
      { root: viewport, threshold: 0.6 },
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, [mode]);

  const goToStage = (index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    scrollToFlowStage(viewport, index, !reducedMotion);
    setActiveStage(index);
  };

  // Mouse drag panning. Touch and trackpad already pan the scroller natively.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    let pointerId: number | null = null;
    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const stopDrag = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      pointerId = null;
      if (!dragging) return;

      dragging = false;
      delete viewport.dataset.dragging;
      viewport.style.removeProperty("scroll-snap-type");
      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
      const stage = nearestFlowStage(viewport);
      scrollToFlowStage(viewport, stage, !reducedMotion);
      setActiveStage(stage);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pointerId = event.pointerId;
      dragging = false;
      startX = event.clientX;
      startScrollLeft = viewport.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;

      const delta = event.clientX - startX;
      if (!dragging) {
        if (Math.abs(delta) < 6) return;
        dragging = true;
        viewport.dataset.dragging = "true";
        viewport.style.setProperty("scroll-snap-type", "none");
        viewport.setPointerCapture(event.pointerId);
      }

      viewport.scrollLeft = startScrollLeft - delta;
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", stopDrag);
    viewport.addEventListener("pointercancel", stopDrag);

    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", stopDrag);
      viewport.removeEventListener("pointercancel", stopDrag);
      delete viewport.dataset.dragging;
      viewport.style.removeProperty("scroll-snap-type");
    };
  }, [mode, reducedMotion]);

  const selectMode = (nextMode: FlowMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setActiveStage(0);
    viewportRef.current?.scrollTo({ left: 0, behavior: "auto" });
  };

  return (
    <section
      className="kage-flow-story"
      id="ako-to-funguje"
      aria-labelledby="kage-flow-story-title"
      data-signal-chapter="3"
      data-nav-tone="dark"
    >
      <div className="container-page kage-flow-story__header">
        <span className="section-index">
          <b>03</b> AKO TO FUNGUJE
        </span>
        <h2 id="kage-flow-story-title">Štyri kroky od otázky k výsledku.</h2>
        <div className="kage-flow-story__modes" aria-label="Vyberte typ riešenia">
          {(Object.keys(flowModes) as FlowMode[]).map((item) => (
            <button
              type="button"
              key={item}
              data-active={mode === item}
              aria-pressed={mode === item}
              onClick={() => selectMode(item)}
            >
              {flowModes[item].label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="kage-flow-story__viewport"
        tabIndex={0}
        role="group"
        aria-label={`${flowModes[mode].label}: štyri kroky, posúvajte do strany`}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goToStage(Math.min(stages.length - 1, activeStage + 1));
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goToStage(Math.max(0, activeStage - 1));
          }
        }}
      >
        <ol className="kage-flow__track">
          {stages.map((stage, index) => (
            <li
              className="kage-flow__panel"
              key={`${mode}-${stage.index}`}
              data-flow-stage={stage.index}
              data-active={index === activeStage || undefined}
            >
              <div className="container-page kage-flow__panel-inner">
                <span className="kage-flow__number" aria-hidden="true">
                  {stage.index}
                </span>
                <div className="kage-flow__copy">
                  <span>{stage.label}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.copy}</p>
                </div>
                <div className="kage-flow__artifact">
                  <span>
                    {flowModes[mode].label.toUpperCase()} / {stage.index}
                  </span>
                  <strong>{stage.artifact}</strong>
                  <i aria-hidden="true">→</i>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="container-page kage-flow-story__footer">
        <div className="kage-flow-story__steps" aria-label="Prejsť na krok">
          {stages.map((stage, index) => (
            <button
              type="button"
              key={stage.index}
              data-active={index === activeStage || undefined}
              aria-current={index === activeStage ? "step" : undefined}
              aria-label={`Krok ${index + 1}: ${stage.label}`}
              onClick={() => goToStage(index)}
            >
              {stage.index}
            </button>
          ))}
        </div>

        <div className="kage-flow-story__arrows">
          <button
            type="button"
            aria-label="Predchádzajúci krok"
            disabled={activeStage === 0}
            onClick={() => goToStage(activeStage - 1)}
          >
            <ArrowLeft size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Nasledujúci krok"
            disabled={activeStage === stages.length - 1}
            onClick={() => goToStage(activeStage + 1)}
          >
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          className="kage-flow-story__cta"
          onClick={() => openSiteAssistant({ source: "flow-story", preset: presetForMode(mode) })}
        >
          Vyskúšať na mojom webe <ArrowUpRight size={17} />
        </button>

        <div className="kage-flow-story__rail" aria-hidden="true">
          <i style={{ transform: `scaleX(${(activeStage + 1) / stages.length})` }} />
        </div>
      </div>
    </section>
  );
}

function CoreTools() {
  return (
    <section
      className="hybrid-tools kage-tools"
      id="riesenia"
      aria-labelledby="hybrid-tools-title"
      data-signal-chapter="1"
      data-nav-tone="light"
    >
      <div className="container-page hybrid-tools__intro">
        <span className="section-index">
          <b>01</b> RIEŠENIA
        </span>
        <div>
          <h2 id="hybrid-tools-title">Čo má váš web robiť?</h2>
          <p>Kliknite na možnosť a hneď si otvoríte ukážku.</p>
        </div>
      </div>
      <div className="hybrid-tools__rows">
        {tools.map((tool) => (
          <button
            key={tool.name}
            type="button"
            className="hybrid-tool"
            onClick={() => openSiteAssistant({ source: `tool-${tool.index}`, preset: tool.preset })}
            aria-label={`${tool.cta}: ${tool.name}`}
          >
            <div className="container-page hybrid-tool__inner">
              <span>{tool.index}</span>
              <strong>{tool.name}</strong>
              <b>{tool.statement}</b>
              <p>{tool.copy}</p>
              <span className="hybrid-tool__cta">
                {tool.cta} <ArrowUpRight size={18} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function SelectedWork() {
  return (
    <section
      className="hybrid-work kage-work"
      id="realizacie"
      aria-labelledby="hybrid-work-title"
      data-signal-chapter="2"
      data-nav-tone="light"
    >
      <div className="container-page hybrid-work__intro">
        <span className="section-index">
          <b>02</b> REALIZÁCIE
        </span>
        <h2 id="hybrid-work-title">Hotové projekty.</h2>
        <p>Reálne nasadené weby, ktoré si môžete priamo otvoriť a prezrieť.</p>
      </div>
      <div className="container-page hybrid-work__grid">
        {featuredProjects.map((project, index) => (
          <article className="hybrid-project" key={project.name}>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className={`hybrid-project__visual hybrid-project__visual--${project.slug}`}
            >
              <ProjectVisual project={project} />
              <span className="hybrid-project__domain">{project.domain}</span>
              <span className="hybrid-project__open">
                OTVORIŤ WEB <ArrowUpRight size={15} />
              </span>
            </a>
            <div className="hybrid-project__meta">
              <span>0{index + 1}</span>
              <div>
                <h3>{project.name}</h3>
                <p>{project.type}</p>
              </div>
              <p>{project.result}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="container-page hybrid-work__footer">
        <Link to="/projekty">
          Pozrieť všetky projekty <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section
      className="hybrid-audience outcome-comparison"
      id="pre-eshopy"
      aria-labelledby="outcome-comparison-title"
      data-nav-tone="light"
    >
      <div className="container-page outcome-comparison__intro">
        <span className="section-index">
          <b>04</b> VÝSLEDOK
        </span>
        <h2 id="outcome-comparison-title">Čo sa na webe reálne zmení?</h2>
        <p>
          Návštevník dostane jasný ďalší krok. Vy dostanete menej opakovaných otázok a použiteľnejší
          kontakt.
        </p>
      </div>
      <div className="container-page outcome-comparison__grid">
        {outcomeGroups.map((group, groupIndex) => (
          <article
            className="outcome-comparison__group"
            data-tone={groupIndex === 0 ? "service" : "shop"}
            key={group.label}
          >
            <span>{group.label}</span>
            <h3>{group.title}</h3>
            <ol>
              {group.rows.map(([before, after], index) => (
                <li key={before}>
                  <small>0{index + 1}</small>
                  <p>{before}</p>
                  <ArrowRight size={17} aria-hidden="true" />
                  <strong>{after}</strong>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() =>
                openSiteAssistant({ source: `outcome-${groupIndex + 1}`, preset: group.preset })
              }
            >
              Ukázať vhodné riešenie <ArrowRight size={17} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section
      className="hybrid-process"
      id="proces"
      aria-labelledby="hybrid-process-title"
      data-signal-chapter="5"
      data-nav-tone="light"
    >
      <div className="container-page hybrid-process__intro">
        <span className="section-index">
          <b>05</b> SPOLUPRÁCA
        </span>
        <h2 id="hybrid-process-title">Takto spolupráca prebehne.</h2>
        <Link to="/postup">
          Pozrieť celý postup <ArrowRight size={17} />
        </Link>
      </div>
      <ol className="container-page hybrid-process__list">
        {process.map(([index, title, copy]) => (
          <li key={index} style={{ boxShadow: "none" }}>
            <span>{index}</span>
            <strong>{title}</strong>
            <p>{copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * Counts a price up when its row reaches the viewport.
 *
 * The final value is what renders on the server and on the first client frame.
 * The counter only ever drops to zero from inside the IntersectionObserver
 * callback, so a browser without the observer — or one that never fires it —
 * shows the real price instead of a permanent "od 0 €".
 */
function AnimatedPrice({ value, lead = "od " }: { value: number; lead?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || typeof IntersectionObserver === "undefined") {
      setDisplayValue(value);
      return undefined;
    }

    let frame = 0;
    let started = false;

    const countUp = () => {
      started = true;
      element.dataset.counting = "true";
      const startedAt = performance.now();
      const duration = 1150;

      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(progress >= 1 ? value : Math.round(value * eased));

        if (progress < 1) {
          frame = requestAnimationFrame(tick);
          return;
        }

        frame = 0;
        delete element.dataset.counting;
        element.dataset.counted = "true";
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (started || !entry) return;

        if (!entry.isIntersecting) {
          // The observer is alive, so staging at zero is safe to undo later.
          setDisplayValue(0);
          return;
        }

        observer.disconnect();
        setDisplayValue(0);
        countUp();
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
      delete element.dataset.counting;
      delete element.dataset.counted;
    };
  }, [reducedMotion, value]);

  return <strong ref={ref}>{`${lead}${displayValue} €`}</strong>;
}

function Price() {
  return (
    <section
      className="hybrid-price"
      id="cena"
      aria-labelledby="hybrid-price-title"
      data-nav-tone="dark"
    >
      <div className="container-page hybrid-price__top">
        <span className="section-index">
          <b>06</b> CENA
        </span>
        <h2 id="hybrid-price-title">Koľko to stojí?</h2>
      </div>
      <div className="container-page hybrid-price__grid">
        <div>
          <span>CHATBOT / PRODUKTOVÝ PORADCA</span>
          <AnimatedPrice value={347} />
          <p>Návrh, dizajn, obsah a nasadenie na web.</p>
        </div>
        <div>
          <span>KALKULAČKA / KONFIGURÁTOR</span>
          <AnimatedPrice value={447} />
          <p>Výpočet alebo výber podľa vašich pravidiel.</p>
        </div>
        <div>
          <span>PREVÁDZKA</span>
          <AnimatedPrice value={10} lead="" />
          <b>/ mesiac</b>
          <p>Technická prevádzka a základná starostlivosť.</p>
        </div>
        <Link to="/cennik" className="hybrid-price__link">
          Pozrieť celý cenník <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export function KageLanding() {
  return (
    <div className="hybrid-home kage-home">
      <section
        className="hybrid-hero kage-hero"
        aria-labelledby="hybrid-hero-title"
        data-signal-chapter="0"
        data-nav-tone="dark"
      >
        <div className="container-page hybrid-hero__stage">
          <h1 id="hybrid-hero-title" aria-label="Web, ktorý mení návštevy na výsledky.">
            <TypedLine text="Web, ktorý" startAt={0} />
            <em>
              <TypedLine text="mení návštevy" startAt={10} />
            </em>
            <em>
              <TypedLine text="na výsledky." startAt={24} />
            </em>
          </h1>
          <HeroCollage />
        </div>
        <div className="container-page hybrid-hero__bottom kage-hero__bottom">
          <p>Chatboty, kalkulačky, konfigurátory a produktoví poradcovia na mieru.</p>
          <a href="#riesenia" className="hybrid-hero__primary">
            Vybrať riešenie <ArrowUpRight size={17} />
          </a>
        </div>
      </section>

      <CoreTools />
      <SelectedWork />

      <section
        className="hybrid-manifesto kage-manifesto"
        aria-labelledby="hybrid-manifesto-title"
        data-nav-tone="light"
      >
        <div className="container-page hybrid-manifesto__inner">
          <span className="section-index">
            <b>03</b> ČO TO ZMENÍ
          </span>
          <h2 id="hybrid-manifesto-title">
            Web môže <em style={{ display: "inline-block" }}>odpovedať.</em> Môže{" "}
            <em style={{ display: "inline-block" }}>vypočítať cenu.</em> Môže{" "}
            <em style={{ display: "inline-block" }}>pomôcť s výberom.</em>
          </h2>
        </div>
      </section>

      <FlowStory />
      <Audience />
      <Process />
      <Price />

      <section className="hybrid-final" aria-labelledby="hybrid-final-title" data-nav-tone="dark">
        <div className="container-page hybrid-final__top">
          <BrandMark size={54} />
          <span>MÔJ CHATBOT</span>
        </div>
        <div className="container-page hybrid-final__body">
          <h2 id="hybrid-final-title">Chcete to aj na svoj web?</h2>
          <p>
            Pošlite nám web alebo stručne napíšte, čo chcete zákazníkom zjednodušiť. Ozveme sa s
            konkrétnym návrhom.
          </p>
          <div>
            <Link to="/kontakt" className="hybrid-final__button">
              Chcem návrh <ArrowUpRight size={19} />
            </Link>
            <a href="mailto:info@mojchatbot.sk">info@mojchatbot.sk</a>
          </div>
        </div>
      </section>
    </div>
  );
}
