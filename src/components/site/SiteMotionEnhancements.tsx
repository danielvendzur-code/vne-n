import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const replaceLabel = (element: Element | null, text: string) => {
  if (element) element.textContent = text;
};

const replaceEyebrow = (element: Element | null, text: string) => {
  if (!element) return;
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) node.remove();
  });
  element.append(document.createTextNode(text));
};

export function SiteMotionEnhancements() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const heroHeading = document.querySelector<HTMLElement>(".lp-hero h1");
    const heroLines = Array.from(
      document.querySelectorAll<HTMLElement>(".lp-hero-line > span, .lp-hero-line > em"),
    );
    const heroLead = document.querySelector<HTMLElement>(".lp-hero-lead");
    const assistantTitle = document.querySelector<HTMLElement>(".lp-assistant-card > p");
    const valueEyebrow = document.querySelector<HTMLElement>(".lp-value .lp-eyebrow");
    const toolLabels = Array.from(
      document.querySelectorAll<HTMLElement>(".lp-assistant-chips .lp-control-label"),
    );
    const comparisonLabels = Array.from(
      document.querySelectorAll<HTMLElement>(".lp-switch .lp-control-label"),
    );
    const solutionTitles = Array.from(
      document.querySelectorAll<HTMLElement>(".lp-solution-pill h3"),
    );

    if (heroHeading) {
      heroHeading.setAttribute("aria-label", "Chatboty pre web, ktoré zvyšujú konverzie.");
    }
    replaceLabel(heroLines[0] ?? null, "Chatboty pre web,");
    replaceLabel(heroLines[1] ?? null, "ktoré zvyšujú");
    replaceLabel(heroLines[2] ?? null, "konverzie.");
    replaceLabel(
      heroLead,
      "Tvorím chatboty na mieru — od jednoduchého AI poradcu až po chatbot s kalkulačkou, konfigurátorom alebo rezerváciou. Návštevník dostane odpoveď hneď a vy pripravený dopyt.",
    );
    replaceLabel(assistantTitle, "Čo má váš chatbot zvládnuť?");
    replaceEyebrow(valueEyebrow, "Rozdiel v praxi");

    ["AI chatbot", "Chatbot + kalkulačka", "Chatbot + konfigurátor"].forEach((label, index) =>
      replaceLabel(toolLabels[index] ?? null, label),
    );
    ["Bez chatbota", "S chatbotom"].forEach((label, index) =>
      replaceLabel(comparisonLabels[index] ?? null, label),
    );
    replaceLabel(solutionTitles[1] ?? null, "Chatbot s kalkulačkou alebo konfigurátorom");

    const cleanupButtons: Array<() => void> = [];
    const solutionCards = Array.from(document.querySelectorAll<HTMLElement>(".lp-solution-pill"));
    solutionCards.forEach((card) => {
      const copy = card.querySelector<HTMLElement>(":scope > div");
      const title = copy?.querySelector("h3")?.textContent?.trim() ?? "riešenie";
      if (!copy || copy.querySelector(".lp-solution-cta")) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "lp-solution-cta";
      button.innerHTML = "Navrhnúť toto riešenie <span aria-hidden=\"true\">↗</span>";
      const handleClick = () =>
        openSiteAssistant({ source: "solution-card", entry: "builder", category: title });
      button.addEventListener("click", handleClick);
      copy.appendChild(button);
      cleanupButtons.push(() => {
        button.removeEventListener("click", handleClick);
        button.remove();
      });
    });

    return () => cleanupButtons.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".lp-project-media img"));
    if (!images.length) return;

    const cleanup = images.map((image, index) => {
      const media = image.closest<HTMLElement>(".lp-project-media");
      const markLoaded = () => {
        if (image.naturalWidth > 0) media?.setAttribute("data-loaded", "true");
      };
      const markFailed = () => media?.setAttribute("data-load-error", "true");

      image.loading = "eager";
      image.fetchPriority = index === 0 ? "high" : "auto";
      image.addEventListener("load", markLoaded, { once: true });
      image.addEventListener("error", markFailed, { once: true });

      if (image.complete) {
        markLoaded();
      } else {
        void image
          .decode()
          .then(markLoaded)
          .catch(() => undefined);
      }

      return () => {
        image.removeEventListener("load", markLoaded);
        image.removeEventListener("error", markFailed);
      };
    });

    return () => cleanup.forEach((remove) => remove());
  }, []);

  useEffect(() => {
    const body = document.body;
    let activeTeaser: HTMLElement | null = null;

    const syncTeaser = () => {
      const teaser = document.querySelector<HTMLElement>(".cw-teaser");
      if (!teaser) {
        activeTeaser = null;
        return;
      }

      activeTeaser = teaser;
      const obstructed =
        body.dataset.siteMenuOpen === "true" ||
        body.dataset.cookieBanner === "visible" ||
        body.dataset.cookieSettings === "open";
      teaser.style.setProperty("display", "block", "important");
      teaser.style.setProperty("opacity", obstructed ? "0" : "1", "important");
      teaser.style.setProperty("visibility", obstructed ? "hidden" : "visible", "important");
      teaser.style.setProperty("pointer-events", obstructed ? "none" : "auto", "important");
      teaser.style.setProperty(
        "transform",
        obstructed ? "translateY(7px) scale(0.985)" : "translateY(0) scale(1)",
        "important",
      );
    };

    syncTeaser();
    const observer = new MutationObserver(syncTeaser);
    observer.observe(body, {
      attributes: true,
      attributeFilter: ["data-site-menu-open", "data-cookie-banner", "data-cookie-settings"],
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (!activeTeaser) return;
      ["display", "opacity", "visibility", "pointer-events", "transform"].forEach((property) =>
        activeTeaser?.style.removeProperty(property),
      );
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hero = document.querySelector<HTMLElement>(".lp-hero");
    const glide = hero?.querySelector<HTMLElement>(".lp-hero-glide") ?? null;
    const card = hero?.querySelector<HTMLElement>(".lp-assistant-card") ?? null;
    const serviceCards = Array.from(document.querySelectorAll<HTMLElement>(".sp-service"));
    const solutionCards = Array.from(document.querySelectorAll<HTMLElement>(".lp-solution-pill"));
    if ((!hero || !glide || !card) && !serviceCards.length && !solutionCards.length) return;

    let scrollFrame = 0;
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const paintScroll = () => {
      scrollFrame = 0;
      if (!hero || !glide) return;
      const rect = hero.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
      glide.style.transform = `translate3d(0, ${progress * 30}px, 0)`;
    };

    const handleScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(paintScroll);
    };

    const paintPointer = () => {
      pointerFrame = 0;
      if (!finePointer.matches || !card) return;
      const rect = card.getBoundingClientRect();
      const normalizedX = clamp((pointerX - rect.left) / rect.width, 0, 1) * 2 - 1;
      const normalizedY = clamp((pointerY - rect.top) / rect.height, 0, 1) * 2 - 1;
      const rotateY = normalizedX * 4;
      const rotateX = normalizedY * -4;
      card.style.transition = "transform 110ms linear";
      card.style.transform = `translateY(-50%) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(paintPointer);
    };

    const resetCard = () => {
      if (!card) return;
      if (pointerFrame) {
        window.cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
      }
      card.style.transition = "transform 420ms cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.transform = "translateY(-50%) perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    const serviceHandlers = serviceCards.map((service) => {
      const handleServicePointer = (event: PointerEvent) => {
        if (!finePointer.matches || event.pointerType === "touch") return;
        const rect = service.getBoundingClientRect();
        service.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        service.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      };
      service.addEventListener("pointermove", handleServicePointer, { passive: true });
      return { service, handleServicePointer };
    });

    const solutionHandlers = solutionCards.map((solution) => {
      const originalTransform = solution.style.transform;
      const handleSolutionPointer = (event: PointerEvent) => {
        if (!finePointer.matches || event.pointerType === "touch") return;
        const rect = solution.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * 2 - 1;
        const y = clamp((event.clientY - rect.top) / rect.height, 0, 1) * 2 - 1;
        solution.style.transition = "transform 120ms linear, border-color 240ms ease, box-shadow 240ms ease";
        solution.style.transform = `perspective(900px) rotateX(${(-y * 4.5).toFixed(2)}deg) rotateY(${(x * 5.5).toFixed(2)}deg) translateY(-3px)`;
      };
      const resetSolution = () => {
        solution.style.transition = "transform 520ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms ease, box-shadow 240ms ease";
        solution.style.transform = originalTransform;
      };
      solution.addEventListener("pointermove", handleSolutionPointer, { passive: true });
      solution.addEventListener("pointerleave", resetSolution);
      return { solution, handleSolutionPointer, resetSolution, originalTransform };
    });

    const handlePointerChange = () => {
      if (!finePointer.matches) {
        resetCard();
        solutionHandlers.forEach(({ resetSolution }) => resetSolution());
      }
    };

    if (glide) glide.style.willChange = "transform";
    if (card) {
      card.style.willChange = "transform";
      card.addEventListener("pointermove", handlePointerMove, { passive: true });
      card.addEventListener("pointerleave", resetCard);
    }
    if (hero && glide) {
      paintScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll, { passive: true });
    }
    finePointer.addEventListener("change", handlePointerChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      card?.removeEventListener("pointermove", handlePointerMove);
      card?.removeEventListener("pointerleave", resetCard);
      finePointer.removeEventListener("change", handlePointerChange);
      serviceHandlers.forEach(({ service, handleServicePointer }) => {
        service.removeEventListener("pointermove", handleServicePointer);
        service.style.removeProperty("--spot-x");
        service.style.removeProperty("--spot-y");
      });
      solutionHandlers.forEach(
        ({ solution, handleSolutionPointer, resetSolution, originalTransform }) => {
          solution.removeEventListener("pointermove", handleSolutionPointer);
          solution.removeEventListener("pointerleave", resetSolution);
          solution.style.transform = originalTransform;
          solution.style.removeProperty("transition");
        },
      );
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      glide?.style.removeProperty("transform");
      glide?.style.removeProperty("will-change");
      card?.style.removeProperty("transform");
      card?.style.removeProperty("transition");
      card?.style.removeProperty("will-change");
    };
  }, [reducedMotion]);

  return null;
}
