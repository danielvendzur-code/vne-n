interface SymbolProps {
  size?: number;
  className?: string;
}

/** A friendly, original bot inside a conversation bubble. */
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
        className="brand-symbol__antenna"
        d="M18 7V4.4"
        stroke="var(--highlight)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle className="brand-symbol__spark" cx="18" cy="3.3" r="2.05" fill="var(--highlight)" />
      <path
        className="brand-symbol__shell"
        d="M9.2 6.4h17.6c4.25 0 6.8 2.55 6.8 6.8v10.4c0 4.25-2.55 6.8-6.8 6.8h-8.25L11.4 35v-4.72c-3.73-.58-5.98-2.98-5.98-6.68V13.2c0-4.25 2.55-6.8 6.8-6.8Z"
        fill="#061e18"
      />
      <rect
        className="brand-symbol__face"
        x="8.4"
        y="10"
        width="19.2"
        height="15.4"
        rx="7.7"
        fill="var(--primary)"
      />
      <path
        className="brand-symbol__highlight"
        d="M11.4 13.2c1.35-1.2 3.15-1.8 5.4-1.8h5.15"
        stroke="rgba(255,255,255,.34)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <g className="brand-symbol__eyes" fill="#061e18">
        <ellipse cx="14.2" cy="17.35" rx="1.65" ry="1.85" />
        <ellipse cx="21.8" cy="17.35" rx="1.65" ry="1.85" />
      </g>
      <circle cx="14.75" cy="16.75" r="0.45" fill="white" fillOpacity="0.86" />
      <circle cx="22.35" cy="16.75" r="0.45" fill="white" fillOpacity="0.86" />
      <path
        className="brand-symbol__smile"
        d="M14.1 21.05c1.05.82 2.35 1.22 3.9 1.22s2.85-.4 3.9-1.22"
        stroke="#061e18"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <circle cx="8.15" cy="17.55" r="1.18" fill="var(--highlight)" />
      <circle cx="27.85" cy="17.55" r="1.18" fill="var(--highlight)" />
    </svg>
  );
}
