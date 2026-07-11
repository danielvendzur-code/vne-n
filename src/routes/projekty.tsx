import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projekty")({
  head: () => ({
    meta: [
      { title: "Ukážky — kalkulačky, asistenti a konfigurátory" },
      {
        name: "description",
        content:
          "Prehľad interaktívnych ukážok: kalkulačky pre služby, dopytoví asistenti, produktoví poradcovia a rezervačný asistent.",
      },
      { property: "og:title", content: "Ukážky" },
      { property: "og:description", content: "Vyskúšajte, ako môžu riešenia fungovať." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <SiteLayout>
      <section>
        <div className="container-page pt-12 pb-8 md:pt-20 md:pb-12">
          <div className="eyebrow mb-3">Ukážky</div>
          <h1 className="font-semibold max-w-3xl" style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)" }}>
            Vzorové rozhrania jednotlivých riešení.
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
            Ukážky nie sú reálne nasadené firemné projekty. Slúžia na to, aby ste videli,
            ako by mohol nástroj fungovať v praxi.
          </p>
        </div>
      </section>

      <section>
        <div className="container-page pb-20 md:pb-28">
          <ul style={{ borderTop: "1px solid var(--border)" }}>
            {projects.map((p) => (
              <li key={p.slug} style={{ borderBottom: "1px solid var(--border)" }}>
                <Link
                  to="/projekty/$slug"
                  params={{ slug: p.slug }}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-12 gap-4 md:gap-6 py-6 md:py-8 items-baseline"
                >
                  <div className="md:col-span-1 flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: p.accent }}
                    />
                    <span className="text-xs md:hidden" style={{ color: "var(--text-secondary)" }}>
                      {p.label}
                    </span>
                  </div>
                  <div className="md:col-span-4 min-w-0">
                    <div className="hidden md:block text-xs mb-1" style={{ color: "var(--text-light)" }}>
                      {p.label}
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold group-hover:underline underline-offset-4 decoration-1">
                      {p.title}
                    </h2>
                  </div>
                  <div className="md:col-span-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {p.category}
                  </div>
                  <div className="col-span-full md:col-span-4 text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                    {p.shortDescription}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
