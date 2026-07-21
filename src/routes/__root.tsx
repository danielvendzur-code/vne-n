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
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        backgroundColor: "var(--background)",
        backgroundImage:
          "radial-gradient(circle at 82% 12%, rgba(114, 199, 255, 0.1), transparent 30rem), radial-gradient(circle at 8% 90%, rgba(101, 230, 193, 0.07), transparent 26rem)",
      }}
    >
      <div
        className="max-w-lg text-center"
        style={{
          border: "1px solid var(--border)",
          borderRadius: "1.35rem",
          padding: "clamp(1.7rem, 5vw, 3rem)",
          background: "rgba(13, 34, 41, 0.86)",
          boxShadow: "0 30px 90px rgba(0,0,0,.42)",
          backdropFilter: "blur(22px)",
        }}
      >
        <p
          style={{
            color: "var(--accent)",
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
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.35rem, 7vw, 4rem)",
            fontWeight: 520,
            letterSpacing: "-0.06em",
            lineHeight: 0.98,
          }}
        >
          Odkaz sa nenašiel.
        </h1>
        <p
          className="mt-5 text-sm"
          style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}
        >
          Odkaz môže byť starý alebo neúplný. Vráťte sa na úvod a pokračujte cez overenú
          navigáciu.
        </p>
        <a
          href={import.meta.env.BASE_URL}
          className="mt-8 inline-flex min-h-13 items-center justify-center"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "1px solid rgba(255,255,255,.24)",
            borderRadius: "0.9rem",
            padding: "0.9rem 1.45rem",
            fontSize: "0.9rem",
            fontWeight: 800,
            boxShadow: "0 18px 42px rgba(101,230,193,.22)",
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
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Stránka sa nenačítala
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
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
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Skúsiť znova
          </button>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-bold"
            style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}
          >
            Späť na úvod
          </a>
        </div>
      </div>
    </div>
  );
}

const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Daniel Vendžúr",
  email: "mailto:daniel.vendzur@gmail.com",
  url: "https://danielvendzur-code.github.io/vne-n/",
  jobTitle: "Tvorca chatbotov, kalkulačiek a produktových konfigurátorov na mieru",
});

const interTightLatinExt =
  "https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsJ8ah8QA.woff2";
const interTightLatin =
  "https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsH8ag.woff2";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' mailto:",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline' https://danielvendzur-code.github.io https://*.vercel.app",
  "connect-src 'self' https://*.vercel.app",
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
      { title: "Daniel Vendžúr — chatboty na mieru, ktoré pripravujú dopyty" },
      {
        name: "description",
        content:
          "Navrhujem chatboty na mieru — od jednoduchého asistenta po chatbot s kalkulačkou, konfigurátorom alebo rezerváciami.",
      },
      { name: "author", content: "Daniel Vendžúr" },
      { name: "theme-color", content: "#061216" },
      { property: "og:site_name", content: "Daniel Vendžúr" },
      { property: "og:locale", content: "sk_SK" },
      {
        property: "og:title",
        content: "Chatboty na mieru, ktoré odpovedajú a pripravujú použiteľné dopyty",
      },
      {
        property: "og:description",
        content:
          "Chatboty, kalkulačky, konfigurátory a rezervácie prepojené do jedného plynulého riešenia.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://danielvendzur-code.github.io/vne-n/og/og-home.jpg",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://danielvendzur-code.github.io/vne-n/og/og-home.jpg",
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
    scripts: [{ type: "application/ld+json", children: personJsonLd }],
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
    <html lang="sk" data-base-path={basePath} suppressHydrationWarning>
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
