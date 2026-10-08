import { chromium } from "playwright";
import { stat } from "node:fs/promises";

const url = "https://koverta.sk/pages/konfigurator";
const path = "public/work/koverta/configurator-live-screenshot.jpg";
const browser = await chromium.launch({ headless: true, args: ["--disable-dev-shm-usage"] });
const context = await browser.newContext({
  viewport: { width: 1600, height: 920 },
  deviceScaleFactor: 1.5,
  locale: "sk-SK",
  colorScheme: "light",
  reducedMotion: "reduce",
});
const page = await context.newPage();
page.on("pageerror", (error) => console.log("Page error:", error.message));
try {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 50000 });
  await page.waitForTimeout(3000);
  const garden = page.getByRole("button", { name: "Pre dom a záhradu", exact: true }).first();
  if (await garden.isVisible()) await garden.click({ timeout: 12000 });
  const pergola = page.getByText("Pergola s otočnými lamelami", { exact: true }).first();
  if (await pergola.isVisible()) {
    await pergola.click({ timeout: 12000 });
    console.log("Selected live pergola configuration.");
  }
  // Wait for the actual 3D renderer, including fonts, to finish bootstrapping.
  await page.waitForTimeout(6500);
  await page.evaluate(() => document.fonts.ready);
  const canvases = await page.locator("canvas").count();
  console.log("Live site:", await page.title(), "canvas count:", canvases);
  const canvas = page.locator("canvas").first();
  if (canvases && await canvas.isVisible()) {
    await canvas.scrollIntoViewIfNeeded();
  } else {
    const heading = page.getByText("3D konfigurátor prístreškov a pergol", { exact: true }).first();
    if (await heading.isVisible()) await heading.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(1800);
  await page.screenshot({ path, type: "jpeg", quality: 91, animations: "disabled" });
  const result = await stat(path);
  console.log("Real webpage screenshot bytes:", result.size);
  if (result.size < 55000) throw new Error("Suspiciously empty screenshot");
} finally {
  await browser.close();
}
