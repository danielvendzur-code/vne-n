import type { ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

const premiumEase = [0.16, 1, 0.3, 1] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Persistent site chrome with a keyed route surface. Keeping the navigation and
 * footer outside AnimatePresence avoids duplicate headers while a route exits.
 */
export function SiteShell({ children, routeKey }: { children: ReactNode; routeKey: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
        <a className="skip-link" href="#main-content">
          Preskočiť na obsah
        </a>
        <Nav />
        <AnimatePresence initial={false} mode="wait">
          <motion.main
            key={routeKey}
            id="main-content"
            className="flex-1 overflow-x-clip"
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.25,
                    ease: premiumEase,
                  }
            }
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </MotionConfig>
  );
}
