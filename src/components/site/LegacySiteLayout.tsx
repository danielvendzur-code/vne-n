import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Header } from "./redesign/Header";
import { Footer } from "./Footer";
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
        <div className="redesign-header">
          <Header
            active={
              pathname.startsWith("/projekty")
                ? "realizacie"
                : pathname === "/kontakt"
                  ? "kontakt"
                  : ""
            }
          />
        </div>
        <main id="main-content" className="relative flex-1">
          <Breadcrumbs />
          <div key={pathname} className="page-transition">
            {children}
          </div>
        </main>
        <SiteInteractions />
        <Footer />
      </div>
    </MotionConfig>
  );
}
