const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("fs");
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  });
  const records = [];
  for (const width of [320, 390, 1366]) {
    const p = await b.newPage({ viewport: { width, height: 844 } });
    let payload = null;
    await p.route("**/api/lead", async (r) => {
      payload = r.request().postDataJSON();
      await r.fulfill({ json: { ok: true }, headers: { "access-control-allow-origin": "*" } });
    });
    await p.goto("http://127.0.0.1:4183/");
    await p.waitForTimeout(2600);
    const refuse = p.getByRole("button", { name: "Odmietnuť analytiku", exact: true });
    if (await refuse.isVisible()) await refuse.click();
    await p.getByTestId("widget-launcher").click();
    await p.waitForTimeout(650);
    await p.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }),
      ),
    );
    await p.waitForTimeout(650);
    await p.getByTestId("interest-chatbot").click();
    await p.getByTestId("flow-next").click();
    const steps = [];
    for (let i = 0; i < 8; i++) {
      await p.waitForTimeout(900);
      const stage = p.locator("[data-step]");
      const step = await stage.getAttribute("data-step");
      steps.push(step);
      if (step === "contact") break;
      const options = stage.locator("button[data-selected]");
      if (await options.count()) {
        await options.first().click();
        assert.equal(await options.first().getAttribute("data-selected"), "true");
      }
      const next = p.getByTestId("flow-next");
      if (await next.isVisible()) await next.click();
    }
    assert.equal(steps.at(-1), "contact");
    await p.getByPlaceholder("Vaše meno").fill("QA Widget");
    await p.getByPlaceholder("meno@firma.sk").fill("qa@example.com");
    await p.getByTestId("lead-submit").click();
    await p.waitForTimeout(600);
    assert.equal(payload.name, "QA Widget");
    assert.equal(payload.consent, true);
    await p.screenshot({ path: `/workspace/qa/after/widget-submitted-${width}.png` });
    records.push({ width, steps, payloadFields: Object.keys(payload), status: "passed" });
    await p.close();
  }
  await b.close();
  fs.writeFileSync("/workspace/qa/widget-flow.json", JSON.stringify(records, null, 2));
  console.log(records);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
