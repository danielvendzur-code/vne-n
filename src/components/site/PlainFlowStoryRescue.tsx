import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

function presetForMode(mode: FlowMode): "inquiry" | "calculator" | "product" {
  if (mode === "calculator") return "calculator";
  if (mode === "configurator") return "product";
  return "inquiry";
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function PlainFlowStoryRescue(): JSX.Element | null {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [mode, setMode] = useState<FlowMode>("chatbot");
  const [activeStage, setActiveStage] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const legacy = document.querySelector<HTMLElement>(".hybrid-flow.kage-flow");
    if (!legacy) return undefined;

    const originalId = legacy.id;
    const originalAriaHidden = legacy.getAttribute("aria-hidden");
    const originalNavTone = legacy.getAttribute("data-nav-tone");
    const originalSignalChapter = legacy.getAttribute("data-signal-chapter");
    const portalMount = document.createElement("div");
    portalMount.dataset.plainFlowMount = "true";

    legacy.id = "ako-to-funguje-legacy-hidden";
    legacy.setAttribute("aria-hidden", "true");
    legacy.removeAttribute("data-nav-tone");
    legacy.removeAttribute("data-signal-chapter");
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

      if (originalNavTone === null) {
        legacy.removeAttribute("data-nav-tone");
      } else {
        legacy.setAttribute("data-nav-tone", originalNavTone);
      }

      if (originalSignalChapter === null) {
        legacy.removeAttribute("data-signal-chapter");
      } else {
        legacy.setAttribute("data-signal-chapter", originalSignalChapter);
      }
    };
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!mountNode || !viewport) return undefined;

    let frame = 0;

    const syncActiveStage = () => {
      frame = 0;
      const panels = Array.from(viewport.querySelectorAll<HTMLElement>("[data-flow-stage]"));
      if (panels.length === 0) return;

      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      panels.forEach((panel, index) => {
        const panelCenter = panel.offsetLeft + panel.offsetWidth / 2;
        const distance = Math.abs(panelCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveStage((current) => (current === closestIndex ? current : closestIndex));
    };

    const requestSync = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(syncActiveStage);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      if (maxScrollLeft <= 1) return;

      const movingForward = event.deltaY > 0;
      const canMove = movingForward
        ? viewport.scrollLeft < maxScrollLeft - 1
        : viewport.scrollLeft > 1;

      if (!canMove) return;

      event.preventDefault();
      viewport.scrollLeft = clamp(viewport.scrollLeft + event.deltaY, 0, maxScrollLeft);
      requestSync();
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync, { passive: true });
    requestSync();

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
    };
  }, [mountNode, mode]);

  if (!mountNode) return null;

  const stages = flowModes[mode].stages;

  const goToStage = (index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const panels = Array.from(viewport.querySelectorAll<HTMLElement>("[data-flow-stage]"));
    const panel = panels[index];
    if (!panel) return;

    viewport.scrollTo({
      left: panel.offsetLeft,
      behavior: reducedMotionRef.current ? "auto" : "smooth",
    });
    setActiveStage(index);
  };

  const selectMode = (nextMode: FlowMode) => {
    setMode(nextMode);
    setActiveStage(0);
    window.requestAnimationFrame(() => {
      viewportRef.current?.scrollTo({ left: 0, behavior: "auto" });
    });
  };

  return createPortal(
    <section
      id="ako-to-funguje"
      className="plain-flow-story"
      aria-labelledby="plain-flow-story-title"
      data-nav-tone="dark"
      data-signal-chapter="3"
    >
      <div className="container-page plain-flow-story__header">
        <span className="plain-flow-story__eyebrow">03 · AKO TO FUNGUJE</span>
        <h2 id="plain-flow-story-title">Štyri jasné kroky. Bez zadržiavania scrollu.</h2>
        <div className="plain-flow-story__modes" aria-label="Vyberte typ riešenia">
          {(Object.keys(flowModes) as FlowMode[]).map((item) => (
            <button
              key={item}
              type="button"
              data-active={mode === item}
              aria-pressed={mode === item}
              onClick={() => selectMode(item)}
            >
              {flowModes[item].label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="plain-flow-story__viewport"
        tabIndex={0}
        aria-label={`${flowModes[mode].label}: štyri kroky, posúvajte do strany`}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goToStage(Math.min(stages.length - 1, activeStage + 1));
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goToStage(Math.max(0, activeStage - 1));
          }
        }}
      >
        <ol className="plain-flow-story__track">
          {stages.map((stage, index) => (
            <li
              key={`${mode}-${stage.index}`}
              className="plain-flow-story__panel"
              data-flow-stage={stage.index}
              data-active={index === activeStage || undefined}
            >
              <div className="container-page plain-flow-story__panel-inner">
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
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="container-page plain-flow-story__footer">
        <div className="plain-flow-story__stage-controls" aria-label="Prejsť na krok">
          {stages.map((stage, index) => (
            <button
              key={stage.index}
              type="button"
              data-active={index === activeStage}
              aria-current={index === activeStage ? "step" : undefined}
              aria-label={`Krok ${index + 1}: ${stage.label}`}
              onClick={() => goToStage(index)}
            >
              {stage.index}
            </button>
          ))}
        </div>

        <div className="plain-flow-story__arrows" aria-label="Posun krokov">
          <button
            type="button"
            aria-label="Predchádzajúci krok"
            disabled={activeStage === 0}
            onClick={() => goToStage(Math.max(0, activeStage - 1))}
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Nasledujúci krok"
            disabled={activeStage === stages.length - 1}
            onClick={() => goToStage(Math.min(stages.length - 1, activeStage + 1))}
          >
            <ArrowRight aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          className="plain-flow-story__cta"
          onClick={() =>
            openSiteAssistant({ source: "horizontal-flow-story", preset: presetForMode(mode) })
          }
        >
          Vyskúšať na mojom webe <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>,
    mountNode,
  );
}
