import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { AnalyticsConsent } from "./AnalyticsConsent";
import { Breadcrumbs } from "./Breadcrumbs";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { PageRevealController } from "./PageRevealController";
import "./SiteVisualAuthority.css";

const navRefinement = `
.site-nav a::after { display: none !important; }
.site-nav a { transition: color var(--duration-fast) ease, opacity var(--duration-fast) ease; }
.site-nav a:hover, .site-nav a:focus-visible { color: var(--forest); }
`;

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-theme-white-green min-h-screen flex flex-col">
        <style data-nav-refinement>{navRefinement}</style>
        <a className="skip-link" href="#main-content">
          Preskočiť na obsah
        </a>
        <Nav />
        <main id="main-content" className="relative flex-1">
          <Breadcrumbs />
          <div key={pathname} className="page-transition">
            {children}
          </div>
          <PageRevealController pathname={pathname} />
        </main>
        <AnalyticsConsent />
        <Footer />
      </div>
    </MotionConfig>
  );
}
