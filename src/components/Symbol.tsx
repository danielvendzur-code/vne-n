interface SymbolProps {
  size?: number;
  className?: string;
}

/** Minimalistický monogram V s diakritickým detailom odkazujúcim na meno Vendžúr. */
export function Symbol({ size = 36, className }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={`brand-symbol${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        className="brand-symbol__shell"
        x="3.5"
        y="3.5"
        width="33"
        height="33"
        rx="11"
        fill="var(--brand-symbol-shell, #102a35)"
      />
      <rect
        className="brand-symbol__frame"
        x="4.25"
        y="4.25"
        width="31.5"
        height="31.5"
        rx="10.25"
        stroke="var(--brand-symbol-signal, #d2edf3)"
        strokeOpacity="0.24"
        strokeWidth="1.5"
      />
      <path
        className="brand-symbol__face"
        d="M10.5 13.1 18.45 28c.58 1.08 2.12 1.1 2.73.04l8.32-14.94"
        stroke="var(--brand-symbol-face, #72d3ea)"
        strokeWidth="4.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="brand-symbol__accent"
        d="m23.9 9.15 3.1 2.55 3.1-2.55"
        stroke="var(--brand-symbol-accent, #a9e5f0)"
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="brand-symbol__spark"
        d="M22.35 24.6 29.8 17.1"
        stroke="var(--brand-symbol-signal, #d2edf3)"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeOpacity="0.82"
      />
    </svg>
  );
}
