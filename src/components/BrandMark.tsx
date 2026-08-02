interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Finálny symbol Môj Chatbot.
 * Jedna neprerušená línia tvorí M aj textovú bublinu, takže značka ostáva
 * čitateľná v navigácii, launcheri aj pri malom favicon rozmere.
 */
export function BrandMark({ size = 34, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 112 112"
      role="img"
      aria-label="Môj Chatbot logo"
      className={`brand-mark${className ? ` ${className}` : ""}`}
      focusable="false"
      fill="none"
    >
      <path
        d="M69 103L69 88H82C93 88 101 80 101 69V23C101 14 91 10 84 17L64 37C59 42 53 42 48 37L28 17C21 10 11 14 11 23V69C11 80 19 88 30 88H54L69 103Z"
        stroke="currentColor"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
