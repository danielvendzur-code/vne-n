const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Reveal real content once; leave native scrolling and the final layout intact. */
export function revealMailPair(element: HTMLDivElement | null) {
  if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cards = Array.from(element.querySelectorAll<HTMLElement>("[data-mail-scene]"));
  const animations: Animation[] = [];
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      const desktop = innerWidth > 700;
      cards.forEach((card, index) => {
        animations.push(
          card.animate(
            [
              {
                transform: desktop
                  ? `perspective(1600px) translate3d(${index ? 70 : -70}px, 72px, 0) rotateY(${index ? -7 : 7}deg)`
                  : "translate3d(0, 48px, 0)",
                opacity: 0.4,
              },
              { transform: "perspective(1600px) translate3d(0, 0, 0) rotateY(0deg)", opacity: 1 },
            ],
            { duration: 1350, delay: index * 140, easing: ease },
          ),
        );
      });
      observer.disconnect();
    },
    { threshold: 0, rootMargin: "0px 0px -120px 0px" },
  );
  observer.observe(element);
  const media = matchMedia("(prefers-reduced-motion: reduce)");
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
