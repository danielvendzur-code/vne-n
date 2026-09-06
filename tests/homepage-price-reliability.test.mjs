import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage prices are authoritative in the markup, not patched into the DOM", async () => {
  const landing = await read("src/components/site/KageLanding.tsx");

  assert.match(landing, /AnimatedPrice value=\{347\}/);
  assert.match(landing, /AnimatedPrice value=\{447\}/);
  assert.match(landing, /AnimatedPrice value=\{10\} lead=""/);
  assert.match(landing, /const \[displayValue, setDisplayValue\] = useState\(value\)/);
});

test("the price counter can never get stuck at zero", async () => {
  const landing = await read("src/components/site/KageLanding.tsx");
  const counter = landing.slice(
    landing.indexOf("function AnimatedPrice("),
    landing.indexOf("function Price()"),
  );

  // Without an observer, or with reduced motion, the real price renders at once.
  assert.match(
    counter,
    /if \(!element \|\| reducedMotion \|\| typeof IntersectionObserver === "undefined"\) \{\s*setDisplayValue\(value\);/,
  );
  // Zero is introduced only when the price is actually entering the viewport.
  // Until then the authoritative price remains in the DOM for screenshots,
  // crawlers and assistive technology.
  assert.equal((counter.match(/setDisplayValue\(0\)/g) ?? []).length, 1);
  assert.match(counter, /if \(!entry\.isIntersecting\) \{[\s\S]*?return;/);
  assert.doesNotMatch(counter, /if \(!entry\.isIntersecting\) \{[^}]*setDisplayValue\(0\)/);
  assert.match(counter, /new IntersectionObserver\(/);
  assert.match(counter, /progress >= 1 \? value : Math\.round\(value \* eased\)/);
});

test("no homepage component rewrites rendered text through a MutationObserver", async () => {
  const route = await read("src/routes/index.tsx");

  assert.doesNotMatch(route, /HomepagePriceReliabilityGuard|HomepageFinishingPass/);
  assert.match(route, /return <KageLanding \/>/);
});
