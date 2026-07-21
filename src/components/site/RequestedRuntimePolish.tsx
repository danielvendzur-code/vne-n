import { useEffect } from "react";
import { openSiteAssistant } from "@/lib/site-assistant";

const setText = (element: Element | null, text: string) => {
  if (element && element.textContent !== text) element.textContent = text;
};

export function RequestedRuntimePolish() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let frame = 0;

    const apply = () => {
      frame = 0;

      const valueEyebrow = document.querySelector<HTMLElement>(".lp-value .lp-eyebrow");
      if (valueEyebrow) {
        const marker = valueEyebrow.querySelector("i");
        valueEyebrow.replaceChildren();
        if (marker) valueEyebrow.append(marker);
        valueEyebrow.append(document.createTextNode("Rozdiel v praxi"));
      }

      const drawerLinks = Array.from(
        document.querySelectorAll<HTMLAnchorElement>("#site-navigation-drawer a[href]"),
      );
      drawerLinks.forEach((link) => {
        const label = link.textContent?.trim();
        if (label === "Služby") setText(link, "Chatboty a riešenia");
        if (label === "Projekty") setText(link, "Ukážky");
        if (label === "Postup") setText(link, "Spolupráca");
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
      setText(
        document.querySelector(".site-menu-brand small"),
        "chatboty a konverzné nástroje na mieru",
      );

      const solutionCards = Array.from(document.querySelectorAll<HTMLElement>(".lp-solution-pill"));
      solutionCards.forEach((card, index) => {
        const content = card.querySelector<HTMLElement>(":scope > div");
        if (!content) return;
        if (index === 1) {
          setText(content.querySelector("h3"), "Chatbot s kalkulačkou alebo konfigurátorom");
        }
        if (content.querySelector(".lp-solution-cta")) return;

        const title = content.querySelector("h3")?.textContent?.trim() ?? "chatbot";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "lp-solution-cta";
        button.innerHTML = 'Navrhnúť toto riešenie <span aria-hidden="true">↗</span>';
        const onClick = () =>
          openSiteAssistant({ source: "solution-card", entry: "builder", category: title });
        button.addEventListener("click", onClick);
        content.appendChild(button);
        cleanups.push(() => {
          button.removeEventListener("click", onClick);
          button.remove();
        });
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    apply();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
