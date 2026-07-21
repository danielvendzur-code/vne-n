import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("primary CTAs use mint and secondary interactions use cyan", async () => {
  const css = await read("src/components/site/RequestedPolish.css");
  assert.match(css, /--action:\s*#64e3b3/i);
  assert.match(css, /--action-hover:\s*#7af0c5/i);
  assert.match(css, /--interactive:\s*#72d3ea/i);
  assert.doesNotMatch(css, /--action:\s*#f26f4f/i);
  assert.doesNotMatch(css, /--action-hover:\s*#ff8060/i);
});

test("homepage copy is chatbot-first and the name is correct", async () => {
  const runtime = await read("src/components/site/RequestedRuntimePolish.tsx");
  assert.match(runtime, /Daniel Vendžúr/);
  assert.match(runtime, /Chatboty, ktoré/);
  assert.match(runtime, /zvyšujú konverzie/);
  assert.match(runtime, /Čo má váš chatbot zvládnuť\?/);
  assert.match(runtime, /Bez chatbota/);
  assert.match(runtime, /S chatbotom/);
});

test("all three solution cards have descriptions, CTA and weighted pointer tilt", async () => {
  const runtime = await read("src/components/site/RequestedRuntimePolish.tsx");
  const css = await read("src/components/site/RequestedPolish.css");
  assert.match(runtime, /Chatbot na mieru/);
  assert.match(runtime, /Chatbot s kalkulačkou/);
  assert.match(runtime, /Chatbot s konfigurátorom/);
  assert.match(runtime, /Navrhnúť tento chatbot/);
  assert.match(runtime, /pointermove/);
  assert.match(runtime, /--tilt-x/);
  assert.match(css, /rotateX\(var\(--tilt-x\)\)/);
  assert.match(css, /rotateY\(var\(--tilt-y\)\)/);
});

test("navigation and drawer were enlarged", async () => {
  const css = await read("src/components/site/RequestedPolish.css");
  const finalCss = await read("src/components/site/RequestedPolishFinal.css");
  assert.match(css, /width:\s*min\(1080px, 98vw\)/);
  assert.match(css, /font-size:\s*0\.96rem/);
  assert.match(finalCss, /--line-font-size:\s*1\.66rem/);
  assert.match(finalCss, /--line-marker-length:\s*68px/);
});
