import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const route = readFileSync(new URL("../src/routes/index.tsx", import.meta.url), "utf8");
const finalFix = readFileSync(
  new URL("../src/components/site/FinalHomepageUserFix.css", import.meta.url),
  "utf8",
);
const oldAudit = readFileSync(
  new URL("../src/components/site/FinalHomepageAudit.css", import.meta.url),
  "utf8",
);
const tuner = readFileSync(
  new URL("../src/components/site/FlowScrollTuner.tsx", import.meta.url),
  "utf8",
);
const loader = readFileSync(new URL("../public/widget-loader.js", import.meta.url), "utf8");

test("reported-error authority loads after the older homepage audit", () => {
  const auditImport = route.indexOf('import "@/components/site/FinalHomepageAudit.css"');
  const fixImport = route.indexOf('import "@/components/site/FinalHomepageUserFix.css"');
  assert.ok(auditImport >= 0);
  assert.ok(fixImport > auditImport);
});

test("solution geometry cannot regress to the overlapping audit columns", () => {
  assert.match(finalFix, /minmax\(20rem, 1\.08fr\)/);
  assert.match(finalFix, /font-size: clamp\(2\.5rem, 2\.78vw, 3\.18rem\) !important/);
  assert.match(finalFix, /min-height: 50px !important/);
  assert.match(oldAudit, /minmax\(13\.5rem, 0\.86fr\)/);
});

test("flow final authority is slow during travel and restores the settle cue", () => {
  assert.match(finalFix, /height: 440vh !important/);
  assert.match(finalFix, /animation: kage-scroll-settle-left 660ms/);
  assert.match(finalFix, /animation: kage-scroll-settle-right 660ms/);
  assert.match(tuner, /const FLOW_IDLE_MS = 55/);
  assert.match(tuner, /localProgress >= 0\.5/);
  assert.match(tuner, /clamp\(210 \+ Math\.abs\(distance\) \* 0\.09, 210, 300\)/);
});

test("website requests the round one-stroke launcher release and never the text pill fallback", () => {
  assert.match(loader, /WIDGET_RELEASE = "round-one-stroke-launcher-20260831-v15"/);
  assert.match(loader, /borderRadius: "50%"/);
  assert.match(loader, /requestAnimationFrame/);
  assert.doesNotMatch(loader, /<strong>Môj Chatbot<\/strong>/);
  assert.doesNotMatch(loader, /<small>Otvoriť krátke zadanie<\/small>/);
});
