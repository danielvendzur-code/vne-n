import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
        title: "Zákazník sa jednoducho opýta.",
        copy: "Napíše, čo potrebuje – rovnako ako v bežnej správe.",
        artifact: "Dobrý deň, čo by ste mi odporučili?",
      },
      {
        index: "02",
        label: "DOPLNENIE",
        title: "Chatbot doplní, čo chýba.",
        copy: "Spýta sa iba na údaje, bez ktorých neviete dobre poradiť.",
        artifact: "Typ služby / miesto / termín",
      },
      {
        index: "03",
        label: "ODPOVEĎ",
        title: "Dá jasnú odpoveď.",
        copy: "Vysvetlí možnosti podľa vašej ponuky a ukáže ďalší krok.",
        artifact: "Odpoveď / možnosti / ďalší krok",
      },
      {
        index: "04",
        label: "DOPYT",
        title: "Pošle vám pripravený dopyt.",
        copy: "Kontakt príde spolu s tým, čo zákazník rieši a čo už doplnil.",
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
        title: "Zákazník chce vedieť cenu.",
        copy: "Výpočet začne priamo na webe bez telefonátu alebo čakania na ponuku.",
        artifact: "Koľko to bude približne stáť?",
      },
      {
        index: "02",
        label: "ÚDAJE",
        title: "Vyberie, čo cenu mení.",
        copy: "Napríklad rozmer, množstvo, variant, montáž alebo doplnky.",
        artifact: "Rozmer / množstvo / variant",
      },
      {
        index: "03",
        label: "VÝPOČET",
        title: "Web použije vaše pravidlá.",
        copy: "Cenník a podmienky premeníme na výpočet, ktorý zákazník zvládne sám.",
        artifact: "Vaše pravidlá + váš cenník",
      },
      {
        index: "04",
        label: "VÝSLEDOK",
        title: "Ukáže odhad a ďalší krok.",
        copy: "Zákazník vie, s čím približne počítať, a môže rovno odoslať dopyt.",
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
        title: "Zákazník si vyberie, čo chce.",
        copy: "Začne jednoduchým výberom namiesto preklikávania celej ponuky.",
        artifact: "Čo potrebujem?",
      },
      {
        index: "02",
        label: "MOŽNOSTI",
        title: "Vidí len dostupné možnosti.",
        copy: "Rozmery, modely, farby alebo doplnky ukážeme v správnom poradí.",
        artifact: "Len možnosti, ktoré viete dodať",
      },
      {
        index: "03",
        label: "KONTROLA",
        title: "Nevhodné kombinácie sa vyradia.",
        copy: "Zákazník sa nedostane k variante, ktorý sa nedá objednať alebo vyrobiť.",
        artifact: "Kontrola kombinácií",
      },
      {
        index: "04",
        label: "ZOSTAVA",
        title: "Hotovú zostavu pošle vám.",
        copy: "Spolu s kontaktom dostanete presne to, čo si zákazník vybral.",
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
    cta: "Vyskúšať chatbot",
  },
  {
    index: "02",
    name: "Kalkulačka",
    statement: "Vypočíta orientačnú cenu.",
    copy: "Keď cenu mení rozmer, množstvo, model, montáž alebo doplnky.",
    preset: "calculator" as const,
    cta: "Vyskúšať kalkulačku",
  },
  {
    index: "03",
    name: "Konfigurátor",
    statement: "Prevedie zákazníka výberom.",
    copy: "Keď si zákazník skladá riešenie z viacerých dostupných možností.",
    preset: "product" as const,
    cta: "Vyskúšať konfigurátor",
  },
  {
    index: "04",
    name: "Produktový poradca",
    statement: "Pomôže vybrať správny produkt.",
    copy: "Keď má e-shop veľa podobných produktov a zákazník nevie, ktorý je preňho vhodný.",
    preset: "product" as const,
    cta: "Vyskúšať poradcu",
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
      {featuredProjects.map((project, index) => (
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

function FlowStory() {
  const [mode, setMode] = useState<FlowMode>("chatbot");
  const [activeStage, setActiveStage] = useState(0);
  const stages = flowModes[mode].stages;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 96, damping: 30, mass: 0.25 });
  const lineScale = useTransform(progress, [0, 1], [0.03, 1]);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.min(stages.length - 1, Math.round(value * (stages.length - 1)));
    setActiveStage((current) => (current === next ? current : next));
  });

  const stage = stages[activeStage];

  return (
    <section
      ref={ref}
      className="hybrid-flow kage-flow"
      id="ako-to-funguje"
      aria-label="Ako to funguje"
      data-signal-chapter="3"
      data-nav-tone="dark"
    >
      <div className="hybrid-flow__desktop">
        <div className="hybrid-flow__sticky">
          <div className="hybrid-flow__hud container-page">
            <span>AKO TO FUNGUJE</span>
            <div className="kage-flow__hud-right">
              <span className="kage-flow__counter">KROK {activeStage + 1} / 4</span>
              <div className="hybrid-flow__modes" aria-label="Vyberte typ riešenia">
                {(Object.keys(flowModes) as FlowMode[]).map((item) => (
                  <button
                    type="button"
                    key={item}
                    data-active={mode === item}
                    onClick={() => setMode(item)}
                  >
                    {flowModes[item].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="kage-flow__stage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                className="hybrid-flow__panel kage-flow__panel"
                key={`${mode}-${stage.index}`}
                initial={{ opacity: 0, x: "7%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-7%" }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="container-page hybrid-flow__panel-inner">
                  <div className="hybrid-flow__number">{stage.index}</div>
                  <div className="hybrid-flow__copy">
                    <span>{stage.label}</span>
                    <h2>{stage.title}</h2>
                    <p>{stage.copy}</p>
                  </div>
                  <div className="hybrid-flow__artifact" aria-hidden="true">
                    <span>
                      {flowModes[mode].label.toUpperCase()} / {stage.index}
                    </span>
                    <strong>{stage.artifact}</strong>
                    <i>→</i>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="kage-flow__steps" aria-hidden="true">
            {stages.map((item, index) => (
              <i key={item.index} data-active={index <= activeStage || undefined} />
            ))}
          </div>
          <div className="hybrid-flow__progress" aria-hidden="true">
            <motion.i style={{ scaleX: lineScale }} />
          </div>
        </div>
      </div>

      <div className="hybrid-flow__mobile container-page">
        <p className="hybrid-flow__mobile-label">AKO TO FUNGUJE</p>
        <div className="hybrid-flow__mobile-modes" aria-label="Vyberte typ riešenia">
          {(Object.keys(flowModes) as FlowMode[]).map((item) => (
            <button
              type="button"
              key={item}
              data-active={mode === item}
              onClick={() => setMode(item)}
            >
              {flowModes[item].label}
            </button>
          ))}
        </div>
        {stages.map((item) => (
          <article key={`${mode}-${item.index}`}>
            <div className="hybrid-flow__mobile-head">
              <span>{item.index}</span>
              <b>{item.label}</b>
            </div>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
            <strong>{item.artifact}</strong>
          </article>
        ))}
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
          <motion.article
            className="hybrid-project"
            key={project.name}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.7, delay: (index % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="hybrid-project__visual"
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
          </motion.article>
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
          <motion.article
            className="outcome-comparison__group"
            key={group.label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.72, delay: groupIndex * 0.09, ease: [0.16, 1, 0.3, 1] }}
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
          </motion.article>
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
        {process.map(([index, title, copy], itemIndex) => (
          <motion.li
            key={index}
            initial={{ opacity: 0.34, x: -18 }}
            whileInView={{ opacity: 1, x: 0, backgroundColor: "rgba(200, 240, 106, 0.09)" }}
            viewport={{ once: true, amount: 0.58 }}
            transition={{ duration: 0.58, delay: itemIndex * 0.035, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>{index}</span>
            <strong>{title}</strong>
            <p>{copy}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

function AnimatedPrice({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const duration = 1250;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.55 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion, value]);

  return <strong ref={ref}>od {displayValue} €</strong>;
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
          <span>CHATBOT NA MIERU</span>
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
          <strong>10 €</strong>
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
          <p>Chatboty, kalkulačky a konfigurátory na mieru.</p>
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
            Web môže <em>odpovedať.</em> Môže <em>vypočítať cenu.</em> Môže{" "}
            <em>pomôcť s výberom.</em>
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
