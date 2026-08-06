import { Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
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
import { liveTools as liveToolLinks, realizations } from "@/data/realizations";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTimelineProgress } from "@/hooks/useTimelineProgress";
import { openSiteAssistant } from "@/lib/site-assistant";
import { MOTION, premiumEase, Reveal, wipeUp } from "./motion-primitives";
import "./PremiumLanding.css";
import "./LandingFinish.css";

type ComparisonMode = "without" | "with";
type HeroToolKey = "chatbot" | "calculator" | "configurator" | "assistant";

/**
 * Domovská stránka má dve verzie textu.
 *
 * `public` je to, čo uvidí ktokoľvek, kto na web príde z vyhľadávania —
 * hovorí o službe ako takej. `client` je verzia pre ľudí, ktorým som
 * poslal návrh e-mailom, a nadväzuje priamo naň. Líši sa len obsah hero
 * sekcie; zvyšok stránky je pre obe verzie rovnaký.
 */
export type LandingVariant = "public" | "client";

const heroSequence: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: MOTION.stagger, delayChildren: 0.06 } },
};

// Riadok nadpisu sa posúva o 24 px, nie o celú svoju výšku. Text letiaci
// cez 112 % vlastnej výšky je efekt z portfólia; web, ktorý má predať
// službu, potrebuje nadpis čitateľný hneď.
const heroLine: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: MOTION.slow, ease: premiumEase },
  },
};

const sequenceItem: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: MOTION.base, ease: premiumEase },
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
  { icon: BadgeCheck, text: "Reálne nasadené weby, nie makety" },
  { icon: PenLine, text: "Vlastná logika podľa vašej firmy" },
  { icon: Clock3, text: "Od návrhu po nasadenie s tímom Môj Chatbot" },
];

const heroCopy = {
  public: {
    context: "Chatboty · kalkulačky · konfigurátory",
    lines: ["Váš web odpovie", "skôr, než", "zákazník odíde."],
    aria: "Váš web odpovie skôr, než zákazník odíde.",
    lead: "Tvoríme chatboty, kalkulačky a konfigurátory na mieru. Zákazník dostane odpoveď hneď a vám príde dopyt, s ktorým sa dá rovno pracovať.",
    // Prvé tlačidlo vedie k dohode, nie na ďalšie prezeranie. Predtým
    // obe viedli len o kus nižšie na tú istú stránku.
    primary: { label: "Nezáväzná konzultácia", to: "/kontakt" },
    secondary: { label: "Pozrieť realizácie", href: "#realizacie" },
  },
  client: {
    context: "Pre klientov po návrhu v e-maile",
    lines: ["Návrh už máte.", "Teraz si pozrite,", "ako bude pracovať."],
    aria: "Návrh už máte. Teraz si pozrite, ako bude pracovať na vašom webe.",
    lead: "Na jednom mieste nájdete živú realizáciu, konkrétne možnosti riešenia, postup spolupráce a priamy kontakt na náš tím.",
    primary: { label: "Dohodnúť ďalší krok", to: "/kontakt" },
    secondary: { label: "Pozrieť živú realizáciu", href: "#pripadova-studia" },
  },
} satisfies Record<
  LandingVariant,
  {
    context: string;
    lines: string[];
    aria: string;
    lead: string;
    primary: { label: string; to: string };
    secondary: { label: string; href: string };
  }
>;

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
    title: "Úvodný brief",
    copy: "Spoločne pomenujeme cieľ, najčastejšie otázky zákazníkov a údaje, ktoré má riešenie zbierať.",
    result: "Výstup: jasný rozsah prvej verzie a zoznam podkladov.",
  },
  {
    icon: Workflow,
    title: "Tok, logika a prototyp",
    copy: "Navrhneme otázky, rozhodovanie, výpočty aj rozhranie skôr, než sa začne samotný vývoj.",
    result: "Výstup: klikateľný návrh a odsúhlasená logika.",
  },
  {
    icon: BadgeCheck,
    title: "Vývoj a spoločné testovanie",
    copy: "Riešenie postavíme a preveríme na reálnych scenároch, mobile aj desktope. Pripomienky zapracujeme pred nasadením.",
    result: "Výstup: otestovaná verzia pripravená na ostrú prevádzku.",
  },
  {
    icon: Rocket,
    title: "Nasadenie a zlepšovanie",
    copy: "Nástroj prepojíme s e-mailom alebo ďalšími systémami, vložíme na web a podľa reálnych dát doladíme detaily.",
    result: "Výstup: živé riešenie a jasný plán ďalších úprav.",
  },
];

function AnimatedPageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.22 });
  // Dráha okolo výplne — bez nej nebolo na začiatku stránky čo vidieť
  // a pásik splýval s pozadím pod hlavičkou.
  return (
    <div className="lp-progress-track" aria-hidden="true">
      <motion.div className="lp-progress" style={{ scaleX }} />
    </div>
  );
}

function PageProgress() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? null : <AnimatedPageProgress />;
}

function Heading({
  eyebrow,
  index,
  children,
  copy,
}: {
  eyebrow: string;
  /** Poradie sekcie. Stojí na mieste, kde bola predtým krátka čiarka. */
  index?: string;
  children: ReactNode;
  copy?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="lp-heading"
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      // Jednosmerné, rovnako ako zvyšok webu: nadpis sa odhalí raz
      // a ostane. Pri obojsmernom nastavení sa pri scrollovaní hore
      // prehrával znova a text bol v polovici obrazovky neviditeľný.
      viewport={{ once: true, amount: 0.25, margin: "-6% 0px -6% 0px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          // Nadpis nabieha po častiach: najprv linka s popiskom, potom
          // samotný nadpis, nakoniec veta pod ním. Rodič sa len odkryje,
          // pohyb si robí každá časť sama — inak by sa posun zdvojil.
          transition: {
            duration: MOTION.fast,
            ease: premiumEase,
            staggerChildren: MOTION.stagger,
          },
        },
      }}
    >
      <motion.p className="lp-eyebrow" variants={sequenceItem}>
        {index ? <b className="lp-eyebrow-num">{index}</b> : null}
        {eyebrow}
      </motion.p>
      {/* Nadpis sa zotrie zdola nahor, zvyšok len nabehne. */}
      <motion.h2 variants={wipeUp}>{children}</motion.h2>
      {copy ? (
        <motion.p className="lp-heading-copy" variants={sequenceItem}>
          {copy}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function Hero({ variant }: { variant: LandingVariant }) {
  const [activeTool, setActiveTool] = useState<HeroToolKey>("chatbot");
  // Kým návštevník neklikol, žiadny štítok nie je vybraný. Karta ukazuje
  // prvú odpoveď, ale plnú tmavú výplň dostane štítok až po kliknutí —
  // inak to vyzerá, akoby už niečo zvolil.
  const [picked, setPicked] = useState(false);
  const reducedMotion = useReducedMotion();
  const copy = heroCopy[variant];

  // Hero neodchádza ako celok. Text stúpa o niečo rýchlejšie než karta
  // a oba plynú preč — dva rôzne rýchlosti dajú scéne hĺbku. Hodnoty
  // idú cez pružinu, takže pohyb nekopíruje trhanie kolieska myši.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  // Pri vypnutých animáciách sa hodnoty nesmú odpojiť, len zrovnať.
  // Odpojenie nechá v elemente poslednú zapísanú hodnotu, a keď ju stihla
  // zapísať ešte nedomeraná pružina, hero ostane natrvalo priehľadné.
  const copyY = useTransform(smooth, [0, 1], [0, reducedMotion ? 0 : -110]);
  const stageY = useTransform(smooth, [0, 1], [0, reducedMotion ? 0 : -58]);
  const fade = useTransform(smooth, [0, 0.75], [1, reducedMotion ? 1 : 0]);
  const drift = { y: copyY, opacity: fade };
  const stageDrift = { y: stageY, opacity: fade };

  return (
    <section className="lp-hero" id="uvod" data-variant={variant} ref={heroRef}>
      <div className="lp-hero-glide" aria-hidden="true">
        {/* Väčší dosah aj sila — pri pôvodnom nastavení bola reakcia na
            bielom podklade sotva badateľná. */}
        <GlideField className="glide-field--hero" radius={190} intensity={1.15} />
      </div>
      <div className="lp-hero-glow" aria-hidden="true" />
      <div className="container-page lp-hero-grid">
        <motion.div
          className="lp-hero-copy"
          variants={heroSequence}
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          style={drift}
        >
          <motion.p className="lp-hero-context" variants={sequenceItem}>
            {copy.context}
          </motion.p>
          <h1 aria-label={copy.aria}>
            {copy.lines.map((line, index) => (
              <span className="lp-hero-line" aria-hidden="true" key={line}>
                {index === copy.lines.length - 1 ? (
                  <motion.em variants={heroLine}>{line}</motion.em>
                ) : (
                  <motion.span variants={heroLine}>{line}</motion.span>
                )}
              </span>
            ))}
          </h1>
          <motion.p className="lp-hero-lead" variants={sequenceItem}>
            {copy.lead}
          </motion.p>
          <motion.div className="lp-actions" variants={sequenceItem}>
            <Link to={copy.primary.to} className="lp-button lp-hero-cta lp-hero-cta--primary">
              <span className="lp-button-content">
                {copy.primary.label} <ArrowRight size={17} />
              </span>
            </Link>
            <a href={copy.secondary.href} className="lp-button lp-hero-cta lp-hero-cta--secondary">
              <span className="lp-button-content">
                {copy.secondary.label} <ArrowUpRight size={17} />
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
            reducedMotion
              ? { duration: 0 }
              : { duration: MOTION.slow, delay: 0.12, ease: premiumEase }
          }
          style={stageDrift}
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
                      data-active={picked && activeTool === key}
                      aria-pressed={picked && activeTool === key}
                      data-chip-kind="hero"
                      data-selected={picked && activeTool === key}
                      data-preview={!picked && activeTool === key}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        setPicked(true);
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
                transition={
                  reducedMotion ? { duration: 0 } : { duration: MOTION.fast, ease: premiumEase }
                }
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
                Vyskúšať chatbota <ArrowUpRight />
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
    <section className="lp-value" id="nastroje" data-band="soft" data-index="02">
      <div className="container-page">
        <Heading
          eyebrow="Rozdiel v praxi"
          index="02"
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
              transition={
                reducedMotion ? { duration: 0 } : { duration: MOTION.fast, ease: premiumEase }
              }
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
            transition={
              reducedMotion ? { duration: 0 } : { duration: MOTION.base, ease: premiumEase }
            }
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
                      : { duration: MOTION.base, ease: premiumEase },
                  }}
                  exit={
                    reducedMotion
                      ? { opacity: 1 }
                      : {
                          opacity: 0,
                          x: -8,
                          filter: "blur(3px)",
                          transition: { duration: MOTION.fast, ease: premiumEase },
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
    <section className="lp-caps" id="moznosti" data-band="soft" data-index="04">
      <div className="container-page">
        <Heading
          eyebrow="Čo všetko vieme postaviť"
          index="04"
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

function Realizations() {
  return (
    <section className="lp-portfolio" id="realizacie" data-band="light" data-index="03">
      <div className="container-page">
        <Heading
          eyebrow="Vybrané realizácie"
          index="03"
          copy="Každý náhľad je web, ktorý naozaj beží na vlastnej doméne. Kliknite a pozrite si ho živý."
        >
          Reálne weby. <em>Žiadne generické makety.</em>
        </Heading>

        <div className="lp-project-grid">
          {realizations.map((project, index) => (
            <Reveal
              className="lp-project"
              key={project.name}
              direction={index % 2 === 0 ? "left" : "right"}
              distance={34}
              delay={Math.min(index * 0.07, 0.16)}
            >
              <a href={project.href} target="_blank" rel="noreferrer">
                <ProjectImage src={project.image} alt={project.alt} eager={index === 0} />
                {/* Doména priamo na náhľade — návštevník vidí, že web
                    naozaj beží, a vie si ho hneď overiť. */}
                <span className="lp-project-domain" aria-hidden="true">
                  <i />
                  {project.domain}
                </span>
                <div className="lp-project-copy">
                  <span>0{index + 1}</span>
                  <p>{project.type}</p>
                  <h3>{project.name}</h3>
                  <small>{project.result}</small>
                  <b>
                    Pozrieť živý web <ExternalLink />
                  </b>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="lp-live-tools" delay={0.08}>
          <span>Živé nástroje na vyskúšanie</span>
          {liveToolLinks.map(({ name, href }) => (
            <a key={name} href={href} target="_blank" rel="noreferrer">
              {name} <ArrowUpRight />
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function ProjectImage({ src, alt, eager }: { src: string; alt: string; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="lp-project-media" data-loaded={loaded}>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "low"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
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
            transition={
              reducedMotion ? { duration: 0 } : { duration: MOTION.base, ease: premiumEase }
            }
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
    <section className="lp-faq" id="otazky" data-band="light" data-index="05">
      <div className="container-page lp-faq-grid">
        <div className="lp-faq-side">
          <Heading
            eyebrow="Časté otázky"
            index="05"
            copy="Ak tu odpoveď nie je, napíšte nám — alebo sa spýtajte priamo chatbota v rohu obrazovky."
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // Os sa plní, kým prechádza obrazovkou, a je hotová skôr, než z nej
  // odíde. S pôvodným rozsahom sa posledný krok rozsvietil až vtedy, keď
  // už bola koľaj dávno nad horným okrajom.
  const { progress, reached } = useTimelineProgress(wrapRef, {
    offset: ["start 0.95", "end 0.85"],
    count: process.length,
  });

  return (
    <div
      className="lp-timeline"
      ref={wrapRef}
      style={{ "--steps": process.length } as React.CSSProperties}
    >
      {/* Koľaj a čiara, ktorá po nej narastá. Smer si vyberá CSS podľa
          šírky obrazovky — na širokej doprava, na mobile nadol. */}
      <div className="lp-timeline-rail" aria-hidden="true">
        <span className="lp-timeline-track" />
        {reducedMotion ? (
          <span className="lp-timeline-fill" data-static="true" />
        ) : (
          <motion.span
            className="lp-timeline-fill"
            style={{ "--tl-progress": progress } as React.CSSProperties}
          />
        )}
      </div>

      <ol className="lp-tl-steps">
        {process.map(({ icon: Icon, title, copy, result }, index) => (
          <li key={title} data-reached={reducedMotion || index < reached}>
            {/* Uzol na koľaji. Na širokej obrazovke je to plný krúžok
                s poradovým číslom — tak vyzeral, kým fungoval najlepšie.
                Na mobile ostáva prázdny bod, ktorý sa vyplní. */}
            <span className="lp-tl-node" aria-hidden="true">
              <b>{index + 1}</b>
            </span>
            <div className="lp-tl-card">
              <span className="lp-tl-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="lp-tl-num">Krok 0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <p className="lp-tl-result">
                <Check aria-hidden="true" /> {result}
              </p>
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
    <section className="lp-process" id="spolupraca" data-band="forest" data-index="06">
      <div className="container-page lp-process-grid">
        <div>
          <Heading
            eyebrow="Ako spolupráca prebieha"
            index="06"
            copy="Od prvých otázok po nasadenie máte vždy jasný ďalší krok."
          >
            Krátko, zrozumiteľne <em>a bez chaosu.</em>
          </Heading>
          <ProcessTimeline />
        </div>

        <Reveal className="lp-final-card" direction="right" distance={44}>
          <Symbol size={52} />
          <p>Máte návrh v e-maile alebo nápad, ktorý chcete preveriť?</p>
          <h2>Stačí nám povedať, čo vám sedí. Ďalší krok pripraví tím Môj Chatbot.</h2>
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

/**
 * Svetlo pod kurzorom aj `MotionConfig` sedia v `SiteLayout` a platia pre
 * celý web. Domovská stránka si ich donedávna zakladala ešte raz, vnorene
 * — so zoznamom povrchov, ktorý bol podmnožinou toho vonkajšieho.
 */
export function PremiumLanding({ variant = "public" }: { variant?: LandingVariant }) {
  return (
    <div className="lp-page" data-variant={variant}>
      <PageProgress />
      <Hero variant={variant} />
      <DeratScrollStory />
      <ValueSection />
      <Realizations />
      <Capabilities />
      <FaqSection />
      <ProcessAndCta />
    </div>
  );
}
