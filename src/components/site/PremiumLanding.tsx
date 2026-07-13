import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  Calculator,
  CalendarCheck,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  FileText,
  Gauge,
  Mail,
  MessageCircle,
  MousePointer2,
  Plug,
  Settings2,
  Sparkles,
  Target,
  Workflow,
  Zap,
} from "lucide-react";
import { DeratScrollStory } from "@/components/site/DeratScrollStory";
import { openSiteAssistant } from "@/lib/site-assistant";

const DERAT_URL = "https://derat-chatbot-backend.vercel.app/";
const APLAN_URL = "https://danielvendzur-code.github.io/aplan-chatbot-backend/";

type ToolKey = "chatbot" | "calculator" | "configurator";

const tools = [
  {
    key: "chatbot" as const,
    number: "01",
    eyebrow: "Custom chatbot",
    title: "Odpovie, spresní a zachytí kontakt — aj keď práve nepracujete.",
    copy: "Asistent používa vaše služby, pravidlá a tón komunikácie. Návštevníka nepustí do slepej uličky; otázkami ho dovedie ku konkrétnemu ďalšiemu kroku.",
    value: [
      "Menej opakovaných otázok",
      "Dopyty a kontakty 24/7",
      "Prirodzené nasadenie na váš web",
    ],
    Icon: Bot,
  },
  {
    key: "calculator" as const,
    number: "02",
    eyebrow: "Advanced price calculator",
    title: "Zložitý cenník premení na jednoduché rozhodnutie.",
    copy: "Cena môže reagovať na rozlohu, materiál, lokalitu, termín aj minimálnu hodnotu objednávky. Zákazník výsledku rozumie a vy poznáte celý kontext.",
    value: ["Okamžitý cenový odhad", "Vaše reálne cenové pravidlá", "Kompletné vstupy pri dopyte"],
    Icon: Calculator,
  },
  {
    key: "configurator" as const,
    number: "03",
    eyebrow: "Interactive configurator",
    title: "Ukáže iba možnosti, ktoré spolu naozaj fungujú.",
    copy: "Konfigurátor skladá produkt alebo službu krok po kroku. Stráži kompatibilitu, odporučí vhodný variant a pripraví presnú špecifikáciu pre obchodníka.",
    value: [
      "Menej nesprávnych kombinácií",
      "Rýchlejšie rozhodnutie",
      "Hotová špecifikácia pre predaj",
    ],
    Icon: Settings2,
  },
];

const websiteTypes = [
  {
    tag: "Stavebníctvo",
    title: "Rozpočet podľa rozmerov, materiálu a montáže.",
    cta: "Pozrieť ukážku pre stavebníctvo",
    image: "work/types/construction.svg",
  },
  {
    tag: "E-shopy",
    title: "Výber produktu, variantov a doplnkov bez neistoty.",
    cta: "Pozrieť ukážku pre e-shopy",
    image: "work/types/ecommerce.svg",
  },
  {
    tag: "Lokálne služby",
    title: "Kvalifikovaný dopyt s lokalitou, termínom a prioritou.",
    cta: "Pozrieť ukážku pre služby",
    image: "work/types/services.svg",
  },
  {
    tag: "Výroba na mieru",
    title: "Konfigurácia produktu pripravená rovno do výroby.",
    cta: "Pozrieť ukážku pre výrobu",
    image: "work/types/manufacturing.svg",
  },
];

function PrimaryButton({ source, children }: { source: string; children: React.ReactNode }) {
  return (
    <button
      className="sales-button sales-button-primary"
      onClick={() => openSiteAssistant({ source })}
    >
      <span>{children}</span>
      <ArrowRight size={17} aria-hidden="true" />
    </button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  inverse = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
  inverse?: boolean;
}) {
  return (
    <div className={`sales-heading ${inverse ? "sales-heading-inverse" : ""}`}>
      <p className="sales-kicker">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {copy ? <p className="sales-heading-copy">{copy}</p> : null}
    </div>
  );
}

function Hero() {
  const [focus, setFocus] = useState<"chat" | "price">("price");

  return (
    <section className="sales-hero">
      <div className="sales-hero-orb sales-hero-orb-one" aria-hidden="true" />
      <div className="sales-hero-orb sales-hero-orb-two" aria-hidden="true" />
      <div className="container-page sales-hero-grid">
        <div className="sales-hero-copy">
          <div className="sales-availability">
            <span /> Prijímam nové projekty
          </div>
          <h1>
            Webové nástroje, ktoré z návštevnosti robia <em>konkrétne dopyty.</em>
          </h1>
          <p>
            Navrhnem chatbot, inteligentnú kalkulačku alebo konfigurátor podľa vášho predaja — aby
            zákazník dostal odpoveď hneď a vy všetky údaje pre ďalší krok.
          </p>
          <div className="sales-hero-actions">
            <PrimaryButton source="hero-consultation">Nezáväzná konzultácia</PrimaryButton>
            <a className="sales-button sales-button-ghost" href="#realne-ukazky">
              Pozrieť živé ukážky <ChevronRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="sales-hero-proof" aria-label="Hlavné výhody">
            <span>
              <CircleCheck size={16} /> Na mieru vašej logike
            </span>
            <span>
              <CircleCheck size={16} /> Mobil aj desktop
            </span>
            <span>
              <CircleCheck size={16} /> Bez prerábky celého webu
            </span>
          </div>
        </div>

        <div className="sales-hero-visual" aria-label="Ukážka automatizovaného dopytu">
          <div className="sales-hero-browser">
            <div className="sales-browser-bar">
              <div>
                <i />
                <i />
                <i />
              </div>
              <span>vášweb.sk / dopyt</span>
              <Zap size={15} />
            </div>
            <div className="sales-browser-body">
              <div className="sales-browser-copy">
                <span>Služba dostupná online</span>
                <strong>Koľko bude stáť váš projekt?</strong>
                <p>Odpovedzte na 3 krátke otázky.</p>
              </div>
              <div className="sales-browser-chips">
                <button onClick={() => setFocus("price")} data-active={focus === "price"}>
                  Vypočítať cenu
                </button>
                <button onClick={() => setFocus("chat")} data-active={focus === "chat"}>
                  Poradiť s výberom
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {focus === "price" ? (
              <motion.div
                className="sales-floating-card sales-price-card"
                key="price"
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <div className="sales-card-label">
                  <Calculator size={15} /> Orientačný rozpočet
                </div>
                <strong>1 240 – 1 480 €</strong>
                <div className="sales-mini-progress">
                  <span />
                </div>
                <p>
                  <Check size={14} /> Montáž a doprava započítaná
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="sales-floating-card sales-chat-card"
                key="chat"
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <div className="sales-card-label">
                  <MessageCircle size={15} /> Asistent je online
                </div>
                <p>Čo potrebujete vyriešiť?</p>
                <div className="sales-chat-options">
                  <span>Cenu</span>
                  <span>Výber riešenia</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="sales-lead-card">
            <div className="sales-lead-avatar">
              <Target size={18} />
            </div>
            <div>
              <span>Nový kvalifikovaný dopyt</span>
              <strong>Pripravený pre obchod</strong>
            </div>
            <CircleCheck size={21} />
          </div>
        </div>
      </div>
      <div className="container-page sales-client-line">
        <span>Jeden systém namiesto</span>
        <div>
          <b>7×</b> opakovanej otázky
        </div>
        <div>
          <b>24/7</b> zachytávania dopytov
        </div>
        <div>
          <b>1×</b> pripraveného zadania
        </div>
      </div>
    </section>
  );
}

function ToolPreview({ active }: { active: ToolKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        className={`sales-tool-preview sales-tool-preview-${active}`}
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.985 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {active === "chatbot" ? (
          <>
            <div className="sales-preview-top">
              <span>
                <Bot size={16} /> Webový asistent
              </span>
              <i />
            </div>
            <div className="sales-message sales-message-muted">Dobrý deň, s čím vám pomôžem?</div>
            <div className="sales-message sales-message-user">Potrebujem cenovú ponuku.</div>
            <div className="sales-message sales-message-muted">Aký rozsah má zákazka?</div>
            <div className="sales-choice-row">
              <span>do 50 m²</span>
              <span>50–150 m²</span>
            </div>
            <div className="sales-preview-status">
              <Check size={14} /> Kontakt zachytený
            </div>
          </>
        ) : active === "calculator" ? (
          <>
            <div className="sales-preview-top">
              <span>
                <Calculator size={16} /> Inteligentný výpočet
              </span>
              <b>2 / 3</b>
            </div>
            <p className="sales-preview-question">Aký je rozsah projektu?</p>
            <strong className="sales-preview-number">
              84 <small>m²</small>
            </strong>
            <div className="sales-fake-range">
              <span />
            </div>
            <div className="sales-choice-row">
              <span>Materiál B</span>
              <span>+ montáž</span>
            </div>
            <div className="sales-preview-total">
              <span>Odhad ceny</span>
              <strong>2 180 €</strong>
            </div>
          </>
        ) : (
          <>
            <div className="sales-preview-top">
              <span>
                <Settings2 size={16} /> Konfigurátor
              </span>
              <b>75 %</b>
            </div>
            <p className="sales-preview-question">Vyberte finálnu povrchovú úpravu</p>
            <div className="sales-swatch-row">
              <button />
              <button className="active" />
              <button />
            </div>
            <div className="sales-config-product">
              <span />
              <div>
                <small>Odporúčaný variant</small>
                <strong>Model LINE / antracit</strong>
              </div>
            </div>
            <div className="sales-preview-status">
              <Check size={14} /> Všetky prvky sú kompatibilné
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function ToolShowcase() {
  const [active, setActive] = useState<ToolKey>("chatbot");
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-tool]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive((visible.target as HTMLElement).dataset.tool as ToolKey);
      },
      { threshold: [0.35, 0.55, 0.75], rootMargin: "-18% 0px -28% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sales-tools" id="nastroje" ref={rootRef}>
      <div className="container-page">
        <SectionHeading
          eyebrow="Tri nástroje. Jeden obchodný cieľ."
          title={
            <>
              Zákazník sa rozhodne ľahšie. <em>Vy získate viac kontextu.</em>
            </>
          }
          copy="Nie hotová šablóna s vaším logom. Každý tok navrhnem podľa toho, ako naozaj nacenjujete, odporúčate a predávate."
        />
        <div className="sales-tools-layout">
          <div className="sales-tool-list">
            {tools.map(({ key, number, eyebrow, title, copy, value, Icon }) => (
              <article
                key={key}
                className="sales-tool-row"
                data-tool={key}
                data-active={active === key}
                onMouseEnter={() => setActive(key)}
              >
                <div className="sales-tool-index">{number}</div>
                <div className="sales-tool-content">
                  <p>
                    <Icon size={17} /> {eyebrow}
                  </p>
                  <h3>{title}</h3>
                  <div className="sales-tool-detail">
                    <p>{copy}</p>
                    <ul>
                      {value.map((item) => (
                        <li key={item}>
                          <Check size={14} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="sales-tool-sticky">
            <ToolPreview active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveDemos() {
  return (
    <section className="sales-live" id="realne-ukazky">
      <div className="container-page">
        <SectionHeading
          inverse
          eyebrow="Živé ukážky"
          title={
            <>
              Nie slideshow. <em>Fungujúce nástroje online.</em>
            </>
          }
          copy="Otvorte si ich, preklikajte tok a pozrite si, ako sa samostatný widget správa mimo prezentačnej makety."
        />
        <div className="sales-live-grid">
          <a
            href={DERAT_URL}
            target="_blank"
            rel="noreferrer"
            className="sales-live-card sales-live-derat"
          >
            <div className="sales-live-card-top">
              <span>01 / cenová kalkulačka + AI</span>
              <ArrowRight />
            </div>
            <div className="sales-live-phone">
              <div className="sales-live-phone-head">
                <i>DERAT</i>
                <span>
                  AI asistent <b />
                </span>
              </div>
              <div className="sales-live-phone-tabs">
                <strong>Kalkulačka</strong>
                <span>AI asistent</span>
              </div>
              <p>Čo riešite?</p>
              <div className="sales-live-phone-option">
                <span>🐀</span>
                <div>
                  <b>Deratizácia</b>
                  <small>Hlodavce, kuna a lasica</small>
                </div>
                <strong>od 60 €</strong>
              </div>
              <button>Pokračovať</button>
            </div>
            <div className="sales-live-card-copy">
              <p>DERAT</p>
              <h3>Osem krokov, okamžitá cena a hotový dopyt.</h3>
              <span>
                Otvoriť živý widget <ArrowRight size={16} />
              </span>
            </div>
          </a>

          <a
            href={APLAN_URL}
            target="_blank"
            rel="noreferrer"
            className="sales-live-card sales-live-aplan"
          >
            <div className="sales-live-card-top">
              <span>02 / samostatný embed</span>
              <ArrowRight />
            </div>
            <div className="sales-live-code">
              <div className="sales-aplan-mark">A</div>
              <pre>
                <code>{`<script\n  src="https://aplan-kappa.vercel.app/embed.js"\n  defer\n></script>`}</code>
              </pre>
              <div className="sales-code-pulse">
                <span /> pripravené na vloženie
              </div>
            </div>
            <div className="sales-live-card-copy">
              <p>APLAN AI</p>
              <h3>Asistent vložený na ľubovoľnú stránku jedným skriptom.</h3>
              <span>
                Otvoriť embed demo <ArrowRight size={16} />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

type ServiceKey = "derat" | "dezinsekcia" | "dezinfekcia";
type UrgencyKey = "standard" | "weekend" | "urgent";

function CalculatorSandbox() {
  const [service, setService] = useState<ServiceKey>("derat");
  const [area, setArea] = useState(70);
  const [urgency, setUrgency] = useState<UrgencyKey>("standard");
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("sales-calculator-demo");
      if (!saved) return;
      const parsed = JSON.parse(saved) as {
        service?: ServiceKey;
        area?: number;
        urgency?: UrgencyKey;
      };
      if (parsed.service) setService(parsed.service);
      if (typeof parsed.area === "number") setArea(parsed.area);
      if (parsed.urgency) setUrgency(parsed.urgency);
      setRestored(true);
    } catch {
      // A demo must remain usable even when storage is blocked.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "sales-calculator-demo",
        JSON.stringify({ service, area, urgency }),
      );
    } catch {
      // Storage is an enhancement, not a requirement.
    }
  }, [service, area, urgency]);

  const result = useMemo(() => {
    const base = service === "derat" ? 60 : service === "dezinsekcia" ? 72 : 84;
    const areaPart = Math.max(0, Math.ceil((area - 40) / 10) * 7);
    const multiplier = urgency === "standard" ? 1 : urgency === "weekend" ? 1.2 : 1.5;
    const low = Math.round((base + areaPart) * multiplier);
    const high = Math.round(low * 1.18);
    const score = area >= 150 || urgency === "urgent" ? "Vysoká priorita" : "Pripravený dopyt";
    return { low, high, score };
  }, [service, area, urgency]);

  return (
    <section className="sales-calculator" id="vyskusat">
      <div className="container-page sales-calculator-grid">
        <div>
          <SectionHeading
            eyebrow="Vyskúšajte si to"
            title={
              <>
                Dopyt, ktorý netreba <em>znova zisťovať.</em>
              </>
            }
            copy="Kliknite na vstupy. Cena sa prepočíta okamžite a zvolené údaje zostanú uložené aj po obnovení stránky — presne tak, ako môže fungovať váš zákaznícky tok."
          />
          <div className="sales-benefit-grid">
            <div>
              <Gauge />
              <strong>Lead scoring</strong>
              <span>Priorita podľa hodnoty a naliehavosti.</span>
            </div>
            <div>
              <FileText />
              <strong>PDF ponuka</strong>
              <span>Voliteľné automatické vygenerovanie.</span>
            </div>
            <div>
              <Plug />
              <strong>CRM / e-mail</strong>
              <span>Dáta pripravené pre vaše systémy.</span>
            </div>
          </div>
        </div>

        <div className="sales-sandbox">
          <div className="sales-sandbox-top">
            <span>
              <Sparkles size={15} /> Interaktívna kalkulačka
            </span>
            <span className="sales-saved-state">
              <i /> {restored ? "Údaje obnovené" : "Automaticky ukladá"}
            </span>
          </div>
          <div className="sales-sandbox-body">
            <fieldset>
              <legend>1. Typ služby</legend>
              <div className="sales-sandbox-options">
                {(
                  [
                    ["derat", "Deratizácia"],
                    ["dezinsekcia", "Dezinsekcia"],
                    ["dezinfekcia", "Dezinfekcia"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    data-active={service === value}
                    onClick={() => setService(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>
                2. Rozloha priestoru <strong>{area} m²</strong>
              </legend>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={area}
                aria-label="Rozloha priestoru"
                style={{ "--range-value": `${((area - 20) / 280) * 100}%` } as React.CSSProperties}
                onChange={(event) => setArea(Number(event.target.value))}
              />
              <div className="sales-range-labels">
                <span>20 m²</span>
                <span>300 m²</span>
              </div>
            </fieldset>
            <fieldset>
              <legend>3. Termín</legend>
              <div className="sales-sandbox-options">
                {(
                  [
                    ["standard", "Pracovný deň"],
                    ["weekend", "Víkend"],
                    ["urgent", "Urgentne"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    data-active={urgency === value}
                    onClick={() => setUrgency(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          <motion.div className="sales-sandbox-result" layout>
            <div>
              <span>Orientačná cena bez DPH</span>
              <strong>
                {result.low} – {result.high} €
              </strong>
            </div>
            <div className="sales-score">
              <Target size={15} /> {result.score}
            </div>
          </motion.div>
          <button
            className="sales-sandbox-cta"
            onClick={() => openSiteAssistant({ source: "calculator-sandbox" })}
          >
            Chcem takúto kalkulačku <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

function WebsiteTypes() {
  return (
    <section className="sales-websites" id="typy-webov">
      <div className="container-page">
        <SectionHeading
          eyebrow="Kde to funguje"
          title={
            <>
              Jeden princíp. <em>Desiatky obchodných scenárov.</em>
            </>
          }
          copy="Ukážka môže začať na novom webe alebo ako samostatný nástroj na stránke, ktorú už máte."
        />
        <div className="sales-website-grid">
          {websiteTypes.map((item, index) => (
            <motion.article
              className="sales-website-card"
              key={item.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className="sales-website-image">
                {/* Replace this image source with a final project screenshot when available. */}
                <img
                  src={`${import.meta.env.BASE_URL}${item.image}`}
                  alt={`Ukážkový web pre segment ${item.tag}`}
                  loading="lazy"
                  width="720"
                  height="440"
                />
              </div>
              <div className="sales-website-copy">
                <p>{item.tag}</p>
                <h3>{item.title}</h3>
                <button onClick={() => openSiteAssistant({ source: `website-type-${item.tag}` })}>
                  {item.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="sales-project-strip">
          <span>Ďalšie verejné projekty</span>
          {[
            ["koverta.sk", "https://koverta.sk/"],
            ["webko.sk", "https://webko.sk/"],
            ["mojplot.sk", "https://mojplot.sk/"],
            ["moj.chatbot.backend", "https://danielvendzur-code.github.io/moj.chatbot.backend/"],
          ].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              {label}
              <ArrowRight size={14} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const processSteps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Krátka analýza",
    copy: "Prejdeme vaše služby, cenník a otázky, ktoré zákazníkom opakujete najčastejšie.",
    meta: "30–45 min. rozhovor",
  },
  {
    number: "02",
    icon: Workflow,
    title: "Návrh logiky a dizajnu",
    copy: "Pripravím tok otázok, pravidlá výpočtu a rozhranie, ktoré prirodzene zapadne do vašej značky.",
    meta: "Klikateľný návrh",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Implementácia na web",
    copy: "Nástroj prepojím, otestujem na mobile aj desktope a nasadím bez zbytočnej odstávky.",
    meta: "Ostré nasadenie",
  },
];

function Process() {
  return (
    <section className="sales-process" id="spolupraca">
      <div className="container-page">
        <SectionHeading
          eyebrow="Od prvých otázok po nasadenie"
          title={
            <>
              Jasný proces. <em>Žiadne technické bludisko.</em>
            </>
          }
        />
        <ol className="sales-process-list">
          {processSteps.map(({ number, icon: Icon, title, copy, meta }, index) => (
            <motion.li
              key={number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.42, delay: index * 0.08 }}
            >
              <div className="sales-process-number">{number}</div>
              <div className="sales-process-icon">
                <Icon />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <span>
                {meta}
                <ChevronRight size={17} />
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="sales-pricing" id="cena">
      <div className="container-page sales-pricing-grid">
        <div>
          <SectionHeading
            inverse
            eyebrow="Férový rozsah namiesto balíkov"
            title={
              <>
                Platíte za riešenie, ktoré <em>vašej firme dáva zmysel.</em>
              </>
            }
            copy="Cena sa odvíja od počtu krokov, zložitosti výpočtov, dizajnu a napojení. Po úvodnom rozhovore dostanete jasný rozsah aj cenu — bez prekvapení."
          />
          <div className="sales-pricing-points">
            <span>
              <Check /> Konkrétny rozsah pred začiatkom
            </span>
            <span>
              <Check /> Možnosť spustiť menšiu prvú verziu
            </span>
            <span>
              <Check /> Hosting a ďalšie úpravy podľa dohody
            </span>
          </div>
        </div>
        <div className="sales-pricing-card">
          <div className="sales-pricing-card-label">
            <Sparkles size={16} /> Návrh projektu
          </div>
          <h3>Najprv pochopíme problém. Potom naceníme riešenie.</h3>
          <div className="sales-scope-lines">
            <span>
              <i style={{ width: "78%" }} />
            </span>
            <span>
              <i style={{ width: "56%" }} />
            </span>
            <span>
              <i style={{ width: "88%" }} />
            </span>
          </div>
          <div className="sales-pricing-card-footer">
            <span>Prvá konzultácia</span>
            <strong>nezáväzne</strong>
          </div>
          <PrimaryButton source="pricing-consultation">Zistiť rozsah môjho projektu</PrimaryButton>
        </div>
      </div>
    </section>
  );
}

function FinalContact() {
  return (
    <section className="sales-final">
      <div className="container-page sales-final-inner">
        <p className="sales-kicker">
          <span /> Stačí jedna konkrétna služba
        </p>
        <h2>Ukážte mi, čo dnes zákazníkom vysvetľujete ručne.</h2>
        <p>Navrhnem, ako z toho spraviť jednoduchý chatbot, kalkulačku alebo konfigurátor.</p>
        <div className="sales-final-actions">
          <PrimaryButton source="final-consultation">Nezáväzná konzultácia</PrimaryButton>
          <a href="mailto:info@webko.sk">
            <Mail size={17} /> info@webko.sk
          </a>
          <a href="tel:+421910893949">
            <Clock3 size={17} /> +421 910 893 949
          </a>
        </div>
      </div>
    </section>
  );
}

export function PremiumLanding() {
  return (
    <>
      <Hero />
      <ToolShowcase />
      <LiveDemos />
      <DeratScrollStory />
      <CalculatorSandbox />
      <WebsiteTypes />
      <Process />
      <Pricing />
      <FinalContact />
    </>
  );
}
