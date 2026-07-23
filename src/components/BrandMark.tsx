interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Placeholder značka pre „Môj Chatbot" — moderný chat-bubble monogram.
 * Farbu preberá z --primary, takže sa drží aktuálnej palety.
 */
export function BrandMark({ size = 34, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={`brand-mark${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="36" height="36" rx="11" fill="var(--primary, #3478f6)" />
      <rect
        x="2.75"
        y="2.75"
        width="34.5"
        height="34.5"
        rx="10.25"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />
      <rect x="8" y="11" width="24" height="13" rx="5" fill="#ffffff" />
      <path d="M13 22 13 28.6 19.6 22 Z" fill="#ffffff" />
      <circle cx="15" cy="17.4" r="1.75" fill="var(--primary, #3478f6)" />
      <circle cx="20" cy="17.4" r="1.75" fill="var(--primary, #3478f6)" />
      <circle cx="25" cy="17.4" r="1.75" fill="var(--primary, #3478f6)" />
    </svg>
  );
}
