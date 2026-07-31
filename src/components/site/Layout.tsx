import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { CookieConsent } from "./CookieConsent";
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
import "./HomeConversionUpgrade.css";
import "./OwnerFriendlyPolish.css";
import "./CompetitionWinnerFinal.css";
import "./TasteSystemFinal.css";
import "./ApprovedInteractionsFinal.css";
import "./MatteUiFinal.css";
import "./FinalUserCorrection.css";
import "./BrandSystemFinal.css";
import "@/components/site/MobileControlPolish.css";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
        <SiteMotionEnhancements key={`motion-${pathname}`} />
        <CookieConsent />
        <a className="skip-link" href="#main-content">
          Preskočiť na obsah
        </a>
        <Nav />
        <main id="main-content" className="relative flex-1 overflow-x-clip">
          {/*
            Prechod medzi stránkami rieši CSS animácia na kľúčovanom divi.

            Predtým tu bol obal AnimatePresence v režime popLayout a v ňom
            motion.div s `initial={false}`. Lenže `initial={false}` sa
            v motion dedí po celom strome pod sebou a potomkom vypne
            počiatočný stav. Kvôli tomu na celom webe ticho nefungovalo
            ani jedno odhaľovanie pri scrollovaní (whileInView) — nadpisy
            aj karty naskočili rovno viditeľné. Za 0,25 s prelnutie medzi
            stránkami to bola privysoká cena, tak je prechod v CSS.

            Animuje sa výhradne priehľadnosť. `transform` by z obalu
            urobil containing block pre position: fixed, čo by na tých
            pár stoviek milisekúnd rozhádzalo zrno na pozadí aj bublinu
            chatbota.
          */}
          <div key={pathname} className="page-transition" style={{ width: "100%" }}>
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
