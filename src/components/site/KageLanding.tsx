import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { realizations } from "@/data/realizations";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./AwardHome.css";
import "./KageLanding.css";

type FlowMode = "chatbot" | "calculator" | "configurator";

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
        title: "Zákazník sa spýta vlastnými slovami.",
        copy: "Napíše, čo potrebuje. Nemusí hľadať správnu podstránku ani vypĺňať dlhý formulár.",
        artifact: "Potrebujem prístrešok pre dve autá. Čo odporúčate?",
      },
      {
        index: "02",
        label: "DOPLNENIE",
        title: "Chatbot si vypýta iba chýbajúce údaje.",
        copy: "Pýta sa len na informácie, ktoré potrebujete na dobrú odpoveď alebo pripravený dopyt.",
        artifact: "Rozmer miesta / lokalita / montáž",
      },
      {
        index: "03",
        label: "ODPOVEĎ",
        title: "Odpovie podľa vašej ponuky.",
        copy: "Zákazník dostane jasnú odpoveď bez toho, aby ste to isté opakovane vysvetľovali po telefóne.",
        artifact: "Možnosti / vysvetlenie / ďalší krok",
      },
      {
        index: "04",
        label: "DOPYT",
        title: "Ak chce pokračovať, odošle pripravený dopyt.",
        copy: "Vy dostanete kontakt spolu s tým, čo zákazník rieši a čo už na webe doplnil.",
        artifact: "Kontakt + rozmery + požiadavka",
      },
    ],
  },
  calculator: {
    label: "Kalkulačka",
    stages: [
      {
        index: "01",
        label: "OTÁZKA",
        title: "Zákazník chce vedieť približnú cenu.",
        copy: "Namiesto telefonátu môže začať výpočet priamo na stránke.",
        artifact: "Koľko približne stojí riešenie pre môj projekt?",
      },
      {
        index: "02",
        label: "VSTUPY",
        title: "Vyberie údaje, ktoré cenu naozaj menia.",
        copy: "Rozmery, model, montáž alebo doplnky. Iba to, čo je pri vašej ponuke potrebné.",
        artifact: "Rozmer / model / montáž / doplnky",
      },
      {
        index: "03",
        label: "VÝPOČET",
        title: "Kalkulačka použije vaše pravidlá.",
        copy: "Cenník a podmienky premeníme na jednoduchý výpočet, ktorý zákazník zvládne sám.",
        artifact: "Vstupy → pravidlá → orientačná cena",
      },
      {
        index: "04",
        label: "VÝSLEDOK",
        title: "Ukáže výsledok a jasný ďalší krok.",
        copy: "Zákazník vie, s čím približne počítať, a môže rovno odoslať údaje na presnú ponuku.",
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
        title: "Zákazník si chce vyskladať správny variant.",
        copy: "Začne jednoduchou otázkou alebo výberom použitia namiesto preklikávania katalógu.",
        artifact: "Čo potrebujem a na čo to budem používať?",
      },
      {
        index: "02",
        label: "MOŽNOSTI",
        title: "Vyberie iba dostupné možnosti.",
        copy: "Rozmer, model, farba alebo doplnky sa ukážu v poradí, ktoré dáva zmysel.",
        artifact: "Veľkosť / model / farba / doplnky",
      },
      {
        index: "03",
        label: "KONTROLA",
        title: "Výber zostáva v reálnych možnostiach.",
        copy: "Logika zákazníka vedie len cez kombinácie, ktoré viete skutočne dodať.",
        artifact: "Dostupné varianty → vhodná zostava",
      },
      {
        index: "04",
        label: "ZOSTAVA",
        title: "Na konci má jasnú zostavu a ďalší krok.",
        copy: "Vybraný variant sa odošle firme spolu s kontaktom a zvolenými údajmi.",
        artifact: "Model + rozmery + doplnky + kontakt",
      },
    ],
  },
};

const tools = [
  {
    index: "01",
    name: "Chatbot",
    statement: "Odpovie na otázky a získa kontakt.",
    copy: "Pre weby, kde sa zákazníci často pýtajú to isté alebo potrebujú poradiť pred objednávkou.",
    preset: "inquiry" as const,
    cta: "Pozrieť ukážku",
  },
  {
    index: "02",
    name: "Kalkulačka",
    statement: "Vypočíta orientačnú cenu alebo rozsah.",
    copy: "Pre služby a produkty, kde výsledok závisí od rozmeru, množstva, variantu alebo ďalších vstupov.",
    preset: "calculator" as const,
    cta: "Vyskúšať výpočet",
  },
  {
    index: "03",
    name: "Konfigurátor",
    statement: "Pomôže vyskladať správny variant.",
    copy: "Pre ponuky s viacerými rozmermi, modelmi, farbami a doplnkami.",
    preset: "product" as const,
    cta: "Pozrieť konfiguráciu",
  },
  {
    index: "04",
    name: "Produktový poradca",
    statement: "Odporučí produkt podľa potrieb zákazníka.",
    copy: "Pre e-shopy, kde sa ľudia strácajú vo veľkom výbere a potrebujú rýchlo zúžiť možnosti.",
    preset: "product" as const,
    cta: "Pozrieť poradcu",
  },
];

const process = [
  ["01", "Zistíme, čo potrebujete", "Prejdeme váš web, ponuku a najčastejšie otázky zákazníkov."],
  ["02", "Navrhneme jednoduchú cestu", "Určíme, čo má zákazník napísať alebo vybrať a čo má dostať na konci."],
  ["03", "Vytvoríme a otestujeme", "Pripravíme dizajn, logiku a napojenia a skontrolujeme ich na počítači aj mobile."],
  ["04", "Nasadíme na váš web", "Zapojíme riešenie a overíme formuláre, dopyty aj bežné správanie."],
] as const;

const signalSections = [
  { index: "01", label: "Úvod", threshold: 0.12, tone: "dark" },
  { index: "02", label: "Možnosti", threshold: 0.28, tone: "light" },
  { index: "03", label: "Ako to funguje", threshold: 0.49, tone: "dark" },
  { index: "04", label: "Realizácie", threshold: 0.68, tone: "light" },
  { index: "05", label: "Riešenia", threshold: 0.85, tone: "light" },
  { index: "06", label: "Kontakt", threshold: 1.01, tone: "dark" },
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
          <span>0{index + 1} / {project.name}</span>
        </a>
      ))}
    </div>
  );
}

function SignalLens() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 96, damping: 27, mass: 0.28 });
  const y = useTransform(progress, [0, 1], ["0vh", "61vh"]);
  const opacity = useTransform(progress, [0, 0.025, 0.07, 0.97, 1], [0, 0, 1, 1, 0.4]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 205, damping: 23 });
  const rotateY = useSpring(pointerX, { stiffness: 205, damping: 23 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = signalSections.findIndex((section) => value < section.threshold);
    setActive(index === -1 ? signalSections.length - 1 : index);
  });

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const yy = (event.clientY / window.innerHeight - 0.5) * -8;
      pointerX.set(Math.max(-6, Math.min(6, x)));
      pointerY.set(Math.max(-4, Math.min(4, yy)));
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, [pointerX, pointerY]);

  const section = signalSections[active];

  return (
    <aside className="signal-rail" data-tone={section.tone} aria-hidden="true">
      <span className="signal-rail__chapter">{section.index}</span>
      <div className="signal-rail__line">
        {signalSections.map((item, index) => (
          <i key={item.index} data-active={index <= active || undefined} />
        ))}
      </div>
      <motion.div
        className="signal-lens"
        data-tone={section.tone}
        style={{ y, opacity, rotateX, rotateY }}
      >
        <span className="signal-lens__wash" />
        <BrandMark size={31} />
        <small>{section.label}</small>
      </motion.div>
    </aside>
  );
}

function FlowStory() {
  const [mode, setMode] = useState<FlowMode>("chatbot");
  const stages = flowModes[mode].stages;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.25 });
  const x = useTransform(
    progress,
    [0, 0.16, 0.3, 0.43, 0.57, 0.7, 0.84, 1],
    ["0%", "0%", "-25%", "-25%", "-50%", "-50%", "-75%", "-75%"],
  );
  const lineScale = useTransform(progress, [0, 1], [0.03, 1]);

  return (
    <section ref={ref} className="hybrid-flow" aria-labelledby="hybrid-flow-title">
      <div className="hybrid-flow__desktop">
        <div className="hybrid-flow__sticky">
          <div className="hybrid-flow__hud container-page">
            <span>AKO TO FUNGUJE</span>
            <div className="hybrid-flow__modes" aria-label="Vyberte typ riešenia">
              {(Object.keys(flowModes) as FlowMode[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  data-active={mode === item}
                  onClick={() => setMode(item)}
                >
                  {flowModes[item].label}
                </button>
              ))}
            </div>
          </div>
          <motion.div className="hybrid-flow__track" style={{ x }}>
            {stages.map((stage, index) => (
              <article className="hybrid-flow__panel" key={`${mode}-${stage.index}`}>
                <div className="container-page hybrid-flow__panel-inner">
                  <div className="hybrid-flow__number">{stage.index}</div>
                  <div className="hybrid-flow__copy">
                    <span>{stage.label}</span>
                    <h2 id={index === 0 ? "hybrid-flow-title" : undefined}>{stage.title}</h2>
                    <p>{stage.copy}</p>
                  </div>
                  <div className="hybrid-flow__artifact" aria-hidden="true">
                    <span>{flowModes[mode].label.toUpperCase()} / {stage.index}</span>
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
        <p className="hybrid-flow__mobile-label">AKO TO FUNGUJE</p>
        <div className="hybrid-flow__mobile-modes" aria-label="Vyberte typ riešenia">
          {(Object.keys(flowModes) as FlowMode[]).map((item) => (
            <button
              type="button"
              key={item}
              data-active={mode === item}
              onClick={() => setMode(item)}
            >
              {flowModes[item].label}
            </button>
          ))}
        </div>
        {stages.map((stage) => (
          <article key={`${mode}-${stage.index}`}>
            <div className="hybrid-flow__mobile-head"><span>{stage.index}</span><b>{stage.label}</b></div>
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
        <span>REALIZÁCIE</span>
        <h2 id="hybrid-work-title">Pozrite si weby, ktoré už bežia.</h2>
        <p>Štyri reálne projekty. Každý môžete otvoriť na živej doméne.</p>
      </div>
      <div className="container-page hybrid-work__grid">
        {realizations.map((project, index) => (
          <article className="hybrid-project" key={project.name}>
            <a href={project.href} target="_blank" rel="noreferrer" className="hybrid-project__visual">
              <img src={project.image} alt={project.alt} loading="eager" decoding="async" />
              <span className="hybrid-project__domain">{project.domain}</span>
              <span className="hybrid-project__open">OTVORIŤ WEB <ArrowUpRight size={15} /></span>
            </a>
            <div className="hybrid-project__meta">
              <span>0{index + 1}</span>
              <div><h3>{project.name}</h3><p>{project.type}</p></div>
              <p>{project.result}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="container-page hybrid-work__footer">
        <Link to="/projekty">Pozrieť všetky projekty <ArrowRight size={18} /></Link>
      </div>
    </section>
  );
}

function LiveDemos() {
  const webko = realizations.find((project) => project.name === "WEBKO");
  return (
    <section className="kage-demos" aria-labelledby="kage-demos-title">
      <div className="container-page kage-demos__intro">
        <span>ŽIVÉ UKÁŽKY</span>
        <h2 id="kage-demos-title">Otvorte si ich. Klikajte.</h2>
        <p>Tu si môžete pozrieť ďalší web a rovno vyskúšať AI asistenta.</p>
      </div>
      <div className="container-page kage-demos__grid">
        {webko ? (
          <a className="kage-demo" href={webko.href} target="_blank" rel="noreferrer">
            <div className="kage-demo__frame">
              <img src={webko.image} alt={webko.alt} loading="lazy" decoding="async" />
              <span>01 / WEBKO</span>
              <b>OTVORIŤ WEB <ArrowUpRight size={16} /></b>
            </div>
            <div className="kage-demo__meta">
              <strong>WEBKO</strong>
              <p>Prezentačný web, ktorý môžete otvoriť a prejsť si celý.</p>
            </div>
          </a>
        ) : null}
        <article className="kage-demo kage-demo--interactive">
          <a
            className="kage-demo__frame"
            href="https://danielvendzur-code.github.io/aplan-chatbot-backend/"
            target="_blank"
            rel="noreferrer"
          >
            <iframe
              src="https://danielvendzur-code.github.io/aplan-chatbot-backend/"
              title="APLAN AI živá ukážka"
              loading="lazy"
              tabIndex={-1}
            />
            <span>02 / APLAN AI</span>
            <b>VYSKÚŠAŤ <ArrowUpRight size={16} /></b>
          </a>
          <div className="kage-demo__meta">
            <strong>APLAN AI</strong>
            <p>Interaktívny asistent. Otvorte ho a skúste si celý flow sami.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function CoreTools() {
  return (
    <section className="hybrid-tools" aria-labelledby="hybrid-tools-title">
      <div className="container-page hybrid-tools__intro">
        <span>RIEŠENIA</span>
        <div><h2 id="hybrid-tools-title">Čo má váš web robiť?</h2><p>Kliknite a otvoríme konkrétnu ukážku.</p></div>
      </div>
      <div className="hybrid-tools__rows">
        {tools.map((tool) => (
          <button
            key={tool.name}
            type="button"
            className="hybrid-tool"
            onClick={() => openSiteAssistant({ source: `tool-${tool.index}`, preset: tool.preset })}
            aria-label={`${tool.cta}: ${tool.name}`}
          >
            <div className="container-page hybrid-tool__inner">
              <span>{tool.index}</span><strong>{tool.name}</strong><b>{tool.statement}</b><p>{tool.copy}</p>
              <span className="hybrid-tool__cta">{tool.cta} <ArrowUpRight size={18} /></span>
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
          <h2>Menej vysvetľovania po telefóne.</h2>
          <p>Chatbot alebo kalkulačka zodpovie bežné otázky, zistí základné údaje a odošle pripravený dopyt.</p>
          <button type="button" onClick={() => openSiteAssistant({ source: "audience-services", preset: "inquiry" })}>
            Ukážte mi riešenie pre služby <ArrowRight size={17} />
          </button>
        </div>
        <div className="hybrid-audience__type" aria-hidden="true">SLUŽBY</div>
      </article>
      <article className="hybrid-audience__panel hybrid-audience__panel--commerce" id="pre-eshopy">
        <div className="hybrid-audience__content">
          <span>PRE E-SHOPY</span>
          <h2>Rýchlejšie k správnemu produktu.</h2>
          <p>Produktový poradca sa opýta na potreby, zúži výber a pošle zákazníka k vhodnému produktu alebo variantu.</p>
          <button type="button" onClick={() => openSiteAssistant({ source: "audience-commerce", preset: "product" })}>
            Ukážte mi riešenie pre e-shop <ArrowRight size={17} />
          </button>
        </div>
        <div className="hybrid-audience__type" aria-hidden="true">E-SHOP</div>
      </article>
    </section>
  );
}

function Process() {
  return (
    <section className="hybrid-process" aria-labelledby="hybrid-process-title">
      <div className="container-page hybrid-process__intro">
        <span>AKO PREBIEHA SPOLUPRÁCA</span>
        <h2 id="hybrid-process-title">Od prvého rozhovoru po nasadenie.</h2>
        <Link to="/postup">Pozrieť celý postup <ArrowRight size={17} /></Link>
      </div>
      <ol className="container-page hybrid-process__list">
        {process.map(([index, title, copy]) => (
          <li key={index}><span>{index}</span><strong>{title}</strong><p>{copy}</p></li>
        ))}
      </ol>
    </section>
  );
}

function Price() {
  return (
    <section className="hybrid-price" aria-labelledby="hybrid-price-title">
      <div className="container-page hybrid-price__top">
        <span>CENA</span>
        <h2 id="hybrid-price-title">Jednoduchý nástroj nemusí stáť tisíce.</h2>
      </div>
      <div className="container-page hybrid-price__grid">
        <div><span>CHATBOT NA MIERU</span><strong>od 450 €</strong></div>
        <div><span>KALKULAČKA / KONFIGURÁTOR</span><strong>od 500 €</strong></div>
        <div><span>PREVÁDZKA</span><strong>10 €</strong><b>/ mesiac</b></div>
        <Link to="/cennik" className="hybrid-price__link">Pozrieť cenník <ArrowUpRight size={18} /></Link>
      </div>
    </section>
  );
}

export function KageLanding() {
  return (
    <div className="hybrid-home kage-home">
      <SignalLens />
      <section className="hybrid-hero kage-hero" aria-labelledby="hybrid-hero-title">
        <div className="container-page hybrid-hero__stage">
          <h1 id="hybrid-hero-title"><span>Od otázky</span><em>k výsledku.</em></h1>
          <HeroCollage />
        </div>
        <div className="container-page hybrid-hero__bottom kage-hero__bottom">
          <p>Web, ktorý vie odpovedať, počítať a poradiť.</p>
          <a href="#realizacie" className="hybrid-hero__primary">Pozrieť realizácie <ArrowUpRight size={17} /></a>
        </div>
      </section>

      <section className="hybrid-manifesto" aria-labelledby="hybrid-manifesto-title">
        <div className="container-page hybrid-manifesto__inner">
          <span>ČO MÔŽE WEB UROBIŤ ZA VÁS</span>
          <h2 id="hybrid-manifesto-title">Môže <em>odpovedať.</em> Môže <em>počítať.</em> Môže <em>pomôcť vybrať.</em> A potom poslať pripravený dopyt.</h2>
        </div>
      </section>

      <FlowStory />
      <SelectedWork />
      <LiveDemos />
      <CoreTools />
      <Audience />
      <Process />
      <Price />

      <section className="hybrid-final" aria-labelledby="hybrid-final-title">
        <div className="container-page hybrid-final__top"><BrandMark size={54} /><span>MÔJ CHATBOT</span></div>
        <div className="container-page hybrid-final__body">
          <h2 id="hybrid-final-title">Povedzte nám, čo má váš web vedieť.</h2>
          <p>Navrhneme jednoduché riešenie a vopred poveme, čo bude obsahovať a koľko bude stáť.</p>
          <div>
            <Link to="/kontakt" className="hybrid-final__button">Chcem návrh riešenia <ArrowUpRight size={19} /></Link>
            <a href="mailto:info@mojchatbot.sk">info@mojchatbot.sk</a>
          </div>
        </div>
      </section>
    </div>
  );
}
