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
.site-nav a {
  margin-inline: -0.55rem;
  padding-inline: 0.55rem;
  border-radius: 999px;
  transition: background-color var(--duration-fast) ease, color var(--duration-fast) ease, transform var(--duration-fast) ease;
}
.site-nav a:hover,
.site-nav a:focus-visible {
  background: rgba(200, 240, 106, 0.24);
  color: #071b15 !important;
  transform: translateY(-1px);
}
body:has(.hybrid-home) .site-nav a:hover,
body:has(.hybrid-home) .site-nav a:focus-visible {
  background: #c8f06a;
  color: #071b15 !important;
}

/* The contact page should show the actual form in the first viewport instead of
   spending the opening screen on explanatory copy. */
.contact-page--rebrand > .sp-hero {
  min-height: 0 !important;
  padding: clamp(2.4rem, 4vw, 3.8rem) 0 clamp(1rem, 1.8vw, 1.6rem) !important;
}
.contact-page--rebrand > .sp-hero .container-page {
  gap: 0.8rem !important;
}
.contact-page--rebrand > .sp-hero .sp-hero-lead {
  display: none !important;
}
.contact-page--rebrand > .sp-hero h1 {
  max-width: 11ch !important;
  margin: 0 !important;
  font-size: clamp(3.5rem, 6vw, 6.5rem) !important;
  line-height: 0.9 !important;
}
.contact-page--rebrand > .contact-section {
  padding-top: clamp(1rem, 2vw, 1.75rem) !important;
}

@media (max-width: 720px) {
  .contact-page--rebrand > .sp-hero {
    padding-top: 1.6rem !important;
    padding-bottom: 0.8rem !important;
  }
  .contact-page--rebrand > .sp-hero h1 {
    max-width: 10ch !important;
    font-size: clamp(3rem, 14vw, 4.25rem) !important;
  }
  .contact-page--rebrand > .contact-section {
    padding-top: 0.7rem !important;
  }
}
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
