import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { openSiteAssistant } from "@/lib/site-assistant";

export const Route = createFileRoute("/postup")({
  head: () => ({
    meta: [
      { title: "Ako prebieha spolupráca" },
      {
        name: "description",
        content:
          "Šesť krokov od pozretia webu po widget na stránke: otázky, dizajn, test, prepojenie dopytov a nasadenie.",
      },
      { property: "og:title", content: "Ako prebieha spolupráca" },
      {
        property: "og:description",
        content: "Od prvých otázok po nástroj na vašom webe.",
      },
    ],
  }),
  component: ProcessPage,
});

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
    p: "Dopyty môžu chodiť na e-mail. Podľa potreby sa pripojí kalendár alebo ďalší systém.",
  },
  {
    n: "06",
    h: "Widget sa vloží na web.",
    p: "Vo väčšine prípadov nie je potrebné prerábať celý web.",
  },
];

function ProcessPage() {
  return (
    <SiteLayout>
      <section>
        <div className="container-page pt-12 pb-8 md:pt-20 md:pb-12">
          <div className="eyebrow mb-3">Spolupráca</div>
          <h1 className="font-semibold max-w-3xl" style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)" }}>
            Od prvých otázok po nástroj na vašom webe.
          </h1>
        </div>
      </section>

      <section>
        <div className="container-page pb-20 md:pb-28">
          <ol style={{ borderTop: "1px solid var(--border)" }}>
            {steps.map((s) => (
              <li
                key={s.n}
                className="grid grid-cols-[auto_1fr] gap-5 md:gap-8 py-6 md:py-8"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div
                  className="text-2xl md:text-3xl font-semibold tabular-nums"
                  style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}
                >
                  {s.n}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-semibold mb-2" style={{ lineHeight: 1.25 }}>
                    {s.h}
                  </h2>
                  <p className="max-w-2xl text-[17px]" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                    {s.p}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-base" style={{ color: "var(--text-secondary)" }}>
              Ak vás niektorý krok zaujíma podrobnejšie, napíšte konkrétnu otázku.
            </p>
            <button
              onClick={() => openSiteAssistant({ source: "process-cta" })}
              className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Nájsť riešenie
            </button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
