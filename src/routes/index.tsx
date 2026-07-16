import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PremiumLanding } from "@/components/site/PremiumLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Daniel Vendzúr — weby, chatboty a kalkulačky na mieru",
      },
      {
        name: "description",
        content:
          "Osobné portfólio webov, chatbotov, kalkulačiek a konfigurátorov, ktoré zákazníka prevedú výberom a firme odovzdajú pripravený dopyt.",
      },
      {
        property: "og:title",
        content: "Daniel Vendzúr — weby a digitálne nástroje, ktoré pracujú",
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
