import { useEffect } from "react";

const STYLE_ID = "site-motion-enhancements-v2";
const CHOICE_COPY = "vyberte, čo má web robiť";

const normalize = (value: string): string =>
  value.replace(/\s+/g, " ").trim().toLocaleLowerCase("sk");

const parseRgb = (value: string): [number, number, number] | null => {
  const match = value.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
};

const isDarkSurface = (element: HTMLElement): boolean => {
  let current: HTMLElement | null = element;
  for (let depth = 0; current && depth < 3; depth += 1) {
    const rgb = parseRgb(getComputedStyle(current).backgroundColor);
    if (rgb) {
      const [red, green, blue] = rgb;
      const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      if (luminance < 92) return true;
      if (luminance > 225) return false;
    }
    current = current.parentElement;
  }
  return false;
};

const findChoiceSection = (): HTMLElement | null => {
  const copy = Array.from(
    document.querySelectorAll<HTMLElement>("h1, h2, h3, p, span, strong"),
  ).find((element) => normalize(element.textContent ?? "").includes(CHOICE_COPY));

  return (
    copy?.closest<HTMLElement>(
      "section, article, [data-section], .lp-section, .lp-funnel, .lp-assistant-card",
    ) ??
    copy?.parentElement?.parentElement ??
    null
  );
};

const choiceTargets = (section: HTMLElement): HTMLElement[] => {
  const explicit = Array.from(
    section.querySelectorAll<HTMLElement>(
      "button, a, [role='button'], [class*='choice'], [class*='option'], [class*='card']",
    ),
  );

  return explicit.filter((element) => {
    if (element === section || element.closest("nav")) return false;
    const rect = element.getBoundingClientRect();
    return rect.width >= 120 && rect.height >= 38;
  });
};

export function SiteMotionEnhancements() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(".lp-project-media img"),
    );
    images.forEach((image, index) => {
      const media = image.closest<HTMLElement>(".lp-project-media");
      const markLoaded = () => {
        if (image.naturalWidth > 0) media?.setAttribute("data-loaded", "true");
      };
      const markFailed = () => media?.setAttribute("data-load-error", "true");

      image.loading = index === 0 ? "eager" : "lazy";
      image.fetchPriority = index === 0 ? "high" : "low";
      image.addEventListener("load", markLoaded, { once: true });
      image.addEventListener("error", markFailed, { once: true });

      if (image.complete) {
        markLoaded();
      } else {
        void image
          .decode()
          .then(markLoaded)
          .catch(() => undefined);
      }

      cleanups.push(() => {
        image.removeEventListener("load", markLoaded);
        image.removeEventListener("error", markFailed);
      });
    });

    const oldStyle = document.getElementById(STYLE_ID);
    oldStyle?.remove();

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      [data-choice-experience="true"] {
        --choice-flash-x: 50%;
        --choice-flash-y: 50%;
      }

      [data-choice-no-tilt="true"] {
        --tilt-x: 0deg !important;
        --tilt-y: 0deg !important;
        --rotate-x: 0deg !important;
        --rotate-y: 0deg !important;
        perspective: none !important;
        transform: translate3d(0, 0, 0) !important;
        backface-visibility: hidden;
        transition:
          border-color 180ms ease,
          background-color 180ms ease,
          box-shadow 180ms ease,
          color 180ms ease,
          opacity 180ms ease !important;
      }

      [data-choice-flashlight="true"] {
        position: relative !important;
        isolation: isolate;
        overflow: hidden;
        contain: paint;
      }

      [data-choice-flashlight="true"]::before {
        content: "";
        position: absolute;
        inset: -1px;
        z-index: 0;
        pointer-events: none;
        border-radius: inherit;
        background: radial-gradient(
          280px circle at var(--choice-flash-x, 50%) var(--choice-flash-y, 50%),
          rgba(217, 255, 120, 0.28) 0%,
          rgba(217, 255, 120, 0.11) 32%,
          rgba(255, 255, 255, 0.04) 52%,
          transparent 72%
        );
        opacity: 0;
        transition: opacity 160ms ease;
        transform: translateZ(0);
      }

      [data-choice-flashlight="true"]:is(:hover, :focus-visible)::before {
        opacity: 1;
      }

      [data-choice-flashlight="true"] > * {
        position: relative;
        z-index: 1;
      }

      [data-topography-lines="true"] {
        position: relative !important;
        isolation: isolate;
        overflow: hidden;
      }

      [data-topography-lines="true"]::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        opacity: 0.105;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='760' height='420' viewBox='0 0 760 420'%3E%3Cg fill='none' stroke='%23d9ff78' stroke-width='1'%3E%3Cpath d='M-40 75C75 8 190 146 315 82S550 15 800 98'/%3E%3Cpath d='M-55 112C72 45 190 184 325 119S575 53 810 136'/%3E%3Cpath d='M-70 151C63 84 201 223 337 158S590 94 825 174'/%3E%3Cpath d='M-86 193C50 126 207 263 347 200S600 132 840 215'/%3E%3Cpath d='M-105 237C35 168 210 308 360 242S620 178 860 258'/%3E%3Cpath d='M-120 286C26 217 224 352 378 289S643 222 875 305'/%3E%3Cpath d='M-135 337C22 269 238 401 398 338S665 271 892 354'/%3E%3Cpath d='M84 -35C138 56 71 125 127 202S173 342 103 456'/%3E%3Cpath d='M151 -45C202 49 139 126 194 203S240 345 171 465'/%3E%3Cpath d='M557 -42C503 48 570 124 514 201S468 343 538 462'/%3E%3Cpath d='M626 -32C572 56 638 128 582 204S536 344 606 454'/%3E%3C/g%3E%3C/svg%3E");
        background-size: 760px 420px;
        background-position: center;
        mix-blend-mode: screen;
        transform: translateZ(0);
      }

      [data-topography-lines="true"] > * {
        position: relative;
        z-index: 1;
      }

      .site-brand-lockup:hover .brand-mark path,
      .site-brand-lockup:focus-visible .brand-mark path {
        stroke-dasharray: 360;
        animation: mc-logo-redraw 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes mc-logo-redraw {
        from { stroke-dashoffset: 360; opacity: 0.7; }
        to { stroke-dashoffset: 0; opacity: 1; }
      }

      @media (prefers-reduced-motion: reduce) {
        [data-choice-flashlight="true"]::before {
          transition: none;
        }

        .site-brand-lockup .brand-mark path {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    cleanups.push(() => style.remove());

    let animationFrame = 0;
    let activeTarget: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const applyPointer = () => {
      animationFrame = 0;
      if (!activeTarget) return;
      const rect = activeTarget.getBoundingClientRect();
      activeTarget.style.setProperty("--choice-flash-x", `${pointerX - rect.left}px`);
      activeTarget.style.setProperty("--choice-flash-y", `${pointerY - rect.top}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const target =
        element?.closest<HTMLElement>('[data-choice-flashlight="true"]') ?? null;
      if (!target) return;
      activeTarget = target;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!animationFrame) animationFrame = window.requestAnimationFrame(applyPointer);
    };

    const onPointerLeave = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const target =
        element?.closest<HTMLElement>('[data-choice-flashlight="true"]') ?? null;
      if (target && event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) {
        return;
      }
      if (activeTarget === target) activeTarget = null;
    };

    const enhancePage = () => {
      const choiceSection = findChoiceSection();
      if (choiceSection) {
        choiceSection.dataset.choiceExperience = "true";
        choiceTargets(choiceSection).forEach((target) => {
          target.dataset.choiceNoTilt = "true";
          target.dataset.choiceFlashlight = "true";
          target.style.setProperty("--tilt-x", "0deg");
          target.style.setProperty("--tilt-y", "0deg");
        });
      }

      const preferred = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".lp-comparison, .lp-final-cta, .lp-contact-cta, .site-footer, footer, section",
        ),
      );
      const darkSections = preferred.filter((element, index, all) => {
        if (all.indexOf(element) !== index) return false;
        if (element.closest(".lp-hero") || element === choiceSection) return false;
        const rect = element.getBoundingClientRect();
        return rect.height >= 180 && isDarkSurface(element);
      });

      darkSections.slice(0, 2).forEach((element) => {
        element.dataset.topographyLines = "true";
      });
    };

    const setupFrame = window.requestAnimationFrame(enhancePage);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerLeave, { passive: true });

    cleanups.push(() => {
      window.cancelAnimationFrame(setupFrame);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerLeave);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
