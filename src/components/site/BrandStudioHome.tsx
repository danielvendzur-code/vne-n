import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { faqs } from "@/data/faq";
import { realizations } from "@/data/realizations";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./BrandStudioHome.css";

type SolutionKey = "chatbot" | "calculator" | "configurator";

const solutions: Array<{
  key: SolutionKey;
  index: string;
  name: string;
  title: string;
  copy: string;
  result: string;
}> = [
  {
    key: "chatbot",
    index: "01",
    name: "Chatbot",
    title: "Odpovie skôr, než zákazník odíde.",
    copy: "Používa obsah a pravidlá vašej firmy, pýta sa len na to podstatné a odovzdá vám dopyt aj s kontextom.",
    result: "Kontakt + potreba + pripravený ďalší krok",
  },
  {
    key: "calculator",
    index: "02",
    name: "Kalkulačka",
    title: "Cena bez čakania na odpoveď z e-mailu.",
    copy: "Rozmery, množstvo, doprava či doplnky sa prepočítajú podľa vašich pravidiel priamo počas rozhovoru.",
    result: "Orientačná cena + vstupy zákazníka",
  },
  {
    key: "configurator",
    index: "03",
    name: "Konfigurátor",
    title: "Výber produktu bez chaosu v možnostiach.",
    copy: "Zákazník prejde variantmi krok za krokom. Vy dostanete presnú špecifikáciu namiesto neurčitého formulára.",
    result: "Hotová konfigurácia + kontakt",
  },
];

const plans = [
  {
    name: "START",
    price: "od 390 €",
    monthly: "29 € / mes.",
    copy: "Pre web, ktorý potrebuje odpovedať a zbierať kvalitnejšie dopyty.",
    items: [
      "Chatbot podľa vašich podkladov",
      "Zbieranie dopytu a kontaktu",
      "Dizajn prispôsobený webu",
      "Nasadenie a základná správa",
    ],
  },
  {
    name: "SMART",
    price: "od 690 €",
    monthly: "39 € / mes.",
    copy: "Pre firmy, kde má web zákazníka aj kvalifikovať alebo niečo vypočítať.",
    items: [
      "Všetko zo START",
      "Vlastná konverzačná logika",
      "Kalkulačka alebo jednoduchý konfigurátor",
      "Meranie konverzií",
    ],
    featured: true,
  },
  {
    name: "PRO",
    price: "od 990 €",
    monthly: "59 € / mes.",
    copy: "Pre komplexné riešenia s vlastným workflowom a napojeniami.",
    items: [
      "Všetko zo SMART",
      "Pokročilé vetvenie a konfigurácia",
      "Viac typov dopytov",
      "Voliteľné integrácie podľa projektu",
    ],
  },
];

const process = [
  [
    "01",
    "Krátko si prejdeme váš web",
    "Zistíme, čo zákazníci riešia a kde dnes strácate čas alebo dopyty.",
  ],
  [
    "02",
    "Navrhneme logiku a rozhranie",
    "Bez šablóny. Flow, výpočty a vizuál pripravíme podľa vášho konkrétneho biznisu.",
  ],
  [
    "03",
    "Ukážeme funkčný návrh",
    "Pred nasadením vidíte reálne správanie na desktopoch aj mobiloch.",
  ],
  [
    "04",
    "Nasadíme a doladíme",
    "Zapojíme riešenie na web, otestujeme ho a po spustení vieme ďalej upravovať.",
  ],
] as const;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function BrandStudioHome() {
  const [activeSolution, setActiveSolution] = useState<SolutionKey>("chatbot");
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroStageY = useTransform(scrollYProgress, [0, 1], [0, 58]);
  const heroStageScale = useTransform(scrollYProgress, [0, 1], [1, 0.975]);
  const active = solutions.find((item) => item.key === activeSolution) ?? solutions[0];

  return (
    <div className="bs-home">
      <section ref={heroRef} className="bs-hero">
        <div className="bs-shell bs-hero-copy">
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Z návštevy webu spravíme <span>pripravený dopyt.</span>
          </motion.h1>
          <div className="bs-hero-bottom">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              Chatboty, kalkulačky a konfigurátory na mieru. Odpovedia, vypočítajú a navedú
              zákazníka k ďalšiemu kroku bez toho, aby ste sedeli pri telefóne.
            </motion.p>
            <motion.div
              className="bs-hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link className="bs-button bs-button--primary" to="/kontakt">
                Prebrať váš web <ArrowRight size={18} />
              </Link>
              <a className="bs-button bs-button--text" href="#realizacie">
                Pozrieť realizácie <ArrowUpRight size={17} />
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="bs-shell bs-product-stage"
          style={{ y: heroStageY, scale: heroStageScale }}
        >
          <div className="bs-product-topline">
            <span>Môj Chatbot / živá ukážka</span>
            <button
              type="button"
              onClick={() => openSiteAssistant({ source: "brand-studio-hero" })}
            >
              Otvoriť chatbota <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="bs-product-grid">
            <div className="bs-conversation">
              <div className="bs-conversation-head">
                <b>Môj Chatbot</b>
                <span>online</span>
              </div>
              <div className="bs-message bs-message--bot">
                Dobrý deň. Čo chcete na webe vyriešiť?
              </div>
              <div className="bs-message bs-message--user">Potrebujem prístrešok pre dve autá.</div>
              <div className="bs-message bs-message--bot bs-message--wide">
                Stačia mi tri veci: rozmery, preferovaná strecha a lokalita. Potom vám pripravím
                orientačné riešenie.
              </div>
              <div className="bs-input-line">
                <span>Napíšte správu…</span>
                <span>↗</span>
              </div>
            </div>
            <div className="bs-config-preview">
              <div className="bs-config-index">01 / 03</div>
              <h2>Prístrešok pre dve autá</h2>
              <p>6,0 × 5,5 m · antracit · lamelová stena</p>
              <div className="bs-config-visual" aria-hidden="true">
                <div className="bs-roof" />
                <div className="bs-post bs-post--a" />
                <div className="bs-post bs-post--b" />
                <div className="bs-post bs-post--c" />
                <div className="bs-post bs-post--d" />
                <div className="bs-floor-line" />
              </div>
              <div className="bs-config-summary">
                <span>Výsledok</span>
                <b>Pripravené zadanie pre cenovú ponuku</b>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bs-proof">
        <div className="bs-shell bs-proof-row">
          <span>Reálne projekty</span>
          {realizations.slice(0, 4).map((project) => (
            <a key={project.name} href={project.href} target="_blank" rel="noreferrer">
              {project.name}
            </a>
          ))}
        </div>
      </section>

      <section className="bs-section bs-solutions" id="riesenia">
        <div className="bs-shell">
          <Reveal className="bs-section-head">
            <p>Tri nástroje. Jeden cieľ.</p>
            <h2>Nech web urobí kus práce ešte pred prvým telefonátom.</h2>
          </Reveal>

          <div className="bs-solution-layout">
            <div className="bs-solution-nav" role="tablist" aria-label="Typ riešenia">
              {solutions.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  role="tab"
                  aria-selected={activeSolution === item.key}
                  className={activeSolution === item.key ? "is-active" : undefined}
                  onClick={() => setActiveSolution(item.key)}
                >
                  <span>{item.index}</span>
                  <b>{item.name}</b>
                  <ArrowRight size={17} />
                </button>
              ))}
            </div>

            <div className="bs-solution-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="bs-solution-number">{active.index}</div>
                  <h3>{active.title}</h3>
                  <p>{active.copy}</p>
                  <div className="bs-solution-result">
                    <span>Čo dostanete</span>
                    <b>{active.result}</b>
                  </div>
                  <button
                    type="button"
                    onClick={() => openSiteAssistant({ source: `brand-studio-${active.key}` })}
                  >
                    Vyskúšať tento typ riešenia <ArrowUpRight size={17} />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="bs-case" id="realizacie">
        <div className="bs-shell">
          <Reveal className="bs-case-heading">
            <div>
              <span>Vybraná realizácia</span>
              <h2>DERAT</h2>
            </div>
            <p>
              Kalkulačka a dopytový asistent, ktorý z návštevy webu spraví konkrétne zadanie pre
              firmu.
            </p>
          </Reveal>

          <motion.a
            className="bs-case-media"
            href={realizations[0]?.href}
            target="_blank"
            rel="noreferrer"
            initial={{ clipPath: "inset(8% 0 8% 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={realizations[0]?.image} alt={realizations[0]?.alt ?? "DERAT realizácia"} />
            <span>
              Otvoriť derat.sk <ArrowUpRight size={17} />
            </span>
          </motion.a>
        </div>
      </section>

      <section className="bs-section bs-work">
        <div className="bs-shell">
          <Reveal className="bs-section-head bs-section-head--split">
            <p>Ďalšie realizácie</p>
            <h2>Nie makety. Weby, ktoré si môžete otvoriť.</h2>
          </Reveal>
          <div className="bs-work-grid">
            {realizations.slice(1, 4).map((project, index) => (
              <motion.a
                className="bs-project"
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="bs-project-media">
                  <img src={project.image} alt={project.alt} />
                </div>
                <div className="bs-project-meta">
                  <div>
                    <span>{project.type}</span>
                    <h3>{project.name}</h3>
                  </div>
                  <ArrowUpRight size={20} />
                </div>
                <p>{project.result}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="bs-section bs-value">
        <div className="bs-shell bs-value-grid">
          <Reveal>
            <p className="bs-kicker">Čo sa zmení</p>
            <h2>Menej zisťovania. Viac pripravených rozhovorov.</h2>
          </Reveal>
          <div className="bs-value-rows">
            {[
              ["Bez čakania", "Zákazník dostane odpoveď alebo orientačný výsledok okamžite."],
              ["Bez prázdneho formulára", "Do dopytu príde to, čo reálne potrebujete vedieť."],
              ["Bez generickej šablóny", "Logika aj vizuál sa skladajú podľa vašej služby a webu."],
            ].map(([title, copy], index) => (
              <Reveal className="bs-value-row" key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bs-pricing" id="cena">
        <div className="bs-shell">
          <Reveal className="bs-section-head bs-section-head--pricing">
            <p>Cena</p>
            <h2>Tri úrovne. Jasný rozdiel v rozsahu.</h2>
          </Reveal>
          <div className="bs-pricing-table">
            {plans.map((plan) => (
              <div className={`bs-plan${plan.featured ? " is-featured" : ""}`} key={plan.name}>
                <div className="bs-plan-name">
                  <span>{plan.name}</span>
                  {plan.featured ? <small>Najčastejšia voľba</small> : null}
                </div>
                <div className="bs-plan-price">
                  <b>{plan.price}</b>
                  <span>{plan.monthly}</span>
                </div>
                <p>{plan.copy}</p>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>
                      <Check size={15} /> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/kontakt">
                  Prebrať rozsah <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
          <div className="bs-pricing-link">
            <Link to="/cennik">
              Pozrieť detailný cenník <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bs-section bs-process" id="spolupraca">
        <div className="bs-shell">
          <Reveal className="bs-section-head bs-section-head--split">
            <p>Spolupráca</p>
            <h2>Od prvého rozhovoru po nasadenie bez zbytočných medzi-krokov.</h2>
          </Reveal>
          <div className="bs-process-list">
            {process.map(([index, title, copy]) => (
              <Reveal className="bs-process-row" key={index}>
                <span>{index}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bs-section bs-faq">
        <div className="bs-shell bs-faq-grid">
          <Reveal>
            <p className="bs-kicker">Najčastejšie otázky</p>
            <h2>To podstatné predtým, než sa ozvete.</h2>
          </Reveal>
          <div className="bs-faq-list">
            {faqs.slice(0, 5).map((faq) => (
              <details key={faq.q}>
                <summary>
                  {faq.q}
                  <span>+</span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bs-final">
        <div className="bs-shell bs-final-inner">
          <Reveal>
            <h2>Ukážte nám váš web. Povieme vám, čo na ňom má zmysel automatizovať.</h2>
          </Reveal>
          <Reveal className="bs-final-actions">
            <Link className="bs-button bs-button--light" to="/kontakt">
              Nezáväzná konzultácia <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              onClick={() => openSiteAssistant({ source: "brand-studio-final" })}
            >
              Najprv si vyskúšať chatbota <ArrowUpRight size={17} />
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
