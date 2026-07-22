import { createFileRoute, Link } from "@tanstack/react-router";
import type { PointerEvent } from "react";
import { ArrowRight, Bot, Calculator, MessageCircle, SlidersHorizontal } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { CtaBand, PageIntro, Reveal } from "@/components/site/motion-primitives";
import { openSiteAssistant } from "@/lib/site-assistant";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/sluzby")({
  head: () => ({
    ...seo({
      title: "Čo tvorím — chatboty, kalkulačky a konfigurátory na mieru",
      description:
        "Chatboty, ľubovoľné kalkulačky a krokové konfigurátory. Každý nástroj môže fungovať samostatne alebo priamo v chatbote — vždy podľa logiky vašej služby.",
      path: "/sluzby",
    }),
  }),
  component: ServicesPage,
});

const services = [
  {
    id: "chatbot",
    icon: Bot,
    name: "Chatbot a dopytový asistent",
    intro: "Zákazníka prevedie otázkami a pripraví použiteľné zadanie pre firmu.",
    when: "Zadanie je zakaždým iné a potrebujete pochopiť situáciu skôr, než pripravíte ponuku.",
    inputChips: ["Vlastné otázky", "Reakcie na odpovede", "Fotky a prílohy", "Kontakt"],
    output: "Prehľadný dopyt s odpoveďami a kontaktom — pripravený na prvú konkrétnu odpoveď.",
  },
  {
    id: "kalkulacka",
    icon: Calculator,
    name: "Kalkulačka na mieru",
    intro: "Cena, spotreba, návratnosť alebo iný výsledok podľa vašich pravidiel.",
    when: "Výsledok sa dá odvodiť z reálnych vstupov a cenníka či pravidiel vášho podnikania.",
    inputChips: ["Rozmery a výmera", "Množstvo a typ", "Doprava a montáž", "Vlastné premenné"],
    output: "Presný výsledok, orientačný rozsah alebo ponuka pripravená na odoslanie.",
  },
  {
    id: "konfigurator",
    icon: SlidersHorizontal,
    name: "Konfigurátor na mieru",
    intro: "Produkt alebo služba poskladané krok za krokom z dostupných možností.",
    when: "Ponuka má viac variantov a klient sa v nej sám nezorientuje.",
    inputChips: ["Typ a materiál", "Rozmer a farba", "Doplnky", "Montáž a doprava"],
    output: "Konkrétna konfigurácia pripravená na výrobu alebo cenovú ponuku.",
  },
];

function trackServiceSpotlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--spot-x",
    `${(((event.clientX - bounds.left) / bounds.width) * 100).toFixed(1)}%`,
  );
  event.currentTarget.style.setProperty(
    "--spot-y",
    `${(((event.clientY - bounds.top) / bounds.height) * 100).toFixed(1)}%`,
  );
}

function ServicesPage() {
  return (
    <SiteLayout>
      <div className="sp-page">
        <PageIntro
          eyebrow="Čo tvorím"
          title={
            <>
              Chatbot, kalkulačka, konfigurátor. <em>Samostatne aj spolu.</em>
            </>
          }
          lead="Každý nástroj skladám podľa služieb, cien a procesu konkrétnej firmy. Kalkulačku či konfigurátor viem nasadiť samostatne — alebo ich vložiť priamo do plynulého rozhovoru s chatbotom."
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
                  <article
                    className="sp-service"
                    id={service.id}
                    onPointerMove={trackServiceSpotlight}
                  >
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
            lead="Stačí pár viet o tom, čo dnes vysvetľujete alebo počítate ručne. Odpoviem s konkrétnym odporúčaním a rozsahom prvej verzie."
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
    </SiteLayout>
  );
}
