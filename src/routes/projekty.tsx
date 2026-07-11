import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projekty")({
  head: () => ({
    meta: [
      { title: "Projekty — kalkulačky, konfigurátory a asistenti" },
      { name: "description", content: "Prehľad interaktívnych nástrojov, ktoré aktuálne bežia pre klientov: MojPlot, Koverta, Kamenárstvo, Aplan, VašaSauna a Derat." },
      { property: "og:title", content: "Projekty" },
      { property: "og:description", content: "Kalkulačky, dopytoví asistenti a konfigurátory postavené na mieru." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <SiteLayout>
      <section>
        <div className="container-page pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="eyebrow mb-4">Projekty</div>
          <h1 className="font-semibold max-w-3xl" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}>
            Nástroje, ktoré klientom pomáhajú vybrať a firmám pripraviť ponuku.
          </h1>
          <p className="mt-6 max-w-2xl text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Každý projekt rieši iný typ zadania. Niekde je dôležitá cena, inde predstava,
            v ďalších prípadoch samotné pochopenie situácie klienta.
          </p>
        </div>
      </section>

      <section>
        <div className="container-page pb-24">
          <ul style={{ borderTop: "1px solid var(--border)" }}>
            {projects.map((p) => (
              <li key={p.slug} style={{ borderBottom: "1px solid var(--border)" }}>
                <Link
                  to="/projekty/$slug"
                  params={{ slug: p.slug }}
                  className="group grid grid-cols-12 gap-6 py-8 md:py-10 items-baseline"
                >
                  <div className="col-span-12 md:col-span-1">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.accent }}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <h2 className="text-2xl md:text-3xl font-semibold group-hover:underline underline-offset-4 decoration-1">
                      {p.title}
                    </h2>
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {p.category}
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                      {p.shortDescription}
                    </p>
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
