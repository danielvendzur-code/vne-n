const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("fs");
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  });
  const results = [];
  for (const width of [390, 1366])
    for (const reducedMotion of ["no-preference", "reduce"]) {
      const c = await b.newContext({
        viewport: { width, height: 844 },
        reducedMotion,
        recordVideo: { dir: "/workspace/qa/recordings", size: { width, height: 844 } },
      });
      const p = await c.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      p.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      let lead = null;
      await p.route("**/api/lead", async (r) => {
        lead = r.request().postDataJSON();
        await r.fulfill({
          json: { ok: true, autoReplySent: true },
          headers: { "access-control-allow-origin": "*" },
        });
      });
      await p.goto("http://127.0.0.1:4183/");
      await p.waitForTimeout(2600);
      const refuse = p.getByRole("button", { name: "Odmietnuť analytiku", exact: true });
      if (await refuse.isVisible()) await refuse.click();
      const hero = p.locator('#top a[target="_blank"]');
      assert.equal(await hero.locator("span").count(), 0);
      assert.ok(
        await hero.evaluateAll((es) =>
          es.every((e) => getComputedStyle(e).borderTopWidth === "0px"),
        ),
      );
      await p.getByRole("button", { name: "Otvoriť menu", exact: true }).click();
      await p.waitForTimeout(750);
      await p.screenshot({ path: `/workspace/qa/after/menu-${width}-${reducedMotion}.png` });
      assert.ok(
        await p
          .locator("#site-menu")
          .evaluate((e) => e.getBoundingClientRect().right <= innerWidth),
      );
      await p.keyboard.press("Escape");
      await p.locator("#riesenia").scrollIntoViewIfNeeded();
      await p.waitForTimeout(1300);
      if (reducedMotion === "no-preference")
        await p.evaluate(() => (document.startViewTransition = undefined));
      await p.locator("[data-solution-card]").nth(1).getByRole("link").click();
      await p.waitForURL(/t=chatbot/);
      await p.waitForTimeout(850);
      assert.equal(await p.locator(".solution-flight").count(), 0);
      assert.ok(await p.locator(".solution-detail__image").isVisible());
      await p.goBack();
      await p.locator("[data-solution-card]").first().waitFor();
      for (const route of ["/nastroj?t=kalkulacka", "/nastroj?t=poradca", "/3d-konfigurator"]) {
        await p.goto("http://127.0.0.1:4183" + route);
        await p.waitForTimeout(900);
        assert.ok(await p.locator("h1").isVisible());
        assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2));
        if (route.includes("poradca")) {
          await p.getByRole("button", { name: "Vyskúšať poradcu", exact: true }).click();
          for (const [label, expected] of [
            ["Suchá", "Hydratačný krém"],
            ["Citlivá", "Jemná starostlivosť"],
            ["Mastná", "Ľahký hydratačný gél"],
          ]) {
            await p.getByRole("button", { name: label, exact: true }).click();
            assert.ok(
              (await p.locator("[data-skincare-demo] [aria-live]").innerText()).includes(expected),
            );
          }
          await p.screenshot({ path: `/workspace/qa/after/advisor-${width}-${reducedMotion}.png` });
        }
      }
      await p.goto("http://127.0.0.1:4183/");
      await p.waitForTimeout(1000);
      await p.locator("#kontakt").scrollIntoViewIfNeeded();
      const buttons = p.locator("#kontakt .mc-btn");
      assert.equal(await buttons.count(), 2);
      const shapes = await buttons.evaluateAll((es) =>
        es.map((e) => ({
          r: getComputedStyle(e).borderRadius,
          h: e.getBoundingClientRect().height,
        })),
      );
      assert.equal(shapes[0].r, shapes[1].r);
      assert.equal(shapes[0].h, shapes[1].h);
      await p
        .locator("#kontakt")
        .screenshot({ path: `/workspace/qa/after/footer-${width}-${reducedMotion}.png` });
      await p.goto("http://127.0.0.1:4183/kontakt");
      await p.waitForTimeout(900);
      await p.getByPlaceholder("Vaše meno").fill("QA Test");
      await p.getByPlaceholder("vas@email.sk").fill("qa@example.com");
      await p
        .locator("form textarea")
        .fill("Bezpečný test formulára: iba zachytené dáta, bez odoslania e-mailu.");
      await p.locator('form button[type="submit"]').click();
      await p.waitForTimeout(500);
      assert.equal(lead.name, "QA Test");
      assert.equal(lead.consent, true);
      await p.waitForURL(/dakujeme/);
      assert.ok(await p.locator("h1").isVisible());
      assert.deepEqual(errors, []);
      results.push({ width, reducedMotion, status: "passed" });
      await c.close();
    }
  await b.close();
  fs.writeFileSync("/workspace/qa/regression.json", JSON.stringify(results, null, 2));
  console.log(results);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
