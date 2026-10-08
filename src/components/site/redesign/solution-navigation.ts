const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Keep the actual capture continuous from the card into the detail page. */
export async function openSolution(preview: HTMLElement | null, navigate: () => Promise<void>) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    await navigate();
    return;
  }
  if (document.documentElement.dataset.solutionOpening) return;
  const image = preview?.querySelector<HTMLImageElement>("img") ?? null;
  const root = document.documentElement;
  root.dataset.solutionOpening = "true";
  const clean = () => {
    if (preview) preview.style.viewTransitionName = "";
    if (image) image.style.viewTransitionName = "";
    delete root.dataset.solutionOpening;
  };
  const settle = async (shared = false) => {
    await navigate();
    if (shared) {
      document
        .querySelector<HTMLElement>(".solution-detail")
        ?.setAttribute("data-shared-arrival", "true");
    }
    const target = document.querySelector<HTMLImageElement>(".solution-detail__image");
    if (target) await target.decode().catch(() => {});
    // View transitions suspend animation frames until this callback finishes.
    // The committed route and decoded image can be laid out synchronously.
    target?.getBoundingClientRect();
  };

  if (typeof document.startViewTransition === "function") {
    if (image && preview) {
      preview.style.viewTransitionName = "solution-surface";
      image.style.viewTransitionName = "solution-image";
    }
    const transition = document.startViewTransition(() => settle(true));
    await transition.finished.catch(() => {}).finally(clean);
    return;
  }

  // Older browsers still get a visible transition using the real photograph.
  const flight = image?.cloneNode(false) as HTMLImageElement | undefined;
  const start = image?.getBoundingClientRect();
  if (flight && start) {
    flight.setAttribute("aria-hidden", "true");
    flight.className = "solution-flight";
    Object.assign(flight.style, {
      left: `${start.x}px`,
      top: `${start.y}px`,
      width: `${start.width}px`,
      height: `${start.height}px`,
    });
    document.body.append(flight);
  }
  let hiddenTarget: HTMLElement | null = null;
  try {
    await settle();
    const target = document.querySelector<HTMLElement>(".solution-detail__image");
    const end = target?.getBoundingClientRect();
    if (flight && start && end) {
      hiddenTarget = target ?? null;
      target!.style.visibility = "hidden";
      const animation = flight.animate(
        [
          { transform: "none", opacity: 1 },
          {
            transform: `translate(${end.x - start.x}px, ${end.y - start.y}px) scale(${end.width / start.width}, ${end.height / start.height})`,
            opacity: 1,
          },
        ],
        { duration: 650, easing: ease, fill: "forwards" },
      );
      await animation.finished.catch(() => {});
      target!.style.visibility = "";
    } else {
      // Navigation without a source image is immediately usable.
    }
  } finally {
    if (hiddenTarget) hiddenTarget.style.visibility = "";
    flight?.remove();
    clean();
  }
}
