import { useEffect } from "react";
import { openSiteAssistant } from "@/lib/site-assistant";
import type { AssistantPreset } from "@/types/assistant";

const heroPresets: AssistantPreset[] = ["inquiry", "calculator", "product", "inquiry"];

const heroLabels = [
  "Chatbot",
  "Chatbot s kalkulačkou",
  "Chatbot s konfigurátorom",
  "Chatbot pre e-shop",
];

const heroAnswers = [
  "Odpovie zákazníkom, poradí im a pošle vám pripravený dopyt.",
  "Vypočíta cenu, spotrebu alebo rozsah podľa vašich pravidiel.",
  "Prevedie zákazníka výberom produktu, variantov a doplnkov.",
  "Ukáže stav objednávky a pripraví zmenu, zrušenie, vrátenie alebo reklamáciu.",
];

const homeProcess = [
  {
    title: "Povieme si, čo má chatbot vybaviť",
    copy: "Pozrieme si váš web, ponuku a otázky zákazníkov. Vyberieme veci, ktoré vám dnes berú najviac času.",
    result: "Výstup: jasný zoznam toho, čo má chatbot robiť.",
  },
  {
    title: "Pripravíme otázky, odpovede a ukážku",
    copy: "Navrhneme jednoduchý postup pre dopyty, výber produktov, cenu, objednávky, reklamácie alebo termíny.",
    result: "Výstup: vlastná ukážka, ktorú si vyskúšate pred výrobou.",
  },
  {
    title: "Chatbota postavíme a spolu vyskúšame",
    copy: "Preveríme všetky bežné situácie na počítači aj mobile a upravíme veci, ktoré vám nesedia.",
    result: "Výstup: hotový chatbot pripravený na váš web.",
  },
  {
    title: "Pridáme ho na web a doladíme prvé výsledky",
    copy: "Prepojíme dopyty, objednávky alebo termíny s miestom, kde ich riešite, a po spustení skontrolujeme prvé otázky zákazníkov.",
    result: "Výstup: živý chatbot a pomoc aj po spustení.",
  },
];

function setText(selector: string, text: string): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (element) element.textContent = text;
}

function selectedHeroIndex(): number {
  const choices = Array.from(document.querySelectorAll<HTMLElement>(".lp-hero-pick"));
  const selected = choices.findIndex(
    (choice) => choice.dataset.active === "true" || choice.dataset.preview === "true",
  );
  return selected >= 0 ? selected : 0;
}

function updateHeroAnswer(index = selectedHeroIndex()): void {
  setText(".lp-assistant-answer span", heroAnswers[index] ?? heroAnswers[0]);
}

function prepareVisibleCopy(): void {
  setText(".lp-hero-context", "Chatboty pre e-shopy aj firmy so službami");
  setText(
    ".lp-hero-lead",
    "Chatbot odpovedá, pomôže s výberom, vypočíta cenu alebo vybaví objednávku či reklamáciu. Zákazník dostane pomoc hneď a vám príde pripravený dopyt.",
  );

  document.querySelectorAll<HTMLElement>(".lp-hero-pick-label").forEach((label, index) => {
    label.textContent = heroLabels[index] ?? label.textContent;
  });
  updateHeroAnswer();

  setText(
    ".lp-process .lp-heading-copy",
    "Rovnaký jasný postup platí pre chatbot na otázky, cenu, výber produktu, objednávky, reklamácie aj rezervácie.",
  );

  document.querySelectorAll<HTMLElement>(".lp-process .lp-tl-card").forEach((card, index) => {
    const step = homeProcess[index];
    if (!step) return;
    const title = card.querySelector<HTMLElement>("h3");
    const copy = card.querySelector<HTMLElement>("p:not(.lp-tl-result)");
    const result = card.querySelector<HTMLElement>(".lp-tl-result");
    if (title) title.textContent = step.title;
    if (copy) copy.textContent = step.copy;
    if (result) result.textContent = step.result;
  });
}

function capabilityPreset(button: Element): AssistantPreset | undefined {
  const groupTitle = button.closest(".lp-caps-row")?.querySelector("h3")?.textContent?.trim();
  if (groupTitle === "Kalkulačky") return "calculator";
  if (groupTitle === "Konfigurátory") return "product";
  if (groupTitle === "Chatboty") return "inquiry";
  return undefined;
}

export function SiteFunnelBridge(): null {
  useEffect(() => {
    const firstFrame = window.requestAnimationFrame(prepareVisibleCopy);

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const heroChoice = target.closest(".lp-hero-pick");
      if (heroChoice) {
        const choices = Array.from(document.querySelectorAll(".lp-hero-pick"));
        const index = choices.indexOf(heroChoice);
        window.requestAnimationFrame(() => updateHeroAnswer(index));
        return;
      }

      const heroButton = target.closest(".lp-assistant-cta");
      if (heroButton) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const index = selectedHeroIndex();
        openSiteAssistant({
          source: "hero-card",
          preset: heroPresets[index] ?? "inquiry",
          category: heroLabels[index] ?? heroLabels[0],
        });
        return;
      }

      const capabilityButton = target.closest(".lp-caps-detail-cta");
      if (capabilityButton) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        openSiteAssistant({
          source: "capability-choice",
          preset: capabilityPreset(capabilityButton),
          category: capabilityButton.closest(".lp-caps-detail")?.querySelector("h4")?.textContent ?? undefined,
        });
        return;
      }

      const askButton = target.closest(".lp-faq-ask, .lp-caps-note button");
      if (askButton) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        openSiteAssistant({ entry: "recommend", source: "website-question" });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
