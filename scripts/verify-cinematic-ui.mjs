import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const origin = process.env.LIVE_SITE_ORIGIN || "http://127.0.0.1:4173";
const output = process.env.VISUAL_OUTPUT || "visual-artifacts";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
const failures = [];
const reply =
  "**Kalkulačka** vám ukáže presnú cenu podľa cenníka.\n\nVyberiete si rozmery, farbu a montáž. Pomôžem vám pripraviť celý výber.";
const sizes = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 640 },
];
for (const viewport of sizes) {
  const context = await browser.newContext({
    viewport,
    hasTouch: viewport.width < 768,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/chat", (route) =>
    route.fulfill({ json: { reply }, headers: { "access-control-allow-origin": "*" } }),
  );
  try {
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const refuse = page.getByRole("button", { name: "Odmietnuť analytiku", exact: true });
    if (await refuse.isVisible()) await refuse.click();
    await page.waitForTimeout(1800);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
      true,
      "homepage must fit horizontally",
    );
    const header = page.getByRole("navigation", { name: "Hlavná navigácia", exact: true });
    const brand = await header
      .getByRole("link", { name: "Môj Chatbot — úvod", exact: true })
      .boundingBox();
    assert.ok(
      brand.x >= 12 && brand.x + brand.width < viewport.width - 12,
      "header mark and name must be fully visible",
    );
    await page.screenshot({ path: `${output}/hero-${viewport.width}.png` });
    const menu = header.locator('button[aria-controls="site-menu"]');
    await menu.click();
    assert.equal(await menu.getAttribute("aria-expanded"), "true");
    await page
      .locator("#site-menu")
      .getByRole("link", { name: /Riešenia/ })
      .waitFor({ state: "visible" });
    await page.screenshot({ path: `${output}/menu-${viewport.width}.png` });
    await page.keyboard.press("Escape");
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    const cards = page.locator("[data-solution-card]");
    assert.equal(await cards.count(), 4);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1350);
      assert.equal(await card.getByRole("link").count(), 1, "whole card uses one link");
      const frame = card.locator("[data-product-preview]");
      if (await frame.count()) {
        const fits = await frame.evaluate((el) => ({
          w: el.scrollWidth <= el.clientWidth + 2,
          h: el.scrollHeight <= el.clientHeight + 2,
          size: [el.clientWidth, el.clientHeight, el.scrollWidth, el.scrollHeight],
        }));
        assert.ok(
          fits.w && fits.h,
          `complete native interface must fit at ${viewport.width}: ${JSON.stringify(fits)}`,
        );
        assert.ok(await frame.locator("div").last().isVisible());
      }
    }
    await cards.nth(1).scrollIntoViewIfNeeded();
    if (viewport.width >= 768) {
      const preview = cards.nth(1).locator("[data-product-preview]");
      const before = await preview.boundingBox();
      await cards.nth(1).hover();
      await page.waitForTimeout(900);
      const after = await preview.boundingBox();
      assert.ok(after.y < before.y - 3, "hover must move the product preview");
    }
    await page.screenshot({ path: `${output}/solutions-${viewport.width}.png` });
    await page.locator("#pred-a-po").scrollIntoViewIfNeeded();
    const mail = page.locator("#pred-a-po");
    assert.ok((await mail.innerText()).includes("8 490 €"));
    assert.ok((await mail.innerText()).includes("+421 900 123 456"));
    const windows = await mail.locator('[class*="gmail_"]').evaluateAll((els) =>
      els.map((el) => ({
        w: el.getBoundingClientRect().width,
        h: el.getBoundingClientRect().height,
      })),
    );
    assert.equal(windows.length, 2);
    assert.ok(
      Math.abs(windows[0].w - windows[1].w) < 2 && Math.abs(windows[0].h - windows[1].h) < 2,
      "email windows must match",
    );
    await page.screenshot({ path: `${output}/mail-${viewport.width}.png` });
    await mail.getByRole("button", { name: "Z kalkulačky", exact: true }).click();
    assert.ok((await mail.innerText()).includes("892 €"));
    await cards
      .nth(1)
      .getByRole("link")
      .click({ position: { x: 80, y: 220 } });
    await page.waitForURL(/nastroj\?t=chatbot/);
    await page.waitForTimeout(1250);
    assert.equal(await page.locator(".solution-detail__native [data-product-preview]").count(), 1);
    assert.equal(await page.locator('img[src*="chatbot-aplan"]').count(), 0);
    await page.screenshot({ path: `${output}/chatbot-detail-${viewport.width}.png` });
    await page.getByTestId("widget-launcher").click();
    await page.waitForTimeout(1100);
    assert.ok(await page.getByTestId("assistant-view").isVisible());
    assert.equal(await page.locator(".cw-writing-dots i").count(), 3);
    const input = page.getByPlaceholder("Napíšte otázku…");
    await input.fill("Ako mi pomôže kalkulačka?");
    await page.getByRole("button", { name: "Odoslať správu", exact: true }).click();
    const bubble = page.locator('.cw-message-row--bot[data-streaming="true"]');
    await bubble.waitFor({ state: "visible" });
    const first = (await bubble.innerText()).length;
    await page.waitForTimeout(180);
    const later = (await bubble.innerText()).length;
    assert.ok(later > first && later < reply.length, "reply must write gradually");
    await input.fill("A čo konfigurátor?");
    await input.press("Enter");
    assert.equal(
      await input.inputValue(),
      "A čo konfigurátor?",
      "streaming must preserve the next draft",
    );
    await page
      .getByRole("button", { name: "Odoslať správu", exact: true })
      .waitFor({ state: "visible" });
    await page.waitForFunction(
      () => !document.querySelector('.cw-message-row--bot[data-streaming="true"]'),
      null,
      { timeout: 15000 },
    );
    assert.ok(
      (await page.locator(".cw-message-row--bot").last().innerText()).includes("presnú cenu"),
    );
    assert.equal(await page.locator(".cw-writing-dots").count(), 0);
    await page.screenshot({ path: `${output}/widget-${viewport.width}.png` });
    await page.getByTestId("widget-close").click();
    await page.waitForTimeout(400);
    assert.equal(await page.locator(".cw-panel").isVisible(), false);
    assert.deepEqual(errors, []);
    results.push({ viewport, status: "passed" });
  } catch (error) {
    failures.push(`${viewport.width}: ${error.message}`);
    results.push({ viewport, status: "failed", error: error.message });
    await page
      .screenshot({ path: `${output}/failed-${viewport.width}.png`, fullPage: true })
      .catch(() => {});
  }
  await context.close();
}
await browser.close();
await writeFile(
  `${output}/cinematic-report.json`,
  JSON.stringify({ origin, results, failures }, null, 2),
);
console.log(JSON.stringify({ results, failures }, null, 2));
if (failures.length) process.exitCode = 1;
