import { createFileRoute } from "@tanstack/react-router";
import { HomeConversionUpgrade } from "@/components/site/HomeConversionUpgrade";
import { PageIntro } from "@/components/site/motion-primitives";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    ...seo({
      title: "Cena a čo potrebujeme od klienta",
      description:
        "Tri balíky: START od 390 €, SMART od 690 € a PRO od 990 € jednorazovo, plus mesačná prevádzka od 29 €. Presnú cenu povieme vopred po krátkom zadaní.",
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
            Koľko to stojí <em>a čo od vás potrebujeme.</em>
          </>
        }
        lead="Tri balíky podľa toho, čo má chatbot na webe robiť. Každý má jednorazovú cenu za postavenie a mesačný poplatok za prevádzku. Ceny sú uvedené od — konečný rozsah závisí od počtu otázok a pravidiel a povieme ho vopred."
      />
      <HomeConversionUpgrade />
    </div>
  );
}
