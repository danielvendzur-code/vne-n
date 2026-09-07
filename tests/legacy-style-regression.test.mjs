import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("historical visual authority layers stay out of the active layout", async () => {
  const layout = await read("src/components/site/Layout.tsx");

  for (const retired of [
    "GreenInteractionVisualCorrection.css",
    "GreenTextureInteractionsFinal.css",
    "SecondHalfCorrectionsFinal.css",
    "SecondHalfIconLock.css",
    "SecondHalfPremiumFinal.css",
    "SecondHalfVisualQAFinal.css",
  ]) {
    assert.doesNotMatch(layout, new RegExp(retired.replace(".", "\\.")));
  }

  assert.match(layout, /Rebrand\.css/);
  assert.match(layout, /RebrandPages\.css/);
  assert.match(layout, /FinalMobileAudit\.css/);
  assert.match(layout, /FinalUxAuthority\.css/);
  assert.match(layout, /LaunchReadinessFinal\.css/);
});

test("active homepage flow is one stable horizontal local scroller", async () => {
  const landing = await read("src/components/site/KageLanding.tsx");
  const css = await read("src/components/site/KageLanding.css");

  assert.match(landing, /className="kage-flow-story"/);
  assert.match(landing, /className="kage-flow__step"/);
  assert.match(landing, /stepsRef/);
  assert.match(landing, /scroller\.scrollLeft \+= event\.deltaY/);
  assert.match(landing, /passive: false/);
  assert.doesNotMatch(landing, /window\.scrollTo|createPortal|plain-flow-story__viewport/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /scroll-snap-type:\s*x mandatory/);
  assert.match(css, /scroll-snap-align:\s*start/);
});
