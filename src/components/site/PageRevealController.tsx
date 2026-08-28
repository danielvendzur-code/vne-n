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

type RevealState = {
  opacity: number;
  transform: string;
  filter: string;
  duration: number;
};

type RevealPass = {
  down: number;
  up: number;
  inside: boolean;
  staged: boolean;
  activeAnimation: Animation | null;
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
  const isOutcomeRow = element.matches(".outcome-comparison__group li");
  const isFeatureGroup = element.matches(
    ".outcome-comparison__group, .hybrid-price__grid > *, .hybrid-final__body > *",
  );
  const isRow = element.matches("li, article, .hybrid-tool");

  if (isManifestoAccent) {
    return {
      opacity: compactViewport ? 0.14 : 0.08,
      transform: `translate3d(0, ${compactViewport ? 6 : 9}px, 0)`,
      filter: "blur(1.2px)",
      duration: compactViewport ? 460 : 520,
    };
  }

  if (isProject) {
    return {
      opacity: compactViewport ? 0.12 : 0.07,
      transform: `translate3d(0, ${compactViewport ? 22 : 32}px, 0) scale(${compactViewport ? 0.986 : 0.98})`,
      filter: "blur(1.4px) saturate(0.96)",
      duration: compactViewport ? 760 : 840,
    };
  }

  if (isSolution) {
    const x = direction * (compactViewport ? 16 : 26);
    return {
      opacity: compactViewport ? 0.28 : 0.2,
      transform: `translate3d(${x}px, ${compactViewport ? 4 : 6}px, 0) scale(0.996)`,
      filter: "blur(0.7px)",
      duration: compactViewport ? 620 : 700,
    };
  }

  if (isProcess) {
    const x = direction * (compactViewport ? 18 : 28);
    return {
      opacity: compactViewport ? 0.34 : 0.24,
      transform: `translate3d(${x}px, 0, 0)`,
      filter: "blur(0.45px)",
      duration: compactViewport ? 580 : 650,
    };
  }

  if (isOutcomeRow) {
    const x = direction * (compactViewport ? 14 : 20);
    return {
      opacity: compactViewport ? 0.38 : 0.28,
      transform: `translate3d(${x}px, 0, 0)`,
      filter: "blur(0.45px)",
      duration: compactViewport ? 560 : 620,
    };
  }

  if (isFeatureGroup) {
    return {
      opacity: compactViewport ? 0.2 : 0.12,
      transform: `translate3d(0, ${compactViewport ? 12 : 18}px, 0) scale(${compactViewport ? 0.988 : 0.982})`,
      filter: "blur(0.8px)",
      duration: compactViewport ? 650 : 720,
    };
  }

  const verticalDistance = compactViewport ? (isRow ? 12 : 9) : isRow ? 18 : 14;

  return {
    opacity: compactViewport ? (isHeading ? 0.32 : isRow ? 0.4 : 0.5) : isHeading ? 0.22 : 0.32,
    transform: `translate3d(0, ${verticalDistance}px, 0)`,
    filter: isHeading ? "blur(1px)" : "blur(0.5px)",
    duration: compactViewport ? (isHeading ? 520 : 570) : isHeading ? 600 : 650,
  };
};

const revealDelay = (element: HTMLElement, compactViewport: boolean) => {
  const scale = compactViewport ? 0.42 : 1;

  if (element.matches(".hybrid-work__grid > article")) {
    return siblingIndex(element) * 58 * scale;
  }
  if (element.matches(".hybrid-tool")) {
    return siblingIndex(element) * 50 * scale;
  }
  if (element.matches(".hybrid-process__list > li")) {
    return siblingIndex(element) * 55 * scale;
  }
  if (element.matches(".outcome-comparison__group")) {
    return siblingIndex(element) * 70 * scale;
  }
  if (element.matches(".outcome-comparison__group li")) {
    return siblingIndex(element) * 35 * scale;
  }
  if (element.matches(".hybrid-manifesto__inner h2 em")) {
    return siblingIndex(element) * 55 * scale;
  }
  return 0;
};

const applyStage = (element: HTMLElement, state: RevealState, pass: RevealPass) => {
  element.style.opacity = String(state.opacity);
  element.style.transform = state.transform;
  element.style.filter = state.filter;
  element.style.willChange = "opacity, transform, filter";
  element.dataset.motionReveal = "staged";
  pass.staged = true;
};

const releaseStage = (element: HTMLElement, pass: RevealPass) => {
  element.style.removeProperty("opacity");
  element.style.removeProperty("transform");
  element.style.removeProperty("filter");
  element.style.removeProperty("will-change");
  element.dataset.motionReveal = "shown";
  pass.staged = false;
};

/** Early, varied entrances without first-frame flashing or layout jumps. */
export function PageRevealController({ pathname }: { pathname: string }) {
  useEffect(() => {
    let removeReveal: (() => void) | undefined;

    const installReveal = () => {
      const root = document.querySelector<HTMLElement>(".page-transition");
      if (!root) return undefined;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compactViewport = window.matchMedia("(max-width: 720px)").matches;
      const supportsReveal =
        !reducedMotion &&
        typeof IntersectionObserver !== "undefined" &&
        typeof Element.prototype.animate === "function";

      if (!supportsReveal) return undefined;

      const candidates = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_TARGETS)).filter(
        (element) =>
          !element.closest('[aria-hidden="true"]') &&
          element.getAttribute("aria-hidden") !== "true",
      );

      const animations = new Set<Animation>();
      const states = new Map(
        candidates.map((element) => [element, revealState(element, compactViewport)]),
      );
      const passes = new Map<HTMLElement, RevealPass>(
        candidates.map((element) => [
          element,
          { down: 0, up: 0, inside: false, staged: false, activeAnimation: null },
        ]),
      );
      let lastScrollY = window.scrollY;
      let scrollDirection: "down" | "up" = "down";
      let settleTimer: number | null = null;
      let settleLeft = false;
      const flow = root.querySelector<HTMLElement>(".kage-flow");

      const registerAnimation = (
        element: HTMLElement,
        pass: RevealPass,
        animation: Animation,
        releaseAfter: boolean,
      ) => {
        pass.activeAnimation?.cancel();
        pass.activeAnimation = animation;
        animations.add(animation);

        void animation.finished
          .then(() => {
            animations.delete(animation);
            if (pass.activeAnimation !== animation) return;
            pass.activeAnimation = null;
            if (releaseAfter) releaseStage(element, pass);
          })
          .catch(() => {
            animations.delete(animation);
            if (pass.activeAnimation === animation) pass.activeAnimation = null;
          });
      };

      const playDownReveal = (element: HTMLElement, pass: RevealPass) => {
        if (!pass.staged || pass.down >= 2) return;
        const state = states.get(element) ?? revealState(element, compactViewport);
        const firstPass = pass.down === 0;
        pass.down += 1;

        const animation = element.animate(
          [
            {
              opacity: state.opacity,
              transform: state.transform,
              filter: state.filter,
            },
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0) scale(1)",
              filter: "blur(0px) saturate(1)",
            },
          ],
          {
            duration: state.duration,
            delay: firstPass ? revealDelay(element, compactViewport) : 0,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            fill: "both",
          },
        );

        registerAnimation(element, pass, animation, true);
      };

      const playUpCue = (element: HTMLElement, pass: RevealPass) => {
        if (pass.up >= 2) return;
        if (pass.staged) releaseStage(element, pass);
        pass.up += 1;
        const distance = compactViewport ? 2 : 3;
        const animation = element.animate(
          [
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
            {
              opacity: 0.98,
              transform: `translate3d(0, -${distance}px, 0) scale(0.999)`,
            },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          {
            duration: compactViewport ? 320 : 380,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            fill: "none",
          },
        );

        registerAnimation(element, pass, animation, false);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement;
            const pass = passes.get(element);
            if (!pass) return;

            if (!entry.isIntersecting) {
              pass.inside = false;
              if (
                scrollDirection === "up" &&
                pass.down < 2 &&
                entry.boundingClientRect.top > window.innerHeight * 0.55
              ) {
                pass.activeAnimation?.cancel();
                const state = states.get(element) ?? revealState(element, compactViewport);
                applyStage(element, state, pass);
              }
              return;
            }

            if (pass.inside) return;
            pass.inside = true;

            if (scrollDirection === "down") {
              playDownReveal(element, pass);
              return;
            }

            playUpCue(element, pass);
          });
        },
        {
          threshold: 0.04,
          rootMargin: "0px 0px 18% 0px",
        },
      );

      candidates.forEach((element) => {
        const pass = passes.get(element);
        const state = states.get(element);
        if (!pass || !state) return;

        const rect = element.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.82) {
          applyStage(element, state, pass);
        } else {
          element.dataset.motionReveal = "shown";
        }
        observer.observe(element);
      });

      const clearFlowSettle = () => {
        if (!flow) return;
        flow.querySelectorAll<HTMLElement>("[data-scroll-settle]").forEach((element) => {
          delete element.dataset.scrollSettle;
          element.style.removeProperty("animation-duration");
        });
      };

      const scheduleFlowSettle = () => {
        if (!flow) return;
        if (settleTimer !== null) window.clearTimeout(settleTimer);
        clearFlowSettle();

        const rect = flow.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

        settleTimer = window.setTimeout(() => {
          const activeArtifact = flow.querySelector<HTMLElement>(
            '.hybrid-flow__panel[data-active="true"] .hybrid-flow__artifact',
          );
          if (!activeArtifact) return;

          settleLeft = !settleLeft;
          activeArtifact.style.animationDuration = "480ms";
          activeArtifact.dataset.scrollSettle = settleLeft ? "left" : "right";
        }, 105);
      };

      const onScroll = () => {
        const nextScrollY = window.scrollY;
        if (nextScrollY > lastScrollY + 2) scrollDirection = "down";
        if (nextScrollY < lastScrollY - 2) scrollDirection = "up";
        lastScrollY = nextScrollY;
        scheduleFlowSettle();
      };

      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
        if (settleTimer !== null) window.clearTimeout(settleTimer);
        clearFlowSettle();
        animations.forEach((animation) => animation.cancel());
        animations.clear();
        candidates.forEach((element) => {
          const pass = passes.get(element);
          if (pass) releaseStage(element, pass);
          delete element.dataset.motionReveal;
        });
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
