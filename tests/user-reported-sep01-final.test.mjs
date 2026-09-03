import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Sep 1 homepage repair keeps hero type stable and restores safe leading", async () => {
  const css = await read("src/components/site/UserReportedVisualFinal.css");

  assert.match(css, /homepage-character-write-stable/);
  assert.match(css, /\.kage-hero h1[\s\S]*line-height: 0\.96 !important/);
  assert.match(css, /\.typed-character[\s\S]*transform: none !important/);
  // Opacity only: a per-glyph blur re-rasterised the whole headline every frame.
  assert.doesNotMatch(css, /@keyframes homepage-character-write-stable[\s\S]*?blur\([\s\S]*?\n\}/);
});

test("Sep 1 flow reads by scrolling and needs no control to be discovered", async () => {
  const landing = await read("src/components/site/KageLanding.tsx");
  const css = await read("src/components/site/KageLanding.css");

  // All four steps are in the page at once, one under another.
  assert.match(landing, /<ol className="container-page kage-flow-story__steps">/);
  assert.match(landing, /stages\.map\(\(stage\) => \(/);
  assert.match(css, /\.kage-flow__step[\s\S]*border-bottom: 1px solid var\(--hh-line-dark\)/);

  // Nothing drives, holds or reinterprets a scroller of any axis.
  assert.doesNotMatch(landing, /animate\(window\.scrollY|window\.scrollTo\(|scrollLeft/);
  assert.doesNotMatch(landing, /addEventListener\("wheel"/);
  assert.doesNotMatch(css, /scroll-snap-type/);
});

test("Sep 1 solution copy and price motion live in the rendered component", async () => {
  const landing = await read("src/components/site/KageLanding.tsx");
  const css = await read("src/components/site/KageLanding.css");

  assert.match(landing, /cta: "Vyskladať kalkulačku"/);
  assert.match(landing, /hybrid-price__grid/);
  assert.match(landing, /new IntersectionObserver\(/);
  assert.match(css, /@keyframes kage-price-count/);
});

test("Sep 1 header and launcher polish remove hover boxes and keep requested CTA colors", async () => {
  const css = await read("src/components/site/UserReportedVisualFinal.css");

  assert.match(css, /\.site-nav a::before[\s\S]*content: none !important/);
  assert.match(css, /\.site-header \.site-header__cta[\s\S]*background: #c8f06a !important/);
  assert.match(
    css,
    /\.site-header \.site-header__cta:is\(:hover, :focus-visible\)[\s\S]*background: #0b0e0c !important/,
  );
  assert.match(css, /#dv-assistant-fallback[\s\S]*0 0 0 6px/);
});
