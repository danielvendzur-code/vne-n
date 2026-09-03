import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { AnalyticsConsent } from "./AnalyticsConsent";
import { Breadcrumbs } from "./Breadcrumbs";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { PageRevealController } from "./PageRevealController";
import "./Rebrand.css";
import "./RebrandPages.css";
import "./SubpagePolish.css";
import "./RequestedAugustPolish.css";
import "./FinalMobileAudit.css";
import "./FinalUxAuthority.css";
import "./UserFollowupSep01.css";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

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
        <AnalyticsConsent />
        <Footer />
      </div>
    </MotionConfig>
  );
}
