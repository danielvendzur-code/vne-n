import { useEffect } from "react";

const TOOL_LABELS = [
  "Otvoriť chatbot",
  "Otvoriť kalkulačku",
  "Otvoriť konfigurátor",
  "Otvoriť poradcu",
] as const;

type MotionKind = "project" | "process" | "outcome" | "price";

function motionFrames(kind: MotionKind): Keyframe[] {
  switch (kind) {
    case "project":
      return [
        {
          opacity: 0.58,
          clipPath: "inset(10% 0 0 0 round 18px)",
          transform: "translateY(18px) scale(1.025)",
        },
        {
          opacity: 1,
          clipPath: "inset(0 0 0 0 round 18px)",
          transform: "translateY(0) scale(1)",
        },
      ];
    case "process":
      return [
        { opacity: 0.24, transform: "translateX(-24px) rotate(-4deg)" },
        { opacity: 1, transform: "translateX(0) rotate(0deg)" },
      ];
    case "outcome":
      return [
        { opacity: 0.12, transform: "translateX(-16px) scale(0.88)" },
        { opacity: 1, transform: "translateX(0) scale(1)" },
      ];
    case "price":
      return [
        { opacity: 0.18, transform: "translateY(16px) scale(0.9)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ];
  }
}

function motionDuration(kind: MotionKind): number {
  if (kind === "project") return 880;
  if (kind === "process") return 700;
  if (kind === "price") return 760;
  return 620;
}

/**
 * Small final-pass corrections that do not own layout or business logic.
 * Visible CTA wording is provided by the final CSS layer; this component keeps
 * the button accessible names in sync and gives distinct sections visibly
 * different secondary motion without fighting the existing parent reveals.
 */
export function HomepageRequestedCorrections(): null {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".kage-home");
    if (!root) return undefined;

    root.querySelectorAll<HTMLButtonElement>(".hybrid-tool").forEach((button, index) => {
      const label = TOOL_LABELS[index];
      if (!label) return;
      const title = button.querySelector<HTMLElement>("strong")?.textContent?.trim() ?? "riešenie";
      button.setAttribute("aria-label", `${label}: ${title}`);
    });

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined" ||
      typeof Element.prototype.animate !== "function"
    ) {
      return undefined;
    }

    const targets: Array<{ element: HTMLElement; kind: MotionKind }> = [];
    root.querySelectorAll<HTMLElement>(".hybrid-project__visual").forEach((element) =>
      targets.push({ element, kind: "project" }),
    );
    root.querySelectorAll<HTMLElement>(".hybrid-process__list > li > span:first-child").forEach((element) =>
      targets.push({ element, kind: "process" }),
    );
    root.querySelectorAll<SVGElement>(".outcome-comparison__group li > svg").forEach((element) =>
      targets.push({ element: element as unknown as HTMLElement, kind: "outcome" }),
    );
    root.querySelectorAll<HTMLElement>(".hybrid-price__grid > div > strong").forEach((element) =>
      targets.push({ element, kind: "price" }),
    );

    const kindByElement = new Map(targets.map(({ element, kind }) => [element, kind]));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          const kind = kindByElement.get(element);
          if (!kind || element.dataset.secondaryMotion === "shown") return;

          element.dataset.secondaryMotion = "shown";
          element.animate(motionFrames(kind), {
            duration: motionDuration(kind),
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "none",
          });
          observer.unobserve(element);
        });
      },
      { threshold: 0.24, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach(({ element }) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}
