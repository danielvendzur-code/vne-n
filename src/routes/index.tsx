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
  name: "Daniel Vendžúr — chatboty na mieru pre vyššie konverzie",
  url: `${SITE_URL}/`,
  email: "daniel.vendzur@gmail.com",
  telephone: "+421948699433",
  areaServed: "SK",
  description:
    "Chatboty na mieru — od jednoduchého AI poradcu po chatbot s kalkulačkou, konfigurátorom alebo rezerváciou, ktorý premieňa návštevy webu na pripravené dopyty.",
  founder: { "@type": "Person", name: "Daniel Vendžúr" },
  knowsAbout: [
    "AI chatboty",
    "chatboty s kalkulačkou",
    "produktové konfigurátory",
    "konverzná optimalizácia",
  ],
});

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({
      title: "Daniel Vendžúr — chatboty na mieru pre vyššie konverzie",
      description:
        "Tvorím chatboty na mieru — jednoduché AI chatboty aj riešenia s kalkulačkou, konfigurátorom či rezerváciou, ktoré zvyšujú konverzie a odovzdajú pripravený dopyt.",
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
