import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { SiteLayout } from "../components/site/Layout";
import { SITE_ORIGIN, siteConfig } from "../config/site";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const errorPanelStyle = {
  border: "1px solid rgba(255,199,157,.2)",
  borderRadius: "1.35rem",
  padding: "clamp(1.7rem, 5vw, 3rem)",
  background: "#12100e",
  boxShadow: "0 30px 90px rgba(0,0,0,.58)",
} as const;

function NotFoundComponent() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        backgroundColor: "#0a0908",
        backgroundImage:
          "radial-gradient(circle at 82% 12%, rgba(255,199,157,.11), transparent 30rem)",
      }}
    >
      <div className="max-w-lg text-center" style={errorPanelStyle}>
        <p
          style={{
            color: "#ffc79d",
            fontSize: "0.73rem",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          404 · Adresa neexistuje
        </p>
        <h1
          className="mt-4"
          style={{
            color: "#faf5ef",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.35rem, 7vw, 4rem)",
            fontWeight: 560,
            letterSpacing: "-0.06em",
            lineHeight: 0.98,
          }}
        >
          Odkaz sa nenašiel.
        </h1>
        <p className="mt-5 text-sm" style={{ color: "#c9beb4", lineHeight: 1.65 }}>
          Odkaz môže byť starý alebo neúplný. Vráťte sa na úvod a pokračujte cez hlavnú navigáciu.
        </p>
        <a
          href={import.meta.env.BASE_URL}
          className="mt-8 inline-flex min-h-13 items-center justify-center"
          style={{
            backgroundColor: "#ffc79d",
            color: "#0a0908",
            border: "1px solid #ffc79d",
            borderRadius: "0.9rem",
            padding: "0.9rem 1.45rem",
            fontSize: "0.9rem",
            fontWeight: 800,
            boxShadow: "0 18px 42px -30px rgba(255,199,157,.9)",
          }}
        >
          Späť na úvod
        </a>
      </div>
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
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#0a0908" }}
    >
      <div className="max-w-md text-center" style={errorPanelStyle}>
        <p style={{ color: "#ffc79d", fontSize: ".72rem", fontWeight: 800 }}>MÔJ CHATBOT</p>
        <h1 className="mt-3 text-xl font-semibold" style={{ color: "#faf5ef" }}>
          Stránka sa nenačítala
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#c9beb4" }}>
          Niečo sa pokazilo. Skúste obnoviť obsah alebo sa vráťte na úvod.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-bold"
            style={{ backgroundColor: "#ffc79d", color: "#0a0908", border: "1px solid #ffc79d" }}
          >
            Skúsiť znova
          </button>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-bold"
            style={{
              border: "1px solid rgba(255,199,157,.2)",
              color: "#faf5ef",
              background: "#15120f",
            }}
          >
            Späť na úvod
          </a>
        </div>
      </div>
    </div>
  );
}

const publicOrigin = SITE_ORIGIN.replace(/\/$/, "");
const defaultAssistantEmbedUrl =
  "https://danielvendzur-code.github.io/moj.chatbot.backend/embed.js";

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
      image: `${publicOrigin}/og/og-home.jpg`,
      email: `mailto:${siteConfig.contact.email}`,
      telephone: siteConfig.contact.phoneHref,
      priceRange: "€€",
      description:
        "Chatboty, kalkulačky a konfigurátory na mieru, ktoré odpovedajú zákazníkom a pripravujú použiteľné dopyty.",
      founder: { "@id": `${publicOrigin}/#daniel` },
      areaServed: { "@type": "Country", name: "Slovensko" },
      availableLanguage: ["sk"],
      knowsAbout: [
        "chatbot na mieru",
        "AI asistent pre web",
        "cenová kalkulačka",
        "produktový konfigurátor",
        "generovanie dopytov",
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
      email: `mailto:${siteConfig.contact.emailPersonal}`,
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

const interTightLatinExt =
  "https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsJ8ah8QA.woff2";
const interTightLatin =
  "https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsH8ag.woff2";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // Živá ukážka chatbota je jednoriadkový iframe na jeho vlastný repozitár,
  // takže sa dá meniť tam bez zásahu do kódu webu.
  `frame-src 'self' https://danielvendzur-code.github.io https://*.vercel.app ${assistantOrigin}`,
  // frame-ancestors sa cez <meta> ignoruje (patrí do HTTP hlavičky),
  // tak ho tu nedržíme — inak len zbytočne hlási chybu v konzole.
  "form-action 'self' mailto:",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://danielvendzur-code.github.io https://*.vercel.app ${assistantOrigin}`,
  `script-src 'self' 'unsafe-inline' https://danielvendzur-code.github.io https://*.vercel.app ${assistantOrigin}`,
  `connect-src 'self' https://moj-chatbot-backend.vercel.app https://*.vercel.app ${assistantOrigin}`,
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
      { title: "Môj Chatbot — pripravené dopyty priamo z webu" },
      {
        name: "description",
        content:
          "Chatboty, kalkulačky a konfigurátory na mieru, ktoré odpovedajú zákazníkom a pripravujú použiteľné dopyty.",
      },
      { name: "author", content: "Daniel Vendžúr" },
      { name: "theme-color", content: "#0a0908" },
      { property: "og:site_name", content: "Môj Chatbot" },
      { property: "og:locale", content: "sk_SK" },
      { property: "og:title", content: "Môj Chatbot — pripravené dopyty priamo z webu" },
      {
        property: "og:description",
        content:
          "AI chatboty, kalkulačky a konfigurátory na mieru, ktoré premenia návštevu na pripravený dopyt.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: `${publicOrigin}/og/og-home.jpg`,
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Môj Chatbot — pripravené dopyty priamo z webu" },
      {
        name: "twitter:description",
        content: "Chatboty, kalkulačky a konfigurátory, ktoré pripravia použiteľný dopyt.",
      },
      {
        name: "twitter:image",
        content: `${publicOrigin}/og/og-home.jpg`,
      },
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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://danielvendzur-code.github.io" },
      {
        rel: "preload",
        href: interTightLatinExt,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: interTightLatin,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400..800&display=swap",
      },
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
