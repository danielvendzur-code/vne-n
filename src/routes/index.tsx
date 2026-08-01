import { createFileRoute } from "@tanstack/react-router";
import { PremiumLanding } from "@/components/site/PremiumLanding";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { realizations } from "@/data/realizations";
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
  name: "Môj Chatbot — chatboty, kalkulačky a konfigurátory na mieru",
  url: `${SITE_URL}/`,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phoneHref,
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
});

/**
 * Zoznam reálnych realizácií — Google z neho v obohatených výsledkoch
 * vie ukázať, že za webom stoja skutočné nasadené projekty.
 */
const portfolioJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Vybrané realizácie",
  itemListElement: realizations.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: project.name,
    url: project.href,
    description: project.result,
  })),
});

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({
      title: "Môj Chatbot — chatboty, kalkulačky a konfigurátory na mieru",
      description:
        "Chatbot na mieru, ktorý odpovie zákazníkovi hneď a vám pošle pripravený dopyt. Kalkulačky, konfigurátory a AI asistenti pre firemné weby na Slovensku.",
      path: "/",
    }),
    scripts: [
      { type: "application/ld+json", children: serviceJsonLd },
      { type: "application/ld+json", children: faqJsonLd },
      { type: "application/ld+json", children: portfolioJsonLd },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return <PremiumLanding variant="public" />;
}
