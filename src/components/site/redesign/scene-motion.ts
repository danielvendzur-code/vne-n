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
  return observeScenes(element, "[data-mail-scene]", (card, index) => {
    const desktop = innerWidth > 700;
    const direction = index ? 1 : -1;
    const delay = desktop ? index * 120 : 0;
    const animations = [
      card.animate(
        [
          {
            transform: desktop
              ? `perspective(1800px) translate3d(${direction * 52}px, 90px, -120px) rotateY(${-direction * 11}deg) rotateX(5deg) scale(.95)`
              : "translate3d(0, 48px, 0) scale(.98)",
            opacity: 0.3,
          },
          {
            offset: 0.72,
            transform:
              "perspective(1800px) translate3d(0, -4px, 0) rotateY(0deg) rotateX(0deg) scale(1.003)",
            opacity: 1,
          },
          {
            transform:
              "perspective(1800px) translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg) scale(1)",
            opacity: 1,
          },
        ],
        { duration: desktop ? 1450 : 1050, delay, easing: ease, fill: "backwards" },
      ),
    ];
    const body = card.querySelector("[data-mail-body]");
    if (body) {
      animations.push(
        body.animate(
          [
            { clipPath: "inset(0 0 85% 0 round 10px)", opacity: 0.55 },
            { clipPath: "inset(0 0 0 0 round 10px)", opacity: 1 },
          ],
          { duration: 1050, delay: delay + 160, easing: ease, fill: "backwards" },
        ),
      );
    }
    return animations;
  });
}

export function revealJourney(element: HTMLDivElement | null) {
  return observeScenes(element, "[data-journey-step]", (card, index) => [
    card.animate(
      [
        { transform: "translate3d(0, 48px, 0)", opacity: 0.15 },
        { offset: 0.75, transform: "translate3d(0, -3px, 0)", opacity: 1 },
        { transform: "translate3d(0, 0, 0)", opacity: 1 },
      ],
      {
        duration: 1100,
        delay: innerWidth > 700 ? index * 170 : 0,
        easing: ease,
        fill: "backwards",
      },
    ),
  ]);
}
