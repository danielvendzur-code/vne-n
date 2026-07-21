import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  Plus,
  Rocket,
  Workflow,
  X,
} from "lucide-react";
import { GlideField } from "@/components/effects/GlideField";
import { Symbol } from "@/components/Symbol";
import { DeratScrollStory } from "@/components/site/DeratScrollStory";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./PremiumLanding.css";

type ComparisonMode = "without" | "with";
type HeroToolKey = "chatbot" | "calculator" | "configurator";
type RevealDirection = "up" | "left" | "right";

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
const liquidSpring = { type: "spring" as const, stiffness: 290, damping: 29, mass: 0.78 };
const liquidControlSelector = ".lp-button, .lp-assistant-cta, .lp-faq-ask";

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
    text: "Odpovie 24/7, zistí potrebu zákazníka a pripraví dopyt, na ktorý môžete rovno reagovať.",
  },
  calculator: {
    label: "S kalkulačkou",
    text: "Vedie prirodzený rozhovor a počas neho vypočíta cenu alebo rozsah zákazky podľa vašich pravidiel.",
  },
  configurator: {
    label: "S konfigurátorom",
    text: "Prevedie zákazníka výberom produktu, variantov a doplnkov a odošle kompletné zadanie.",
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
    copy: "Odpovedá na otázky, poradí návštevníkovi a odovzdá vám kontakt spolu s celým kontextom.",
  },
  {
    icon: Calculator,
    title: "Chatbot s kalkulačkou",
    copy: "Počas rozhovoru vypočíta cenu, spotrebu alebo návratnosť presne podľa pravidiel vašej služby.",
  },
  {
    icon: Workflow,
    title: "Chatbot s konfigurátorom",
    copy: "Prevedie zákazníka výberom produktu, variantov a doplnkov a odošle hotovú špecifikáciu.",
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
    title: "Kalkulačky",
    tone: "gold",
    copy: "Výsledok z reálnych vstupov a pravidiel vašej služby.",
    items: [
      {
        label: "Cenová ponuka",
        desc: "Zákazník zadá, čo potrebuje, a hneď vidí orientačnú cenu. Vy dostanete rovnaké čísla aj s kontaktom — pripravené na ponuku.",
        inputs: ["Rozmery", "Množstvo", "Doplnky", "Lokalita"],
        output: "Orientačná cena či rozsah a kompletné zadanie na e-mail.",
      },
      {
        label: "Spotreba materiálu",
        desc: "Z plochy alebo rozmerov vypočíta potrebné množstvo materiálu vrátane rezervy a prepočtu na balenia.",
        inputs: ["Plocha či rozmery", "Typ materiálu", "Rezerva"],
        output: "Množstvo, počet balení a orientačná cena materiálu.",
      },
      {
        label: "Návratnosť investície",
        desc: "Porovná dnešné náklady s úsporou po investícii a ukáže zákazníkovi, kedy sa mu zaplatí sama.",
        inputs: ["Aktuálne náklady", "Cena riešenia", "Očakávaná úspora"],
        output: "Doba návratnosti a prehľad úspor v čase.",
      },
      {
        label: "Rozmery a výmera",
        desc: "Prepočty plôch, objemov a bežných metrov presne podľa vašich vzorcov — bez papiera a počítania v ruke.",
        inputs: ["Tvar a rozmery", "Počet kusov"],
        output: "Presná výmera pripravená pre cenovú ponuku.",
      },
      {
        label: "Doprava a montáž",
        desc: "K cene automaticky pripočíta dopravu podľa vzdialenosti a montáž podľa rozsahu prác.",
        inputs: ["Adresa či vzdialenosť", "Rozsah montáže"],
        output: "Finálna cena vrátane dopravy a montáže.",
      },
      {
        label: "Splátky a financovanie",
        desc: "Rozloží cenu na mesačné splátky podľa vašich podmienok, aby zákazník videl dostupnosť okamžite.",
        inputs: ["Cena", "Akontácia", "Počet mesiacov"],
        output: "Mesačná splátka a prehľad celého financovania.",
      },
    ],
  },
  {
    title: "Konfigurátory",
    tone: "mint",
    copy: "Zákazník si poskladá produkt alebo službu krok za krokom.",
    items: [
      {
        label: "Produkt na mieru",
        desc: "Zákazník si poskladá produkt krok za krokom — od typu cez materiál až po doplnky. Nemusí nič vedieť vopred.",
        inputs: ["Typ", "Materiál", "Rozmer", "Doplnky"],
        output: "Hotová špecifikácia pripravená na výrobu či ponuku.",
      },
      {
        label: "Výber variantu",
        desc: "Pár otázok o použití a preferenciách zúži širokú ponuku na variant, ktorý naozaj sadne.",
        inputs: ["Spôsob použitia", "Preferencie", "Rozpočet"],
        output: "Odporúčaný variant aj so zdôvodnením.",
      },
      {
        label: "Balíky služieb",
        desc: "Poskladá balík služieb presne podľa potreby zákazníka a rovno ukáže, koľko bude stáť.",
        inputs: ["Výber služieb", "Rozsah", "Frekvencia"],
        output: "Zložený balík s cenou a zhrnutím.",
      },
      {
        label: "Krokový sprievodca",
        desc: "Zložité rozhodnutie rozdelí na jednoduché kroky s jasným postupom — nikto sa po ceste nestratí.",
        inputs: ["Odpovede krok za krokom"],
        output: "Zhrnutie výberu a jasný ďalší krok.",
      },
      {
        label: "Rezervácia termínu",
        desc: "Po výbere služby ponúkne voľné termíny a rezerváciu rovno potvrdí.",
        inputs: ["Služba", "Preferovaný čas", "Kontakt"],
        output: "Potvrdený termín aj s údajmi zákazníka.",
      },
    ],
  },
  {
    title: "Chatboty",
    tone: "coral",
    copy: "Rozhovor, ktorý odpovie a pripraví použiteľný dopyt.",
    items: [
      {
        label: "Dopytový asistent",
        desc: "Pýta sa presne na to, čo pri každej zákazke potrebujete vedieť — a na nič nezabudne.",
        inputs: ["Odpovede zákazníka", "Fotky a prílohy"],
        output: "Kompletný dopyt s celým kontextom na e-mail.",
      },
      {
        label: "Produktový poradca",
        desc: "Odporúča z vašej ponuky podľa toho, čo zákazník naozaj rieši — ako skúsený predajca, nonstop.",
        inputs: ["Potreba zákazníka", "Preferencie"],
        output: "Odporúčanie produktu aj s dôvodom.",
      },
      {
        label: "Časté otázky",
        desc: "Odpovede na opakujúce sa otázky o cene, termínoch či službách — okamžite a vždy rovnako presne.",
        inputs: ["Otázka zákazníka"],
        output: "Odpoveď z vašich podkladov, nie vymyslená.",
      },
      {
        label: "Kvalifikácia dopytu",
        desc: "Zistí rozsah, termín aj vážnosť záujmu skôr, než dopyt pristane u vás na stole.",
        inputs: ["Rozsah", "Termín", "Rozpočet"],
        output: "Ohodnotený dopyt — viete, komu sa venovať skôr.",
      },
      {
        label: "Objednávkový asistent",
        desc: "Prevedie objednávkou krok za krokom a zozbiera všetky údaje bez jediného formulára.",
        inputs: ["Výber", "Doprava", "Kontakt"],
        output: "Kompletná objednávka pripravená na spracovanie.",
      },
    ],
  },
  {
    title: "Prepojenia",
    tone: "ink",
    copy: "Dopyt skončí presne tam, kde s ním ďalej pracujete.",
    items: [
      {
        label: "E-mail s celým kontextom",
        desc: "Každý dopyt príde ako prehľadný e-mail so všetkými odpoveďami, výpočtom aj kontaktom.",
        inputs: ["Ľubovoľný nástroj vyššie"],
        output: "E-mail, na ktorý sa dá rovno odpovedať ponukou.",
      },
      {
        label: "Kalendár a termíny",
        desc: "Rezervácie a dohodnuté termíny sa zapisujú priamo do vášho kalendára.",
        inputs: ["Voľné termíny", "Údaje zákazníka"],
        output: "Udalosť v kalendári bez prepisovania.",
      },
      {
        label: "Google tabuľka",
        desc: "Každý dopyt pribudne ako nový riadok v tabuľke — prehľad bez systému navyše.",
        inputs: ["Dáta z nástroja"],
        output: "Živý prehľad dopytov na jednom mieste.",
      },
      {
        label: "CRM či interný systém",
        desc: "Dopyty tečú priamo do systému, s ktorým už dnes pracujete — bez kopírovania.",
        inputs: ["Dáta z nástroja"],
        output: "Nový záznam v CRM aj s celým kontextom.",
      },
      {
        label: "Vlastné API",
        desc: "Napojenie na čokoľvek, čo má rozhranie — sklad, fakturáciu či výrobu.",
        inputs: ["Dáta z nástroja"],
        output: "Automatický zápis tam, kam potrebujete.",
      },
    ],
  },
] as const;

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
  const magneticCta = useMagnetic<HTMLAnchorElement>(0.055);

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
          <h1 aria-label="Chatboty, ktoré zvyšujú konverzie a pripravujú dopyty.">
            <span className="lp-hero-line" aria-hidden="true">
              <motion.span variants={heroLine}>Chatboty, ktoré</motion.span>
            </span>
            <span className="lp-hero-line" aria-hidden="true">
              <motion.span variants={heroLine}>zvyšujú konverzie</motion.span>
            </span>
            <span className="lp-hero-line" aria-hidden="true">
              <motion.em variants={heroLine}>a pripravujú dopyty.</motion.em>
            </span>
          </h1>
          <motion.p className="lp-hero-lead" variants={sequenceItem}>
            Navrhujem chatboty na mieru — od jednoduchého asistenta až po chatbot s kalkulačkou,
            konfigurátorom alebo rezerváciami. Zákazník dostane odpoveď hneď a vy pripravený dopyt.
          </motion.p>
          <motion.div className="lp-actions" variants={sequenceItem}>
            <Link to="/kontakt" className="lp-button lp-button-primary" ref={magneticCta}>
              <span className="lp-button-content">
                Chcem chatbot na mieru <ArrowRight size={17} />
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
            <p>Čo má váš chatbot zvládnuť?</p>
            <div className="lp-assistant-chips" role="group" aria-label="Typ chatbota">
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

function SolutionCard({
  solution,
  index,
}: {
  solution: (typeof solutions)[number];
  index: number;
}) {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const Icon = solution.icon;

  return (
    <motion.article
      ref={cardRef}
      className="lp-solution-pill"
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={
        reducedMotion ? { duration: 0 } : { duration: 0.62, delay: index * 0.08, ease: premiumEase }
      }
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType === "touch") return;
        const card = event.currentTarget;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5;
        const y = (event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5;
        card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--tilt-x", "0deg");
        event.currentTarget.style.setProperty("--tilt-y", "0deg");
      }}
    >
      <Icon aria-hidden="true" />
      <div>
        <h3>{solution.title}</h3>
        <p>{solution.copy}</p>
        <button
          type="button"
          className="lp-solution-cta"
          onClick={() =>
            openSiteAssistant({
              source: "solution-card",
              entry: "builder",
              category: solution.title,
            })
          }
        >
          Navrhnúť tento chatbot <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </motion.article>
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
          eyebrow="Rozdiel v praxi"
          copy="Chatbot odpovie okamžite, zozbiera správne vstupy a odovzdá vám dopyt pripravený na ďalší krok."
        >
          Menej zisťovania. <em>Viac pripravených dopytov.</em>
        </Heading>

        <Reveal className="lp-comparison" direction="right" distance={46}>
          <div className="lp-switch" role="group" aria-label="Porovnanie webu bez a s chatbotom">
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
              <span className="lp-control-label">Bez chatbota</span>
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
              <span className="lp-control-label">S chatbotom</span>
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
          {solutions.map((solution, index) => (
            <SolutionCard key={solution.title} solution={solution} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityGroup({
  group,
  index,
}: {
  group: (typeof capabilityGroups)[number];
  index: number;
}) {
  const [active, setActive] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const { title, tone, copy, items } = group;
  const activeItem = items.find((item) => item.label === active) ?? null;

  return (
    <Reveal className="lp-caps-row" amount={0.2}>
      <div className="lp-caps-row-head" data-tone={tone}>
        <span className="lp-caps-num">0{index + 1}</span>
        <div>
          <h3>{title}</h3>
          <p>{copy}</p>
        </div>
      </div>
      <div className="lp-caps-row-body">
        <div className="lp-caps-chips" role="group" aria-label={title}>
          {items.map((item) => {
            const isActive = active === item.label;
            return (
              <motion.button
                type="button"
                key={item.label}
                className="lp-chip"
                data-tone={tone}
                data-active={isActive}
                aria-expanded={isActive}
                onClick={() => setActive(isActive ? null : item.label)}
                whileTap={reducedMotion ? undefined : { scale: 0.965 }}
              >
                {isActive ? (
                  <motion.span
                    className="lp-chip-fill"
                    layoutId={`caps-fill-${title}`}
                    transition={liquidSpring}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="lp-chip-label">{item.label}</span>
                <span className="lp-chip-icon" aria-hidden="true">
                  <Plus />
                </span>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence initial={false} mode="wait">
          {activeItem ? (
            <motion.div
              className="lp-caps-detail"
              key={activeItem.label}
              role="status"
              aria-live="polite"
              initial={reducedMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reducedMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.42, ease: premiumEase }}
            >
              <div className="lp-caps-detail-inner" data-tone={tone}>
                <div className="lp-caps-detail-copy">
                  <h4>{activeItem.label}</h4>
                  <p>{activeItem.desc}</p>
                  <button
                    type="button"
                    className="lp-caps-detail-cta"
                    onClick={() =>
                      openSiteAssistant({ source: "capability-chip", category: activeItem.label })
                    }
                  >
                    Otvoriť krátke zadanie <ArrowUpRight aria-hidden="true" />
                  </button>
                </div>
                <dl className="lp-caps-detail-spec">
                  <div>
                    <dt>Vstupy od zákazníka</dt>
                    <dd>
                      <span className="lp-caps-inputs">
                        {activeItem.inputs.map((input) => (
                          <span className="lp-caps-input" key={input}>
                            {input}
                          </span>
                        ))}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>Výstup pre vás</dt>
                    <dd>{activeItem.output}</dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

function Capabilities() {
  return (
    <section className="lp-caps" id="moznosti">
      <div className="container-page">
        <Heading
          eyebrow="Čo všetko viem postaviť"
          copy="Vyberte, čo je najbližšie k vašej situácii — po rozkliknutí uvidíte, čo nástroj robí, aké vstupy zbiera a čo z neho dostanete."
        >
          Ak sa to dá opísať pravidlami, <em>dá sa to postaviť.</em>
        </Heading>

        <div className="lp-caps-rows">
          {capabilityGroups.map((group, groupIndex) => (
            <CapabilityGroup key={group.title} group={group} index={groupIndex} />
          ))}
        </div>

        <Reveal className="lp-caps-note" delay={0.08}>
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
