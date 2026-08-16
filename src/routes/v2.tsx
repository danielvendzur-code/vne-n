import { createFileRoute } from "@tanstack/react-router";
import { Home2 } from "@/components/site2/Home2";
import { Site2Layout } from "@/components/site2/Site2Layout";
import { readDemoEntry } from "@/lib/demo-entry";
import { seo } from "@/lib/seo";

/**
 * Nová domovská stránka.
 *
 * Beží vedľa starej, kým sa neodsúhlasí. Kľúčové je, že táto route
 * obchádza `SiteLayout` (podmienka v `src/routes/__root.tsx`), takže sa
 * na ňu nedostane ani jedna zo 78 starých CSS vrstiev. Preto je na
 * novom dizajne konečne vidieť, že je nový.
 *
 * `?ukazka=` otvorí stránku rovno na tom, čo ste klientovi poslali —
 * viac v `src/lib/demo-entry.ts`.
 */
export const Route = createFileRoute("/v2")({
  head: () => ({
    ...seo({
      title: "Môj Chatbot — pripravené dopyty priamo z webu",
      description:
        "Chatboty, kalkulačky a konfigurátory na mieru pre e-shopy aj firmy so službami.",
      path: "/v2",
      noindex: true,
    }),
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    ukazka: typeof search.ukazka === "string" ? search.ukazka : undefined,
  }),
  component: NewHomePage,
});

function NewHomePage() {
  const { ukazka } = Route.useSearch();
  const demo = readDemoEntry(ukazka);

  return (
    <Site2Layout>
      <Home2 demo={demo} />
    </Site2Layout>
  );
}
