import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { openSiteAssistant } from "@/lib/site-assistant";

export const Route = createFileRoute("/postup")({
  head: () => ({
    meta: [
      { title: "Ako to prebieha — od prvej správy po nasadenie" },
      { name: "description", content: "Postup spolupráce pri stavbe kalkulačky, asistenta alebo konfigurátora: zadanie, návrh krokov, prototyp, napojenie na cenníky, nasadenie." },
      { property: "og:title", content: "Ako to prebieha" },
      { property: "og:description", content: "Zadanie, návrh krokov, prototyp, napojenie, nasadenie." },
    ],
  }),
  component: ProcessPage,
});

const steps = [
  {
    n: "01",
    h: "Krátky rozhovor o zadaní",
    p: "Zistíme, aké dopyty firma dnes dostáva a ktoré informácie chýbajú. Bez prezentácií, bez zbytočností.",
  },
  {
    n: "02",
    h: "Návrh krokov pre klienta",
    p: "Napíšem, na čo sa nástroj bude pýtať a v akom poradí. Odsúhlasíme predtým, než sa píše prvý riadok kódu.",
  },
  {
    n: "03",
    h: "Prototyp v prehliadači",
    p: "Prvá verzia, ktorá funguje. Ladíme text otázok, poradie a formu výstupu.",
  },
  {
    n: "04",
    h: "Napojenie na cenník alebo varianty",
    p: "Ceny, kombinácie a pravidlá dostanú do nástroja svoju logiku. Firma vidí presne, čo sa počíta.",
  },
  {
    n: "05",
    h: "Nasadenie na vašu stránku",
    p: "Vloženie do existujúcej stránky ako samostatná časť alebo nová sekcia. Bez zásahu do zvyšku webu.",
  },
];

function ProcessPage() {
  return (
    <SiteLayout>
      <section>
        <div className="container-page pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="eyebrow mb-4">Ako to prebieha</div>
          <h1 className="font-semibold max-w-3xl" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}>
            Od prvej správy po funkčný nástroj bez zbytočných kôl.
          </h1>
        </div>
      </section>

      <section>
        <div className="container-page pb-24">
          <ol style={{ borderTop: "1px solid var(--border)" }}>
            {steps.map((s) => (
              <li key={s.n} className="grid grid-cols-12 gap-6 py-10" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="col-span-12 md:col-span-2 text-3xl md:text-4xl font-semibold tabular-nums" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                  {s.n}
                </div>
                <div className="col-span-12 md:col-span-10">
                  <h2 className="text-2xl font-semibold mb-3">{s.h}</h2>
                  <p className="max-w-2xl text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {s.p}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-base" style={{ color: "var(--text-secondary)" }}>
              Ak vás niektorý krok zaujíma podrobnejšie, napíšte konkrétnu otázku.
            </p>
            <button
              onClick={() => openSiteAssistant({ source: "process-cta" })}
              className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Napísať zadanie
            </button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
