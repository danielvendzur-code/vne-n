interface SymbolProps {
  size?: number;
  className?: string;
}

/**
 * Small neutral abstract symbol used in the navigation.
 * No letters. Easy to replace later — swap this file.
 */
export function Symbol({ size = 28, className }: SymbolProps) {
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
        d="M4 22C4 12 12 4 22 4"
        stroke="var(--primary)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="22" cy="22" r="4" fill="var(--accent)" />
    </svg>
  );
}
