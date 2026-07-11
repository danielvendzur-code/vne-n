interface SymbolProps {
  size?: number;
  className?: string;
}

/**
 * Brand mark: a precise quarter-arc rising into a coral dot.
 * Designed on a 36 grid, 1.75 stroke, terminals aligned to the dot centre.
 */
export function Symbol({ size = 36, className }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 27 C 6 15.4 15.4 6 27 6"
        stroke="var(--primary)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="27" cy="27" r="3" fill="var(--accent)" />
      <circle
        cx="27"
        cy="27"
        r="5.25"
        stroke="var(--accent)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    </svg>
  );
}
