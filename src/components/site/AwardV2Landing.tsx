import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { liveTools, realizations } from "@/data/realizations";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./AwardV2Landing.css";

type FlowMode = "chatbot" | "calculator" | "configurator";

type FlowStage = {
  index: string;
  label: string;
  title: string;
  copy: string;
  artifact: string;
};

const chapters = [
  { index: "01", label: "Úvod", tone: "dark" },
  { index: "02", label: "Riešenia", tone: "light" },
  { index: "03", label: "Realizácie", tone: "light" },
  { index: "04", label: "Ako to funguje", tone: "dark" },
  { index: "05", label: "Ukážky", tone: "dark" },
  { index: "06", label: "Cena", tone: "light" },
] as const;

const solutions = [
  {
    index: "01",
    name: "Chatbot",
    title: "Odpovie a pripraví dopyt.",
    copy: "Pre weby, kde sa zákazníci často pýtajú na služby, možnosti alebo ďalší postup.",
    cta: "Vyskúšať chatbot",
    preset: "inquiry" as const,
  },
  {
    index: "02",
    name: "Kalkulačka",
    title: "Ukáže orientačnú cenu.",
    copy: "Pre ponuky, kde cenu mení rozmer, množstvo, model, montáž alebo doplnky.",
    cta: "Vyskúšať kalkulačku",
    preset: "calculator" as const,
  },
  {
    index: "03",
    name: "Konfigurátor",
    title: "Prevedie zákazníka výberom.",
    copy: "Pre ponuky s viacerými variantmi, rozmermi, farbami alebo doplnkami.",
    cta: "Vyskúšať konfigurátor",
    preset: "product" as const,
  },
  {
    index: "04",
    name: "Produktový poradca",
    title: "Pomôže vybrať správny produkt.",
    copy: "Pre e-shopy, kde má zákazník veľa podobných možností a nevie, ktorú zvoliť.",
    cta: "Vyskúšať poradcu",
    preset: "advisor" as const,
  },
];

const flowModes: Record<FlowMode, { label: string; stages: FlowStage[] }> = {
  chatbot: {
    label: "Chatbot",
    stages: [
      {
        index: "01",
        label: "OTÁZKA",
        title: "Zákazník napíše, čo potrebuje.",
        copy: "Nemusí hľadať správnu podstránku ani formulár.",
        artifact: "„Potrebujem poradiť s výberom.“",
      },
      {
        index: "02",
        label: "DOPLNENIE",
        title: "Chatbot si vypýta len podstatné údaje.",
        copy: "Spýta sa iba na to, čo mení odpoveď alebo ďalší krok.",
        artifact: "Typ služby · miesto · termín",
      },
      {
        index: "03",
        label: "ODPOVEĎ",
        title: "Zákazník dostane jasnú odpoveď.",
        copy: "Podľa vašej ponuky vysvetlí možnosti a odporučí ďalší krok.",
        artifact: "Odpoveď · možnosti · ďalší krok",
      },
      {
        index: "04",
        label: "DOPYT",
        title: "Vy dostanete pripravený dopyt.",
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
        copy: "Výpočet začne priamo na webe bez telefonátu alebo čakania.",
        artifact: "„Koľko to bude približne stáť?“",
      },
      {
        index: "02",
        label: "ÚDAJE",
        title: "Vyberie, čo cenu mení.",
        copy: "Napríklad rozmer, množstvo, variant, montáž alebo doplnky.",
        artifact: "Rozmer · množstvo · variant",
      },
      {
        index: "03",
        label: "VÝPOČET",
        title: "Web použije vaše pravidlá.",
        copy: "Cenník a podmienky premeníme na jednoduchý výpočet.",
        artifact: "Vaše pravidlá + váš cenník",
      },
      {
        index: "04",
        label: "VÝSLEDOK",
        title: "Ukáže odhad a ďalší krok.",
        copy: "Zákazník vidí orientačnú cenu a môže rovno poslať dopyt.",
        artifact: "Odhad ceny + dopyt",
      },
    ],
  },
  configurator: {
    label: "Konfigurátor",
    stages: [
      {
        index: "01",
        label: "VÝBER",
        title: "Zákazník začne jednoduchou voľbou.",
        copy: "Namiesto preklikávania celej ponuky odpovie na prvú otázku.",
        artifact: "Čo potrebujem?",
      },
      {
        index: "02",
        label: "MOŽNOSTI",
        title: "Vidí iba dostupné možnosti.",
        copy: "Modely, rozmery, farby a doplnky ukážeme v správnom poradí.",
        artifact: "Model · rozmer · farba · doplnky",
      },
      {
        index: "03",
        label: "KONTROLA",
        title: "Nevhodné kombinácie sa vyradia.",
        copy: "Zákazník sa nedostane k variante, ktorý neviete dodať.",
        artifact: "Iba reálne kombinácie",
      },
      {
        index: "04",
        label: "ZOSTAVA",
        title: "Hotovú zostavu pošle vám.",
        copy: "Spolu s kontaktom dostanete presne to, čo si vybral.",
        artifact: "Zostava + kontakt",
      },
    ],
  },
};

const process = [
  ["01", "Prejdeme si váš web", "Pozrieme sa, čo zákazníci potrebujú vedieť pred objednávkou."],
  ["02", "Navrhneme riešenie", "Vyberieme najkratší postup, ktorý dáva zmysel pre vašu ponuku."],
  [
    "03",
    "Vytvoríme a otestujeme",
    "Dizajn, logiku aj formuláre skontrolujeme na počítači aj mobile.",
  ],
  ["04", "Nasadíme na web", "Po odsúhlasení riešenie spustíme a zostaneme k dispozícii na úpravy."],
] as const;

function HeroChatPreview() {
  return (
    <div className="award2-hero-chat" aria-hidden="true">
      <div className="award2-hero-chat__head">
        <BrandMark size={22} />
        <span>Môj Chatbot</span>
        <i>online</i>
      </div>
      <div className="award2-hero-chat__message">Dobrý deň. Čo potrebujete vyriešiť?</div>
      <div className="award2-hero-chat__choices">
        <span>Chcem cenu</span>
        <span>Potrebujem poradiť</span>
      </div>
    </div>
  );
}

function HeroCollage() {
  const projects = useMemo(() => {
    const wanted = ["Koverta", "DERAT", "Môj Plot"];
    return wanted
      .map((name) => realizations.find((project) => project.name === name))
      .filter((project): project is (typeof realizations)[number] => Boolean(project));
  }, []);

  return (
    <div className="award2-hero__collage" aria-label="Vybrané živé realizácie">
      {projects.map((project, index) => (
        <a
          key={project.name}
          className={`award2-hero-card award2-hero-card--${index + 1}`}
          href={project.href}
          target="_blank"
          rel="noreferrer"
        >
          <img src={project.image} alt={project.alt} decoding="async" fetchPriority="high" />
          <span className="award2-hero-card__label">
            0{index + 1} / {project.name}
          </span>
          {index === 0 ? (
            <>
              <span className="award2-hero-card__live">ŽIVÝ CHATBOT</span>
              <HeroChatPreview />
            </>
          ) : null}
        </a>
      ))}
    </div>
  );
}

function ContinuousGuide() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 82, damping: 24, mass: 0.28 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    ref.current?.style.setProperty(
      "--guide-progress",
      `${Math.max(0, Math.min(100, value * 100))}%`,
    );
  });

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-award-chapter]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.awardChapter ?? 0);
        setActive(Math.max(0, Math.min(chapters.length - 1, index)));
      },
      { rootMargin: "-34% 0px -48% 0px", threshold: [0, 0.08, 0.24, 0.5] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 10;
      const y = (event.clientY / window.innerHeight - 0.5) * 10;
      ref.current?.style.setProperty("--guide-glare-x", `${x}px`);
      ref.current?.style.setProperty("--guide-glare-y", `${y}px`);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <aside ref={ref} className="award2-guide" data-tone={chapters[active].tone} aria-hidden="true">
      <svg viewBox="0 0 90 640" preserveAspectRatio="none">
        <path
          className="award2-guide__base"
          d="M46 4 C10 58 78 98 36 148 C6 194 78 236 34 286 C8 332 76 374 32 420 C6 466 78 510 38 552 C14 588 66 610 42 636"
        />
        <motion.path
          className="award2-guide__active"
          d="M46 4 C10 58 78 98 36 148 C6 194 78 236 34 286 C8 332 76 374 32 420 C6 466 78 510 38 552 C14 588 66 610 42 636"
          style={{ pathLength: progress }}
        />
      </svg>
      <div className="award2-guide__traveler">
        <span className="award2-guide__glare" />
        <b>{chapters[active].index}</b>
        <small>{chapters[active].label}</small>
      </div>
    </aside>
  );
}

function CoreTools() {
  return (
    <section
      className="award2-tools"
      id="riesenia"
      aria-labelledby="award2-tools-title"
      data-award-chapter="1"
    >
      <div className="container-page award2-section-head">
        <span>RIEŠENIA</span>
        <h2 id="award2-tools-title">Čo má váš web robiť?</h2>
      </div>
      <div className="award2-tools__list">
        {solutions.map((solution) => (
          <button
            key={solution.name}
            type="button"
            className="award2-tool"
            onClick={() =>
              openSiteAssistant({ source: `award-v2-${solution.index}`, preset: solution.preset })
            }
          >
            <div className="container-page award2-tool__inner">
              <span>{solution.index}</span>
              <strong>{solution.name}</strong>
              <div>
                <b>{solution.title}</b>
                <p>{solution.copy}</p>
              </div>
              <em>
                {solution.cta} <ArrowUpRight size={16} />
              </em>
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
      className="award2-work"
      id="realizacie"
      aria-labelledby="award2-work-title"
      data-award-chapter="2"
    >
      <div className="container-page award2-work__head">
        <span>REALIZÁCIE</span>
        <h2 id="award2-work-title">Weby, ktoré už bežia.</h2>
        <p>Každý projekt si môžete otvoriť a preklikať.</p>
      </div>
      <div className="container-page award2-work__grid">
        {realizations.map((project, index) => (
          <article className="award2-project" key={project.name}>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="award2-project__visual"
            >
              <img src={project.image} alt={project.alt} loading="lazy" decoding="async" />
              <span>{project.domain}</span>
              <b>
                OTVORIŤ WEB <ArrowUpRight size={15} />
              </b>
            </a>
            <div className="award2-project__meta">
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
      <div className="container-page award2-work__footer">
        <Link to="/projekty">
          Všetky projekty <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

function HorizontalFlow() {
  const [mode, setMode] = useState<FlowMode>("chatbot");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0.02, 1]);
  const stages = flowModes[mode].stages;

  return (
    <section
      ref={ref}
      className="award2-flow"
      id="ako-to-funguje"
      aria-label="Ako to funguje"
      data-award-chapter="3"
    >
      <div className="award2-flow__desktop">
        <div className="award2-flow__sticky">
          <div className="award2-flow__hud container-page">
            <span>AKO TO FUNGUJE</span>
            <div className="award2-flow__modes" aria-label="Vyberte typ riešenia">
              {(Object.keys(flowModes) as FlowMode[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  data-active={mode === item || undefined}
                  onClick={() => setMode(item)}
                >
                  {flowModes[item].label}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="award2-flow__track"
              key={mode}
              style={{ x }}
              initial={{ opacity: 0.74 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.74 }}
              transition={{ duration: 0.26 }}
            >
              {stages.map((stage) => (
                <article className="award2-flow__scene" key={stage.index}>
                  <div className="container-page award2-flow__scene-inner">
                    <span className="award2-flow__number">{stage.index}</span>
                    <div className="award2-flow__copy">
                      <span>{stage.label}</span>
                      <h2>{stage.title}</h2>
                      <p>{stage.copy}</p>
                    </div>
                    <div className="award2-flow__artifact">
                      <span>
                        {flowModes[mode].label.toUpperCase()} / {stage.index}
                      </span>
                      <strong>{stage.artifact}</strong>
                      <i>→</i>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="award2-flow__progress" aria-hidden="true">
            <motion.i style={{ scaleX: lineScale }} />
          </div>
        </div>
      </div>

      <div className="award2-flow__mobile container-page">
        <p>AKO TO FUNGUJE</p>
        <div className="award2-flow__mobile-modes">
          {(Object.keys(flowModes) as FlowMode[]).map((item) => (
            <button
              type="button"
              key={item}
              data-active={mode === item || undefined}
              onClick={() => setMode(item)}
            >
              {flowModes[item].label}
            </button>
          ))}
        </div>
        {stages.map((stage) => (
          <article key={stage.index}>
            <div>
              <span>{stage.index}</span>
              <b>{stage.label}</b>
            </div>
            <h3>{stage.title}</h3>
            <p>{stage.copy}</p>
            <strong>{stage.artifact}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function LiveDemos() {
  const webko = realizations.find((project) => project.name === "WEBKO");
  const aplan = liveTools.find((tool) => tool.name === "APLAN AI");

  return (
    <section
      className="award2-demos"
      id="ukazky"
      aria-labelledby="award2-demos-title"
      data-award-chapter="4"
    >
      <div className="container-page award2-demos__head">
        <span>VYSKÚŠAJTE SI TO</span>
        <h2 id="award2-demos-title">Nie iba screenshot.</h2>
        <p>Otvorte živý web alebo rovno nástroj.</p>
      </div>
      <div className="container-page award2-demos__grid">
        {webko ? (
          <a className="award2-demo" href={webko.href} target="_blank" rel="noreferrer">
            <div className="award2-demo__frame">
              <img src={webko.image} alt={webko.alt} loading="lazy" decoding="async" />
              <span>WEBKO</span>
              <b>
                OTVORIŤ WEB <ArrowUpRight size={15} />
              </b>
            </div>
            <h3>WEBKO</h3>
            <p>Prezentačný web s jasnou cestou ku kontaktu.</p>
          </a>
        ) : null}
        {aplan ? (
          <a
            className="award2-demo award2-demo--aplan"
            href={aplan.href}
            target="_blank"
            rel="noreferrer"
          >
            <div className="award2-aplan-preview">
              <div>
                <span>APLAN AI</span>
                <i>ONLINE</i>
              </div>
              <h4>Čo potrebujete vybaviť?</h4>
              <p>Stavebné povolenie</p>
              <p>Dokumenty</p>
              <strong>Pomôžem vám zistiť ďalší krok.</strong>
              <b>
                VYSKÚŠAŤ APLAN <ArrowUpRight size={15} />
              </b>
            </div>
            <h3>APLAN AI</h3>
            <p>Asistent, ktorý človeka prevedie vybavovaním krok po kroku.</p>
          </a>
        ) : null}
        <button
          type="button"
          className="award2-demo award2-demo--chatbot"
          onClick={() => openSiteAssistant({ source: "award-v2-live", preset: "inquiry" })}
        >
          <div className="award2-demo-chat">
            <BrandMark size={48} />
            <span>MÔJ CHATBOT</span>
            <p>Napíšte otázku a vyskúšajte si ho priamo tu.</p>
            <b>
              OTVORIŤ CHATBOT <ArrowUpRight size={15} />
            </b>
          </div>
          <h3>Môj Chatbot</h3>
          <p>Živá verzia produktu, ktorý môže byť aj na vašom webe.</p>
        </button>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="award2-audience" aria-label="Riešenia podľa typu firmy">
      <article>
        <span>SLUŽBY</span>
        <h2>Keď zákazník potrebuje odpoveď alebo cenu.</h2>
        <p>Chatbot a kalkulačka vybavia prvé otázky a pripravia konkrétnejší dopyt.</p>
        <button
          type="button"
          onClick={() => openSiteAssistant({ source: "award-v2-services", preset: "inquiry" })}
        >
          Ukázať riešenie <ArrowRight size={16} />
        </button>
      </article>
      <article id="pre-eshopy">
        <span>E-SHOPY</span>
        <h2>Keď zákazník nevie, čo si vybrať.</h2>
        <p>Konfigurátor alebo poradca zúži ponuku na možnosti, ktoré dávajú zmysel.</p>
        <button
          type="button"
          onClick={() => openSiteAssistant({ source: "award-v2-shop", preset: "advisor" })}
        >
          Ukázať riešenie <ArrowRight size={16} />
        </button>
      </article>
    </section>
  );
}

function Process() {
  return (
    <section className="award2-process" aria-labelledby="award2-process-title">
      <div className="container-page award2-process__head">
        <span>SPOLUPRÁCA</span>
        <h2 id="award2-process-title">Od prvého rozhovoru po nasadenie.</h2>
        <Link to="/postup">
          Celý postup <ArrowRight size={16} />
        </Link>
      </div>
      <ol className="container-page award2-process__list">
        {process.map(([index, title, copy]) => (
          <li key={index}>
            <span>{index}</span>
            <strong>{title}</strong>
            <p>{copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Price() {
  return (
    <section
      className="award2-price"
      id="cena"
      aria-labelledby="award2-price-title"
      data-award-chapter="5"
    >
      <div className="container-page award2-price__head">
        <span>CENA</span>
        <h2 id="award2-price-title">Koľko to stojí?</h2>
        <p>Presnú cenu určím podľa rozsahu a logiky konkrétneho riešenia.</p>
      </div>
      <div className="container-page award2-price__grid">
        <div>
          <span>CHATBOT NA MIERU</span>
          <strong>od 497 €</strong>
        </div>
        <div>
          <span>KALKULAČKA / KONFIGURÁTOR</span>
          <strong>od 597 €</strong>
        </div>
        <div>
          <span>PREVÁDZKA</span>
          <strong>10 €</strong>
          <b>/ mesiac</b>
        </div>
        <Link to="/cennik">
          Celý cenník <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export function AwardV2Landing() {
  return (
    <div className="award2-home">
      <ContinuousGuide />

      <section className="award2-hero" aria-labelledby="award2-hero-title" data-award-chapter="0">
        <div className="container-page award2-hero__stage">
          <h1 id="award2-hero-title">
            <span>Od otázky</span>
            <em>k výsledku.</em>
          </h1>
          <HeroCollage />
        </div>
        <div className="container-page award2-hero__bottom">
          <p>Chatboty, kalkulačky a konfigurátory na mieru.</p>
          <a href="#riesenia">
            Pozrieť riešenia <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <CoreTools />
      <SelectedWork />

      <section className="award2-manifesto" aria-labelledby="award2-manifesto-title">
        <div className="container-page">
          <span>ČO TO ZMENÍ</span>
          <h2 id="award2-manifesto-title">
            Web môže <em>odpovedať.</em> Môže <em>počítať.</em> Môže človeka doviesť k
            <em> správnemu výberu.</em>
          </h2>
        </div>
      </section>

      <HorizontalFlow />
      <LiveDemos />
      <Audience />
      <Process />
      <Price />

      <section className="award2-final" aria-labelledby="award2-final-title">
        <div className="container-page award2-final__top">
          <BrandMark size={52} />
          <span>MÔJ CHATBOT</span>
        </div>
        <div className="container-page award2-final__body">
          <h2 id="award2-final-title">Pošlite mi váš web.</h2>
          <p>Poviem vám, čo by na ňom malo zmysel a koľko by to približne stálo.</p>
          <div>
            <Link to="/kontakt">
              Chcem návrh <ArrowUpRight size={18} />
            </Link>
            <a href="mailto:info@mojchatbot.sk">info@mojchatbot.sk</a>
          </div>
        </div>
      </section>
    </div>
  );
}
