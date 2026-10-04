import type { CSSProperties } from "react";
const brandColors: Record<string, string> = {
  "#0c1a15": "var(--mc-ink)",
  "#071b15": "var(--mc-ink)",
  "#0e1512": "var(--mc-ink)",
  "#c9f26b": "var(--mc-accent)",
  "#c8f06a": "var(--mc-accent)",
  "#f5f4ef": "var(--mc-paper)",
  "#eceae3": "var(--mc-soft)",
  "#5c645f": "var(--mc-muted)",
  "#1f5b47": "var(--mc-green)",
};
/** Štýly prevzaté z schváleného HTML návrhu, bez runtime vyhodnocovania kódu. */
export function cssStyle(source: string): CSSProperties {
  const themed = source.replace(
    /#[\da-f]{6}\b/gi,
    (color) => brandColors[color.toLowerCase()] ?? color,
  );
  return Object.fromEntries(
    themed
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
