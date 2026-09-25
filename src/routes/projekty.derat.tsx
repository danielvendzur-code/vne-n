import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ShClosing, ShPage, ShPageHero, ShSectionHead } from "@/components/site/SubPage";
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

const shot = (name: string) => `${import.meta.env.BASE_URL}work/derat-kalkulacka/${name}.webp`;

/* Skutočné zábery kalkulačky, ktorá beží na derat.sk. */
const steps = [
  {
    index: "01",
    title: "Výber služby",
    copy: "Návštevník nezačína prázdnym formulárom. Hneď vyberie, či rieši hlodavce, hmyz alebo dezinfekciu.",
    image: shot("01-sluzba"),
    alt: "Kalkulačka DERAT: výber medzi deratizáciou, dezinsekciou a dezinfekciou",
  },
  {
    index: "02",
    title: "Konkrétny problém",
    copy: "Potkany, myši, kuna alebo „neviem“. Otázky sú krátke a každá voľba má obrázok.",
    image: shot("02-skodca"),
    alt: "Kalkulačka DERAT: výber škodcu s ikonami a orientačnou cenou dole",
  },
  {
    index: "03",
    title: "Priestor a rozloha",
    copy: "Byt, dom, firma alebo sklad a odhad plochy. Orientačná cena sa prepočítava pri každej zmene.",
    image: shot("04-rozloha"),
    alt: "Kalkulačka DERAT: posuvník rozlohy v metroch štvorcových a cena bez DPH",
  },
  {
    index: "04",
    title: "Doplnky a dopyt",
    copy: "Protokol, kontrolná návšteva alebo expres. Firma dostane dopyt so všetkým, čo zákazník zadal.",
    image: shot("05-doplnky"),
    alt: "Kalkulačka DERAT: voliteľné doplnky s cenou a poznámkou pred odoslaním dopytu",
  },
];

const facts = [
  { value: "8 krokov", label: "Každý krok jedna krátka otázka" },
  { value: "Cena hneď", label: "Orientačná suma sa mení s každou voľbou" },
  { value: "2 v 1", label: "Kalkulačka a AI asistent v jednom okne" },
  { value: "1 dopyt", label: "Firma dostane všetky údaje naraz" },
];

function DeratCaseStudyPage() {
  return (
    <ShPage>
      <ShPageHero
        eyebrow="Prípadová štúdia · DERAT"
        title="Z otázky zákazníka"
        accent="k pripravenému dopytu."
        lead="DERAT je reálne nasadený projekt na vlastnej doméne. Kalkulačka vedie návštevníka cez konkrétny problém a rozsah zásahu k orientačnej cene a dopytu."
        visual={{
          src: shot("03-priestor"),
          alt: "Kalkulačka DERAT: výber priestoru s fotografiami a orientačnou cenou",
          width: 600,
          height: 1276,
          portrait: true,
        }}
      >
        <ul className="shp-chips" aria-label="Čo projekt obsahuje">
          <li>Reálny web</li>
          <li>Kalkulačka</li>
          <li>AI asistent</li>
          <li>Dopyt</li>
        </ul>
      </ShPageHero>

      <section className="sh-facts" aria-label="Fakty o riešení">
        <div className="sh-wrap">
          <ul className="sh-facts__card">
            {facts.map((fact, index) => (
              <li key={fact.value} data-reveal style={{ "--d": index } as CSSProperties}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sh-section">
        <div className="sh-wrap">
          <ShSectionHead eyebrow="Ako to prebieha" title="Štyri zastávky od problému k dopytu" />
          <ol className="shp-case-steps shp-case-steps--4">
            {steps.map((step, index) => (
              <li
                className="shp-case-step"
                key={step.index}
                data-reveal
                style={{ "--d": index } as CSSProperties}
              >
                <div className="shp-case-step__media">
                  <img
                    src={step.image}
                    alt={step.alt}
                    width={600}
                    height={1276}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="shp-case-step__body">
                  <span className="shp-num">{step.index}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ShClosing
        title="Projekt je dostupný priamo na derat.sk."
        copy="Otvorte si ostrý web alebo napíšte, ak chcete podobný postup navrhnúť pre vlastnú službu."
      >
        <a
          href="https://derat.sk/"
          target="_blank"
          rel="noreferrer"
          className="sh-btn sh-btn--lime"
        >
          Otvoriť derat.sk <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <button
          type="button"
          className="sh-btn sh-btn--ghost"
          onClick={() => openSiteAssistant({ source: "derat-case-study" })}
        >
          Navrhnúť podobné riešenie
        </button>
        <Link to="/projekty" className="sh-link">
          Ďalšie realizácie <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </ShClosing>
    </ShPage>
  );
}
