import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";
import type { AssistantPreset } from "@/types/assistant";
import { premiumEase } from "./motion-primitives";
import "./SignatureHero.css";

/**
 * Hero domovskej stránky.
 *
 * Vlastník tried `mc-hero-*` je tento súbor a `SignatureHero.css` —
 * nič iné do nich nesiaha, takže sa dá zmeniť na jednom mieste.
 *
 * Kompozícia stojí na kontraste dvoch plôch. Vľavo biela strana s
 * obrovským tvrdením, vpravo tmavá lesná scéna, ktorá vyteká za pravú
 * hranu okna. Scéna nie je karta v mriežke — je to plocha zarazená do
 * okraja, na ktorej beží samotný produkt: návštevník vyberie, čo má web
 * robiť, a hneď vidí rozhovor aj to, čo z neho firme príde.
 *
 * Tvar bublín je odvodený od značky: tri zaoblené rohy a jeden ostrý
 * v mieste, kde má logo pätku bubliny. Rovnaký tvar používa scéna aj
 * riadky výberu, takže je to systém, nie ozdoba.
 */
export type LandingVariant = "public" | "client";

type ScenarioKey = "chatbot" | "kalkulacka" | "konfigurator" | "eshop";

interface Scenario {
  key: ScenarioKey;
  index: string;
  label: string;
  /** S ktorým režimom sa otvorí chatbot, keď návštevník klikne „Vyskúšať". */
  preset: AssistantPreset;
  /** Čo tento typ riešenia robí — jedna veta, žiadne opakovanie. */
  note: string;
  turns: Array<{ who: "Zákazník" | "Chatbot"; text: string }>;
  /** Výsledok, ktorý z rozhovoru vypadne firme. */
  result: string;
}

const scenarios: Scenario[] = [
  {
    key: "chatbot",
    index: "01",
    label: "Chatbot",
    preset: "inquiry",
    note: "Odpovie zákazníkovi a pripraví dopyt s celým kontextom.",
    turns: [
      { who: "Zákazník", text: "Robíte aj odvoz starého nábytku?" },
      { who: "Chatbot", text: "Áno, aj s vynesením. Z ktorého poschodia a koľko kusov?" },
      { who: "Zákazník", text: "Tretie poschodie bez výťahu, štyri kusy." },
    ],
    result: "Dopyt odoslaný. Adresa, rozsah aj kontakt máte na e-maile.",
  },
  {
    key: "kalkulacka",
    index: "02",
    label: "Kalkulačka",
    preset: "calculator",
    note: "Vypočíta cenu, spotrebu alebo návratnosť podľa vašich pravidiel.",
    turns: [
      { who: "Zákazník", text: "Koľko by stál plot na 42 metrov?" },
      { who: "Chatbot", text: "Panely alebo poplastované pletivo? A akú výšku potrebujete?" },
      { who: "Zákazník", text: "Panely, výška 1,5 metra." },
    ],
    result: "Orientačná cena 3 180 € aj s rozpisom materiálu a montáže.",
  },
  {
    key: "konfigurator",
    index: "03",
    label: "Konfigurátor",
    preset: "product",
    note: "Prevedie výberom variantov a odošle hotové zadanie.",
    turns: [
      { who: "Zákazník", text: "Potrebujem pergolu na terasu 4 × 3 metre." },
      { who: "Chatbot", text: "Hliník alebo drevo? A majú byť lamely polohovateľné?" },
      { who: "Zákazník", text: "Hliník, lamely áno, antracit." },
    ],
    result: "Hotová špecifikácia: variant, rozmery aj doplnky pre ponuku.",
  },
  {
    key: "eshop",
    index: "04",
    label: "E-shop",
    preset: "inquiry",
    note: "Ukáže stav objednávky a vybaví zmenu, vrátenie alebo reklamáciu.",
    turns: [
      { who: "Zákazník", text: "Chcem vrátiť tovar z objednávky 24815." },
      { who: "Chatbot", text: "Objednávku vidím. Vraciate ju celú alebo len jednu položku?" },
      { who: "Zákazník", text: "Len jednu — nesedela veľkosť." },
    ],
    result: "Vrátenie založené. Objednávku, položku aj dôvod máte na e-maile.",
  },
];

const heroCopy = {
  public: {
    kicker: "Chatboty · Kalkulačky · Konfigurátory",
    lines: ["Váš web odpovie", "skôr, než", "zákazník odíde."],
    aria: "Váš web odpovie skôr, než zákazník odíde.",
    lead: "Chatboty, kalkulačky a konfigurátory na mieru: zákazník dostane odpoveď hneď a vám príde dopyt, s ktorým sa dá rovno pracovať.",
    primary: { label: "Nezáväzná konzultácia", to: "/kontakt" },
    cue: { label: "Realizácie", href: "#realizacie" },
  },
  client: {
    kicker: "Pre klientov po návrhu v e-maile",
    lines: ["Návrh už máte.", "Teraz si pozrite,", "ako bude pracovať."],
    aria: "Návrh už máte. Teraz si pozrite, ako bude pracovať.",
    lead: "Na jednom mieste: živá realizácia, konkrétne možnosti riešenia, postup spolupráce aj priamy kontakt na tím.",
    primary: { label: "Dohodnúť ďalší krok", to: "/kontakt" },
    cue: { label: "Živá realizácia", href: "#pripadova-studia" },
  },
} satisfies Record<
  LandingVariant,
  {
    kicker: string;
    lines: string[];
    aria: string;
    lead: string;
    primary: { label: string; to: string };
    /** Terciárna akcia. Nesúťaží s CTA — je to scroll cue v pätke hero. */
    cue: { label: string; href: string };
  }
>;

const proof = ["Reálne nasadené weby", "Logika podľa vašej firmy", "Od návrhu po nasadenie"];

/**
 * Riadok nadpisu sa neodkrýva priehľadnosťou, ale zotretím spoza hrany —
 * `clip-path` beží na kompozítore rovnako lacno ako `opacity`, no text
 * pôsobí, akoby vystúpil zo strany, nie akoby sa zjavil z ničoho.
 */
const claimLine: Variants = {
  hidden: { y: "34%", clipPath: "inset(0 0 108% 0)" },
  visible: {
    y: "0%",
    clipPath: "inset(0 0 -14% 0)",
    transition: { duration: 0.86, ease: premiumEase },
  },
};

const riseItem: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: premiumEase } },
};

const ruleDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.72, ease: premiumEase } },
};

const claimGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.08 } },
};

/**
 * Scéna nepribehne — vysunie sa spoza pravej hrany okna, kam aj patrí.
 * Je to jeden z dvoch výraznejších momentov na stránke; všetko ostatné
 * je subtílne.
 */
const stageArrive: Variants = {
  hidden: { x: "12%", opacity: 0 },
  visible: {
    x: "0%",
    opacity: 1,
    transition: { duration: 0.92, ease: premiumEase, delay: 0.24, staggerChildren: 0.07 },
  },
};

function Thread({ scenario, still }: { scenario: Scenario; still: boolean }) {
  return (
    <div className="mc-hero__demo" key={scenario.key}>
      <motion.ol
        className="mc-hero__thread"
        initial={still ? false : "hidden"}
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {scenario.turns.map((turn) => (
          <motion.li
            key={turn.text}
            className="mc-hero__turn"
            data-who={turn.who === "Chatbot" ? "bot" : "customer"}
            variants={{
              hidden: { opacity: 0, y: 12, scale: 0.985 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.42, ease: premiumEase },
              },
            }}
          >
            <span className="mc-hero__bubble">{turn.text}</span>
          </motion.li>
        ))}
      </motion.ol>

      <motion.div
        className="mc-hero__result"
        initial={still ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52, ease: premiumEase, delay: still ? 0 : 0.5 }}
      >
        <span className="mc-hero__result-who">Vám príde</span>
        <span className="mc-hero__result-text">{scenario.result}</span>
      </motion.div>
    </div>
  );
}

export function SignatureHero({ variant }: { variant: LandingVariant }) {
  const copy = heroCopy[variant];
  const reducedMotion = useReducedMotion();
  const introReady = useIntroReady();
  const [active, setActive] = useState<ScenarioKey>("chatbot");
  const activeIndex = Math.max(
    0,
    scenarios.findIndex((item) => item.key === active),
  );
  const scenario = scenarios[activeIndex] ?? scenarios[0];
  const pickerRef = useRef<HTMLDivElement>(null);

  /**
   * Výber je prepínač kariet, takže sa po ňom chodí šípkami, nie tabulátorom —
   * tabulátor z neho vyskočí rovno na obsah. Bez tohto by sa klávesnicou dal
   * vybrať len ten scenár, ktorý je práve otvorený.
   */
  const onPickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;

    let next = activeIndex;
    if (step !== 0) next = (activeIndex + step + scenarios.length) % scenarios.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = scenarios.length - 1;
    else return;

    event.preventDefault();
    setActive(scenarios[next].key);
    pickerRef.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  // Hero neodchádza ako jedna doska: tvrdenie stúpa rýchlejšie než scéna,
  // takže má odchod hĺbku. Hodnoty idú cez pružinu, aby pohyb nekopíroval
  // trhanie kolieska myši.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const claimY = useTransform(smooth, [0, 1], [0, reducedMotion ? 0 : -104]);
  const stageY = useTransform(smooth, [0, 1], [0, reducedMotion ? 0 : -44]);
  const fade = useTransform(smooth, [0, 0.86], [1, reducedMotion ? 1 : 0]);

  // Pri vypnutých animáciách je všetko na mieste už pri prvom vykreslení.
  const still = reducedMotion;
  const state = still || introReady ? "visible" : "hidden";

  return (
    <section className="mc-hero" id="uvod" data-variant={variant} ref={heroRef}>
      <div className="mc-hero__inner">
        <motion.header
          className="mc-hero__masthead"
          initial={still ? false : "hidden"}
          animate={state}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          <motion.span className="mc-hero__masthead-rule" variants={ruleDraw} />
          <motion.span className="mc-hero__kicker" variants={riseItem}>
            {copy.kicker}
          </motion.span>
          <motion.span className="mc-hero__origin" variants={riseItem}>
            Na mieru · Slovensko
          </motion.span>
        </motion.header>

        <motion.div
          className="mc-hero__claim"
          initial={still ? false : "hidden"}
          animate={state}
          variants={claimGroup}
          style={{ y: claimY, opacity: fade }}
        >
          <h1 aria-label={copy.aria}>
            {copy.lines.map((line, position) => (
              <span className="mc-hero__line" aria-hidden="true" key={line}>
                <motion.span
                  className="mc-hero__line-inner"
                  data-accent={position === copy.lines.length - 1}
                  variants={claimLine}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="mc-hero__lead" variants={riseItem}>
            {copy.lead}
          </motion.p>

          <motion.div className="mc-hero__actions" variants={riseItem}>
            <Link to={copy.primary.to} className="mc-hero__cta">
              <span>{copy.primary.label}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.aside
          className="mc-hero__stage"
          initial={still ? false : "hidden"}
          animate={state}
          variants={stageArrive}
          style={{ y: stageY, opacity: fade }}
        >
          <motion.div className="mc-hero__picker-head" variants={riseItem}>
            <span className="mc-hero__stage-label" id="mc-hero-picker-label">
              Čo má web robiť
            </span>
            <span className="mc-hero__stage-count" aria-hidden="true">
              {scenario.index}
              <i>/ 04</i>
            </span>
          </motion.div>

          <motion.div
            className="mc-hero__picker"
            role="tablist"
            aria-labelledby="mc-hero-picker-label"
            ref={pickerRef}
            onKeyDown={onPickerKeyDown}
            variants={riseItem}
          >
            {scenarios.map((item) => (
              <button
                type="button"
                key={item.key}
                role="tab"
                id={`mc-hero-tab-${item.key}`}
                aria-selected={item.key === active}
                aria-controls="mc-hero-panel"
                tabIndex={item.key === active ? 0 : -1}
                className="mc-hero__pick"
                data-active={item.key === active}
                onClick={() => setActive(item.key)}
              >
                {item.key === active && !still ? (
                  // Podklad vybranej položky sa medzi riadkami presunie,
                  // nezhasne a nerozsvieti sa. Jediná layout animácia v hero.
                  <motion.span
                    className="mc-hero__pick-fill"
                    layoutId="mc-hero-pick-fill"
                    transition={{ duration: 0.42, ease: premiumEase }}
                  />
                ) : null}
                <span className="mc-hero__num">{item.index}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>

          <motion.span
            className="mc-hero__note"
            key={scenario.key}
            initial={still ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: premiumEase }}
          >
            {scenario.note}
          </motion.span>

          <motion.div
            className="mc-hero__panel"
            id="mc-hero-panel"
            role="tabpanel"
            aria-labelledby={`mc-hero-tab-${scenario.key}`}
            variants={riseItem}
          >
            <Thread scenario={scenario} still={still} />
          </motion.div>

          {/* Sekundárna akcia. Nie je to formulár — je to tlačidlo, ktoré
              otvorí naozajstného chatbota v režime vybraného scenára.
              Na dne scény zároveň dáva ukážke dno, takže rozhovor stojí
              na niečom, presne ako v hotovom produkte. */}
          <motion.button
            type="button"
            className="mc-hero__ask"
            aria-label="Vyskúšať chatbota naživo"
            onClick={() => openSiteAssistant({ source: "hero-stage", preset: scenario.preset })}
            variants={riseItem}
          >
            <span className="mc-hero__ask-text">Napíšte, čo potrebujete…</span>
            <span className="mc-hero__ask-go" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </motion.button>
        </motion.aside>

        <motion.footer
          className="mc-hero__foot"
          initial={still ? false : "hidden"}
          animate={state}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.5 } },
          }}
          style={{ opacity: fade }}
        >
          <motion.span className="mc-hero__foot-rule" variants={ruleDraw} />
          <ul className="mc-hero__proof">
            {proof.map((item, position) => (
              <motion.li key={item} variants={riseItem}>
                <span className="mc-hero__num">{`0${position + 1}`}</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
          <motion.a className="mc-hero__cue" href={copy.cue.href} variants={riseItem}>
            <span>{copy.cue.label}</span>
            <ArrowDown aria-hidden="true" />
          </motion.a>
        </motion.footer>
      </div>
    </section>
  );
}
