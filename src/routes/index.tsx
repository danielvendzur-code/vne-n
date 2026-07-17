import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PremiumLanding } from "@/components/site/PremiumLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Daniel Vendzúr — chatboty, kalkulačky a konfigurátory na mieru",
      },
      {
        name: "description",
        content:
          "Chatboty, všetky typy kalkulačiek a konfigurátorov — samostatne aj prepojené do jedného riešenia, ktoré firme odovzdá pripravený dopyt.",
      },
      {
        property: "og:title",
        content: "Daniel Vendzúr — weby a digitálne nástroje, ktoré pracujú",
      },
      {
        property: "og:description",
        content:
          "Chatbot, ľubovoľná kalkulačka alebo konfigurátor navrhnutý podľa vašej služby — samostatne aj v jednom riešení.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <PremiumLanding />
    </SiteLayout>
  );
}
