import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, MessageSquareText } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { liveTools, realizations } from "@/data/realizations";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./CompetitionLanding.css";

type SolutionId = "chatbot" | "calculator" | "configurator" | "advisor";
type FlowMode = Exclude<SolutionId, "advisor">;

type FlowStage = {
  index: string;
  label: string;
  title: string;
  copy: string;
  result: string;
};

const solutions = [
  {
    id: "chatbot" as const,
    index: "01",
    name: "Chatbot",
    result: "Odpovede a dopyty",
    copy: "Odpovie na bežné otázky a pošle vám kontakt aj s tým, čo zákazník rieši.",
    cta: "Vyskúšať chatbot",
    preset: "inquiry" as const,
  },
  {
    id: "calculator" as const,
    index: "02",
    name: "Kalkulačka",
    result: "Orientačná cena",
    copy: "Zákazník zadá pár údajov a hneď vidí odhad podľa vašich pravidiel.",
    cta: "Vyskúšať kalkulačku",
    preset: "calculator" as const,
  },
  {
    id: "configurator" as const,
    index: "03",
    name: "Konfigurátor",
    result: "Výber možností",
    copy: "Prevedie zákazníka iba kombináciami, ktoré viete skutočne dodať.",
    cta: "Vyskúšať konfigurátor",
    preset: "product" as const,
  },
  {
    id: "advisor" as const,
    index: "04",
    name: "Produktový poradca",
    result: "Správny produkt",
    copy: "Zúži ponuku podľa potrieb zákazníka a ukáže mu vhodný produkt alebo variant.",
    cta: "Vyskúšať poradcu",
    preset: "product" as const,
  },
] as const;

const flowModes: Record<FlowMode, { label: string; stages: FlowStage[] }> = {
  chatbot: {
    label: "Chatbot",
    stages: [
      { index: "01", label: "OTÁZKA", title: "Zákazník napíše, čo potrebuje.", copy: "Nemusí hľadať správnu podstránku ani formulár.", result: "„Potrebujem poradiť s výberom.“" },
      { index: "02", label: "DOPLNENIE", title: "Chatbot si vypýta len to podstatné.", copy: "Pýta sa iba na údaje, ktoré menia odpoveď alebo ďalší krok.", result: "Typ služby · miesto · termín" },
      { index: "03", label: "ODPOVEĎ", title: "Dostane jasnú odpoveď.", copy: "Podľa vašej ponuky vysvetlí možnosti a odporučí ďalší krok.", result: "Odpoveď · možnosti · ďalší krok" },
      { index: "04", label: "DOPYT", title: "Vy dostanete pripravený dopyt.", copy: "Kontakt príde spolu s tým, čo zákazník rieši a čo už doplnil.", result: "Kontakt + zhrnutie požiadavky" },
    ],
  },
  calculator: {
    label: "Kalkulačka",
    stages: [
      { index: "01", label: "ZAČIATOK", title: "Zákazník chce vedieť cenu.", copy: "Výpočet začne priamo na webe bez telefonátu.", result: "„Koľko to bude približne stáť?“" },
      { index: "02", label: "ÚDAJE", title: "Vyberie, čo cenu mení.", copy: "Napríklad rozmer, množstvo, model, montáž alebo doplnky.", result: "Rozmer · množstvo · variant" },
      { index: "03", label: "VÝPOČET", title: "Web použije vaše pravidlá.", copy: "Cenník a podmienky premeníme na jednoduchý výpočet.", result: "Vaše pravidlá + váš cenník" },
      { index: "04", label: "VÝSLEDOK", title: "Ukáže odhad a ďalší krok.", copy: "Zákazník vidí orientačnú cenu a môže rovno poslať dopyt.", result: "Odhad ceny + dopyt" },
    ],
  },
  configurator: {
    label: "Konfigurátor",
    stages: [
      { index: "01", label: "VÝBER", title: "Zákazník začne jednoduchou voľbou.", copy: "Namiesto preklikávania celej ponuky odpovie na prvú otázku.", result: "Čo potrebujem?" },
      { index: "02", label: "MOŽNOSTI", title: "Vidí len dostupné možnosti.", copy: "Rozmery, modely, farby a doplnky ukážeme v správnom poradí.", result: "Model · rozmer · farba · doplnky" },
      { index: "03", label: "KONTROLA", title: "Nevhodné kombinácie sa vyradia.", copy: "Zákazník sa nedostane k variante, ktorý neviete dodať.", result: "Iba reálne kombinácie" },
      { index: "04", label: "ZOSTAVA", title: "Hotovú zostavu pošle vám.", copy: "Spolu s kontaktom dostanete presne to, čo si vybral.", result: "Zostava + kontakt" },
    ],
  },
};

const chapters = [
  { id: "uvod", index: "01", label: "Úvod", tone: "dark" },
  { id: "riesenia", index: "02", label: "Riešenia", tone: "light" },
  { id: "realizacie", index: "03", label: "Realizácie", tone: "light" },
  { id: "ako-to-funguje", index: "04", label: "Ako to funguje", tone: "dark" },
  { id: "ukazky", index: "05", label: "Ukážky", tone: "dark" },
  { id: "cena", index: "06", label: "Cena", tone: "light" },
] as const;

function ChapterRail() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 105, damping: 28, mass: 0.22 });
  const beadY = useTransform(progress, [0, 1], [0, 318]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!current) return;
        const index = chapters.findIndex((chapter) => chapter.id === current.target.id);
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.05, 0.2, 0.45] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="competition-rail" data-tone={chapters[active].tone} aria-label="Navigácia po stránke">
      <span className="competition-rail__current">{chapters[active].label}</span>
      <div className="competition-rail__track" aria-hidden="true">
        <motion.i className="competition-rail__bead" style={{ y: beadY }} />
      </div>
      <div className="competition-rail__links">
        {chapters.map((chapter, index) => (
          <a key={chapter.id} href={`#${chapter.id}`} data-active={active === index || undefined}>
            <span>{chapter.index}</span>
            <b>{chapter.label}</b>
          </a>
        ))}
      </div>
    </nav>
  );
}

function Hero() {
  const projects = useMemo(() => {
    const wanted = ["Koverta", "DERAT", "Môj Plot"];
    return wanted
      .map((name) => realizations.find((project) => project.name === name))
      .filter((project): project is (typeof realizations)[number] => Boolean(project));
  }, []);

  return (
    <section className="competition-hero" id="uvod" aria-labelledby="competition-hero-title">
      <div className="container-page competition-hero__stage">
        <div className="competition-hero__copy">
          <h1 id="competition-hero-title">
            <span>Od otázky</span>
            <em>k výsledku.</em>
          </h1>
        </div>
        <div className="competition-hero__work" aria-label="Vybrané realizácie">
          {projects.map((project, index) => (
            <a key={project.name} href={project.href} target="_blank" rel="noreferrer" data-card={index + 1}>
              <img src={project.image} alt={project.alt} decoding="async" fetchPriority="high" />
              <span>0{index + 1}</span>
              <b>{project.name}</b>
            </a>
          ))}
        </div>
      </div>
      <div className="container-page competition-hero__foot">
        <p>Chatbot, kalkulačka alebo konfigurátor priamo na vašom webe.</p>
        <a href="#riesenia">Vybrať riešenie <ArrowRight size={16} /></a>
      </div>
    </section>
  );
}

function SolutionPreview({ id }: { id: SolutionId }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        className="competition-solution-preview__screen"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      >
        {id === "chatbot" ? (
          <div className="preview-chat">
            <div><BrandMark size={28} /><span>Môj Chatbot</span><i>online</i></div>
            <p>Čo potrebujete vyriešiť?</p>
            <p className="preview-chat__me">Hľadám riešenie pre dve autá.</p>
            <p>Rozumiem. Aký priestor máte k dispozícii?</p>
          </div>
        ) : null}
        {id === "calculator" ? (
          <div className="preview-calc">
            <span>ORIENTAČNÝ VÝPOČET</span>
            <strong>2 480 €</strong>
            <div><i style={{ width: "74%" }} /><b>Rozmer</b></div>
            <div><i style={{ width: "52%" }} /><b>Montáž</b></div>
            <div><i style={{ width: "36%" }} /><b>Doplnky</b></div>
            <p>Výsledok sa mení podľa vašich pravidiel.</p>
          </div>
        ) : null}
        {id === "configurator" ? (
          <div className="preview-config">
            <span>3 / 4</span>
            <h3>Vyberte variant</h3>
            <button type="button">Antracit <Check size={16} /></button>
            <button type="button">Biela</button>
            <button type="button">Drevo</button>
            <p>Ukážeme iba možnosti, ktoré sa dajú objednať.</p>
          </div>
        ) : null}
        {id === "advisor" ? (
          <div className="preview-advisor">
            <span>ODPORÚČANIE</span>
            <h3>Najlepšie sedí tento variant.</h3>
            <div className="preview-advisor__chips"><i>do 100 €</i><i>pre začiatočníka</i></div>
            <div className="preview-advisor__result"><b>Produkt 03</b><p>Spĺňa vaše priority a rozpočet.</p></div>
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

function Solutions() {
  const [active, setActive] = useState<SolutionId>("chatbot");
  const selected = solutions.find((solution) => solution.id === active) ?? solutions[0];

  return (
    <section className="competition-solutions" id="riesenia" aria-labelledby="competition-solutions-title">
      <div className="container-page competition-section-head">
        <span>RIEŠENIA</span>
        <h2 id="competition-solutions-title">Čo chcete na webe zjednodušiť?</h2>
        <p>Vyberte výsledok. Ukážka vpravo sa zmení podľa toho, čo riešite.</p>
      </div>
      <div className="container-page competition-solutions__body">
        <div className="competition-solutions__list">
          {solutions.map((solution) => (
            <button
              key={solution.id}
              type="button"
              data-active={active === solution.id || undefined}
              onMouseEnter={() => setActive(solution.id)}
              onFocus={() => setActive(solution.id)}
              onClick={() => openSiteAssistant({ source: `competition-${solution.id}`, preset: solution.preset })}
            >
              <span>{solution.index}</span>
              <div><strong>{solution.name}</strong><b>{solution.result}</b><p>{solution.copy}</p></div>
              <i>{solution.cta} <ArrowUpRight size={16} /></i>
            </button>
          ))}
        </div>
        <div className="competition-solution-preview" aria-live="polite">
          <div className="competition-solution-preview__top"><span>ŽIVÁ UKÁŽKA</span><b>{selected.name}</b></div>
          <SolutionPreview id={active} />
          <button type="button" onClick={() => openSiteAssistant({ source: "competition-preview", preset: selected.preset })}>
            Otvoriť {selected.name.toLowerCase()} <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="competition-work" id="realizacie" aria-labelledby="competition-work-title">
      <div className="container-page competition-section-head competition-section-head--work">
        <span>REALIZÁCIE</span>
        <h2 id="competition-work-title">Pozrite si hotové weby.</h2>
        <p>Všetky sú živé. Kliknutím otvoríte reálnu stránku.</p>
      </div>
      <div className="container-page competition-work__grid">
        {realizations.map((project, index) => (
          <article key={project.name}>
            <a href={project.href} target="_blank" rel="noreferrer" className="competition-work__visual">
              <img src={project.image} alt={project.alt} loading="lazy" decoding="async" />
              <span>{project.domain}</span>
              <b>Otvoriť web <ArrowUpRight size={16} /></b>
            </a>
            <div className="competition-work__meta">
              <span>0{index + 1}</span>
              <div><h3>{project.name}</h3><p>{project.type}</p></div>
              <p>{project.result}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Benefit() {
  return (
    <section className="competition-benefit" aria-labelledby="competition-benefit-title">
      <div className="container-page competition-benefit__inner">
        <span>PRE ZÁKAZNÍKA</span>
        <h2 id="competition-benefit-title">Vie, čo má urobiť ďalej.</h2>
        <div>
          <p><b>01</b><strong>Dostane odpoveď</strong><span>Bez hľadania po celom webe.</span></p>
          <p><b>02</b><strong>Urobí výber</strong><span>Bez zbytočných možností.</span></p>
          <p><b>03</b><strong>Pošle lepší dopyt</strong><span>Vy už poznáte základný kontext.</span></p>
        </div>
      </div>
    </section>
  );
}

function FlowStory() {
  const [mode, setMode] = useState<FlowMode>("chatbot");
  const [activeStage, setActiveStage] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const stages = flowModes[mode].stages;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.22 });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActiveStage(Math.min(stages.length - 1, Math.floor(value * stages.length)));
  });

  const jumpTo = (index: number) => {
    if (!ref.current) return;
    const top = ref.current.offsetTop;
    const distance = Math.max(0, ref.current.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + distance * ((index + 0.08) / stages.length), behavior: "smooth" });
  };

  const stage = stages[activeStage];

  return (
    <section className="competition-flow" id="ako-to-funguje" ref={ref} aria-label="Ako to funguje">
      <div className="competition-flow__sticky">
        <div className="container-page competition-flow__top">
          <span>AKO TO FUNGUJE</span>
          <div className="competition-flow__modes">
            {(Object.keys(flowModes) as FlowMode[]).map((item) => (
              <button key={item} type="button" data-active={mode === item || undefined} onClick={() => { setMode(item); setActiveStage(0); jumpTo(0); }}>
                {flowModes[item].label}
              </button>
            ))}
          </div>
        </div>
        <div className="container-page competition-flow__body">
          <nav className="competition-flow__steps" aria-label="Kroky">
            {stages.map((item, index) => (
              <button key={item.index} type="button" data-active={activeStage === index || undefined} onClick={() => jumpTo(index)}>
                <span>{item.index}</span><b>{item.label}</b>
              </button>
            ))}
          </nav>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={`${mode}-${stage.index}`}
              className="competition-flow__scene"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <div><span>{stage.label}</span><h2>{stage.title}</h2><p>{stage.copy}</p></div>
              <aside><span>{flowModes[mode].label.toUpperCase()} / {stage.index}</span><strong>{stage.result}</strong><i>→</i></aside>
            </motion.article>
          </AnimatePresence>
        </div>
        <motion.i className="competition-flow__progress" style={{ scaleX: progress }} />
      </div>
    </section>
  );
}

function Demos() {
  const webko = realizations.find((project) => project.name === "WEBKO");
  const aplan = liveTools.find((tool) => tool.name === "APLAN AI");

  return (
    <section className="competition-demos" id="ukazky" aria-labelledby="competition-demos-title">
      <div className="container-page competition-section-head competition-section-head--dark">
        <span>VYSKÚŠAJTE SI TO</span>
        <h2 id="competition-demos-title">Nielen screenshoty.</h2>
        <p>Otvorte živý web alebo rovno vyskúšajte asistenta.</p>
      </div>
      <div className="container-page competition-demos__grid">
        {webko ? <a href={webko.href} target="_blank" rel="noreferrer" className="competition-demo">
          <div><img src={webko.image} alt={webko.alt} loading="lazy" /><span>WEBKO</span><b>Otvoriť web <ArrowUpRight size={16} /></b></div>
          <h3>WEBKO</h3><p>Celý prezentačný web na živej doméne.</p>
        </a> : null}
        {aplan ? <a href={aplan.href} target="_blank" rel="noreferrer" className="competition-demo competition-demo--aplan">
          <div className="competition-aplan"><span>APLAN AI <i>ONLINE</i></span><h4>Čo potrebujete vybaviť?</h4><p>Stavebné povolenie</p><p>Dokumenty</p><strong>Pomôžem vám zistiť ďalší krok.</strong><b>Vyskúšať APLAN <ArrowUpRight size={16} /></b></div>
          <h3>APLAN AI</h3><p>Interaktívny asistent, ktorý môžete prejsť celý.</p>
        </a> : null}
        <button type="button" className="competition-demo competition-demo--chat" onClick={() => openSiteAssistant({ source: "competition-live-demo", preset: "inquiry" })}>
          <div className="competition-chat-demo"><BrandMark size={44} /><MessageSquareText size={24} /><p>Napíšte otázku alebo si vyskladajte riešenie.</p><b>Otvoriť Môj Chatbot <ArrowUpRight size={16} /></b></div>
          <h3>Môj Chatbot</h3><p>Presne ten widget, ktorý môže bežať aj na vašom webe.</p>
        </button>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="competition-audience" id="pre-eshopy" aria-label="Pre koho je riešenie">
      <article><span>SLUŽBY</span><h2>Keď zákazník potrebuje odpoveď alebo cenu.</h2><p>Chatbot a kalkulačka vybavia prvé otázky a pripravia dopyt.</p><button type="button" onClick={() => openSiteAssistant({ source: "competition-services", preset: "inquiry" })}>Ukázať riešenie <ArrowRight size={16} /></button></article>
      <article><span>E-SHOPY</span><h2>Keď zákazník nevie, čo si vybrať.</h2><p>Konfigurátor alebo poradca zúži ponuku na možnosti, ktoré dávajú zmysel.</p><button type="button" onClick={() => openSiteAssistant({ source: "competition-commerce", preset: "product" })}>Ukázať riešenie <ArrowRight size={16} /></button></article>
    </section>
  );
}

function ProcessAndPrice() {
  const steps = [
    ["01", "Prejdeme váš web", "Pozrieme ponuku a najčastejšie otázky zákazníkov."],
    ["02", "Navrhneme postup", "Určíme, čo má zákazník vidieť, vybrať alebo napísať."],
    ["03", "Vytvoríme a otestujeme", "Dizajn, logiku aj napojenia skontrolujeme na počítači aj mobile."],
    ["04", "Nasadíme", "Hotové riešenie zapojíme na váš web a overíme odosielanie dopytov."],
  ] as const;

  return (
    <>
      <section className="competition-process" aria-labelledby="competition-process-title">
        <div className="container-page competition-section-head"><span>SPOLUPRÁCA</span><h2 id="competition-process-title">Od prvého rozhovoru po nasadenie.</h2><Link to="/postup">Celý postup <ArrowRight size={16} /></Link></div>
        <ol className="container-page">{steps.map(([index, title, copy]) => <li key={index}><span>{index}</span><strong>{title}</strong><p>{copy}</p></li>)}</ol>
      </section>
      <section className="competition-price" id="cena" aria-labelledby="competition-price-title">
        <div className="container-page competition-section-head"><span>CENA</span><h2 id="competition-price-title">Koľko to stojí?</h2><p>Presnú cenu poviem po krátkom prejdení vášho webu a zadania.</p></div>
        <div className="container-page competition-price__grid">
          <div><span>CHATBOT</span><strong>od 450 €</strong></div>
          <div><span>KALKULAČKA / KONFIGURÁTOR</span><strong>od 500 €</strong></div>
          <div><span>PREVÁDZKA</span><strong>10 €</strong><b>/ mesiac</b></div>
          <Link to="/cennik">Pozrieť cenník <ArrowUpRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}

function FinalCta() {
  return (
    <section className="competition-final" aria-labelledby="competition-final-title">
      <div className="container-page competition-final__brand"><BrandMark size={52} /><span>MÔJ CHATBOT</span></div>
      <div className="container-page competition-final__body"><span>ĎALŠÍ KROK</span><h2 id="competition-final-title">Chcete to aj na svoj web?</h2><p>Pošlite mi web. Navrhnem, čo by na ňom malo zmysel a koľko by to stálo.</p><div><Link to="/kontakt">Chcem návrh <ArrowUpRight size={18} /></Link><a href="mailto:info@mojchatbot.sk">info@mojchatbot.sk</a></div></div>
    </section>
  );
}

export function CompetitionLanding() {
  return (
    <div className="competition-home">
      <ChapterRail />
      <Hero />
      <Solutions />
      <Work />
      <Benefit />
      <FlowStory />
      <Demos />
      <Audience />
      <ProcessAndPrice />
      <FinalCta />
    </div>
  );
}
