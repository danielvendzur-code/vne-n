import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("closed FAQ rows render a real plus without legacy pseudo-elements", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/SecondHalfIconLock.css");

  assert.match(layout, /SecondHalfIconLock\.css/);
  assert.ok(
    layout.indexOf('import "./SecondHalfVisualQAFinal.css"') <
      layout.indexOf('import "./SecondHalfIconLock.css"'),
  );
  assert.match(css, /1\.5px 0\.82rem no-repeat/);
  assert.match(css, /content: none !important/);
  assert.match(css, /data-open="true"/);
});
