import { useEffect } from "react";

const REVEAL_TARGETS = [
  ".kage-home .hybrid-tools__intro > *",
  ".kage-home .hybrid-tool",
  ".kage-home .hybrid-work__intro > *",
  ".kage-home .hybrid-work__grid > article",
  ".kage-home .hybrid-work__footer",
  ".kage-home .hybrid-manifesto__inner > .section-index",
  ".kage-home .hybrid-manifesto__inner h2 em",
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

type RevealPass = {
  down: number;
  up: number;
  inside: boolean;
};

const siblingIndex = (element: HTMLElement) =>
  Math.max(0, Array.from(element.parentElement?.children ?? []).indexOf(element));

const revealState = (element: HTMLElement, compactViewport: boolean) => {
  const isHeading = /^H[1-3]$/.test(element.tagName);
  const isProject = element.matches(".hybrid-work__grid > article");
  const isProcess = element.matches(".hybrid-process__list > li");
  const isSolution = element.matches(".hybrid-tool");
  const isManifestoAccent = element.matches(".hybrid-manifesto__inner h2 em");
  const isFeatureGroup = element.matches(
    ".outcome-comparison__group, .hybrid-price__grid > *, .hybrid-final__body > *",
  );
  const isRow = element.matches("li, article, .hybrid-tool");

  if (isManifestoAccent) {
    return {
      opacity: compactViewport ? 0.42 : 0.24,
      transform: `translate3d(0, ${compactViewport ? 6 : 9}px, 0)`,
      duration: compactViewport ? 320 : 380,
    };
  }

  const verticalDistance = compactViewport
    ? isProject
      ? 28
      : isSolution
        ? 22
        : isProcess
          ? 19
          : isRow
            ? 15
            : 10
    : isProject
      ? 44
      : isSolution
        ? 34
        : isProcess
          ? 29
          : isRow
            ? 22
            : 16;

  return {
    opacity: compactViewport
      ? isProject
        ? 0.3
        : isHeading
          ? 0.42
          : isSolution
            ? 0.3
            : isRow
              ? 0.46
              : 0.58
      : isProject
        ? 0.14
        : isHeading
          ? 0.28
          : isSolution
            ? 0.18
            : isRow
              ? 0.36
              : 0.52,
    transform: isFeatureGroup || isProject
      ? `translate3d(0, ${verticalDistance}px, 0) scale(${isProject ? 0.982 : 0.994})`
      : `translate3d(0, ${verticalDistance}px, 0)`,
    duration: compactViewport
      ? isProject
        ? 620
        : isHeading
          ? 540
          : isSolution
            ? 590
            : isRow
              ? 520
              : 470
      : isProject
        ? 760
        : isHeading
          ? 650
          : isSolution
            ? 700
            : isRow
              ? 610
              : 550,
  };
};

const revealDelay = (element: HTMLElement, compactViewport: boolean) => {
  const delayScale = compactViewport ? 0.65 : 1;

  if (element.matches(".hybrid-work__grid > article")) {
    return siblingIndex(element) * 90 * delayScale;
  }
  if (element.matches(".hybrid-tool")) {
    return siblingIndex(element) * 65 * delayScale;
  }
  if (element.matches(".hybrid-process__list > li")) {
    return siblingIndex(element) * 70 * delayScale;
  }
  if (element.matches(".outcome-comparison__group")) {
    return siblingIndex(element) * 100 * delayScale;
  }
  if (element.matches(".outcome-comparison__group li")) {
    return siblingIndex(element) * 50 * delayScale;
  }
  if (element.matches(".hybrid-manifesto__inner h2 em")) {
    return siblingIndex(element) * 75 * delayScale;
  }
  return 0;
};

/** Two visible downward passes and restrained upward feedback. */
export function PageRevealController({ pathname }: { pathname: string }) {
  useEffect(() => {
    let removeReveal: (() => void) | undefined;

    const installReveal = () => {
      const root = document.querySelector<HTMLElement>(".page-transition");
      if (!root) return undefined;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobileViewport = window.matchMedia("(max-width: 720px)").matches;
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
      const states = new Map(
        candidates.map((element) => [element, revealState(element, mobileViewport)]),
      );
      const passes = new Map<HTMLElement, RevealPass>(
        candidates.map((element) => [element, { down: 0, up: 0, inside: false }]),
      );
      let lastScrollY = window.scrollY;
      let scrollDirection: "down" | "up" = "down";

      const trackScrollDirection = () => {
        const nextScrollY = window.scrollY;
        if (nextScrollY > lastScrollY + 2) scrollDirection = "down";
        if (nextScrollY < lastScrollY - 2) scrollDirection = "up";
        lastScrollY = nextScrollY;
      };

      const registerAnimation = (animation: Animation) => {
        animations.add(animation);
        void animation.finished
          .then(() => {
            animations.delete(animation);
          })
          .catch(() => {
            animations.delete(animation);
          });
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement;
            const pass = passes.get(element);
            if (!pass) return;

            if (!entry.isIntersecting) {
              pass.inside = false;
              return;
            }
            if (pass.inside) return;
            pass.inside = true;

            if (scrollDirection === "down" && pass.down < 2) {
              const state = states.get(element) ?? revealState(element, mobileViewport);
              const animation = element.animate(
                [
                  { opacity: state.opacity, transform: state.transform },
                  { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
                ],
                {
                  duration: state.duration,
                  delay: pass.down === 0 ? revealDelay(element, mobileViewport) : 0,
                  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                  fill: "none",
                },
              );
              pass.down += 1;
              registerAnimation(animation);
              return;
            }

            if (scrollDirection === "up" && pass.up < 2) {
              const distance = mobileViewport ? 4 : 7;
              const animation = element.animate(
                [
                  {
                    opacity: 0.9,
                    transform: `translate3d(0, -${distance}px, 0) scale(0.997)`,
                  },
                  { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
                ],
                {
                  duration: mobileViewport ? 230 : 290,
                  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                  fill: "none",
                },
              );
              pass.up += 1;
              registerAnimation(animation);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -9% 0px",
        },
      );

      candidates.forEach((element) => {
        element.dataset.motionReveal = "staged";
        observer.observe(element);
      });
      window.addEventListener("scroll", trackScrollDirection, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", trackScrollDirection);
        animations.forEach((animation) => animation.cancel());
        animations.clear();
        candidates.forEach((element) => delete element.dataset.motionReveal);
      };
    };

    const installationTimer = window.setTimeout(() => {
      removeReveal = installReveal();
    }, 120);

    return () => {
      window.clearTimeout(installationTimer);
      removeReveal?.();
    };
  }, [pathname]);

  return null;
}
