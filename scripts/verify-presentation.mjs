import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = (process.argv[2] || "http://127.0.0.1:5176").replace(/\/$/, "");
const output = process.env.VISUAL_OUTPUT || "/tmp/moj-chatbot-visual";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  headless: true,
  args: ["--no-sandbox"],
});
const errors = [];
const results = [];
try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 390, height: 844 },
    { width: 320, height: 740 },
  ]) {
    const context = await browser.newContext({ viewport });
    if (process.env.BROWSER_TRANSPORT_MODULE) {
      const { default: installTransport } = await import(process.env.BROWSER_TRANSPORT_MODULE);
      await installTransport(context);
    }
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(`${viewport.width}: ${error.message}`));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("#riesenia article[data-kind]").count(), 4);
    assert.equal(await page.locator('a[aria-label="Otvoriť Koverta"]').count(), 1);
    await page.screenshot({ path: `${output}/hero-${viewport.width}.png` });
    const hero = page.locator('[aria-label="Vybrané živé realizácie"] a').first();
    await hero.focus();
    await page.waitForTimeout(350);
    assert.equal(await hero.evaluate((el) => getComputedStyle(el).zIndex), "5");
    await page.getByRole("heading", { name: "Aké riešenie potrebujete?" }).scrollIntoViewIfNeeded();
    for (const image of await page.locator("#riesenia article img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((el) => el.decode());
    }
    const images = await page.locator("#riesenia article img").evaluateAll((list) =>
      list.map((el) => ({
        loaded: el.complete && el.naturalWidth > 0,
        fit: getComputedStyle(el).objectFit,
      })),
    );
    assert.ok(
      images.every((image) => image.loaded && image.fit === "contain"),
      "all four solution shots must load without cropping",
    );
    const cta = page.locator("#riesenia article").first().getByRole("link");
    const style = await cta.evaluate((el) => ({
      radius: getComputedStyle(el).borderRadius,
      background: getComputedStyle(el).backgroundColor,
      height: el.getBoundingClientRect().height,
    }));
    assert.equal(style.radius, "6px");
    assert.equal(style.background, "rgb(18, 55, 45)");
    assert.ok(style.height >= 48);
    await page
      .locator("#riesenia")
      .screenshot({ path: `${output}/solutions-${viewport.width}.png` });
    const step = page.getByRole("tab", { name: /01 Ukážete nám web/ });
    await step.scrollIntoViewIfNeeded();
    await step.focus();
    await page.keyboard.press("End");
    assert.equal(
      await page.getByRole("tab", { name: /04 Nasadíme na váš web/ }).getAttribute("aria-selected"),
      "true",
    );
    await page.locator("#process-panel img").evaluate((img) => img.decode());
    assert.ok(
      await page
        .locator("#process-panel")
        .innerText()
        .then((text) => text.includes("Výstup: spustené riešenie")),
    );
    await page.locator("#proces").screenshot({ path: `${output}/process-${viewport.width}.png` });
    const faq = page.locator("#otazky summary").first();
    await faq.scrollIntoViewIfNeeded();
    await faq.focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#otazky details").first().getAttribute("open"), "");
    await page
      .locator("#realizacie")
      .screenshot({ path: `${output}/projects-${viewport.width}.png` });
    await page.goto(`${base}/kontakt`, { waitUntil: "networkidle" });
    const send = page.getByRole("button", { name: "Odoslať zadanie", exact: true });
    if (viewport.width >= 1000) {
      const bounds = await send.boundingBox();
      assert.ok(
        bounds.y + bounds.height <= viewport.height,
        `submit button must fit in ${viewport.width} × ${viewport.height}`,
      );
    } else {
      const form = await page.locator("form").boundingBox();
      const aside = await page.locator("aside").boundingBox();
      assert.ok(form.y < aside.y, "mobile form must precede supporting information");
      await page.getByRole("button", { name: "Otvoriť menu", exact: true }).click();
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .getByRole("button", { name: "Otvoriť menu", exact: true })
          .getAttribute("aria-expanded"),
        "false",
      );
    }
    await page.screenshot({
      path: `${output}/contact-${viewport.width}.png`,
      fullPage: viewport.width < 720,
    });
    await send.click();
    assert.match(await page.getByRole("alert").innerText(), /Vyplňte meno/);
    await page.getByLabel("Meno *", { exact: true }).fill("Test náhľadu");
    await page.getByLabel("E-mail *", { exact: true }).fill("preview@example.com");
    await page
      .getByLabel("Čo má web zjednodušiť? *", { exact: true })
      .fill("Overenie kontaktného formulára v náhľade.");
    let payload;
    await page.route("**/api/lead", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "delivery-not-configured" }),
      });
    });
    await send.click();
    await page.getByRole("link", { name: /Otvoriť pripravený e-mail/ }).waitFor();
    assert.equal(payload.name, "Test náhľadu");
    assert.equal(payload.consent, true);
    assert.equal(payload.website, "");
    assert.equal(await page.getByLabel("Meno *", { exact: true }).inputValue(), "Test náhľadu");
    await page.route("**/api/lead", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, autoReplySent: true }),
      }),
    );
    await send.click();
    await page.waitForURL("**/dakujeme");
    assert.ok(await page.getByRole("heading", { level: 1 }).isVisible());
    const apiResponse = await context.request.get(`${base}/api/lead`);
    assert.equal(apiResponse.status(), 405);
    const invalid = await context.request.post(`${base}/api/lead`, { data: {} });
    assert.equal(invalid.status(), 422);
    for (const path of ["/", "/sluzby", "/projekty", "/postup", "/cennik"]) {
      await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
        `${path}: horizontal overflow at ${viewport.width}px`,
      );
    }
    await page.screenshot({ path: `${output}/home-${viewport.width}.png`, fullPage: true });
    results.push(
      `${viewport.width} × ${viewport.height}: hero focus, images, CTA, four steps, FAQ, menu, contact validation and success/fallback, server validation, overflow passed`,
    );
    await context.close();
  }
  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await reduced.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(
    await page
      .locator("header svg path")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  results.push("Reduced motion: original logo remains visible without animation");
  await reduced.close();
  assert.deepEqual(errors, [], "the application must hydrate without browser errors");
  results.forEach((result) => console.log(result));
} finally {
  await browser.close();
}
