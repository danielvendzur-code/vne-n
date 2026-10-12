const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Each item enters when it is actually visible, including stacked mobile layouts. */
function observeScenes(
  element: HTMLElement | null,
  selector: string,
  enter: (card: HTMLElement, index: number) => Animation[],
) {
  if (!element) return;
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  if (media.matches) return;
  const cards = Array.from(element.querySelectorAll<HTMLElement>(selector));
  const animations: Animation[] = [];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (media.matches) continue;
        const card = entry.target as HTMLElement;
        animations.push(...enter(card, cards.indexOf(card)));
      }
    },
    { threshold: 0, rootMargin: "0px 0px -64px 0px" },
  );
  cards.forEach((card) => observer.observe(card));
  const stop = () => {
    if (media.matches) {
      observer.disconnect();
      animations.forEach((a) => a.cancel());
    }
  };
  media.addEventListener("change", stop);
  return () => {
    observer.disconnect();
    animations.forEach((a) => a.cancel());
    media.removeEventListener("change", stop);
  };
}

/** A pair of windows settles into place while the HTML receipt opens from its top edge. */
export function revealMailPair(element: HTMLDivElement | null) {
  return observeScenes(element, "[data-mail-scene]", (card, index) => [
    card.animate(
      [
        { opacity: 0, transform: "translate3d(0, 16px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 560,
        delay: innerWidth > 700 ? index * 65 : 0,
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        fill: "backwards",
      },
    ),
  ]);
}

export function revealJourney(element: HTMLDivElement | null) {
  return observeScenes(element, "[data-journey-step]", (card, index) => [
    card.animate(
      [
        { opacity: 0, transform: "translate3d(0, 18px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 570,
        delay: innerWidth > 700 ? index * 70 : 0,
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        fill: "backwards",
      },
    ),
  ]);
}
