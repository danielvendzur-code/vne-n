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
  name: "Daniel Vendžúr — chatboty na mieru, ktoré zvyšujú konverzie",
  url: `${SITE_URL}/`,
  email: "daniel@vendzur.sk",
  telephone: "+421948699433",
  areaServed: "SK",
  description:
    "Chatboty na mieru — od jednoduchých asistentov po chatboty s kalkulačkou, konfigurátorom alebo rezerváciami, ktoré pripravujú použiteľné dopyty.",
  founder: { "@type": "Person", name: "Daniel Vendžúr" },
  knowsAbout: [
    "chatboty",
    "AI asistenti",
    "cenové kalkulačky",
    "produktové konfigurátory",
    "konverzia webu",
  ],
  // Katalóg služieb bez konkrétnej sumy — cena sa dohaduje podľa rozsahu,
  // takže ju vo výsledku vyhľadávania zámerne neuvádzame.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Chatboty a konverzné nástroje na mieru",
    itemListElement: [
      {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "Service",
          name: "AI chatbot na mieru",
          description:
            "Chatbot odpovedá podľa podkladov firmy, zbiera kontakt a odovzdá dopyt aj s kontextom.",
        },
      },
      {
        "@type": "Offer",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "Service",
          name: "Chatbot s kalkulačkou",
          description:
            "Chatbot vypočíta cenu, spotrebu alebo návratnosť z reálnych vstupov zákazníka.",
        },
      },
      {
        "@type": "Offer",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "Service",
          name: "Chatbot s konfigurátorom",
          description:
            "Chatbot prevedie zákazníka výberom produktu a odošle kompletnú špecifikáciu.",
        },
      },
    ],
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({
      title: "Daniel Vendžúr — chatboty na mieru, ktoré zvyšujú konverzie",
      description:
        "Navrhujem chatboty na mieru — od jednoduchého asistenta až po chatbot s kalkulačkou, konfigurátorom či rezerváciami. Zákazník dostane odpoveď hneď a vy pripravený dopyt.",
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
