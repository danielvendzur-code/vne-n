interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Symbol Môj Chatbot.
 *
 * Bublina s M navrchu a chvostom vľavo pod stredom, plus vnútorné menšie
 * M. Kresba vychádza z originálu; oproti predošlej verzii sú opravené dve
 * veci, ktoré ju kazili:
 *
 * 1. Vonkajší ťah začínal krátkym pahýľom pri pravom dolnom rohu a končil
 *    zvislicou, ktorá vybiehala z dolnej hrany nahor. Na pravej strane tak
 *    vznikla dvojitá čiara a bublina nebola zavretá. Teraz je to jeden
 *    zavretý obrys.
 * 2. Vnútorné M malo len ľavé rameno; pravé sa suplovalo tou zvislicou
 *    z vonkajšieho ťahu, takže nebolo symetrické a siahalo až na dno.
 *    Obe ramená sú teraz súčasťou vnútorného ťahu a končia rovnako vysoko
 *    zaobleným zakončením.
 *
 * Ťah je 7,2 na plátne 112 — toľko má aj originál v prepočte na túto
 * šírku bubliny.
 */
const OUTER =
  "M8.5 12.4C8.5 7.2 14.5 4.5 18.3 6.4L52.5 34.5" +
  "C54.1 36.1 57.9 36.1 59.5 34.5L95.4 6.4" +
  "C99.2 4.5 103.6 7.2 103.6 12.4V79.9" +
  "C103.6 82.6 101.4 84.8 98.7 84.8H52.9L30.5 105.5L30.2 84.8H13.4" +
  "C10.7 84.8 8.5 82.6 8.5 79.9Z";

const INNER = "M24 71.2V29.2L52.5 55.4C54.1 57 57.9 57 59.5 55.4L88 29.2V71.2";

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
        d={OUTER}
        stroke="currentColor"
        strokeWidth="7.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={INNER}
        stroke="currentColor"
        strokeWidth="7.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
