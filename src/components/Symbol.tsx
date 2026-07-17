interface SymbolProps {
  size?: number;
  className?: string;
}

/** Original bot mark: a conversation bubble, a warm face and a small signal spark. */
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
      <path
        className="brand-symbol__antenna"
        d="M20 8V5.7"
        stroke="var(--brand-symbol-signal, #ff785c)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle
        className="brand-symbol__spark"
        cx="20"
        cy="4"
        r="2.25"
        fill="var(--brand-symbol-signal, #ff785c)"
      />
      <path
        className="brand-symbol__shell"
        d="M10.8 7.25h18.4c4.7 0 7.55 2.8 7.55 7.5v10.1c0 4.7-2.85 7.5-7.55 7.5h-8.55l-7.8 5.15v-5.34c-3.75-.75-5.6-3.3-5.6-7.31v-10.1c0-4.7 2.85-7.5 7.55-7.5Z"
        fill="var(--brand-symbol-shell, #061e18)"
      />
      <rect
        className="brand-symbol__face"
        x="9.8"
        y="11"
        width="20.4"
        height="16.5"
        rx="8.25"
        fill="var(--brand-symbol-face, var(--primary))"
      />
      <path
        className="brand-symbol__highlight"
        d="M13 14.15c1.55-1.15 3.4-1.7 5.65-1.7h4.6"
        stroke="rgba(255,255,255,.42)"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <g className="brand-symbol__eyes" fill="#061e18">
        <ellipse cx="15.7" cy="18.7" rx="1.7" ry="1.95" />
        <ellipse cx="24.3" cy="18.7" rx="1.7" ry="1.95" />
      </g>
      <circle cx="16.3" cy="18" r="0.48" fill="white" fillOpacity="0.92" />
      <circle cx="24.9" cy="18" r="0.48" fill="white" fillOpacity="0.92" />
      <path
        className="brand-symbol__smile"
        d="M15.55 22.45c1.18.88 2.66 1.32 4.45 1.32s3.27-.44 4.45-1.32"
        stroke="#061e18"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <circle cx="9.45" cy="19.1" r="1.22" fill="var(--brand-symbol-signal, #ff785c)" />
      <circle cx="30.55" cy="19.1" r="1.22" fill="var(--brand-symbol-signal, #ff785c)" />
      <path
        className="brand-symbol__accent"
        d="m32.55 8.25.55 1.35 1.35.55-1.35.55-.55 1.35L32 10.7l-1.35-.55L32 9.6l.55-1.35Z"
        fill="var(--brand-symbol-accent, #ff785c)"
      />
    </svg>
  );
}
