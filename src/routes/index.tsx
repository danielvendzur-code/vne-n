import { createFileRoute } from "@tanstack/react-router";
import { CompetitionLanding } from "@/components/site/CompetitionLanding";
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
  name: "Daniel Vendžúr — chatboty, kalkulačky a konfigurátory na mieru",
  url: `${SITE_URL}/`,
  email: "daniel@vendzur.sk",
  telephone: "+421948699433",
  areaServed: "SK",
  description:
    "Navrhujem chatboty, cenové kalkulačky a produktové konfigurátory, ktoré odpovedajú zákazníkom a pripravujú kompletné dopyty.",
  founder: { "@type": "Person", name: "Daniel Vendžúr" },
  knowsAbout: [
    "chatboty",
    "AI asistenti",
    "cenové kalkulačky",
    "produktové konfigurátory",
    "konverzia webu",
  ],
});

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({
      title: "Môj Chatbot — web, ktorý odpovedá, počíta a pripraví dopyt",
      description:
        "Chatboty, kalkulačky a konfigurátory na mieru. Zákazník dostane jasný ďalší krok a vám príde kontakt s celým kontextom.",
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
  return <CompetitionLanding />;
}
