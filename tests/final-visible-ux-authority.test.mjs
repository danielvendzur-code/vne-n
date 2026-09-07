import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(
  new URL("../src/components/site/FinalUxAuthority.css", import.meta.url),
  "utf8",
);
const landing = readFileSync(
  new URL("../src/components/site/KageLanding.tsx", import.meta.url),
  "utf8",
);
const layout = readFileSync(new URL("../src/components/site/Layout.tsx", import.meta.url), "utf8");

test("desktop solutions keep independent readable columns and strong CTAs", () => {
  assert.match(
    css,
    /grid-template-columns:[\s\S]*minmax\(18\.5rem, 1\.05fr\)[\s\S]*minmax\(12rem, 0\.72fr\)[\s\S]*minmax\(15\.5rem, 0\.9fr\)/,
  );
  assert.match(css, /font-size: clamp\(2\.55rem, 2\.9vw, 3\.25rem\) !important/);
  assert.match(css, /\.hybrid-tool__cta[\s\S]*min-height: 48px/);
  assert.match(
    css,
    /\.site-nav[\s\S]*border: 0 !important[\s\S]*background: transparent !important/,
  );
});


test("flow chapter uses normal page scroll without wheel takeover", () => {
  const rework = readFileSync(
    new URL("../src/components/site/HomepageReworkSep07.css", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(layout, /FlowScrollTuner|FlowSnapFinal/);
  assert.doesNotMatch(landing, /window\.scrollTo\(|stopImmediatePropagation|addEventListener\("wheel"/);
  assert.match(landing, /window\.addEventListener\("scroll", scheduleUpdate/);
  assert.match(landing, /className="kage-flow-story__sticky"/);
  assert.match(rework, /\.kage-home \.kage-flow-story__sticky \{[\s\S]*position:\s*sticky/);
  assert.match(rework, /touch-action:\s*pan-y/);
});

test("contact and mobile header have explicit alignment authority", () => {
  assert.match(css, /\.contact-page \.contact-editorial-grid[\s\S]*align-items: start !important/);
  assert.match(
    css,
    /@media \(max-width: 900px\)[\s\S]*\.site-header__inner[\s\S]*justify-content: space-between !important/,
  );
});
