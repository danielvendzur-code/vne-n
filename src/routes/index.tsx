import { createFileRoute } from "@tanstack/react-router";
import { AwardV2Landing } from "@/components/site/AwardV2Landing";
import { OrientationV3Runtime } from "@/components/site/OrientationV3Runtime";
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
  name: "Môj Chatbot — digitálne predajné nástroje na mieru",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/brand/logo.svg`,
  image: `${SITE_URL}/og/og-home.png`,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phoneHref,
  areaServed: "SK",
  description:
    "Chatboty, kalkulačky, konfigurátory a produktoví poradcovia na mieru pre e-shopy aj firmy so službami.",
  founder: { "@type": "Person", name: siteConfig.team.founder },
  knowsAbout: [
    "chatbot pre e-shop",
    "chatbot pre služby",
    "výpočet ceny na webe",
    "produktový konfigurátor",
    "produktový poradca",
    "kvalifikácia dopytov",
    "guided selling",
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
      title: "Digitálne predajné nástroje na mieru — Môj Chatbot",
      description:
        "Chatboty, kalkulačky, konfigurátory a produktoví poradcovia, ktoré zákazníkovi pomôžu priamo na vašom webe.",
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
    <>
      <AwardV2Landing />
      <OrientationV3Runtime />
    </>
  );
}
