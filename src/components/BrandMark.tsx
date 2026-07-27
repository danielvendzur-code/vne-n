interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Značka „Môj Chatbot" — monogram M v obryse chatovej bubliny.
 * Kreslené ťahom, takže ostáva ostré v každej veľkosti. Odtiene sú
 * z rovnakej modrej rodiny ako zvyšok webu (#3478f6 / #75b8ff).
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
      <defs>
        <linearGradient id="bm-stroke" x1="8" y1="40" x2="40" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1F55C9" />
          <stop offset="0.55" stopColor="#3478F6" />
          <stop offset="1" stopColor="#7CBBFF" />
        </linearGradient>
      </defs>

      {/* Bublina: kruhový obrys s chvostíkom vpravo dole */}
      <path
        d="M35.8 34.9A16.4 16.4 0 1 0 27.4 40.2c2.6 2.4 5.8 3.8 9.3 4.1-2.2-2-3.2-4.6-2.9-7.6"
        stroke="url(#bm-stroke)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Monogram M s mäkkými ramenami */}
      <path
        d="M16.4 31.6c0-7.4.5-11.2 2-12.2 1.3-.9 3 .7 5.6 7.4 2.6-6.7 4.3-8.3 5.6-7.4 1.5 1 2 4.8 2 12.2"
        stroke="url(#bm-stroke)"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
