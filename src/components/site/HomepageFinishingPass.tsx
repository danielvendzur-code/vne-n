import { useEffect } from "react";

const CALCULATOR_LABEL = "Kalkulačka";
const CALCULATOR_CTA = "Vyskladať kalkulačku";

function updateCalculatorCta(): void {
  const calculatorButton = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".hybrid-tool"),
  ).find((button) => button.querySelector("strong")?.textContent?.trim() === CALCULATOR_LABEL);

  if (!calculatorButton) return;

  const cta = calculatorButton.querySelector<HTMLElement>(".hybrid-tool__cta");
  if (!cta) return;

  const textNode = Array.from(cta.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
  const expectedText = `${CALCULATOR_CTA} `;

  if (textNode) {
    if (textNode.textContent !== expectedText) textNode.textContent = expectedText;
  } else {
    cta.prepend(document.createTextNode(expectedText));
  }

  const expectedAriaLabel = `${CALCULATOR_CTA}: ${CALCULATOR_LABEL}`;
  if (calculatorButton.getAttribute("aria-label") !== expectedAriaLabel) {
    calculatorButton.setAttribute("aria-label", expectedAriaLabel);
  }
}

export function HomepageFinishingPass(): null {
  useEffect(() => {
    updateCalculatorCta();

    const toolsRoot = document.querySelector<HTMLElement>(".hybrid-tools__rows");
    const textObserver = toolsRoot
      ? new MutationObserver(() => {
          updateCalculatorCta();
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
