import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PremiumLanding } from "@/components/site/PremiumLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Chatboty a kalkulačky, ktoré menia návštevy na dopyty",
      },
      {
        name: "description",
        content:
          "Navrhujem chatboty, inteligentné cenové kalkulačky a konfigurátory, ktoré zákazníka prevedú výberom a firme odovzdajú hotový dopyt.",
      },
      {
        property: "og:title",
        content: "Webové nástroje, ktoré z návštevnosti robia konkrétne dopyty",
      },
      {
        property: "og:description",
        content:
          "Chatbot, kalkulačka alebo konfigurátor navrhnutý podľa vašej služby, cien a obchodného procesu.",
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
