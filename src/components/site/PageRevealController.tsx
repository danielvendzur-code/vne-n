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
  const isSolution = element.matches(".hybrid-tool");
  const isFeatureGroup = element.matches(
    ".outcome-comparison__group, .hybrid-price__grid > *, .hybrid-final__body > *",
  );
  const verticalDistance = isSolution ? 24 : isRow ? 16 : 12;

  return {
    opacity: isHeading ? 0.3 : isSolution ? 0.18 : isRow ? 0.4 : 0.52,
    transform: isFeatureGroup
      ? `translate3d(0, ${verticalDistance}px, 0) scale(0.994)`
      : `translate3d(0, ${verticalDistance}px, 0)`,
    duration: isHeading ? 780 : isSolution ? 760 : isRow ? 700 : 650,
  };
};

const revealDelay = (element: HTMLElement) => {
  if (element.matches(".hybrid-tool")) {
    return Math.max(0, Array.from(element.parentElement?.children ?? []).indexOf(element)) * 70;
  }
  if (element.matches(".outcome-comparison__group")) {
    return Math.max(0, Array.from(element.parentElement?.children ?? []).indexOf(element)) * 110;
  }
  if (element.matches(".outcome-comparison__group li")) {
    return Math.max(0, Array.from(element.parentElement?.children ?? []).indexOf(element)) * 55;
  }
  return 0;
};

/** Calm desktop entrances. Mobile stays static to keep touch scrolling cheap. */
export function PageRevealController({ pathname }: { pathname: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".page-transition");
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileViewport = window.matchMedia("(max-width: 720px)").matches;
    const supportsReveal =
      !mobileViewport &&
      !reducedMotion &&
      typeof IntersectionObserver !== "undefined" &&
      typeof Element.prototype.animate === "function";

    if (!supportsReveal) return undefined;

    const viewportHeight = window.innerHeight;
    const candidates = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_TARGETS)).filter(
      (element) => {
        if (element.closest('[aria-hidden="true"]') || element.getAttribute("aria-hidden") === "true") {
          return false;
        }

        const rect = element.getBoundingClientRect();
        return rect.top > viewportHeight * 0.9;
      },
    );

    if (candidates.length === 0) return undefined;

    const animations = new Set<Animation>();
    const states = new Map(candidates.map((element) => [element, revealState(element)]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          observer.unobserve(element);

          const state = states.get(element) ?? revealState(element);
          const animation = element.animate(
            [
              { opacity: state.opacity, transform: state.transform },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ],
            {
              duration: state.duration,
              delay: revealDelay(element),
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
      {
        threshold: 0,
        rootMargin: "0px 0px 12% 0px",
      },
    );

    candidates.forEach((element) => {
      element.dataset.motionReveal = "staged";
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      candidates.forEach((element) => delete element.dataset.motionReveal);
    };
  }, [pathname]);

  return null;
}
