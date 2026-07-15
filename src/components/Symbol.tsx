interface SymbolProps {
  size?: number;
  className?: string;
}

/**
 * A conversation becoming an upward path: the compact mark connects the
 * product (a guided conversation) with its outcome (a qualified lead).
 */
export function Symbol({ size = 36, className }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`brand-symbol${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="brand-symbol__shell"
        d="M10.4 3.25h15.2c4.7 0 7.15 2.8 7.15 7.15v12.35c0 4.65-2.8 7.45-7.45 7.45h-8.1L10.05 35v-4.9c-4.45-.4-6.8-3.15-6.8-7.35V10.4c0-4.45 2.7-7.15 7.15-7.15Z"
        fill="var(--primary-dark)"
      />
      <path
        className="brand-symbol__edge"
        d="M10.4 3.9h15.2c4.25 0 6.5 2.5 6.5 6.5v12.35c0 4.25-2.55 6.8-6.8 6.8h-8.32l-6.28 4.18v-4.25c-4.42-.17-6.8-2.58-6.8-6.73V10.4c0-4.05 2.45-6.5 6.5-6.5Z"
        stroke="rgba(255, 255, 255, 0.16)"
        strokeWidth="1"
      />
      <path
        className="brand-symbol__glint"
        d="M8.15 10.4c1.25-2.15 3.15-3.25 5.7-3.25h10.7"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        className="brand-symbol__flow"
        d="m8.9 23.15 5.45-5.35 4.15 3.55 8.35-8.75"
        stroke="#f4fff9"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="brand-symbol__origin" cx="8.9" cy="23.15" r="1.85" fill="var(--primary)" />
      <circle
        className="brand-symbol__orbit"
        cx="26.85"
        cy="12.6"
        r="4.1"
        stroke="var(--highlight)"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeDasharray="2.3 2.3"
      />
      <circle
        className="brand-symbol__spark"
        cx="26.85"
        cy="12.6"
        r="2.35"
        fill="var(--highlight)"
      />
      <circle cx="27.5" cy="11.9" r="0.65" fill="white" fillOpacity="0.72" />
    </svg>
  );
}
