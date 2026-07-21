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
          "radial-gradient(circle at 85% 12%, rgba(123, 203, 227, 0.06), transparent 30rem), radial-gradient(circle at 8% 90%, rgba(95, 145, 181, 0.05), transparent 26rem)",
      }}
    >
      <div className="max-w-md text-center">
        <p
          style={{
            color: "var(--highlight)",
            fontSize: "0.73rem",
            fontWeight: 760,
            letterSpacing: "0.125em",
            textTransform: "uppercase",
          }}
        >
          404 · Stránka neexistuje
        </p>
        <h1
          className="mt-4"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 7vw, 3.4rem)",
            fontWeight: 500,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          Táto adresa nič nezobrazuje.
        </h1>
        <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Odkaz je možno starý alebo v ňom chýba časť adresy. Všetko podstatné nájdete na hlavnej
          stránke.
        </p>
        <a
          href={import.meta.env.BASE_URL}
          className="mt-8 inline-flex items-center justify-center"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            borderRadius: "0.78rem",
            padding: "0.9rem 1.4rem",
            fontSize: "0.9rem",
            fontWeight: 700,
            minHeight: "3.3rem",
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
          Niečo sa pokazilo. Skúste to prosím znova.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Skúsiť znova
          </button>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
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
  jobTitle: "Tvorca webových nástrojov — chatboty, kalkulačky, konfigurátory",
});

const interTightLatinExt =
  "https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsJ8ah8QA.woff2";
const interTightLatin =
  "https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsH8ag.woff2";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Daniel Vendžúr — chatboty a webové nástroje na mieru" },
      {
        name: "description",
        content:
          "Tvorím chatboty, všetky typy kalkulačiek a konfigurátorov — samostatne aj prepojené do jedného riešenia.",
      },
      { name: "author", content: "Daniel Vendžúr" },
      { name: "theme-color", content: "#06131a" },
      { property: "og:site_name", content: "Daniel Vendžúr" },
      { property: "og:locale", content: "sk_SK" },
      { property: "og:title", content: "Daniel Vendžúr — weby, ktoré pracujú" },
      {
        property: "og:description",
        content: "Chatboty, ľubovoľné kalkulačky, konfigurátory a webové realizácie na mieru.",
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
  return (
    <html lang="sk">
      <head>
        <HeadContent />
        <script src="https://danielvendzur-code.github.io/moj.chatbot.backend/widget.js" defer />
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
