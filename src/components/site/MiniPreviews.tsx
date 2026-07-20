/**
 * Miniature interface previews used across the site.
 * Deliberately static-looking but composed of real UI shapes
 * (fields, chips, progress, summary rows) — not line art.
 */

interface MiniProps {
  compact?: boolean;
  accent?: string;
}

function usePalette(accent?: string) {
  return {
    accent: accent ?? "var(--primary)",
    accentSoft: accent
      ? `color-mix(in oklab, ${accent} 16%, var(--surface))`
      : "var(--primary-soft)",
  };
}

export function AssistantMini({ compact, accent }: MiniProps) {
  const { accent: a, accentSoft } = usePalette(accent);
  return (
    <div className={compact ? "p-3" : "p-4"} style={{ backgroundColor: "var(--surface)" }}>
      <div className="mb-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>
        Otázka 2 z 4
      </div>
      <div
        className="rounded-lg px-3 py-2 text-sm mb-2 max-w-[85%]"
        style={{ backgroundColor: "var(--background-soft)", color: "var(--text-primary)" }}
      >
        Aký typ služby vás zaujíma?
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {["Konzultácia", "Obhliadka", "Ponuka", "Iné"].map((choice, index) => (
          <ChoiceChip
            key={choice}
            label={choice}
            index={index + 1}
            selected={index === 1}
            accent={a}
            accentSoft={accentSoft}
          />
        ))}
      </div>
      <div
        className="rounded-lg px-3 py-2 text-xs"
        style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <div style={{ color: "var(--text-secondary)" }} className="mb-1">
          Zhrnutie
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--text-primary)" }}>Typ</span>
          <span className="font-medium">Obhliadka</span>
        </div>
      </div>
    </div>
  );
}

export function CalculatorMini({ compact, accent }: MiniProps) {
  const { accent: a } = usePalette(accent);
  return (
    <div className={compact ? "p-3" : "p-4"} style={{ backgroundColor: "var(--surface)" }}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Field label="Rozmery" value="42 m" />
        <Field label="Materiál" value="Variant B" />
        <Field label="Doprava" value="35 km" />
        <Field label="Montáž" value="Áno" />
      </div>
      <div
        className="rounded-lg p-3 flex items-center justify-between"
        style={{ backgroundColor: "var(--background-soft)", border: "1px solid var(--border)" }}
      >
        <div>
          <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            Orientačný rozsah
          </div>
          <div className="text-lg font-semibold tabular-nums" style={{ color: a }}>
            1 240 – 1 480 €
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold"
          style={{
            backgroundColor: a,
            border: "1px solid color-mix(in oklab, white 30%, transparent)",
            color: "var(--primary-foreground)",
          }}
        >
          <i className="h-2 w-0.5 rounded-full bg-current opacity-55" aria-hidden="true" />
          Prepočítať
        </span>
      </div>
    </div>
  );
}

export function ConfiguratorMini({ compact, accent }: MiniProps) {
  const { accent: a, accentSoft } = usePalette(accent);
  return (
    <div className={compact ? "p-3" : "p-4"} style={{ backgroundColor: "var(--surface)" }}>
      <StepBar step={2} total={3} accent={a} />
      <div className="mt-3 mb-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>
        Variant
      </div>
      <div className="flex gap-1.5 mb-3">
        {["A", "B", "C", "D"].map((variant, index) => (
          <ChoiceChip
            key={variant}
            label={variant}
            index={index + 1}
            selected={index === 1}
            accent={a}
            accentSoft={accentSoft}
            compact
          />
        ))}
      </div>
      <div className="mb-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>
        Farba
      </div>
      <div className="flex gap-2 mb-3">
        {["#7bcbe3", "#5f91b5", "#9fcfe0", "#c4e3ec"].map((color, index) => (
          <span
            key={color}
            className="h-6 w-6 rounded-md"
            style={{
              backgroundColor: color,
              border: "1px solid color-mix(in oklab, white 25%, transparent)",
              boxShadow:
                index === 0
                  ? `0 0 0 2px var(--surface), 0 0 0 3px ${a}`
                  : "inset 0 1px rgba(255,255,255,.22)",
            }}
          />
        ))}
      </div>
      <div
        className="rounded-lg px-3 py-2 text-xs flex justify-between"
        style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <span style={{ color: "var(--text-secondary)" }}>Výber</span>
        <span className="font-medium">Variant B · modrá</span>
      </div>
    </div>
  );
}

function ChoiceChip({
  label,
  index,
  selected,
  accent,
  accentSoft,
  compact = false,
}: {
  label: string;
  index: number;
  selected: boolean;
  accent: string;
  accentSoft: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md py-1 text-[11px] font-medium ${
        compact ? "px-2" : "px-2.5"
      }`}
      style={{
        backgroundColor: selected
          ? accentSoft
          : "color-mix(in oklab, var(--surface-raised) 52%, transparent)",
        border: `1px solid ${selected ? accent : "var(--border-strong)"}`,
        color: selected ? "var(--text-primary)" : "var(--text-secondary)",
      }}
    >
      <small
        className="font-mono text-[8px] leading-none opacity-60"
        style={{ color: selected ? accent : "inherit" }}
      >
        {String(index).padStart(2, "0")}
      </small>
      {label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-md px-2.5 py-2"
      style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
    >
      <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
        {label}
      </div>
      <div className="text-sm font-medium tabular-nums" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
    </div>
  );
}

function StepBar({ step, total, accent }: { step: number; total: number; accent: string }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className="h-1 flex-1 rounded-sm"
          style={{ backgroundColor: index < step ? accent : "var(--border-strong)" }}
        />
      ))}
    </div>
  );
}
