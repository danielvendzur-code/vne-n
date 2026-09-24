import { createFileRoute } from "@tanstack/react-router";
import { StudioHome } from "@/components/site/StudioHome";
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
  "@type": "Service",
  name: "Môj Chatbot — digitálne predajné nástroje na mieru",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og/og-home.png`,
  serviceType:
    "Chatboty, cenové kalkulačky, 3D konfigurátory a produktoví poradcovia na mieru pre e-shopy aj firmy so službami",
  offers: [
    {
      "@type": "Offer",
      name: "Chatbot alebo produktový poradca",
      price: "347",
      priceCurrency: "EUR",
    },
    {
      "@type": "Offer",
      name: "Cenová kalkulačka alebo konfigurátor",
      price: "447",
      priceCurrency: "EUR",
    },
  ],
  provider: {
    "@type": "Organization",
    name: siteConfig.legal.operator,
    legalName: siteConfig.legal.operator,
    identifier: siteConfig.legal.ico,
    taxID: siteConfig.legal.dic,
    vatID: siteConfig.legal.icDph,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneHref,
  },
  areaServed: "SK",
  description:
    "Chatboty, kalkulačky, konfigurátory a produktoví poradcovia na mieru pre e-shopy aj firmy so službami.",
  knowsAbout: [
    "chatbot pre e-shop",
    "chatbot pre služby",
    "výpočet ceny na webe",
    "produktový konfigurátor",
    "3D konfigurátor",
    "produktový poradca",
    "kvalifikácia dopytov",
    "asistovaný výber produktov",
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
      title: "Chatbot, cenová kalkulačka a 3D konfigurátor na web | Môj Chatbot",
      description:
        "Navrhneme a nasadíme chatbota, cenovú kalkulačku, 3D konfigurátor alebo produktového poradcu na váš web. Od 347 €, ukážka pred nasadením, ozveme sa do 1 dňa.",
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
  return <StudioHome />;
}
