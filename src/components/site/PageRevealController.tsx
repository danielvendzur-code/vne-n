import { useEffect } from "react";

const REVEAL_TARGETS = [
  ".kage-home .hybrid-tools__intro > *",
  ".kage-home .hybrid-tool",
  ".kage-home .hybrid-work__intro > *",
  ".kage-home .hybrid-work__grid > article",
  ".kage-home .hybrid-work__footer",
  ".kage-home .hybrid-manifesto__inner > *",
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

type ScrollDirection = "down" | "up";

type RevealMeta = {
  downPasses: number;
  upPasses: number;
  inside: boolean;
  activeAnimation: Animation | null;
};

const siblingIndex = (element: HTMLElement) =>
  Math.max(0, Array.from(element.parentElement?.children ?? []).indexOf(element));

const revealState = (element: HTMLElement, compactViewport: boolean) => {
  const isHeading = /^H[1-3]$/.test(element.tagName);
  const isProject = element.matches(".hybrid-work__grid > article");
  const isProcess = element.matches(".hybrid-process__list > li");
  const isSolution = element.matches(".hybrid-tool");
  const isManifestoAccent = element.matches(".hybrid-manifesto__inner h2 em");
  const isOutcome = element.matches(".outcome-comparison__group");
  const isRow = element.matches("li, article, .hybrid-tool");
  const isFeatureGroup = element.matches(
    ".outcome-comparison__group, .hybrid-price__grid > *, .hybrid-final__body > *",
  );

  if (isManifestoAccent) {
    return {
      opacity: compactViewport ? 0.34 : 0.16,
      transform: `translate3d(0, ${compactViewport ? 7 : 11}px, 0)`,
      duration: compactViewport ? 330 : 390,
    };
  }

  const verticalDistance = compactViewport
    ? isProject
      ? 28
      : isSolution
        ? 22
        : isProcess
          ? 20
          : isOutcome
            ? 18
            : isRow
              ? 15
              : 11
    : isProject
      ? 46
      : isSolution
        ? 34
        : isProcess
          ? 30
          : isOutcome
            ? 28
            : isRow
              ? 22
              : 17;

  const scale = isProject ? 0.982 : isFeatureGroup ? 0.991 : 1;

  return {
    opacity: compactViewport
      ? isProject
        ? 0.28
        : isSolution
          ? 0.3
          : isProcess
            ? 0.38
            : isHeading
              ? 0.4
              : isRow
                ? 0.46
                : 0.58
      : isProject
        ? 0.12
        : isSolution
          ? 0.16
          : isProcess
            ? 0.24
            : isHeading
              ? 0.26
              : isRow
                ? 0.34
                : 0.5,
    transform:
      scale === 1
        ? `translate3d(0, ${verticalDistance}px, 0)`
        : `translate3d(0, ${verticalDistance}px, 0) scale(${scale})`,
    duration: compactViewport
      ? isProject
        ? 610
        : isSolution
          ? 570
          : isProcess
            ? 540
            : isHeading
              ? 520
              : isRow
                ? 500
                : 460
      : isProject
        ? 760
        : isSolution
          ? 690
          : isProcess
            ? 650
            : isHeading
              ? 620
              : isRow
                ? 590
                : 540,
  };
};

const revealDelay = (element: HTMLElement, compactViewport: boolean) => {
  const delayScale = compactViewport ? 0.68 : 1;

  if (element.matches(".hybrid-work__grid > article")) {
    return siblingIndex(element) * 95 * delayScale;
  }
  if (element.matches(".hybrid-tool")) {
    return siblingIndex(element) * 62 * delayScale;
  }
  if (element.matches(".hybrid-process__list > li")) {
    return siblingIndex(element) * 72 * delayScale;
  }
  if (element.matches(".outcome-comparison__group")) {
    return siblingIndex(element) * 100 * delayScale;
  }
  if (element.matches(".outcome-comparison__group li")) {
    return siblingIndex(element) * 52 * delayScale;
  }
  if (element.matches(".hybrid-manifesto__inner h2 em")) {
    const accents = Array.from(
      element.parentElement?.querySelectorAll<HTMLElement>("em") ?? [],
    );
    return Math.max(0, accents.indexOf(element)) * 82 * delayScale;
  }
  return 0;
};

/**
 * Progressive enhancement for page entrances.
 *
 * Home sections get two visible downward passes. Returning upward gets a much
 * smaller motion cue, also capped at two passes. The observer remains attached
 * instead of permanently unobserving an element after its first entrance.
 */
export function PageRevealController({ pathname }: { pathname: string }) {
  useEffect(() => {
    let removeReveal: (() => void) | undefined;
    let installFrame = 0;
    let installAttempts = 0;

    const installReveal = () => {
      const root = document.querySelector<HTMLElement>(".page-transition");
      if (!root) return undefined;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compactViewport = window.matchMedia("(max-width: 720px)").matches;
      const supportsReveal =
        !reducedMotion &&
        typeof IntersectionObserver !== "undefined" &&
        typeof Element.prototype.animate === "function";

      if (!supportsReveal) return () => undefined;

      const observed = new Set<HTMLElement>();
      const states = new Map<HTMLElement, ReturnType<typeof revealState>>();
      const metadata = new Map<HTMLElement, RevealMeta>();
      const animations = new Set<Animation>();
      let lastScrollY = window.scrollY;
      let direction: ScrollDirection = "down";

      const onScroll = () => {
        const nextScrollY = window.scrollY;
        if (nextScrollY > lastScrollY + 2) direction = "down";
        else if (nextScrollY < lastScrollY - 2) direction = "up";
        lastScrollY = nextScrollY;
      };

      const registerAnimation = (element: HTMLElement, animation: Animation) => {
        const meta = metadata.get(element);
        if (meta) {
          meta.activeAnimation?.cancel();
          meta.activeAnimation = animation;
        }
        animations.add(animation);
        void animation.finished
          .then(() => {
            animations.delete(animation);
            const currentMeta = metadata.get(element);
            if (currentMeta?.activeAnimation === animation) currentMeta.activeAnimation = null;
          })
          .catch(() => {
            animations.delete(animation);
            const currentMeta = metadata.get(element);
            if (currentMeta?.activeAnimation === animation) currentMeta.activeAnimation = null;
          });
      };

      const playDownReveal = (element: HTMLElement, meta: RevealMeta) => {
        const state = states.get(element) ?? revealState(element, compactViewport);
        const secondPass = meta.downPasses === 1;
        const animation = element.animate(
          [
            { opacity: state.opacity, transform: state.transform },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          {
            duration: Math.round(state.duration * (secondPass ? 0.84 : 1)),
            delay: Math.round(revealDelay(element, compactViewport) * (secondPass ? 0.72 : 1)),
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "none",
          },
        );
        registerAnimation(element, animation);
        meta.downPasses += 1;
      };

      const playUpCue = (element: HTMLElement, meta: RevealMeta) => {
        const distance = compactViewport ? 4 : 7;
        const animation = element.animate(
          [
            { opacity: 0.9, transform: `translate3d(0, -${distance}px, 0) scale(0.997)` },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          {
            duration: compactViewport ? 230 : 290,
            delay: Math.round(revealDelay(element, compactViewport) * 0.18),
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "none",
          },
        );
        registerAnimation(element, animation);
        meta.upPasses += 1;
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement;
            const meta = metadata.get(element);
            if (!meta) return;

            if (!entry.isIntersecting) {
              meta.inside = false;
              return;
            }
            if (meta.inside) return;
            meta.inside = true;

            if (direction === "down" && meta.downPasses < 2) {
              playDownReveal(element, meta);
              return;
            }
            if (direction === "up" && meta.upPasses < 2) {
              playUpCue(element, meta);
            }
          });
        },
        {
          threshold: 0.08,
          // A negative bottom margin makes the entrance happen while the user
          // can actually see it instead of finishing below the viewport.
          rootMargin: "0px 0px -9% 0px",
        },
      );

      const isEligible = (element: HTMLElement) =>
        !element.closest('[aria-hidden="true"]') && element.getAttribute("aria-hidden") !== "true";

      const scan = () => {
        Array.from(root.querySelectorAll<HTMLElement>(REVEAL_TARGETS)).forEach((element) => {
          if (observed.has(element) || !isEligible(element)) return;
          observed.add(element);
          states.set(element, revealState(element, compactViewport));
          metadata.set(element, {
            downPasses: 0,
            upPasses: 0,
            inside: false,
            activeAnimation: null,
          });
          element.dataset.motionReveal = "staged";
          observer.observe(element);
        });
      };

      const contentObserver = new MutationObserver(scan);
      contentObserver.observe(root, { childList: true, subtree: true });
      scan();
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        contentObserver.disconnect();
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
        animations.forEach((animation) => animation.cancel());
        animations.clear();
        observed.forEach((element) => delete element.dataset.motionReveal);
        observed.clear();
        states.clear();
        metadata.clear();
      };
    };

    const tryInstall = () => {
      removeReveal = installReveal();
      if (!removeReveal && installAttempts < 12) {
        installAttempts += 1;
        installFrame = window.requestAnimationFrame(tryInstall);
      }
    };

    tryInstall();

    return () => {
      if (installFrame !== 0) window.cancelAnimationFrame(installFrame);
      removeReveal?.();
    };
  }, [pathname]);

  return null;
}
