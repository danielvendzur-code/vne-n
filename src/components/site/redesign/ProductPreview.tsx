import { Bot, ArrowUp, Phone, Mail, X, Fence, Check, Leaf, Sparkles } from "lucide-react";
import s from "./ProductPreview.module.css";

export type PreviewKind = "chatbot" | "calculator" | "advisor";

/* Presentation only: these previews never send a message or a lead. */
export function ProductPreview({
  kind = "chatbot",
  client = "WEBKO",
  compact = false,
}: {
  kind?: PreviewKind;
  client?: "WEBKO" | "Môj Plot" | "DERAT" | "Koverta";
  compact?: boolean;
}) {
  const calc = kind === "calculator";
  const advisor = kind === "advisor";
  const green = calc || client === "Môj Plot";
  return (
    <div
      className={s.frame}
      data-product-preview={kind}
      data-compact={compact || undefined}
      data-theme={
        green
          ? "green"
          : advisor
            ? "paper"
            : client === "DERAT"
              ? "derat"
              : client === "Koverta"
                ? "koverta"
                : "blue"
      }
    >
      <div className={s.head}>
        <span className={s.avatar}>
          {calc ? <Fence size={22} /> : advisor ? <Leaf size={22} /> : <Bot size={22} />}
        </span>
        <div>
          <strong>
            {calc
              ? "Kalkulačka Môj Plot"
              : advisor
                ? "Váš produktový poradca"
                : `${client} AI Asistent`}
          </strong>
          <small>
            <i /> Online · pomôžeme vám s výberom
          </small>
        </div>
        <X size={17} className={s.close} />
      </div>
      <div className={s.content}>
        {calc ? (
          <>
            <div className={s.price}>
              <span>CENA VAŠEJ ZOSTAVY</span>
              <strong>
                892 <small>€</small>
              </strong>
              <p>Materiál aj montáž podľa zvolených parametrov.</p>
            </div>
            <div className={s.summary}>
              <h4>
                <Fence size={16} /> Váš panelový plot
              </h4>
              <dl>
                {[
                  ["Dĺžka plotu", "20 m · 8 panelov"],
                  ["Výška panela", "153 cm"],
                  ["Hrúbka drôtu", "4 mm"],
                  ["Farba", "Antracit RAL 7016"],
                  ["Stĺpik", "Hranatý 60 × 40 mm"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={s.complete}>
              <Check size={16} /> Výpočet je pripravený
            </div>
            <div className={s.composer}>
              Upraviť zostavu <ArrowUp size={17} />
            </div>
          </>
        ) : advisor ? (
          <>
            <p className={s.bot}>
              Nájdeme starostlivosť, ktorá sedí vašej pleti. Čo je pre vás najdôležitejšie?
            </p>
            <div className={s.chips}>
              <span data-selected>Hydratácia</span>
              <span>Citlivá pleť</span>
              <span>Každodenná rutina</span>
            </div>
            <div className={s.recommendation}>
              <span className={s.product}>
                <Leaf size={34} strokeWidth={1} />
              </span>
              <div>
                <small>ODPORÚČANÉ PRE VÁS</small>
                <h4>Jemná denná hydratácia</h4>
                <p>Ľahké zloženie pre suchú a citlivú pleť.</p>
              </div>
            </div>
            <p className={s.bot}>
              <Sparkles size={16} /> Tento produkt zodpovedá vašim potrebám. Poradca vysvetlí výber
              aj použitie.
            </p>
            <div className={s.composer}>
              Pozrieť odporúčanie <ArrowUp size={17} />
            </div>
          </>
        ) : (
          <>
            <p className={s.bot}>
              {compact ? (
                "Dobrý deň! Pomôžem vám s výberom a cenou. Čo potrebujete?"
              ) : (
                <>
                  Dobrý deň! Som AI asistent{" "}
                  <strong>
                    {client === "WEBKO"
                      ? "webko.sk"
                      : client === "Môj Plot"
                        ? "mojplot.sk"
                        : client === "DERAT"
                          ? "derat.sk"
                          : "koverta.sk"}
                  </strong>
                  .{" "}
                  {client === "DERAT"
                    ? "Najrýchlejší odhad ceny získate v kalkulačke. Pomôžem vám vybrať službu."
                    : client === "Koverta"
                      ? "Pomôžem vám s výberom prístrešku, pergoly a doplnkov."
                      : "Pomôžem vám s výberom, cenou aj ďalším krokom."}
                </>
              )}
            </p>
            {!compact && (
              <div className={s.chips}>
                <span>Pomôžte mi vybrať</span>
                <span>Chcem poznať cenu</span>
              </div>
            )}
            {!compact && <p className={s.user}>Ako mi môžete pomôcť?</p>}
            {!compact && (
              <p className={`${s.bot} ${s.response}`}>
                <span>Odpoviem na vaše otázky a odporučím riešenie podľa vašich potrieb.</span>
                <span className={s.dots}>
                  <i />
                  <i />
                  <i />
                </span>
              </p>
            )}
            <div className={s.composer}>
              Napíšte správu… <ArrowUp size={17} />
            </div>
          </>
        )}
      </div>
      <div className={s.foot}>
        <span>
          <Phone size={14} /> Zavolať
        </span>
        <span>
          <Mail size={14} /> E-mail
        </span>
        <small>
          {calc
            ? "mojplot.sk"
            : advisor
              ? "Výber podľa vášho katalógu"
              : client === "WEBKO"
                ? "webko.sk"
                : client === "Môj Plot"
                  ? "mojplot.sk"
                  : `${client.toLowerCase()}.sk`}
        </small>
      </div>
    </div>
  );
}
