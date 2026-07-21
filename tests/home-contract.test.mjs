import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("chatbot-first copy is rendered directly by React", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const motion = await read("src/components/site/SiteMotionEnhancements.tsx");
  const layout = await read("src/components/site/Layout.tsx");
  assert.match(landing, /Chatboty, ktoré/);
  assert.match(landing, /zvyšujú konverzie/);
  assert.match(landing, /Čo má váš chatbot zvládnuť\?/);
  assert.match(landing, /Bez chatbota/);
  assert.match(landing, /S chatbotom/);
  assert.doesNotMatch(motion, /refineHomepageCopy|replaceText/);
  assert.doesNotMatch(layout, /RequestedRuntimePolish/);
  await assert.rejects(
    access(new URL("../src/components/site/RequestedRuntimePolish.tsx", import.meta.url)),
  );
});

test("primary CTAs use mint and secondary interactions use cyan", async () => {
  const css = await read("src/components/site/RequestedPolish.css");
  assert.match(css, /--action:\s*#64e3b3/i);
  assert.match(css, /--action-hover:\s*#7af0c5/i);
  assert.match(css, /--interactive:\s*#72d3ea/i);
  assert.doesNotMatch(css, /--action:\s*#f26f4f/i);
});

test("three solution cards are complete and interactive in source", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const css = await read("src/components/site/RequestedPolish.css");
  assert.match(landing, /Chatbot na mieru/);
  assert.match(landing, /Chatbot s kalkulačkou/);
  assert.match(landing, /Chatbot s konfigurátorom/);
  assert.match(landing, /Navrhnúť tento chatbot/);
  assert.match(landing, /onPointerMove/);
  assert.match(landing, /--tilt-x/);
  assert.match(css, /rotateX\(var\(--tilt-x\)\)/);
});

test("navigation has visible logo copy, chatbot labels and no side-slide animation", async () => {
  const nav = await read("src/components/site/Nav.tsx");
  const finalCss = await read("src/components/site/RequestedPolishFinal.css");
  assert.match(nav, /site-brand-copy/);
  assert.match(nav, /chatboty na mieru/);
  assert.match(nav, /Chatboty a riešenia/);
  assert.match(nav, /opacity: open \? 1 : 0/);
  assert.doesNotMatch(nav, /animate=\{\{ x:/);
  assert.match(finalCss, /--line-font-size:\s*1\.66rem/);
});
