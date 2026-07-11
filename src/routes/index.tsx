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
   HERO with interactive product preview
============================================================ */

type HeroPath = "cena" | "riesenie" | "dopyt" | "termin";

const heroPaths: { id: HeroPath; label: string; next: string }[] = [
  { id: "cena", label: "Vypočítať cenu", next: "Od čoho sa cena odvíja?" },
  { id: "riesenie", label: "Vybrať riešenie", next: "Podľa čoho vyberáme?" },
  { id: "dopyt", label: "Poslať presný dopyt", next: "Aké údaje sú dôležité?" },
  { id: "termin", label: "Rezervovať termín", next: "Kedy vám vyhovuje?" },
];

const heroSecondStep: Record<HeroPath, string[]> = {
  cena: ["Rozmery", "Materiál", "Doprava", "Montáž", "Viac možností"],
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
      <div className="container-page pt-10 pb-14 md:pt-20 md:pb-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14 items-start">
          <div className="md:col-span-6">
            <div className="eyebrow mb-4">Chatboty, kalkulačky a interaktívne nástroje</div>
            <h1
              className="font-semibold"
              style={{
                fontSize: "clamp(2.25rem, 8vw, 4rem)",
                lineHeight: 1.05,
              }}
            >
              Návštevník si vyberie.
              <br />
              <span style={{ color: "var(--primary)" }}>Vy dostanete presný dopyt.</span>
            </h1>
            <p
              className="mt-6 max-w-xl"
              style={{ color: "var(--text-secondary)", fontSize: "clamp(1rem, 2.4vw, 1.15rem)", lineHeight: 1.55 }}
            >
              Tvorím chatboty, kalkulačky a krokové konfigurátory, ktoré zákazníka prevedú
              výberom a firme odošlú všetky potrebné údaje.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#ukazky"
                className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
                style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Pozrieť ukážky
              </a>
              <a
                href="#spolupraca"
                className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
                style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
              >
                Ako to funguje
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
        style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--background-soft)" }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Interaktívna ukážka
          </span>
        </div>
        <StepDots step={step} />
      </div>

      <div className="p-5 md:p-6" style={{ minHeight: 320 }}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Krok 1 z 3
              </p>
              <h3 className="text-xl font-semibold mb-5">Čo zákazník potrebuje?</h3>
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Krok 2 z 3
              </p>
              <h3 className="text-xl font-semibold mb-5">
                {heroPaths.find((p) => p.id === path)!.next}
              </h3>
              <div className="flex flex-wrap gap-2">
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Krok 3 z 3
              </p>
              <div className="eyebrow mb-2">Výsledok</div>
              <h3 className="text-xl font-semibold mb-4">
                Prehľadný dopyt s vybranými údajmi
              </h3>
              <div
                className="rounded-lg p-4 text-sm space-y-2"
                style={{ backgroundColor: "var(--background-soft)", border: "1px solid var(--border)" }}
              >
                <SummaryRow label="Zámer" value={heroPaths.find((p) => p.id === path)!.label} />
                <SummaryRow label="Detail" value={choice} />
                <SummaryRow label="Ďalší krok" value="Odoslať firme" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="flex items-center justify-between px-4 py-2.5 text-xs"
        style={{ borderTop: "1px solid var(--border)", color: "var(--text-secondary)" }}
      >
        <button
          onClick={onBack}
          disabled={step === 0}
          className="disabled:opacity-40"
          style={{ color: "var(--text-primary)" }}
        >
          ← Späť
        </button>
        <button onClick={onReset} disabled={step === 0} className="disabled:opacity-40">
          Reset
        </button>
      </div>
    </div>
  );
}

function StepDots({ step }: { step: 0 | 1 | 2 }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-4 rounded-full transition-colors"
          style={{
            backgroundColor: i <= step ? "var(--primary)" : "var(--border-strong)",
          }}
        />
      ))}
    </div>
  );
}

function Chip({ children, onClick, active }: { children: React.ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="rounded-full px-3.5 py-2 text-sm text-left transition-colors"
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span className="font-medium text-right" style={{ color: "var(--text-primary)" }}>
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
    name: "Chatbot a dopytový asistent",
    desc:
      "Zákazníka prevedie otázkami, vysvetlí možnosti a pripraví údaje potrebné na ďalší kontakt.",
  },
  {
    key: "kalkulacka" as const,
    name: "Pokročilá cenová kalkulačka",
    desc:
      "Vypočíta cenu alebo cenový rozsah podľa rozmerov, materiálu, dopravy, montáže a ďalších pravidiel firmy.",
  },
  {
    key: "konfigurator" as const,
    name: "Krokový konfigurátor",
    desc: "Pomôže zákazníkovi vybrať produkt alebo službu z reálne dostupných možností.",
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
      <div className="container-page py-16 md:py-24">
        <div className="mb-10 md:mb-12 max-w-3xl">
          <div className="eyebrow mb-3">Čo tvorím</div>
          <h2 className="font-semibold" style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.6rem)" }}>
            Tri nástroje. Každý rieši inú časť dopytu.
          </h2>
          <p className="mt-4 text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Každý nástroj sa skladá podľa služieb, cien a procesu konkrétnej firmy.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:gap-10 items-start">
          <ul className="md:col-span-6 flex flex-col" style={{ borderTop: "1px solid var(--border)" }}>
            {productTypes.map((t, i) => {
              const isActive = active === t.key;
              return (
                <li key={t.key} style={{ borderBottom: "1px solid var(--border)" }}>
                  <button
                    onClick={() => setActive(t.key)}
                    onMouseEnter={() => setActive(t.key)}
                    onFocus={() => setActive(t.key)}
                    className="w-full text-left py-5 md:py-6 grid grid-cols-[auto_1fr] gap-4 items-baseline transition-colors"
                    aria-pressed={isActive}
                  >
                    <span
                      className="text-sm tabular-nums"
                      style={{ color: isActive ? "var(--primary)" : "var(--text-light)" }}
                    >
                      0{i + 1}
                    </span>
                    <div className="min-w-0">
                      <div
                        className="text-lg md:text-xl font-semibold transition-colors"
                        style={{ color: isActive ? "var(--primary)" : "var(--text-primary)" }}
                      >
                        {t.name}
                      </div>
                      <p className="mt-1.5 text-sm md:text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                        {t.desc}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="md:col-span-6">
            <div
              className="rounded-2xl p-4 md:p-5"
              style={{
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <AnimatePresence mode="wait">
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
   CHATBOT capabilities section
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
        "podľa zvoleného riešenia umožní históriu dopytov",
      ],
    },
    {
      title: "Po napojení na ďalšie systémy",
      items: [
        "Calendly alebo iný kalendár",
        "dostupnosť produktu",
        "stav objednávky",
        "požiadavka na zmenu alebo zrušenie objednávky",
        "interný systém alebo CRM",
      ],
    },
  ];

  return (
    <section>
      <div className="container-page py-16 md:py-24">
        <div className="mb-10 md:mb-14 max-w-3xl">
          <div className="eyebrow mb-3">Chatbot a dopytový asistent</div>
          <h2 className="font-semibold" style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.6rem)" }}>
            Neodpovedá len na otázky. Pripraví ďalší krok.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {areas.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl p-6 md:p-7"
              style={{
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="eyebrow mb-4">{a.title}</div>
              <ul className="space-y-2.5 text-[15px]" style={{ color: "var(--text-primary)" }}>
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
            </div>
          ))}
        </div>

        <p
          className="mt-8 max-w-2xl text-sm"
          style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
        >
          Funkcie spojené s objednávkami, dostupnosťou alebo interným systémom vyžadujú samostatné napojenie.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   CALCULATOR section
============================================================ */

function CalculatorSection() {
  const parts = ["Základná služba", "rozmery", "materiál", "doprava", "montáž", "doplnky", "cenové podmienky"];
  const rules = [
    "Ak je zákazka pod minimálnym rozsahom, použije sa minimálna cena.",
    "Pri väčšej vzdialenosti sa dopočíta doprava.",
    "Montáž a demontáž sa započítajú samostatne.",
    "Neštandardný výber sa odošle na individuálne potvrdenie.",
  ];

  return (
    <section style={{ backgroundColor: "var(--background-soft)" }}>
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14 items-start">
          <div className="md:col-span-5">
            <div className="eyebrow mb-3">Pokročilá kalkulačka</div>
            <h2 className="font-semibold" style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.6rem)" }}>
              Nie je to len počet metrov krát jedna sadzba.
            </h2>
            <p className="mt-5 text-base md:text-lg" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
              Výpočet sa nastaví podľa pravidiel, ktoré firma reálne používa pri príprave ponúk.
            </p>
          </div>

          <div className="md:col-span-7">
            <div
              className="rounded-2xl p-5 md:p-6"
              style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
            >
              <div className="flex flex-wrap items-center gap-2">
                {parts.map((p, i) => (
                  <div key={p} className="flex items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1.5 text-xs md:text-sm"
                      style={{
                        backgroundColor: i === 0 ? "var(--primary-soft)" : "var(--background-soft)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {p}
                    </span>
                    {i < parts.length - 1 && (
                      <span style={{ color: "var(--text-light)" }}>+</span>
                    )}
                  </div>
                ))}
                <span className="mx-1" style={{ color: "var(--text-light)" }}>=</span>
                <span
                  className="rounded-full px-3.5 py-1.5 text-xs md:text-sm font-medium"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  cena alebo cenový rozsah
                </span>
              </div>

              <ul className="mt-6 space-y-2 text-sm" style={{ color: "var(--text-primary)" }}>
                {rules.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <span
                      className="mt-2 h-1 w-1 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                    <span style={{ lineHeight: 1.55 }}>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-sm max-w-2xl" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Ak sú známe všetky vstupy a cenové pravidlá, kalkulačka môže vypočítať presnú cenu
              podľa cenníka. Ak je potrebná obhliadka alebo individuálne posúdenie, zobrazí
              orientačný rozsah a odošle podklady firme.
            </p>
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
    ["Materiál", "Vybraný variant"],
    ["Montáž", "Áno"],
    ["Lokalita", "Nitra"],
    ["Preferovaný termín", "Do jedného mesiaca"],
    ["Kontakt", "Vyplnený"],
  ];

  return (
    <section>
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14 items-start">
          <div className="md:col-span-5">
            <div className="eyebrow mb-3">Čo príde firme</div>
            <h2 className="font-semibold" style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.6rem)" }}>
              Dopyt, ktorý netreba znova celý zisťovať.
            </h2>
            <p className="mt-5 text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Podľa riešenia môže dopyt obsahovať aj fotografie, poznámku, históriu rozhovoru alebo rezervovaný termín.
            </p>
          </div>

          <div className="md:col-span-7">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface-raised)", boxShadow: "var(--shadow-soft)" }}
            >
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ backgroundColor: "var(--background-soft)", borderBottom: "1px solid var(--border)" }}
              >
                <div className="text-sm font-semibold">Dopyt #00124</div>
                <span
                  className="text-xs rounded-full px-2.5 py-1"
                  style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  Nový
                </span>
              </div>
              <dl className="divide-y" style={{ borderColor: "var(--border)" }}>
                {rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2 gap-3 px-5 py-3 text-sm" style={{ borderColor: "var(--border)" }}>
                    <dt style={{ color: "var(--text-secondary)" }}>{k}</dt>
                    <dd className="text-right font-medium" style={{ color: "var(--text-primary)" }}>{v}</dd>
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
   PORTFOLIO — 6 neutral examples
============================================================ */

function PortfolioSection() {
  const [demoSlug, setDemoSlug] = useState<string | null>(null);
  const active = projects.find((p) => p.slug === demoSlug) ?? null;

  return (
    <section id="ukazky" style={{ backgroundColor: "var(--background-soft)" }}>
      <div className="container-page py-16 md:py-24">
        <div className="mb-10 md:mb-12 max-w-3xl">
          <div className="eyebrow mb-3">Ukážky</div>
          <h2 className="font-semibold" style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.6rem)" }}>
            Vyskúšajte, ako môžu jednotlivé riešenia fungovať.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article
              key={p.slug}
              className="group rounded-2xl overflow-hidden flex flex-col"
              style={{
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="p-4"
                style={{
                  background: `linear-gradient(135deg, ${p.accent}18 0%, ${p.accent}05 100%)`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {p.label}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-light)" }}>
                    {p.category}
                  </span>
                </div>
                <div
                  className="rounded-lg overflow-hidden"
                  style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
                >
                  <MiniByType type={p.previewType} accent={p.accent} />
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p
                  className="mt-1.5 text-sm flex-1"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
                >
                  {p.shortDescription}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setDemoSlug(p.slug)}
                    className="text-sm font-medium"
                    style={{ color: "var(--primary)" }}
                  >
                    Vyskúšať ukážku
                  </button>
                  <Link
                    to="/projekty/$slug"
                    params={{ slug: p.slug }}
                    className="text-sm inline-flex items-center gap-1 transition-transform group-hover:translate-x-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Ako funguje →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <DemoViewer
        open={!!active}
        onClose={() => setDemoSlug(null)}
        title={active?.title ?? ""}
        category={(active?.category ?? "Presné zadanie") as never}
        accent={active?.accent ?? "#175e50"}
        presentation={active?.demoPresentation ?? "compact"}
        demoUrl={active?.demoUrl ?? null}
      />
    </section>
  );
}

function MiniByType({ type, accent }: { type: "assistant" | "calculator" | "configurator"; accent: string }) {
  if (type === "assistant") return <AssistantMini compact accent={accent} />;
  if (type === "calculator") return <CalculatorMini compact accent={accent} />;
  return <ConfiguratorMini compact accent={accent} />;
}

/* ============================================================
   PROCESS
============================================================ */

const steps = [
  { n: "01", h: "Pozriem si web a služby.", p: "Zistím, čo zákazníci potrebujú vedieť a ktoré údaje firma zisťuje ručne." },
  { n: "02", h: "Navrhnem otázky a výpočet.", p: "Určíme kroky, možnosti, cenové pravidlá a výsledok pre zákazníka." },
  { n: "03", h: "Pripravím dizajn.", p: "Rozhranie sa prispôsobí farbám a štýlu existujúceho webu." },
  { n: "04", h: "Vytvorím a otestujem riešenie.", p: "Skontroluje sa logika, výpočty, počítač aj mobil." },
  { n: "05", h: "Prepojím dopyty a služby.", p: "Dopyty môžu chodiť na e-mail. Podľa potreby sa pripojí kalendár alebo ďalší systém." },
  { n: "06", h: "Widget sa vloží na web.", p: "Vo väčšine prípadov nie je potrebné prerábať celý web." },
];

function ProcessSection() {
  return (
    <section id="spolupraca">
      <div className="container-page py-16 md:py-24">
        <div className="mb-10 md:mb-12 max-w-3xl">
          <div className="eyebrow mb-3">Spolupráca</div>
          <h2 className="font-semibold" style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.6rem)" }}>
            Od prvých otázok po nástroj na vašom webe.
          </h2>
        </div>

        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl p-5 md:p-6"
              style={{
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="text-2xl md:text-3xl font-semibold tabular-nums mb-3"
                style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}
              >
                {s.n}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ lineHeight: 1.25 }}>
                {s.h}
              </h3>
              <p className="text-[17px]" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {s.p}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ============================================================
   PRICING
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
      price: "Cena podľa rozsahu",
      note: "Cena závisí od počtu možností, výpočtov a cenových pravidiel.",
    },
    {
      name: "Prevádzka a úpravy",
      price: "od 20 € mesačne",
      note: "Hosting, technická prevádzka a dohodnuté úpravy.",
    },
  ];
  return (
    <section id="cena" style={{ backgroundColor: "var(--background-soft)" }}>
      <div className="container-page py-16 md:py-24">
        <div className="mb-10 md:mb-12 max-w-3xl">
          <div className="eyebrow mb-3">Cena</div>
          <h2 className="font-semibold" style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.6rem)" }}>
            Cena sa odvíja od rozsahu, nie od balíka.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((i) => (
            <div
              key={i.name}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="eyebrow">{i.name}</div>
              <div className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--primary)" }}>
                {i.price}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {i.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA
============================================================ */

function FinalCta() {
  return (
    <section>
      <div className="container-page py-16 md:py-24">
        <div
          className="rounded-2xl p-8 md:p-14"
          style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          <div className="grid gap-8 md:grid-cols-12 items-end">
            <div className="md:col-span-8">
              <h2
                className="font-semibold"
                style={{
                  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                  color: "var(--primary-foreground)",
                  lineHeight: 1.15,
                }}
              >
                Máte službu alebo produkt, pri ktorom zákazníci riešia cenu alebo výber?
              </h2>
              <p
                className="mt-4 max-w-xl"
                style={{
                  color: "color-mix(in oklab, var(--primary-foreground) 82%, transparent)",
                  fontSize: "clamp(1rem, 2.4vw, 1.1rem)",
                }}
              >
                Pozriem sa na váš web a navrhnem, ktoré otázky, možnosti alebo výpočet by na ňom
                dávali zmysel.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-wrap gap-3 md:justify-end">
              <button
                onClick={() => openSiteAssistant({ source: "home-cta" })}
                className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
              >
                Nájsť vhodné riešenie
              </button>
              <a
                href="#ukazky"
                className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
                style={{ border: "1px solid color-mix(in oklab, var(--primary-foreground) 30%, transparent)", color: "var(--primary-foreground)" }}
              >
                Pozrieť ukážky
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
