interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Značka „Môj Chatbot" — písané M v obryse chatovej bubliny s chvostíkom
 * vpravo dole. Kreslené ťahom, takže ostáva ostré v každej veľkosti a
 * farbu preberá z `currentColor`.
 */
export function BrandMark({ size = 34, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={`brand-mark${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 11.75 35.06 A 16.5 16.5 0 1 1 35.26 34.04 C 35.0 36.9 34.2 39.2 32.8 41.0
           C 29.4 40.6 25.6 39.9 22.0 38.9 C 18.2 37.9 14.4 36.8 11.75 35.06"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 15.2 31.2 C 14.0 27.0 14.6 21.6 16.9 18.7 C 18.7 16.4 20.7 17.0 21.9 20.3
           C 22.9 22.9 23.6 25.6 24.0 28.0 C 24.3 29.7 25.1 30.3 25.8 29.7
           C 26.6 29.0 26.4 27.4 25.5 25.6 C 24.4 23.4 23.9 21.0 24.6 19.2
           C 25.5 16.9 27.7 16.8 29.5 18.9 C 31.7 21.5 32.6 26.4 31.8 30.6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
