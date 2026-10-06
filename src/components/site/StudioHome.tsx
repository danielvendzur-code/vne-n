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
import styles from "./StudioHome.module.css";
import actions from "./WebsiteAction.module.css";

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

function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hybrid-hero-title" data-nav-tone="dark">
      <div className={styles.heroStage}>
        <h1 id="hybrid-hero-title" aria-label="Chatboty a konfigurátory na mieru pre váš web.">
          <span>Chatboty a</span>
          <em>konfigurátory</em>
          <em>na mieru.</em>
        </h1>
        <div className={styles.collage} aria-label="Vybrané živé realizácie">
          {heroProjects.map((project, index) => (
            <a
              key={project.slug}
              className={styles.heroCase}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="Otvoriť web"
              style={{ "--case": index } as CSSProperties}
            >
              <img
                src={project.image}
                alt={project.alt}
                width={1600}
                height={1000}
                loading="eager"
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
              />
              <span>
                0{index + 1} / {project.name} <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className={styles.heroBottom}>
        <p>
          Chatbot odpovie, kalkulačka spočíta cenu, konfigurátor vyskladá produkt a produktový
          poradca pomôže s výberom.
        </p>
        <a href="#riesenia" className={`${actions.action} ${actions.lime}`}>
          Vybrať riešenie <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ facts */

function Facts() {
  return (
    <section className={styles.facts} aria-label="Základné fakty" data-nav-tone="light">
      <ul className={styles.wrap}>
        {facts.map((fact) => (
          <li key={fact.label}>
            <strong>{fact.value}</strong>
            <span>{fact.label}</span>
            <small>{fact.note}</small>
          </li>
        ))}
      </ul>
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
    src: `${BASE}work/solutions/skincare-photo.webp`,
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
    alt: "Produktový poradca pre kozmetiku: výber starostlivosti podľa typu pleti",
    wide: false,
    cta: "Vyskladať poradcu",
    to: undefined,
    preset: "product" as const,
  },
];

function Solutions() {
  return (
    <section
      className={styles.section}
      id="riesenia"
      aria-labelledby="sh-solutions-title"
      data-nav-tone="light"
    >
      <div className={styles.wrap}>
        <header className={styles.sectionHead}>
          <div>
            <p className={styles.label}>01 / Riešenia</p>
            <h2 id="sh-solutions-title">Aké riešenie potrebujete?</h2>
          </div>
          <p>Každý nástroj funguje samostatne, v kombinácii aj všetky spolu v jednom.</p>
        </header>
        <div className={styles.tools}>
          {tools.map((tool, index) => (
            <article className={styles.tool} data-kind={tool.key} key={tool.key}>
              <div className={styles.toolMedia} data-wide={tool.wide || undefined}>
                <span className={styles.mediaLabel}>0{index + 1} / Živá ukážka</span>
                <img src={tool.image} alt={tool.alt} loading="lazy" decoding="async" />
              </div>
              <div className={styles.toolBody}>
                <h3>
                  <tool.icon size={19} aria-hidden="true" />
                  {tool.title}
                </h3>
                <p>{tool.copy}</p>
                {tool.to ? (
                  <Link to={tool.to} className={actions.action}>
                    {tool.cta}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={actions.action}
                    onClick={() =>
                      openSiteAssistant({ source: `home-${tool.key}`, preset: tool.preset })
                    }
                  >
                    {tool.cta}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className={styles.combinations}>
          <div>
            <h3>Nemusí to byť iba jedno riešenie.</h3>
            <p>Nástroje spojíme po dvoch aj všetky naraz.</p>
          </div>
          <div>
            {combinations.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() =>
                  openSiteAssistant({ source: `home-combo-${index + 1}`, preset: item.preset })
                }
              >
                {item.title}
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className={styles.textLink}
          onClick={() => openSiteAssistant({ source: "home-unsure" })}
        >
          Neviete, čo z toho? Pomôžeme s výberom <ArrowRight size={16} aria-hidden="true" />
        </button>
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
  return (
    <section
      className={`${styles.section} ${styles.dark}`}
      id="ako-to-funguje"
      aria-labelledby="flow-title"
      data-nav-tone="dark"
    >
      <div className={styles.wrap}>
        <header className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Cesta zákazníka</p>
            <h2 id="flow-title">Od otázky k výsledku.</h2>
          </div>
          <p>Štyri jednoduché kroky. Bez hľadania, čakania a zbytočných telefonátov.</p>
        </header>
        <div className={styles.modeButtons} aria-label="Vyberte typ riešenia">
          {(Object.keys(flowModes) as FlowMode[]).map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={mode === item}
              onClick={() => setMode(item)}
            >
              {flowModes[item].label}
            </button>
          ))}
        </div>
        <ol className={styles.flowSteps}>
          {flowModes[mode].stages.map((stage) => (
            <li key={stage.index}>
              <span>
                {stage.index} / {stage.label}
              </span>
              <h3>{stage.title}</h3>
              <p>{stage.copy}</p>
              <strong>{stage.artifact}</strong>
            </li>
          ))}
        </ol>
        <div className={styles.sectionBottom}>
          <p>Nástroje fungujú samostatne, v kombinácii aj všetky spolu.</p>
          <button
            type="button"
            className={`${actions.action} ${actions.lime}`}
            onClick={() => openSiteAssistant({ source: "flow-story", preset: presetForMode(mode) })}
          >
            Vyskladať toto riešenie <ArrowUpRight size={17} aria-hidden="true" />
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
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <section
      className={`${styles.section} ${styles.dark}`}
      id="konfigurator"
      aria-labelledby="sh-config-title"
      data-nav-tone="dark"
    >
      <div className={`${styles.wrap} ${styles.configGrid}`}>
        <div>
          <p className={styles.label}>{onCaseStudy ? "Živá ukážka" : "Realizácia / Koverta"}</p>
          <h2 id="sh-config-title">
            {onCaseStudy ? "Vyskúšajte si ho priamo tu." : "Prístrešok si zákazník poskladá v 3D."}
          </h2>
          <p className={styles.configLead}>
            Pre Kovertu sme postavili konfigurátor prístreškov a pergol. Každá voľba sa hneď prepíše
            do 3D modelu aj do orientačnej ceny. Firma dostane dopyt, v ktorom už je všetko
            podstatné.
          </p>
          <ol className={styles.configSteps}>
            <li>
              <span>01</span>
              <p>
                <strong>Vyberie typ a umiestnenie</strong>Samostatne, pri stene alebo v rohu.
              </p>
            </li>
            <li>
              <span>02</span>
              <p>
                <strong>Nastaví rozmer, farbu a strechu</strong>Model aj cena sa menia okamžite.
              </p>
            </li>
            <li>
              <span>03</span>
              <p>
                <strong>Pošle dopyt so zostavou</strong>Bez prepisovania rozmerov do e-mailu.
              </p>
            </li>
          </ol>
          <div className={styles.configActions}>
            <Link
              to={onCaseStudy ? "/kontakt" : "/3d-konfigurator"}
              className={`${actions.action} ${actions.lime}`}
            >
              {onCaseStudy ? "Chcem podobný konfigurátor" : "Celá prípadová štúdia"}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href="https://koverta.sk/pages/konfigurator"
              target="_blank"
              rel="noreferrer"
              className={styles.textLink}
            >
              Otvoriť na koverta.sk <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div>
          <div className={styles.configTabs} role="tablist" aria-label="Typ konštrukcie">
            {configuratorShots.map((item, index) => (
              <button
                key={item.id}
                ref={(el) => {
                  tabs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`config-tab-${item.id}`}
                aria-controls="config-panel"
                aria-selected={index === active}
                tabIndex={index === active ? 0 : -1}
                onClick={() => {
                  setActive(index);
                  setLive(false);
                }}
                onKeyDown={(event) => {
                  let next = index;
                  if (event.key === "ArrowRight") next = (index + 1) % configuratorShots.length;
                  else if (event.key === "ArrowLeft")
                    next = (index + configuratorShots.length - 1) % configuratorShots.length;
                  else return;
                  event.preventDefault();
                  setActive(next);
                  setLive(false);
                  tabs.current[next]?.focus();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            className={styles.configScreen}
            id="config-panel"
            role="tabpanel"
            aria-labelledby={`config-tab-${shot.id}`}
          >
            {live ? (
              <iframe
                title="Živý 3D konfigurátor Koverta"
                src={`${KOVERTA_LIVE_CONFIGURATOR}?page=${shot.page}`}
                loading="eager"
                allow="fullscreen"
              />
            ) : (
              <>
                <img
                  src={shot.image}
                  alt={shot.alt}
                  width={1600}
                  height={841}
                  loading="lazy"
                  decoding="async"
                />
                <button
                  type="button"
                  className={`${actions.action} ${actions.lime}`}
                  onClick={() => setLive(true)}
                >
                  Spustiť živý konfigurátor <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
          {live ? (
            <a
              className={styles.textLink}
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
      className={styles.section}
      id="realizacie"
      aria-labelledby="sh-work-title"
      data-nav-tone="light"
    >
      <div className={styles.wrap}>
        <header className={styles.sectionHead}>
          <div>
            <p className={styles.label}>02 / Realizácie</p>
            <h2 id="sh-work-title">
              Hotové projekty.
              <br />
              Skutočné výsledky.
            </h2>
          </div>
          <Link to="/projekty" className={actions.action}>
            Všetky realizácie <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <ol className={styles.projects}>
          {realizations.map((project, index) => (
            <li key={project.name}>
              <article className={styles.project}>
                <a
                  className={styles.projectImage}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Otvoriť web"
                  aria-label={`Otvoriť ${project.name}`}
                >
                  <div className={styles.browserBar}>
                    <span>
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>{project.domain}</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </div>
                  <img
                    src={project.image}
                    alt={project.alt}
                    width={1600}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <div className={styles.projectCopy}>
                  <span className={styles.label}>
                    0{index + 1} / {project.type}
                  </span>
                  <h3>{project.name}</h3>
                  <p>{project.result}</p>
                  <ul>
                    {project.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                  <div className={styles.projectActions}>
                    <a
                      className={actions.action}
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.domain}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                    {project.caseStudyPath ? (
                      <Link to={project.caseStudyPath} className={styles.textLink}>
                        Ako to funguje <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    ) : null}
                  </div>
                </div>
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
    <section
      className={`${styles.section} ${styles.comparison}`}
      aria-labelledby="sh-ba-title"
      data-nav-tone="light"
    >
      <div className={styles.wrap}>
        <header className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Pred a po</p>
            <h2 id="sh-ba-title">
              Rovnaký zákazník.
              <br />
              Úplne iný dopyt.
            </h2>
          </div>
          <p>Takto vyzerá správa, ktorá firme príde bez nástroja a s kalkulačkou na webe.</p>
        </header>
        <div className={styles.compareGrid}>
          <article>
            <span className={styles.label}>Bez nástroja</span>
            <h3>„Koľko by to stálo?“</h3>
            <div className={styles.mail}>
              <span>Od: jan.k…@gmail.com</span>
              <p>Dobrý deň, koľko by stála deratizácia? Ďakujem.</p>
            </div>
            <p>Než pošlete cenu, musíte sa spýtať:</p>
            <ul>
              {vagueQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
            <footer>
              <strong>Ďalšie e-maily a telefonáty</strong>
              <p>Zákazník medzitým často píše aj konkurencii.</p>
            </footer>
          </article>
          <article>
            <span className={styles.label}>S kalkulačkou na derat.sk</span>
            <h3>Viete rovno poslať ponuku.</h3>
            <dl>
              {inquiryRows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <footer>
              <strong>Kompletné zadanie aj kontakt</strong>
              <p>Zákazník pozná orientačnú cenu, vy poznáte rozsah práce.</p>
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

function Process() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const scene = processScenes[active];
  useEffect(() => {
    processScenes.forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
  }, []);
  return (
    <section
      className={`${styles.section} ${styles.process}`}
      id="proces"
      aria-labelledby="sh-process-title"
      data-nav-tone="light"
    >
      <div className={styles.wrap}>
        <header className={styles.sectionHead}>
          <div>
            <p className={styles.label}>03 / Ako to prebieha</p>
            <h2 id="sh-process-title">
              Od prvého rozhovoru
              <br />
              po spustenie na webe.
            </h2>
          </div>
          <p>Viete, čo sa deje v každom kroku. Ukážku si vyskúšate ešte pred nasadením.</p>
        </header>
        <div className={styles.processTabs} role="tablist" aria-label="Štyri kroky spolupráce">
          {process.map(([number, title], index) => (
            <button
              type="button"
              key={number}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              id={`process-tab-${index}`}
              role="tab"
              aria-selected={active === index}
              aria-controls="process-panel"
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                let next = active;
                if (event.key === "ArrowRight") next = (active + 1) % 4;
                else if (event.key === "ArrowLeft") next = (active + 3) % 4;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = 3;
                else return;
                event.preventDefault();
                setActive(next);
                tabs.current[next]?.focus();
              }}
            >
              <span>{number}</span>
              <strong>{title}</strong>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div
          id="process-panel"
          className={styles.processPanel}
          role="tabpanel"
          aria-labelledby={`process-tab-${active}`}
          tabIndex={0}
        >
          <div className={styles.processCopy}>
            <span className={styles.label}>
              {process[active][0]} / {scene.time}
            </span>
            <h3>{process[active][1]}</h3>
            <p>{process[active][2]}</p>
            <h4>{scene.outputTitle}</h4>
            <ul>
              {scene.output.map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/postup" className={styles.textLink}>
              Celý postup spolupráce <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <figure>
            <img
              src={scene.image}
              alt={scene.alt}
              width={1600}
              height={1000}
              loading="eager"
              decoding="async"
            />
            <figcaption>
              <span>{scene.visualKicker}</span>
              <strong>{scene.visualTitle}</strong>
              <p>{scene.visualCopy}</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pricing */

function Pricing() {
  return (
    <section
      className={`${styles.section} ${styles.dark}`}
      id="cena"
      aria-labelledby="sh-price-title"
      data-nav-tone="dark"
    >
      <div className={styles.wrap}>
        <header className={styles.sectionHead}>
          <div>
            <p className={styles.label}>04 / Cenník</p>
            <h2 id="sh-price-title">
              Jasná cena.
              <br />
              Ešte pred začiatkom.
            </h2>
          </div>
          <p>Presný rozsah si odsúhlasíme vopred. Ponuka uvedie základ, DPH aj celkovú sumu.</p>
        </header>
        <div className={styles.prices}>
          {prices.map((price, index) => (
            <article key={price.tag}>
              <span className={styles.label}>
                0{index + 1} / {price.tag}
              </span>
              <h3>od {price.value} €</h3>
              <small>{price.unit || "Jednorazovo za riešenie"}</small>
              <p>{price.copy}</p>
              <Link to="/cennik" className={`${actions.action} ${actions.lime}`}>
                Čo zahŕňa cena <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </article>
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
      className={styles.section}
      id="otazky"
      aria-labelledby="sh-faq-title"
      data-nav-tone="light"
    >
      <div className={`${styles.wrap} ${styles.faq}`}>
        <header>
          <p className={styles.label}>05 / Časté otázky</p>
          <h2 id="sh-faq-title">
            Dobré vedieť
            <br />
            pred začiatkom.
          </h2>
          <p>Nenašli ste odpoveď? Napíšte nám.</p>
          <a className={styles.textLink} href="mailto:info@mojchatbot.sk">
            info@mojchatbot.sk <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </header>
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.q}>
              <summary>
                {faq.q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{faq.a}</p>
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
    <div className={styles.home} ref={rootRef}>
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
