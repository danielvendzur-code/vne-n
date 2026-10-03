import type { CSSProperties } from "react";
/** Štýly prevzaté z schváleného HTML návrhu, bez runtime vyhodnocovania kódu. */
export function cssStyle(source: string): CSSProperties {
  return Object.fromEntries(
    source
      .split(";")
      .filter(Boolean)
      .map((part) => {
        const colon = part.indexOf(":");
        const key = part
          .slice(0, colon)
          .trim()
          .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return [key, part.slice(colon + 1).trim()];
      }),
  ) as CSSProperties;
}
export function sitePath(path: string | undefined): string {
  if (!path) return "#";
  return path.startsWith("/") ? `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}` : path;
}
