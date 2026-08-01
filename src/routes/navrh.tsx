import { createFileRoute } from "@tanstack/react-router";
import { PremiumLanding } from "@/components/site/PremiumLanding";
import { seo } from "@/lib/seo";

/**
 * Verzia domovskej stránky pre klientov, ktorým som poslal návrh e-mailom.
 *
 * Text hero sekcie nadväzuje priamo na ten e-mail, takže na verejnej
 * domovskej stránke by nedával zmysel. Stránka je preto zámerne mimo
 * navigácie aj mimo indexu vyhľadávačov — chodí sa na ňu iba z odkazu
 * v e-maile.
 */
export const Route = createFileRoute("/navrh")({
  head: () => ({
    ...seo({
      title: "Váš návrh — Môj Chatbot",
      description:
        "Pokračovanie návrhu z e-mailu: živá realizácia, možnosti riešenia, postup spolupráce a priamy kontakt.",
      path: "/navrh",
      noindex: true,
    }),
  }),
  component: ClientLandingPage,
});

function ClientLandingPage() {
  return <PremiumLanding variant="client" />;
}
