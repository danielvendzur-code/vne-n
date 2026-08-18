import { createFileRoute } from "@tanstack/react-router";
import { BrandStudioHome } from "@/components/site/BrandStudioHome";
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
  name: "Môj Chatbot — chatboty pre e-shopy aj firmy so službami",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/brand/logo.svg`,
  image: `${SITE_URL}/og/og-home.png`,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phoneHref,
  areaServed: "SK",
  description:
    "Chatboty na mieru, ktoré odpovedajú zákazníkom, počítajú cenu, pomáhajú s výberom a riešia dopyty, objednávky alebo reklamácie.",
  founder: { "@type": "Person", name: siteConfig.team.founder },
  knowsAbout: [
    "chatbot pre e-shop",
    "chatbot pre služby",
    "výpočet ceny na webe",
    "výber produktu",
    "sledovanie objednávky",
    "zrušenie objednávky",
    "vrátenie tovaru a reklamácie",
    "pripravené dopyty",
  ],
});

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
      title: "Chatbot pre e-shop aj služby — Môj Chatbot",
      description:
        "Chatbot na mieru pre e-shopy aj firmy so službami. Odpovie zákazníkom, vypočíta cenu, pomôže s výberom a pripraví dopyt, objednávku alebo reklamáciu.",
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
  return (
    <div data-landing-variant="public">
      <BrandStudioHome />
    </div>
  );
}
