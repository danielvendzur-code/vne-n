import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useScroll,
  useSpring,
  type Variants,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Calculator,
  CalendarClock,
  Check,
  Clock3,
  ExternalLink,
  Mail,
  MessageCircle,
  PenLine,
  PlugZap,
  Rocket,
  SlidersHorizontal,
  Workflow,
  X,
} from "lucide-react";
import { GlideField } from "@/components/effects/GlideField";
import { Symbol } from "@/components/Symbol";
import { DeratScrollStory } from "@/components/site/DeratScrollStory";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { useCountUp } from "@/hooks/useCountUp";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./PremiumLanding.css";

type ComparisonMode = "without" | "with";
type HeroToolKey = "chatbot" | "calculator" | "configurator";
type RevealDirection = "up" | "left" | "right";

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
const liquidSpring = { type: "spring" as const, stiffness: 290, damping: 29, mass: 0.78 };
const liquidControlSelector =
  ".lp-button, .lp-assistant-cta, .lp-assistant-chips button, .lp-switch button, .lp-caps-chips .chip, .lp-faq-ask";

const heroSequence: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.085, delayChildren: 0.08 } },
};

const heroLine: Variants = {
  hidden: { y: "112%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.82, ease: premiumEase },
  },
};

const sequenceItem: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.72, ease: premiumEase },
  },
};

const heroTools = {
  chatbot: {
    label: "Chatbot",
    text: "Odpovie, kvalifikuje dopyt a odovzdá vám kontakt aj s celým kontextom.",
  },
  calculator: {
    label: "Kalkulačka",
    text: "Vypočíta cenu, spotrebu alebo návratnosť presne podľa pravidiel vašej služby.",
  },
  configurator: {
    label: "Konfigurátor",
    text: "Prevedie zákazníka ľubovoľným výberom a odošle hotovú špecifikáciu.",
  },
} satisfies Record<HeroToolKey, { label: string; text: string }>;

const comparisons = {
  without: {
    title: "Kontakt bez kontextu.",
    copy: "Po formulári ešte zisťujete rozsah, lokalitu, termín aj očakávanie zákazníka.",
    items: ["Odpoveď až neskôr", "Rovnaké otázky dookola", "Nejasná priorita dopytu"],
  },
  with: {
    title: "Dopyt pripravený na ďalší krok.",
    copy: "Návštevník dostane odpoveď hneď a vy kontakt spolu s relevantnými vstupmi.",
    items: ["Odpoveď ihneď", "Kompletný kontext", "Menej ručného zisťovania"],
  },
};

const solutions = [
  {
    icon: Bot,
    title: "Chatbot na mieru",
    copy: "Konverzácia navrhnutá podľa vašich služieb a reálnych otázok zákazníkov.",
  },
  {
    icon: Calculator,
    title: "Kalkulačky a konfigurátory",
    copy: "Od ceny po zložitý produktový výber — logika sa prispôsobí vášmu procesu.",
  },
  {
    icon: Workflow,
    title: "Všetko v jednom chatbote",
    copy: "Kalkulačku aj konfigurátor viem prepojiť s rozhovorom do jedného plynulého zážitku.",
  },
];

const projects = [
  {
    name: "Môj Plot",
    type: "E-commerce · produktový web",
    result: "Prehľadný výber oplotenia, služieb a ďalšieho kroku pre zákazníka.",
    href: "https://mojplot.sk/",
    image: `${import.meta.env.BASE_URL}work/portfolio/mojplot.webp`,
    alt: "Domovská stránka Môj Plot s ponukou kvalitných plotov",
    tone: "mint",
  },
  {
    name: "Koverta",
    type: "E-commerce · dopytový asistent",
    result: "Produktový web pre dom a záhradu doplnený o rýchly kontakt a asistenta.",
    href: "https://koverta.sk/",
    image: `${import.meta.env.BASE_URL}work/portfolio/koverta.webp`,
    alt: "Domovská stránka Koverta s modernou pergolou",
    tone: "sand",
  },
  {
    name: "WEBKO",
    type: "Prezentačný web · lead generation",
    result: "Sebavedomá prezentácia služby s jasným smerovaním ku kontaktu.",
    href: "https://www.webko.sk/",
    image: `${import.meta.env.BASE_URL}work/portfolio/webko.webp`,
    alt: "Tmavá domovská stránka WEBKO s ukážkou webových realizácií",
    tone: "blue",
  },
];

const liveTools = [
  ["DERAT kalkulačka", "https://derat-chatbot-backend.vercel.app/"],
  ["APLAN AI", "https://danielvendzur-code.github.io/aplan-chatbot-backend/"],
  ["Webový asistent", "https://danielvendzur-code.github.io/moj.chatbot.backend/"],
] as const;

const heroProof = [
  { icon: BadgeCheck, text: "Reálne nasadené weby a živé nástroje" },
  { icon: PenLine, text: "Logiku navrhujem ešte pred vývojom" },
  { icon: Clock3, text: "Odpoveď zvyčajne do 1 pracovného dňa" },
];

const capabilityGroups = [
  {
    icon: Calculator,
    title: "Kalkulačky",
    tone: "gold",
    copy: "Výsledok z reálnych vstupov a pravidiel vašej služby.",
    items: [
      "Cenová ponuka",
      "Spotreba materiálu",
      "Návratnosť investície",
      "Rozmery a výmera",
      "Doprava a montáž",
      "Splátky a financovanie",
    ],
  },
  {
    icon: SlidersHorizontal,
    title: "Konfigurátory",
    tone: "mint",
    copy: "Zákazník si poskladá produkt alebo službu krok za krokom.",
    items: [
      "Produkt na mieru",
      "Výber variantu",
      "Balíky služieb",
      "Krokový sprievodca",
      "Rezervácia termínu",
    ],
  },
  {
    icon: Bot,
    title: "Chatboty",
    tone: "coral",
    copy: "Rozhovor, ktorý odpovie a pripraví použiteľný dopyt.",
    items: [
      "Dopytový asistent",
      "Produktový poradca",
      "Časté otázky",
      "Kvalifikácia dopytu",
      "Objednávkový asistent",
    ],
  },
  {
    icon: PlugZap,
    title: "Prepojenia",
    tone: "ink",
    copy: "Dopyt skončí presne tam, kde s ním ďalej pracujete.",
    items: [
      "E-mail s celým kontextom",
      "Kalendár a termíny",
      "Google tabuľka",
      "CRM či interný systém",
      "Vlastné API",
    ],
  },
] as const;

const portfolioCounters = [
  { value: 3, label: "nasadené weby pre reálne firmy" },
  { value: 3, label: "živé nástroje dostupné online" },
  { value: 6, label: "interaktívnych ukážok na vyskúšanie" },
];

const process = [
  {
    icon: MessageCircle,
    title: "Krátka analýza",
    copy: "Prejdeme službu, zákazníka a kroky, ktoré dnes riešite ručne.",
  },
  {
    icon: Workflow,
    title: "Logika a prototyp",
    copy: "Navrhnem otázky, rozhodovanie aj rozhranie ešte pred vývojom.",
  },
  {
    icon: Rocket,
    title: "Nasadenie",
    copy: "Hotový nástroj otestujem, prepojím a nasadím priamo na váš web.",
  },
];

function AnimatedPageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.22 });
  return <motion.div className="lp-progress" style={{ scaleX }} aria-hidden="true" />;
}

function PageProgress() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? null : <AnimatedPageProgress />;
}

function LiquidControlGlow() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (
      reducedMotion ||
      connection?.saveData ||
      !window.matchMedia("(any-pointer: fine)").matches
    ) {
      return;
    }

    let frame = 0;
    let activeControl: HTMLElement | null = null;
    let clientX = 0;
    let clientY = 0;

    const clearActiveControl = () => {
      if (!activeControl) return;
      activeControl.style.removeProperty("--liquid-x");
      activeControl.style.removeProperty("--liquid-y");
      activeControl = null;
    };

    const paint = () => {
      frame = 0;
      if (!activeControl) return;
      const bounds = activeControl.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100));
      const y = Math.min(100, Math.max(0, ((clientY - bounds.top) / bounds.height) * 100));
      activeControl.style.setProperty("--liquid-x", `${x}%`);
      activeControl.style.setProperty("--liquid-y", `${y}%`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const match =
        event.target instanceof Element ? event.target.closest(liquidControlSelector) : null;
      const nextControl = match instanceof HTMLElement ? match : null;
      if (nextControl !== activeControl) {
        clearActiveControl();
        activeControl = nextControl;
      }
      if (!activeControl) return;
      clientX = event.clientX;
      clientY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const handleWindowLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) clearActiveControl();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true, capture: true });
    window.addEventListener("mouseout", handleWindowLeave, { passive: true });
    window.addEventListener("blur", clearActiveControl);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("mouseout", handleWindowLeave);
      window.removeEventListener("blur", clearActiveControl);
      if (frame) window.cancelAnimationFrame(frame);
      clearActiveControl();
    };
  }, [reducedMotion]);

  return null;
}

function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  distance = 38,
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  distance?: number;
}) {
  const reducedMotion = useReducedMotion();
  const x = direction === "left" ? -distance : direction === "right" ? distance : 0;
  const y = direction === "up" ? Math.min(distance, 28) : 0;

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease: premiumEase }}
    >
      {children}
    </motion.div>
  );
}

function Heading({
  eyebrow,
  children,
  copy,
}: {
  eyebrow: string;
  children: ReactNode;
  copy?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="lp-heading"
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.34 }}
      variants={{
        hidden: { opacity: 0, x: -34 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.7, ease: premiumEase, staggerChildren: 0.09 },
        },
      }}
    >
      <motion.p className="lp-eyebrow" variants={sequenceItem}>
        <i />
        {eyebrow}
      </motion.p>
      <motion.h2 variants={sequenceItem}>{children}</motion.h2>
      {copy ? (
        <motion.p className="lp-heading-copy" variants={sequenceItem}>
          {copy}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function Hero() {
  const [activeTool, setActiveTool] = useState<HeroToolKey>("chatbot");
  const reducedMotion = useReducedMotion();
  const magneticCta = useMagnetic<HTMLAnchorElement>(0.14);

  return (
    <section className="lp-hero" id="uvod">
      <div className="lp-hero-glide" aria-hidden="true">
        <GlideField className="glide-field--hero" radius={142} />
      </div>
      <div className="lp-hero-glow" aria-hidden="true" />
      <div className="container-page lp-hero-grid">
        <motion.div
          className="lp-hero-copy"
          variants={heroSequence}
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
        >
          <h1 aria-label="Webové nástroje, ktoré odovzdajú hotový dopyt.">
            <span className="lp-hero-line" aria-hidden="true">
              <motion.span variants={heroLine}>Webové nástroje,</motion.span>
            </span>
            <span className="lp-hero-line" aria-hidden="true">
              <motion.span variants={heroLine}>ktoré odovzdajú</motion.span>
            </span>
            <span className="lp-hero-line" aria-hidden="true">
              <motion.em variants={heroLine}>hotový dopyt.</motion.em>
            </span>
          </h1>
          <motion.p className="lp-hero-lead" variants={sequenceItem}>
            Kalkulačky, konfigurátory a chatboty na mieru. Zákazník dostane odpoveď alebo cenu hneď
            — vy kontakt aj celý kontext, pripravený na ponuku.
          </motion.p>
          <motion.div className="lp-actions" variants={sequenceItem}>
            <Link to="/kontakt" className="lp-button lp-button-primary" ref={magneticCta}>
              <span className="lp-button-content">
                Chcem riešenie na mieru <ArrowRight size={17} />
              </span>
            </Link>
            <a href="#projekty" className="lp-button lp-button-quiet">
              <span className="lp-button-content">Pozrieť realizácie</span>
            </a>
          </motion.div>
          <motion.ul className="lp-hero-proof" variants={sequenceItem}>
            {heroProof.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon aria-hidden="true" />
                {text}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className="lp-hero-stage"
          initial={reducedMotion ? false : { opacity: 0, x: 54, scale: 0.975 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={
            reducedMotion ? { duration: 0 } : { duration: 0.94, delay: 0.16, ease: premiumEase }
          }
        >
          <div className="lp-assistant-card">
            <p>Čo má zákazník dostať hneď?</p>
            <div className="lp-assistant-chips" role="group" aria-label="Typ webového nástroja">
              {(Object.entries(heroTools) as [HeroToolKey, (typeof heroTools)[HeroToolKey]][]).map(
                ([key, tool]) => (
                  <motion.button
                    type="button"
                    key={key}
                    data-active={activeTool === key}
                    aria-pressed={activeTool === key}
                    onClick={() => setActiveTool(key)}
                  >
                    {activeTool === key ? (
                      <motion.span
                        className="lp-chip-liquid"
                        layoutId="hero-tool-liquid"
                        transition={liquidSpring}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="lp-control-label">{tool.label}</span>
                  </motion.button>
                ),
              )}
            </div>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                className="lp-assistant-answer"
                key={activeTool}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                initial={reducedMotion ? false : { opacity: 0, y: 8, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6, filter: "blur(3px)" }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.32, ease: premiumEase }}
              >
                <Check />
                <span>{heroTools[activeTool].text}</span>
              </motion.div>
            </AnimatePresence>
            <button
              type="button"
              className="lp-assistant-cta"
              onClick={() => openSiteAssistant({ source: "hero-card" })}
            >
              <span className="lp-button-content">
                Vyskúšať môjho chatbota <ArrowUpRight />
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ValueSection() {
  const [mode, setMode] = useState<ComparisonMode>("with");
  const active = comparisons[mode];
  const reducedMotion = useReducedMotion();

  return (
    <section className="lp-value" id="nastroje">
      <div className="container-page">
        <Heading
          eyebrow="Čo sa zmení"
          copy="Nástroj má zákazníkovi zjednodušiť rozhodnutie a vám ušetriť opakované otázky."
        >
          Menej zisťovania. <em>Viac pripravených dopytov.</em>
        </Heading>

        <Reveal className="lp-comparison" direction="right" distance={46}>
          <div className="lp-switch" role="group" aria-label="Porovnanie webu bez a s nástrojom">
            <motion.button
              type="button"
              data-active={mode === "without"}
              aria-pressed={mode === "without"}
              onClick={() => setMode("without")}
            >
              {mode === "without" ? (
                <motion.span
                  className="lp-switch-liquid"
                  layoutId="comparison-liquid"
                  transition={liquidSpring}
                  aria-hidden="true"
                />
              ) : null}
              <span className="lp-control-label">Bez nástroja</span>
            </motion.button>
            <motion.button
              type="button"
              data-active={mode === "with"}
              aria-pressed={mode === "with"}
              onClick={() => setMode("with")}
            >
              {mode === "with" ? (
                <motion.span
                  className="lp-switch-liquid"
                  layoutId="comparison-liquid"
                  transition={liquidSpring}
                  aria-hidden="true"
                />
              ) : null}
              <span className="lp-control-label">S nástrojom</span>
            </motion.button>
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              className="lp-comparison-body"
              key={mode}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              initial={reducedMotion ? false : { opacity: 0, x: mode === "with" ? 18 : -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: mode === "with" ? 12 : -12 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.38, ease: premiumEase }}
            >
              <div className="lp-comparison-copy">
                <h3>{active.title}</h3>
                <span>{active.copy}</span>
              </div>
              <ul>
                {active.items.map((item) => (
                  <li key={item}>
                    {mode === "with" ? <Check /> : <X />}
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </Reveal>

        <div className="lp-solution-strip">
          {solutions.map(({ icon: Icon, title, copy }, index) => (
            <Reveal className="lp-solution-pill" key={title} delay={index * 0.08}>
              <Icon />
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="lp-caps" id="moznosti">
      <div className="container-page">
        <Heading
          eyebrow="Čo všetko viem postaviť"
          copy="Vyberte, čo je najbližšie k vašej situácii. Každá položka je typ nástroja, ktorý viem navrhnúť presne podľa vašej služby — kliknutím rovno otvoríte krátke zadanie."
        >
          Ak sa to dá opísať pravidlami, <em>dá sa to postaviť.</em>
        </Heading>

        <div className="lp-caps-grid">
          {capabilityGroups.map(({ icon: Icon, title, tone, copy, items }, groupIndex) => (
            <Reveal className="lp-caps-group" key={title} delay={groupIndex * 0.07} distance={30}>
              <div className="lp-caps-head" data-tone={tone}>
                <Icon aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </div>
              <div className="lp-caps-chips">
                {items.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="chip"
                    data-tone={tone}
                    onClick={() => openSiteAssistant({ source: "capability-chip", category: item })}
                  >
                    {item}
                    <ArrowUpRight aria-hidden="true" />
                  </button>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="lp-caps-note" delay={0.1}>
          <CalendarClock aria-hidden="true" />
          <p>
            Nenašli ste svoju situáciu? Opíšte ju vlastnými slovami —{" "}
            <button type="button" onClick={() => openSiteAssistant({ source: "capability-note" })}>
              chatbot z nej pripraví zadanie
            </button>{" "}
            a ja sa ozvem s konkrétnym návrhom.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CounterItem({ value, label }: { value: number; label: string }) {
  const { ref, value: displayed } = useCountUp(value);
  return (
    <li>
      <span className="lp-counter-value" ref={ref}>
        {displayed}
      </span>
      <span className="lp-counter-label">{label}</span>
    </li>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <div className="lp-faq-item" data-open={open}>
      <h3>
        <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span>{question}</span>
          <i aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="lp-faq-body"
            initial={reducedMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reducedMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.4, ease: premiumEase }}
          >
            <p>{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FaqSection() {
  return (
    <section className="lp-faq" id="otazky">
      <div className="container-page lp-faq-grid">
        <div className="lp-faq-side">
          <Heading
            eyebrow="Časté otázky"
            copy="Ak tu odpoveď nie je, napíšte mi — alebo sa spýtajte priamo chatbota v rohu obrazovky."
          >
            Všetko, čo firmy <em>zaujíma najskôr.</em>
          </Heading>
          <Reveal delay={0.12}>
            <button
              type="button"
              className="lp-faq-ask"
              onClick={() => openSiteAssistant({ source: "faq" })}
            >
              <MessageCircle aria-hidden="true" />
              Spýtať sa na čokoľvek
            </button>
          </Reveal>
        </div>
        <Reveal className="lp-faq-list" direction="right" distance={40}>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="lp-project-media" data-loaded={loaded}>
      <img
        src={src}
        alt={alt}
        width="1440"
        height="1000"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function Portfolio() {
  return (
    <section className="lp-portfolio" id="projekty">
      <div className="container-page">
        <Heading
          eyebrow="Vybrané realizácie"
          copy="Každý náhľad je reálny projekt. Kliknite a pozrite si ho priamo na živom webe."
        >
          Reálne weby. <em>Žiadne generické makety.</em>
        </Heading>

        <Reveal delay={0.05}>
          <ul className="lp-counters" aria-label="Čísla, ktoré si viete overiť priamo na webe">
            {portfolioCounters.map((counter) => (
              <CounterItem key={counter.label} value={counter.value} label={counter.label} />
            ))}
          </ul>
        </Reveal>

        <div className="lp-project-grid">
          {projects.map((project, index) => (
            <Reveal
              className="lp-project"
              key={project.name}
              direction={index % 2 === 0 ? "left" : "right"}
              distance={34}
              delay={index * 0.06}
            >
              <a href={project.href} target="_blank" rel="noreferrer" data-tone={project.tone}>
                <ProjectImage src={project.image} alt={project.alt} />
                <div className="lp-project-copy">
                  <span>0{index + 1}</span>
                  <p>{project.type}</p>
                  <h3>{project.name}</h3>
                  <small>{project.result}</small>
                  <b>
                    Pozrieť živý projekt <ExternalLink />
                  </b>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="lp-live-tools">
          <span>Živé nástroje</span>
          {liveTools.map(([name, href]) => (
            <a key={name} href={href} target="_blank" rel="noreferrer">
              {name}
              <ArrowUpRight />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessAndCta() {
  const reducedMotion = useReducedMotion();
  const magneticFinal = useMagnetic<HTMLAnchorElement>(0.12);

  return (
    <section className="lp-process" id="spolupraca">
      <GlideField className="glide-field--ambient" radius={110} intensity={0.5} />
      <div className="container-page lp-process-grid">
        <div>
          <Heading
            eyebrow="Ako spolupráca prebieha"
            copy="Od prvých otázok po nasadenie máte vždy jasný ďalší krok."
          >
            Krátko, zrozumiteľne <em>a bez chaosu.</em>
          </Heading>
          <ol className="lp-process-list">
            {process.map(({ icon: Icon, title, copy }, index) => (
              <motion.li
                key={title}
                initial={reducedMotion ? false : { opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.64, delay: index * 0.09, ease: premiumEase }
                }
              >
                <span>0{index + 1}</span>
                <Icon />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <Reveal className="lp-final-card" direction="right" distance={44}>
          <Symbol size={52} />
          <p>Máte nápad alebo opakujúci sa proces?</p>
          <h2>Pozrime sa, čo môže váš web robiť automaticky.</h2>
          <Link to="/kontakt" className="lp-button lp-button-light" ref={magneticFinal}>
            <span className="lp-button-content">
              Nezáväzná konzultácia <ArrowRight />
            </span>
          </Link>
          <a href={`mailto:${siteConfig.contact.email}`} className="lp-final-email">
            <Mail /> {siteConfig.contact.email}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function PremiumLanding() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="lp-page">
        <LiquidControlGlow />
        <PageProgress />
        <Hero />
        <ValueSection />
        <Capabilities />
        <DeratScrollStory />
        <Portfolio />
        <FaqSection />
        <ProcessAndCta />
      </div>
    </MotionConfig>
  );
}
