import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const dragGroupSelector = [
  ".lp-assistant-chips",
  ".lp-switch",
  ".lp-caps-chips",
  ".cw-quick-replies",
  ".cw-rows",
  ".cw-grid",
].join(", ");

const dragSelectSelector = ".lp-assistant-chips, .lp-switch";

export function SiteMotionEnhancements() {
  const reducedMotion = useReducedMotion();

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
    const cleanups = new Map<HTMLElement, () => void>();

    const install = (element: HTMLElement) => {
      if (cleanups.has(element)) return;

      const isSelectGroup = element.matches(dragSelectSelector);
      let pointerId: number | null = null;
      let startX = 0;
      let startY = 0;
      let startScrollLeft = 0;
      let horizontalDrag = false;
      let suppressClickUntil = 0;
      let syntheticClick = false;
      let dragTarget: HTMLElement | null = null;

      element.dataset.dragReady = "true";

      const clearDragTarget = () => {
        dragTarget?.removeAttribute("data-drag-target");
        dragTarget = null;
      };

      const buttonAt = (clientX: number, clientY: number) => {
        const buttons = Array.from(element.querySelectorAll<HTMLElement>("button"));
        const geometricMatch = buttons.find((button) => {
          const rect = button.getBoundingClientRect();
          return (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          );
        });
        if (geometricMatch) return geometricMatch;

        const hit = document.elementFromPoint(clientX, clientY);
        const button = hit instanceof Element ? hit.closest<HTMLElement>("button") : null;
        return button && element.contains(button) ? button : null;
      };

      const isScrollable = () => !isSelectGroup && element.scrollWidth > element.clientWidth + 2;

      const onPointerDown = (event: PointerEvent) => {
        if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest("input, textarea, select, a")) return;

        pointerId = event.pointerId;
        startX = event.clientX;
        startY = event.clientY;
        startScrollLeft = element.scrollLeft;
        horizontalDrag = false;
        element.dataset.dragging = "false";
        element.setPointerCapture?.(event.pointerId);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return;
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if (!horizontalDrag) {
          const crossedThreshold = Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY) + 2;
          if (!crossedThreshold) return;
          horizontalDrag = true;
          element.dataset.dragging = "true";
        }

        event.preventDefault();
        if (isScrollable()) {
          element.scrollLeft = startScrollLeft - deltaX;
          return;
        }

        if (isSelectGroup) {
          const nextTarget = buttonAt(event.clientX, event.clientY);
          if (nextTarget !== dragTarget) {
            clearDragTarget();
            dragTarget = nextTarget;
            dragTarget?.setAttribute("data-drag-target", "true");
          }
        }
      };

      const finishPointer = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return;

        if (horizontalDrag) {
          suppressClickUntil = performance.now() + 120;
          if (isSelectGroup) {
            const targetButton = buttonAt(event.clientX, event.clientY) ?? dragTarget;
            if (targetButton && targetButton.getAttribute("aria-disabled") !== "true") {
              syntheticClick = true;
              targetButton.click();
              syntheticClick = false;
            }
          }
        }

        clearDragTarget();
        element.dataset.dragging = "false";
        if (element.hasPointerCapture?.(event.pointerId)) {
          element.releasePointerCapture(event.pointerId);
        }
        pointerId = null;
        horizontalDrag = false;
      };

      const onClickCapture = (event: MouseEvent) => {
        if (syntheticClick) return;
        if (performance.now() < suppressClickUntil) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      };

      element.addEventListener("pointerdown", onPointerDown);
      element.addEventListener("pointermove", onPointerMove, { passive: false });
      element.addEventListener("pointerup", finishPointer);
      element.addEventListener("pointercancel", finishPointer);
      element.addEventListener("click", onClickCapture, true);

      cleanups.set(element, () => {
        clearDragTarget();
        element.removeEventListener("pointerdown", onPointerDown);
        element.removeEventListener("pointermove", onPointerMove);
        element.removeEventListener("pointerup", finishPointer);
        element.removeEventListener("pointercancel", finishPointer);
        element.removeEventListener("click", onClickCapture, true);
        delete element.dataset.dragReady;
        delete element.dataset.dragging;
      });
    };

    const scan = (root: ParentNode = document) => {
      root.querySelectorAll<HTMLElement>(dragGroupSelector).forEach(install);
    };

    scan();
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(dragGroupSelector)) install(node);
          scan(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanups.forEach((remove) => remove());
      cleanups.clear();
    };
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
    if ((!hero || !glide || !card) && !serviceCards.length) return;

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

    const handlePointerChange = () => {
      if (!finePointer.matches) resetCard();
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
