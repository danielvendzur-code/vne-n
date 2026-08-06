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
    label: "Krok 01 · Spoznanie firmy",
    title: "Pozrieme si váš web, ponuku a otázky zákazníkov.",
    copy: "Zistíme, čo ľudia najčastejšie hľadajú, kde odchádzajú a čo dnes musíte riešiť ručne. Platí to pre e-shopy aj firmy so službami.",
    chips: ["Bez záväzku", "Stačí odkaz na web"],
  },
  {
    icon: Workflow,
    label: "Krok 02 · Návrh",
    title: "Určíme, čo má chatbot robiť a čo má poslať vám.",
    copy: "Spoločne vyberieme otázky, odpovede, výpočty, možnosti produktov, objednávky alebo termíny. Všetko uvidíte ešte pred výrobou.",
    chips: ["Jasný postup", "Ukážka vopred", "Vaše schválenie"],
  },
  {
    icon: Palette,
    label: "Krok 03 · Vzhľad a texty",
    title: "Chatbot bude vyzerať a hovoriť ako vaša firma.",
    copy: "Použijeme vaše farby, logo a spôsob komunikácie. Texty napíšeme jednoducho, aby im zákazník rozumel bez vysvetľovania.",
    chips: ["Vaše farby a logo", "Počítač aj mobil"],
  },
  {
    icon: Code2,
    label: "Krok 04 · Výroba a skúška",
    title: "Chatbot postavíme a preveríme na reálnych situáciách.",
    copy: "Vyskúšame otázky, výpočty, výber produktov, objednávky aj odosielanie dopytov. Pred spustením dostanete odkaz na vlastnú ukážku.",
    chips: ["Vlastná ukážka", "Reálne situácie"],
  },
  {
    icon: PlugZap,
    label: "Krok 05 · Prepojenie",
    title: "Výsledky pošleme tam, kde ich už dnes riešite.",
    copy: "Dopyt, objednávka, rezervácia alebo reklamácia môže prísť e-mailom, do kalendára, tabuľky alebo vášho firemného systému.",
    chips: ["E-mail", "Kalendár", "Tabuľka", "Firemný systém"],
  },
  {
    icon: CalendarCheck,
    label: "Krok 06 · Spustenie",
    title: "Chatbota pridáme na web a skontrolujeme prvé výsledky.",
    copy: "Web netreba prerábať. Po spustení preveríme, či všetko funguje, a podľa skutočných otázok zákazníkov doladíme detaily.",
    chips: ["Bez prerábania webu", "Pomoc po spustení"],
  },
];

const processJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Ako prebieha spolupráca s tímom Môj Chatbot",
  description:
    "Šesť krokov od prvého rozhovoru po spustenie chatbota pre e-shop alebo firmu so službami.",
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
        "Šesť jasných krokov od prvého rozhovoru po spustenie chatbota pre e-shop alebo firmu so službami.",
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
            viewport={{ once: true, amount: 0.28, margin: "-6% 0px -10% 0px" }}
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
            Od prvého rozhovoru <em>po chatbota na vašom webe.</em>
          </>
        }
        lead="Rovnaký jasný postup platí pre chatbot na otázky, výpočet ceny, výber produktu, objednávky, reklamácie aj rezervácie. Vždy viete, čo sa práve robí a čo bude nasledovať."
      >
        <div className="sp-hero-chips">
          <span className="chip">Pre e-shopy aj služby</span>
          <span className="chip">Vlastná ukážka pred spustením</span>
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
          kicker="Chcete vedieť, čo by fungovalo u vás?"
          title="Vyberte si riešenie alebo stručne opíšte svoju firmu."
          lead="Chatbot vám pripraví prvý výber. Potom sa ozvem s konkrétnym návrhom pre váš web."
        >
          <button
            type="button"
            className="sp-button sp-button--primary"
            onClick={() => openSiteAssistant({ source: "process-cta" })}
          >
            <MessageCircle aria-hidden="true" /> Vyskladať riešenie
          </button>
          <Link to="/kontakt" className="sp-button sp-button--ghost">
            Prejsť na kontakt <ArrowRight aria-hidden="true" />
          </Link>
        </CtaBand>
      </section>
    </div>
  );
}
