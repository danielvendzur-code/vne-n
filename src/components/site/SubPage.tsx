import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { Eyebrow } from "./StudioHome";
import "./StudioHome.css";
import "./SubPage.css";

/**
 * Spoločný základ podstránok v rovnakom vizuáli ako úvodná stránka:
 * tmavý pás s nadpisom, svetlé sekcie s kartami a jasná výzva na konci.
 */
export function ShPage({ className, children }: { className?: string; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className={`sh shp${className ? ` ${className}` : ""}`} ref={rootRef}>
      {children}
    </div>
  );
}

export type ShVisual = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Na výšku orientovaný záber (mobil, panel nástroja). */
  portrait?: boolean;
};

export function ShPageHero({
  eyebrow,
  title,
  accent,
  lead,
  children,
  visual,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lead?: ReactNode;
  children?: ReactNode;
  visual?: ShVisual;
  compact?: boolean;
}) {
  return (
    <header
      className="shp-hero"
      data-compact={compact || undefined}
      data-has-visual={visual ? "true" : undefined}
    >
      <div className="sh-hero__glow" aria-hidden="true" />
      <div className="sh-wrap shp-hero__grid">
        <div className="shp-hero__copy">
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          <h1>
            <span className="sh-line" style={{ "--i": 0 } as CSSProperties}>
              {title}
            </span>
            {accent ? (
              <>
                {" "}
                <em className="sh-line" style={{ "--i": 1 } as CSSProperties}>
                  {accent}
                </em>
              </>
            ) : null}
          </h1>
          {lead ? (
            <p className="shp-hero__lead sh-line" style={{ "--i": 2 } as CSSProperties}>
              {lead}
            </p>
          ) : null}
          {children ? (
            <div className="shp-hero__actions sh-line" style={{ "--i": 3 } as CSSProperties}>
              {children}
            </div>
          ) : null}
        </div>
        {visual ? (
          <figure
            className="shp-hero__visual sh-line"
            data-portrait={visual.portrait || undefined}
            style={{ "--i": 2 } as CSSProperties}
          >
            <img
              src={visual.src}
              alt={visual.alt}
              width={visual.width}
              height={visual.height}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            {visual.caption ? <figcaption>{visual.caption}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </header>
  );
}

export function ShSectionHead({
  eyebrow,
  title,
  lead,
  row = false,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  row?: boolean;
  children?: ReactNode;
}) {
  if (row) {
    return (
      <header className="sh-head sh-head--row" data-reveal>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2>{title}</h2>
        </div>
        {lead ? <p>{lead}</p> : null}
        {children}
      </header>
    );
  }

  return (
    <header className="sh-head" data-reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {lead ? <p>{lead}</p> : null}
      {children}
    </header>
  );
}

export function ShClosing({
  title,
  copy,
  children,
}: {
  title: string;
  copy: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="sh-closing shp-closing" aria-label={title}>
      <div className="sh-wrap">
        <div className="sh-closing__card" data-reveal>
          <div>
            <h2>{title}</h2>
            <p>{copy}</p>
          </div>
          <div className="sh-closing__actions">{children}</div>
        </div>
      </div>
    </section>
  );
}
