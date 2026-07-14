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
  Plug,
  Settings2,
  Sparkles,
  Target,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { DeratScrollStory } from "@/components/site/DeratScrollStory";
import { openSiteAssistant } from "@/lib/site-assistant";

type ToolKey = "chatbot" | "calculator" | "configurator";
type ServiceKey = "derat" | "dezinsekcia" | "dezinfekcia";
type UrgencyKey = "standard" | "weekend" | "urgent";

const tools = [
  {
    key: "chatbot" as const,
    number: "01",
    eyebrow: "Chatbot na mieru",
    title: "Odpovie a zachytí kontakt, aj keď práve nepracujete.",
    copy: "Pozná vaše služby, položí správne otázky a dovedie návštevníka ku konkrétnemu ďalšiemu kroku.",
    value: ["Menej opakovaných otázok", "Dopyty 24/7", "Váš tón komunikácie"],
    Icon: Bot,
  },
  {
    key: "calculator" as const,
    number: "02",
    eyebrow: "Pokročilá kalkulačka",
    title: "Zložitý cenník premení na jednoduché rozhodnutie.",
    copy: "Rozloha, materiál, lokalita aj termín sa premietnu do ceny. Zákazník výsledku rozumie a vy poznáte celý kontext.",
    value: ["Odhad ceny ihneď", "Reálne cenové pravidlá", "Kompletné vstupy"],
    Icon: Calculator,
  },
  {
    key: "configurator" as const,
    number: "03",
    eyebrow: "Interaktívny konfigurátor",
    title: "Ukáže iba možnosti, ktoré spolu naozaj fungujú.",
    copy: "Zúži výber, stráži kompatibilitu a pripraví presnú špecifikáciu pre váš obchod alebo výrobu.",
    value: ["Menej chybných kombinácií", "Rýchlejší výber", "Hotová špecifikácia"],
    Icon: Settings2,
  },
];

const websiteTypes = [
  {
    tag: "Stavebníctvo",
    title: "Rozpočet podľa rozmerov, materiálu a montáže.",
    cta: "Ukážka pre stavebníctvo",
    image: "work/types/construction.svg",
  },
  {
    tag: "E-shopy",
    title: "Výber produktu, variantov a doplnkov bez neistoty.",
    cta: "Ukážka pre e-shopy",
    image: "work/types/ecommerce.svg",
  },
  {
    tag: "Lokálne služby",
    title: "Dopyt s lokalitou, termínom a prioritou.",
    cta: "Ukážka pre služby",
    image: "work/types/services.svg",
  },
];

const processSteps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Krátka analýza",
    copy: "Prejdeme služby, cenník a otázky, ktoré dnes zisťujete ručne.",
  },
  {
    number: "02",
    icon: Workflow,
    title: "Logika a dizajn",
    copy: "Navrhnem tok, výpočty a rozhranie, ktoré zapadne do vašej značky.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Nasadenie na web",
    copy: "Nástroj prepojím, otestujem a spustím bez prerábky celého webu.",
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
    <motion.div
      className={`sales-heading ${inverse ? "sales-heading-inverse" : ""}`}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="sales-kicker">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {copy ? <p className="sales-heading-copy">{copy}</p> : null}
    </motion.div>
  );
}

function Hero() {
  const [focus, setFocus] = useState<"chat" | "price">("price");

  return (
    <section className="sales-hero">
      <div className="sales-hero-orb sales-hero-orb-one" aria-hidden="true" />
      <div className="sales-hero-orb sales-hero-orb-two" aria-hidden="true" />
      <div className="container-page sales-hero-grid">
        <motion.div
          className="sales-hero-copy"
          initial={{ opacity: 0, x: -34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sales-availability">
            <span /> Prijímam nové projekty
          </div>
          <h1>
            Webové nástroje, ktoré z návštevníkov robia <em>zákazníkov.</em>
          </h1>
          <p>
            Chatbot, cenová kalkulačka alebo konfigurátor na mieru — zákazník dostane odpoveď hneď a
            vy hotový dopyt namiesto ďalšieho zisťovania.
          </p>
          <div className="sales-hero-actions">
            <PrimaryButton source="hero-interest">Mám záujem o riešenie</PrimaryButton>
            <a className="sales-button sales-button-ghost" href="#porovnanie">
              Ukážte mi rozdiel <ChevronRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="sales-hero-proof" aria-label="Hlavné výhody">
            <span>
              <CircleCheck size={16} /> Na mieru vašej logike
            </span>
            <span>
              <CircleCheck size={16} /> Funguje 24/7
            </span>
            <span>
              <CircleCheck size={16} /> Mobil aj desktop
            </span>
          </div>
        </motion.div>

        <motion.div
          className="sales-hero-visual"
          aria-label="Ukážka automatizovaného dopytu"
          initial={{ opacity: 0, x: 42 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
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
                <span>Odpoveď do jednej minúty</span>
                <strong>Koľko bude stáť váš projekt?</strong>
                <p>Stačia 3 krátke odpovede.</p>
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
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
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
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
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
        </motion.div>
      </div>
    </section>
  );
}

const comparison = {
  without: {
    eyebrow: "Bez chatbota a kalkulačky",
    title: "Návštevník čaká. Vy sa pýtate znova.",
    copy: "Nejasný formulár odošle iba meno a telefón. Cenu, rozsah aj termín musíte zisťovať pri ďalšom kontakte.",
    items: [
      "Odpoveď až počas pracovnej doby",
      "5–7 doplňujúcich otázok",
      "Časť návštevníkov odíde bez kontaktu",
    ],
  },
  with: {
    eyebrow: "S chatbotom a kalkulačkou",
    title: "Zákazník má jasno. Vy máte hotový dopyt.",
    copy: "Systém odpovie, vypočíta odhad a uloží všetky vstupy. Obchodník pokračuje presne tam, kde zákazník skončil.",
    items: [
      "Odpoveď a odhad ceny ihneď",
      "Kontakt aj kontext na jednom mieste",
      "Priorita dopytu pripravená pre obchod",
    ],
  },
};

function ImpactSwitch() {
  const [mode, setMode] = useState<"without" | "with">("with");
  const active = comparison[mode];

  return (
    <section className="sales-impact" id="porovnanie">
      <div className="container-page">
        <SectionHeading
          eyebrow="Rozdiel, ktorý cíti zákazník aj firma"
          title={
            <>
              Menej zisťovania. <em>Viac pripravených dopytov.</em>
            </>
          }
          copy="Prepnite si, ako vyzerá rovnaká návšteva webu bez automatizácie a s nástrojom na mieru."
        />

        <div className="sales-impact-shell">
          <div
            className="sales-impact-switch"
            role="group"
            aria-label="Porovnanie webu bez nástroja a s nástrojom"
          >
            <button
              type="button"
              data-active={mode === "without"}
              onClick={() => setMode("without")}
            >
              Bez nástroja
            </button>
            <button type="button" data-active={mode === "with"} onClick={() => setMode("with")}>
              S chatbotom + kalkulačkou
            </button>
          </div>

          <div className="sales-impact-grid">
            <AnimatePresence mode="wait">
              <motion.div
                className="sales-impact-copy"
                key={`copy-${mode}`}
                initial={{ opacity: 0, x: mode === "with" ? 26 : -26 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "with" ? -18 : 18 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="sales-impact-eyebrow" data-mode={mode}>
                  {active.eyebrow}
                </p>
                <h3>{active.title}</h3>
                <p>{active.copy}</p>
                <ul>
                  {active.items.map((item) => (
                    <li key={item}>
                      {mode === "with" ? <Check size={16} /> : <X size={16} />}
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                className="sales-impact-visual"
                data-mode={mode}
                key={`visual-${mode}`}
                initial={{ opacity: 0, x: mode === "with" ? 34 : -34 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "with" ? -24 : 24 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="sales-impact-windowbar">
                  <span />
                  <span />
                  <span />
                  <b>{mode === "with" ? "Nový dopyt" : "Kontaktný formulár"}</b>
                </div>
                {mode === "without" ? (
                  <div className="sales-impact-empty">
                    <div className="sales-empty-field">
                      <small>Meno</small>
                      <span />
                    </div>
                    <div className="sales-empty-field">
                      <small>Telefón</small>
                      <span />
                    </div>
                    <div className="sales-empty-field sales-empty-message">
                      <small>Správa</small>
                      <span />
                    </div>
                    <div className="sales-empty-button">Odoslať</div>
                    <p>
                      <Clock3 size={15} /> Podrobnosti zistíte až telefonicky
                    </p>
                  </div>
                ) : (
                  <div className="sales-impact-ready">
                    <div className="sales-ready-head">
                      <span>
                        <CircleCheck /> Dopyt pripravený
                      </span>
                      <b>92 bodov</b>
                    </div>
                    <strong>Deratizácia · byt 70 m²</strong>
                    <div className="sales-ready-price">
                      <small>Orientačná cena</small>
                      <b>99 € bez DPH</b>
                    </div>
                    <dl>
                      <div>
                        <dt>Škodca</dt>
                        <dd>Potkany</dd>
                      </div>
                      <div>
                        <dt>Termín</dt>
                        <dd>Pracovný deň</dd>
                      </div>
                      <div>
                        <dt>Lokalita</dt>
                        <dd>Bratislava</dd>
                      </div>
                      <div>
                        <dt>Kontakt</dt>
                        <dd>Zachytený</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="sales-impact-cta">
            <span>Čo by vedel automatizovať váš web?</span>
            <PrimaryButton source="comparison-interest">Mám záujem</PrimaryButton>
          </div>
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
        initial={{ opacity: 0, x: 26 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -18 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
              <button aria-label="Svetlý variant" />
              <button className="active" aria-label="Antracitový variant" />
              <button aria-label="Béžový variant" />
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
      { threshold: [0.35, 0.6], rootMargin: "-20% 0px -30% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sales-tools sales-tools-compact" id="nastroje" ref={rootRef}>
      <div className="container-page">
        <SectionHeading
          eyebrow="Tri nástroje. Jeden cieľ."
          title={
            <>
              Zákazník sa rozhodne ľahšie. <em>Vy získate viac kontextu.</em>
            </>
          }
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
      // The preview remains usable when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "sales-calculator-demo",
        JSON.stringify({ service, area, urgency }),
      );
    } catch {
      // Persistence is an enhancement, not a requirement.
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
            copy="Zmeňte vstupy. Cena sa prepočíta okamžite a údaje zostanú uložené aj po obnovení stránky."
          />
          <div className="sales-benefit-grid">
            <div>
              <Gauge />
              <strong>Lead scoring</strong>
              <span>Priorita podľa hodnoty.</span>
            </div>
            <div>
              <FileText />
              <strong>PDF ponuka</strong>
              <span>Voliteľné generovanie.</span>
            </div>
            <div>
              <Plug />
              <strong>CRM / e-mail</strong>
              <span>Dáta pre vaše systémy.</span>
            </div>
          </div>
        </div>

        <motion.div
          className="sales-sandbox"
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
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
            Mám záujem o kalkulačku <ArrowRight size={17} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function WebsiteTypes() {
  return (
    <section className="sales-websites sales-websites-compact" id="typy-webov">
      <div className="container-page">
        <SectionHeading
          eyebrow="Kde to funguje"
          title={
            <>
              Tri časté scenáre. <em>Jasný ďalší krok.</em>
            </>
          }
        />
        <div className="sales-website-grid sales-website-grid-three">
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
                {/* Replace this source with a final homepage screenshot. */}
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
                <button onClick={() => openSiteAssistant({ source: `website-${item.tag}` })}>
                  {item.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="sales-project-strip">
          <span>Živé ukážky</span>
          {[
            ["DERAT", "https://derat-chatbot-backend.vercel.app/"],
            ["APLAN AI", "https://danielvendzur-code.github.io/aplan-chatbot-backend/"],
            ["koverta.sk", "https://koverta.sk/"],
            ["webko.sk", "https://webko.sk/"],
            ["mojplot.sk", "https://mojplot.sk/"],
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

function ProcessPricing() {
  return (
    <section className="sales-close" id="spolupraca">
      <div className="container-page">
        <SectionHeading
          inverse
          eyebrow="Od prvých otázok po nasadenie"
          title={
            <>
              Jasný proces. <em>Cena podľa rozsahu.</em>
            </>
          }
          copy="Bez fixných balíkov a bez technického bludiska. Najprv určím, čo má nástroj vyriešiť, potom dostanete jasný rozsah aj cenu."
        />
        <div className="sales-close-grid">
          <ol className="sales-close-steps">
            {processSteps.map(({ number, icon: Icon, title, copy }, index) => (
              <motion.li
                key={number}
                initial={{ opacity: 0, x: -26 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.42, delay: index * 0.08 }}
              >
                <span>{number}</span>
                <div>
                  <Icon />
                </div>
                <section>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </section>
              </motion.li>
            ))}
          </ol>

          <motion.div
            className="sales-pricing-card"
            initial={{ opacity: 0, x: 34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sales-pricing-card-label">
              <Sparkles size={16} /> Férové nacenenie
            </div>
            <h3>Cena sa odvíja od rozsahu projektu, nie od balíka.</h3>
            <div className="sales-pricing-points">
              <span>
                <Check /> Konkrétny rozsah pred začiatkom
              </span>
              <span>
                <Check /> Možnosť spustiť menšiu prvú verziu
              </span>
              <span>
                <Check /> Napojenia podľa reálnej potreby
              </span>
            </div>
            <div className="sales-pricing-card-footer">
              <span>Prvá konzultácia</span>
              <strong>nezáväzne</strong>
            </div>
            <PrimaryButton source="scope-pricing">Zistiť rozsah projektu</PrimaryButton>
          </motion.div>
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
          <span /> Môžeme začať jednou službou
        </p>
        <h2>Ukážte mi, čo dnes zákazníkom vysvetľujete ručne.</h2>
        <p>Navrhnem jednoduchší spôsob, ako z návštevníka spraviť pripravený dopyt.</p>
        <div className="sales-final-actions">
          <PrimaryButton source="final-interest">Mám záujem</PrimaryButton>
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
      <ImpactSwitch />
      <ToolShowcase />
      <DeratScrollStory />
      <CalculatorSandbox />
      <WebsiteTypes />
      <ProcessPricing />
      <FinalContact />
    </>
  );
}
