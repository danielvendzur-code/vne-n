import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { usePointerDepth } from "@/hooks/usePointerDepth";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";
import { SCENARIOS, type SurfaceKey } from "./surface-scenarios";
import "./ProductSurface.css";

/**
 * Produktová plocha.
 *
 * Jediná vec na webe, ktorá ukazuje samotný produkt — a je to tá istá
 * plocha, nech stojí v hero, v sekcii možností alebo pri realizácii.
 * Návštevník si vyberie, čo má web robiť, a hneď vidí rozhovor aj to,
 * čo z neho firme vypadne.
 *
 * Tvar je odvodený zo značky: bublina v logu má tri zaoblené rohy a
 * pätku, rovnaký zápis má plocha, riadky výberu aj repliky.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ProductSurface({
  initial = "objednavky",
  source = "surface",
  className = "",
}: {
  initial?: SurfaceKey;
  /** Odkiaľ sa chatbot otvoril — pre meranie. */
  source?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<SurfaceKey>(initial);
  const activeIndex = Math.max(
    0,
    SCENARIOS.findIndex((item) => item.key === active),
  );
  const scenario = SCENARIOS[activeIndex] ?? SCENARIOS[0];
  const pickerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = usePointerDepth<HTMLDivElement>();

  /**
   * Výber je prepínač kariet, takže sa po ňom chodí šípkami, nie
   * tabulátorom — ten z neho vyskočí na obsah. Bez tohto by sa
   * klávesnicou dal vybrať len práve otvorený scenár.
   */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;

    let next = activeIndex;
    if (step !== 0) next = (activeIndex + step + SCENARIOS.length) % SCENARIOS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = SCENARIOS.length - 1;
    else return;

    event.preventDefault();
    setActive(SCENARIOS[next].key);
    pickerRef.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  return (
    <div className={`mc2-surface mc2-dark ${className}`.trim()} ref={surfaceRef}>
      <div className="mc2-surface__head">
        <span className="mc2-surface__label" id="mc2-surface-label">
          Čo má web robiť
        </span>
        <span className="mc2-surface__count" aria-hidden="true">
          {scenario.index}
          <i>/ 0{SCENARIOS.length}</i>
        </span>
      </div>

      <div
        className="mc2-surface__picker"
        role="tablist"
        aria-labelledby="mc2-surface-label"
        ref={pickerRef}
        onKeyDown={onKeyDown}
      >
        {SCENARIOS.map((item) => (
          <button
            type="button"
            key={item.key}
            role="tab"
            id={`mc2-tab-${item.key}`}
            aria-selected={item.key === active}
            aria-controls="mc2-surface-panel"
            tabIndex={item.key === active ? 0 : -1}
            className="mc2-surface__pick"
            data-active={item.key === active}
            onClick={() => setActive(item.key)}
          >
            {item.key === active && !reduced ? (
              // Podklad sa medzi riadkami presunie, nezhasne a nerozsvieti
              // sa. Jediná layout animácia na celej ploche.
              <motion.span
                className="mc2-surface__pick-fill"
                layoutId="mc2-surface-pick"
                transition={{ duration: 0.42, ease: EASE }}
              />
            ) : null}
            <span className="mc2-surface__num">{item.index}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <p className="mc2-surface__note">
        <span className="mc2-surface__tag">{scenario.tag}</span>
        {scenario.note}
      </p>

      <div
        className="mc2-surface__panel"
        id="mc2-surface-panel"
        role="tabpanel"
        aria-labelledby={`mc2-tab-${scenario.key}`}
      >
        <div className="mc2-surface__demo" key={scenario.key}>
          <motion.ol
            className="mc2-surface__thread"
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {scenario.turns.map((turn) => (
              <motion.li
                key={turn.text}
                className="mc2-surface__turn"
                data-who={turn.who === "Chatbot" ? "bot" : "customer"}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.985 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.42, ease: EASE },
                  },
                }}
              >
                <span className="mc2-surface__bubble">{turn.text}</span>
              </motion.li>
            ))}
          </motion.ol>

          <motion.div
            className="mc2-surface__result"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, ease: EASE, delay: reduced ? 0 : 0.5 }}
          >
            <span className="mc2-surface__result-who">{scenario.resultLabel}</span>
            <span className="mc2-surface__result-text">{scenario.result}</span>
          </motion.div>
        </div>
      </div>

      {/* Nie formulár — tlačidlo, ktoré otvorí naozajstného chatbota
          v režime vybraného scenára. Zároveň dáva ukážke dno. */}
      <button
        type="button"
        className="mc2-surface__ask"
        aria-label="Vyskúšať chatbota naživo"
        onClick={() => openSiteAssistant({ source, preset: scenario.preset })}
      >
        <span className="mc2-surface__ask-text">Napíšte, čo potrebujete…</span>
        <span className="mc2-surface__ask-go" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </button>
    </div>
  );
}
