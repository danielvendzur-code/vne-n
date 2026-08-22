import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { realizations } from "@/data/realizations";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./AwardHome.css";

export type LandingVariant = "public" | "client";

const heroCopy = {
  public: {
    top: "DIGITÁLNE PREDAJNÉ NÁSTROJE",
    titleA: "Od otázky",
    titleB: "k výsledku.",
    lead: "Chatboty, kalkulačky, konfigurátory a produktoví poradcovia postavení podľa reálneho predajného procesu vašej firmy.",
  },
  client: {
    top: "NÁVRH PRE VÁŠ WEB",
    titleA: "Návrh už máte.",
    titleB: "Teraz ho zažite.",
    lead: "Ukážka toho, ako môže návštevník prejsť od otázky cez výber alebo výpočet až k výsledku, ktorý sa dá rovno riešiť.",
  },
} as const;

const flowStages = [
  {
    index: "01",
    label: "OTÁZKA",
    title: "Človek nepríde s briefom. Príde s problémom.",
    copy: "Začiatok musí byť jednoduchší než telefonát, formulár aj hľadanie v päťstranovom cenníku.",
    artifact: "Koľko približne stojí prístrešok pre dve autá?",
  },
  {
    index: "02",
    label: "KONTEXT",
    title: "Pýtame sa iba na to, čo mení výsledok.",
    copy: "Rozmer, materiál, lokalita alebo preferencie. Krátka cesta namiesto administratívy.",
    artifact: "6 × 5 m  /  HLINÍK  /  NITRA",
  },
  {
    index: "03",
    label: "LOGIKA",
    title: "Vaše pravidlá začnú pracovať priamo na webe.",
    copy: "Cenník, varianty, podmienky a výnimky premeníme na rozhodovanie, ktoré nemusí robiť človek ručne.",
    artifact: "ROZMER → MODEL → CENA → MONTÁŽ",
  },
  {
    index: "04",
    label: "VÝSLEDOK",
    title: "Zákazník vie, čo ďalej. Firma dostane kontext.",
    copy: "Výsledkom môže byť orientačná cena, konfigurácia, odporúčaný produkt alebo pripravený dopyt.",
    artifact: "PRIPRAVENÝ DOPYT / 6 × 5 m / NITRA",
  },
] as const;

const tools = [
  {
    index: "01",
    name: "Chatbot",
    statement: "Odpovie. Vysvetlí. Zistí kontext.",
    copy: "Pre weby, kde zákazník potrebuje rýchlo pochopiť ponuku alebo zistiť, čo je preňho relevantné.",
    preset: "inquiry" as const,
  },
  {
    index: "02",
    name: "Kalkulačka",
    statement: "Vypočíta skôr, než začne telefonát.",
    copy: "Cena, spotreba, rozsah alebo iný výsledok podľa vašich reálnych pravidiel a vstupov.",
    preset: "calculator" as const,
  },
  {
    index: "03",
    name: "Konfigurátor",
    statement: "Zložitú ponuku premení na jasnú voľbu.",
    copy: "Varianty, rozmery, materiály a doplnky v poradí, ktoré zákazníka nezaťaží.",
    preset: "product" as const,
  },
  {
    index: "04",
    name: "Produktový poradca",
    statement: "Zúži katalóg na to, čo dáva zmysel.",
    copy: "Pre e-shopy s výberom podľa použitia, preferencií, parametrov alebo rozpočtu.",
    preset: "product" as const,
  },
];

const process = [
  ["01", "Pochopiť", "Web, ponuku, opakujúce sa otázky a miesto, kde sa zákazník zasekne."],
  [
    "02",
    "Zjednodušiť",
    "Vyhodiť kroky, ktoré zákazník nepotrebuje, a ponechať iba rozhodujúce vstupy.",
  ],
  ["03", "Navrhnúť", "Cestu, rozhranie, logiku, výstup a napojenia ešte pred finálnym vývojom."],
  ["04", "Nasadiť", "Otestovať desktop, mobil, formuláre a reálne správanie priamo na vašom webe."],
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

function FlowStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 85, damping: 28, mass: 0.25 });
  const x = useTransform(progress, [0, 1], ["0%", "-75%"]);
  const lineScale = useTransform(progress, [0, 1], [0.03, 1]);

  return (
    <section ref={ref} className="hybrid-flow" aria-labelledby="hybrid-flow-title">
      <div className="hybrid-flow__desktop">
        <div className="hybrid-flow__sticky">
          <div className="hybrid-flow__hud container-page">
            <span>QUESTION → CONTEXT → LOGIC → OUTCOME</span>
            <span>SCROLL TO RUN THE SYSTEM</span>
          </div>
          <motion.div className="hybrid-flow__track" style={{ x }}>
            {flowStages.map((stage, index) => (
              <article className="hybrid-flow__panel" key={stage.index}>
                <div className="container-page hybrid-flow__panel-inner">
                  <div className="hybrid-flow__number">{stage.index}</div>
                  <div className="hybrid-flow__copy">
                    <span>{stage.label}</span>
                    <h2 id={index === 0 ? "hybrid-flow-title" : undefined}>{stage.title}</h2>
                    <p>{stage.copy}</p>
                  </div>
                  <div className="hybrid-flow__artifact" aria-hidden="true">
                    <span>{stage.index} / SYSTEM</span>
                    <strong>{stage.artifact}</strong>
                    <i>→</i>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
          <div className="hybrid-flow__progress" aria-hidden="true">
            <motion.i style={{ scaleX: lineScale }} />
          </div>
        </div>
      </div>

      <div className="hybrid-flow__mobile container-page">
        <p className="hybrid-flow__mobile-label">QUESTION → CONTEXT → LOGIC → OUTCOME</p>
        {flowStages.map((stage) => (
          <article key={stage.index}>
            <div className="hybrid-flow__mobile-head">
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

function SelectedWork() {
  return (
    <section className="hybrid-work" id="realizacie" aria-labelledby="hybrid-work-title">
      <div className="container-page hybrid-work__intro">
        <span>VYBRANÉ REALIZÁCIE / 2026</span>
        <h2 id="hybrid-work-title">Najprv práca. Potom reči.</h2>
        <p>Každý projekt nižšie beží na živej doméne a dá sa otvoriť.</p>
      </div>

      <div className="container-page hybrid-work__grid">
        {realizations.map((project, index) => (
          <article className={`hybrid-project hybrid-project--${index + 1}`} key={project.name}>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="hybrid-project__visual"
            >
              <img src={project.image} alt={project.alt} loading="eager" decoding="async" />
              <span className="hybrid-project__domain">{project.domain}</span>
              <span className="hybrid-project__open">
                OPEN <ArrowUpRight size={15} />
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
          Všetky realizácie <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

function CoreTools() {
  return (
    <section className="hybrid-tools" aria-labelledby="hybrid-tools-title">
      <div className="container-page hybrid-tools__intro">
        <span>ČO STAVIAME</span>
        <h2 id="hybrid-tools-title">Nástroj až podľa problému. Nie naopak.</h2>
      </div>
      <div className="hybrid-tools__rows">
        {tools.map((tool) => (
          <button
            key={tool.name}
            type="button"
            className="hybrid-tool"
            onClick={() => openSiteAssistant({ source: `tool-${tool.index}`, preset: tool.preset })}
          >
            <div className="container-page hybrid-tool__inner">
              <span>{tool.index}</span>
              <strong>{tool.name}</strong>
              <b>{tool.statement}</b>
              <p>{tool.copy}</p>
              <ArrowUpRight size={26} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="hybrid-audience" aria-label="Riešenia podľa typu firmy">
      <article className="hybrid-audience__panel hybrid-audience__panel--services">
        <div className="hybrid-audience__content">
          <span>PRE FIRMY SO SLUŽBAMI</span>
          <h2>Dopyt, ktorý už niečo vie.</h2>
          <p>
            Zákazník dostane odpoveď alebo orientačný výsledok. Vy dostanete kontakt spolu s údajmi,
            ktoré by ste inak zisťovali telefonicky.
          </p>
          <button
            type="button"
            onClick={() => openSiteAssistant({ source: "audience-services", preset: "inquiry" })}
          >
            Vyskladať riešenie <ArrowRight size={17} />
          </button>
        </div>
        <div className="hybrid-audience__type" aria-hidden="true">
          SERVICE
        </div>
      </article>

      <article className="hybrid-audience__panel hybrid-audience__panel--commerce" id="pre-eshopy">
        <div className="hybrid-audience__content">
          <span>PRE E-SHOPY</span>
          <h2>Výber produktu bez blúdenia.</h2>
          <p>
            Produktový poradca zúži katalóg podľa použitia, preferencií a rozpočtu a posunie človeka
            k relevantnému produktu alebo variantu.
          </p>
          <button
            type="button"
            onClick={() => openSiteAssistant({ source: "audience-commerce", preset: "product" })}
          >
            Navrhnúť poradcu <ArrowRight size={17} />
          </button>
        </div>
        <div className="hybrid-audience__type" aria-hidden="true">
          E-COM
        </div>
      </article>
    </section>
  );
}

function Process() {
  return (
    <section className="hybrid-process" aria-labelledby="hybrid-process-title">
      <div className="container-page hybrid-process__intro">
        <span>PROCES</span>
        <h2 id="hybrid-process-title">Najprv pochopiť. Potom kresliť.</h2>
        <Link to="/postup">
          Celý postup <ArrowRight size={17} />
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

function ProofAndPrice() {
  return (
    <section className="hybrid-price" aria-labelledby="hybrid-price-title">
      <div className="container-page hybrid-price__top">
        <span>VSTUPNÁ CENA</span>
        <h2 id="hybrid-price-title">Jednoduchý nástroj nemusí začínať štvorcifernou sumou.</h2>
      </div>
      <div className="container-page hybrid-price__grid">
        <div>
          <span>CHATBOT NA MIERU</span>
          <strong>350 €</strong>
        </div>
        <div>
          <span>PREVÁDZKA</span>
          <strong>10 €</strong>
          <b>/ mesiac</b>
        </div>
        <div>
          <span>KALKULAČKA / KONFIGURÁTOR</span>
          <strong>od 400 €</strong>
        </div>
        <Link to="/cennik" className="hybrid-price__link">
          Celý cenník <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export function PremiumLanding({ variant = "public" }: { variant?: LandingVariant }) {
  const copy = heroCopy[variant];

  return (
    <div className="hybrid-home" data-variant={variant}>
      <section className="hybrid-hero" aria-labelledby="hybrid-hero-title">
        <div className="container-page hybrid-hero__meta">
          <span>{copy.top}</span>
          <span>E-SHOPY · SLUŽBY · B2C</span>
        </div>

        <div className="container-page hybrid-hero__stage">
          <h1 id="hybrid-hero-title">
            <span>{copy.titleA}</span>
            <em>{copy.titleB}</em>
          </h1>
          <HeroCollage />
        </div>

        <div className="container-page hybrid-hero__bottom">
          <p>{copy.lead}</p>
          <div>
            <a href="#realizacie" className="hybrid-hero__primary">
              Pozrieť realizácie <ArrowUpRight size={17} />
            </a>
            <button
              type="button"
              onClick={() =>
                openSiteAssistant({ source: variant === "client" ? "hero-client" : "hero-public" })
              }
            >
              Prebrať môj web <ArrowRight size={17} />
            </button>
          </div>
          <span className="hybrid-hero__scroll">SCROLL / EXPLORE</span>
        </div>
      </section>

      <section className="hybrid-manifesto" aria-labelledby="hybrid-manifesto-title">
        <div className="container-page">
          <span>WEB NEMUSÍ IBA INFORMOVAŤ.</span>
          <h2 id="hybrid-manifesto-title">
            Môže <em>odpovedať.</em> Môže <em>počítať.</em> Môže <em>pomôcť vybrať.</em> A potom
            poslať firme dopyt, s ktorým sa dá pracovať.
          </h2>
        </div>
      </section>

      <FlowStory />
      <SelectedWork />
      <CoreTools />
      <Audience />
      <Process />
      <ProofAndPrice />

      <section className="hybrid-proof" aria-labelledby="hybrid-proof-title">
        <div className="container-page hybrid-proof__intro">
          <span>ŽIVÉ. KLIKATEĽNÉ. OVERITEĽNÉ.</span>
          <h2 id="hybrid-proof-title">Žiadne anonymné percentá. Otvorte si výsledok.</h2>
        </div>
        <div className="container-page hybrid-proof__domains">
          {realizations.map((project, index) => (
            <a href={project.href} target="_blank" rel="noreferrer" key={project.domain}>
              <span>0{index + 1}</span>
              <strong>{project.name}</strong>
              <b>{project.domain}</b>
              <ExternalLink size={16} />
            </a>
          ))}
        </div>
      </section>

      <section className="hybrid-final" aria-labelledby="hybrid-final-title">
        <div className="container-page hybrid-final__top">
          <BrandMark size={54} />
          <span>MÔJ CHATBOT / DIGITÁLNE PREDAJNÉ NÁSTROJE</span>
        </div>
        <div className="container-page hybrid-final__body">
          <h2 id="hybrid-final-title">Má váš web iba existovať?</h2>
          <p>Alebo má zákazníkovi reálne pomôcť dostať sa k rozhodnutiu?</p>
          <div>
            <Link to="/kontakt" className="hybrid-final__button">
              Začať projekt <ArrowUpRight size={19} />
            </Link>
            <a href="mailto:info@mojchatbot.sk">info@mojchatbot.sk</a>
          </div>
        </div>
      </section>
    </div>
  );
}
