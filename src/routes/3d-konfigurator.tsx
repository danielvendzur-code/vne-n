import { createFileRoute } from "@tanstack/react-router";
import { ConfiguratorPage } from "@/components/site/ConfiguratorPage";
import { siteConfig } from "@/config/site";
import { configuratorFaqs } from "@/data/configurator";
import { breadcrumbJsonLd, seo, SITE_URL } from "@/lib/seo";

const PATH = "/3d-konfigurator";

const serviceJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "3D konfigurátor produktov na web",
  serviceType: "3D produktový konfigurátor na mieru",
  url: `${SITE_URL}${PATH}`,
  image: `${SITE_URL}/og/og-3d-konfigurator.png`,
  description:
    "3D konfigurátor na mieru pre výrobcov a e-shopy. Zákazník nastaví rozmer, farbu a výbavu, vidí produkt v 3D aj orientačnú cenu a odošle dopyt so zostavou.",
  provider: {
    "@type": "Organization",
    name: siteConfig.legal.operator,
    alternateName: siteConfig.brand,
    url: `${SITE_URL}/`,
  },
  areaServed: { "@type": "Country", name: "Slovensko" },
  offers: {
    "@type": "Offer",
    price: "447",
    priceCurrency: "EUR",
    description: "Štartovacia cena konfigurátora; 3D verzia sa nacení podľa rozsahu.",
  },
});

const caseStudyJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "3D konfigurátor prístreškov a pergol pre Koverta",
  url: `${SITE_URL}${PATH}`,
  image: [
    `${SITE_URL}/work/koverta/konfigurator-carport.webp`,
    `${SITE_URL}/work/koverta/konfigurator-pergola.webp`,
  ],
  inLanguage: "sk",
  author: { "@type": "Organization", name: siteConfig.brand, url: `${SITE_URL}/` },
  about: { "@type": "Organization", name: "Koverta", url: "https://koverta.sk/" },
});

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: configuratorFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
});

export const Route = createFileRoute("/3d-konfigurator")({
  head: () => ({
    ...seo({
      title: "3D konfigurátor na web na mieru — ukážka Koverta",
      description:
        "3D konfigurátor produktov pre váš web: rozmer, farba a výbava v 3D, orientačná cena okamžite a dopyt so zostavou. Vyskúšajte živú ukážku pre Koverta.",
      path: PATH,
      image: "/og/og-3d-konfigurator.png",
      imageAlt: "3D konfigurátor Koverta — carport s autom a orientačnou cenou",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "3D konfigurátor", path: PATH }]),
      },
      { type: "application/ld+json", children: serviceJsonLd },
      { type: "application/ld+json", children: caseStudyJsonLd },
      { type: "application/ld+json", children: faqJsonLd },
    ],
  }),
  component: ConfiguratorPage,
});
