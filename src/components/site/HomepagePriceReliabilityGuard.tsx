import { useEffect } from "react";

const EXPECTED_PRICES = [
  {
    selector: ".hybrid-price__grid > div:nth-child(1) > strong",
    text: "od 347 €",
  },
  {
    selector: ".hybrid-price__grid > div:nth-child(2) > strong",
    text: "od 447 €",
  },
] as const;

function enforceHomepagePrices(): void {
  for (const item of EXPECTED_PRICES) {
    const element = document.querySelector<HTMLElement>(item.selector);
    if (!element || element.textContent === item.text) continue;
    element.textContent = item.text;
  }
}

/**
 * The legacy homepage price counter is initialized to 0 and relies on an
 * IntersectionObserver to start. If that observer never fires, visitors see
 * "od 0 €" indefinitely. This guard makes the real prices authoritative and
 * keeps them stable even if the old counter tries to write another value.
 */
export function HomepagePriceReliabilityGuard(): null {
  useEffect(() => {
    enforceHomepagePrices();

    const priceSection = document.querySelector<HTMLElement>(".hybrid-price");
    if (!priceSection) return undefined;

    const observer = new MutationObserver(() => {
      enforceHomepagePrices();
    });

    observer.observe(priceSection, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
