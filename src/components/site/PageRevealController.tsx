import { useEffect } from "react";

const REVEAL_TARGETS = [
  ".kage-home .hybrid-tools__intro > *",
  ".kage-home .hybrid-tool",
  ".kage-home .hybrid-work__intro > *",
  ".kage-home .hybrid-manifesto__inner > *",
  ".kage-home .hybrid-process__intro > *",
  ".kage-home .hybrid-process__list > li",
  ".kage-home .hybrid-price__top > *",
  ".kage-home .hybrid-price__grid > *",
  ".kage-home .hybrid-final__body > *",
  ".sp-page .sp-hero .container-page > *",
  ".sp-page .sp-section .container-page > *",
  ".sp-page .pricing-bridge .container-page > *",
  ".contact-page .sp-hero .container-page > *",
  ".contact-page .contact-editorial-aside > *",
  ".contact-page .contact-form-wrap > .section-kicker",
  ".contact-page .contact-form > *",
  ".cookies-page .cookies-card",
  ".privacy-page .cookies-card",
].join(",");

/** Adds restrained, compositor-only entrances with direction based on layout. */
export function PageRevealController({ pathname }: { pathname: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".page-transition");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const candidates = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_TARGETS)).filter(
      (element) =>
        !element.closest("[data-motion-reveal]") &&
        !element.closest('[aria-hidden="true"]') &&
        element.getAttribute("aria-hidden") !== "true",
    );

    if (candidates.length === 0) return;

    if (
      reducedMotion ||
      typeof IntersectionObserver === "undefined" ||
      typeof Element.prototype.animate !== "function"
    )
      return;

    const animations = new Set<Animation>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);

          const index = candidates.indexOf(element);
          const rect = element.getBoundingClientRect();
          const centre = rect.left + rect.width / 2;
          const direction =
            rect.width > window.innerWidth * 0.72
              ? index % 2
                ? 1
                : -1
              : centre < window.innerWidth / 2
                ? -1
                : 1;
          const distance = window.innerWidth <= 720 ? 18 : 48;
          const isHeading = /^H[1-3]$/.test(element.tagName);
          const isRow = element.matches("li, .hybrid-tool");
          const startTransform = isRow
            ? `translate3d(${direction * distance}px, 18px, 0)`
            : `translate3d(${direction * distance}px, ${isHeading ? 12 : 0}px, 0)`;
          const animation = element.animate(
            [
              { opacity: isHeading ? 0.08 : 0.28, transform: startTransform },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ],
            {
              duration: isHeading ? 1040 : 900,
              delay: (index % 4) * 62,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "both",
            },
          );
          animations.add(animation);
          void animation.finished
            .then(() => {
              animation.cancel();
              animations.delete(animation);
            })
            .catch(() => undefined);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -9% 0px" },
    );

    candidates.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  return null;
}
