/** Stage below-viewport cards before paint; never fade out already visible cards. */
function observeScenes(
  element: HTMLElement | null,
  selector: string,
  enter: (card: HTMLElement, index: number) => Animation[],
) {
  if (!element) return;
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  if (media.matches || typeof IntersectionObserver === "undefined") return;
  const cards = Array.from(element.querySelectorAll<HTMLElement>(selector));
  const animations: Animation[] = [];
  const pending = cards.filter((card) => {
    if (card.getBoundingClientRect().top < innerHeight - 8) return false;
    card.style.opacity = "0";
    return true;
  });
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const card = entry.target as HTMLElement;
        if (media.matches) {
          card.style.removeProperty("opacity");
          continue;
        }
        const started = enter(card, cards.indexOf(card));
        animations.push(...started);
        for (const animation of started) {
          void animation.finished.then(
            () => {
              card.style.removeProperty("opacity");
              animation.cancel();
            },
            () => undefined,
          );
        }
      }
    },
    { threshold: 0, rootMargin: "0px 0px -12px 0px" },
  );
  pending.forEach((card) => observer.observe(card));
  const stop = () => {
    if (!media.matches) return;
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    pending.forEach((card) => card.style.removeProperty("opacity"));
  };
  media.addEventListener("change", stop);
  return () => {
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    pending.forEach((card) => card.style.removeProperty("opacity"));
    media.removeEventListener("change", stop);
  };
}

/** A pair of windows settles into place while the HTML receipt opens from its top edge. */
export function revealMailPair(element: HTMLDivElement | null) {
  return observeScenes(element, "[data-mail-scene]", (card) => [
    card.animate(
      [
        { opacity: 0, transform: "translate3d(0, 16px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 470,
        delay: 0,
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        fill: "backwards",
      },
    ),
  ]);
}

export function revealJourney(element: HTMLDivElement | null) {
  return observeScenes(element, "[data-journey-step]", (card) => [
    card.animate(
      [
        { opacity: 0, transform: "translate3d(0, 18px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 470,
        delay: 0,
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        fill: "backwards",
      },
    ),
  ]);
}
