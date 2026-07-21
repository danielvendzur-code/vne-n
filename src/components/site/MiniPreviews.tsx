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
  const a = accent ?? "var(--primary)";
  return {
    accent: a,
    accentSoft: `color-mix(in oklab, ${a} 20%, transparent)`,
    accentInk: accent ? `color-mix(in oklab, ${a} 26%, #06120d)` : "#06120d",
  };
}

/** Rounded pill used inside previews; active state fills with the card accent. */
function Chip({
  children,
  active,
  accent,
}: {
  children: string;
  active?: boolean;
  accent: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "0.28rem 0.7rem",
        fontSize: "0.72rem",
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        border: `1px solid ${active ? "transparent" : "var(--border-strong)"}`,
        color: active ? "#06120d" : "var(--text-secondary)",
        background: active ? accent : "transparent",
        boxShadow: active ? `0 6px 16px -10px ${accent}` : "none",
      }}
    >
      {children}
    </span>
  );
}

export function AssistantMini({ compact, accent }: MiniProps) {
  const { accent: a } = usePalette(accent);
  return (
    <div className={compact ? "p-3.5" : "p-4"} style={{ backgroundColor: "var(--surface)" }}>
      <div
        className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-light)" }}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: a }} />
        Otázka 2 z 4
      </div>
      <div
        className="mb-2.5 max-w-[88%] rounded-2xl rounded-tl-md px-3 py-2 text-sm"
        style={{ backgroundColor: "var(--background-soft)", color: "var(--text-primary)" }}
      >
        Aký typ služby vás zaujíma?
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <Chip accent={a}>Konzultácia</Chip>
        <Chip accent={a} active>
          Obhliadka
        </Chip>
        <Chip accent={a}>Ponuka</Chip>
        <Chip accent={a}>Iné</Chip>
      </div>
      <div
        className="rounded-xl px-3 py-2.5 text-xs"
        style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <div
          style={{ color: "var(--text-light)" }}
          className="mb-1.5 text-[10px] uppercase tracking-wide"
        >
          Zhrnutie
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: "var(--text-secondary)" }}>Typ</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Obhliadka
          </span>
        </div>
      </div>
    </div>
  );
}

export function CalculatorMini({ compact, accent }: MiniProps) {
  const { accent: a } = usePalette(accent);
  return (
    <div className={compact ? "p-3.5" : "p-4"} style={{ backgroundColor: "var(--surface)" }}>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <Field label="Rozmery" value="42 m" />
        <Field label="Materiál" value="Variant B" />
        <Field label="Doprava" value="35 km" />
        <Field label="Montáž" value="Áno" />
      </div>
      <div
        className="flex items-center justify-between rounded-xl p-3"
        style={{
          background: `linear-gradient(150deg, color-mix(in oklab, ${a} 12%, var(--background-soft)), var(--background-soft))`,
          border: `1px solid color-mix(in oklab, ${a} 30%, var(--border))`,
        }}
      >
        <div>
          <div
            className="text-[10px] uppercase tracking-wide"
            style={{ color: "var(--text-light)" }}
          >
            Orientačný rozsah
          </div>
          <div className="text-lg font-semibold tabular-nums" style={{ color: a }}>
            1 240 – 1 480 €
          </div>
        </div>
        <span
          className="rounded-lg px-3 py-1.5 text-[11px] font-semibold"
          style={{ backgroundColor: a, color: "#06120d" }}
        >
          Prepočítať
        </span>
      </div>
    </div>
  );
}

export function ConfiguratorMini({ compact, accent }: MiniProps) {
  const { accent: a } = usePalette(accent);
  return (
    <div className={compact ? "p-3.5" : "p-4"} style={{ backgroundColor: "var(--surface)" }}>
      <StepBar step={2} total={3} accent={a} />
      <div
        className="mb-2 mt-3 text-[10px] uppercase tracking-wide"
        style={{ color: "var(--text-light)" }}
      >
        Variant
      </div>
      <div className="mb-3 flex gap-1.5">
        {["A", "B", "C", "D"].map((v, i) => (
          <span
            key={v}
            className="grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold"
            style={{
              border: `1px solid ${i === 1 ? "transparent" : "var(--border-strong)"}`,
              color: i === 1 ? "#06120d" : "var(--text-secondary)",
              background: i === 1 ? a : "transparent",
              boxShadow: i === 1 ? `0 6px 16px -10px ${a}` : "none",
            }}
          >
            {v}
          </span>
        ))}
      </div>
      <div
        className="mb-2 text-[10px] uppercase tracking-wide"
        style={{ color: "var(--text-light)" }}
      >
        Farba
      </div>
      <div className="mb-3 flex gap-2">
        {["#c9aa70", "#7fa58f", "#bc7352", "#b7beb4"].map((c, i) => (
          <span
            key={c}
            className="h-6 w-6 rounded-full"
            style={{
              backgroundColor: c,
              outline: i === 0 ? `2px solid ${a}` : "1px solid var(--border)",
              outlineOffset: 2,
            }}
          />
        ))}
      </div>
      <div
        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs"
        style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <span style={{ color: "var(--text-light)" }}>Výber</span>
        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
          Variant B · zelená
        </span>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg px-2.5 py-2"
      style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border)" }}
    >
      <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-light)" }}>
        {label}
      </div>
      <div className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
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
