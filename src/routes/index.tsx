import { createFileRoute } from "@tanstack/react-router";
import { KageLanding } from "@/components/site/KageLanding";
import { PlainFlowStoryRescue } from "@/components/site/PlainFlowStoryRescue";
import "@/components/site/UserExperiencePolish.css";
import "@/components/site/UserExperiencePolishFinal.css";
import "@/components/site/ResponsiveMediaHeaderFinal.css";
import "@/components/site/HeaderCascadeGuard.css";
import "@/components/site/MobileSmoothnessMediaFinal.css";
import "@/components/site/RequestedAugustHome.css";
import "@/components/site/RequestedAugustDelta.css";
import "@/components/site/FinalHomepageAudit.css";
import "@/components/site/FinalHomepageUserFix.css";
import "@/components/site/FinalHomepageMotionRepair.css";
import "@/components/site/UserReportedVisualFinal.css";
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
        "Chatboty, kalkulačky, konfigurátory a produktoví poradcovia na mieru pre e-shopy aj firmy so službami. Od otázky k výsledku.",
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
      <KageLanding />
      <PlainFlowStoryRescue />
    </>
  );
}
