interface SymbolProps {
  size?: number;
  className?: string;
}

/** Brand mark: a precise robot face inside a conversation bubble. */
export function Symbol({ size = 36, className }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={`brand-symbol${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="brand-symbol__antenna"
        d="M24 7V4.8"
        stroke="var(--brand-symbol-signal, #3478f6)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle
        className="brand-symbol__spark"
        cx="24"
        cy="3.2"
        r="2.35"
        fill="var(--brand-symbol-signal, #3478f6)"
      />
      <path
        className="brand-symbol__shell"
        d="M13.2 7.2h21.6c5.7 0 9 3.4 9 9v10.9c0 5.6-3.3 9-9 9h-10l-9.1 7.1v-7.4c-7-.4-11.5-3.9-11.5-9.7V16.2c0-5.6 3.3-9 9-9Z"
        fill="var(--brand-symbol-shell, #090c12)"
        stroke="rgba(247,249,252,.72)"
        strokeWidth="1.7"
      />
      <rect
        className="brand-symbol__face"
        x="9.5"
        y="12.3"
        width="29"
        height="18.8"
        rx="8"
        fill="#0d1119"
        stroke="var(--brand-symbol-face, #3478f6)"
        strokeWidth="2"
      />
      <path
        className="brand-symbol__highlight"
        d="M13.5 15.8h9.2"
        stroke="rgba(255,255,255,.28)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <g className="brand-symbol__eyes" fill="var(--brand-symbol-signal, #3478f6)">
        <rect x="15" y="20" width="5.2" height="3.5" rx="1.75" />
        <rect x="27.8" y="20" width="5.2" height="3.5" rx="1.75" />
      </g>
      <path
        className="brand-symbol__smile"
        d="m18.2 26.2 5.8 3 5.8-3"
        stroke="#f7f9fc"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="brand-symbol__accent"
        d="M11 18.5v6.8M37 18.5v6.8"
        stroke="var(--brand-symbol-signal, #3478f6)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
