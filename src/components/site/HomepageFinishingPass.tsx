import { useEffect } from "react";

const TOOL_CTAS = new Map<string, string>([
  ["Chatbot", "Vyskladať chatbota"],
  ["Kalkulačka", "Vyskladať kalkulačku"],
  ["Konfigurátor", "Vyskladať konfigurátor"],
  ["Produktový poradca", "Vyskladať poradcu"],
]);

function updateToolCtas(): void {
  const toolButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".hybrid-tool"));

  toolButtons.forEach((button) => {
    const toolName = button.querySelector("strong")?.textContent?.trim() ?? "";
    const expectedCta = TOOL_CTAS.get(toolName);
    if (!expectedCta) return;

    const cta = button.querySelector<HTMLElement>(".hybrid-tool__cta");
    if (!cta) return;

    const textNode = Array.from(cta.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    const expectedText = `${expectedCta} `;

    if (textNode) {
      if (textNode.textContent !== expectedText) textNode.textContent = expectedText;
    } else {
      cta.prepend(document.createTextNode(expectedText));
    }

    const expectedAriaLabel = `${expectedCta}: ${toolName}`;
    if (button.getAttribute("aria-label") !== expectedAriaLabel) {
      button.setAttribute("aria-label", expectedAriaLabel);
    }
  });
}

export function HomepageFinishingPass(): null {
  useEffect(() => {
    updateToolCtas();

    const toolsRoot = document.querySelector<HTMLElement>(".hybrid-tools__rows");
    const textObserver = toolsRoot
      ? new MutationObserver(() => {
          updateToolCtas();
        })
      : null;

    textObserver?.observe(toolsRoot as HTMLElement, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    const priceSection = document.querySelector<HTMLElement>(".hybrid-price");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canAnimate = typeof Element.prototype.animate === "function";
    const animations: Animation[] = [];
    let priceObserver: IntersectionObserver | null = null;

    if (
      priceSection &&
      !reducedMotion &&
      canAnimate &&
      typeof IntersectionObserver !== "undefined"
    ) {
      priceObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          priceObserver?.disconnect();

          const values = Array.from(
            priceSection.querySelectorAll<HTMLElement>(
              ".hybrid-price__grid > div > strong, .hybrid-price__grid > div > b",
            ),
          );

          values.forEach((element, index) => {
            const animation = element.animate(
              [
                {
                  opacity: 0.12,
                  transform: "translate3d(0, 14px, 0) scale(0.97)",
                  filter: "blur(4px)",
                },
                {
                  opacity: 1,
                  transform: "translate3d(0, -2px, 0) scale(1.02)",
                  filter: "blur(0px)",
                  offset: 0.78,
                },
                {
                  opacity: 1,
                  transform: "translate3d(0, 0, 0) scale(1)",
                  filter: "blur(0px)",
                },
              ],
              {
                duration: 760,
                delay: index * 110,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                fill: "none",
              },
            );
            animations.push(animation);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -8% 0px",
        },
      );

      priceObserver.observe(priceSection);
    }

    return () => {
      textObserver?.disconnect();
      priceObserver?.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return null;
}
