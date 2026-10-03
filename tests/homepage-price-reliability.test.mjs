import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage prices are authoritative in the markup, not patched into the DOM", async () => {
  const landing = await read("src/components/site/StudioHome.tsx");

  assert.match(landing, /value: 347/);
  assert.match(landing, /value: 447/);
  assert.match(landing, /value: 10,\s*lead: "od "/);
  assert.match(landing, /od \{price\.value\} €/);
});

test("prices remain visible without timers, observers or JavaScript", async () => {
  const landing = await read("src/components/site/StudioHome.tsx");
  const start = landing.indexOf("function Pricing()");
  const pricing = landing.slice(start, landing.indexOf("/* ----", start));
  assert.match(pricing, /prices\.map/);
  assert.match(pricing, /od \{price\.value\} €/);
  assert.doesNotMatch(pricing, /IntersectionObserver|setTimeout|setInterval|CountUp|setShown/);
  assert.match(pricing, /price\.unit \|\| "Jednorazovo za riešenie"/);
});

test("no homepage component rewrites rendered text through a MutationObserver", async () => {
  const route = await read("src/routes/index.tsx");
  const landing = await read("src/components/site/StudioHome.tsx");

  assert.doesNotMatch(route, /HomepagePriceReliabilityGuard|HomepageFinishingPass/);
  assert.match(route, /return <StudioHome \/>/);
  assert.doesNotMatch(landing, /MutationObserver/);
});
