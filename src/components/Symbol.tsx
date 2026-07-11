interface SymbolProps {
  size?: number;
  className?: string;
}

/**
 * Compact brand mark: a rising quarter-arc anchored by a dot.
 * Stroke-only, aligns to a 32px grid, crisp on retina.
 */
export function Symbol({ size = 34, className }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 24C6 13.5074 13.5074 6 24 6"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="3" fill="var(--accent)" />
    </svg>
  );
}
