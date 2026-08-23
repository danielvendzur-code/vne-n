import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { realizations } from "@/data/realizations";
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

const signalSections = [
  { index: "01", label: "Úvod", tone: "dark" },
  { index: "02", label: "Riešenia", tone: "light" },
  { index: "03", label: "Realizácie", tone: "light" },
  { index: "04", label: "Ako to funguje", tone: "dark" },
  { index: "05", label: "Ukážky", tone: "dark" },
  { index: "06", label: "Cena a kontakt", tone: "dark" },
] as const;

function HeroCollage() {
  const projects = useMemo(() => {
    const wanted = ["Koverta", "DERAT", "Môj Plot"];
    return wanted
      .map((name) => realizations.find((project) => project.name === name))
      .filter((project): project is (typeof realizations)[number] => Boolean(project));
  }, []);

  return (
    <div className="hybrid-hero__collage" aria-label="Vybrané živé realizácie">
      {projects.map((project, index) => (
        <a
          key={project.name}
          className={`hybrid-hero__case hybrid-hero__case--${index + 1}`}
          href={project.href}
          target="_blank"
          rel="noreferrer"
        >
          <img src={project.image} alt={project.alt} decoding="async" fetchPriority="high" />
          <span>
            0{index + 1} / {project.name}
          </span>
        </a>
      ))}
    </div>
  );
}

function SignalLens() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 92, damping: 27, mass: 0.28 });
  const y = useTransform(progress, [0, 1], ["0vh", "58vh"]);
  const opacity = useTransform(progress, [0, 0.025, 0.06, 0.97, 1], [0, 0, 1, 1, 0.35]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 190, damping: 24 });
  const rotateY = useSpring(pointerX, { stiffness: 190, damping: 24 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-signal-chapter]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.signalChapter ?? 0);
        setActive(Math.max(0, Math.min(signalSections.length - 1, index)));
      },
      { rootMargin: "-30% 0px -54% 0px", threshold: [0, 0.1, 0.3, 0.55] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const yy = (event.clientY / window.innerHeight - 0.5) * -6;
      pointerX.set(Math.max(-4, Math.min(4, x)));
      pointerY.set(Math.max(-3, Math.min(3, yy)));
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, [pointerX, pointerY]);

  const section = signalSections[active];

  return (
    <aside className="signal-rail" data-tone={section.tone} aria-hidden="true">
      <div className="signal-rail__line">
        {signalSections.map((item, index) => (
          <i key={item.index} data-active={index <= active || undefined} />
        ))}
      </div>
      <motion.div
        className="signal-lens"
        data-tone={section.tone}
        style={{ y, opacity, rotateX, rotateY }}
      >
        <motion.span className="signal-lens__glare" style={{ x: pointerX, y: pointerY }} />
        <span className="signal-lens__index">{section.index}</span>
        <small>{section.label}</small>
      </motion.div>
    </aside>
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

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(stages.length - 1, Math.floor(value * stages.length));
    setActiveStage(next);
  });

  const stage = stages[activeStage];

  return (
    <section
      ref={ref}
      className="hybrid-flow kage-flow"
      aria-label="Ako to funguje"
      data-signal-chapter="3"
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
    >
      <div className="container-page hybrid-tools__intro">
        <span>VYBERTE RIEŠENIE</span>
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
    >
      <div className="container-page hybrid-work__intro">
        <span>REALIZÁCIE</span>
        <h2 id="hybrid-work-title">Hotové projekty.</h2>
        <p>Kliknite na projekt a otvoríte živý web.</p>
      </div>
      <div className="container-page hybrid-work__grid">
        {realizations.map((project, index) => (
          <article className="hybrid-project" key={project.name}>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="hybrid-project__visual"
            >
              <img src={project.image} alt={project.alt} loading="eager" decoding="async" />
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

function LiveDemos() {
  const webko = realizations.find((project) => project.name === "WEBKO");

  return (
    <section className="kage-demos" aria-labelledby="kage-demos-title" data-signal-chapter="4">
      <div className="container-page kage-demos__intro">
        <span>ĎALŠIE UKÁŽKY</span>
        <h2 id="kage-demos-title">Vyskúšajte si ich.</h2>
        <p>WEBKO otvoríte ako celý web. V APLAN si môžete vyskúšať asistenta.</p>
      </div>
      <div className="container-page kage-demos__grid">
        {webko ? (
          <a className="kage-demo" href={webko.href} target="_blank" rel="noreferrer">
            <div className="kage-demo__frame">
              <img src={webko.image} alt={webko.alt} loading="lazy" decoding="async" />
              <span>01 / WEBKO</span>
              <b>
                OTVORIŤ WEB <ArrowUpRight size={16} />
              </b>
            </div>
            <div className="kage-demo__meta">
              <strong>WEBKO</strong>
              <p>Ukážka moderného prezentačného webu. Kliknutím otvoríte celú stránku.</p>
            </div>
          </a>
        ) : null}

        <a
          className="kage-demo kage-demo--aplan"
          href="https://danielvendzur-code.github.io/aplan-chatbot-backend/"
          target="_blank"
          rel="noreferrer"
        >
          <div className="kage-demo__frame">
            <div className="kage-aplan-preview" aria-hidden="true">
              <div className="kage-aplan-preview__top">
                <span>APLAN AI</span>
                <i>ONLINE</i>
              </div>
              <div className="kage-aplan-preview__body">
                <p>Čo potrebujete vybaviť?</p>
                <div className="kage-aplan-preview__choices">
                  <span>Stavebné povolenie</span>
                  <span>Dokumenty</span>
                  <span>Postup</span>
                </div>
                <div className="kage-aplan-preview__message">
                  Pomôžem vám zistiť, čo budete potrebovať a aký je ďalší krok.
                </div>
              </div>
            </div>
            <span>02 / APLAN AI</span>
            <b>
              VYSKÚŠAŤ APLAN <ArrowUpRight size={16} />
            </b>
          </div>
          <div className="kage-demo__meta">
            <strong>APLAN AI</strong>
            <p>Interaktívny asistent. Kliknite a prejdite si jeho flow sami.</p>
          </div>
        </a>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="hybrid-audience" aria-label="Riešenia podľa typu firmy">
      <article className="hybrid-audience__panel hybrid-audience__panel--services">
        <div className="hybrid-audience__content">
          <span>MÁTE SLUŽBY?</span>
          <h2>Zákazník sa rýchlejšie dostane k odpovedi alebo cene.</h2>
          <p>
            Chatbot alebo kalkulačka odpovie na bežné otázky, zistí potrebné údaje a pripraví dopyt.
          </p>
          <button
            type="button"
            onClick={() => openSiteAssistant({ source: "audience-services", preset: "inquiry" })}
          >
            Ukázať riešenie pre služby <ArrowRight size={17} />
          </button>
        </div>
        <div className="hybrid-audience__type" aria-hidden="true">
          SLUŽBY
        </div>
      </article>
      <article className="hybrid-audience__panel hybrid-audience__panel--commerce" id="pre-eshopy">
        <div className="hybrid-audience__content">
          <span>MÁTE E-SHOP?</span>
          <h2>Zákazník rýchlejšie nájde správny produkt.</h2>
          <p>
            Produktový poradca sa opýta na potreby, zúži výber a odporučí vhodný produkt alebo
            variant.
          </p>
          <button
            type="button"
            onClick={() => openSiteAssistant({ source: "audience-commerce", preset: "product" })}
          >
            Ukázať riešenie pre e-shop <ArrowRight size={17} />
          </button>
        </div>
        <div className="hybrid-audience__type" aria-hidden="true">
          E-SHOP
        </div>
      </article>
    </section>
  );
}

function Process() {
  return (
    <section
      className="hybrid-process"
      aria-labelledby="hybrid-process-title"
      data-signal-chapter="5"
    >
      <div className="container-page hybrid-process__intro">
        <span>SPOLUPRÁCA</span>
        <h2 id="hybrid-process-title">Takto spolupráca prebehne.</h2>
        <Link to="/postup">
          Pozrieť celý postup <ArrowRight size={17} />
        </Link>
      </div>
      <ol className="container-page hybrid-process__list">
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
    <section className="hybrid-price" aria-labelledby="hybrid-price-title">
      <div className="container-page hybrid-price__top">
        <span>CENA</span>
        <h2 id="hybrid-price-title">Koľko to stojí?</h2>
      </div>
      <div className="container-page hybrid-price__grid">
        <div>
          <span>CHATBOT NA MIERU</span>
          <strong>od 450 €</strong>
        </div>
        <div>
          <span>KALKULAČKA / KONFIGURÁTOR</span>
          <strong>od 500 €</strong>
        </div>
        <div>
          <span>PREVÁDZKA</span>
          <strong>10 €</strong>
          <b>/ mesiac</b>
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
      <SignalLens />

      <section
        className="hybrid-hero kage-hero"
        aria-labelledby="hybrid-hero-title"
        data-signal-chapter="0"
      >
        <div className="container-page hybrid-hero__stage">
          <h1 id="hybrid-hero-title">
            <span>Od otázky</span>
            <em>k výsledku.</em>
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

      <section className="hybrid-manifesto kage-manifesto" aria-labelledby="hybrid-manifesto-title">
        <div className="container-page hybrid-manifesto__inner">
          <span>ČO TO ZMENÍ</span>
          <h2 id="hybrid-manifesto-title">
            Web môže <em>odpovedať.</em> Môže <em>vypočítať cenu.</em> Môže{" "}
            <em>pomôcť s výberom.</em>
          </h2>
        </div>
      </section>

      <FlowStory />
      <LiveDemos />
      <Audience />
      <Process />
      <Price />

      <section className="hybrid-final" aria-labelledby="hybrid-final-title">
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
