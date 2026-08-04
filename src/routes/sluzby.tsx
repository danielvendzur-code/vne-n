import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Calculator, MessageCircle, SlidersHorizontal } from "lucide-react";
import { CtaBand, PageIntro, Reveal } from "@/components/site/motion-primitives";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/sluzby")({
  head: () => ({
    ...seo({
      title: "Čo tvoríme — chatboty, kalkulačky a konfigurátory na mieru",
      description:
        "Chatboty, ľubovoľné kalkulačky a krokové konfigurátory. Každý nástroj môže fungovať samostatne alebo priamo v chatbote — vždy podľa logiky vašej služby.",
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

const services = [
  {
    id: "chatbot",
    icon: Bot,
    name: "Chatbot a dopytový asistent",
    intro:
      "Poradí zákazníkovi s výberom, odpovie na otázky o produkte a namiesto prázdneho formulára pošle firme hotový dopyt.",
    when: "Napríklad e-shop, kde si zákazník nevie vybrať veľkosť, variant alebo doplnok — chatbot ho prevedie ponukou a rovno navrhne, čo sa k výberu hodí (upsell). Alebo služba, kde je každé zadanie iné a treba pochopiť situáciu skôr, než pripravíte ponuku.",
    inputChips: ["Poradenstvo pri výbere", "Odporúčanie doplnkov", "Fotky a prílohy", "Kontakt"],
    output: "Prehľadný dopyt s odpoveďami a kontaktom — pripravený na prvú konkrétnu odpoveď.",
  },
  {
    id: "kalkulacka",
    icon: Calculator,
    name: "Kalkulačka na mieru",
    intro:
      "Zákazník zadá pár čísel a hneď vidí cenu, spotrebu alebo návratnosť — počítanú podľa vášho cenníka, nie odhadom.",
    when: "Napríklad plot na metre, materiál na plochu, splátky z ceny alebo úspora po investícii. Všade, kde dnes cenu počítate ručne a zákazník na ňu čaká.",
    inputChips: ["Rozmery a výmera", "Množstvo a typ", "Doprava a montáž", "Vlastné premenné"],
    output: "Presný výsledok, orientačný rozsah alebo ponuka pripravená na odoslanie.",
  },
  {
    id: "konfigurator",
    icon: SlidersHorizontal,
    name: "Konfigurátor na mieru",
    intro:
      "Zákazník si poskladá produkt krok za krokom a vy dostanete špecifikáciu, s ktorou sa dá rovno pracovať.",
    when: "Napríklad nábytok na mieru, balík služieb alebo produkt s desiatkami kombinácií, v ktorých sa zákazník sám nevyzná.",
    inputChips: ["Typ a materiál", "Rozmer a farba", "Doplnky", "Montáž a doprava"],
    output: "Konkrétna konfigurácia pripravená na výrobu alebo cenovú ponuku.",
  },
];

function ServicesPage() {
  return (
    <div className="sp-page">
      <PageIntro
        eyebrow="Čo tvoríme"
        title={
          <>
            Chatbot, kalkulačka, konfigurátor. <em>Samostatne aj spolu.</em>
          </>
        }
        lead="Chatbot poradí s výberom, odpovie na otázky a odporučí doplnok navyše. Kalkulačka spočíta cenu podľa vašich pravidiel. Konfigurátor poskladá produkt krok za krokom. Každý nástroj staviame podľa služieb, cien a procesu konkrétnej firmy — samostatne alebo všetko v jednom rozhovore."
      >
        <div className="sp-hero-chips">
          <span className="chip" data-tone="coral">
            <Bot /> Chatboty
          </span>
          <span className="chip" data-tone="gold">
            <Calculator /> Kalkulačky
          </span>
          <span className="chip">
            <SlidersHorizontal /> Konfigurátory
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
                  </div>
                  <div className="sp-service-rows">
                    <div className="sp-service-row">
                      <span>Kedy dáva zmysel</span>
                      <p>{service.when}</p>
                    </div>
                    <div className="sp-service-row">
                      <span>Vstup od zákazníka</span>
                      <div className="sp-chip-row">
                        {service.inputChips.map((chip) => (
                          <span className="chip" key={chip}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="sp-service-row">
                      <span>Výstup pre firmu</span>
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
                <h3>Najsilnejšie je to dokopy.</h3>
                <p>
                  Kalkulačku aj konfigurátor viem vložiť priamo do rozhovoru s chatbotom. Zákazník
                  prejde od otázky k výpočtu bez toho, aby opustil jedno okno — a vám príde jeden
                  kompletný dopyt.
                </p>
              </div>
              <Link to="/projekty" className="sp-button sp-button--ghost">
                Pozrieť ukážky <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sp-section">
        <CtaBand
          kicker="Neviete, čo je pre vás vhodné?"
          title="Opíšte situáciu. Poradím konkrétny typ nástroja."
          lead="Stačí pár viet o tom, čo robíte a čo vás na tom najviac zdržuje. Odpoviem, čo by vám pomohlo."
        >
          <button
            type="button"
            className="sp-button sp-button--primary"
            onClick={() => openSiteAssistant({ source: "services-cta" })}
          >
            <MessageCircle aria-hidden="true" /> Nájsť riešenie
          </button>
          <Link to="/kontakt" className="sp-button sp-button--ghost">
            Radšej napíšem e-mail <ArrowRight aria-hidden="true" />
          </Link>
        </CtaBand>
      </section>
    </div>
  );
}
