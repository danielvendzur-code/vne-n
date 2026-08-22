import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
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
    <div className="sp-page">
      <header className="sp-hero">
        <div className="container-page">
          <p className="section-kicker">VYBRANÉ REALIZÁCIE</p>
          <h1>
            Weby a nástroje, <em>ktoré naozaj bežia.</em>
          </h1>
          <p className="sp-hero-lead">
            Každý projekt nižšie beží na živej doméne. Otvorte si ho a pozrite sa, ako funguje v
            reálnom webe.
          </p>
        </div>
      </header>

      <section className="selected-work">
        <div className="container-page work-list">
          {realizations.map((project, index) => (
            <article className={`work-project work-project--${index % 3}`} key={project.name}>
              <a
                className="work-project__visual"
                href={project.href}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={project.image}
                  alt={project.alt}
                  loading="eager"
                  decoding="async"
                  width={1440}
                  height={1000}
                />
              </a>
              <div className="work-project__meta">
                <span>0{index + 1}</span>
                <div>
                  <p>{project.type}</p>
                  <h2>{project.name}</h2>
                  <p>{project.detail}</p>
                </div>
                <div className="work-project__links">
                  <a href={project.href} target="_blank" rel="noreferrer" className="text-link">
                    Živý web <ExternalLink size={14} />
                  </a>
                  {project.name === "DERAT" ? (
                    <Link to="/projekty/derat" className="text-link">
                      Prípadová štúdia <ArrowRight size={14} />
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-bridge">
        <div className="container-page pricing-bridge__grid">
          <div>
            <p className="section-kicker">VÁŠ PROJEKT</p>
            <h2 className="section-title">
              Máte podobný <em>proces?</em>
            </h2>
          </div>
          <div>
            <p>
              Napíšte, čo má zákazník na vašom webe zistiť, vypočítať alebo vybrať. Navrhneme
              funkčný smer bez zbytočnej technickej omáčky.
            </p>
            <Link to="/kontakt" className="button-primary">
              Prebrať môj web <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
