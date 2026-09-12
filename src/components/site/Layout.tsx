import type { ReactNode } from "react";
import { AnalyticsConsent } from "./AnalyticsConsent";
import { Breadcrumbs } from "./Breadcrumbs";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import "./SiteVisualAuthority.css";
import "./SubpageHeroUnified.css";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-theme-white-green min-h-screen flex flex-col">
      <a className="skip-link" href="#main-content">
        Preskočiť na obsah
      </a>
      <Nav />
      <main id="main-content" className="relative flex-1">
        <Breadcrumbs />
        <div className="page-transition">{children}</div>
      </main>
      <AnalyticsConsent />
      <Footer />
    </div>
  );
}
