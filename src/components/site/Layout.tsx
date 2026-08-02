import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { useSpotlight } from "@/hooks/useSpotlight";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { SiteMotionEnhancements } from "./SiteMotionEnhancements";
import "./SitePolish.css";
import "./MineralTheme.css";
import "./MineralThemePolish.css";
import "./WidgetMineral.css";
import "./LiquidChipPolish.css";
import "./UnifiedExperience.css";
import "./NativeWidgetPreview.css";
import "./MobileVerticalPolish.css";
import "./MobileVerticalFinal.css";
import "./MobileStoryBrandFix.css";
import "./RequestedPolish.css";
import "./RequestedPolishFinal.css";
import "./WidgetSelectionFix.css";
import "./CompetitionSystem.css";
import "./CompetitionRoutes.css";
import "./BlackBlueFinal.css";
import "./RecoveredMotionFinal.css";
import "./ProfessionalChipFinal.css";
import "./AppleLiquidSystemFinal.css";
import "./WebsiteRefinementFinal.css";
import "./WebsiteRequestFinish.css";
import "./OwnerFriendlyPolish.css";
import "./CompetitionWinnerFinal.css";
import "./TasteSystemFinal.css";
import "./ApprovedInteractionsFinal.css";
import "./MatteUiFinal.css";
import "./FinalUserCorrection.css";
import "./BrandSystemFinal.css";
import "@/components/site/MobileControlPolish.css";
import "./ClientLandingFinal.css";
import "./SiteFinish.css";
import "./MobileTimelineRepair.css";
import "./TeamMotionUpgrade.css";
import "./WhiteGreenIdentityLock.css";
import "./ApprovedOptionOneFinal.css";
import "./ProfessionalHarmonyFinal.css";
import "./HeroMotionSafety.css";
import "./SecondHalfPremiumFinal.css";
import "./SecondHalfCorrectionsFinal.css";
import "./SecondHalfVisualQAFinal.css";
import "./SecondHalfIconLock.css";
import "./LimeWhiteBrandFinal.css";
// Final authority: removes the remaining warm accent, restores tactile
// interaction states and adds the restrained paper texture.
import "@/components/site/GreenTextureInteractionsFinal.css";

const SPOTLIGHT_SURFACES = [
  ".lp-assistant-card",
  ".lp-hero-cta--secondary",
  ".lp-comparison",
  ".lp-comparison-body",
  ".lp-caps-row",
  ".lp-caps-row-head",
  ".lp-caps-detail",
  ".lp-project > a",
  ".lp-faq-item",
  ".lp-tl-card",
  ".lp-final-card",
  ".lp-live-tools a",
  ".sp-project-card > a",
  ".sp-detail-block",
  ".sp-cta",
  ".rz-card",
  ".rz-tools-list a",
  ".contact-card",
  ".contact-expect",
].join(", ");

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const mainRef = useSpotlight<HTMLElement>(SPOTLIGHT_SURFACES);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="site-theme-white-green min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--background)" }}
      >
        <SiteMotionEnhancements key={`motion-${pathname}`} />
        <a className="skip-link" href="#main-content">
          Preskočiť na obsah
        </a>
        <Nav />
        <main id="main-content" className="relative flex-1 overflow-x-clip" ref={mainRef}>
          <div key={pathname} className="page-transition" style={{ width: "100%" }}>
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
