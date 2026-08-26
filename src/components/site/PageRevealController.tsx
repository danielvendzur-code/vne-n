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

const revealState = (element: HTMLElement, index: number) => {
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

/** Adds calm, compositor-only entrances without pulling whole sections sideways. */
export function PageRevealController({ pathname }: { pathname: string }) {
  useEffect(() => {
    let dispose = () => undefined;

    // A streamed route can finish hydrating after the parent layout effect.
    // Deferring the DOM staging avoids mutating a still-hydrating boundary.
    const startTimer = window.setTimeout(() => {
      const root = document.querySelector<HTMLElement>(".page-transition");
      if (!root) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const candidates = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_TARGETS)).filter(
        (element) =>
          !element.closest("[data-motion-reveal]") &&
          !element.closest('[aria-hidden="true"]') &&
          element.getAttribute("aria-hidden") !== "true",
      );

      if (
        candidates.length === 0 ||
        reducedMotion ||
        typeof IntersectionObserver === "undefined" ||
        typeof Element.prototype.animate !== "function"
      )
        return;

      const animations = new Set<Animation>();
      const states = new Map<HTMLElement, ReturnType<typeof revealState>>();

      candidates.forEach((element, index) => {
        const state = revealState(element, index);
        states.set(element, state);
        element.dataset.motionReveal = "staged";
        element.style.opacity = String(state.opacity);
        element.style.transform = state.transform;
        element.style.willChange = "opacity, transform";
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            observer.unobserve(element);

            const index = candidates.indexOf(element);
            const state = states.get(element) ?? revealState(element, index);
            const animation = element.animate(
              [
                { opacity: state.opacity, transform: state.transform },
                { opacity: 1, transform: "translate3d(0, 0, 0)" },
              ],
              {
                duration: state.duration,
                delay: (index % 5) * 72,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                fill: "both",
              },
            );
            animations.add(animation);
            void animation.finished
              .then(() => {
                animation.cancel();
                animations.delete(animation);
                element.style.removeProperty("opacity");
                element.style.removeProperty("transform");
                element.style.removeProperty("will-change");
                element.dataset.motionReveal = "complete";
              })
              .catch(() => undefined);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -9% 0px" },
      );

      candidates.forEach((element) => observer.observe(element));

      dispose = () => {
        observer.disconnect();
        animations.forEach((animation) => animation.cancel());
        candidates.forEach((element) => {
          element.style.removeProperty("opacity");
          element.style.removeProperty("transform");
          element.style.removeProperty("will-change");
          delete element.dataset.motionReveal;
        });
      };
    }, 120);

    return () => {
      window.clearTimeout(startTimer);
      dispose();
    };
  }, [pathname]);

  return null;
}
