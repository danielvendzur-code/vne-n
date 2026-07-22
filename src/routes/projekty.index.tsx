import { createFileRoute, Link } from "@tanstack/react-router";
import type { PointerEvent } from "react";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { AssistantMini, CalculatorMini, ConfiguratorMini } from "@/components/site/MiniPreviews";
import { CtaBand, PageIntro, Reveal } from "@/components/site/motion-primitives";
import { projects, type PreviewType } from "@/data/projects";
import { openSiteAssistant } from "@/lib/site-assistant";
import { seo } from "@/lib/seo";

const previewByType = {
  assistant: AssistantMini,
  calculator: CalculatorMini,
  configurator: ConfiguratorMini,
} satisfies Record<PreviewType, typeof AssistantMini>;

export const Route = createFileRoute("/projekty/")({
  head: () => ({
    ...seo({
      title: "Ukážky — kalkulačky, asistenti a konfigurátory na vyskúšanie",
      description:
        "Interaktívne ukážky: kalkulačky pre služby, dopytoví asistenti, produktoví poradcovia a rezervačný asistent. Vyskúšajte si ich priamo v prehliadači.",
      path: "/projekty",
    }),
  }),
  component: ProjectsPage,
});

function trackSpotlight(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType === "touch") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--spot-x",
    `${(((event.clientX - bounds.left) / bounds.width) * 100).toFixed(1)}%`,
  );
  event.currentTarget.style.setProperty(
    "--spot-y",
    `${(((event.clientY - bounds.top) / bounds.height) * 100).toFixed(1)}%`,
  );
}

function ProjectsPage() {
  return (
    <div className="sp-page">
      <PageIntro
        eyebrow="Ukážky"
        title={
          <>
            Vyskúšajte si, <em>ako nástroje fungujú.</em>
          </>
        }
        lead="Šesť vzorových rozhraní — od cenovej kalkulačky po rezervačného asistenta. Nie sú to nasadené firemné projekty; slúžia na to, aby ste si vedeli predstaviť nástroj vo vlastnej službe."
      >
        <div className="sp-hero-chips">
          <span className="chip">Interaktívne demá</span>
          <span className="chip">Bez registrácie</span>
          <span className="chip">Priamo v prehliadači</span>
        </div>
      </PageIntro>

      <section className="sp-section">
        <div className="container-page">
          <div className="sp-project-grid">
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
                    onPointerMove={trackSpotlight}
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
                    <h2>{project.title}</h2>
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
          lead="Opíšte, čo dnes počítate alebo vysvetľujete ručne — navrhnem konkrétny nástroj, jeho otázky aj výstup."
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
