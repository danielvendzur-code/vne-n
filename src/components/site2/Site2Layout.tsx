import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { BrandIntro } from "@/components/site/BrandIntro";
import { Footer2 } from "./Footer2";
import { Nav2 } from "./Nav2";
import "./tokens.css";
/* Musí prísť po tokenoch: neutralizuje globálne pravidlá starého webu,
   ktoré Vite načíta do balíka aj na tejto route. Dôvod je v súbore. */
import "./legacy-isolation.css";

/**
 * Shell nového webu.
 *
 * Vedomé rozhodnutie: tento layout **neimportuje ani jednu** zo 78 CSS
 * vrstiev v `src/components/site/`. Route, ktorá ho používa, obchádza
 * `SiteLayout` v `src/routes/__root.tsx`, takže sa sem nedostane ani
 * jeden z 9 270 `!important` starého webu. To je celý dôvod, prečo je
 * na novom dizajne konečne vidieť, že je nový.
 *
 * Jediné, čo si berieme zo starého sveta, je `BrandIntro` — tá už bola
 * postavená izolovane a na staré vrstvy sa neviaže.
 *
 * Pozor: obídenie `SiteLayout` zastaví triedy v DOM, nie bundlovanie
 * CSS — Vite zloží štýly celého modulového grafu do jedného balíka.
 * Zvyšok rieši `legacy-isolation.css`.
 */
export function Site2Layout({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="mc2">
        <BrandIntro />
        <a className="mc2-skip" href="#obsah">
          Preskočiť na obsah
        </a>
        <Nav2 />
        <main id="obsah">{children}</main>
        <Footer2 />
      </div>
    </MotionConfig>
  );
}
