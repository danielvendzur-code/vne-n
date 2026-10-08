const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fs = require("fs");
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  });
  const records = [];
  for (const width of [390, 1366])
    for (let round = 0; round < 3; round++)
      for (const [name, port] of [
        ["before", 4184],
        ["after", 4183],
      ]) {
        const p = await b.newPage({ viewport: { width, height: 844 } });
        const cdp = await p.context().newCDPSession(p);
        await cdp.send("Network.enable");
        await cdp.send("Network.emulateNetworkConditions", {
          offline: false,
          latency: 40,
          downloadThroughput: 1.5e6 / 8,
          uploadThroughput: 750000 / 8,
        });
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await p.addInitScript(() => {
          window.__perf = { lcp: 0, cls: 0, longTasks: 0 };
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) window.__perf.lcp = e.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value;
          }).observe({ type: "layout-shift", buffered: true });
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) window.__perf.longTasks += e.duration;
          }).observe({ type: "longtask", buffered: true });
        });
        await p.goto("http://127.0.0.1:" + port, { waitUntil: "load" });
        await p.waitForTimeout(6000);
        records.push({
          name,
          width,
          round,
          ...(await p.evaluate(() => ({
            ...window.__perf,
            bytes: performance.getEntriesByType("resource").reduce((n, e) => n + e.transferSize, 0),
            domReady: performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd,
          }))),
        });
        await p.close();
      }
  await b.close();
  fs.writeFileSync("/workspace/qa/performance.json", JSON.stringify(records, null, 2));
  console.log(records);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
