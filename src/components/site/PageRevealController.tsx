import { useLayoutEffect } from "react";

const REVEAL_TARGETS = [
  ".kage-home .hybrid-tools__intro > *",
  ".kage-home .hybrid-tool",
  ".kage-home .hybrid-work__intro > *",
  ".kage-home .hybrid-work__grid > article",
  ".kage-home .hybrid-work__footer",
  ".kage-home .hybrid-manifesto__inner > .section-index",
  ".kage-home .hybrid-manifesto__inner h2 em",
  ".kage-home .kage-flow-story__header > *",
  ".kage-home .kage-flow__step",
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

type RevealState = {
  opacity: number;
  transform: string;
  duration: number;
};

type RevealPass = {
  animation: Animation | null;
  staged: boolean;
  done: boolean;
};

const siblingIndex = (element: HTMLElement) =>
  Math.max(0, Array.from(element.parentElement?.children ?? []).indexOf(element));

const revealState = (element: HTMLElement, compactViewport: boolean): RevealState => {
  const index = siblingIndex(element);
  const direction = index % 2 === 0 ? -1 : 1;
  const isHeading = /^H[1-3]$/.test(element.tagName);
  const isProject = element.matches(".hybrid-work__grid > article");
  const isProcess = element.matches(".hybrid-process__list > li");
  const isSolution = element.matches(".hybrid-tool");
  const isManifestoAccent = element.matches(".hybrid-manifesto__inner h2 em");
  const isOutcomeRow = element.matches(".outcome-comparison__group li, .kage-flow__step");
  const isFeatureGroup = element.matches(
    ".outcome-comparison__group, .hybrid-price__grid > *, .hybrid-final__body > *",
  );
  const isRow = element.matches("li, article, .hybrid-tool");

  if (isManifestoAccent) {
    return {
      opacity: compactViewport ? 0.14 : 0.08,
      transform: `translate3d(0, ${compactViewport ? 6 : 9}px, 0)`,
      duration: compactViewport ? 460 : 520,
    };
  }

  if (isProject) {
    return {
      opacity: compactViewport ? 0.12 : 0.07,
      transform: `translate3d(0, ${compactViewport ? 22 : 32}px, 0) scale(${compactViewport ? 0.986 : 0.98})`,
      duration: compactViewport ? 760 : 840,
    };
  }

  if (isSolution) {
    const x = direction * (compactViewport ? 16 : 26);
    return {
      opacity: compactViewport ? 0.28 : 0.2,
      transform: `translate3d(${x}px, ${compactViewport ? 4 : 6}px, 0) scale(0.996)`,
      duration: compactViewport ? 620 : 700,
    };
  }

  if (isProcess) {
    const x = direction * (compactViewport ? 18 : 28);
    return {
      opacity: compactViewport ? 0.34 : 0.24,
      transform: `translate3d(${x}px, 0, 0)`,
      duration: compactViewport ? 580 : 650,
    };
  }

  if (isOutcomeRow) {
    const x = direction * (compactViewport ? 14 : 20);
    return {
      opacity: compactViewport ? 0.38 : 0.28,
      transform: `translate3d(${x}px, 0, 0)`,
      duration: compactViewport ? 560 : 620,
    };
  }

  if (isFeatureGroup) {
    return {
      opacity: compactViewport ? 0.2 : 0.12,
      transform: `translate3d(0, ${compactViewport ? 12 : 18}px, 0) scale(${compactViewport ? 0.988 : 0.982})`,
      duration: compactViewport ? 650 : 720,
    };
  }

  const verticalDistance = compactViewport ? (isRow ? 12 : 9) : isRow ? 18 : 14;

  return {
    opacity: compactViewport ? (isHeading ? 0.32 : isRow ? 0.4 : 0.5) : isHeading ? 0.22 : 0.32,
    transform: `translate3d(0, ${verticalDistance}px, 0)`,
    duration: compactViewport ? (isHeading ? 520 : 570) : isHeading ? 600 : 650,
  };
};

/** Stage only below-viewport content during layout, before the browser paints.
 * In-view content is never hidden after being shown. Every reveal plays once.
 */
export function PageRevealController({ pathname }: { pathname: string }) {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".page-transition");
    if (!root) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined" ||
      typeof Element.prototype.animate !== "function"
    ) {
      return;
    }

    const compactViewport = window.matchMedia("(max-width: 720px)").matches;
    const candidates = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_TARGETS)).filter(
      (element) =>
        !element.closest('[aria-hidden="true"]') && element.getAttribute("aria-hidden") !== "true",
    );
    const passes = new Map<HTMLElement, RevealPass>();
    const animations = new Set<Animation>();

    // One geometry pass before paint: do not let the observer hide
    // content that the user already saw on the first frame.
    candidates.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const offscreenBelow = rect.top >= window.innerHeight - 8;
      const pass: RevealPass = {
        animation: null,
        staged: offscreenBelow,
        done: !offscreenBelow,
      };
      passes.set(element, pass);
      if (offscreenBelow) {
        const state = revealState(element, compactViewport);
        element.style.opacity = String(state.opacity);
        element.style.transform = state.transform;
        element.dataset.motionReveal = "staged";
      } else {
        element.dataset.motionReveal = "shown";
      }
    });

    const release = (element: HTMLElement, pass: RevealPass) => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
      element.dataset.motionReveal = "shown";
      pass.staged = false;
      pass.done = true;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          const pass = passes.get(element);
          if (!pass || pass.done || !pass.staged) continue;
          const state = revealState(element, compactViewport);
          const animation = element.animate(
            [
              { opacity: state.opacity, transform: state.transform },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: Math.min(state.duration, compactViewport ? 450 : 520),
              delay: 0,
              easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
              fill: "both",
            },
          );
          pass.animation = animation;
          animations.add(animation);
          void animation.finished.then(
            () => {
              animations.delete(animation);
              if (pass.animation !== animation) return;
              release(element, pass);
              animation.cancel();
              pass.animation = null;
            },
            () => {
              animations.delete(animation);
            },
          );
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12px 0px" },
    );

    passes.forEach((pass, element) => {
      if (pass.staged) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      passes.forEach((pass, element) => {
        if (pass.staged) release(element, pass);
        delete element.dataset.motionReveal;
      });
    };
  }, [pathname]);

  return null;
}
