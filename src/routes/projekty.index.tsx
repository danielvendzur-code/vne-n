import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
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
  component: ProjectsPage,
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

      <section className="sh-section">
        <div className="sh-wrap shp-projects">
          {realizations.map((project, index) => (
            <article
              className="shp-project"
              key={project.name}
              data-reveal
              style={{ "--d": 0 } as CSSProperties}
            >
              <a
                className="shp-project__visual"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} — otvoriť ${project.domain}`}
              >
                <img
                  src={project.image}
                  alt={project.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding="async"
                  width={1600}
                  height={1000}
                />
                <span className="sh-project__domain">
                  {project.domain} <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </a>
              <div className="shp-project__meta">
                <span>
                  0{index + 1} · {project.type}
                </span>
                <h2>{project.name}</h2>
                <p>{project.detail}</p>
                <div className="shp-project__links">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="sh-btn sh-btn--dark sh-btn--sm"
                  >
                    Živý web <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  {project.caseStudyPath ? (
                    <Link to={project.caseStudyPath} className="sh-link sh-link--dark">
                      Prípadová štúdia <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ShClosing
        title="Máte podobný proces?"
        copy="Napíšte, čo má zákazník na vašom webe zistiť, vypočítať alebo vybrať. Navrhneme funkčný smer bez zbytočnej technickej omáčky."
      >
        <Link to="/kontakt" className="sh-btn sh-btn--lime">
          Prebrať môj web <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </ShClosing>
    </ShPage>
  );
}
