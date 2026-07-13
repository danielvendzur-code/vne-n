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
   HERO
============================================================ */

type HeroPath = "cena" | "riesenie" | "dopyt" | "termin";

const heroPaths: { id: HeroPath; label: string; step2Title: string }[] = [
  { id: "cena", label: "Vypočítať cenu", step2Title: "Od čoho sa cena odvíja?" },
  { id: "riesenie", label: "Vybrať riešenie", step2Title: "Podľa čoho vyberáme?" },
  { id: "dopyt", label: "Poslať presný dopyt", step2Title: "Čo firma potrebuje vedieť?" },
  { id: "termin", label: "Rezervovať termín", step2Title: "Kedy vám vyhovuje?" },
];

interface HeroState {
  // cena
  rozsah: number;
  material: "A" | "B" | "C";
  montaz: boolean;
  // riesenie
  ucel: "domov" | "firma" | "verejny";
  rozpocet: number;
  farba: string;
  // dopyt
  sluzba: "konzultacia" | "obhliadka" | "ponuka";
  lokalita: "ba" | "nr" | "ke" | "ostatne";
  // termin
  den: "pon" | "str" | "pia";
  cas: "rano" | "poobede" | "vecer";
}

const initialState: HeroState = {
  rozsah: 42,
  material: "B",
  montaz: true,
  ucel: "domov",
  rozpocet: 1200,
  farba: "#246653",
  sluzba: "obhliadka",
  lokalita: "nr",
  den: "str",
  cas: "poobede",
};

function Hero() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [path, setPath] = useState<HeroPath | null>(null);
  const [state, setState] = useState<HeroState>(initialState);
  const update = <K extends keyof HeroState>(k: K, v: HeroState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const reset = () => {
    setStep(0);
    setPath(null);
    setState(initialState);
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
        <div className="grid gap-8 md:gap-12 md:grid-cols-12 items-start">
          <div className="md:col-span-6 md:pt-4">
            <div className="eyebrow mb-3">Chatboty · kalkulačky · konfigurátory</div>
            <h1
              className="font-semibold tracking-tight"
              style={{
                fontSize: "clamp(2.6rem, 8vw, 5.5rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
              }}
            >
              Návštevník si vyberie.{" "}
              <span style={{ color: "var(--primary)" }}>
                Vy dostanete presný&nbsp;dopyt.
              </span>
            </h1>
            <p
              className="mt-6 max-w-lg"
              style={{
                color: "var(--text-secondary)",
                fontSize: "clamp(1.05rem, 2.2vw, 1.2rem)",
                lineHeight: 1.5,
              }}
            >
              Interaktívne nástroje, ktoré zákazníka prevedú výberom a firme
              pripravia všetky potrebné údaje.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                arrow
                onClick={() => {
                  const el = document.getElementById("ukazky");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Pozrieť ukážky
              </Button>
              <Button
                variant="text"
                arrow
                onClick={() => {
                  const el = document.getElementById("spolupraca");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ako to funguje
              </Button>
            </div>
          </div>

          <div className="md:col-span-6">
            <HeroPreview
              step={step}
              path={path}
              state={state}
              update={update}
              onPick={(p) => { setPath(p); setStep(1); }}
              onConfirm={() => setStep(2)}
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
  state,
  update,
  onPick,
  onConfirm,
  onBack,
  onReset,
}: {
  step: 0 | 1 | 2;
  path: HeroPath | null;
  state: HeroState;
  update: <K extends keyof HeroState>(k: K, v: HeroState[K]) => void;
  onPick: (p: HeroPath) => void;
  onConfirm: () => void;
  onBack: () => void;
  onReset: () => void;
}) {
  const pathLabel = path ? heroPaths.find((p) => p.id === path)!.label : null;
  return (
    <div
      className="rounded-[16px] overflow-hidden"
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
          <span className="text-[11px] tracking-wider uppercase" style={{ color: "var(--text-secondary)" }}>
            Interaktívna ukážka
          </span>
        </div>
        <StepProgress step={step} total={3} />
      </div>

      <div className="px-5 py-5 md:px-6 md:py-6" style={{ minHeight: 360 }}>
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="mb-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                Krok 1 z 3
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Čo zákazník potrebuje?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {heroPaths.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onPick(p.id)}
                    className="text-left rounded-[10px] px-4 py-3 text-sm font-medium transition-colors hover:border-[var(--primary)]"
                    style={{
                      border: "1px solid var(--border-strong)",
                      backgroundColor: "transparent",
                      color: "var(--text-primary)",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && path && (
            <motion.div
              key={`s1-${path}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Krok 2 z 3</span>
                <span className="text-xs font-medium" style={{ color: "var(--primary)" }}>{pathLabel}</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-5">
                {heroPaths.find((p) => p.id === path)!.step2Title}
              </h3>
              <HeroStep1 path={path} state={state} update={update} />
              <div className="mt-6">
                <Button variant="primary" arrow onClick={onConfirm} full>
                  Pokračovať
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && path && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Hotovo</span>
                <span className="text-xs font-medium" style={{ color: "var(--primary)" }}>Dopyt pripravený</span>
              </div>
              <HeroSummary path={path} state={state} pathLabel={pathLabel!} />
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
          className="inline-flex items-center gap-1 py-2 px-1 disabled:opacity-30 transition-opacity"
          style={{ color: "var(--text-primary)" }}
        >
          <span aria-hidden>←</span> Späť
        </button>
        <button
          onClick={onReset}
          disabled={step === 0}
          className="py-2 px-1 disabled:opacity-30 transition-opacity"
          style={{ color: "var(--text-secondary)" }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function HeroStep1({
  path,
  state,
  update,
}: {
  path: HeroPath;
  state: HeroState;
  update: <K extends keyof HeroState>(k: K, v: HeroState[K]) => void;
}) {
  if (path === "cena") {
    return (
      <div className="space-y-5">
        <Slider
          value={state.rozsah}
          onChange={(v) => update("rozsah", v)}
          min={5}
          max={100}
          label="Rozsah zákazky"
          unit="m"
        />
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--text-secondary)" }}>
            Materiál
          </div>
          <Segmented
            value={state.material}
            onChange={(v) => update("material", v)}
            options={[
              { value: "A", label: "Variant A" },
              { value: "B", label: "Variant B" },
              { value: "C", label: "Variant C" },
            ]}
            label="Materiál"
          />
        </div>
        <div className="pt-1">
          <Toggle
            checked={state.montaz}
            onChange={(v) => update("montaz", v)}
            label="Vrátane montáže"
          />
        </div>
      </div>
    );
  }
  if (path === "riesenie") {
    return (
      <div className="space-y-5">
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--text-secondary)" }}>
            Účel použitia
          </div>
          <div className="flex flex-wrap gap-2">
            {(["domov", "firma", "verejny"] as const).map((v) => (
              <Chip key={v} active={state.ucel === v} onClick={() => update("ucel", v)}>
                {v === "domov" ? "Domácnosť" : v === "firma" ? "Firma" : "Verejný priestor"}
              </Chip>
            ))}
          </div>
        </div>
        <Slider
          value={state.rozpocet}
          onChange={(v) => update("rozpocet", v)}
          min={250}
          max={5000}
          step={50}
          label="Rozpočet"
          unit="€"
        />
        <Swatches
          value={state.farba}
          onChange={(v) => update("farba", v)}
          label="Farebné ladenie"
          options={[
            { value: "#246653", label: "Zelená", color: "#246653" },
            { value: "#c5a45e", label: "Zlatá", color: "#c5a45e" },
            { value: "#df8b61", label: "Terrakota", color: "#df8b61" },
            { value: "#4a5651", label: "Antracit", color: "#4a5651" },
          ]}
        />
      </div>
    );
  }
  if (path === "dopyt") {
    return (
      <div className="space-y-5">
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--text-secondary)" }}>
            Typ služby
          </div>
          <Segmented
            value={state.sluzba}
            onChange={(v) => update("sluzba", v)}
            options={[
              { value: "konzultacia", label: "Konzultácia" },
              { value: "obhliadka", label: "Obhliadka" },
              { value: "ponuka", label: "Ponuka" },
            ]}
            label="Typ služby"
          />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--text-secondary)" }}>
            Lokalita
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              ["ba", "Bratislava"],
              ["nr", "Nitra"],
              ["ke", "Košice"],
              ["ostatne", "Iná"],
            ] as const).map(([v, l]) => (
              <Chip key={v} active={state.lokalita === v} onClick={() => update("lokalita", v)}>
                {l}
              </Chip>
            ))}
          </div>
        </div>
        <div
          className="rounded-[10px] px-3.5 py-3 flex items-center gap-2 text-xs"
          style={{
            backgroundColor: "var(--surface-muted)",
            border: "1px dashed var(--border-strong)",
            color: "var(--text-secondary)",
          }}
        >
          <span aria-hidden>📎</span> Miesto pre nahrané fotografie (v ostrej verzii).
        </div>
      </div>
    );
  }
  // termin
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--text-secondary)" }}>
          Deň v týždni
        </div>
        <Segmented
          value={state.den}
          onChange={(v) => update("den", v)}
          options={[
            { value: "pon", label: "Pondelok" },
            { value: "str", label: "Streda" },
            { value: "pia", label: "Piatok" },
          ]}
          label="Deň"
        />
      </div>
      <div>
        <div className="mb-2 text-xs uppercase tracking-wider font-medium" style={{ color: "var(--text-secondary)" }}>
          Čas
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            ["rano", "Ráno · 9:00"],
            ["poobede", "Poobede · 14:30"],
            ["vecer", "Podvečer · 17:00"],
          ] as const).map(([v, l]) => (
            <Chip key={v} active={state.cas === v} onClick={() => update("cas", v)}>
              {l}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSummary({
  path,
  state,
  pathLabel,
}: {
  path: HeroPath;
  state: HeroState;
  pathLabel: string;
}) {
  const rows: [string, string][] = (() => {
    if (path === "cena") {
      const base = state.rozsah * (state.material === "A" ? 24 : state.material === "B" ? 32 : 42);
      const low = base + (state.montaz ? 180 : 0);
      const high = Math.round(low * 1.18);
      return [
        ["Rozsah", `${state.rozsah} m`],
        ["Materiál", `Variant ${state.material}`],
        ["Montáž", state.montaz ? "Áno" : "Nie"],
        ["Orientačná cena", `${low.toLocaleString("sk")} – ${high.toLocaleString("sk")} €`],
      ];
    }
    if (path === "riesenie") {
      return [
        ["Účel", state.ucel === "domov" ? "Domácnosť" : state.ucel === "firma" ? "Firma" : "Verejný priestor"],
        ["Rozpočet", `${state.rozpocet} €`],
        ["Farba", state.farba],
        ["Odporúčanie", "Variant B · v rámci rozpočtu"],
      ];
    }
    if (path === "dopyt") {
      return [
        ["Služba", state.sluzba === "konzultacia" ? "Konzultácia" : state.sluzba === "obhliadka" ? "Obhliadka" : "Cenová ponuka"],
        ["Lokalita", state.lokalita === "ba" ? "Bratislava" : state.lokalita === "nr" ? "Nitra" : state.lokalita === "ke" ? "Košice" : "Iná"],
        ["Prílohy", "Pripravené"],
        ["Odoslať firme", "Áno"],
      ];
    }
    return [
      ["Deň", state.den === "pon" ? "Pondelok" : state.den === "str" ? "Streda" : "Piatok"],
      ["Čas", state.cas === "rano" ? "9:00" : state.cas === "poobede" ? "14:30" : "17:00"],
      ["Kontakt", "Vyplnený"],
      ["Rezervácia", "Potvrdiť"],
    ];
  })();

  return (
    <div
      className="rounded-[12px] px-4 py-3"
      style={{
        backgroundColor: "var(--background-soft)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="pb-2 mb-1 text-xs uppercase tracking-wider"
        style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}
      >
        {pathLabel}
      </div>
      {rows.map(([k, v], i) => (
        <SummaryRow key={k} label={k} value={v} accent={i === rows.length - 1} />
      ))}
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
  return (
    <section style={{ backgroundColor: "var(--primary-dark)", color: "#fffdf8" }}>
      <div className="container-page py-16 md:py-28">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14 items-start">
          <div className="md:col-span-5">
            <div
              className="eyebrow mb-3"
              style={{ color: "color-mix(in oklab, #fffdf8 65%, transparent)" }}
            >
              Pokročilá kalkulačka
            </div>
            <h2
              className="font-semibold tracking-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                color: "#fffdf8",
                lineHeight: 1.02,
              }}
            >
              Nie je to metre krát jedna&nbsp;sadzba.
            </h2>
            <p
              className="mt-6 max-w-md text-base md:text-[17px]"
              style={{
                color: "color-mix(in oklab, #fffdf8 78%, transparent)",
                lineHeight: 1.55,
              }}
            >
              Výpočet sa nastaví podľa pravidiel, ktoré firma reálne používa pri
              príprave ponúk. Vyskúšajte, ako sa cena mení podľa vstupov.
            </p>

            <dl className="mt-8 space-y-4">
              {[
                ["Minimálna cena", "ak je zákazka pod minimálnym rozsahom"],
                ["Doprava", "dopočítaná podľa vzdialenosti"],
                ["Montáž a demontáž", "samostatné položky"],
                ["Neštandardný výber", "individuálne potvrdenie firmou"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[1fr_auto] gap-3 items-baseline pb-3"
                  style={{
                    borderBottom: "1px solid color-mix(in oklab, #fffdf8 12%, transparent)",
                  }}
                >
                  <dd
                    className="text-[13.5px]"
                    style={{ color: "color-mix(in oklab, #fffdf8 82%, transparent)", lineHeight: 1.5 }}
                  >
                    {v}
                  </dd>
                  <dt
                    className="text-[12px] font-medium tabular-nums text-right"
                    style={{ color: "var(--highlight)" }}
                  >
                    {k}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-7">
            <LiveCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveCalculator() {
  const [rozmery, setRozmery] = useState(42);
  const [material, setMaterial] = useState<"A" | "B" | "C">("B");
  const [doprava, setDoprava] = useState(35);
  const [montaz, setMontaz] = useState(true);
  const [doplnky, setDoplnky] = useState(1);
  const [open, setOpen] = useState(false);

  const materialRate = material === "A" ? 22 : material === "B" ? 32 : 44;
  const zaklad = rozmery * materialRate;
  const dopravaCena = Math.max(0, doprava - 10) * 0.9;
  const montazCena = montaz ? Math.round(rozmery * 4.2) : 0;
  const doplnkyCena = doplnky * 65;
  const medzisucet = zaklad + dopravaCena + montazCena + doplnkyCena;
  const minCena = 320;
  const spolu = Math.max(minCena, medzisucet);
  const rozsahHigh = Math.round(spolu * 1.15);

  return (
    <div
      className="rounded-[20px] p-5 md:p-7"
      style={{
        backgroundColor: "color-mix(in oklab, #fffdf8 6%, transparent)",
        border: "1px solid color-mix(in oklab, #fffdf8 18%, transparent)",
      }}
    >
      <div
        className="text-[11px] uppercase tracking-[0.14em] mb-5"
        style={{ color: "color-mix(in oklab, #fffdf8 60%, transparent)" }}
      >
        Živý výpočet
      </div>

      <div className="grid gap-5 md:grid-cols-2 md:gap-x-8 md:gap-y-6">
        <Slider dark value={rozmery} onChange={setRozmery} min={5} max={100} label="Rozmery" unit="m" />
        <Slider dark value={doprava} onChange={setDoprava} min={0} max={150} label="Doprava" unit="km" />
        <div className="md:col-span-2">
          <div
            className="mb-2 text-xs uppercase tracking-wider font-medium"
            style={{ color: "color-mix(in oklab, #fffdf8 65%, transparent)" }}
          >
            Materiál
          </div>
          <div
            className="inline-flex p-1 rounded-[10px] w-full"
            style={{ backgroundColor: "color-mix(in oklab, #fffdf8 6%, transparent)", border: "1px solid color-mix(in oklab, #fffdf8 16%, transparent)" }}
          >
            {(["A", "B", "C"] as const).map((m) => {
              const active = m === material;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMaterial(m)}
                  className="relative flex-1 px-3 py-2 text-sm font-medium rounded-[7px] transition-colors"
                  style={{
                    color: active ? "var(--primary-dark)" : "color-mix(in oklab, #fffdf8 75%, transparent)",
                    backgroundColor: active ? "#fffdf8" : "transparent",
                  }}
                >
                  Variant {m}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              role="switch"
              aria-checked={montaz}
              onClick={() => setMontaz(!montaz)}
              className="relative h-6 w-11 rounded-full transition-colors"
              style={{ backgroundColor: montaz ? "var(--highlight)" : "color-mix(in oklab, #fffdf8 25%, transparent)" }}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
                style={{ left: montaz ? "calc(100% - 22px)" : "2px" }}
              />
            </button>
            <span className="text-sm" style={{ color: "#fffdf8" }}>Vrátane montáže</span>
          </label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm" style={{ color: "#fffdf8" }}>Doplnky</span>
          <div
            className="inline-flex items-center rounded-[10px]"
            style={{ border: "1px solid color-mix(in oklab, #fffdf8 25%, transparent)", backgroundColor: "color-mix(in oklab, #fffdf8 8%, transparent)" }}
          >
            <button
              type="button"
              onClick={() => setDoplnky(Math.max(0, doplnky - 1))}
              className="h-9 w-9 grid place-items-center text-lg"
              aria-label="Znížiť"
              style={{ color: "#fffdf8" }}
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm font-semibold tabular-nums" style={{ color: "#fffdf8" }}>{doplnky}</span>
            <button
              type="button"
              onClick={() => setDoplnky(Math.min(6, doplnky + 1))}
              className="h-9 w-9 grid place-items-center text-lg"
              aria-label="Zvýšiť"
              style={{ color: "#fffdf8" }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div
        className="mt-7 pt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2"
        style={{ borderTop: "1px dashed color-mix(in oklab, var(--highlight) 55%, transparent)" }}
      >
        <span
          className="text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "color-mix(in oklab, #fffdf8 60%, transparent)" }}
        >
          Orientačný rozsah
        </span>
        <span
          className="font-semibold tabular-nums"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            color: "#fffdf8",
            letterSpacing: "-0.02em",
          }}
        >
          {Math.round(spolu).toLocaleString("sk")} – {rozsahHigh.toLocaleString("sk")} €
        </span>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-4 inline-flex items-center gap-1.5 text-sm"
        aria-expanded={open}
        style={{ color: "color-mix(in oklab, #fffdf8 78%, transparent)" }}
      >
        <span aria-hidden style={{ transform: open ? "rotate(90deg)" : "none", display: "inline-block", transition: "transform 180ms" }}>›</span>
        Ako sa cena vypočítala?
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.dl
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="mt-3 overflow-hidden text-[13.5px]"
            style={{ color: "color-mix(in oklab, #fffdf8 85%, transparent)" }}
          >
            <div className="grid gap-y-1.5">
              <BreakRow label={`Základ · ${rozmery} m × ${materialRate} €`} value={`${zaklad.toLocaleString("sk")} €`} />
              <BreakRow label={`Doprava · nad 10 km`} value={`${dopravaCena.toFixed(0)} €`} />
              <BreakRow label={`Montáž`} value={montaz ? `${montazCena.toLocaleString("sk")} €` : "—"} />
              <BreakRow label={`Doplnky · ${doplnky} ks`} value={`${doplnkyCena} €`} />
              {spolu === minCena && (
                <BreakRow label="Minimálna zákazka" value={`${minCena} €`} accent />
              )}
            </div>
          </motion.dl>
        )}
      </AnimatePresence>
    </div>
  );
}

function BreakRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span>{label}</span>
      <span
        className="tabular-nums font-medium"
        style={{ color: accent ? "var(--highlight)" : "#fffdf8" }}
      >
        {value}
      </span>
    </div>
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
            <Button
              variant="terracotta"
              arrow
              full
              onClick={() => openSiteAssistant({ source: "home-cta" })}
            >
              Nájsť vhodné riešenie
            </Button>
            <a
              href="#ukazky"
              className="btn w-full sm:w-auto text-center"
              style={{
                border: "1px solid color-mix(in oklab, #fffdf8 30%, transparent)",
                color: "#fffdf8",
                backgroundColor: "transparent",
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

