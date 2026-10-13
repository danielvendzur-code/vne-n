import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const engineName = process.env.MOTION_BROWSER === "webkit" ? "webkit" : "chromium";
const engine = engineName === "webkit" ? webkit : chromium;
const output = process.env.VISUAL_OUTPUT || "visual-artifacts";
const origin = process.env.LIVE_SITE_ORIGIN || "http://127.0.0.1:4173";
await mkdir(output, { recursive: true });

const browser = await engine.launch({ headless: true });
const results = [];

async function check(viewport, reducedMotion) {
  const context = await browser.newContext({
    viewport,
    reducedMotion,
    hasTouch: viewport.width <= 700,
    isMobile: viewport.width <= 700,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  try {
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.locator("[data-solution-card]").first().waitFor();
    await page.locator('#top[data-headline-ready="true"]').waitFor();
    const first = page.locator("[data-solution-card]").first();

    if (reducedMotion === "reduce") {
      assert.equal(
        await first.evaluate((card) => getComputedStyle(card).opacity),
        "1",
        "Reduced motion must not hide offscreen content",
      );
      assert.notEqual(await first.getAttribute("data-motion-card"), "staged");
      await first.scrollIntoViewIfNeeded();
      assert.equal(
        await first.evaluate((card) => getComputedStyle(card).opacity),
        "1",
        "Reduced-motion card must remain visible while scrolling",
      );
    } else {
      await page.waitForFunction(
        () => document.querySelector("[data-solution-card]")?.dataset.motionCard === "staged",
      );
      const initial = await first.evaluate((card) => ({
        visible: card.getBoundingClientRect().top < innerHeight,
        opacity: Number(getComputedStyle(card).opacity),
      }));
      assert.equal(initial.visible, false, "Card must begin genuinely below the viewport");
      assert.equal(initial.opacity, 0, "Offscreen card must be staged before scrolling");

      await page.evaluate(() => {
        const card = document.querySelector("[data-solution-card]");
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + bounds.top - innerHeight * 0.45,
          behavior: "instant",
        });
      });
      await page.waitForFunction(
        () => document.querySelector("[data-solution-card]")?.dataset.motionCard === "playing",
        null,
        { timeout: 3000 },
      );
      const frame = await first.evaluate((card) => ({
        opacity: Number(getComputedStyle(card).opacity),
        transform: getComputedStyle(card).transform,
        active: card.getAnimations().some((animation) => animation.playState === "running"),
      }));
      assert.ok(frame.active, "Actual WAAPI transition must run, not only a state attribute");
      assert.ok(frame.opacity < 1, "Animation must include visible intermediate opacity");
      assert.notEqual(frame.transform, "none", "Animation must translate the card into place");
      await page.screenshot({ path: `${output}/motion-mid-${engineName}-${viewport.width}.png` });

      await page.waitForFunction(
        () => document.querySelector("[data-solution-card]")?.dataset.motionCard === "complete",
        null,
        { timeout: 3000 },
      );
      const after = await first.evaluate((card) => ({
        opacity: Number(getComputedStyle(card).opacity),
        inlineOpacity: card.style.opacity,
      }));
      assert.ok(after.opacity >= 0.999, "Entrance must leave the card fully visible");
      assert.equal(after.inlineOpacity, "", "No persistent opacity override after completion");

      // Scroll away/back: never replay or fade out a card the user already saw.
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await first.scrollIntoViewIfNeeded();
      assert.equal(await first.getAttribute("data-motion-card"), "complete");
      assert.ok(
        (await first.evaluate((card) => Number(getComputedStyle(card).opacity))) >= 0.999,
        "Re-entered card must remain visible without another animation",
      );
    }

    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
      "Motion may not create horizontal overflow",
    );
    assert.deepEqual(errors, [], "Browser console errors");
    results.push({ engine: engineName, viewport: viewport.width, reducedMotion, status: "passed" });
  } finally {
    await context.close();
  }
}

try {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await check(viewport, "no-preference");
  }
  await check({ width: 390, height: 844 }, "reduce");
} catch (error) {
  results.push({ engine: engineName, status: "failed", error: String(error) });
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(`${output}/motion-contract-${engineName}.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}
