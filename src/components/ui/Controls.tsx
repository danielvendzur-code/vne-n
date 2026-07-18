import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "motion/react";

/* ============================================================
   Buttons — one unified system
============================================================ */

type ButtonVariant = "primary" | "secondary" | "terracotta" | "text";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  arrow?: boolean;
  full?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", arrow, full, className = "", children, ...rest }, ref) => {
    const base = variant === "text" ? "btn-text" : `btn btn-${variant}`;
    return (
      <button ref={ref} className={`${base} ${full ? "w-full" : ""} ${className}`} {...rest}>
        {children}
        {arrow && (
          <span aria-hidden className="arrow inline-block">
            →
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

/* ============================================================
   Chip — selectable option (radio-like)
============================================================ */

export function Chip({
  children,
  active,
  onClick,
  size = "md",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}) {
  const padding = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-[10px] ${padding} font-medium transition-colors`}
      style={{
        border: `1px solid ${active ? "var(--primary)" : "var(--border-strong)"}`,
        backgroundColor: active ? "var(--primary-soft)" : "transparent",
        color: active ? "var(--primary-hover)" : "var(--text-primary)",
      }}
    >
      {active && (
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <path
            d="M2.5 6.5l2.5 2.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
}

/* ============================================================
   Segmented control — mutually exclusive
============================================================ */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label?: string;
}) {
  const groupId = useId();
  return (
    <div role="radiogroup" aria-label={label}>
      <div
        className="inline-flex p-1 rounded-[10px] w-full"
        style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border)" }}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className="relative flex-1 px-3 py-2 text-sm font-medium rounded-[7px] transition-colors"
              style={{
                color: active ? "var(--primary-hover)" : "var(--text-secondary)",
              }}
            >
              {active && (
                <motion.span
                  layoutId={`seg-${groupId}`}
                  className="absolute inset-0 rounded-[7px]"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border-strong)",
                    boxShadow:
                      "0 8px 24px rgba(0, 0, 0, 0.22), 0 1px 0 rgba(244, 251, 248, 0.04) inset",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Toggle switch
============================================================ */

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 rounded-full transition-colors"
        style={{
          backgroundColor: checked ? "var(--primary)" : "var(--border-strong)",
        }}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute top-0.5 h-5 w-5 rounded-full shadow"
          style={{
            left: checked ? "calc(100% - 22px)" : "2px",
            backgroundColor: "#f4fbf8",
          }}
        />
      </button>
      <span className="text-sm" style={{ color: "var(--text-primary)" }}>
        {label}
      </span>
    </label>
  );
}

/* ============================================================
   Slider
============================================================ */

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit,
  dark,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  unit?: string;
  dark?: boolean;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label
          htmlFor={id}
          className="text-xs uppercase tracking-wider font-medium"
          style={{
            color: dark ? "color-mix(in oklab, #f4fbf8 65%, transparent)" : "var(--text-secondary)",
          }}
        >
          {label}
        </label>
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: dark ? "#f4fbf8" : "var(--text-primary)" }}
        >
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`slider${dark ? " slider-dark" : ""}`}
        style={{ ["--val" as string]: `${pct}%` }}
        aria-label={label}
      />
    </div>
  );
}

/* ============================================================
   Stepper (quantity)
============================================================ */

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm" style={{ color: "var(--text-primary)" }}>
        {label}
      </span>
      <div
        className="inline-flex items-center rounded-[10px]"
        style={{ border: "1px solid var(--border-strong)", backgroundColor: "var(--surface)" }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-9 w-9 grid place-items-center text-lg"
          aria-label="Znížiť"
          style={{ color: "var(--text-primary)" }}
        >
          −
        </button>
        <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-9 w-9 grid place-items-center text-lg"
          aria-label="Zvýšiť"
          style={{ color: "var(--text-primary)" }}
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Colour swatch selector
============================================================ */

export function Swatches({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; color: string }[];
  label: string;
}) {
  return (
    <div>
      <div
        className="mb-2 text-xs uppercase tracking-wider font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </div>
      <div role="radiogroup" aria-label={label} className="flex gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={o.label}
              onClick={() => onChange(o.value)}
              className="relative h-8 w-8 rounded-full transition-transform"
              style={{
                backgroundColor: o.color,
                outline: active ? "2px solid var(--primary)" : "none",
                outlineOffset: 2,
              }}
            >
              {active && (
                <svg
                  className="absolute inset-0 m-auto"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  aria-hidden
                >
                  <path
                    d="M3 7.5l2.5 2.5L11 4"
                    stroke="#f4fbf8"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Summary row
============================================================ */

export function SummaryRow({
  label,
  value,
  accent,
  dark,
}: {
  label: string;
  value: string;
  accent?: boolean;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span
        className="text-xs uppercase tracking-wider"
        style={{
          color: dark ? "color-mix(in oklab, #f4fbf8 55%, transparent)" : "var(--text-secondary)",
        }}
      >
        {label}
      </span>
      <span
        className="text-sm font-semibold tabular-nums text-right"
        style={{
          color: accent
            ? dark
              ? "var(--highlight)"
              : "var(--primary)"
            : dark
              ? "#f4fbf8"
              : "var(--text-primary)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   Progress steps (compact segmented bar)
============================================================ */

export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1" aria-label={`Krok ${step + 1} z ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-1 rounded-full transition-all"
          style={{
            width: i === step ? 24 : 10,
            backgroundColor: i <= step ? "var(--primary)" : "var(--border-strong)",
          }}
        />
      ))}
    </div>
  );
}
