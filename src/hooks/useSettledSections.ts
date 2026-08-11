import { useEffect } from "react";

/**
 * Sekcie, ktoré sa do prvého zobrazenia nerozkladajú.
 *
 * `content-visibility: auto` ušetrí pri načítaní ~400 ms práce hlavného vlákna,
 * lebo prehliadač nerozkladá to, čo je hlboko pod ohybom. Má to však druhú
 * stranu: sekcia sa preskočí zakaždým, keď z obrazovky odíde, a pri rýchlom
 * scrollovaní späť hore sa ich niekoľko naraz rozkladá odznova. V meraní to na
 * mobile stálo tri dlhé úlohy a najhoršiu snímku 136 ms — presne to, čo pri
 * zotrvačnom scrollovaní vyzerá ako poskakujúca a miznúca hlavička.
 *
 * Úspora sa pritom týka len prvého načítania. Akonáhle čitateľ sekciu raz
 * uvidí, niet dôvodu ju ďalej preskakovať — od tej chvíle ostáva vykreslená
 * a cesta späť hore je plynulá.
 */
const SETTLE_SELECTOR = ".lp-portfolio, .lp-caps, .lp-faq, .lp-process";

export function useSettledSections(dependency?: string): void {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>(SETTLE_SELECTOR));
    if (!sections.length) return;

    const settle = (section: HTMLElement) => {
      section.dataset.settled = "true";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          settle(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      // Rovnaká rezerva, akú si na rozklad berie samo `content-visibility` —
      // sekcia sa tak uvoľní v tej chvíli, keď sa aj tak už kreslí, a nikdy
      // to nespôsobí posun obsahu.
      { rootMargin: "60% 0px" },
    );

    for (const section of sections) {
      if (section.dataset.settled === "true") continue;
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [dependency]);
}
