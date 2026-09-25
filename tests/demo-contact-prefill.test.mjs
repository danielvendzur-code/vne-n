import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("coffee and skincare demo links both open the prefilled contact form", async () => {
  const contact = await read("src/routes/kontakt.tsx");

  assert.match(contact, /"coffee-demo-":/);
  assert.match(contact, /"skincare-demo-":/);
  assert.match(contact, /const fromDemo = demoLeadOf\(leadSource\) !== null;/);
  assert.match(contact, /required=\{!fromDemo\}/);
  assert.match(contact, /Predvyplnené z vašej ukážky/);
  assert.doesNotMatch(contact, /startsWith\("coffee-demo-"\)/);
});
