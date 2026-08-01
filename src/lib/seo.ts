import { SITE_ORIGIN, siteConfig } from "@/config/site";

/** Kanonická adresa webu. Mení sa na jednom mieste — v config/site.ts. */
export const SITE_URL = SITE_ORIGIN;

interface SeoOptions {
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/sluzby". */
  path: string;
  noindex?: boolean;
}

/**
 * Značka na konci titulku. Vo výsledkoch vyhľadávania to je jediné miesto,
 * kde je vidieť, komu web patrí, ešte pred kliknutím. Ak už značka
 * v titulku je, nepridáva sa druhýkrát.
 */
function withBrand(title: string): string {
  const brand = siteConfig.brand;
  if (title.toLowerCase().includes(brand.toLowerCase())) return title;
  return `${title} | ${brand}`;
}

/**
 * Builds the per-route head payload: title, description, canonical and
 * social cards with absolute URLs.
 */
export function seo({ title, description, path, noindex }: SeoOptions) {
  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const image = `${SITE_URL}/og/og-home.jpg`;
  const fullTitle = withBrand(title);

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      ...(noindex
        ? [{ name: "robots", content: "noindex, nofollow" }]
        : [{ name: "robots", content: "index, follow, max-image-preview:large" }]),
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:type", content: path === "/" ? "website" : "article" },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Môj Chatbot — chatboty na mieru pre firemné weby" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: "Môj Chatbot — chatboty na mieru pre firemné weby" },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

/**
 * BreadcrumbList pre podstránky — Google z nej v mobilných výsledkoch
 * skladá cestu namiesto holej URL, takže výsledok pôsobí dôveryhodnejšie.
 */
export function breadcrumbJsonLd(trail: Array<{ name: string; path: string }>) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Domov", path: "/" }, ...trail].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${item.path}`,
    })),
  });
}
