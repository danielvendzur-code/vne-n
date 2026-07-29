export const SITE_URL = "https://danielvendzur-code.github.io/vne-n";

interface SeoOptions {
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/sluzby". */
  path: string;
  noindex?: boolean;
}

/**
 * Builds the per-route head payload: title, description, canonical and
 * social cards with absolute URLs (GitHub Pages needs the full origin).
 */
export function seo({ title, description, path, noindex }: SeoOptions) {
  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const image = `${SITE_URL}/og/og-home.jpg`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Môj Chatbot — chatboty na mieru pre firemné weby" },
      { name: "twitter:title", content: title },
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
