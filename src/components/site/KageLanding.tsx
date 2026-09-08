import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { openSiteAssistant } from "@/lib/site-assistant";

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
        title: "Zákazník sa pýta na produkt alebo nákup.",
        copy: "Namiesto hľadania medzi desiatkami stránok sa opýta priamo na webe.",
        artifact: "Ktorý produkt je pre mňa vhodný?",
      },
      {
        index: "02",
        label: "POTREBY",
        title: "Chatbot zistí, čo zákazník skutočne hľadá.",
        copy: "Doplní použitie, preferencie, rozpočet alebo parametre potrebné na dobrú odpoveď.",
        artifact: "Použitie / preferencie / rozpočet",
      },
      {
        index: "03",
        label: "ODPORÚČANIE",
        title: "Zúži ponuku na relevantné produkty.",
        copy: "Ukáže vhodné možnosti, vysvetlí rozdiely a odpovie na otázky k nákupu.",
        artifact: "2–3 vhodné produkty + rozdiely",
      },
      {
        index: "04",
        label: "NÁKUP",
        title: "Zákazník pokračuje k produktu alebo do košíka.",
        copy: "Rozhodnutie sa nestratí v ďalšom formulári. Pokračuje priamo tam, kde môže nakúpiť.",
        artifact: "Produkt / košík / nákup",
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
    statement: "Odpovedá na otázky k produktom a nákupu.",
    copy: "Najmä pre e-shopy: parametre, dostupnosť, doprava, porovnanie a pomoc pred nákupom.",
    preset: "advisor" as const,
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
    preset: "advisor" as const,
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
    "Pripravíme dizajn, logiku aj napojenia a otestujeme počítač aj mobil.",
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
    type: "E-shop · dopytový asistent",
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
    type: "E-shop · produktová kalkulačka",
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

function presetForMode(mode: FlowMode): "advisor" | "calculator" | "product" {
  if (mode === "calculator") return "calculator";
  if (mode === "configurator") return "product";
  return "advisor";
}

const pageSections = [
  { id: "riesenia", index: "01", label: "Riešenia" },
  { id: "realizacie", index: "02", label: "Realizácie" },
  { id: "ako-to-funguje", index: "03", label: "Ako to funguje" },
  { id: "pre-eshopy", index: "04", label: "Výsledok" },
  { id: "proces", index: "05", label: "Spolupráca" },
  { id: "cena", index: "06", label: "Cenník" },
] as const;

function PageNavigator() {
  const [activeSection, setActiveSection] =
    useState<(typeof pageSections)[number]["id"]>("riesenia");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const sampleY = Math.min(window.innerHeight - 1, 148);
      let next = pageSections[0].id;

      for (const item of pageSections) {
        const section = document.getElementById(item.id);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= sampleY) next = item.id;
        if (rect.top <= sampleY && rect.bottom > sampleY) break;
      }

      setActiveSection((current) => (current === next ? current : next));
    };

    const scheduleUpdate = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <nav className="page-section-nav" aria-label="Orientácia na úvodnej stránke">
      <div className="container-page page-section-nav__inner">
        {pageSections.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-active={activeSection === item.id}
            aria-current={activeSection === item.id ? "location" : undefined}
          >
            <span>{item.index}</span>
            <b>{item.label}</b>
          </a>
        ))}
      </div>
    </nav>
  );
}

/**
 * 03 / Ako to funguje.
 *
 * The section is a real vertical chapter. Normal page scroll drives the
 * horizontal story while a full-viewport stage stays sticky. There is no
 * wheel interception and no separate sideways scrolling gesture.
 */
function FlowStory() {
  const [mode, setMode] = useState<FlowMode>("chatbot");
  const stages = flowModes[mode].stages;
  const storyRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const stepsRef = useRef<HTMLOListElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const section = storyRef.current;
    const rail = railRef.current;
    const track = stepsRef.current;
    if (!section || !rail || !track) return undefined;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      frameRef.current = null;

      const viewportHeight = Math.max(1, window.innerHeight);
      const sectionRect = section.getBoundingClientRect();
      const scrollRange = Math.max(1, section.offsetHeight - viewportHeight);
      const rawProgress = -sectionRect.top / scrollRange;
      const progress = Math.min(1, Math.max(0, rawProgress));
      const maxTravel = Math.max(0, track.scrollWidth - rail.clientWidth);

      const visualProgress =
        reducedMotionQuery.matches && stages.length > 1
          ? Math.round(progress * (stages.length - 1)) / (stages.length - 1)
          : progress;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const offset = Math.round(-maxTravel * visualProgress * dpr) / dpr;

      const headerReveal = Math.min(1, Math.max(0, (progress - 0.07) / 0.16));
      const footerReveal = Math.min(1, Math.max(0, (progress - 0.66) / 0.16));

      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      section.style.setProperty("--flow-progress", String(progress));
      section.style.setProperty("--flow-header-reveal", String(headerReveal));
      section.style.setProperty("--flow-footer-reveal", String(footerReveal));
      section.style.setProperty("--flow-header-shift", `${Math.round((1 - headerReveal) * 18)}px`);
      section.style.setProperty("--flow-footer-shift", `${Math.round((1 - footerReveal) * 18)}px`);
      section.dataset.footerReady = footerReveal >= 0.85 ? "true" : "false";
    };

    const scheduleUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleUpdate) : null;
    resizeObserver?.observe(section);
    resizeObserver?.observe(rail);
    resizeObserver?.observe(track);

    const onReducedMotionChange = () => scheduleUpdate();
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    }

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver?.disconnect();
      if (typeof reducedMotionQuery.removeEventListener === "function") {
        reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      }
      track.style.removeProperty("transform");
      section.style.removeProperty("--flow-progress");
      section.style.removeProperty("--flow-header-reveal");
      section.style.removeProperty("--flow-footer-reveal");
      section.style.removeProperty("--flow-header-shift");
      section.style.removeProperty("--flow-footer-shift");
      delete section.dataset.footerReady;
    };
  }, [mode, stages.length]);

  const moveFlow = (direction: -1 | 1) => {
    const section = storyRef.current;
    if (!section) return;

    const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
    const stageDistance = scrollRange / Math.max(1, stages.length - 1);

    window.scrollBy({
      top: direction * stageDistance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={storyRef}
      className="kage-flow-story"
      id="ako-to-funguje"
      aria-labelledby="kage-flow-story-title"
      data-signal-chapter="3"
      data-nav-tone="dark"
    >
      <div className="kage-flow-story__sticky">
        <div className="container-page kage-flow-story__header">
          <span className="section-index">
            <b>03</b> AKO TO FUNGUJE
          </span>
          <div className="kage-flow-story__header-copy">
            <h2 id="kage-flow-story-title">Ako sa návštevník dostane k výsledku.</h2>
            <p>
              Chatbot, kalkulačka aj konfigurátor majú vlastný postup. Posúvaním stránky uvidíte, čo zákazník
              robí, čo mu web ukáže a kam ho posunie ďalej.
            </p>
          </div>
          <div className="kage-flow-story__modes" aria-label="Vyberte typ riešenia">
            {(Object.keys(flowModes) as FlowMode[]).map((item) => (
              <button
                type="button"
                key={item}
                data-active={mode === item}
                aria-pressed={mode === item}
                onClick={() => setMode(item)}
              >
                {flowModes[item].label}
              </button>
            ))}
          </div>
        </div>

        <div ref={railRef} className="kage-flow-story__rail-wrap">
          <ol
            ref={stepsRef}
            className="kage-flow-story__steps"
            tabIndex={0}
            aria-label="Štyri kroky. Vertikálnym scrollom prejdete celý príbeh; šípky posunú o jeden krok."
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                moveFlow(-1);
              } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                moveFlow(1);
              }
            }}
          >
            {stages.map((stage) => (
              <li className="kage-flow__step" key={`${mode}-${stage.index}`}>
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
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="container-page kage-flow-story__footer">
          <p>Posúvaním stránky prejdete celý postup. Rovnaký systém vieme pripraviť pre váš web.</p>
          <button
            type="button"
            className="kage-flow-story__cta site-cta site-cta--primary"
            onClick={() => openSiteAssistant({ source: "flow-story", preset: presetForMode(mode) })}
          >
            Vyskúšať na mojom webe <ArrowUpRight size={17} />
          </button>
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
              <span className="hybrid-tool__cta site-cta site-cta--secondary site-cta--compact">
                {tool.cta} <ArrowUpRight size={18} />
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="container-page solution-combination-note">
        <span>SAMOSTATNE AJ SPOLU</span>
        <div>
          <h3>Každý nástroj funguje aj samostatne.</h3>
          <p>
            Ak to dáva zmysel, spojíme ich: chatbot môže zároveň počítať cenu, viesť konfiguráciu
            alebo odporúčať produkty. Nie je však nutné mať chatbot ku kalkulačke ani ku
            konfigurátoru.
          </p>
        </div>
        <ul aria-label="Príklady kombinovaných riešení">
          <li>Chatbot + kalkulačka</li>
          <li>Chatbot + konfigurátor</li>
          <li>Poradca + konfigurátor</li>
        </ul>
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
        <Link to="/projekty" className="site-cta site-cta--secondary">
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
              className="site-cta site-cta--secondary"
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
        <Link to="/postup" className="site-cta site-cta--secondary">
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
          // Keep the real price in the DOM until the row actually enters the
          // viewport. Full-page screenshots, crawlers and accessibility tools
          // must never observe a fake "0 €" price just because the animation
          // has not started yet.
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
      className="hybrid-price kage-price-hero"
      id="cena"
      aria-labelledby="hybrid-price-title"
      data-nav-tone="dark"
    >
      <div className="container-page kage-price-hero__layout">
        <div className="kage-price-hero__intro">
          <span className="section-index">
            <b>06</b> CENNÍK
          </span>
          <h2 id="hybrid-price-title">
            Jasná cena. <em>Reálne riešenie.</em>
          </h2>
          <p>
            Základnú cenu vidíte hneď. Presný rozsah si odsúhlasíme pred začiatkom práce, aby ste
            vedeli, čo dostanete a za čo platíte.
          </p>
          <Link to="/cennik" className="kage-price-hero__primary site-cta site-cta--primary">
            Otvoriť celý cenník <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="kage-price-hero__offers" aria-label="Základné ceny">
          <Link to="/cennik" className="kage-price-hero__offer">
            <span>01 / CHATBOT · PRODUKTOVÝ PORADCA</span>
            <div>
              <AnimatedPrice value={347} />
              <ArrowUpRight size={20} aria-hidden="true" />
            </div>
            <p>Návrh, dizajn, obsah, logika a nasadenie na web.</p>
          </Link>

          <Link to="/cennik" className="kage-price-hero__offer">
            <span>02 / KALKULAČKA · KONFIGURÁTOR</span>
            <div>
              <AnimatedPrice value={447} />
              <ArrowUpRight size={20} aria-hidden="true" />
            </div>
            <p>Výpočet alebo výber postavený na vašich pravidlách a ponuke.</p>
          </Link>

          <Link to="/cennik" className="kage-price-hero__offer kage-price-hero__offer--monthly">
            <span>03 / TECHNICKÁ PREVÁDZKA</span>
            <div>
              <AnimatedPrice value={10} lead="" />
              <b>/ mesiac</b>
              <ArrowUpRight size={20} aria-hidden="true" />
            </div>
            <p>Prevádzka riešenia a základná technická starostlivosť.</p>
          </Link>
        </div>
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
          <a href="#riesenia" className="hybrid-hero__primary site-cta site-cta--primary">
            Vybrať riešenie <ArrowUpRight size={17} />
          </a>
        </div>
      </section>

      <PageNavigator />
      <CoreTools />
      <SelectedWork />

      <section
        className="hybrid-manifesto kage-manifesto"
        aria-labelledby="hybrid-manifesto-title"
        data-nav-tone="light"
      >
        <div className="container-page hybrid-manifesto__inner">
          <span className="section-index">ČO TO ZMENÍ</span>
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
            <Link to="/kontakt" className="hybrid-final__button site-cta site-cta--primary">
              Chcem návrh <ArrowUpRight size={19} />
            </Link>
            <a href="mailto:info@mojchatbot.sk">info@mojchatbot.sk</a>
          </div>
        </div>
      </section>
    </div>
  );
}
