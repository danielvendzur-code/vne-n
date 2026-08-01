import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ExternalLink, MessageCircle } from "lucide-react";
import { AssistantMini, CalculatorMini, ConfiguratorMini } from "@/components/site/MiniPreviews";
import { CtaBand, PageIntro, Reveal } from "@/components/site/motion-primitives";
import { projects, type PreviewType } from "@/data/projects";
import { liveTools, realizations } from "@/data/realizations";
import { useSpotlight } from "@/hooks/useSpotlight";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo, SITE_URL } from "@/lib/seo";
import "./realizacie.css";

const previewByType = {
  assistant: AssistantMini,
  calculator: CalculatorMini,
  configurator: ConfiguratorMini,
} satisfies Record<PreviewType, typeof AssistantMini>;

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
  const gridRef = useSpotlight<HTMLDivElement>(".rz-card");
  const demoRef = useSpotlight<HTMLDivElement>(".sp-project-card > a");

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
          <div className="rz-grid" ref={gridRef}>
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

      <section className="sp-section sp-section--soft">
        <div className="container-page">
          <Reveal amount={0.3}>
            <p className="sp-eyebrow">
              <i />
              Vzorové rozhrania
            </p>
            <h2 className="rz-demo-title">
              Chcete si nástroj <em>osahať?</em>
            </h2>
            <p className="rz-demo-lead">
              Nasledujúce ukážky nie sú nasadené firemné projekty — sú to vzorové rozhrania, na
              ktorých si viete predstaviť nástroj vo vlastnej službe.
            </p>
          </Reveal>

          <div className="sp-project-grid" style={{ marginTop: "2.2rem" }} ref={demoRef}>
            {projects.map((project, index) => {
              const Preview = previewByType[project.previewType];
              return (
                <Reveal
                  className="sp-project-card"
                  key={project.slug}
                  delay={(index % 3) * 0.06}
                  amount={0.2}
                >
                  <Link
                    to="/projekty/$slug"
                    params={{ slug: project.slug }}
                    style={{ "--card-accent": "var(--primary)" } as React.CSSProperties}
                  >
                    <div className="sp-project-visual" aria-hidden="true">
                      <Preview compact />
                    </div>
                    <div className="sp-project-top">
                      <span>
                        <i aria-hidden="true" />
                        {project.label}
                      </span>
                      <ArrowUpRight aria-hidden="true" />
                    </div>
                    <h3>{project.title}</h3>
                    <p className="sp-project-cat">{project.category}</p>
                    <p>{project.shortDescription}</p>
                    <span className="sp-project-foot">
                      Otvoriť ukážku <ArrowRight aria-hidden="true" size={14} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
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
