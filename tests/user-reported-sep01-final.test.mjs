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


test("Sep 7 flow is driven by normal vertical scroll and cannot be skipped as a side scroller", async () => {
  const landing = await read("src/components/site/KageLanding.tsx");
  const css = await read("src/components/site/HomepageReworkSep07.css");

  assert.match(landing, /ref=\{storyRef\}/);
  assert.match(landing, /stages\.map\(\(stage\) => \(/);
  assert.match(landing, /window\.addEventListener\("scroll", scheduleUpdate/);
  assert.match(css, /height:\s*390svh/);
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /touch-action:\s*pan-y/);

  assert.doesNotMatch(landing, /animate\(window\.scrollY|window\.scrollTo\(|scrollLeft\s*[+\-]?=/);
  assert.doesNotMatch(landing, /addEventListener\("wheel"/);
});


test("Sep 7 solution copy and pricing hero live in the rendered component", async () => {
  const landing = await read("src/components/site/KageLanding.tsx");
  const css = await read("src/components/site/HomepageReworkSep07.css");

  assert.match(landing, /cta: "Vyskladať kalkulačku"/);
  assert.match(landing, /className="hybrid-price kage-price-hero"/);
  assert.match(landing, /to="\/cennik"/);
  assert.match(landing, /new IntersectionObserver\(/);
  assert.match(css, /\.kage-home \.kage-price-hero/);
  assert.match(css, /\.kage-home \.kage-price-hero__offer/);
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
