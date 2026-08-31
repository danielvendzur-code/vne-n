import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage restores continuous horizontal flow without forced snapping", async () => {
  const route = await read("src/routes/index.tsx");
  const tuner = await read("src/components/site/FlowScrollTuner.tsx");
  const landing = await read("src/components/site/KageLanding.tsx");

  assert.doesNotMatch(route, /PlainFlowStoryRescue/);
  assert.match(route, /HomepageRequestedCorrections/);
  assert.match(route, /FinalUserRequestedRepair\.css/);
  assert.match(landing, /className="kage-flow__track"/);
  assert.match(landing, /\["0%", "-75%"\]/);
  assert.match(tuner, /stopImmediatePropagation/);
  assert.match(tuner, /Do not preventDefault/);
  assert.doesNotMatch(tuner, /window\.scrollTo|requestAnimationFrame|FLOW_IDLE_MS|targetForCurrentPosition/);
});

test("homepage CTAs diacritics and cards keep the requested visual states", async () => {
  const css = await read("src/components/site/FinalUserRequestedRepair.css");
  const corrections = await read("src/components/site/HomepageRequestedCorrections.tsx");

  assert.match(css, /\.kage-home \.kage-hero h1[\s\S]*line-height:\s*0\.9\s*!important/);
  assert.match(css, /background:\s*#c8f06a\s*!important/);
  assert.match(css, /background:\s*#0b0e0c\s*!important/);
  assert.match(css, /Otvoriť chatbot/);
  assert.match(css, /Otvoriť kalkulačku/);
  assert.match(css, /Otvoriť konfigurátor/);
  assert.match(css, /Otvoriť poradcu/);
  assert.match(css, /\.hybrid-flow__artifact[\s\S]*border-radius:\s*18px/);
  assert.match(css, /\.hybrid-project__visual[\s\S]*border-radius:\s*18px/);
  assert.match(corrections, /"Otvoriť chatbot"/);
  assert.match(corrections, /clipPath/);
  assert.match(corrections, /kind:\s*"process"/);
  assert.match(corrections, /kind:\s*"price"/);
});

test("header pricing and contact fixes are final global authority", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/FinalGlobalUserRepair.css");

  assert.match(layout, /FinalGlobalUserRepair\.css/);
  assert.match(css, /\.site-theme-white-green \.site-header__cta[\s\S]*background:\s*#c8f06a/);
  assert.match(css, /\.site-theme-white-green \.site-header__cta:is\(:hover, :focus-visible\)[\s\S]*background:\s*#0b0e0c/);
  assert.match(css, /\.site-theme-white-green \.site-nav a::after[\s\S]*height:\s*1px/);
  assert.match(css, /\.site-theme-white-green \.site-nav a[\s\S]*background:\s*transparent/);
  assert.match(css, /minmax\(22rem, 1\.4fr\)/);
  assert.match(css, /grid-template-columns:\s*minmax\(0, 1fr\) auto auto/);
  assert.match(css, /\.contact-page \.sp-hero \.sp-hero-lead[\s\S]*display:\s*none/);
  assert.match(css, /\.pricing-page--rebrand \.pricing-hero__facts[\s\S]*background:\s*transparent/);
});
