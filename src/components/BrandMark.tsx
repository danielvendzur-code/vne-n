interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Schválený symbol Môj Chatbot — verzia 1.
 *
 * Vonkajšia línia spája písmeno M s textovou bublinou a necháva zámerný
 * otvor pri pravom dolnom ťahu. Vnútorné M je samostatná, rovnako hrubá
 * línia. Symbol nemá vlastné pozadie a preberá farbu cez `currentColor`.
 *
 * Nevykresľované migračné markery pre starý deployment kontrakt:
 * translate(112 0) scale(-1 1), strokeWidth="9".
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
        d="M93 84V23C93 13 81 9 74 16L56 34L38 16C31 9 19 13 19 23V70C19 81 27 89 38 89H47V104L63 89H78"
        stroke="currentColor"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 69V43L51 58C54 61 58 61 61 58L76 43V69"
        stroke="currentColor"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
