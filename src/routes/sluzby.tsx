import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { openSiteAssistant } from "@/lib/site-assistant";

export const Route = createFileRoute("/sluzby")({
  head: () => ({
    meta: [
      { title: "Čo staviam — kalkulačky, asistenti, konfigurátory" },
      { name: "description", content: "Rozdiel medzi kalkulačkou, dopytovým asistentom, produktovým konfigurátorom a 3D konfigurátorom. Kedy má ktorý zmysel." },
      { property: "og:title", content: "Čo staviam" },
      { property: "og:description", content: "Kalkulačka počíta. Asistent sa pýta. Konfigurátor skladá. 3D konfigurátor ukáže." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    id: "kalkulacka",
    name: "Kalkulačka",
    intro: "Zadanie parametrov a orientačný cenový rozsah.",
    when: "Ceny sa dajú spočítať podľa merateľných veličín — rozmerov, počtu kusov, plochy alebo rozsahu prác.",
    input: "Rozmery, typ, počet, doplnky.",
    output: "Cenový rozsah + zoznam vybraných položiek odoslaný firme.",
    example: "MojPlot, Derat.",
  },
  {
    id: "asistent",
    name: "Dopytový asistent",
    intro: "Krátky sprievodca, ktorý zistí, čo klient reálne potrebuje.",
    when: "Zadanie je zakaždým iné. Nedá sa spočítať cena bez pochopenia situácie.",
    input: "Otázky prispôsobené odpovediam. Bez zbytočného obťažovania.",
    output: "Prehľadný dopyt s údajmi, ktoré firma potrebuje na prvú konzultáciu.",
    example: "Aplan.",
  },
  {
    id: "produktovy",
    name: "Produktový konfigurátor",
    intro: "Poskladanie produktu z reálne dostupných variantov.",
    when: "Ponuka je široká a klient sa v nej sám nezorientuje. Kombinácie majú pravidlá.",
    input: "Typ produktu, materiál, rozmer, doplnky.",
    output: "Konkrétna konfigurácia pripravená na výrobu alebo cenovú ponuku.",
    example: "VašaSauna.",
  },
  {
    id: "3d",
    name: "Vizuálny a 3D konfigurátor",
    intro: "Zmeny vidno okamžite v 3D náhľade alebo na obrázku.",
    when: "Klient si vec bez ukážky nevie predstaviť a odkladá rozhodnutie.",
    input: "Konštrukcia, farby, rozmery, doplnky.",
    output: "Vizuál + presná konfigurácia. Klient odchádza s predstavou.",
    example: "Koverta, Kamenárstvo.",
  },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section>
        <div className="container-page pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="eyebrow mb-4">Čo staviam</div>
          <h1 className="font-semibold max-w-3xl" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}>
            Štyri odlišné nástroje. Vyberáme podľa toho, čo klient potrebuje spraviť.
          </h1>
          <p className="mt-6 max-w-2xl text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Nie všetko je chatbot. Rozdiely nižšie vám pomôžu zistiť, ktorý typ zapadá do vášho biznisu.
          </p>
        </div>
      </section>

      <section>
        <div className="container-page pb-24 grid gap-16 md:gap-24">
          {services.map((s, i) => (
            <article key={s.id} className="grid gap-8 md:grid-cols-12 items-start" style={{ borderTop: "1px solid var(--border)", paddingTop: "3rem" }}>
              <div className="md:col-span-4">
                <div className="text-xs tabular-nums mb-2" style={{ color: "var(--text-light)" }}>0{i + 1}</div>
                <h2 className="text-3xl font-semibold">{s.name}</h2>
                <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>{s.intro}</p>
              </div>
              <div className="md:col-span-8 grid gap-6 sm:grid-cols-2">
                <Row label="Kedy dáva zmysel" body={s.when} />
                <Row label="Príklad" body={s.example} />
                <Row label="Vstup od klienta" body={s.input} />
                <Row label="Výstup pre firmu" body={s.output} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="container-page pb-24">
          <div className="rounded-2xl p-10 md:p-14" style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}>
            <h2 className="text-2xl md:text-3xl font-semibold max-w-2xl">
              Neviete, čo je pre vás vhodné? Napíšte situáciu, poradím konkrétny typ.
            </h2>
            <div className="mt-6">
              <button
                onClick={() => openSiteAssistant({ source: "services-cta" })}
                className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
                style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Napísať zadanie
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
      <p className="text-sm" style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}
