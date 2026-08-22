import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource-variable/inter-tight";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { BrandMark } from "../components/BrandMark";
import { SiteLayout } from "../components/site/Layout";
import { SITE_ORIGIN, siteConfig } from "../config/site";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const systemPageStyle = {
  minHeight: "100dvh",
  display: "grid",
  placeItems: "center",
  padding: "clamp(1.25rem, 5vw, 4rem)",
  background: "#f2f0e8",
  color: "#111310",
} as const;

const systemPanelStyle = {
  width: "min(100%, 900px)",
  borderTop: "1px solid #b8bab2",
  borderBottom: "1px solid #b8bab2",
  padding: "clamp(2rem, 7vw, 5rem) 0",
} as const;

const systemButtonStyle = {
  minHeight: 46,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.75rem 1.1rem",
  border: "1px solid #12372d",
  borderRadius: 4,
  background: "#12372d",
  color: "#f5f4ed",
  fontSize: "0.9rem",
  fontWeight: 650,
  textDecoration: "none",
  cursor: "pointer",
} as const;

function NotFoundComponent() {
  return (
    <div style={systemPageStyle}>
      <main style={systemPanelStyle}>
        <BrandMark size={48} className="system-brand-mark" />
        <p
          style={{
            margin: "3rem 0 1rem",
            color: "#6e746f",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.07em",
          }}
        >
          404 / CESTA SA PRERUŠILA
        </p>
        <h1
          style={{
            maxWidth: "8ch",
            margin: 0,
            color: "#111310",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4rem, 10vw, 8rem)",
            fontWeight: 470,
            letterSpacing: "-0.05em",
            lineHeight: 0.88,
          }}
        >
          Táto cesta nikam nevedie.
        </h1>
        <p style={{ maxWidth: "38rem", margin: "2rem 0", color: "#6e746f", lineHeight: 1.6 }}>
          Odkaz môže byť starý alebo neúplný. Vráťte sa na úvod a pokračujte odtiaľ.
        </p>
        <a href={import.meta.env.BASE_URL} style={systemButtonStyle}>
          Späť na úvod
        </a>
      </main>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div style={systemPageStyle}>
      <main style={systemPanelStyle}>
        <BrandMark size={42} />
        <p
          style={{
            margin: "2.5rem 0 0.8rem",
            color: "#6e746f",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.07em",
          }}
        >
          MÔJ CHATBOT / CHYBA
        </p>
        <h1
          style={{
            maxWidth: "10ch",
            margin: 0,
            color: "#111310",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 470,
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
          }}
        >
          Stránka sa nenačítala.
        </h1>
        <p style={{ maxWidth: "36rem", margin: "1.5rem 0 2rem", color: "#6e746f" }}>
          Skúste obsah načítať znova. Ak problém zostane, môžete sa vrátiť na úvod.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            style={systemButtonStyle}
          >
            Skúsiť znova
          </button>
          <a
            href={import.meta.env.BASE_URL}
            style={{
              ...systemButtonStyle,
              background: "transparent",
              color: "#111310",
              borderColor: "#b8bab2",
            }}
          >
            Späť na úvod
          </a>
        </div>
      </main>
    </div>
  );
}

const publicOrigin = SITE_ORIGIN.replace(/\/$/, "");
const defaultAssistantEmbedUrl =
  "https://danielvendzur-code.github.io/moj.chatbot.backend/widget.js";

const safeAssistantEmbedUrl = (() => {
  const candidate = import.meta.env.VITE_ASSISTANT_EMBED_URL?.trim();
  if (!candidate) return defaultAssistantEmbedUrl;
  try {
    const url = new URL(candidate);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
      return defaultAssistantEmbedUrl;
    }
    return url.toString();
  } catch {
    return defaultAssistantEmbedUrl;
  }
})();

const assistantOrigin = new URL(safeAssistantEmbedUrl).origin;

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "Organization"],
      "@id": `${publicOrigin}/#business`,
      name: siteConfig.brand,
      alternateName: "Moj Chatbot",
      url: `${publicOrigin}/`,
      logo: `${publicOrigin}/brand/logo.svg`,
      image: `${publicOrigin}/og/og-home.png`,
      email: `mailto:${siteConfig.contact.email}`,
      telephone: siteConfig.contact.phoneHref,
      description:
        "Digitálne predajné nástroje na mieru: chatboty, kalkulačky, konfigurátory a produktoví poradcovia pre e-shopy aj firmy so službami.",
      founder: { "@id": `${publicOrigin}/#daniel` },
      areaServed: { "@type": "Country", name: "Slovensko" },
      availableLanguage: ["sk"],
      knowsAbout: [
        "chatbot na mieru",
        "cenová kalkulačka",
        "produktový konfigurátor",
        "produktový poradca",
        "kvalifikácia dopytov",
        "guided selling",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: `mailto:${siteConfig.contact.email}`,
        telephone: siteConfig.contact.phoneHref,
        availableLanguage: ["sk"],
        areaServed: "SK",
      },
    },
    {
      "@type": "Person",
      "@id": `${publicOrigin}/#daniel`,
      name: "Daniel Vendžúr",
      email: `mailto:${siteConfig.contact.email}`,
      url: `${publicOrigin}/`,
      jobTitle: "Zakladateľ Môj Chatbot",
      worksFor: { "@id": `${publicOrigin}/#business` },
    },
    {
      "@type": "WebSite",
      "@id": `${publicOrigin}/#website`,
      name: siteConfig.brand,
      url: `${publicOrigin}/`,
      inLanguage: "sk",
      publisher: { "@id": `${publicOrigin}/#business` },
    },
  ],
});

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  `frame-src 'self' https://danielvendzur-code.github.io https://*.vercel.app ${assistantOrigin}`,
  "form-action 'self' mailto:",
  "img-src 'self' data: blob: https: https://www.google-analytics.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://danielvendzur-code.github.io https://*.vercel.app ${assistantOrigin}`,
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://danielvendzur-code.github.io https://*.vercel.app ${assistantOrigin}`,
  `connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://*.google-analytics.com https://moj-chatbot-backend.vercel.app https://*.vercel.app ${assistantOrigin}`,
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { httpEquiv: "Content-Security-Policy", content: contentSecurityPolicy },
      { name: "referrer", content: "strict-origin-when-cross-origin" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { title: "Môj Chatbot — digitálne predajné nástroje na mieru" },
      {
        name: "description",
        content:
          "Chatboty, kalkulačky, konfigurátory a produktoví poradcovia na mieru pre e-shopy aj firmy so službami.",
      },
      { name: "author", content: "Tím Môj Chatbot" },
      { name: "theme-color", content: "#f2f0e8" },
      { property: "og:site_name", content: "Môj Chatbot" },
      { property: "og:locale", content: "sk_SK" },
      { property: "og:title", content: "Môj Chatbot — z otázky k výsledku" },
      {
        property: "og:description",
        content: "Digitálne predajné nástroje na mieru pre e-shopy aj firmy so službami.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${publicOrigin}/og/og-home.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Môj Chatbot — z otázky k výsledku" },
      {
        name: "twitter:description",
        content: "Chatboty, kalkulačky, konfigurátory a produktoví poradcovia na mieru.",
      },
      { name: "twitter:image", content: `${publicOrigin}/og/og-home.png` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.svg`, type: "image/svg+xml" },
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.ico`, sizes: "32x32" },
      {
        rel: "apple-touch-icon",
        href: `${import.meta.env.BASE_URL}icons/apple-touch-icon.png`,
        sizes: "180x180",
      },
      { rel: "manifest", href: `${import.meta.env.BASE_URL}manifest.webmanifest` },
      { rel: "dns-prefetch", href: "https://danielvendzur-code.github.io" },
      { rel: "preconnect", href: "https://www.googletagmanager.com" },
    ],
    scripts: [{ type: "application/ld+json", children: structuredData }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const basePath =
    import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <html
      lang="sk"
      data-base-path={basePath}
      data-assistant-source={safeAssistantEmbedUrl}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
        <script src={`${import.meta.env.BASE_URL}widget-loader.js`} defer />
      </head>
      <body>
        {children}
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const outlet = <Outlet />;

  return (
    <QueryClientProvider client={queryClient}>
      {pathname.startsWith("/farby") ? outlet : <SiteLayout>{outlet}</SiteLayout>}
    </QueryClientProvider>
  );
}
