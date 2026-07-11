import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { getProject, projects } from "@/data/projects";
import { DemoViewer } from "@/components/DemoViewer";
import { openSiteAssistant } from "@/lib/site-assistant";

export const Route = createFileRoute("/projekty/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Projekt neexistuje" }, { name: "robots", content: "noindex" }] };
    }
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.title} — ${project.category}` },
        { name: "description", content: project.shortDescription },
        { property: "og:title", content: project.title },
        { property: "og:description", content: project.shortDescription },
      ],
    };
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-24">
        <div className="eyebrow mb-4">Projekt</div>
        <h1 className="text-3xl font-semibold">Projekt neexistuje</h1>
        <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          Adresa nezodpovedá žiadnemu z existujúcich projektov.
        </p>
        <Link to="/projekty" className="mt-6 inline-flex text-sm font-medium" style={{ color: "var(--primary)" }}>
          ← Späť na zoznam projektov
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const [demoOpen, setDemoOpen] = useState(false);

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <SiteLayout>
      <section>
        <div className="container-page pt-12 pb-6 md:pt-16">
          <Link to="/projekty" className="text-sm" style={{ color: "var(--text-secondary)" }}>
            ← Projekty
          </Link>
        </div>
      </section>

      <section>
        <div className="container-page pb-12 md:pb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.accent }} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {project.category}
            </span>
          </div>
          <h1 className="font-semibold" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)" }}>
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {project.shortDescription}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
              style={{ backgroundColor: project.accent, color: "#10231d" }}
            >
              Otvoriť interaktívnu ukážku
            </button>
            <button
              onClick={() => openSiteAssistant({ source: "project-detail", projectSlug: project.slug, category: project.category })}
              className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
              style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
            >
              Chcem podobný nástroj
            </button>
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container-page py-16 md:py-24 grid gap-12 md:grid-cols-3">
          <StoryBlock label="Problém" body={project.problem} />
          <StoryBlock label="Riešenie" body={project.solution} accent={project.accent} />
          <StoryBlock label="Výsledok" body={project.result} />
        </div>
      </section>

      <section style={{ backgroundColor: "var(--background-soft)" }}>
        <div className="container-page py-16 md:py-24">
          <div className="eyebrow mb-4">Ďalšie projekty</div>
          <div className="grid gap-6 md:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                to="/projekty/$slug"
                params={{ slug: p.slug }}
                className="block rounded-xl p-6"
                style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{p.category}</span>
                </div>
                <div className="text-lg font-semibold">{p.title}</div>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {p.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DemoViewer
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        title={project.title}
        category={project.category}
        accent={project.accent}
        presentation={project.demoPresentation}
        demoUrl={project.demoUrl}
      />
    </SiteLayout>
  );
}

function StoryBlock({ label, body, accent }: { label: string; body: string; accent?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {accent && <span className="h-1.5 w-6" style={{ backgroundColor: accent }} />}
        <span className="eyebrow">{label}</span>
      </div>
      <p className="text-base" style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
        {body}
      </p>
    </div>
  );
}
