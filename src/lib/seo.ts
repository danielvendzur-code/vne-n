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
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}
