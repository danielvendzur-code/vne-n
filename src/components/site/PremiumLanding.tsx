import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { motion, MotionConfig, useScroll, useSpring } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Calculator,
  Check,
  CircleCheck,
  ExternalLink,
  Mail,
  MessageCircle,
  Rocket,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { GlideField } from "@/components/effects/GlideField";
import { Symbol } from "@/components/Symbol";
import { DeratScrollStory } from "@/components/site/DeratScrollStory";
import { siteConfig } from "@/config/site";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./PremiumLanding.css";

type ComparisonMode = "without" | "with";
type HeroToolKey = "chatbot" | "calculator" | "configurator";

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
    label: "Bez automatizácie",
    title: "Kontakt bez kontextu.",
    copy: "Po formulári ešte zisťujete rozsah, lokalitu, termín aj očakávanie zákazníka.",
    items: ["Odpoveď až neskôr", "Rovnaké otázky dookola", "Nejasná priorita dopytu"],
  },
  with: {
    label: "S vlastným nástrojom",
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

function PageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.22 });
  return <motion.div className="lp-progress" style={{ scaleX }} aria-hidden="true" />;
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
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
  return (
    <Reveal className="lp-heading">
      <p className="lp-eyebrow">
        <i />
        {eyebrow}
      </p>
      <h2>{children}</h2>
      {copy ? <p className="lp-heading-copy">{copy}</p> : null}
    </Reveal>
  );
}

function Hero() {
  const [activeTool, setActiveTool] = useState<HeroToolKey>("chatbot");

  return (
    <section className="lp-hero" id="uvod">
      <div className="lp-hero-glide" aria-hidden="true">
        <GlideField className="glide-field--hero" spacing={12} radius={150} />
      </div>
      <div className="lp-hero-glow" aria-hidden="true" />
      <div className="container-page lp-hero-grid">
        <motion.div
          className="lp-hero-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="lp-eyebrow">
            <i />
            Daniel Vendzúr · webové nástroje na mieru
          </p>
          <h1>
            Web, ktorý nielen vyzerá dobre. <em>Aj pracuje.</em>
          </h1>
          <p className="lp-hero-lead">
            Tvorím chatboty, všetky typy kalkulačiek a konfigurátorov — samostatne aj prepojené v
            jednom riešení. Návštevník dostane odpoveď, vy pripravený dopyt.
          </p>
          <div className="lp-actions">
            <Link to="/kontakt" className="lp-button lp-button-primary">
              Chcem riešenie na mieru <ArrowRight size={17} />
            </Link>
            <a href="#projekty" className="lp-button lp-button-quiet">
              Pozrieť realizácie
            </a>
          </div>
          <p className="lp-hero-note">
            <CircleCheck size={15} /> Od návrhu logiky po nasadenie na váš web.
          </p>
        </motion.div>

        <motion.div
          className="lp-hero-stage"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lp-assistant-card">
            <span className="lp-assistant-bot" aria-hidden="true">
              <Symbol size={48} />
            </span>
            <p>Čo má váš web urobiť za zákazníka?</p>
            <div className="lp-assistant-chips" role="group" aria-label="Typ webového nástroja">
              {(Object.entries(heroTools) as [HeroToolKey, (typeof heroTools)[HeroToolKey]][]).map(
                ([key, tool]) => (
                  <motion.button
                    type="button"
                    key={key}
                    data-active={activeTool === key}
                    aria-pressed={activeTool === key}
                    onClick={() => setActiveTool(key)}
                    whileTap={{ scale: 0.97 }}
                  >
                    {tool.label}
                  </motion.button>
                ),
              )}
            </div>
            <motion.div
              className="lp-assistant-answer"
              key={activeTool}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
            >
              <Sparkles />
              <span>{heroTools[activeTool].text}</span>
            </motion.div>
            <button
              type="button"
              className="lp-assistant-cta"
              onClick={() => openSiteAssistant({ source: "hero-card" })}
            >
              Otvoriť môjho chatbota <ArrowUpRight />
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

  return (
    <section className="lp-value" id="nastroje">
      <div className="container-page">
        <Heading
          eyebrow="Čo sa zmení"
          copy="Nástroj má zákazníkovi zjednodušiť rozhodnutie a vám ušetriť opakované otázky."
        >
          Menej zisťovania. <em>Viac pripravených dopytov.</em>
        </Heading>

        <Reveal className="lp-comparison">
          <div className="lp-switch" role="group" aria-label="Porovnanie webu bez a s nástrojom">
            <button
              type="button"
              data-active={mode === "without"}
              aria-pressed={mode === "without"}
              onClick={() => setMode("without")}
            >
              Bez nástroja
            </button>
            <button
              type="button"
              data-active={mode === "with"}
              aria-pressed={mode === "with"}
              onClick={() => setMode("with")}
            >
              S nástrojom
            </button>
          </div>
          <motion.div
            className="lp-comparison-body"
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="lp-comparison-copy">
              <p>{active.label}</p>
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
        </Reveal>

        <div className="lp-solution-strip">
          {solutions.map(({ icon: Icon, title, copy }) => (
            <Reveal className="lp-solution-pill" key={title}>
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
            <Reveal className="lp-project" key={project.name}>
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
  return (
    <section className="lp-process" id="spolupraca">
      <GlideField className="glide-field--ambient" spacing={16} radius={112} />
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
              <li key={title}>
                <span>0{index + 1}</span>
                <Icon />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="lp-final-card">
          <Symbol size={52} />
          <p>Máte nápad alebo opakujúci sa proces?</p>
          <h2>Pozrime sa, čo môže váš web robiť automaticky.</h2>
          <Link to="/kontakt" className="lp-button lp-button-light">
            Nezáväzná konzultácia <ArrowRight />
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
        <ValueSection />
        <DeratScrollStory />
        <Portfolio />
        <ProcessAndCta />
      </div>
    </MotionConfig>
  );
}
