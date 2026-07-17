import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { openSiteAssistant } from "@/lib/site-assistant";

export const Route = createFileRoute("/sluzby")({
  head: () => ({
    meta: [
      { title: "Čo tvorím — chatboty, kalkulačky, konfigurátory" },
      {
        name: "description",
        content:
          "Chatboty, ľubovoľné kalkulačky a krokové konfigurátory. Každý nástroj môže fungovať samostatne alebo priamo v chatbote.",
      },
      { property: "og:title", content: "Čo tvorím" },
      {
        property: "og:description",
        content: "Chatbot sa pýta. Kalkulačka počíta. Konfigurátor skladá.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    id: "chatbot",
    name: "Chatbot a dopytový asistent",
    intro: "Zákazníka prevedie otázkami a pripraví údaje pre firmu.",
    when: "Zadanie je zakaždým iné a potrebujete pochopiť situáciu skôr, než pripravíte ponuku.",
    input: "Otázky prispôsobené odpovediam. Bez zbytočností.",
    output: "Prehľadný dopyt s odpoveďami a kontaktom.",
  },
  {
    id: "kalkulacka",
    name: "Kalkulačka na mieru",
    intro: "Cena, spotreba, návratnosť alebo iný výsledok podľa vašej logiky.",
    when: "Výsledok sa dá odvodiť z reálnych vstupov a pravidiel vášho podnikania.",
    input: "Ľubovoľné údaje — rozmery, množstvo, typ, doprava, montáž či vlastné premenné.",
    output: "Presný výsledok, orientačný rozsah alebo ponuka pripravená na odoslanie.",
  },
  {
    id: "konfigurator",
    name: "Konfigurátor na mieru",
    intro: "Ľubovoľný produkt alebo služba poskladané z dostupných možností.",
    when: "Ponuka má viac variantov a klient sa v nej sám nezorientuje.",
    input: "Typ, materiál, rozmer, farba, doplnky, montáž, doprava.",
    output: "Konkrétna konfigurácia pripravená na výrobu alebo cenovú ponuku.",
  },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section>
        <div className="container-page pt-12 pb-8 md:pt-20 md:pb-12">
          <div className="eyebrow mb-3">Čo tvorím</div>
          <h1 className="font-semibold max-w-3xl" style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)" }}>
            Chatbot, kalkulačka, konfigurátor. Samostatne aj spolu.
          </h1>
          <p
            className="mt-5 max-w-2xl text-base md:text-lg"
            style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
          >
            Každý nástroj skladám podľa služieb, cien a procesu firmy. Kalkulačku či konfigurátor
            môžem nasadiť samostatne alebo ich vložiť priamo do plynulého rozhovoru s chatbotom.
          </p>
        </div>
      </section>

      <section>
        <div className="container-page pb-20 md:pb-28 grid gap-12 md:gap-16">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="grid gap-6 md:gap-8 md:grid-cols-12 items-start"
              style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem" }}
            >
              <div className="md:col-span-4">
                <div className="text-xs tabular-nums mb-2" style={{ color: "var(--text-light)" }}>
                  0{i + 1}
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold">{s.name}</h2>
                <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
                  {s.intro}
                </p>
              </div>
              <div className="md:col-span-8 grid gap-5 sm:grid-cols-2">
                <Row label="Kedy dáva zmysel" body={s.when} />
                <Row label="Vstup od klienta" body={s.input} />
                <Row label="Výstup pre firmu" body={s.output} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="container-page pb-20 md:pb-24">
          <div
            className="rounded-2xl p-8 md:p-12"
            style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold max-w-2xl">
              Neviete, čo je pre vás vhodné? Napíšte situáciu, poradím konkrétny typ.
            </h2>
            <div className="mt-6">
              <button
                onClick={() => openSiteAssistant({ source: "services-cta" })}
                className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
                style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Nájsť riešenie
              </button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <p className="text-sm" style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
        {body}
      </p>
    </div>
  );
}
