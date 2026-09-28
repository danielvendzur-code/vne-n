import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Calculator,
  Check,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { faqs } from "@/data/faq";
import { realizations } from "@/data/realizations";
import { configuratorShots, KOVERTA_LIVE_CONFIGURATOR } from "@/data/configurator";
import { openSiteAssistant } from "@/lib/site-assistant";
import { useReveal } from "@/hooks/useReveal";
import "./StudioHome.css";

const BASE = import.meta.env.BASE_URL;

const facts = [
  {
    value: "1 deň",
    label: "Ozveme sa s ďalším krokom",
    note: "Po odoslaní zadania, v pracovný deň.",
  },
  { value: "od 347 €", label: "Chatbot alebo poradca", note: "Návrh, obsah, logika a nasadenie." },
  {
    value: "od 447 €",
    label: "Kalkulačka alebo konfigurátor",
    note: "Postavené na vašich pravidlách.",
  },
  { value: "Ukážka", label: "Vyskúšate si ju vopred", note: "Na web ide až to, čo schválite." },
] as const;

const process = [
  [
    "01",
    "Ukážete nám web a ponuku",
    "Zistíme, čo zákazníci najčastejšie hľadajú, riešia a pýtajú sa.",
  ],
  [
    "02",
    "Navrhneme postup",
    "Určíme, čo má zákazník vidieť, vybrať alebo vyplniť — a čo dostanete vy.",
  ],
  ["03", "Postavíme a otestujeme", "Dizajn, logika, ceny aj napojenia. Na počítači aj na mobile."],
  [
    "04",
    "Nasadíme na váš web",
    "Bez prerábania celého webu. Overíme dopyty, formuláre aj bežné používanie.",
  ],
] as const;

const prices = [
  {
    tag: "Chatbot · produktový poradca",
    value: 347,
    lead: "od ",
    unit: "",
    copy: "Návrh, dizajn, obsah, logika a nasadenie na web.",
  },
  {
    tag: "Kalkulačka · konfigurátor",
    value: 447,
    lead: "od ",
    unit: "",
    copy: "Výpočet alebo výber postavený na vašich pravidlách a ponuke.",
  },
  {
    tag: "Technická prevádzka",
    value: 10,
    lead: "od ",
    unit: "/ mesiac",
    copy: "Hosting riešenia a základná technická starostlivosť.",
  },
] as const;

/* ---------------------------------------------------------------- helpers */

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p className="sh-eyebrow" data-tone={tone}>
      <i aria-hidden="true" />
      {children}
    </p>
  );
}

/**
 * Counts up once when the number enters the viewport. The real value is
 * rendered on the server and stays in place for crawlers, screenshots and
 * visitors with reduced motion.
 */
function CountUp({
  value,
  lead = "",
  suffix = " €",
}: {
  value: number;
  lead?: string;
  suffix?: string;
}) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 1100);
          const eased = 1 - Math.pow(1 - progress, 4);
          setShown(progress >= 1 ? value : Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="sh-count">
      {`${lead}${shown}${suffix}`}
    </span>
  );
}

/* ------------------------------------------------------------------- hero */

/* Pôvodný hero: vypisovaný nadpis a tri prekrývajúce sa náhľady živých webov.
   Triedy `hybrid-hero` a `kage-hero` nesú jeho schválený vzhľad aj tmavé
   prispôsobenie hlavičky. */
const heroProjects = [
  {
    slug: "koverta",
    name: "Koverta",
    href: "https://koverta.sk/",
    image: `${BASE}work/live/koverta.webp`,
    alt: "Domovská stránka Koverta s pergolou nad terasou",
  },
  {
    slug: "derat",
    name: "DERAT",
    href: "https://derat.sk/",
    image: `${BASE}work/live/derat.webp`,
    alt: "Domovská stránka DERAT s nadpisom Bez škodcov",
  },
  {
    slug: "mojplot",
    name: "Môj Plot",
    href: "https://mojplot.sk/",
    image: `${BASE}work/live/mojplot.webp`,
    alt: "Domovská stránka Môj Plot s kategóriami plotov",
  },
] as const;

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
            {wordIndex < words.length - 1 ? (
              <span className="typed-space" aria-hidden="true">
                {" "}
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

function Hero() {
  return (
    <section
      className="hybrid-hero kage-hero"
      aria-labelledby="hybrid-hero-title"
      data-signal-chapter="0"
      data-nav-tone="dark"
    >
      <div className="container-page hybrid-hero__stage">
        <h1 id="hybrid-hero-title" aria-label="Chatboty a konfigurátory na mieru pre váš web.">
          <TypedLine text="Chatboty a" startAt={0} />
          <em>
            <TypedLine text="konfigurátory" startAt={10} />
          </em>
          <em>
            <TypedLine text="na mieru." startAt={23} />
          </em>
        </h1>
        <div className="hybrid-hero__collage" aria-label="Vybrané živé realizácie">
          {heroProjects.map((project, index) => (
            <a
              key={project.slug}
              className={`hybrid-hero__case hybrid-hero__case--${index + 1}`}
              href={project.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className={`project-composite project-composite--${project.slug}`}>
                <img
                  className="project-composite__site"
                  src={project.image}
                  alt={project.alt}
                  width={1600}
                  height={1000}
                  loading="eager"
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </span>
              <span>
                0{index + 1} / {project.name}
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="container-page hybrid-hero__bottom kage-hero__bottom">
        <p>
          Chatbot odpovie, kalkulačka spočíta cenu, konfigurátor vyskladá produkt a produktový
          poradca pomôže s výberom.
        </p>
        <a href="#riesenia" className="hybrid-hero__primary site-cta site-cta--primary">
          Vybrať riešenie <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ facts */

function Facts() {
  return (
    <section className="sh-facts" aria-label="Základné fakty" data-nav-tone="light">
      <div className="sh-wrap">
        <ul className="sh-facts__card">
          {facts.map((fact, index) => (
            <li key={fact.label} data-reveal style={{ "--d": index } as CSSProperties}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
              <small>{fact.note}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- solutions */

/* Skutočné zábery nástrojov, ktoré bežia na weboch klientov. Kávový poradca
   je zámerne bez loga a názvu značky. */
const solutionShots = {
  calculator: {
    src: `${BASE}work/solutions/kalkulacka-derat.webp`,
    width: 600,
    height: 749,
  },
  chatbot: {
    src: `${BASE}work/solutions/chatbot-aplan.webp`,
    width: 640,
    height: 1101,
  },
  advisor: {
    src: `${BASE}work/solutions/poradca-kava.webp`,
    width: 640,
    height: 1116,
  },
} as const;

const combinations = [
  {
    title: "Chatbot + kalkulačka",
    copy: "Odpovie na otázky a rovno spočíta cenu.",
    preset: "calculator" as const,
  },
  {
    title: "Chatbot + konfigurátor",
    copy: "Vysvetlí možnosti a prevedie celým výberom.",
    preset: "product" as const,
  },
  {
    title: "Chatbot + poradca",
    copy: "Zistí potreby a odporučí konkrétny produkt.",
    preset: "advisor" as const,
  },
  {
    title: "Všetko spolu",
    copy: "Chatbot, kalkulačka, konfigurátor aj poradca v jednom nástroji.",
    preset: undefined,
  },
];

const tools = [
  {
    key: "configurator",
    title: "3D konfigurátor",
    copy: "Produkt si zákazník poskladá v 3D, cena sa prepočíta hneď.",
    icon: Box,
    image: `${BASE}work/koverta/model-porsche.webp`,
    alt: "3D model prístrešku s drevenými lamelami a športovým autom z konfigurátora Koverta",
    wide: true,
    cta: "Pozrieť 3D konfigurátor",
    to: "/3d-konfigurator" as const,
    preset: undefined,
  },
  {
    key: "calculator",
    title: "Cenová kalkulačka",
    copy: "Z rozmeru, množstva či doplnkov spočíta orientačnú cenu.",
    icon: Calculator,
    image: solutionShots.calculator.src,
    alt: "Kalkulačka DERAT: výber priestoru a orientačná cena 60 € bez DPH",
    wide: false,
    cta: "Vyskladať kalkulačku",
    to: undefined,
    preset: "calculator" as const,
  },
  {
    key: "chatbot",
    title: "Chatbot",
    copy: "Odpovedá z vašich podkladov a pošle vám kontakt so zhrnutím.",
    icon: MessageSquare,
    image: solutionShots.chatbot.src,
    alt: "Chatbot pre architektonickú kanceláriu: postup ohlásenia drobnej stavby",
    wide: false,
    cta: "Vyskladať chatbota",
    to: undefined,
    preset: "advisor" as const,
  },
  {
    key: "advisor",
    title: "Produktový poradca",
    copy: "Pár otázok a zákazník dostane konkrétny produkt z ponuky.",
    icon: Sparkles,
    image: solutionShots.advisor.src,
    alt: "Produktový poradca pre e-shop s kávou: výber chuti cez štyri otázky",
    wide: false,
    cta: "Vyskladať poradcu",
    to: undefined,
    preset: "product" as const,
  },
];

function Solutions() {
  return (
    <section
      className="sh-section sh-solutions"
      id="riesenia"
      aria-labelledby="sh-solutions-title"
      data-nav-tone="light"
    >
      <div className="sh-wrap">
        <header className="sh-head sh-head--row" data-reveal>
          <div>
            <Eyebrow>Riešenia</Eyebrow>
            <h2 id="sh-solutions-title">Aké riešenie potrebujete?</h2>
          </div>
          <p>Každý nástroj funguje samostatne, v kombinácii aj všetky spolu v jednom.</p>
        </header>

        <div className="sh-tools">
          {tools.map((tool, index) => (
            <article
              className="sh-tool"
              data-kind={tool.key}
              key={tool.key}
              data-reveal
              style={{ "--d": index } as CSSProperties}
            >
              <div className="sh-tool__media" data-wide={tool.wide || undefined}>
                <img src={tool.image} alt={tool.alt} loading="lazy" decoding="async" />
              </div>
              <div className="sh-tool__body">
                <h3>
                  <tool.icon size={18} aria-hidden="true" />
                  {tool.title}
                </h3>
                <p>{tool.copy}</p>
                {tool.to ? (
                  <Link to={tool.to} className="sh-btn sh-btn--dark sh-btn--sm">
                    {tool.cta} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="sh-btn sh-btn--dark sh-btn--sm"
                    onClick={() =>
                      openSiteAssistant({ source: `home-${tool.key}`, preset: tool.preset })
                    }
                  >
                    {tool.cta} <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="sh-combo" data-reveal>
          <div className="sh-combo__intro">
            <h3>Nemusí to byť iba jedno riešenie.</h3>
            <p>Nástroje spojíme po dvoch aj všetky naraz.</p>
          </div>
          <ul className="sh-combo__list">
            {combinations.map((item, index) => (
              <li key={item.title} data-all={item.preset ? undefined : "true"}>
                <button
                  type="button"
                  onClick={() =>
                    openSiteAssistant({ source: `home-combo-${index + 1}`, preset: item.preset })
                  }
                >
                  <strong>{item.title}</strong>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="sh-combo__unsure"
            onClick={() => openSiteAssistant({ source: "home-unsure" })}
          >
            Neviete, čo z toho? <span>Spustiť výber</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ flow story */

type FlowMode = "chatbot" | "calculator" | "configurator" | "combined";

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
  combined: {
    label: "Všetko spolu",
    stages: [
      {
        index: "01",
        label: "OTÁZKA",
        title: "Chatbot odpovie a zistí, čo zákazník hľadá.",
        copy: "Poradí z vašich podkladov a hneď pozná rozmer, použitie aj rozpočet.",
        artifact: "Chatbot + vaše podklady",
      },
      {
        index: "02",
        label: "VÝBER",
        title: "Poradca alebo konfigurátor zúži ponuku.",
        copy: "Zákazník si vyberie produkt alebo poskladá zostavu — aj v 3D.",
        artifact: "Poradca / 3D konfigurátor",
      },
      {
        index: "03",
        label: "CENA",
        title: "Kalkulačka spočíta cenu celej zostavy.",
        copy: "S montážou, dopravou aj doplnkami podľa vášho cenníka.",
        artifact: "Kalkulačka + váš cenník",
      },
      {
        index: "04",
        label: "DOPYT",
        title: "Všetko príde naraz v jednom dopyte.",
        copy: "Otázky, výber, zostava, cena aj kontakt. Nič sa nedopisuje telefonicky.",
        artifact: "Jeden kompletný dopyt",
      },
    ],
  },
};

function presetForMode(mode: FlowMode): "advisor" | "calculator" | "product" | undefined {
  if (mode === "calculator") return "calculator";
  if (mode === "configurator") return "product";
  if (mode === "combined") return undefined;
  return "advisor";
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

      const footerReveal = Math.min(1, Math.max(0, (progress - 0.7) / 0.14));

      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      section.style.setProperty("--flow-progress", String(progress));
      section.style.setProperty("--flow-footer-reveal", String(footerReveal));
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
      section.style.removeProperty("--flow-footer-reveal");
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
        <div className="container-page kage-flow-story__toolbar">
          <h2 id="kage-flow-story-title" className="kage-flow-story__sr-title">
            Ako sa návštevník dostane k výsledku.
          </h2>
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
          <p>Nástroje fungujú samostatne, v kombinácii aj všetky spolu.</p>
          <button
            type="button"
            className="kage-flow-story__cta site-cta site-cta--primary"
            onClick={() => openSiteAssistant({ source: "flow-story", preset: presetForMode(mode) })}
          >
            Vyskladať toto riešenie <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- configurator */

export function ConfiguratorShowcase({ onCaseStudy = false }: { onCaseStudy?: boolean }) {
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const shot = configuratorShots[active];

  return (
    <section
      className="sh-section sh-config"
      id="konfigurator"
      aria-labelledby="sh-config-title"
      data-live={live || undefined}
      data-nav-tone="dark"
    >
      <div className="sh-wrap sh-config__grid">
        <div className="sh-config__copy" data-reveal>
          <Eyebrow tone="dark">{onCaseStudy ? "Živá ukážka" : "Realizácia · Koverta"}</Eyebrow>
          <h2 id="sh-config-title">
            {onCaseStudy ? "Vyskúšajte si ho " : "Prístrešok si zákazník "}
            <em>{onCaseStudy ? "priamo tu." : "poskladá v 3D."}</em>
          </h2>
          <p>
            Pre Kovertu sme postavili konfigurátor prístreškov a pergol. Každá voľba sa hneď prepíše
            do 3D modelu aj do orientačnej ceny. Firma dostane dopyt, v ktorom už je všetko
            podstatné.
          </p>
          <ol className="sh-steps">
            <li>
              <b>01</b>
              <span>
                <strong>Vyberie typ a umiestnenie</strong>
                Samostatne, pri stene alebo v rohu.
              </span>
            </li>
            <li>
              <b>02</b>
              <span>
                <strong>Nastaví rozmer, farbu a strechu</strong>
                Model aj cena sa menia okamžite.
              </span>
            </li>
            <li>
              <b>03</b>
              <span>
                <strong>Pošle dopyt so zostavou</strong>
                Bez prepisovania rozmerov do e-mailu.
              </span>
            </li>
          </ol>
          <div className="sh-config__actions">
            {onCaseStudy ? (
              <Link to="/kontakt" className="sh-btn sh-btn--lime">
                Chcem podobný konfigurátor <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ) : (
              <Link to="/3d-konfigurator" className="sh-btn sh-btn--lime">
                Celá prípadová štúdia <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
            <a
              href="https://koverta.sk/pages/konfigurator"
              target="_blank"
              rel="noreferrer"
              className="sh-link"
            >
              Otvoriť na koverta.sk <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="sh-config__stage" data-reveal style={{ "--d": 1 } as CSSProperties}>
          <div className="sh-tabs" role="tablist" aria-label="Typ konštrukcie">
            {configuratorShots.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                data-active={index === active}
                onClick={() => {
                  setActive(index);
                  setLive(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="sh-config__frame">
            {live ? (
              <iframe
                src={`${KOVERTA_LIVE_CONFIGURATOR}?page=${shot.page}`}
                title={`Živý 3D konfigurátor Koverta — ${shot.label}`}
                loading="lazy"
                allow="fullscreen"
              />
            ) : (
              <>
                {configuratorShots.map((item, index) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.alt}
                    width={1600}
                    height={841}
                    loading="lazy"
                    decoding="async"
                    data-active={index === active}
                  />
                ))}
                <button type="button" className="sh-play" onClick={() => setLive(true)}>
                  <span aria-hidden="true" />
                  Spustiť živý konfigurátor
                </button>
              </>
            )}
          </div>
          {live ? (
            <a
              className="sh-config__note sh-link"
              href={`${KOVERTA_LIVE_CONFIGURATOR}?page=${shot.page}`}
              target="_blank"
              rel="noreferrer"
            >
              Otvoriť na celej obrazovke <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- work */

/* Realizácie ako zoznam s náhľadom, ktorý sleduje kurzor — typický vzor
   ocenených štúdií. Na dotykových zariadeniach je obrázok priamo v riadku. */
/* Realizácie ako karty, ktoré sa pri scrollovaní ukladajú na seba. */
function Work() {
  return (
    <section
      className="sh-section sh-work"
      data-nav-tone="light"
      id="realizacie"
      aria-labelledby="sh-work-title"
    >
      <div className="sh-wrap">
        <header className="sh-head sh-head--row" data-reveal>
          <div>
            <Eyebrow>Realizácie</Eyebrow>
            <h2 id="sh-work-title">Hotové projekty, ktoré bežia naživo</h2>
          </div>
          <Link to="/projekty" className="sh-link sh-link--dark">
            Všetky realizácie <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <ol className="sh-cases">
          {realizations.map((project, index) => (
            <li
              key={project.name}
              className="sh-case"
              style={{ "--i": index } as CSSProperties}
              data-tone={index % 2 ? "light" : "dark"}
            >
              <article className="sh-case__card">
                <div className="sh-case__copy">
                  <span className="sh-case__index">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(realizations.length).padStart(2, "0")}
                  </span>
                  <h3>{project.name}</h3>
                  <p>{project.result}</p>
                  <ul className="sh-case__tags" aria-label="Čo sme dodali">
                    {project.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                  <div className="sh-case__links">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="sh-btn sh-btn--lime"
                    >
                      {project.domain} <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                    {project.caseStudyPath ? (
                      <Link to={project.caseStudyPath} className="sh-link">
                        Ako to funguje <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    ) : null}
                  </div>
                </div>
                <a
                  className="sh-case__shot"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Otvoriť web"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <span className="sh-case__bar">
                    <i />
                    <i />
                    <i />
                    <em>{project.domain}</em>
                  </span>
                  <img
                    src={project.image}
                    alt=""
                    width={1600}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- before/after */

/* Porovnanie toho, čo firme reálne príde: bez nástroja všeobecná otázka,
   s kalkulačkou hotový dopyt, na ktorý sa dá hneď odpovedať ponukou. */
const vagueQuestions = ["Aký priestor?", "Koľko metrov?", "Aký škodca?", "Kedy a kde?"];

const inquiryRows = [
  ["Služba", "Deratizácia"],
  ["Priestor", "Byt v bytovom dome"],
  ["Rozloha", "60 m²"],
  ["Lokalita", "Nitra"],
  ["Orientačná cena", "od 60 € bez DPH"],
  ["Kontakt", "Ján · 0905 …"],
] as const;

function BeforeAfter() {
  return (
    <section className="sh-section sh-compare" data-nav-tone="light" aria-labelledby="sh-ba-title">
      <div className="sh-wrap">
        <header className="sh-head sh-head--row" data-reveal>
          <div>
            <Eyebrow>Pred a po</Eyebrow>
            <h2 id="sh-ba-title">Rovnaký zákazník. Úplne iný dopyt.</h2>
          </div>
          <p>Takto vyzerá správa, ktorá firme príde bez nástroja a s kalkulačkou na webe.</p>
        </header>

        <div className="sh-compare__grid">
          <article className="sh-compare__card sh-compare__card--before" data-reveal>
            <header>
              <span className="sh-compare__label">Bez nástroja</span>
              <small>E-mail z kontaktného formulára</small>
            </header>
            <div className="sh-compare__mail">
              <span>Od: jan.k…@gmail.com</span>
              <span>Predmet: Otázka</span>
              <p>Dobrý deň, koľko by stála deratizácia? Ďakujem.</p>
            </div>
            <div className="sh-compare__missing">
              <small>Než pošlete cenu, musíte sa spýtať:</small>
              <ul>
                {vagueQuestions.map((question, index) => (
                  <li key={question} style={{ "--o": index } as CSSProperties}>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
            <footer>
              <strong>Ďalšie e-maily a telefonáty</strong>
              <span>Zákazník medzitým často píše aj konkurencii.</span>
            </footer>
          </article>

          <div className="sh-compare__arrow" aria-hidden="true">
            <ArrowRight size={22} />
          </div>

          <article className="sh-compare__card sh-compare__card--after" data-reveal>
            <header>
              <span className="sh-compare__label">S kalkulačkou</span>
              <small>Dopyt z kalkulačky na derat.sk</small>
            </header>
            <dl className="sh-compare__rows">
              {inquiryRows.map(([label, value], index) => (
                <div key={label} style={{ "--o": index } as CSSProperties}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <footer>
              <strong>Môžete rovno poslať ponuku</strong>
              <span>Zákazník už pozná orientačnú cenu, vy poznáte rozsah práce.</span>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- process */

/* Interaktívny postup: horná os krokov sa sama posúva (dá sa na ňu kliknúť),
   pod ňou je popis kroku, jeho výstup a skutočný záber. Nič sa neprekrýva. */
const processScenes = [
  {
    image: `${BASE}work/live/mojplot.webp`,
    alt: "Web Môj Plot ako východisko pre chatbota a kalkulačku",
    kind: "project",
    focus: "overview",
    visualKicker: "Príklad: Môj Plot",
    visualTitle: "Jeden web, chatbot aj kalkulačka",
    visualCopy: "Na jednom projekte ukazujeme celý postup od zadania po spustenie.",
    output: ["Sortiment a časté otázky", "Výpočet ceny plotu", "Kam má smerovať dopyt"],
    outputTitle: "Výstup: jasné zadanie",
    time: "1 hovor alebo e-mail",
  },
  {
    image: `${BASE}work/live/mojplot.webp`,
    alt: "Web Môj Plot pri návrhu logiky chatbota a kalkulačky",
    kind: "project",
    focus: "chatbot",
    visualKicker: "Môj Plot / návrh",
    visualTitle: "Chatbot odpovedá, kalkulačka počíta",
    visualCopy: "Navrhneme otázky, pravidlá a ďalší krok tak, aby spolu tvorili jeden tok.",
    output: [
      "Chatbot: otázky a odpovede",
      "Kalkulačka: dĺžka, výška, doplnky",
      "Kontakt a ďalší krok",
    ],
    outputTitle: "Výstup: návrh logiky",
    time: "Návrh na schválenie",
  },
  {
    image: `${BASE}work/live/mojplot.webp`,
    alt: "Web Môj Plot počas testovania nástroja na počítači a mobile",
    kind: "project",
    focus: "calculator",
    visualKicker: "Môj Plot / test",
    visualTitle: "Celé riešenie sa skúša ako jeden produkt",
    visualCopy: "Kontrolujeme odpovede, výpočet, formulár aj správanie na mobile.",
    output: ["Počítač aj mobil", "Výpočet a formulár", "Jasný ďalší krok"],
    outputTitle: "Výstup: otestovaná ukážka",
    time: "Vyskúšate si ju vopred",
  },
  {
    image: `${BASE}work/live/mojplot.webp`,
    alt: "Nasadený web Môj Plot s chatbotom a kalkulačkou",
    kind: "project",
    focus: "live",
    visualKicker: "Môj Plot / nasadené",
    visualTitle: "Chatbot aj kalkulačka fungujú na jednom webe",
    visualCopy: "Zákazník dostane pomoc priamo na stránke a firma dostane pripravený dopyt.",
    output: ["Chatbot na webe", "Kalkulačka na webe", "Dopyty smerujú firme"],
    outputTitle: "Výstup: spustené riešenie",
    time: "Bez prerábania celého webu",
  },
] as const;

const PROCESS_STEP_MS = 5200;

function Process() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % process.length),
      PROCESS_STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, inView]);

  const scene = processScenes[active];
  const [number, title, copy] = process[active];

  return (
    <section
      ref={sectionRef}
      className="sh-section sh-process"
      data-nav-tone="light"
      id="proces"
      aria-labelledby="sh-process-title"
    >
      <div className="sh-wrap">
        <header className="sh-head sh-head--row" data-reveal>
          <div>
            <Eyebrow>Ako to prebieha</Eyebrow>
            <h2 id="sh-process-title">Ako vzniká chatbot, kalkulačka alebo konfigurátor</h2>
          </div>
          <Link to="/postup" className="sh-link sh-link--dark">
            Celý postup <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>

        <div
          className="sh-howto"
          data-running={inView ? "true" : "false"}
          style={{ "--process-step-ms": `${PROCESS_STEP_MS}ms` } as CSSProperties}
          data-reveal
        >
          <ol className="sh-howto__rail" role="tablist" aria-label="Kroky spolupráce">
            {process.map(([index, stepTitle], order) => (
              <li key={index}>
                <button
                  type="button"
                  role="tab"
                  id={`sh-howto-${index}`}
                  aria-selected={order === active}
                  aria-controls="sh-howto-panel"
                  data-active={order === active}
                  data-done={order < active || undefined}
                  onClick={() => setActive(order)}
                >
                  <b>{index}</b>
                  <strong>{stepTitle}</strong>
                  <i aria-hidden="true" key={order === active ? `run-${active}` : "idle"} />
                </button>
              </li>
            ))}
          </ol>

          <div
            className="sh-howto__stage"
            role="tabpanel"
            id="sh-howto-panel"
            aria-labelledby={`sh-howto-${number}`}
          >
            <div className="sh-howto__copy" key={`copy-${active}`}>
              <span className="sh-howto__num" aria-hidden="true">
                {number}
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <div className="sh-howto__out">
                <span>{scene.outputTitle}</span>
                <ul>
                  {scene.output.map((item, index) => (
                    <li key={item} style={{ "--o": index } as CSSProperties}>
                      <Check size={15} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <small className="sh-howto__time">{scene.time}</small>
            </div>
            <figure
              className="sh-howto__shot"
              data-kind={scene.kind}
              data-focus={scene.focus}
              key={`shot-${active}`}
            >
              <img src={scene.image} alt={scene.alt} loading="lazy" decoding="async" />
              <figcaption className="sh-howto__visual-note">
                <span>{scene.visualKicker}</span>
                <strong>{scene.visualTitle}</strong>
                <small>{scene.visualCopy}</small>
                <div aria-label="Riešenia v projekte">
                  <b>Chatbot</b>
                  <b>Kalkulačka</b>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pricing */

function Pricing() {
  return (
    <section
      className="sh-section sh-price"
      data-nav-tone="dark"
      id="cena"
      aria-labelledby="sh-price-title"
    >
      <div className="sh-wrap">
        <header className="sh-head sh-head--row" data-reveal>
          <div>
            <Eyebrow tone="dark">Cenník</Eyebrow>
            <h2 id="sh-price-title">
              Jasná cena <em>ešte pred začiatkom.</em>
            </h2>
          </div>
          <p>Presný rozsah si odsúhlasíme vopred. Ponuka uvedie základ, DPH aj celkovú sumu.</p>
        </header>
        <div className="sh-price__grid">
          {prices.map((price, index) => (
            <Link
              to="/cennik"
              key={price.tag}
              className="sh-price__card"
              data-reveal
              style={{ "--d": index } as CSSProperties}
            >
              <span>{price.tag}</span>
              <strong>
                <CountUp value={price.value} lead={price.lead} />
                {price.unit ? <small>{price.unit}</small> : null}
              </strong>
              <p>{price.copy}</p>
              <i aria-hidden="true">
                <ArrowUpRight size={18} />
              </i>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- faq */

function Faq() {
  return (
    <section
      className="sh-section sh-faq"
      data-nav-tone="light"
      id="otazky"
      aria-labelledby="sh-faq-title"
    >
      <div className="sh-wrap sh-faq__grid">
        <header className="sh-head" data-reveal>
          <Eyebrow>Časté otázky</Eyebrow>
          <h2 id="sh-faq-title">Čo sa nás pýtate najčastejšie</h2>
          <p>
            Nenašli ste odpoveď? Napíšte na{" "}
            <a href="mailto:info@mojchatbot.sk">info@mojchatbot.sk</a>.
          </p>
        </header>
        <div className="sh-faq__list">
          {faqs.map((faq, index) => (
            <details key={faq.q} data-reveal style={{ "--d": index % 3 } as CSSProperties}>
              <summary>
                {faq.q}
                <i aria-hidden="true" />
              </summary>
              <div>
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StudioHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="hybrid-home kage-home sh" ref={rootRef}>
      <Hero />
      <Facts />
      <Solutions />
      <BeforeAfter />
      <FlowStory />
      <ConfiguratorShowcase />
      <Work />
      <Process />
      <Pricing />
      <Faq />
    </div>
  );
}
