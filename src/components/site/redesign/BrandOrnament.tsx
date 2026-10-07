import s from "./BrandOrnament.module.css";

export function BrandOrnament({ large = false }: { large?: boolean }) {
  return (
    <svg
      className={s.ornament}
      data-large={large || undefined}
      viewBox="0 0 420 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 40H112M308 40H412" stroke="currentColor" strokeOpacity=".35" />
      {[140, 210, 280].map((x, i) => (
        <g key={x} transform={`translate(${x} 40) rotate(${i === 1 ? 180 : 0})`}>
          <path
            d="M-24 0A24 24 0 0 1 24 0M-24 0A24 24 0 0 0 24 0M0-24V24M-24 0H24"
            stroke="currentColor"
            strokeWidth=".8"
          />
          <path
            d="M-16-8A16 16 0 0 1 16-8M-16 8A16 16 0 0 0 16 8"
            stroke="currentColor"
            strokeOpacity=".45"
          />
          <circle r="3" fill="currentColor" />
        </g>
      ))}
      <path d="M8 36V44M412 36V44" stroke="currentColor" />
    </svg>
  );
}
