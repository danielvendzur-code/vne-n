import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  Code2,
  MessageCircle,
  Palette,
  PlugZap,
  Search,
  Workflow,
} from "lucide-react";
import { CtaBand, PageIntro } from "@/components/site/motion-primitives";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";
import { seo } from "@/lib/seo";
import "./postup.css";

export const Route = createFileRoute("/postup")({
  head: () => ({
    ...seo({
      title: "Ako prebieha spolupráca — od zadania po nástroj na webe",
      description:
        "Šesť krokov od pozretia webu po widget na stránke: otázky, návrh logiky, dizajn, test, prepojenie dopytov a nasadenie bez prerábania webu.",
      path: "/postup",
    }),
  }),
  component: ProcessPage,
});

const steps = [
  {
    icon: Search,
    label: "Krok 01 · Zorientovanie",
    title: "Pozriem si web a služby.",
    copy: "Zistím, čo zákazníci potrebujú vedieť a ktoré údaje dnes firma zisťuje ručne — telefonátmi, e-mailami alebo obchôdzkami.",
    chips: ["Bez záväzku", "Stačí odkaz na web"],
  },
  {
    icon: Workflow,
    label: "Krok 02 · Návrh logiky",
    title: "Navrhnem otázky a výpočet.",
    copy: "Spolu určíme kroky, možnosti, cenové pravidlá a výsledok pre zákazníka. Logika je odsúhlasená ešte pred vývojom.",
    chips: ["Mapa otázok", "Cenové pravidlá", "Schválite vopred"],
  },
  {
    icon: Palette,
    label: "Krok 03 · Dizajn",
    title: "Pripravím dizajn rozhrania.",
    copy: "Nástroj vyzerá ako súčasť vášho webu — prevezme farby, písmo aj tón komunikácie. Žiadny cudzí widget.",
    chips: ["Vaše farby", "Mobil aj desktop"],
  },
  {
    icon: Code2,
    label: "Krok 04 · Vývoj a test",
    title: "Vytvorím a otestujem riešenie.",
    copy: "Skontrolujem logiku, výpočty aj správanie na počítači a mobile. Dostanete odkaz na vyskúšanie ešte pred nasadením.",
    chips: ["Testovací odkaz", "Reálne scenáre"],
  },
  {
    icon: PlugZap,
    label: "Krok 05 · Prepojenie",
    title: "Prepojím dopyty so systémami.",
    copy: "Dopyty chodia na e-mail aj s celým kontextom. Podľa potreby pripojím kalendár, tabuľku alebo systém, s ktorým už pracujete.",
    chips: ["E-mail", "Kalendár", "Tabuľka", "CRM / API"],
  },
  {
    icon: CalendarCheck,
    label: "Krok 06 · Nasadenie",
    title: "Widget sa vloží na web.",
    copy: "Vo väčšine prípadov stačí jeden riadok kódu — celý web sa prerábať nemusí. Po nasadení sledujem, či všetko beží, a doladím detaily.",
    chips: ["Jeden riadok kódu", "Podpora po spustení"],
  },
];

function Timeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.92", "end 0.48"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 70, damping: 26, mass: 0.5 });
  // Koľko krokov už čiara pri scrollovaní dosiahla.
  const [reached, setReached] = useState(reducedMotion ? steps.length : 0);

  useMotionValueEvent(scaleY, "change", (value) => {
    if (reducedMotion) return;
    const list = listRef.current;
    if (!list) return;
    // Porovnávame skutočnú pozíciu uzla s koncom čiary, nie odhad podľa
    // poradia — inak sa uzol rozsvietil až kus po tom, čo cezeň čiara prešla.
    // offsetTop by sa meral voči vlastnému <li> (má position: relative),
    // takže každý uzol hlásil rovnakú hodnotu a rozsvietili sa naraz.
    // Meriame teda polohu voči zoznamu.
    const listRect = list.getBoundingClientRect();
    const lineEnd = value * listRect.height;
    const nodes = list.querySelectorAll<HTMLElement>(".sp-step-node");
    let count = 0;
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.top + rect.height / 2 - listRect.top <= lineEnd) count += 1;
    });
    setReached(count);
  });

  return (
    <div className="sp-timeline-wrap">
      {reducedMotion ? null : (
        <motion.span className="sp-timeline-progress" style={{ scaleY }} aria-hidden="true" />
      )}
      <ol className="sp-timeline" ref={listRef}>
        {steps.map((step, index) => {
          const isReached = reducedMotion || index < reached;
          return (
            <li key={step.title} className="sp-timeline-item" data-reached={isReached}>
              <span className="sp-step-node" aria-hidden="true">
                <i />
              </span>
              <div className="sp-step">
                <p className="sp-step-label">
                  <step.icon aria-hidden="true" />
                  {step.label}
                </p>
                <h2>{step.title}</h2>
                <p>{step.copy}</p>
                <div className="sp-chip-row">
                  {step.chips.map((chip) => (
                    <span className="chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ProcessPage() {
  return (
    <div className="sp-page sp-page--process">
      <PageIntro
        eyebrow="Spolupráca"
        title={
          <>
            Od prvých otázok <em>po nástroj na vašom webe.</em>
          </>
        }
        lead="Šesť krokov s jasným výstupom v každom z nich. Vždy viete, čo sa práve deje, čo schvaľujete a čo bude nasledovať."
      >
        <div className="sp-hero-chips">
          <span className="chip">Logika schválená pred vývojom</span>
          <span className="chip">Testovací odkaz pred nasadením</span>
          <span className="chip">Bez prerábania webu</span>
        </div>
      </PageIntro>

      <section className="sp-section">
        <div className="container-page">
          <Timeline />
        </div>
      </section>

      <section className="sp-section">
        <CtaBand
          kicker="Zaujíma vás niektorý krok?"
          title="Napíšte konkrétnu otázku. Odpoviem konkrétne."
          lead="Ak chcete vedieť, ako by vyzeral prvý krok pre vašu službu, stačí krátke zadanie — pripravím návrh otázok a logiky."
        >
          <button
            type="button"
            className="sp-button sp-button--primary"
            onClick={() => openSiteAssistant({ source: "process-cta" })}
          >
            <MessageCircle aria-hidden="true" /> Nájsť riešenie
          </button>
          <Link to="/kontakt" className="sp-button sp-button--ghost">
            Prejsť na kontakt <ArrowRight aria-hidden="true" />
          </Link>
        </CtaBand>
      </section>
    </div>
  );
}
