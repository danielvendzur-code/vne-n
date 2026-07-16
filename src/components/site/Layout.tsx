import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
        <a className="skip-link" href="#main-content">
          Preskočiť na obsah
        </a>
        <Nav />
        <main id="main-content" className="flex-1 overflow-x-clip">
          {children}
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
