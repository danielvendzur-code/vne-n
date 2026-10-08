/** React calls this ref after this element has hydrated, never on sibling SSR content. */
export function revealElement(element: HTMLElement | null) {
  if (!element) return;
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  if (
    media.matches ||
    typeof IntersectionObserver === "undefined" ||
    element.getBoundingClientRect().top < innerHeight
  )
    return;
  element.dataset.revealed = "pending";
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.revealed = "true";
      observer.disconnect();
    },
    { rootMargin: "0px 0px -48px 0px" },
  );
  observer.observe(element);
  const preference = () => {
    if (media.matches) {
      observer.disconnect();
      element.dataset.revealed = "true";
    }
  };
  media.addEventListener("change", preference);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", preference);
    delete element.dataset.revealed;
  };
}
