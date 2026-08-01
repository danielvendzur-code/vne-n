import { Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValueEvent,
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
  Mail,
  MessageCircle,
  PenLine,
  Rocket,
  SlidersHorizontal,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { GlideField } from "@/components/effects/GlideField";
import { Symbol } from "@/components/Symbol";
import { DeratScrollStory } from "@/components/site/DeratScrollStory";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useNarrowViewport, useReducedMotion } from "@/hooks/useReducedMotion";
import { useTimelineProgress } from "@/hooks/useTimelineProgress";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./PremiumLanding.css";

type ComparisonMode = "without" | "with";
type HeroToolKey = "chatbot" | "calculator" | "configurator" | "assistant";
type RevealDirection = "up" | "left" | "right";

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
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
    label: "AI chatbot",
    icon: Bot,
    text: "Odpovedá vo dne v noci, zistí, čo zákazník chce, a pošle vám to aj s kontaktom.",
  },
  calculator: {
    label: "Chatbot s kalkulačkou",
    icon: Calculator,
    text: "Zákazník vyberie možnosti a chatbot hneď vypočíta cenu, spotrebu alebo návratnosť podľa vašich pravidiel.",
    combo: true,
  },
  configurator: {
    label: "Chatbot s konfigurátorom",
    icon: SlidersHorizontal,
    text: "Chatbot prevedie zákazníka výberom produktu, variantov a doplnkov a odošle kompletné zadanie.",
    combo: true,
  },
  assistant: {
    label: "Chatbot ako sprievodca",
    icon: Sparkles,
    text: "Interaktívny sprievodca, ktorý zákazníka na webe navedie k správnemu ďalšiemu kroku.",
  },
} satisfies Record<HeroToolKey, { label: string; icon: typeof Bot; text: string; combo?: boolean }>;

const comparisons = {
  without: {
    title: "Kontakt bez kontextu.",
    copy: "Z formulára príde meno a e-mail. Všetko ostatné musíte vypýtať sami.",
    items: ["Odpoveď až neskôr", "Rovnaké otázky dookola", "Nejasná priorita dopytu"],
  },
  with: {
    title: "Dopyt pripravený na ďalší krok.",
    copy: "Zákazník dostane odpoveď hneď. Vám príde e-mail so všetkým, čo potrebujete vedieť.",
    items: ["Odpoveď ihneď", "Kompletný kontext", "Menej ručného zisťovania"],
  },
};

const heroProof = [
  { icon: BadgeCheck, text: "Živá realizácia, nie maketa" },
  { icon: PenLine, text: "Vlastná logika podľa vašej firmy" },
  { icon: Clock3, text: "Od návrhu po nasadenie priamo so mnou" },
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
    copy: "Chatbot odpovie a pripraví použiteľný dopyt.",
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
    copy: "Poviete mi, čo predávate a čo vás najviac zdržuje.",
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

function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  distance = 38,
  amount = 0.18,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  distance?: number;
  /** Aká časť prvku musí byť vidieť, než sa spustí odhalenie. */
  amount?: number;
  "data-open"?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const narrow = useNarrowViewport();
  // Na mobile sa všetko odhaľuje nahor. Bočný posun v 390 px stĺpci
  // vyzeral trhane a časť prvkov prišla mimo obrazovky.
  const x = narrow || direction === "up" ? 0 : direction === "left" ? -distance : distance;
  const y = narrow ? 22 : direction === "up" ? Math.min(distance, 28) : 0;
  const enterDuration = narrow ? 0.5 : 0.68;
  const exitDuration = narrow ? 0.24 : 0.3;

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : "hidden"}
      whileInView={reducedMotion ? undefined : "visible"}
      variants={{
        hidden: {
          opacity: 0,
          x,
          y,
          transition: { duration: exitDuration, ease: premiumEase },
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: enterDuration,
            delay: narrow ? Math.min(delay, 0.06) : delay,
            ease: premiumEase,
          },
        },
      }}
      // Na úzkej obrazovke sú karty vysoké, takže 18 % prvku znamenalo
      // veľa scrollovania, kým sa vôbec začali odhaľovať.
      viewport={{
        once: false,
        amount: narrow ? 0.06 : amount,
        margin: narrow ? "-4% 0px -8% 0px" : "-8% 0px -8% 0px",
      }}
      {...rest}
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
      viewport={{ once: false, amount: 0.28, margin: "-8% 0px -8% 0px" }}
      variants={{
        hidden: {
          opacity: 0,
          x: -34,
          transition: { duration: 0.3, ease: premiumEase },
        },
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
          <motion.p className="lp-hero-context" variants={sequenceItem}>
            Pre klientov po návrhu v e-maile
          </motion.p>
          <h1 aria-label="Návrh už máte. Teraz si pozrite, ako bude pracovať na vašom webe.">
            <span className="lp-hero-line" aria-hidden="true">
              <motion.span variants={heroLine}>Návrh už máte.</motion.span>
            </span>
            <span className="lp-hero-line" aria-hidden="true">
              <motion.span variants={heroLine}>Teraz si pozrite,</motion.span>
            </span>
            <span className="lp-hero-line" aria-hidden="true">
              <motion.em variants={heroLine}>ako bude pracovať.</motion.em>
            </span>
          </h1>
          <motion.p className="lp-hero-lead" variants={sequenceItem}>
            Na jednom mieste nájdete živú realizáciu, konkrétne možnosti riešenia, postup spolupráce
            a priamy kontakt na mňa.
          </motion.p>
          <motion.div className="lp-actions" variants={sequenceItem}>
            <a href="#realizacie" className="lp-button lp-hero-cta lp-hero-cta--primary">
              <span className="lp-button-content">
                Pozrieť živú realizáciu <ArrowRight size={17} />
              </span>
            </a>
            <a href="#moznosti" className="lp-button lp-hero-cta lp-hero-cta--secondary">
              <span className="lp-button-content">
                Čo môže riešenie robiť <ArrowUpRight size={17} />
              </span>
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
            <p>Vyberte, čo má web robiť</p>
            <div className="lp-hero-picker" role="group" aria-label="Typ riešenia">
              {(Object.entries(heroTools) as [HeroToolKey, (typeof heroTools)[HeroToolKey]][]).map(
                ([key, tool]) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      type="button"
                      key={key}
                      className="lp-hero-pick"
                      data-active={activeTool === key}
                      aria-pressed={activeTool === key}
                      data-chip-kind="hero"
                      data-selected={activeTool === key}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveTool(key);
                      }}
                    >
                      <span className="lp-hero-pick-icon" aria-hidden="true">
                        <Icon size={16} />
                      </span>
                      <span className="lp-hero-pick-label">{tool.label}</span>
                    </button>
                  );
                },
              )}
            </div>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                className="lp-assistant-answer"
                key={activeTool}
                layout="position"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                initial={reducedMotion ? false : { opacity: 0, x: 9, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -7, filter: "blur(3px)" }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: premiumEase }}
              >
                <Check />
                <span>{heroTools[activeTool].text}</span>
              </motion.div>
            </AnimatePresence>
            <button
              type="button"
              className="lp-assistant-cta lp-sweep-action"
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
  const swipeStart = useRef<number | null>(null);

  return (
    <section className="lp-value" id="nastroje">
      <div className="container-page">
        <Heading
          eyebrow="Rozdiel v praxi"
          copy="Chatbot odpovie hneď, opýta sa na to podstatné a pošle vám hotový dopyt."
        >
          Menej zisťovania. <em>Viac pripravených dopytov.</em>
        </Heading>

        <Reveal className="lp-comparison" direction="right" distance={46}>
          <div
            className="lp-switch lp-switch--clean"
            role="group"
            aria-label="Porovnanie webu bez a s chatbotom"
            data-mode={mode}
            onPointerDown={(event) => {
              swipeStart.current = event.clientX;
            }}
            onPointerUp={(event) => {
              const start = swipeStart.current;
              swipeStart.current = null;
              if (start === null) return;
              const dx = event.clientX - start;
              if (dx > 26) setMode("with");
              else if (dx < -26) setMode("without");
            }}
            onPointerCancel={() => {
              swipeStart.current = null;
            }}
          >
            <span className="lp-switch-thumb" aria-hidden="true" />
            <button
              type="button"
              data-active={mode === "without"}
              aria-pressed={mode === "without"}
              onClick={() => setMode("without")}
            >
              <span className="lp-control-label">Bez chatbota</span>
            </button>
            <button
              type="button"
              data-active={mode === "with"}
              aria-pressed={mode === "with"}
              onClick={() => setMode("with")}
            >
              <span className="lp-control-label">S chatbotom</span>
            </button>
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              className="lp-comparison-body"
              key={mode}
              data-mode={mode}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.24, ease: premiumEase }}
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
  // Celá skupina je zbalená. Zoznam možností mal na mobile 2514 px,
  // takže návštevník scrolloval cez štyri otvorené bloky naraz.
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const { title, tone, copy, items } = group;
  const activeItem = items.find((item) => item.label === active) ?? null;
  const panelId = `lp-caps-panel-${index}`;

  return (
    <Reveal
      className="lp-caps-row"
      amount={0.16}
      direction={index % 2 === 0 ? "left" : "right"}
      distance={32}
      data-open={open}
    >
      <button
        type="button"
        className="lp-caps-row-head"
        data-tone={tone}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen((value) => !value);
          if (open) setActive(null);
        }}
      >
        <span className="lp-caps-num">0{index + 1}</span>
        <div>
          <h3>{title}</h3>
          <p>{copy}</p>
        </div>
        <span className="lp-caps-count">
          <i aria-hidden="true" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="lp-caps-row-body"
            id={panelId}
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.34, ease: premiumEase }}
            style={{ overflow: "hidden" }}
          >
            <div className="lp-caps-chips" role="group" aria-label={title}>
              {items.map((item) => {
                const isActive = active === item.label;
                return (
                  <button
                    type="button"
                    key={item.label}
                    className="lp-chip"
                    data-tone={tone}
                    data-active={isActive}
                    aria-expanded={isActive}
                    data-chip-kind="capability"
                    data-selected={isActive}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActive(isActive ? null : item.label);
                    }}
                  >
                    <span className="lp-chip-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence initial={false} mode="popLayout">
              {activeItem ? (
                <motion.div
                  className="lp-caps-detail"
                  key={activeItem.label}
                  layout="position"
                  role="status"
                  aria-live="polite"
                  initial={
                    reducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, x: 12, y: 4, filter: "blur(5px)" }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    filter: "blur(0px)",
                    transition: reducedMotion
                      ? { duration: 0 }
                      : { duration: 0.3, ease: premiumEase },
                  }}
                  exit={
                    reducedMotion
                      ? { opacity: 1 }
                      : {
                          opacity: 0,
                          x: -8,
                          filter: "blur(3px)",
                          transition: { duration: 0.15, ease: premiumEase },
                        }
                  }
                >
                  <div className="lp-caps-detail-inner" data-tone={tone}>
                    <div className="lp-caps-detail-copy">
                      <h4>{activeItem.label}</h4>
                      <p>{activeItem.desc}</p>
                      <button
                        type="button"
                        className="lp-caps-detail-cta"
                        onClick={() =>
                          openSiteAssistant({
                            source: "capability-chip",
                            category: activeItem.label,
                          })
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
          </motion.div>
        ) : null}
      </AnimatePresence>
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

        {/* Tlačidlo bolo predtým vnorené priamo vo vete, takže sa pri
            zalomení prekrývalo s okolitým textom. Teraz stojí samostatne
            pod ním a nemá sa s čím biť. */}
        <Reveal className="lp-caps-note" delay={0.08}>
          <CalendarClock aria-hidden="true" />
          <div className="lp-caps-note__body">
            <p>Nie je tu to, čo hľadáte? Napíšte to vlastnými slovami.</p>
            <button type="button" onClick={() => openSiteAssistant({ source: "capability-note" })}>
              Povedať to chatbotovi <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <Reveal
      className="lp-faq-item"
      data-open={open}
      direction="right"
      distance={24}
      amount={0.12}
      delay={Math.min(index * 0.045, 0.18)}
    >
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
    </Reveal>
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
        <div className="lp-faq-list">
          {faqs.map((faq, index) => (
            <FaqItem key={faq.q} question={faq.q} answer={faq.a} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();
  const { scaleY, reached } = useTimelineProgress(listRef, {
    nodeSelector: ".lp-step-node",
    offset: ["start 0.86", "end 0.5"],
    count: process.length,
  });

  return (
    <div className="lp-timeline-wrap">
      {reducedMotion ? null : (
        <motion.span className="lp-timeline-progress" style={{ scaleY }} aria-hidden="true" />
      )}
      <ol className="lp-process-list" ref={listRef}>
        {process.map(({ icon: Icon, title, copy }, index) => (
          <li key={title} data-reached={reducedMotion || index < reached}>
            <span className="lp-step-node" aria-hidden="true">
              <i />
            </span>
            <span className="lp-step-icon" aria-hidden="true">
              <Icon />
            </span>
            <div className="lp-step-body">
              <span className="lp-step-num">Krok 0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProcessAndCta() {
  const reducedMotion = useReducedMotion();
  const magneticFinal = useMagnetic<HTMLAnchorElement>(0.12);

  return (
    <section className="lp-process" id="spolupraca">
      <div className="container-page lp-process-grid">
        <div>
          <Heading
            eyebrow="Ako spolupráca prebieha"
            copy="Od prvých otázok po nasadenie máte vždy jasný ďalší krok."
          >
            Krátko, zrozumiteľne <em>a bez chaosu.</em>
          </Heading>
          <ProcessTimeline />
        </div>

        <Reveal className="lp-final-card" direction="right" distance={44}>
          <Symbol size={52} />
          <p>Máte návrh v e-maile alebo nápad v hlave?</p>
          <h2>Stačí mi povedať, čo vám sedí. Ďalší krok pripravím ja.</h2>
          <Link to="/kontakt" className="lp-button lp-button-light" ref={magneticFinal}>
            <span className="lp-button-content">
              Dohodnúť ďalší krok <ArrowRight />
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
        <PageProgress />
        <Hero />
        <DeratScrollStory />
        <ValueSection />
        <Capabilities />
        <FaqSection />
        <ProcessAndCta />
      </div>
    </MotionConfig>
  );
}
