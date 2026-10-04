import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { AnalyticsConsent } from "./AnalyticsConsent";
import { Breadcrumbs } from "./Breadcrumbs";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { PageRevealController } from "./PageRevealController";
import { SiteInteractions } from "./SiteInteractions";
import "./SiteVisualAuthority.css";

export default function LegacySiteLayout({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="site-theme-white-green min-h-screen flex flex-col">
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
        <SiteInteractions />
        <AnalyticsConsent />
        <Footer />
      </div>
    </MotionConfig>
  );
}
