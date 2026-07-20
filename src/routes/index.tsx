import { createFileRoute } from "@tanstack/react-router";
import { PremiumLanding } from "@/components/site/PremiumLanding";
import { faqs } from "@/data/faq";
import { seo, SITE_URL } from "@/lib/seo";

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
});

const serviceJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Daniel Vendzúr — chatboty, kalkulačky a konfigurátory na mieru",
  url: `${SITE_URL}/`,
  email: "daniel.vendzur@gmail.com",
  telephone: "+421948699433",
  areaServed: "SK",
  description:
    "Chatboty, kalkulačky a konfigurátory na mieru — samostatne aj prepojené do jedného riešenia, ktoré firme odovzdá pripravený dopyt.",
  founder: { "@type": "Person", name: "Daniel Vendzúr" },
  knowsAbout: ["chatboty", "cenové kalkulačky", "produktové konfigurátory", "webové nástroje"],
});

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({
      title: "Daniel Vendzúr — chatboty, kalkulačky a konfigurátory na mieru",
      description:
        "Webové nástroje, ktoré odovzdajú hotový dopyt: chatboty, všetky typy kalkulačiek a konfigurátorov — samostatne aj prepojené do jedného riešenia.",
      path: "/",
    }),
    scripts: [
      { type: "application/ld+json", children: serviceJsonLd },
      { type: "application/ld+json", children: faqJsonLd },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return <PremiumLanding />;
}
