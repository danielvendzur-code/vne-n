import { createFileRoute } from "@tanstack/react-router";
import { HomeConversionUpgrade } from "@/components/site/HomeConversionUpgrade";
import { PageIntro } from "@/components/site/motion-primitives";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    ...seo({
      title: "Cena a čo potrebujeme od klienta",
      description:
        "AI chatbot na mieru za 350 € jednorazovo a 10 € mesačne. Kalkulačka či konfigurátor od 400 €. Presnú cenu povieme vopred po krátkom zadaní.",
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
        lead="Každé riešenie má jednorazovú cenu za postavenie a mesačný poplatok za prevádzku. Ak má nástroj aj počítať alebo skladať produkt, rozsah závisí od počtu otázok a pravidiel — presnú cenu povieme vopred."
      />
      <HomeConversionUpgrade />
    </div>
  );
}
