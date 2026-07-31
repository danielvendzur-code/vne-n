import { createFileRoute } from "@tanstack/react-router";
import { HomeConversionUpgrade } from "@/components/site/HomeConversionUpgrade";
import { PageIntro } from "@/components/site/motion-primitives";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    ...seo({
      title: "Cena a čo potrebujem od klienta",
      description:
        "Jednoduchý chatbot začína od 350 €. Kalkulačka či konfigurátor podľa počtu otázok a pravidiel. Cenu poviem vopred, po krátkom zadaní.",
      path: "/cennik",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Cena", path: "/cennik" }]),
      },
    ],
  }),
  component: PricingPage,
});

/**
 * Cenník mal pôvodne miesto na domovskej stránke, ale predlžoval ju
 * o vyše 2 500 px. Obsah ostal nedotknutý, len sa presunul sem.
 */
function PricingPage() {
  return (
    <div className="sp-page">
      <PageIntro
        eyebrow="Cena"
        title={
          <>
            Koľko to stojí <em>a čo od vás potrebujem.</em>
          </>
        }
        lead="Jednoduchý chatbot viem nasadiť rýchlo. Ak má aj počítať cenu alebo skladať produkt, závisí to od počtu otázok a pravidiel — cenu poviem vopred."
      />
      <HomeConversionUpgrade />
    </div>
  );
}
