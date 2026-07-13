import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SiteLayout } from "@/components/site/Layout";
import { projects } from "@/data/projects";
import { openSiteAssistant } from "@/lib/site-assistant";
import { DemoViewer } from "@/components/DemoViewer";
import {
  AssistantMini,
  CalculatorMini,
  ConfiguratorMini,
} from "@/components/site/MiniPreviews";
import {
  Button,
  Chip,
  Segmented,
  Slider,
  Stepper,
  Swatches,
  Toggle,
  SummaryRow,
  StepProgress,
} from "@/components/ui/Controls";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chatboty, kalkulačky a interaktívne nástroje pre firmy" },
      {
        name: "description",
        content:
          "Tvorím chatboty, kalkulačky a krokové konfigurátory, ktoré zákazníka prevedú výberom a firme odošlú presný dopyt.",
      },
      { property: "og:title", content: "Chatboty, kalkulačky a interaktívne nástroje" },
      {
        property: "og:description",
        content: "Návštevník si vyberie. Vy dostanete presný dopyt.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <ProductTypesSection />
      <ChatbotSection />
      <CalculatorSection />
      <OwnerOutputSection />
      <PortfolioSection />
      <ProcessSection />
      <PricingSection />
      <FinalCta />
    </SiteLayout>
  );
}

/* ============================================================
   Shared buttons — single source of truth
============================================================ */

const btnBase =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-150 active:translate-y-px";

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`${btnBase} px-4 py-2.5`}
      style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
    >
      {children}
    </a>
  );
}

/* ============================================================
   HERO
============================================================ */

type HeroPath = "cena" | "riesenie" | "dopyt" | "termin";

const heroPaths: { id: HeroPath; label: string; next: string }[] = [
  { id: "cena", label: "Vypočítať cenu", next: "Od čoho sa cena odvíja?" },
  { id: "riesenie", label: "Vybrať riešenie", next: "Podľa čoho vyberáme?" },
  { id: "dopyt", label: "Poslať presný dopyt", next: "Aké údaje sú dôležité?" },
  { id: "termin", label: "Rezervovať termín", next: "Kedy vám vyhovuje?" },
];

const heroSecondStep: Record<HeroPath, string[]> = {
  cena: ["Rozmery", "Materiál", "Doprava", "Montáž"],
  riesenie: ["Použitie", "Rozpočet", "Priestor", "Preferencia"],
  dopyt: ["Kontakt", "Lokalita", "Termín", "Poznámka"],
  termin: ["Ráno", "Poobede", "Víkend", "Ktorýkoľvek"],
};

function Hero() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [path, setPath] = useState<HeroPath | null>(null);
  const [choice, setChoice] = useState<string | null>(null);

  const reset = () => {
    setStep(0);
    setPath(null);
    setChoice(null);
  };
  const back = () => {
    if (step === 2) setStep(1);
    else if (step === 1) {
      setStep(0);
      setPath(null);
    }
  };

  return (
    <section>
      <div className="container-page pt-6 pb-10 md:pt-14 md:pb-20">
        <div className="grid gap-6 md:gap-12 md:grid-cols-12 items-start">
          <div className="md:col-span-6 md:pt-6">
            <div className="eyebrow mb-3">Chatboty · kalkulačky · konfigurátory</div>
            <h1
              className="font-semibold tracking-tight"
              style={{
                fontSize: "clamp(2.1rem, 8vw, 3.9rem)",
                lineHeight: 1.03,
              }}
            >
              Návštevník si vyberie.{" "}
              <span style={{ color: "var(--primary)" }}>
                Vy dostanete presný&nbsp;dopyt.
              </span>
            </h1>
            <p
              className="mt-5 max-w-lg"
              style={{
                color: "var(--text-secondary)",
                fontSize: "clamp(0.98rem, 2.2vw, 1.1rem)",
                lineHeight: 1.55,
              }}
            >
              Interaktívne nástroje, ktoré zákazníka prevedú výberom a firme
              pripravia všetky potrebné údaje.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PrimaryLink href="#ukazky">Pozrieť ukážky</PrimaryLink>
              <a
                href="#spolupraca"
                className="inline-flex items-center gap-1.5 text-sm font-medium py-2.5 group"
                style={{ color: "var(--text-primary)" }}
              >
                Ako to funguje
                <span
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </a>
            </div>
          </div>

          <div className="md:col-span-6">
            <HeroPreview
              step={step}
              path={path}
              choice={choice}
              onPick={(p) => {
                setPath(p);
                setStep(1);
              }}
              onChoice={(c) => {
                setChoice(c);
                setStep(2);
              }}
              onBack={back}
              onReset={reset}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPreview({
  step,
  path,
  choice,
  onPick,
  onChoice,
  onBack,
  onReset,
}: {
  step: 0 | 1 | 2;
  path: HeroPath | null;
  choice: string | null;
  onPick: (p: HeroPath) => void;
  onChoice: (c: string) => void;
  onBack: () => void;
  onReset: () => void;
}) {
  const pathLabel = path ? heroPaths.find((p) => p.id === path)!.label : null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "var(--surface-raised)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--background-soft)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <span className="text-[11px] tracking-wide uppercase" style={{ color: "var(--text-secondary)" }}>
            Interaktívna ukážka
          </span>
        </div>
        <StepDots step={step} />
      </div>

      <div className="px-5 py-5 md:px-6 md:py-6">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Krok 1 z 3
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                Čo zákazník potrebuje?
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {heroPaths.map((p) => (
                  <Chip key={p.id} onClick={() => onPick(p.id)}>
                    {p.label}
                  </Chip>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && path && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Krok 2 z 3
                </span>
                <span className="text-xs" style={{ color: "var(--primary)" }}>
                  {pathLabel}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                {heroPaths.find((p) => p.id === path)!.next}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {heroSecondStep[path].map((c) => (
                  <Chip key={c} onClick={() => onChoice(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && path && choice && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Hotovo
                </span>
                <span className="text-xs" style={{ color: "var(--primary)" }}>
                  Dopyt pripravený
                </span>
              </div>
              <div
                className="rounded-lg divide-y"
                style={{
                  backgroundColor: "var(--background-soft)",
                  border: "1px solid var(--border)",
                  borderColor: "var(--border)",
                }}
              >
                <SummaryRow label="Zámer" value={pathLabel!} />
                <SummaryRow label="Detail" value={choice} />
                <SummaryRow label="Kontakt" value="Vyplnený" />
                <SummaryRow label="Ďalší krok" value="Odoslať firme" accent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="flex items-center justify-between px-4 py-2 text-xs"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={onBack}
          disabled={step === 0}
          className="inline-flex items-center gap-1 py-1.5 disabled:opacity-30 transition-opacity"
          style={{ color: "var(--text-primary)" }}
        >
          <span aria-hidden>←</span> Späť
        </button>
        <button
          onClick={onReset}
          disabled={step === 0}
          className="py-1.5 disabled:opacity-30 transition-opacity"
          style={{ color: "var(--text-secondary)" }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function StepDots({ step }: { step: 0 | 1 | 2 }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 rounded-full transition-all"
          style={{
            width: i === step ? 18 : 8,
            backgroundColor: i <= step ? "var(--primary)" : "var(--border-strong)",
          }}
        />
      ))}
    </div>
  );
}

function Chip({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="rounded-full px-3.5 py-2.5 text-sm text-left transition-colors"
      style={{
        border: `1px solid ${active ? "var(--primary)" : "var(--border-strong)"}`,
        backgroundColor: active ? "var(--primary-soft)" : "transparent",
        color: "var(--text-primary)",
      }}
    >
      {children}
    </motion.button>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <span
        className="text-sm font-medium text-right"
        style={{ color: accent ? "var(--primary)" : "var(--text-primary)" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   PRODUCT TYPES — three interactive rows
============================================================ */

const productTypes = [
  {
    key: "chatbot" as const,
    name: "Dopytový asistent",
    desc:
      "Prevedie zákazníka otázkami, vysvetlí možnosti a pripraví údaje na kontakt.",
  },
  {
    key: "kalkulacka" as const,
    name: "Pokročilá kalkulačka",
    desc:
      "Vypočíta cenu alebo rozsah podľa rozmerov, materiálu, dopravy a ďalších pravidiel firmy.",
  },
  {
    key: "konfigurator" as const,
    name: "Krokový konfigurátor",
    desc: "Zúži výber produktu alebo služby na to, čo je reálne dostupné.",
  },
];

function ProductTypesSection() {
  const [active, setActive] = useState<(typeof productTypes)[number]["key"]>("chatbot");

  const preview = useMemo(() => {
    if (active === "chatbot") return <AssistantMini />;
    if (active === "kalkulacka") return <CalculatorMini />;
    return <ConfiguratorMini />;
  }, [active]);

  return (
    <section id="co-tvorim" style={{ backgroundColor: "var(--background-soft)" }}>
      <div className="container-page py-14 md:py-24">
        <div className="mb-8 md:mb-12 max-w-2xl">
          <div className="eyebrow mb-2">Čo tvorím</div>
          <h2
            className="font-semibold tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.5rem)" }}
          >
            Tri nástroje. Každý rieši inú časť dopytu.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:gap-12 items-start">
          <ul
            className="md:col-span-6 flex flex-col"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {productTypes.map((t, i) => {
              const isActive = active === t.key;
              return (
                <li key={t.key} style={{ borderBottom: "1px solid var(--border)" }}>
                  <button
                    onClick={() => setActive(t.key)}
                    onMouseEnter={() => setActive(t.key)}
                    onFocus={() => setActive(t.key)}
                    className="w-full text-left py-5 grid grid-cols-[auto_1fr] gap-4 items-baseline group"
                    aria-pressed={isActive}
                  >
                    <span
                      className="text-xs tabular-nums transition-colors"
                      style={{ color: isActive ? "var(--primary)" : "var(--text-light)" }}
                    >
                      0{i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-lg md:text-xl font-semibold transition-colors"
                          style={{
                            color: isActive ? "var(--primary)" : "var(--text-primary)",
                          }}
                        >
                          {t.name}
                        </span>
                        <span
                          className="ml-auto text-xs transition-opacity"
                          style={{
                            color: "var(--primary)",
                            opacity: isActive ? 1 : 0,
                          }}
                        >
                          ●
                        </span>
                      </div>
                      <p
                        className="mt-1.5 text-sm md:text-[15px]"
                        style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
                      >
                        {t.desc}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
            <li className="pt-5">
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
              >
                Každý nástroj sa skladá podľa služieb, cien a procesu konkrétnej firmy.
              </p>
            </li>
          </ul>

          <div className="md:col-span-6 md:sticky md:top-24">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {preview}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CHATBOT — editorial columns, not three white boxes
============================================================ */

function ChatbotSection() {
  const areas = [
    {
      title: "Pre návštevníka",
      items: [
        "pomôže vybrať vhodný produkt alebo službu",
        "vysvetlí rozdiel medzi možnosťami",
        "odpovie na otázky o produkte, doprave alebo dodaní",
        "zistí rozmery, lokalitu, termín a ďalšie údaje",
        "otvorí rezerváciu konzultácie alebo obhliadky",
      ],
    },
    {
      title: "Pre firmu",
      items: [
        "odošle prehľadný dopyt na e-mail",
        "pridelí vlastné číslo dopytu",
        "pripojí všetky odpovede a kontakt",
        "zachová kontext celej konverzácie",
        "podľa riešenia umožní históriu dopytov",
      ],
    },
    {
      title: "Po napojení systémov",
      items: [
        "Calendly alebo iný kalendár",
        "dostupnosť produktu",
        "stav objednávky",
        "požiadavka na zmenu alebo zrušenie",
        "interný systém alebo CRM",
      ],
    },
  ];

  return (
    <section>
      <div className="container-page py-14 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-4">
            <div className="eyebrow mb-2">Dopytový asistent</div>
            <h2
              className="font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.5rem)" }}
            >
              Neodpovedá len na otázky.<br />Pripraví ďalší krok.
            </h2>
            <p
              className="mt-5 max-w-sm text-sm"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              Funkcie spojené s objednávkami, dostupnosťou alebo interným
              systémom vyžadujú samostatné napojenie.
            </p>
          </div>

          <div className="md:col-span-8">
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((a) => (
                <div key={a.title}>
                  <dt
                    className="pb-3 mb-4 text-sm font-semibold"
                    style={{
                      borderBottom: "1px solid var(--border-strong)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {a.title}
                  </dt>
                  <dd>
                    <ul
                      className="space-y-2 text-[14.5px]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {a.items.map((it) => (
                        <li key={it} className="flex gap-2.5">
                          <span
                            className="mt-2 h-1 w-1 rounded-full shrink-0"
                            style={{ backgroundColor: "var(--primary)" }}
                          />
                          <span style={{ lineHeight: 1.5 }}>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CALCULATOR
============================================================ */

function CalculatorSection() {
  const parts = [
    "Základ",
    "rozmery",
    "materiál",
    "doprava",
    "montáž",
    "doplnky",
    "cenové podmienky",
  ];
  const rules = [
    ["Minimálna cena", "ak je zákazka pod minimálnym rozsahom"],
    ["Doprava", "dopočítaná podľa vzdialenosti"],
    ["Montáž a demontáž", "samostatné položky"],
    ["Neštandardný výber", "individuálne potvrdenie firmou"],
  ];

  return (
    <section style={{ backgroundColor: "var(--primary-dark)", color: "#f3efe6" }}>
      <div className="container-page py-16 md:py-28">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14 items-start">
          <div className="md:col-span-5">
            <div
              className="eyebrow mb-3"
              style={{ color: "color-mix(in oklab, #f3efe6 65%, transparent)" }}
            >
              Pokročilá kalkulačka
            </div>
            <h2
              className="font-semibold tracking-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#f3efe6",
                lineHeight: 1.05,
              }}
            >
              Nie je to metre krát jedna&nbsp;sadzba.
            </h2>
            <p
              className="mt-6 max-w-md text-base md:text-[17px]"
              style={{
                color: "color-mix(in oklab, #f3efe6 78%, transparent)",
                lineHeight: 1.55,
              }}
            >
              Výpočet sa nastaví podľa pravidiel, ktoré firma reálne používa pri
              príprave ponúk. Nie generický template.
            </p>
          </div>

          <div className="md:col-span-7">
            <div
              className="rounded-[20px] p-6 md:p-8"
              style={{
                backgroundColor: "color-mix(in oklab, #f3efe6 6%, transparent)",
                border: "1px solid color-mix(in oklab, #f3efe6 18%, transparent)",
              }}
            >
              <div
                className="text-[11px] uppercase tracking-[0.14em] mb-4"
                style={{ color: "color-mix(in oklab, #f3efe6 55%, transparent)" }}
              >
                Príklad výpočtu
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {parts.map((p, i) => (
                  <div key={p} className="flex items-center gap-1.5">
                    <span
                      className="rounded-[10px] px-3 py-1.5 text-[13px]"
                      style={{
                        backgroundColor:
                          i === 0
                            ? "color-mix(in oklab, #f3efe6 15%, transparent)"
                            : "color-mix(in oklab, #f3efe6 6%, transparent)",
                        color: "#f3efe6",
                        border:
                          "1px solid color-mix(in oklab, #f3efe6 15%, transparent)",
                      }}
                    >
                      {p}
                    </span>
                    {i < parts.length - 1 && (
                      <span
                        className="text-xs"
                        style={{
                          color:
                            "color-mix(in oklab, var(--highlight) 90%, transparent)",
                        }}
                      >
                        +
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="mt-6 pt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2"
                style={{
                  borderTop:
                    "1px dashed color-mix(in oklab, var(--highlight) 60%, transparent)",
                }}
              >
                <span
                  className="text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: "color-mix(in oklab, #f3efe6 60%, transparent)" }}
                >
                  Výsledok
                </span>
                <span
                  className="font-semibold tabular-nums"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                    color: "#f3efe6",
                    letterSpacing: "-0.02em",
                  }}
                >
                  1 240 – 1 480 €
                </span>
                <span
                  className="text-xs"
                  style={{ color: "color-mix(in oklab, #f3efe6 55%, transparent)" }}
                >
                  · orientačný rozsah
                </span>
              </div>
            </div>

            <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {rules.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[auto_1fr] gap-3 items-baseline pb-3"
                  style={{
                    borderBottom:
                      "1px solid color-mix(in oklab, #f3efe6 12%, transparent)",
                  }}
                >
                  <dt
                    className="text-[13px] font-medium tabular-nums"
                    style={{ color: "var(--highlight)" }}
                  >
                    {k}
                  </dt>
                  <dd
                    className="text-[13.5px]"
                    style={{
                      color: "color-mix(in oklab, #f3efe6 78%, transparent)",
                      lineHeight: 1.5,
                    }}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   OWNER OUTPUT
============================================================ */

function OwnerOutputSection() {
  const rows: [string, string][] = [
    ["Typ služby", "Vybraná možnosť"],
    ["Rozsah", "42 m"],
    ["Materiál", "Variant B"],
    ["Montáž", "Áno"],
    ["Lokalita", "Nitra"],
    ["Preferovaný termín", "Do jedného mesiaca"],
    ["Kontakt", "Vyplnený"],
  ];

  return (
    <section>
      <div className="container-page py-14 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14 items-start">
          <div className="md:col-span-5">
            <div className="eyebrow mb-2">Čo príde firme</div>
            <h2
              className="font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.5rem)" }}
            >
              Dopyt, ktorý netreba znova&nbsp;zisťovať.
            </h2>
            <p
              className="mt-5 max-w-md text-base"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              Podľa riešenia môže dopyt obsahovať fotografie, poznámku, históriu
              rozhovoru alebo rezervovaný termín.
            </p>
          </div>

          <div className="md:col-span-7">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface-raised)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{
                  backgroundColor: "var(--background-soft)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div className="flex items-baseline gap-2.5">
                  <span
                    className="text-[11px] uppercase tracking-wider"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Dopyt
                  </span>
                  <span
                    className="text-sm font-semibold tabular-nums"
                    style={{ color: "var(--text-primary)" }}
                  >
                    #00124
                  </span>
                </div>
                <span
                  className="text-[11px] uppercase tracking-wider rounded-full px-2.5 py-1"
                  style={{
                    backgroundColor: "var(--primary-soft)",
                    color: "var(--primary)",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                  }}
                >
                  Nový
                </span>
              </div>
              <dl>
                {rows.map(([k, v], i) => (
                  <div
                    key={k}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-5 py-3 text-sm"
                    style={{
                      borderTop: i === 0 ? "none" : "1px solid var(--border)",
                    }}
                  >
                    <dt style={{ color: "var(--text-secondary)" }}>{k}</dt>
                    <dd
                      className="text-right font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PORTFOLIO
============================================================ */

function PortfolioSection() {
  const [demoSlug, setDemoSlug] = useState<string | null>(null);
  const active = projects.find((p) => p.slug === demoSlug) ?? null;

  return (
    <section id="ukazky" style={{ backgroundColor: "var(--background-soft)" }}>
      <div className="container-page py-14 md:py-24">
        <div className="mb-8 md:mb-12 grid gap-3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="eyebrow mb-2">Ukážky</div>
            <h2
              className="font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.5rem)" }}
            >
              Vyskúšajte, ako môžu riešenia fungovať.
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              to="/projekty"
              className="text-sm inline-flex items-center gap-1 group"
              style={{ color: "var(--text-primary)" }}
            >
              Všetky ukážky
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-6 auto-rows-fr">
          {projects.map((p, i) => (
            <PortfolioCard
              key={p.slug}
              project={p}
              featured={i === 0}
              medium={i === 1 || i === 2}
              onTry={() => setDemoSlug(p.slug)}
            />
          ))}
        </div>
      </div>

      <DemoViewer
        open={!!active}
        onClose={() => setDemoSlug(null)}
        title={active?.title ?? ""}
        category={active?.category ?? "Presné zadanie"}
        accent={active?.accent ?? "#175e50"}
        presentation={active?.demoPresentation ?? "compact"}
        demoUrl={active?.demoUrl ?? null}
      />
    </section>
  );
}

function PortfolioCard({
  project: p,
  featured,
  medium,
  onTry,
}: {
  project: (typeof projects)[number];
  featured?: boolean;
  medium?: boolean;
  onTry: () => void;
}) {
  const span = featured
    ? "sm:col-span-2 lg:col-span-4"
    : medium
    ? "lg:col-span-3"
    : "lg:col-span-2";
  const radius = featured ? "rounded-[20px]" : "rounded-[14px]";
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group ${radius} overflow-hidden flex flex-col ${span}`}
      style={{
        backgroundColor: "var(--surface-raised)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="p-3"
        style={{
          background: `linear-gradient(160deg, ${p.accent}1c 0%, ${p.accent}05 100%)`,
        }}
      >
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: "var(--surface-raised)",
            border: "1px solid var(--border)",
          }}
        >
          <MiniByType type={p.previewType} accent={p.accent} />
        </div>
      </div>
      <div className="px-5 pt-4 pb-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[11px] uppercase tracking-wider"
            style={{ color: "var(--text-light)" }}
          >
            {p.label}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-[11px]"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: p.accent }}
            />
            {p.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold" style={{ lineHeight: 1.25 }}>
          {p.title}
        </h3>
        <p
          className="mt-2 text-sm flex-1"
          style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
        >
          {p.shortDescription}
        </p>
        <div
          className="mt-4 pt-4 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onTry}
            className="text-sm font-medium inline-flex items-center gap-1"
            style={{ color: "var(--primary)" }}
          >
            Vyskúšať ukážku
          </button>
          <Link
            to="/projekty/$slug"
            params={{ slug: p.slug }}
            className="text-sm inline-flex items-center gap-1 group/link"
            style={{ color: "var(--text-secondary)" }}
          >
            Ako funguje
            <span
              aria-hidden
              className="transition-transform group-hover/link:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function MiniByType({
  type,
  accent,
}: {
  type: "assistant" | "calculator" | "configurator";
  accent: string;
}) {
  if (type === "assistant") return <AssistantMini compact accent={accent} />;
  if (type === "calculator") return <CalculatorMini compact accent={accent} />;
  return <ConfiguratorMini compact accent={accent} />;
}

/* ============================================================
   PROCESS — connected timeline
============================================================ */

const steps = [
  {
    n: "01",
    h: "Pozriem si web a služby.",
    p: "Zistím, čo zákazníci potrebujú vedieť a ktoré údaje firma zisťuje ručne.",
  },
  {
    n: "02",
    h: "Navrhnem otázky a výpočet.",
    p: "Určíme kroky, možnosti, cenové pravidlá a výsledok pre zákazníka.",
  },
  {
    n: "03",
    h: "Pripravím dizajn.",
    p: "Rozhranie sa prispôsobí farbám a štýlu existujúceho webu.",
  },
  {
    n: "04",
    h: "Vytvorím a otestujem riešenie.",
    p: "Skontroluje sa logika, výpočty, počítač aj mobil.",
  },
  {
    n: "05",
    h: "Prepojím dopyty a služby.",
    p: "Dopyty chodia na e-mail. Podľa potreby sa pripojí kalendár alebo iný systém.",
  },
  {
    n: "06",
    h: "Widget sa vloží na web.",
    p: "Vo väčšine prípadov nie je potrebné prerábať celý web.",
  },
];

function ProcessSection() {
  return (
    <section id="spolupraca">
      <div className="container-page py-14 md:py-24">
        <div className="mb-8 md:mb-14 max-w-2xl">
          <div className="eyebrow mb-2">Spolupráca</div>
          <h2
            className="font-semibold tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.5rem)" }}
          >
            Od prvých otázok po nástroj na vašom webe.
          </h2>
        </div>

        <ol className="relative max-w-3xl">
          {/* connecting line */}
          <span
            aria-hidden
            className="absolute left-[11px] top-2 bottom-2 w-px md:left-[15px]"
            style={{ backgroundColor: "var(--border)" }}
          />
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="relative grid grid-cols-[auto_1fr] gap-4 md:gap-6 py-4 md:py-5"
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
              }}
            >
              <span
                className="relative z-10 mt-0.5 grid h-6 w-6 md:h-8 md:w-8 place-items-center rounded-full text-[10px] md:text-xs font-semibold tabular-nums shrink-0"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--primary)",
                }}
              >
                {s.n}
              </span>
              <div className="min-w-0 pt-0.5">
                <h3
                  className="text-base md:text-lg font-semibold"
                  style={{ lineHeight: 1.3 }}
                >
                  {s.h}
                </h3>
                <p
                  className="mt-1 text-sm md:text-[15px]"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
                >
                  {s.p}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ============================================================
   PRICING — editorial rows, not three identical cards
============================================================ */

function PricingSection() {
  const items = [
    {
      name: "Dopytový asistent",
      price: "od 250 €",
      note: "Cena závisí od počtu otázok, krokov a napojení.",
    },
    {
      name: "Pokročilá kalkulačka",
      price: "podľa rozsahu",
      note: "Cena závisí od počtu možností, výpočtov a cenových pravidiel.",
    },
    {
      name: "Prevádzka a úpravy",
      price: "od 20 € / mesiac",
      note: "Hosting, technická prevádzka a dohodnuté úpravy.",
    },
  ];
  return (
    <section id="cena" style={{ backgroundColor: "var(--background-soft)" }}>
      <div className="container-page py-14 md:py-24">
        <div className="mb-8 md:mb-12 grid gap-3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="eyebrow mb-2">Cena</div>
            <h2
              className="font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.5rem)" }}
            >
              Cena sa odvíja od rozsahu, nie od balíka.
            </h2>
          </div>
          <p
            className="md:col-span-4 text-sm"
            style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
          >
            Bez fixných tarifov. Rozsah nastavíme podľa toho, čo firma reálne potrebuje.
          </p>
        </div>

        <ul style={{ borderTop: "1px solid var(--border-strong)" }}>
          {items.map((i) => (
            <li
              key={i.name}
              className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-12 gap-4 md:gap-6 py-6 md:py-7 items-baseline"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="md:col-span-5 min-w-0">
                <h3
                  className="text-lg md:text-xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {i.name}
                </h3>
              </div>
              <div
                className="md:col-span-3 order-first md:order-none text-right md:text-left tabular-nums font-semibold"
                style={{
                  color: "var(--primary)",
                  fontSize: "clamp(1.1rem, 2.6vw, 1.4rem)",
                }}
              >
                {i.price}
              </div>
              <p
                className="col-span-full md:col-span-4 text-sm"
                style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
              >
                {i.note}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA — lighter, editorial
============================================================ */

function FinalCta() {
  return (
    <section style={{ backgroundColor: "var(--primary-dark)", color: "#f3efe6" }}>
      <div className="container-page py-16 md:py-24 relative">
        <span
          aria-hidden
          className="hidden md:block absolute right-6 top-6 h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <div className="grid gap-8 md:grid-cols-12 md:gap-14 items-end">
          <div className="md:col-span-8">
            <div
              className="eyebrow mb-3"
              style={{ color: "color-mix(in oklab, #f3efe6 65%, transparent)" }}
            >
              Ďalší krok
            </div>
            <h2
              className="font-semibold tracking-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#f3efe6",
                lineHeight: 1.05,
                maxWidth: "18ch",
              }}
            >
              Máte službu, pri ktorej zákazníci{" "}
              <span style={{ color: "var(--accent)" }}>riešia cenu</span> alebo výber?
            </h2>
            <p
              className="mt-5 max-w-xl text-base md:text-[17px]"
              style={{
                color: "color-mix(in oklab, #f3efe6 80%, transparent)",
                lineHeight: 1.55,
              }}
            >
              Pozriem sa na váš web a navrhnem, ktoré otázky, možnosti alebo
              výpočet by na ňom dávali zmysel.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col md:items-end gap-3">
            <button
              onClick={() => openSiteAssistant({ source: "home-cta" })}
              className={`${btnBase} px-5 py-3 w-full sm:w-auto group`}
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              Nájsť vhodné riešenie
              <span
                aria-hidden
                className="ml-2 inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </button>
            <a
              href="#ukazky"
              className={`${btnBase} px-5 py-3 w-full sm:w-auto`}
              style={{
                border:
                  "1px solid color-mix(in oklab, #f3efe6 30%, transparent)",
                color: "#f3efe6",
              }}
            >
              Pozrieť ukážky
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

