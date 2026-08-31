import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";

import { openSiteAssistant } from "@/lib/site-assistant";

type FlowMode = "chatbot" | "calculator" | "configurator";

type FlowStage = {
  index: string;
  label: string;
  title: string;
  copy: string;
  artifact: string;
};

const flowModes: Record<FlowMode, { label: string; stages: FlowStage[] }> = {
  chatbot: {
    label: "Chatbot",
    stages: [
      {
        index: "01",
        label: "OTÁZKA",
        title: "Návštevník napíše, čo potrebuje.",
        copy: "Začne obyčajnou otázkou priamo na vašom webe.",
        artifact: "Dobrý deň, čo by ste mi odporučili?",
      },
      {
        index: "02",
        label: "DOPLNENIE",
        title: "Web sa spýta na dôležité údaje.",
        copy: "Doplní iba informácie potrebné na správnu odpoveď.",
        artifact: "Typ služby / miesto / termín",
      },
      {
        index: "03",
        label: "ODPOVEĎ",
        title: "Návštevník dostane jasnú odpoveď.",
        copy: "Hneď vie, aké má možnosti a čo môže urobiť ďalej.",
        artifact: "Odpoveď / možnosti / ďalší krok",
      },
      {
        index: "04",
        label: "DOPYT",
        title: "Vy dostanete pripravený kontakt.",
        copy: "Spolu s kontaktom príde aj zhrnutie celej požiadavky.",
        artifact: "Kontakt + zhrnutie požiadavky",
      },
    ],
  },
  calculator: {
    label: "Kalkulačka",
    stages: [
      {
        index: "01",
        label: "ZAČIATOK",
        title: "Návštevník chce poznať cenu.",
        copy: "Výpočet začne hneď, bez telefonátu alebo čakania.",
        artifact: "Koľko to bude približne stáť?",
      },
      {
        index: "02",
        label: "ÚDAJE",
        title: "Zadá niekoľko jednoduchých údajov.",
        copy: "Vyberie rozmer, množstvo, variant alebo potrebné doplnky.",
        artifact: "Rozmer / množstvo / variant",
      },
      {
        index: "03",
        label: "VÝPOČET",
        title: "Web cenu prepočíta.",
        copy: "Použije váš cenník a pravidlá, ktoré už vo firme máte.",
        artifact: "Vaše pravidlá + váš cenník",
      },
      {
        index: "04",
        label: "VÝSLEDOK",
        title: "Ukáže výsledok a ďalší krok.",
        copy: "Návštevník vie, s čím počítať, a môže rovno odoslať dopyt.",
        artifact: "Odhad ceny + pripravený dopyt",
      },
    ],
  },
  configurator: {
    label: "Konfigurátor",
    stages: [
      {
        index: "01",
        label: "VÝBER",
        title: "Návštevník si vyberie, čo hľadá.",
        copy: "Začne jednoduchou voľbou namiesto preklikávania celej ponuky.",
        artifact: "Čo potrebujem?",
      },
      {
        index: "02",
        label: "MOŽNOSTI",
        title: "Web ukáže vhodné možnosti.",
        copy: "Rozmery, modely, farby a doplnky zobrazí v správnom poradí.",
        artifact: "Len možnosti, ktoré viete dodať",
      },
      {
        index: "03",
        label: "KONTROLA",
        title: "Skontroluje celý výber.",
        copy: "Nedovolí zvoliť kombináciu, ktorú neviete dodať alebo vyrobiť.",
        artifact: "Kontrola kombinácií",
      },
      {
        index: "04",
        label: "ZOSTAVA",
        title: "Hotovú zostavu odošle vám.",
        copy: "Spolu s kontaktom dostanete presný výber návštevníka.",
        artifact: "Zostava + kontakt",
      },
    ],
  },
};

export function PlainFlowStoryRescue(): JSX.Element | null {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [mode, setMode] = useState<FlowMode>("chatbot");

  useEffect(() => {
    const legacy = document.querySelector<HTMLElement>(".hybrid-flow.kage-flow");
    if (!legacy) return undefined;

    const originalId = legacy.id;
    const originalAriaHidden = legacy.getAttribute("aria-hidden");
    const portalMount = document.createElement("div");
    portalMount.dataset.plainFlowMount = "true";

    legacy.id = "ako-to-funguje-legacy-hidden";
    legacy.setAttribute("aria-hidden", "true");
    legacy.dataset.flowRescued = "true";
    legacy.before(portalMount);
    setMountNode(portalMount);

    return () => {
      setMountNode(null);
      portalMount.remove();
      legacy.id = originalId;
      delete legacy.dataset.flowRescued;
      if (originalAriaHidden === null) {
        legacy.removeAttribute("aria-hidden");
      } else {
        legacy.setAttribute("aria-hidden", originalAriaHidden);
      }
    };
  }, []);

  if (!mountNode) return null;

  const stages = flowModes[mode].stages;

  return createPortal(
    <section
      id="ako-to-funguje"
      className="plain-flow-story"
      aria-labelledby="plain-flow-story-title"
      data-nav-tone="dark"
      data-signal-chapter="3"
    >
      <div className="container-page plain-flow-story__inner">
        <header className="plain-flow-story__header">
          <span className="plain-flow-story__eyebrow">03 · AKO TO FUNGUJE</span>
          <h2 id="plain-flow-story-title">Štyri jasné kroky. Bez zadržiavania scrollu.</h2>
          <div className="plain-flow-story__modes" aria-label="Vyberte typ riešenia">
            {(Object.keys(flowModes) as FlowMode[]).map((item) => (
              <button
                key={item}
                type="button"
                data-active={mode === item}
                aria-pressed={mode === item}
                onClick={() => setMode(item)}
              >
                {flowModes[item].label}
              </button>
            ))}
          </div>
        </header>

        <ol className="plain-flow-story__steps">
          {stages.map((stage) => (
            <li key={`${mode}-${stage.index}`} className="plain-flow-story__step">
              <div className="plain-flow-story__number" aria-hidden="true">
                {stage.index}
              </div>
              <div className="plain-flow-story__copy">
                <span>{stage.label}</span>
                <h3>{stage.title}</h3>
                <p>{stage.copy}</p>
              </div>
              <div className="plain-flow-story__artifact">
                <span>VÝSLEDOK KROKU</span>
                <strong>{stage.artifact}</strong>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="plain-flow-story__cta"
          onClick={() => openSiteAssistant({ source: "plain-flow-story", preset: mode === "calculator" ? "calculator" : mode === "configurator" ? "product" : "inquiry" })}
        >
          Vyskúšať na mojom webe <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>,
    mountNode,
  );
}
