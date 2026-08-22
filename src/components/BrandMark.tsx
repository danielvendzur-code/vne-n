interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Refined one-stroke mark: M + guided path + output tail.
 * The geometry is intentionally simple enough for favicon and launcher sizes.
 */
const PATH = "M10 47V17L32 35L54 17V47H40L32 55V47H19";

export function BrandMark({ size = 34, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Môj Chatbot logo"
      className={`brand-mark${className ? ` ${className}` : ""}`}
      focusable="false"
      fill="none"
    >
      <path
        className="brand-mark__stroke"
        d={PATH}
        pathLength={1}
        stroke="currentColor"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
