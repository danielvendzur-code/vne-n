import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageCircle, Play } from "lucide-react";
import {
  premiumEase,
  Reveal,
  staggerChild,
  staggerParent,
} from "@/components/site/motion-primitives";
import { getProject, projects } from "@/data/projects";
import { DemoViewer } from "@/components/DemoViewer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/projekty/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Ukážka neexistuje" }, { name: "robots", content: "noindex" }] };
    }
    const { project } = loaderData;
    return {
      ...seo({
        title: `${project.label} — ${project.title}`,
        description: project.shortDescription,
        path: `/projekty/${project.slug}`,
      }),
    };
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="sp-page">
      <div className="container-page py-24">
        <div className="sp-eyebrow">
          <i />
          Ukážka
        </div>
        <h1
          className="mt-4 font-medium"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            letterSpacing: "-0.05em",
          }}
        >
          Ukážka neexistuje
        </h1>
        <Link to="/projekty" className="sp-back mt-8">
          <ArrowLeft aria-hidden="true" /> Späť na ukážky
        </Link>
      </div>
    </div>
  ),
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const [demoOpen, setDemoOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const accentVars = { "--card-accent": "var(--primary)" } as React.CSSProperties;

  return (
    <div className="sp-page" style={accentVars}>
      <section className="sp-hero">
        <motion.div
          className="container-page sp-hero-inner"
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          variants={staggerParent}
        >
          <motion.div variants={staggerChild}>
            <Link to="/projekty" className="sp-back">
              <ArrowLeft aria-hidden="true" /> Všetky ukážky
            </Link>
          </motion.div>
          <motion.p className="sp-eyebrow" style={{ marginTop: "1.6rem" }} variants={staggerChild}>
            <i style={{ background: "var(--primary)" }} />
            {project.label} · {project.category}
          </motion.p>
          <motion.h1 variants={staggerChild}>{project.title}</motion.h1>
          <motion.p className="sp-hero-lead" variants={staggerChild}>
            {project.shortDescription}
          </motion.p>
          <motion.div
            className="sp-cta-actions"
            style={{ justifyContent: "flex-start", marginTop: "1.9rem" }}
            variants={staggerChild}
          >
            <button
              type="button"
              className="sp-button sp-button--primary"
              onClick={() => setDemoOpen(true)}
            >
              <Play aria-hidden="true" /> Vyskúšať ukážku
            </button>
            <button
              type="button"
              className="sp-button sp-button--ghost"
              onClick={() =>
                openSiteAssistant({
                  source: "project-detail",
                  projectSlug: project.slug,
                  category: project.category,
                })
              }
            >
              Chcem podobný nástroj <ArrowUpRight aria-hidden="true" />
            </button>
          </motion.div>
          <motion.p
            variants={staggerChild}
            style={{ marginTop: "1.2rem", color: "var(--text-light)", fontSize: "0.75rem" }}
          >
            Vzorové rozhranie — nejde o reálny nasadený projekt.
          </motion.p>
        </motion.div>
      </section>

      <section className="sp-section">
        <div className="container-page">
          <div className="sp-detail-blocks">
            {[
              { label: "Kedy dáva zmysel", body: project.problem },
              { label: "Ako to funguje", body: project.solution },
              { label: "Výsledok pre firmu", body: project.result },
            ].map((block, index) => (
              <Reveal key={block.label} delay={index * 0.07} amount={0.3}>
                <div className="sp-detail-block">
                  <span>
                    <i aria-hidden="true" />
                    {block.label}
                  </span>
                  <p>{block.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-section sp-section--soft">
        <div className="container-page">
          <Reveal amount={0.3}>
            <p className="sp-eyebrow">
              <i />
              Ďalšie ukážky
            </p>
          </Reveal>
          <div className="sp-project-grid" style={{ marginTop: "1.6rem" }}>
            {others.map((other, index) => (
              <Reveal className="sp-project-card" key={other.slug} delay={index * 0.06}>
                <Link
                  to="/projekty/$slug"
                  params={{ slug: other.slug }}
                  style={{ "--card-accent": "var(--primary)" } as React.CSSProperties}
                >
                  <div className="sp-project-top">
                    <span>
                      <i aria-hidden="true" />
                      {other.label}
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </div>
                  <h2>{other.title}</h2>
                  <p className="sp-project-cat">{other.category}</p>
                  <p>{other.shortDescription}</p>
                  <span className="sp-project-foot">
                    Otvoriť ukážku <ArrowRight aria-hidden="true" size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <DemoViewer
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        title={project.title}
        category={project.category}
        accent="var(--primary)"
        presentation={project.demoPresentation}
        demoUrl={project.demoUrl}
      />
    </div>
  );
}
