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

  assert.match(layout, /SiteVisualAuthority\.css/);
  const cssImports = layout.match(/import "\.\/[^"]+\.css";/g) ?? [];
  assert.deepEqual(cssImports, ['import "./SiteVisualAuthority.css";']);
  assert.doesNotMatch(
    layout,
    /Rebrand\.css|RebrandPages\.css|FinalMobileAudit\.css|FinalUxAuthority\.css|LaunchReadinessFinal\.css/,
  );
});
