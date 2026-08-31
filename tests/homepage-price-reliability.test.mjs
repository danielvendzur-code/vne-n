import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage price guard makes 347 and 447 authoritative", async () => {
  const route = await read("src/routes/index.tsx");
  const guard = await read("src/components/site/HomepagePriceReliabilityGuard.tsx");

  assert.match(route, /HomepagePriceReliabilityGuard/);
  assert.match(guard, /od 347 €/);
  assert.match(guard, /od 447 €/);
  assert.match(guard, /MutationObserver/);
  assert.match(guard, /characterData: true/);
  assert.match(guard, /childList: true/);
});
