import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ExternalLink, MessageCircle } from "lucide-react";
import { CtaBand, PageIntro, Reveal } from "@/components/site/motion-primitives";
import { liveTools, realizations } from "@/data/realizations";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo, SITE_URL } from "@/lib/seo";
import "./realizacie.css";

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
      title: "Realizácie — weby a chatboty, ktoré bežia naživo",
      description:
        "Reálne nasadené weby na vlastných doménach: mojplot.sk, koverta.sk a webko.sk. Plus živé kalkulačky a asistenti, ktoré si viete hneď vyskúšať.",
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
      <PageIntro
        eyebrow="Realizácie"
        title={
          <>
            Weby a nástroje, <em>ktoré naozaj bežia.</em>
          </>
        }
        lead="Žiadne vymyslené prípadové štúdie. Každý web nižšie má vlastnú doménu a viete si ho hneď otvoriť."
      >
        <div className="sp-hero-chips">
          <span className="chip">Živé domény</span>
          <span className="chip">Overiteľné</span>
          <span className="chip">Bez registrácie</span>
        </div>
      </PageIntro>

      <section className="sp-section">
        <div className="container-page">
          <div className="rz-grid">
            {realizations.map((project, index) => (
              <Reveal
                className="rz-item"
                key={project.name}
                delay={Math.min(index * 0.07, 0.16)}
                amount={0.18}
              >
                <a className="rz-card" href={project.href} target="_blank" rel="noreferrer">
                  <span className="rz-shot">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      width={1440}
                      height={1000}
                    />
                    <span className="rz-domain" aria-hidden="true">
                      <i />
                      {project.domain}
                    </span>
                  </span>
                  <span className="rz-body">
                    <span className="rz-type">{project.type}</span>
                    <h2>{project.name}</h2>
                    <p>{project.detail}</p>
                    <span className="rz-open">
                      Otvoriť živý web <ExternalLink aria-hidden="true" size={14} />
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="rz-tools" delay={0.08}>
            <span className="rz-tools-label">Živé nástroje na vyskúšanie</span>
            <div className="rz-tools-list">
              {liveTools.map((tool) => (
                <a key={tool.name} href={tool.href} target="_blank" rel="noreferrer">
                  <b>{tool.name}</b>
                  <small>{tool.note}</small>
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sp-section">
        <CtaBand
          kicker="Predstavujete si niečo podobné?"
          title="Poviem vám, ako by to vyzeralo pre vašu službu."
          lead="Napíšte, čo predávate a na čo sa vás ľudia pýtajú. Navrhnem, čo presne by chatbot robil."
        >
          <button
            type="button"
            className="sp-button sp-button--primary"
            onClick={() => openSiteAssistant({ source: "projects-cta" })}
          >
            <MessageCircle aria-hidden="true" /> Opísať moju situáciu
          </button>
          <Link to="/kontakt" className="sp-button sp-button--ghost">
            Kontakt <ArrowRight aria-hidden="true" />
          </Link>
        </CtaBand>
      </section>
    </div>
  );
}
