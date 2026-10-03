import { Work } from "@/components/site/redesign/Work";
import actions from "@/components/site/WebsiteAction.module.css";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ShClosing, ShPage, ShPageHero } from "@/components/site/SubPage";
import { realizations } from "@/data/realizations";
import { breadcrumbJsonLd, seo, SITE_URL } from "@/lib/seo";

const realizationsJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Realizácie — weby a nástroje, ktoré bežia naživo",
  url: `${SITE_URL}/projekty`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: realizations.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.name,
      url: project.href,
      description: project.result,
    })),
  },
});

export const Route = createFileRoute("/projekty/")({
  head: () => ({
    ...seo({
      title: "Realizácie — živé weby a interaktívne nástroje",
      description:
        "Reálne nasadené projekty Môj Chatbot: DERAT, Môj Plot, Koverta a WEBKO. Bez vymyslených metrík a bez makiet.",
      path: "/projekty",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Realizácie", path: "/projekty" }]),
      },
      { type: "application/ld+json", children: realizationsJsonLd },
    ],
  }),
  component: () => <Work />,
});

function ProjectsPage() {
  return (
    <ShPage>
      <ShPageHero
        eyebrow="Vybrané realizácie"
        title="Weby a nástroje,"
        accent="ktoré naozaj bežia."
        lead="Každý projekt nižšie beží na živej doméne. Otvorte si ho a pozrite sa, ako funguje v reálnom webe."
        compact
      />

      <section className="sh-section" aria-label="Zoznam realizácií">
        <div className="sh-wrap shp-cases">
          {realizations.map((project, index) => (
            <article className="shp-case" key={project.name} data-reveal>
              <header className="shp-case__head">
                <span className="shp-case__index">{String(index + 1).padStart(2, "0")}</span>
                <h2>{project.name}</h2>
                <span className="shp-case__type">{project.type}</span>
              </header>
              <a
                className="shp-case__shot"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="Otvoriť web"
                aria-label={`${project.name} — otvoriť ${project.domain}`}
              >
                <span className="shp-case__bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <em>{project.domain}</em>
                </span>
                <img
                  src={project.image}
                  alt={project.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding="async"
                  width={1600}
                  height={1000}
                />
              </a>
              <div className="shp-case__info">
                <div>
                  <small>Čo rieši</small>
                  <p className="shp-case__result">{project.result}</p>
                </div>
                <div>
                  <small>Čo sme dodali</small>
                  <ul>
                    {project.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <small>Ako to funguje</small>
                  <p>{project.detail}</p>
                </div>
              </div>
              <div className="shp-case__links">
                <a href={project.href} target="_blank" rel="noreferrer" className={actions.action}>
                  {project.domain} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                {project.caseStudyPath ? (
                  <Link to={project.caseStudyPath} className="sh-link sh-link--dark">
                    Prípadová štúdia <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <ShClosing
        title="Máte podobný proces?"
        copy="Napíšte, čo má zákazník na vašom webe zistiť, vypočítať alebo vybrať. Navrhneme funkčný smer bez zbytočnej technickej omáčky."
      >
        <Link to="/kontakt" className={actions.action}>
          Prebrať môj web <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </ShClosing>
    </ShPage>
  );
}
