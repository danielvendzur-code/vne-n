import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion } from "motion/react";
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
import { CtaBand, PageIntro, premiumEase } from "@/components/site/motion-primitives";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTimelineProgress } from "@/hooks/useTimelineProgress";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "./postup.css";

const steps = [
  {
    icon: Search,
    label: "Krok 01 · Zorientovanie",
    title: "Pozrieme si web, služby a obchodný proces.",
    copy: "Zistíme, čo zákazníci potrebujú vedieť a ktoré údaje firma dnes zisťuje ručne.",
    chips: ["Bez záväzku", "Stačí odkaz na web"],
  },
  {
    icon: Workflow,
    label: "Krok 02 · Návrh logiky",
    title: "Navrhneme otázky, vetvenie a výpočty.",
    copy: "Spoločne odsúhlasíme kroky, možnosti, cenové pravidlá a výsledok pre zákazníka ešte pred vývojom.",
    chips: ["Mapa otázok", "Cenové pravidlá", "Schválenie vopred"],
  },
  {
    icon: Palette,
    label: "Krok 03 · Dizajn",
    title: "Rozhranie zladíme s vašou značkou.",
    copy: "Nástroj prevezme farby, typografiu a tón komunikácie webu, aby nepôsobil ako cudzí doplnok.",
    chips: ["Vaše farby", "Mobil aj desktop"],
  },
  {
    icon: Code2,
    label: "Krok 04 · Vývoj a test",
    title: "Riešenie postavíme a otestujeme.",
    copy: "Preveríme logiku, výpočty aj správanie na počítači a mobile. Pred nasadením dostanete živý testovací odkaz.",
    chips: ["Testovací odkaz", "Reálne scenáre"],
  },
  {
    icon: PlugZap,
    label: "Krok 05 · Prepojenie",
    title: "Dopyty prepojíme s vašimi systémami.",
    copy: "E-mail, kalendár, tabuľka, CRM alebo vlastné API dostanú údaje bez ručného prepisovania.",
    chips: ["E-mail", "Kalendár", "Tabuľka", "CRM / API"],
  },
  {
    icon: CalendarCheck,
    label: "Krok 06 · Nasadenie",
    title: "Widget nasadíme a doladíme podľa prevádzky.",
    copy: "Vo väčšine prípadov stačí jeden riadok kódu. Po spustení skontrolujeme funkčnosť a upravíme detaily podľa reálnych reakcií.",
    chips: ["Jeden riadok kódu", "Podpora po spustení"],
  },
];

const processJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Ako prebieha spolupráca s tímom Môj Chatbot",
  description: "Šesť krokov od analýzy po nasadenie chatbota, kalkulačky alebo konfigurátora.",
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: step.copy,
  })),
});

export const Route = createFileRoute("/postup")({
  head: () => ({
    ...seo({
      title: "Ako prebieha spolupráca — Môj Chatbot",
      description:
        "Šesť jasných krokov od úvodného briefu po nasadenie a zlepšovanie nástroja na webe.",
      path: "/postup",
    }),
    scripts: [
      { type: "application/ld+json", children: processJsonLd },
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Ako to prebieha", path: "/postup" }]),
      },
    ],
  }),
  component: ProcessPage,
});

function Timeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();
  const { progress, reached } = useTimelineProgress(listRef, {
    offset: ["start 0.92", "end 0.48"],
    count: steps.length,
  });

  return (
    <div className="sp-timeline-wrap">
      {reducedMotion ? null : (
        <motion.span
          className="sp-timeline-progress"
          style={{ scaleY: progress }}
          aria-hidden="true"
        />
      )}
      <ol className="sp-timeline" ref={listRef}>
        {steps.map((step, index) => (
          <motion.li
            key={step.title}
            className="sp-timeline-item"
            data-reached={reducedMotion || index < reached}
            data-side={index % 2 === 0 ? "left" : "right"}
            initial={reducedMotion ? false : { opacity: 0, x: index % 2 === 0 ? -64 : 64, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            // Obojsmerné ako zvyšok webu — pri scrollovaní hore krok zase odíde.
            viewport={{ once: false, amount: 0.28, margin: "-6% 0px -10% 0px" }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.82, delay: Math.min(index * 0.055, 0.22), ease: premiumEase }
            }
          >
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
          </motion.li>
        ))}
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
            Od prvých otázok <em>po živé riešenie na vašom webe.</em>
          </>
        }
        lead="Šesť krokov s jasným výstupom. Vždy viete, čo sa práve deje, čo schvaľujete a čo bude nasledovať."
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
          title="Napíšte konkrétnu otázku. Odpovieme konkrétne."
          lead="Po krátkom zadaní pripravíme návrh prvého kroku, otázok a logiky pre vašu službu."
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
