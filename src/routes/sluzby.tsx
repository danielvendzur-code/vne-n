import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Calculator,
  MessageCircle,
  PackageSearch,
  SlidersHorizontal,
} from "lucide-react";
import { CtaBand, PageIntro, Reveal } from "@/components/site/motion-primitives";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import type { AssistantPreset } from "@/types/assistant";

export const Route = createFileRoute("/sluzby")({
  head: () => ({
    ...seo({
      title: "Chatboty pre e-shopy aj firmy so službami",
      description:
        "Chatbot, výpočet ceny, výber produktu, sledovanie objednávky, zrušenie, vrátenie alebo reklamácia. Riešenie na mieru pre váš web.",
      path: "/sluzby",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Chatboty a riešenia", path: "/sluzby" }]),
      },
    ],
  }),
  component: ServicesPage,
});

const services: Array<{
  id: string;
  icon: typeof Bot;
  name: string;
  intro: string;
  when: string;
  inputChips: string[];
  output: string;
  preset: AssistantPreset;
}> = [
  {
    id: "chatbot",
    icon: Bot,
    name: "Chatbot",
    intro:
      "Odpovie zákazníkom, vysvetlí ponuku, odporučí ďalší krok a pošle vám kontakt aj s tým, čo človek potrebuje.",
    when: "Hodí sa firmám so službami aj e-shopom, ktoré stále odpovedajú na rovnaké otázky alebo dostávajú dopyty bez dôležitých údajov.",
    inputChips: ["Otázky zákazníka", "Potreba", "Fotky", "Kontakt"],
    output: "Jasná odpoveď pre zákazníka a pripravený dopyt pre vás.",
    preset: "inquiry",
  },
  {
    id: "kalkulacka",
    icon: Calculator,
    name: "Chatbot s kalkulačkou",
    intro:
      "Zákazník zadá rozmery, množstvo alebo ďalšie údaje a hneď dostane orientačnú cenu, spotrebu alebo rozsah.",
    when: "Hodí sa tam, kde dnes cenu počítate ručne: ploty, montáž, doprava, materiál, výroba na mieru, splátky alebo návratnosť.",
    inputChips: ["Rozmery", "Množstvo", "Doplnky", "Doprava"],
    output: "Výsledok podľa vašich pravidiel a rovnaké údaje pripravené pre ponuku.",
    preset: "calculator",
  },
  {
    id: "konfigurator",
    icon: SlidersHorizontal,
    name: "Chatbot s konfigurátorom",
    intro:
      "Prevedie zákazníka výberom produktu alebo služby krok za krokom. Človek sa nestratí ani pri veľkom počte možností.",
    when: "Hodí sa pre nábytok, ploty, technické výrobky, balíky služieb, veľkosti, farby, materiály a doplnky.",
    inputChips: ["Typ", "Rozmer", "Farba", "Doplnky"],
    output: "Hotový výber pripravený na cenovú ponuku, výrobu alebo objednávku.",
    preset: "product",
  },
  {
    id: "eshop",
    icon: PackageSearch,
    name: "Chatbot pre e-shop",
    intro:
      "Pomôže pred nákupom aj po ňom. Poradí s produktom, ukáže stav objednávky a pripraví zmenu, zrušenie, vrátenie alebo reklamáciu.",
    when: "Hodí sa e-shopom, ktoré chcú odbremeniť podporu a nechcú, aby zákazník hľadal číslo objednávky, formulár alebo správny e-mail.",
    inputChips: ["Číslo objednávky", "Stav doručenia", "Dôvod zmeny", "Fotky reklamácie"],
    output: "Zákazník vie, čo sa deje, a podpora dostane kompletnú požiadavku.",
    preset: "inquiry",
  },
];

function ServicesPage() {
  return (
    <div className="sp-page">
      <PageIntro
        eyebrow="Čo tvoríme"
        title={
          <>
            Chatboty pre e-shopy <em>aj firmy so službami.</em>
          </>
        }
        lead="Chatbot môže iba odpovedať, počítať cenu, pomáhať s výberom alebo riešiť objednávky a reklamácie. Najčastejšie spojíme viac vecí do jedného jednoduchého rozhovoru."
      >
        <div className="sp-hero-chips">
          <span className="chip" data-tone="coral">
            <Bot /> Odpovede a dopyty
          </span>
          <span className="chip" data-tone="gold">
            <Calculator /> Výpočet ceny
          </span>
          <span className="chip">
            <SlidersHorizontal /> Výber produktu
          </span>
          <span className="chip">
            <PackageSearch /> Objednávky a reklamácie
          </span>
        </div>
      </PageIntro>

      <section className="sp-section">
        <div className="container-page">
          <div className="sp-service-list">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.05} amount={0.22}>
                <article className="sp-service" id={service.id}>
                  <span className="sp-service-index">0{index + 1}</span>
                  <div className="sp-service-head">
                    <service.icon aria-hidden="true" />
                    <h2>{service.name}</h2>
                    <p>{service.intro}</p>
                    <button
                      type="button"
                      className="sp-button sp-button--primary"
                      onClick={() =>
                        openSiteAssistant({
                          source: `services-${service.id}`,
                          preset: service.preset,
                          category: service.name,
                        })
                      }
                    >
                      Vybrať {service.name.toLocaleLowerCase("sk")}{" "}
                      <ArrowRight aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sp-service-rows">
                    <div className="sp-service-row">
                      <span>Kedy sa hodí</span>
                      <p>{service.when}</p>
                    </div>
                    <div className="sp-service-row">
                      <span>Čo zadá zákazník</span>
                      <div className="sp-chip-row">
                        {service.inputChips.map((chip) => (
                          <span className="chip" key={chip}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="sp-service-row">
                      <span>Čo dostanete vy</span>
                      <p>{service.output}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.08} amount={0.3}>
            <div className="sp-combine">
              <div>
                <h3>Najlepšie riešenie často spája viac vecí.</h3>
                <p>
                  Chatbot môže najprv odpovedať, potom vypočítať cenu, pomôcť s výberom a nakoniec
                  poslať dopyt alebo objednávku. Zákazník zostane v jednom rozhovore a nemusí hľadať
                  ďalšie stránky ani formuláre.
                </p>
              </div>
              <button
                type="button"
                className="sp-button sp-button--ghost"
                onClick={() => openSiteAssistant({ source: "services-combined" })}
              >
                Vyskladať riešenie <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sp-section">
        <CtaBand
          kicker="Neviete, čo sa hodí práve vám?"
          title="Vyberte si základ alebo stručne opíšte svoju firmu."
          lead="Chatbot pripraví prvý výber. Potom sa ozvem s konkrétnym návrhom pre váš web."
        >
          <button
            type="button"
            className="sp-button sp-button--primary"
            onClick={() => openSiteAssistant({ source: "services-cta" })}
          >
            <MessageCircle aria-hidden="true" /> Vyskladať riešenie
          </button>
          <Link to="/kontakt" className="sp-button sp-button--ghost">
            Radšej napíšem e-mail <ArrowRight aria-hidden="true" />
          </Link>
        </CtaBand>
      </section>
    </div>
  );
}
