import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Sep 1 homepage repair keeps hero type stable and restores safe leading", async () => {
  const css = await read("src/components/site/UserReportedVisualFinal.css");

  assert.match(css, /homepage-character-write-stable/);
  assert.match(css, /\.kage-hero h1[\s\S]*line-height: 0\.96 !important/);
  assert.match(css, /\.typed-character[\s\S]*transform: none !important/);
});

test("Sep 1 flow uses local horizontal scrolling and no body scroll snapping", async () => {
  const flow = await read("src/components/site/PlainFlowStoryRescue.tsx");

  assert.match(flow, /plain-flow-story__viewport/);
  assert.match(flow, /viewport\.scrollLeft/);
  assert.match(flow, /addEventListener\("wheel", onWheel, \{ passive: false \}\)/);
  assert.match(flow, /event\.preventDefault\(\)/);
  assert.doesNotMatch(flow, /animate\(window\.scrollY|window\.scrollTo\(/);
});

test("Sep 1 finishing pass applies requested calculator copy and price motion", async () => {
  const route = await read("src/routes/index.tsx");
  const finishing = await read("src/components/site/HomepageFinishingPass.tsx");

  assert.match(route, /HomepageFinishingPass/);
  assert.match(finishing, /Vyskladať kalkulačku/);
  assert.match(finishing, /hybrid-price__grid/);
  assert.match(finishing, /IntersectionObserver/);
  assert.match(finishing, /element\.animate/);
});

test("Sep 1 header and launcher polish remove hover boxes and keep requested CTA colors", async () => {
  const css = await read("src/components/site/UserReportedVisualFinal.css");

  assert.match(css, /\.site-nav a::before[\s\S]*content: none !important/);
  assert.match(css, /\.site-header \.site-header__cta[\s\S]*background: #c8f06a !important/);
  assert.match(css, /\.site-header \.site-header__cta:is\(:hover, :focus-visible\)[\s\S]*background: #0b0e0c !important/);
  assert.match(css, /#dv-assistant-fallback[\s\S]*0 0 0 6px/);
});
