import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const origin = process.env.LIVE_SITE_ORIGIN || "https://mojchatbot.sk";
const output = process.env.VISUAL_OUTPUT || "visual-artifacts";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const results = [];
const errors = [];

async function scenario(name, width, path, verify) {
  if (process.env.VISUAL_FILTER && name !== process.env.VISUAL_FILTER) return;
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    hasTouch: width < 768,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  try {
    const response = await page.goto(`${origin}${path}?visual=${Date.now()}`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    assert.equal(response.status(), 200, "page must respond successfully");
    await page.locator("h1").first().waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);
    const refusal = page.getByRole("button", { name: "Odmietnuť analytiku", exact: true });
    await refusal.waitFor({ state: "visible", timeout: 5000 });
    assert.equal(
      await page
        .locator('script[data-ga-id], script[src*="insights"], script[src*="vercel-scripts"]')
        .count(),
      0,
      "optional analytics must stay unloaded before consent",
    );
    await refusal.click();
    assert.equal(await page.locator("html").getAttribute("data-analytics-consent"), "denied");
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2),
      false,
      "page must fit the viewport",
    );
    await verify(page, width);
    assert.deepEqual(runtimeErrors, [], "page must have no runtime errors");
    await page.screenshot({ path: join(output, `${name}-${width}.png`), fullPage: true });
    results.push({ name, width, path, status: "passed" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`${name} at ${width}: ${message}`);
    results.push({ name, width, path, status: "failed", message });
    await page
      .screenshot({ path: join(output, `${name}-${width}-failed.png`), fullPage: true })
      .catch(() => {});
  } finally {
    await context.close();
  }
}

async function loadedImages(images, minimum) {
  assert.ok((await images.count()) >= minimum, `expected at least ${minimum} images`);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((img) => img.decode()).catch(() => {});
    assert.equal(
      await image.evaluate((img) => img.complete && img.naturalWidth > 0),
      true,
      "image must load",
    );
    const box = await image.boundingBox();
    assert.ok(box && box.width > 80 && box.height > 50, "image must have useful visible geometry");
  }
}

async function navigation(page) {
  const nav = page.getByRole("navigation", { name: "Hlavná navigácia", exact: true });
  assert.ok(await nav.isVisible());
  const links = page.locator(".redesign-nav-links a");
  assert.equal(await links.count(), 4);
  const toggle = page.locator(".redesign-menu-toggle");
  if (await toggle.isVisible()) {
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    assert.ok(await links.first().isVisible());
    await page.keyboard.press("Escape");
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    await toggle.click();
    await page.mouse.click(5, 890);
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  } else {
    assert.ok(await links.first().isVisible());
    const cta = page.locator(".redesign-nav-cta");
    const before = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    await cta.hover();
    await page.waitForTimeout(250);
    const after = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    assert.notEqual(after, before, "CTA must invert on hover");
  }
}

async function homepage(page, width) {
  await navigation(page);
  assert.equal(
    await page.locator("#top h1").getAttribute("aria-label"),
    "Chatboty a konfigurátory na mieru pre váš web.",
  );
  assert.equal(await page.locator("#top img").count(), 3);
  await loadedImages(page.locator("#top img"), 3);
  const glyphsFit = await page.locator("#top h1").evaluate((heading) => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      for (let i = 0; i < node.textContent.length; i++) {
        if (!node.textContent[i].trim()) continue;
        const range = document.createRange();
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const box = range.getBoundingClientRect();
        if (box.left < -1 || box.right > innerWidth + 1) return false;
      }
    }
    return true;
  });
  assert.ok(glyphsFit, "all headline glyphs must fit");
  assert.ok(await page.getByRole("link", { name: "Vybrať riešenie" }).isVisible());
  assert.equal(await page.locator("#pred-a-po article").count(), 2);
  assert.equal(await page.locator(".redesign-cursor").count(), 0);
  const cursor = await page.locator("#top").evaluate((el) => getComputedStyle(el).cursor);
  assert.equal(
    cursor.includes("clean-arrow.svg"),
    width >= 768,
    "approved desktop cursor, native touch cursor",
  );
  const faq = page.locator("#faq button").nth(1);
  await faq.focus();
  await page.keyboard.press("Enter");
  assert.equal(await faq.getAttribute("aria-expanded"), "true");
  const answerId = await faq.getAttribute("aria-controls");
  assert.equal(await page.locator(`#${answerId}`).getAttribute("aria-hidden"), "false");
  const legal = page.getByRole("navigation", { name: "Právne odkazy" });
  for (const destination of ["/cookies", "/ochrana-udajov", "/pravne-informacie"]) {
    assert.ok(await legal.locator(`a[href$="${destination}"]`).isVisible());
  }
  await legal.getByRole("button", { name: "Nastavenia cookies" }).click();
  await page.getByRole("button", { name: "Odmietnuť analytiku", exact: true }).click();
  await page.locator(".redesign-nav-cta").click();
  await page.getByTestId("calculator-view").waitFor({ state: "visible", timeout: 15000 });
  assert.equal(await page.locator(".cw-chat-builder").count(), 0);
}

for (const width of [1440, 1280, 768, 390, 360]) await scenario("homepage", width, "/", homepage);
for (const width of [1440, 390]) {
  await scenario("pricing", width, "/cennik/", async (page) => {
    await navigation(page);
    const text = await page.locator("main").innerText();
    for (const value of [
      "347 €",
      "447 €",
      "10 €",
      "3D konfigurátor",
      "podľa rozsahu",
      "platiteľ DPH",
    ])
      assert.ok(text.includes(value), `pricing must include ${value}`);
    const custom = page.locator("a.ref-hover-17").filter({ hasText: "3D konfigurátor" });
    assert.equal(await custom.count(), 1);
    assert.ok(!(await custom.innerText()).includes("447 €"));
  });
  await scenario("projects", width, "/projekty/", async (page) => {
    await navigation(page);
    assert.equal(await page.locator("article.ref-hover-15").count(), 4);
    await loadedImages(page.locator("article.ref-hover-15 img"), 4);
  });
  await scenario("services", width, "/sluzby/", async (page) => {
    await navigation(page);
    await loadedImages(page.locator('main section img[src*="/work/"]'), 4);
    const text = await page.locator("main").innerText();
    for (const label of [
      "Firmy so službami",
      "E-shopy",
      "Kalkulačka",
      "Produktový poradca",
      "3D konfigurátor",
    ])
      assert.ok(text.includes(label), `services must include ${label}`);
  });
  await scenario("process", width, "/postup/", navigation);
  await scenario("contact", width, "/kontakt/", async (page) => {
    assert.ok(await page.locator("form input").first().isVisible());
    assert.ok(await page.locator('form button[type="submit"]').isVisible());
    assert.ok((await page.locator("form").boundingBox()).y < 900, "form must begin above the fold");
    assert.ok((await page.locator('main a[href$="/ochrana-udajov"]').count()) > 0);
  });
  for (const path of ["/cookies/", "/ochrana-udajov/", "/pravne-informacie/", "/preco-chatbot/"]) {
    await scenario(path.replaceAll("/", ""), width, path, async (page) =>
      assert.ok((await page.locator("main").innerText()).length > 300),
    );
  }
}
await writeFile(
  join(output, "report.json"),
  JSON.stringify(
    { checkedAt: new Date().toISOString(), origin, results, failures: errors },
    null,
    2,
  ),
);
await browser.close();
console.log(JSON.stringify(results, null, 2));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
}
