import { useEffect } from "react";

const REVEAL_TARGETS = [
  ".kage-home .hybrid-tools__intro > *",
  ".kage-home .hybrid-tool",
  ".kage-home .hybrid-work__intro > *",
  ".kage-home .hybrid-work__grid > article",
  ".kage-home .hybrid-work__footer",
  ".kage-home .hybrid-manifesto__inner > *",
  ".kage-home .outcome-comparison__intro > *",
  ".kage-home .outcome-comparison__group",
  ".kage-home .outcome-comparison__group li",
  ".kage-home .hybrid-process__intro > *",
  ".kage-home .hybrid-process__list > li",
  ".kage-home .hybrid-price__top > *",
  ".kage-home .hybrid-price__grid > *",
  ".kage-home .hybrid-final__top > *",
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

const revealState = (element: HTMLElement) => {
  const isHeading = /^H[1-3]$/.test(element.tagName);
  const isRow = element.matches("li, article, .hybrid-tool");
  const isFeatureGroup = element.matches(
    ".outcome-comparison__group, .hybrid-price__grid > *, .hybrid-final__body > *",
  );
  const verticalDistance = window.innerWidth <= 720 ? 14 : isRow ? 22 : 17;

  return {
    opacity: isHeading ? 0.12 : isRow ? 0.2 : 0.3,
    transform: isFeatureGroup
      ? `translate3d(0, ${verticalDistance}px, 0) scale(0.988)`
      : `translate3d(0, ${verticalDistance}px, 0)`,
    duration: isHeading ? 1040 : isRow ? 880 : 820,
  };
};

/** Adds calm, compositor-only entrances without mutating still-hydrating DOM. */
export function PageRevealController({ pathname }: { pathname: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".page-transition");
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsReveal =
      !reducedMotion &&
      typeof IntersectionObserver !== "undefined" &&
      typeof Element.prototype.animate === "function";

    if (!supportsReveal) return undefined;

    const candidates = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_TARGETS)).filter(
      (element) =>
        !element.closest('[aria-hidden="true"]') && element.getAttribute("aria-hidden") !== "true",
    );

    if (candidates.length === 0) return undefined;

    const animations = new Set<Animation>();
    const states = new Map(candidates.map((element) => [element, revealState(element)]));
    const indices = new Map(candidates.map((element, index) => [element, index]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          observer.unobserve(element);

          const state = states.get(element) ?? revealState(element);
          const index = indices.get(element) ?? 0;
          const animation = element.animate(
            [
              { opacity: state.opacity, transform: state.transform },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ],
            {
              duration: state.duration,
              delay: (index % 5) * 72,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "none",
            },
          );

          animations.add(animation);
          void animation.finished
            .then(() => {
              animations.delete(animation);
            })
            .catch(() => {
              animations.delete(animation);
            });
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -9% 0px" },
    );

    candidates.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
  }, [pathname]);

  return null;
}
