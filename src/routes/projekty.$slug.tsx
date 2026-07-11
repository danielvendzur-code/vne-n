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
      return { meta: [{ title: "Ukážka neexistuje" }, { name: "robots", content: "noindex" }] };
    }
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.label} — ${project.title}` },
        { name: "description", content: project.shortDescription },
        { property: "og:title", content: `${project.label} — ${project.title}` },
        { property: "og:description", content: project.shortDescription },
      ],
    };
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-20">
        <div className="eyebrow mb-4">Ukážka</div>
        <h1 className="text-3xl font-semibold">Ukážka neexistuje</h1>
        <Link
          to="/projekty"
          className="mt-6 inline-flex text-sm font-medium"
          style={{ color: "var(--primary)" }}
        >
          ← Späť na ukážky
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
        <div className="container-page pt-8 pb-4 md:pt-12">
          <Link to="/projekty" className="text-sm" style={{ color: "var(--text-secondary)" }}>
            ← Ukážky
          </Link>
        </div>
      </section>

      <section>
        <div className="container-page pb-10 md:pb-16">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.accent }} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {project.label} · {project.category}
            </span>
          </div>
          <h1 className="font-semibold" style={{ fontSize: "clamp(2rem, 7vw, 3.6rem)", lineHeight: 1.05 }}>
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl" style={{ color: "var(--text-secondary)", fontSize: "clamp(1rem, 2.4vw, 1.15rem)", lineHeight: 1.55 }}>
            {project.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Vyskúšať ukážku
            </button>
            <button
              onClick={() =>
                openSiteAssistant({
                  source: "project-detail",
                  projectSlug: project.slug,
                  category: project.category,
                })
              }
              className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
              style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
            >
              Chcem podobný nástroj
            </button>
          </div>
          <p className="mt-5 text-xs" style={{ color: "var(--text-light)" }}>
            Vzorové rozhranie. Neide o reálny nasadený projekt.
          </p>
        </div>
      </section>

      <section style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container-page py-12 md:py-20 grid gap-10 md:grid-cols-3 md:gap-12">
          <StoryBlock label="Kedy dáva zmysel" body={project.problem} />
          <StoryBlock label="Ako to funguje" body={project.solution} accent={project.accent} />
          <StoryBlock label="Výsledok pre firmu" body={project.result} />
        </div>
      </section>

      <section style={{ backgroundColor: "var(--background-soft)" }}>
        <div className="container-page py-12 md:py-20">
          <div className="eyebrow mb-5">Ďalšie ukážky</div>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                to="/projekty/$slug"
                params={{ slug: p.slug }}
                className="block rounded-xl p-5"
                style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {p.label}
                  </span>
                </div>
                <div className="text-base font-semibold">{p.title}</div>
                <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
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
      <div className="flex items-center gap-2 mb-3">
        {accent && <span className="h-1.5 w-6" style={{ backgroundColor: accent }} />}
        <span className="eyebrow">{label}</span>
      </div>
      <p className="text-base" style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
        {body}
      </p>
    </div>
  );
}
