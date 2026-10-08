import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { sitePath } from "./utils";
import s from "./SkincareAdvisor.module.css";

const choices = [
  {
    id: "dry",
    label: "Suchá",
    product: "Hydratačný krém",
    reason: "Pre suchú pleť sme v ukážkovom katalógu vybrali krém s bohatšou textúrou.",
    detail: "Bohatá textúra · bez parfumácie",
  },
  {
    id: "sensitive",
    label: "Citlivá",
    product: "Jemná starostlivosť",
    reason: "Pre citlivú pleť sme vybrali jednoduchú starostlivosť bez parfumácie.",
    detail: "Ľahká textúra · bez parfumácie",
  },
  {
    id: "oily",
    label: "Mastná",
    product: "Ľahký hydratačný gél",
    reason: "Pre mastnú pleť sme vybrali ľahkú gélovú textúru namiesto hutného krému.",
    detail: "Gélová textúra · bez olejov",
  },
] as const;

/** Working, anonymous catalog demo; it never changes the client's real advisor or pricing. */
export function SkincareAdvisor() {
  const [skin, setSkin] = useState<string | null>(null);
  const selected = choices.find((choice) => choice.id === skin);
  return (
    <section
      className={s.demo}
      aria-label="Ukážka poradcu pre pleťovú kozmetiku"
      data-skincare-demo
    >
      <header className={s.head}>
        <span className={s.dot} aria-hidden="true" />
        <strong>Pleťová starostlivosť</strong>
        <span>Poradca</span>
      </header>
      <div className={s.body}>
        <p className={s.intro}>Starostlivosť podľa vašej pleti.</p>
        <h3>Aký je váš typ pleti?</h3>
        <div className={s.choices} aria-label="Typ pleti">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              aria-pressed={skin === choice.id}
              onClick={() => setSkin(choice.id)}
            >
              {choice.label}
              {skin === choice.id ? <Check size={14} aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
        <div className={s.result} aria-live="polite" aria-atomic="true">
          {selected ? (
            <div className={s.recommendation} key={selected.id}>
              <img
                src={sitePath("/work/solutions/skincare-photo.webp")}
                alt="Neznačková ilustrácia pleťovej starostlivosti"
                width={120}
                height={120}
              />
              <div>
                <span>ODPORÚČANIE Z KATALÓGU</span>
                <h4>{selected.product}</h4>
                <p>{selected.detail}</p>
              </div>
              <p className={s.reason}>{selected.reason}</p>
            </div>
          ) : (
            <p className={s.empty}>
              Vyberte typ pleti. Poradca ukáže vhodnú textúru a vysvetlí svoj výber.{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </p>
          )}
        </div>
      </div>
      <footer>Ukážkový katalóg · ilustračné odporúčanie.</footer>
    </section>
  );
}
