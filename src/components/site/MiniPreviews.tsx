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
    accentSoft: accent ? `${accent}22` : "var(--primary-soft)",
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
        {["Konzultácia", "Obhliadka", "Ponuka", "Iné"].map((c, i) => (
          <span
            key={c}
            className="rounded-full px-2.5 py-1 text-xs"
            style={{
              backgroundColor: i === 1 ? accentSoft : "transparent",
              border: `1px solid ${i === 1 ? a : "var(--border-strong)"}`,
              color: "var(--text-primary)",
            }}
          >
            {c}
          </span>
        ))}
      </div>
      <div
        className="rounded-lg px-3 py-2 text-xs"
        style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <div style={{ color: "var(--text-secondary)" }} className="mb-1">Zhrnutie</div>
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
          <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Orientačný rozsah</div>
          <div className="text-lg font-semibold tabular-nums" style={{ color: a }}>1 240 – 1 480 €</div>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[11px]"
          style={{ backgroundColor: a, color: "var(--primary-foreground)" }}
        >
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
      <div className="mt-3 mb-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>Variant</div>
      <div className="flex gap-1.5 mb-3">
        {["A", "B", "C", "D"].map((v, i) => (
          <span
            key={v}
            className="rounded-md px-2.5 py-1 text-xs"
            style={{
              backgroundColor: i === 1 ? accentSoft : "transparent",
              border: `1px solid ${i === 1 ? a : "var(--border-strong)"}`,
            }}
          >
            {v}
          </span>
        ))}
      </div>
      <div className="mb-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>Farba</div>
      <div className="flex gap-1.5 mb-3">
        {["#175e50", "#c9a85f", "#e58a5b", "#5e6964"].map((c, i) => (
          <span
            key={c}
            className="h-6 w-6 rounded-full"
            style={{
              backgroundColor: c,
              outline: i === 0 ? `2px solid ${a}` : "none",
              outlineOffset: 2,
            }}
          />
        ))}
      </div>
      <div
        className="rounded-lg px-3 py-2 text-xs flex justify-between"
        style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <span style={{ color: "var(--text-secondary)" }}>Výber</span>
        <span className="font-medium">Variant B · zelená</span>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-md px-2.5 py-2"
      style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
    >
      <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{label}</div>
      <div className="text-sm font-medium tabular-nums" style={{ color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

function StepBar({ step, total, accent }: { step: number; total: number; accent: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-1 flex-1 rounded-full"
          style={{ backgroundColor: i < step ? accent : "var(--border-strong)" }}
        />
      ))}
    </div>
  );
}
