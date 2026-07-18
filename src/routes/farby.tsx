import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Bot, Calculator, Check, Layers3, Palette } from "lucide-react";
import { Symbol } from "@/components/Symbol";
import "./farby.css";

type PaletteId = "indigo" | "midnight" | "cobalt" | "teal" | "acid";

type PaletteOption = {
  id: PaletteId;
  number: string;
  name: string;
  mood: string;
  verdict: string;
  background: string;
  surface: string;
  ink: string;
  muted: string;
  primary: string;
  primaryInk: string;
  accent: string;
  accentAlt: string;
  line: string;
};

const palettes: PaletteOption[] = [
  {
    id: "indigo",
    number: "01",
    name: "Ateliér Indigo",
    mood: "osobná · teplá · prémiová",
    verdict:
      "Môj favorit: pôsobí ako prémiové osobné štúdio a pritom prirodzene ladí s farbami chatbota.",
    background: "#f7f4ed",
    surface: "#ffffff",
    ink: "#151718",
    muted: "#5c625e",
    primary: "#5546e8",
    primaryInk: "#ffffff",
    accent: "#ff715b",
    accentAlt: "#16845b",
    line: "rgba(21, 23, 24, 0.14)",
  },
  {
    id: "midnight",
    number: "02",
    name: "Midnight Aurora",
    mood: "technická · filmová · prémiová",
    verdict: "Najsilnejší wow efekt. Tmavý smer komunikuje automatizáciu, výkon a moderný vývoj.",
    background: "#080b12",
    surface: "#111622",
    ink: "#f7f9fc",
    muted: "#a5aec0",
    primary: "#6657e8",
    primaryInk: "#ffffff",
    accent: "#58e0d4",
    accentAlt: "#ff8264",
    line: "rgba(247, 249, 252, 0.15)",
  },
  {
    id: "cobalt",
    number: "03",
    name: "Cobalt Signal",
    mood: "sebavedomá · čistá · konverzná",
    verdict: "Najviac SaaS a B2B. Kobalt buduje dôveru, koral jasne vedie pozornosť k akcii.",
    background: "#f3efe7",
    surface: "#fffcf7",
    ink: "#171a21",
    muted: "#5d6472",
    primary: "#174aff",
    primaryInk: "#ffffff",
    accent: "#ff805b",
    accentAlt: "#c9d5ff",
    line: "rgba(23, 26, 33, 0.13)",
  },
  {
    id: "teal",
    number: "04",
    name: "Deep Teal",
    mood: "vyzretá · pokojná · dôveryhodná",
    verdict:
      "Najlepšie prepojenie s aktuálnym chatbotom, len v hlbšom a profesionálnejšom prevedení.",
    background: "#071b1c",
    surface: "#10282a",
    ink: "#f4fbf8",
    muted: "#a9c1bc",
    primary: "#32d3a2",
    primaryInk: "#071b1c",
    accent: "#ff9276",
    accentAlt: "#70a8ff",
    line: "rgba(244, 251, 248, 0.15)",
  },
  {
    id: "acid",
    number: "05",
    name: "Graphite Acid",
    mood: "kreatívna · odvážna · zapamätateľná",
    verdict:
      "Najodvážnejší agentúrny smer. Výborne zaujme, no je menej konzervatívny pre tradičných klientov.",
    background: "#121612",
    surface: "#1b211d",
    ink: "#fff8e8",
    muted: "#bac4b7",
    primary: "#c7f464",
    primaryInk: "#121612",
    accent: "#7256e8",
    accentAlt: "#ff8264",
    line: "rgba(255, 248, 232, 0.15)",
  },
];

const toolRows = [
  { icon: Bot, label: "Chatbot", detail: "zachytí a kvalifikuje dopyt" },
  { icon: Calculator, label: "Kalkulačka", detail: "vypočíta odpoveď okamžite" },
  { icon: Layers3, label: "Konfigurátor", detail: "pripraví presnú špecifikáciu" },
];

function paletteStyle(palette: PaletteOption) {
  return {
    "--lab-bg": palette.background,
    "--lab-surface": palette.surface,
    "--lab-ink": palette.ink,
    "--lab-muted": palette.muted,
    "--lab-primary": palette.primary,
    "--lab-primary-ink": palette.primaryInk,
    "--lab-accent": palette.accent,
    "--lab-accent-alt": palette.accentAlt,
    "--lab-line": palette.line,
  } as CSSProperties;
}

export const Route = createFileRoute("/farby")({
  head: () => ({
    meta: [
      { title: "Farebné smery — Daniel Vendzúr" },
      {
        name: "description",
        content: "Živý výber farebných smerov pre novú vizuálnu identitu webu Daniela Vendzúra.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ColorLabPage,
});

function ColorLabPage() {
  const [activeId, setActiveId] = useState<PaletteId>("teal");
  const active = palettes.find((palette) => palette.id === activeId) ?? palettes[0];
  const homeHref = import.meta.env.BASE_URL;
  const contactHref = `${homeHref}kontakt/`;
  const projectsHref = `${homeHref}projekty/`;

  useEffect(() => {
    document.documentElement.dataset.colorLab = "true";
    return () => {
      delete document.documentElement.dataset.colorLab;
    };
  }, []);

  return (
    <main className="color-lab">
      <header className="color-lab__header">
        <a className="color-lab__brand" href={homeHref} aria-label="Späť na domovskú stránku">
          <Symbol size={34} />
          <span>
            <strong>Farebný výber</strong>
            <small>Deep Teal · schválený smer</small>
          </span>
        </a>
        <p>
          Vyberte smer <span>01—05</span>
        </p>
      </header>

      <section className={`color-stage color-stage--${active.id}`} style={paletteStyle(active)}>
        <p className="color-lab__sr-only" aria-live="polite">
          Aktívny farebný smer: {active.name}
        </p>
        <div key={active.id} className="color-stage__atmosphere" aria-hidden="true" />
        <div className="color-stage__grain" aria-hidden="true" />

        <nav className="demo-nav" aria-label="Ukážková navigácia">
          <span className="demo-nav__logo">
            <Symbol size={32} />
            <b>Daniel Vendzúr</b>
          </span>
          <span className="demo-nav__links" aria-hidden="true">
            <i>Riešenia</i>
            <i>Realizácie</i>
            <i>Postup</i>
          </span>
          <a href={contactHref}>
            Nezáväzná konzultácia <ArrowUpRight size={15} />
          </a>
        </nav>

        <div className="demo-hero">
          <div className="demo-copy">
            <p className="demo-eyebrow">
              <i /> Chatboty · kalkulačky · konfigurátory
            </p>
            <h1>
              Web, ktorý nielen vyzerá dobre. <em>Aj pracuje.</em>
            </h1>
            <p className="demo-lead">
              Navrhnem nástroj, ktorý návštevníkovi odpovie a vám odovzdá pripravený dopyt.
            </p>
            <div className="demo-actions">
              <a href={contactHref} className="demo-cta">
                Chcem vlastné riešenie <ArrowRight size={17} />
              </a>
              <a href={projectsHref} className="demo-link">
                Pozrieť realizácie <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="demo-proof">
              <span>
                <Check size={14} /> Vlastná logika
              </span>
              <span>
                <Check size={14} /> Nasadenie na váš web
              </span>
            </div>
          </div>

          <div className="demo-product">
            <div className="demo-orbit demo-orbit--one" aria-hidden="true" />
            <div className="demo-orbit demo-orbit--two" aria-hidden="true" />
            <div className="demo-product__top">
              <span>
                <Palette size={15} /> Riešenie na mieru
              </span>
              <b>živá ukážka</b>
            </div>
            <h2>Čo má váš web urobiť za zákazníka?</h2>
            <div className="demo-tool-list">
              {toolRows.map(({ icon: Icon, label, detail }, index) => (
                <div className={index === 0 ? "is-active" : ""} key={label}>
                  <span>
                    <Icon size={18} />
                  </span>
                  <p>
                    <strong>{label}</strong>
                    <small>{detail}</small>
                  </p>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                </div>
              ))}
            </div>
            <div className="demo-result">
              <span className="demo-result__eyebrow">Výsledok</span>
              <strong>Hotový dopyt namiesto prázdneho formulára.</strong>
              <span className="demo-result__link">
                Otvoriť asistenta <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>

        <footer className="demo-palette-note">
          <span>{active.number}</span>
          <div>
            <strong>{active.name}</strong>
            <small>{active.mood}</small>
          </div>
          <p>{active.verdict}</p>
        </footer>
      </section>

      <section className="palette-picker" aria-labelledby="palette-picker-title">
        <div className="palette-picker__intro">
          <p>Porovnanie</p>
          <h2 id="palette-picker-title">
            Päť charakterov.
            <br />
            Žiadne kockované pozadie.
          </h2>
          <span>Kliknite na smer a celý náhľad sa okamžite prefarbí.</span>
        </div>

        <div className="palette-options">
          {palettes.map((palette) => (
            <button
              type="button"
              className="palette-option"
              data-active={palette.id === active.id}
              onClick={() => setActiveId(palette.id)}
              aria-pressed={palette.id === active.id}
              key={palette.id}
            >
              <span className="palette-option__number">{palette.number}</span>
              <span className="palette-option__copy">
                <strong>{palette.name}</strong>
                <small>{palette.mood}</small>
              </span>
              <span className="palette-swatches" aria-label={`Farby palety ${palette.name}`}>
                {[
                  palette.background,
                  palette.ink,
                  palette.primary,
                  palette.accent,
                  palette.accentAlt,
                ].map((color) => (
                  <i key={color} style={{ backgroundColor: color }} title={color} />
                ))}
              </span>
              <span className="palette-option__check">
                <Check size={15} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <footer className="color-lab__footer">
        <p>
          Stačí mi napísať číslo <strong>01—05</strong>. Potom zvolený smer prenesiem do celého
          webu.
        </p>
        <a href={homeHref}>
          Späť na aktuálny web <ArrowUpRight size={15} />
        </a>
      </footer>
    </main>
  );
}
