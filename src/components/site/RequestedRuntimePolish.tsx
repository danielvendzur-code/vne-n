import { useEffect } from "react";
import { openSiteAssistant } from "@/lib/site-assistant";

const setText = (element: Element | null, text: string) => {
  if (element && element.textContent !== text) element.textContent = text;
};

const solutionCopy = [
  {
    title: "Chatbot na mieru",
    copy: "Odpovedá na otázky, poradí návštevníkovi a odovzdá vám kontakt spolu s celým kontextom.",
  },
  {
    title: "Chatbot s kalkulačkou",
    copy: "Počas rozhovoru vypočíta cenu, spotrebu alebo návratnosť presne podľa pravidiel vašej služby.",
  },
  {
    title: "Chatbot s konfigurátorom",
    copy: "Prevedie zákazníka výberom produktu, variantov a doplnkov a odošle hotovú špecifikáciu.",
  },
] as const;

const heroAnswers: Record<string, string> = {
  Chatbot: "Odpovie 24/7, zistí potrebu zákazníka a pripraví dopyt, na ktorý môžete rovno reagovať.",
  "S kalkulačkou": "Chatbot sa pýta prirodzene a počas rozhovoru vypočíta cenu alebo rozsah zákazky.",
  "S konfigurátorom": "Chatbot prevedie zákazníka výberom a odošle vám kompletné zadanie bez ďalšieho vypytovania.",
};

export function RequestedRuntimePolish() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const enhancedCards = new WeakSet<HTMLElement>();
    let frame = 0;

    const apply = () => {
      frame = 0;

      document.querySelectorAll<HTMLElement>(".site-brand-name").forEach((brand) =>
        setText(brand, "Daniel Vendžúr"),
      );
      setText(document.querySelector(".site-menu-brand > span"), "Daniel Vendžúrchatboty a konverzné nástroje na mieru");
      const menuBrand = document.querySelector<HTMLElement>(".site-menu-brand > span");
      if (menuBrand) {
        const small = menuBrand.querySelector("small");
        if (menuBrand.firstChild?.nodeType === Node.TEXT_NODE) {
          menuBrand.firstChild.textContent = "Daniel Vendžúr";
        }
        setText(small, "chatboty a konverzné nástroje na mieru");
      }

      const hero = document.querySelector<HTMLElement>(".lp-hero");
      if (hero) {
        const lines = Array.from(hero.querySelectorAll<HTMLElement>(".lp-hero-line > *"));
        ["Chatboty, ktoré", "zvyšujú konverzie", "a pripravujú dopyty."].forEach(
          (text, index) => setText(lines[index] ?? null, text),
        );
        hero
          .querySelector("h1")
          ?.setAttribute("aria-label", "Chatboty, ktoré zvyšujú konverzie a pripravujú dopyty.");
        setText(
          hero.querySelector(".lp-hero-lead"),
          "Navrhujem chatboty na mieru — od jednoduchého asistenta až po chatbot s kalkulačkou, konfigurátorom alebo rezerváciami. Zákazník dostane odpoveď hneď a vy pripravený dopyt.",
        );
        setText(hero.querySelector(".lp-assistant-card > p"), "Čo má váš chatbot zvládnuť?");

        const toolLabels = Array.from(
          hero.querySelectorAll<HTMLElement>(".lp-assistant-chips .lp-control-label"),
        );
        ["Chatbot", "S kalkulačkou", "S konfigurátorom"].forEach((label, index) =>
          setText(toolLabels[index] ?? null, label),
        );

        const activeLabel = hero
          .querySelector<HTMLElement>(".lp-assistant-chips button[data-active='true'] .lp-control-label")
          ?.textContent?.trim();
        if (activeLabel) setText(hero.querySelector(".lp-assistant-answer span"), heroAnswers[activeLabel] ?? "");

        const primaryText = hero.querySelector<HTMLElement>(".lp-button-primary .lp-button-content");
        if (primaryText?.firstChild?.nodeType === Node.TEXT_NODE) {
          primaryText.firstChild.textContent = "Chcem chatbot na mieru ";
        }
      }

      const valueEyebrow = document.querySelector<HTMLElement>(".lp-value .lp-eyebrow");
      if (valueEyebrow && valueEyebrow.textContent?.trim() !== "Rozdiel v praxi") {
        const marker = valueEyebrow.querySelector("i");
        valueEyebrow.replaceChildren();
        if (marker) valueEyebrow.append(marker);
        valueEyebrow.append(document.createTextNode("Rozdiel v praxi"));
      }

      const comparisonLabels = Array.from(
        document.querySelectorAll<HTMLElement>(".lp-switch .lp-control-label"),
      );
      setText(comparisonLabels[0] ?? null, "Bez chatbota");
      setText(comparisonLabels[1] ?? null, "S chatbotom");

      const drawerLabels = [
        ["/sluzby", "Chatboty a riešenia"],
        ["/projekty", "Ukážky"],
        ["/postup", "Spolupráca"],
      ] as const;
      drawerLabels.forEach(([href, label]) => {
        setText(
          document.querySelector(
            `#site-navigation-drawer a[href$="${href}"] .rb-line-sidebar__text`,
          ),
          label,
        );
      });

      const menuSolutionButtons = Array.from(
        document.querySelectorAll<HTMLButtonElement>(".site-menu-solution"),
      );
      const menuCopy = [
        ["AI chatbot na mieru", "Odpovede, kvalifikácia a pripravený dopyt 24/7."],
        ["Chatbot s kalkulačkou", "Rozhovor, ktorý zároveň vypočíta cenu, spotrebu či návratnosť."],
        ["Chatbot s konfigurátorom", "Prevedie výberom produktu a odošle kompletnú špecifikáciu."],
      ] as const;
      menuSolutionButtons.forEach((button, index) => {
        const copy = menuCopy[index];
        if (!copy) return;
        setText(button.querySelector("b"), copy[0]);
        setText(button.querySelector("small"), copy[1]);
      });
      setText(document.querySelector(".site-menu-services > .site-menu-eyebrow"), "Chatboty");

      const solutionCards = Array.from(document.querySelectorAll<HTMLElement>(".lp-solution-pill"));
      solutionCards.forEach((card, index) => {
        const content = card.querySelector<HTMLElement>(":scope > div");
        const definition = solutionCopy[index];
        if (!content || !definition) return;

        setText(content.querySelector("h3"), definition.title);
        setText(content.querySelector("p"), definition.copy);

        if (!content.querySelector(".lp-solution-cta")) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "lp-solution-cta";
          button.innerHTML = 'Navrhnúť tento chatbot <span aria-hidden="true">↗</span>';
          const onClick = () =>
            openSiteAssistant({
              source: "solution-card",
              entry: "builder",
              category: definition.title,
            });
          button.addEventListener("click", onClick);
          content.appendChild(button);
          cleanups.push(() => {
            button.removeEventListener("click", onClick);
            button.remove();
          });
        }

        if (enhancedCards.has(card)) return;
        enhancedCards.add(card);
        const onPointerMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5;
          const y = (event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5;
          card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
          card.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
        };
        const onPointerLeave = () => {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        };
        card.addEventListener("pointermove", onPointerMove, { passive: true });
        card.addEventListener("pointerleave", onPointerLeave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", onPointerMove);
          card.removeEventListener("pointerleave", onPointerLeave);
          card.style.removeProperty("--tilt-x");
          card.style.removeProperty("--tilt-y");
        });
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    apply();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}