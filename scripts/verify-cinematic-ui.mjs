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
  await page.addInitScript(() => {
    window.__solutionMotion = { calls: 0, ready: 0, errors: [], duration: null };
    const native = document.startViewTransition?.bind(document);
    if (!native) return;
    document.startViewTransition = (update) => {
      window.__solutionMotion.calls++;
      const transition = native(update);
      transition.ready
        .then(() => {
          window.__solutionMotion.ready++;
          window.__solutionMotion.duration = getComputedStyle(
            document.documentElement,
            "::view-transition-group(solution-image)",
          ).animationDuration;
        })
        .catch((e) => window.__solutionMotion.errors.push(e.message));
      return transition;
    };
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/chat", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.fulfill({ json: { reply }, headers: { "access-control-allow-origin": "*" } });
  });
  try {
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(
      () =>
        document.querySelector(".analytics-consent") ||
        document.documentElement.dataset.analyticsConsent,
      null,
      { timeout: 10000 },
    );
    const refuse = page.getByRole("button", { name: "Odmietnuť analytiku", exact: true });
    if (await refuse.isVisible()) await refuse.click();
    await page.locator('#top[data-headline-ready="true"]').waitFor();
    await page.waitForTimeout(2100);
    assert.equal(
      await page
        .locator('[id="hybrid-hero-title"] span span')
        .evaluateAll((els) => els.every((el) => getComputedStyle(el).opacity === "1")),
      true,
      "typed hero completes every letter",
    );
    assert.equal(
      await page.locator('#top a[target="_blank"]').count(),
      3,
      "hero shows three real projects",
    );
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
      const title = await card.locator("h3").boundingBox();
      const frameBounds = await card.boundingBox();
      assert.ok(
        title.y >= frameBounds.y + 8 &&
          title.y + title.height <= frameBounds.y + frameBounds.height - 8,
        "solution title must be fully visible",
      );
      const capture = card.locator("[data-real-preview] img");
      if (await capture.count()) {
        assert.ok(
          await capture.evaluate((img) => img.complete && img.naturalWidth > 0),
          "real capture must load",
        );
        const shape = await capture.evaluate((img) => ({
          shown: img.clientWidth / img.clientHeight,
          source: img.naturalWidth / img.naturalHeight,
          fit: getComputedStyle(img).objectFit,
        }));
        assert.ok(
          Math.abs(shape.shown - shape.source) < 0.02 && shape.fit === "contain",
          "real captures preserve their full proportions",
        );
      }
    }
    await cards.nth(1).scrollIntoViewIfNeeded();
    if (viewport.width >= 768) {
      const preview = cards.nth(1).locator("[data-real-preview]");
      const before = await preview.boundingBox();
      await cards.nth(1).hover();
      await page.waitForTimeout(900);
      const after = await preview.boundingBox();
      assert.ok(after.y < before.y - 3, "hover must move the product preview");
    }
    await page
      .locator("#riesenia")
      .screenshot({ path: `${output}/solutions-${viewport.width}.png` });
    await page.locator("#pred-a-po").scrollIntoViewIfNeeded();
    const mail = page.locator("#pred-a-po");
    assert.ok((await mail.innerText()).includes("8 490 €"));
    assert.ok((await mail.innerText()).includes("+421 900 123 456"));
    const windows = await mail.locator("[data-mail-preview]").evaluateAll((els) =>
      els.map((el) => {
        const b = el.getBoundingClientRect();
        return { w: b.width, h: b.height, x: b.x, y: b.y, bottom: b.bottom };
      }),
    );
    assert.equal(windows.length, 2);
    if (viewport.width > 700)
      assert.ok(
        Math.abs(windows[0].w - windows[1].w) < 2 && Math.abs(windows[0].h - windows[1].h) < 2,
        "desktop email windows must match",
      );
    else
      assert.ok(
        windows[1].y > windows[0].bottom && windows[1].w > viewport.width - 70,
        "phone email previews stack at readable width",
      );
    await mail.screenshot({ path: `${output}/mail-${viewport.width}.png` });
    await mail.getByRole("button", { name: "Z kalkulačky", exact: true }).click();
    assert.ok((await mail.innerText()).includes("892 €"));
    const cases = page.locator(".redesign-case-shot img");
    assert.equal(await cases.count(), 5, "all project cards show actual photographs/captures");
    for (const shot of await cases.all()) {
      await shot.scrollIntoViewIfNeeded();
      await shot.evaluate((img) => img.decode());
      assert.ok(await shot.evaluate((img) => img.complete && img.naturalWidth > 0));
    }
    await cards
      .nth(1)
      .getByRole("link")
      .click({ position: { x: 80, y: 100 } });
    await page.waitForURL(/nastroj\?t=chatbot/);
    await page.waitForFunction(
      () => window.__solutionMotion.ready === 1 || window.__solutionMotion.errors.length > 0,
    );
    const motion = await page.evaluate(() => window.__solutionMotion);
    assert.equal(motion.calls, 1, "card starts an actual browser transition");
    assert.deepEqual(motion.errors, [], "shared image transition cannot be skipped");
    assert.equal(motion.ready, 1, "shared image transition must render successfully");
    assert.equal(motion.duration, "1.1s", "the image visibly travels for 1.1 seconds");
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${output}/opening-${viewport.width}.png` });
    await page.waitForTimeout(1250);
    const detail = page.locator(".solution-detail__image");
    assert.equal(await detail.count(), 1);
    assert.ok((await detail.getAttribute("src")).includes("webko-chat-native"));
    const detailShape = await detail.evaluate((img) => ({
      shown: img.clientWidth / img.clientHeight,
      source: img.naturalWidth / img.naturalHeight,
    }));
    assert.ok(
      Math.abs(detailShape.shown - detailShape.source) < 0.02,
      "detail shows whole real widget",
    );
    assert.equal(await page.locator('img[src*="chatbot-aplan"]').count(), 0);
    await page.screenshot({ path: `${output}/chatbot-detail-${viewport.width}.png` });
    await page.getByTestId("widget-launcher").click();
    await page.waitForTimeout(1100);
    assert.ok(await page.getByTestId("assistant-view").isVisible());
    const bounds = await page.locator(".cw-panel").boundingBox();
    assert.ok(
      bounds.x >= 0 &&
        bounds.y >= 0 &&
        bounds.x + bounds.width <= viewport.width + 1 &&
        bounds.y + bounds.height <= viewport.height + 1,
      "widget must fit visible phone and desktop viewport",
    );
    assert.equal(await page.locator(".cw-message-row--me .cw-message-wrap p").count(), 0);

    const input = page.getByPlaceholder("Napíšte otázku…");
    await input.fill("Ako mi pomôže kalkulačka?");
    await page.getByRole("button", { name: "Odoslať správu", exact: true }).click();
    await page
      .getByRole("status", { name: "Píšem odpoveď", exact: true })
      .waitFor({ state: "visible" });
    assert.equal(await page.locator(".cw-writing-dots i").count(), 3);
    assert.equal(
      await page.locator(".cw-typing svg").count(),
      0,
      "writing indicator contains only dots",
    );
    assert.equal(await page.locator(".cw-writing-row .cw-avatar").count(), 0);
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
    if (viewport.width < 768) {
      await input.focus();
      await page.setViewportSize({ width: viewport.width, height: 430 });
      await page.waitForTimeout(300);
      const composer = await input.boundingBox();
      const panel = await page.locator(".cw-panel").boundingBox();
      assert.ok(
        panel.y >= 0 && panel.y + panel.height <= 431 && composer.y + composer.height <= 430,
        "composer stays visible at keyboard-height viewport",
      );
      assert.equal(await input.evaluate((el) => getComputedStyle(el).fontSize), "16px");
      await page.setViewportSize(viewport);
    }

    await page.getByTestId("widget-close").click();
    await page.waitForTimeout(500);
    assert.equal(await page.locator(".cw-panel").isVisible(), false);
    await page.goto(`${origin}/postup`, { waitUntil: "networkidle" });
    const aside = page.locator(".process-aside");
    if (viewport.width <= 1040) {
      assert.equal(await aside.evaluate((el) => getComputedStyle(el).position), "relative");
      const a = await aside.boundingBox();
      const steps = await page.locator(".process-steps").boundingBox();
      assert.ok(steps.y >= a.y + a.height + 20, "process aside never overlays mobile steps");
      for (const step of await page.locator(".process-step").all()) {
        await step.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1100);
        const h = await step.locator("h3").boundingBox();
        assert.ok(h.x >= 0 && h.x + h.width <= viewport.width);
      }
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2));
    await page.screenshot({ path: `${output}/process-${viewport.width}.png` });
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
