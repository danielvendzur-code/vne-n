import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { AnalyticsConsent } from "./AnalyticsConsent";
import { Breadcrumbs } from "./Breadcrumbs";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { PageRevealController } from "./PageRevealController";
import { userRequestedSep14Css } from "./UserRequestedSep14";
import "./SiteVisualAuthority.css";

const navRefinement = `
html:root body .site-theme-white-green.site-theme-white-green .site-header.site-header .site-nav.site-nav.site-nav a::before,
html:root body .site-theme-white-green.site-theme-white-green .site-header.site-header .site-nav.site-nav.site-nav a::after,
html:root body .site-theme-white-green.site-theme-white-green .site-header.site-header[data-adaptive="true"] .site-nav.site-nav.site-nav a::before,
html:root body .site-theme-white-green.site-theme-white-green .site-header.site-header[data-adaptive="true"] .site-nav.site-nav.site-nav a::after {
  content: none !important;
  display: none !important;
}
body .site-header .site-nav a {
  margin-inline: -0.55rem !important;
  padding-inline: 0.55rem !important;
  border-radius: 999px !important;
  transition: background-color var(--duration-fast) ease, color var(--duration-fast) ease, transform var(--duration-fast) ease !important;
}
body .site-header .site-nav a:hover,
body .site-header .site-nav a:focus-visible {
  background: rgba(200, 240, 106, 0.32) !important;
  color: #071b15 !important;
  transform: translateY(-1px);
}
body:has(.hybrid-home) .site-header .site-nav a:hover,
body:has(.hybrid-home) .site-header .site-nav a:focus-visible {
  background: #c8f06a !important;
  color: #071b15 !important;
}

/* Keep the contact headline, but let the actual form enter the first viewport
   immediately. The previous hero spent too much vertical space above it. */
.contact-page--rebrand > .sp-hero {
  min-height: 0 !important;
  padding: clamp(1rem, 1.8vw, 1.6rem) 0 0.25rem !important;
}
.contact-page--rebrand > .sp-hero .container-page {
  gap: 0.55rem !important;
}
.contact-page--rebrand > .sp-hero .sp-hero-lead {
  display: none !important;
}
.contact-page--rebrand > .sp-hero h1 {
  max-width: 11.5ch !important;
  margin: 0 !important;
  font-size: clamp(3.45rem, 5.1vw, 5.5rem) !important;
  line-height: 0.88 !important;
}
.contact-page--rebrand > .contact-section {
  padding-top: 0.35rem !important;
}

@media (max-width: 720px) {
  .contact-page--rebrand > .sp-hero {
    padding-top: 0.9rem !important;
    padding-bottom: 0.2rem !important;
  }
  .contact-page--rebrand > .sp-hero h1 {
    max-width: 10ch !important;
    font-size: clamp(2.8rem, 12.8vw, 3.95rem) !important;
  }
  .contact-page--rebrand > .contact-section {
    padding-top: 0.25rem !important;
  }
}
`;

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-theme-white-green min-h-screen flex flex-col">
        <style data-nav-refinement>{navRefinement}</style>
        <style data-sep14-refinement>{userRequestedSep14Css}</style>
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
