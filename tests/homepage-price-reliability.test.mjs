import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage prices are authoritative in the markup, not patched into the DOM", async () => {
  const landing = await read("src/components/site/StudioHome.tsx");

  assert.match(landing, /value: 347/);
  assert.match(landing, /value: 447/);
  assert.match(landing, /value: 10,\s*lead: "od "/);
  assert.match(landing, /const \[shown, setShown\] = useState\(value\)/);
});

test("the price counter can never get stuck at zero", async () => {
  const landing = await read("src/components/site/StudioHome.tsx");
  const start = landing.indexOf("function CountUp(");
  const counter = landing.slice(start, landing.indexOf("/* ----", start));

  // Without an observer, or with reduced motion, the real price stays rendered.
  assert.match(counter, /typeof IntersectionObserver === "undefined"\) return undefined;/);
  assert.match(counter, /prefers-reduced-motion: reduce\)"\)\.matches\) return undefined;/);
  // The count only starts once the price is actually in view and always lands on the value.
  assert.match(counter, /if \(!entry\?\.isIntersecting\) return;/);
  assert.doesNotMatch(counter, /setShown\(0\)/);
  assert.match(counter, /progress >= 1 \? value : Math\.round\(value \* eased\)/);
});

test("no homepage component rewrites rendered text through a MutationObserver", async () => {
  const route = await read("src/routes/index.tsx");
  const landing = await read("src/components/site/StudioHome.tsx");

  assert.doesNotMatch(route, /HomepagePriceReliabilityGuard|HomepageFinishingPass/);
  assert.match(route, /return <StudioHome \/>/);
  assert.doesNotMatch(landing, /MutationObserver/);
});
