import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, MessageCircle } from "lucide-react";
import { CtaBand, PageIntro, Reveal } from "@/components/site/motion-primitives";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/projekty/derat")({
  head: () => ({
    ...seo({
      title: "DERAT — prípadová štúdia kalkulačky a dopytového asistenta",
      description:
        "Pozrite si, ako reálne nasadený web derat.sk vedie návštevníka od problému cez rozsah zásahu k orientačnému výsledku a pripravenému dopytu.",
      path: "/projekty/derat",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([
          { name: "Realizácie", path: "/projekty" },
          { name: "DERAT", path: "/projekty/derat" },
        ]),
      },
    ],
  }),
  component: DeratCaseStudyPage,
});

const steps = [
  {
    index: "01",
    title: "Jasný vstup do služby",
    copy: "Návštevník nezačína prázdnym formulárom. Hneď vidí, že môže svoj problém opísať cez krátky výber a dostať konkrétnejší ďalší krok.",
    image: `${import.meta.env.BASE_URL}work/derat-v2/01-entry.webp`,
    alt: "Mobilná ukážka domovskej stránky DERAT s jasným vstupom do služby",
  },
  {
    index: "02",
    title: "Rozsah sa zisťuje postupne",
    copy: "Rozhranie sa pýta iba na údaje, ktoré sú potrebné pre daný problém. Zákazník tak nemusí vypĺňať dlhý univerzálny formulár.",
    image: `${import.meta.env.BASE_URL}work/derat-v2/03-scope.webp`,
    alt: "Mobilná ukážka kalkulačky DERAT s nastavením rozsahu zásahu",
  },
  {
    index: "03",
    title: "Výsledok a dopyt v jednom toku",
    copy: "Na konci zákazník vidí orientačný výsledok a firma dostane kontakt spolu s kontextom, ktorý už počas výberu zadal.",
    image: `${import.meta.env.BASE_URL}work/derat-v2/04-result.webp`,
    alt: "Mobilná ukážka výsledku kalkulačky DERAT s orientačnou cenou a dopytom",
  },
];

function DeratCaseStudyPage() {
  return (
    <div className="sp-page">
      <PageIntro
        eyebrow="Prípadová štúdia · DERAT"
        title={
          <>
            Z otázky zákazníka k <em>pripravenému dopytu.</em>
          </>
        }
        lead="DERAT je reálne nasadený projekt na vlastnej doméne. Namiesto prázdneho kontaktu vedie návštevníka cez konkrétny problém, rozsah zásahu a výsledok."
      >
        <div className="sp-hero-chips">
          <span className="chip">Reálny web</span>
          <span className="chip">Kalkulačka</span>
          <span className="chip">Dopytový asistent</span>
        </div>
      </PageIntro>

      <section className="sp-section">
        <div className="container-page case-study-grid">
          {steps.map((step, index) => (
            <Reveal className="case-study-card" key={step.index} delay={index * 0.06}>
              <span>{step.index}</span>
              <h2>{step.title}</h2>
              <p>{step.copy}</p>
              <figure className="case-study-shot">
                <img
                  src={step.image}
                  alt={step.alt}
                  width={1086}
                  height={1448}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sp-section">
        <CtaBand
          kicker="Pozrieť bez makety"
          title="Projekt je dostupný priamo na derat.sk."
          lead="Otvorte si ostrý web alebo mi napíšte, ak chcete podobný postup navrhnúť pre vlastnú službu."
        >
          <a
            href="https://derat.sk/"
            target="_blank"
            rel="noreferrer"
            className="sp-button sp-button--primary"
          >
            Otvoriť derat.sk <ExternalLink aria-hidden="true" />
          </a>
          <button
            type="button"
            className="sp-button sp-button--ghost"
            onClick={() => openSiteAssistant({ source: "derat-case-study" })}
          >
            <MessageCircle aria-hidden="true" /> Navrhnúť podobné riešenie
          </button>
          <Link to="/projekty" className="sp-button sp-button--ghost">
            Ďalšie realizácie <ArrowRight aria-hidden="true" />
          </Link>
        </CtaBand>
      </section>
    </div>
  );
}
