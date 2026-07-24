import { Link } from "@tanstack/react-router";
import { useState, type ComponentType, type SVGProps } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Calculator,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileCheck2,
  Layers3,
  Mail,
  MessageCircle,
  MousePointer2,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Workflow,
} from "lucide-react";
import { DeratScrollStory } from "@/components/site/DeratScrollStory";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";

const ease = [0.16, 1, 0.3, 1] as const;
type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type ToolKey = "chatbot" | "calculator" | "configurator";

const tools: Record<
  ToolKey,
  {
    label: string;
    shortLabel: string;
    icon: Icon;
    title: string;
    copy: string;
    fields: string[];
    result: string;
  }
> = {
  chatbot: {
    label: "AI chatbot",
    shortLabel: "Odpovede",
    icon: Bot,
    title: "Odpovie, dopýta sa a odovzdá celý kontext.",
    copy: "Návštevník dostane pomoc okamžite. Vy dostanete kontakt spolu s tým, čo potrebuje, odkedy a v akom rozsahu.",
    fields: ["Typ požiadavky", "Lokalita", "Termín", "Kontakt"],
    result: "Kvalifikovaný dopyt",
  },
  calculator: {
    label: "Kalkulačka",
    shortLabel: "Výpočet",
    icon: Calculator,
    title: "Vypočíta cenu podľa vašich reálnych pravidiel.",
    copy: "Rozmery, množstvo, doprava aj doplnky sa vyhodnotia počas krátkeho rozhovoru bez chaotického formulára.",
    fields: ["Rozmer 18 m", "Montáž", "Brána", "Nitra"],
    result: "Odhad 2 480 €",
  },
  configurator: {
    label: "Konfigurátor",
    shortLabel: "Výber",
    icon: SlidersHorizontal,
    title: "Poskladá variant a pripraví hotovú špecifikáciu.",
    copy: "Zákazník si vyberie typ, materiál, rozmer a doplnky. Systém zobrazí iba možnosti, ktoré k sebe patria.",
    fields: ["Model", "Materiál", "Farba", "Doplnky"],
    result: "Hotová konfigurácia",
  },
};

const proofItems = [
  { icon: BadgeCheck, title: "Reálne nasadenia", copy: "Živé weby a funkčné nástroje" },
  { icon: Workflow, title: "Logika na mieru", copy: "Nie generická šablóna" },
  { icon: Clock3, title: "Rýchla odpoveď", copy: "Zvyčajne do 1 pracovného dňa" },
] as const;

const solutions = [
  {
    number: "01",
    icon: Bot,
    title: "AI chatbot na mieru",
    copy: "Odpovie na otázky, navedie zákazníka a zozbiera presne tie údaje, ktoré potrebujete pred prvou ponukou.",
    tags: ["FAQ a poradenstvo", "Zber kontaktu", "Prílohy", "WhatsApp alebo e-mail"],
  },
  {
    number: "02",
    icon: Calculator,
    title: "Chatbot s výpočtom",
    copy: "Počas rozhovoru vypočíta cenu, spotrebu, návratnosť alebo rozsah služby podľa vašich vzorcov.",
    tags: ["Vlastné pravidlá", "Orientačná cena", "Doprava", "Montáž"],
  },
  {
    number: "03",
    icon: SlidersHorizontal,
    title: "Chatbot s konfigurátorom",
    copy: "Prevedie výberom produktu krok za krokom a odošle kompletnú konfiguráciu pripravenú na nacenenie.",
    tags: ["Varianty", "Podmienené voľby", "Doplnky", "Súhrn výberu"],
  },
] as const;

const projects = [
  {
    name: "DERAT",
    type: "Kalkulačka zásahu v chatbote",
    copy: "Štyri krátke kroky premenia problém zákazníka na konkrétne zadanie s orientačnou cenou.",
    href: "https://derat-chatbot-backend.vercel.app/",
    image: `${import.meta.env.BASE_URL}work/derat-v2/04-result.webp`,
    alt: "Výsledok cenovej kalkulačky DERAT",
    featured: true,
  },
  {
    name: "Môj Plot",
    type: "Produktový web a výber riešenia",
    copy: "Prehľadná prezentácia oplotenia, doplnkov a ďalšieho kroku pre zákazníka.",
    href: "https://mojplot.sk/",
    image: `${import.meta.env.BASE_URL}work/portfolio/mojplot.webp`,
    alt: "Domovská stránka Môj Plot",
    featured: false,
  },
  {
    name: "Koverta",
    type: "Web s dopytovým asistentom",
    copy: "Produktový web pre dom a záhradu doplnený o rýchly kontakt a asistenta.",
    href: "https://koverta.sk/",
    image: `${import.meta.env.BASE_URL}work/portfolio/koverta.webp`,
    alt: "Domovská stránka Koverta",
    featured: false,
  },
] as const;

const process = [
  {
    icon: MessageCircle,
    title: "Poviete mi, čo dnes riešite ručne",
    copy: "Stačí web, cenník alebo krátky opis procesu. Technické zadanie nepotrebujete.",
  },
  {
    icon: Layers3,
    title: "Navrhnem otázky a rozhodovanie",
    copy: "Najprv vznikne logika nástroja, jeho vstupy, výstupy a jasný rozsah prvej verzie.",
  },
  {
    icon: MousePointer2,
    title: "Dostanete funkčnú ukážku",
    copy: "Uvidíte reálne rozhranie a priebeh ešte pred finálnym nasadením na web.",
  },
  {
    icon: FileCheck2,
    title: "Nasadím a skontrolujem celý tok",
    copy: "Nástroj sa vloží na existujúcu stránku a otestuje sa na počítači aj telefóne.",
  },
] as const;

function MetalButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="cx-metal-button" onClick={onClick}>
      <span className="cx-metal-button__outer">
        <span className="cx-metal-button__inner">
          <span>{children}</span>
          <ArrowRight aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

function SectionHeading({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: React.ReactNode;
  copy: string;
}) {
  return (
    <header className="cx-section-heading">
      <p className="cx-kicker">{kicker}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </header>
  );
}

function Hero() {
  const [active, setActive] = useState<ToolKey>("calculator");
  const reducedMotion = useReducedMotion();
  const current = tools[active];
  const ActiveIcon = current.icon;

  return (
    <section className="cx-hero" id="uvod">
      <div className="cx-hero__grid" aria-hidden="true" />
      <div className="cx-hero__glow" aria-hidden="true" />
      <div className="container-page cx-hero__inner">
        <motion.div
          className="cx-hero__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8, ease }}
        >
          <p className="cx-kicker"><Sparkles aria-hidden="true" /> Chatboty a webové nástroje na mieru</p>
          <h1>
            Web, ktorý odpovedá, počíta <em>a pripraví dopyt.</em>
          </h1>
          <p className="cx-hero__lead">
            Navrhujem chatboty, kalkulačky a konfigurátory podľa reálneho procesu firmy. Zákazník
            dostane jasný ďalší krok a vám príde kontakt s celým kontextom.
          </p>
          <div className="cx-hero__actions">
            <MetalButton onClick={() => openSiteAssistant({ source: "competition-hero", entry: "builder" })}>
              Získať návrh riešenia
            </MetalButton>
            <a className="cx-text-link" href="#realizacie">
              Pozrieť realizácie <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <ul className="cx-hero__proof">
            <li><Check aria-hidden="true" /> Na existujúci web</li>
            <li><Check aria-hidden="true" /> Vlastný dizajn a logika</li>
            <li><Check aria-hidden="true" /> Mobil aj počítač</li>
          </ul>
        </motion.div>

        <motion.div
          className="cx-product"
          initial={reducedMotion ? false : { opacity: 0, x: 46, scale: 0.975 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.92, delay: 0.12, ease }}
        >
          <div className="cx-product__halo" aria-hidden="true" />
          <div className="cx-product__window">
            <header className="cx-product__topbar">
              <div className="cx-product__brand">
                <span className="cx-product__mark"><Bot aria-hidden="true" /></span>
                <span><b>Môj Chatbot</b><small>živá ukážka</small></span>
              </div>
              <span className="cx-product__status"><i /> online</span>
            </header>

            <div className="cx-product__body">
              <div className="cx-message cx-message--assistant">
                <span className="cx-message__avatar"><Bot aria-hidden="true" /></span>
                <div>
                  <small>AI asistent</small>
                  <p>Čo chcete na vašom webe automatizovať?</p>
                </div>
              </div>

              <div className="cx-tool-switch" role="group" aria-label="Typ nástroja">
                {(Object.entries(tools) as [ToolKey, (typeof tools)[ToolKey]][]).map(([key, tool]) => {
                  const Icon = tool.icon;
                  const selected = active === key;
                  return (
                    <button
                      type="button"
                      className="cx-choice-chip"
                      data-active={selected}
                      aria-pressed={selected}
                      key={key}
                      onClick={() => setActive(key)}
                    >
                      <Icon aria-hidden="true" />
                      <span>{tool.shortLabel}</span>
                      <i>{selected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}</i>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="cx-flow"
                  key={active}
                  initial={reducedMotion ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease }}
                >
                  <div className="cx-flow__intro">
                    <span><ActiveIcon aria-hidden="true" /></span>
                    <div>
                      <small>{current.label}</small>
                      <h3>{current.title}</h3>
                    </div>
                  </div>
                  <p>{current.copy}</p>
                  <div className="cx-flow__fields">
                    {current.fields.map((field) => <span key={field}>{field}</span>)}
                  </div>
                  <div className="cx-result">
                    <span><ShieldCheck aria-hidden="true" /> Výstup pre firmu</span>
                    <strong>{current.result}</strong>
                    <small>Kontakt a všetky odpovede v jednom prehľade</small>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <footer className="cx-product__footer">
              <span>Napíšte, čo potrebujete…</span>
              <button type="button" aria-label="Otvoriť chatbota" onClick={() => openSiteAssistant({ source: "competition-demo" })}>
                <ArrowUpRight aria-hidden="true" />
              </button>
            </footer>
          </div>
          <div className="cx-product__badge cx-product__badge--top"><Sparkles /> Navrhnuté na mieru</div>
          <div className="cx-product__badge cx-product__badge--bottom"><Check /> Hotový dopyt</div>
        </motion.div>
      </div>
    </section>
  );
}

function ProofBar() {
  return (
    <section className="cx-proofbar" aria-label="Dôvody spolupráce">
      <div className="container-page cx-proofbar__grid">
        {proofItems.map(({ icon: Icon, title, copy }) => (
          <article key={title}>
            <Icon aria-hidden="true" />
            <div><h2>{title}</h2><p>{copy}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Solutions() {
  const reducedMotion = useReducedMotion();
  return (
    <section className="cx-section cx-solutions" id="riesenia">
      <div className="container-page">
        <SectionHeading
          kicker="Tri typy riešení"
          title={<>Presne toľko technológie, <em>koľko vaša služba potrebuje.</em></>}
          copy="Každý nástroj vzniká z konkrétneho predajného procesu. Bez zbytočných funkcií a bez univerzálnej šablóny."
        />
        <div className="cx-solution-grid">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.article
                className="cx-solution-card"
                key={solution.title}
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.58, delay: index * 0.08, ease }}
              >
                <div className="cx-solution-card__top">
                  <span className="cx-solution-card__icon"><Icon aria-hidden="true" /></span>
                  <span className="cx-solution-card__number">{solution.number}</span>
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.copy}</p>
                <div className="cx-tag-row">
                  {solution.tags.map((tag) => <span className="cx-static-tag" key={tag}>{tag}</span>)}
                </div>
                <button
                  type="button"
                  className="cx-card-link"
                  onClick={() => openSiteAssistant({ source: "competition-solution", entry: "builder", category: solution.title })}
                >
                  Navrhnúť podobné riešenie <ArrowUpRight aria-hidden="true" />
                </button>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <section className="cx-section cx-portfolio" id="projekty">
      <div className="container-page">
        <SectionHeading
          kicker="Vybrané realizácie"
          title={<>Reálne rozhrania. <em>Nie generické makety.</em></>}
          copy="Každý projekt rieši inú zákaznícku cestu. Ukážky môžete otvoriť a vyskúšať priamo v prehliadači."
        />
        <div className="cx-project-grid">
          {projects.map((project) => (
            <a
              className="cx-project-card"
              data-featured={project.featured}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              key={project.name}
            >
              <div className="cx-project-card__media">
                <img src={project.image} alt={project.alt} loading="lazy" decoding="async" />
              </div>
              <div className="cx-project-card__copy">
                <span>{project.type}</span>
                <h3>{project.name}</h3>
                <p>{project.copy}</p>
                <b>Otvoriť živý projekt <ExternalLink aria-hidden="true" /></b>
              </div>
            </a>
          ))}
        </div>
        <div className="cx-portfolio__footer">
          <span>Ďalšie interaktívne ukážky sú pripravené na samostatnej stránke.</span>
          <Link to="/projekty" className="cx-text-link">Všetky ukážky <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="cx-section cx-process" id="spolupraca">
      <div className="container-page cx-process__layout">
        <SectionHeading
          kicker="Ako spolupráca prebieha"
          title={<>Od nápadu k funkčnému nástroju <em>bez chaosu.</em></>}
          copy="Najprv sa vyrieši logika a obsah. Až potom vizuál, animácie a nasadenie."
        />
        <ol className="cx-process__list">
          {process.map(({ icon: Icon, title, copy }, index) => (
            <li key={title}>
              <span className="cx-process__number">0{index + 1}</span>
              <span className="cx-process__icon"><Icon aria-hidden="true" /></span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="cx-faq-item" data-open={open}>
      <h3>
        <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span>{question}</span><ChevronDown aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="cx-faq-item__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <p>{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function Faq() {
  return (
    <section className="cx-section cx-faq" id="otazky">
      <div className="container-page cx-faq__layout">
        <SectionHeading
          kicker="Časté otázky"
          title={<>Dôležité veci <em>pred prvým krokom.</em></>}
          copy="Bez skrytého rozsahu a bez zbytočne komplikovaného zadania."
        />
        <div className="cx-faq__list">
          {faqs.slice(0, 6).map((faq) => <FaqItem key={faq.q} question={faq.q} answer={faq.a} />)}
        </div>
      </div>
    </section>
  );
}

function FinalOffer() {
  return (
    <section className="cx-offer" id="kontakt">
      <div className="container-page">
        <div className="cx-offer__panel">
          <div className="cx-offer__copy">
            <p className="cx-kicker">Konkrétny ďalší krok</p>
            <h2>Opíšte, čo dnes počítate alebo vysvetľujete ručne.</h2>
            <p>
              Jednoduchý chatbot začína od 350 €. Kalkulačka alebo konfigurátor sa nacení podľa
              pravidiel, krokov a prepojení. Rozsah dostanete ešte pred vývojom.
            </p>
            <div className="cx-offer__actions">
              <MetalButton onClick={() => openSiteAssistant({ source: "competition-final", entry: "builder" })}>
                Získať návrh riešenia
              </MetalButton>
              <a className="cx-text-link" href={`mailto:${siteConfig.contact.email}`}>
                <Mail aria-hidden="true" /> {siteConfig.contact.email}
              </a>
            </div>
          </div>
          <aside className="cx-offer__summary" aria-label="Čo dostanete">
            <span>Prvá verzia zahŕňa</span>
            <ul>
              <li><Check /> Návrh otázok a logiky</li>
              <li><Check /> Dizajn prispôsobený webu</li>
              <li><Check /> Funkčnú ukážku na kontrolu</li>
              <li><Check /> Nasadenie a mobilné testovanie</li>
            </ul>
            <small>Odpoveď zvyčajne do 1 pracovného dňa.</small>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function CompetitionLanding() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="cx-page">
        <Hero />
        <ProofBar />
        <DeratScrollStory />
        <Solutions />
        <Portfolio />
        <Process />
        <Faq />
        <FinalOffer />
      </div>
    </MotionConfig>
  );
}
