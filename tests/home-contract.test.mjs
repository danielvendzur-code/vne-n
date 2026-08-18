import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("public homepage is owned by the new brand-studio experience", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const route = await read("src/routes/index.tsx");
  const home = await read("src/components/site/BrandStudioHome.tsx");
  const css = await read("src/components/site/BrandStudioHome.css");

  assert.match(route, /BrandStudioHome/);
  assert.match(route, /data-landing-variant="public"/);
  assert.match(home, /Z návštevy webu spravíme/);
  assert.match(home, /pripravený dopyt/);
  assert.match(home, /id="realizacie"/);
  assert.match(home, /id="cena"/);
  assert.match(home, /openSiteAssistant/);
  assert.match(layout, /data-brand-studio="true"/);
  assert.match(layout, /BrandStudioRoutes\.css/);
  assert.match(css, /#5b5ef7/i);
  assert.match(css, /#7c5cfc/i);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(home, /Sparkles|✨|aurora|particle/i);
});

test("pricing communicates the three current service levels", async () => {
  const pricing = await read("src/routes/cennik.tsx");
  const pricingCss = await read("src/components/site/BrandStudioPricingPage.css");

  for (const marker of [
    "START",
    "od 390 €",
    "29 € / mes.",
    "SMART",
    "od 690 €",
    "39 € / mes.",
    "PRO",
    "od 990 €",
    "59 € / mes.",
    "Čo potrebujeme od vás",
  ]) {
    assert.match(pricing, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(pricing, /Najčastejšia voľba/);
  assert.match(pricing, /Uvedené ceny sú orientačné/);
  assert.match(pricingCss, /brand-pricing-table/);
  assert.match(pricingCss, /brand-pricing-row/);
  assert.doesNotMatch(pricing, /HomeConversionUpgrade/);
  assert.doesNotMatch(pricing, /350 €|10 € \/ mesiac/);
});

test("realizations remain real websites rather than invented portfolio entries", async () => {
  const data = await read("src/data/realizations.ts");
  for (const marker of [
    "DERAT",
    "derat.sk",
    "Môj Plot",
    "mojplot.sk",
    "Koverta",
    "koverta.sk",
    "WEBKO",
    "webko.sk",
  ]) {
    assert.match(data, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.match(data, /https:\/\//);
  assert.doesNotMatch(data, /example\.com|placeholder/i);
});

test("contact form submits directly and keeps a resilient fallback", async () => {
  const contact = await read("src/routes/kontakt.tsx");
  const client = await read("src/lib/lead-submission.ts");

  assert.match(contact, /await submitWebsiteLead/);
  assert.match(contact, /submitState === "done"/);
  assert.match(contact, /contact-consent/);
  assert.doesNotMatch(contact, /window\.location\.assign\(`mailto:/);
  assert.match(client, /api\/lead/);
  assert.match(client, /AbortController/);
  assert.match(client, /fallback/);
});

test("lead endpoint stays first-party and server secrets never reach the browser", async () => {
  const api = await read("src/routes/api.lead.ts");
  const mail = await read("src/lib/lead-email.ts");
  const client = await read("src/lib/lead-submission.ts");

  assert.match(client, /"\/api\/lead"/);
  assert.doesNotMatch(client, /moj-chatbot-backend\.vercel\.app/);
  assert.match(mail, /process\.env\.RESEND_API_KEY/);
  assert.doesNotMatch(mail, /import\.meta\.env/);
  assert.doesNotMatch(client, /RESEND/);
  assert.match(mail, /reply_to: lead\.email/);
  assert.match(mail, /reply_to: LEAD_RECIPIENT/);
  assert.match(api, /invalid-payload/);
  assert.match(api, /HEADER_INJECTION/);
  assert.match(api, /raw\.website/);
  assert.match(api, /rateLimited/);
  assert.match(api, /too-many-requests/);
  assert.match(api, /delivery-not-configured/);
  assert.match(api, /mailtoFallback/);
});

test("assistant loader is cache-fresh and fallback always points to our contact route", async () => {
  const root = await read("src/routes/__root.tsx");
  const loader = await read("public/widget-loader.js");

  assert.match(root, /Content-Security-Policy/);
  assert.match(root, /strict-origin-when-cross-origin/);
  assert.match(root, /VITE_ASSISTANT_EMBED_URL/);
  assert.match(root, /data-assistant-source=\{safeAssistantEmbedUrl\}/);
  assert.match(loader, /__DV_ASSISTANT_LOADER_ACTIVE__/);
  assert.match(loader, /MOUNT_TIMEOUT/);
  assert.match(loader, /buildKey/);
  assert.match(loader, /pendingOpen/);
  assert.match(loader, /__siteAssistantEmbed/);

  const fallbackHrefFor = (basePath) => {
    let fallbackAnchor;

    class MockElement {
      constructor(tagName) {
        this.tagName = tagName;
        this.dataset = {};
        this.style = {};
      }
      setAttribute() {}
      remove() {}
    }

    const document = {
      readyState: "complete",
      documentElement: {
        dataset: {
          assistantSource: "https://example.test/embed.js",
          basePath,
        },
      },
      getElementById: () => null,
      createElement: (tagName) => new MockElement(tagName),
      head: { appendChild: (element) => element.onerror?.() },
      body: { appendChild: (element) => (fallbackAnchor = element) },
    };
    const window = { addEventListener() {}, removeEventListener() {} };

    runInNewContext(loader, { document, HTMLElement: MockElement, window });
    return fallbackAnchor?.href;
  };

  assert.equal(fallbackHrefFor("/"), "/kontakt");
  assert.equal(fallbackHrefFor("/vne-n/"), "/vne-n/kontakt");
});

test("the public site keeps responsive and reduced-motion contracts", async () => {
  const homeCss = await read("src/components/site/BrandStudioHome.css");
  const routeCss = await read("src/components/site/BrandStudioRoutes.css");
  const shellCss = await read("src/components/site/BrandStudioShell.css");

  assert.match(homeCss, /@media \(max-width: 760px\)/);
  assert.match(routeCss, /@media \(max-width: 760px\)/);
  assert.match(shellCss, /@media \(max-width: 767px\)/);
  assert.match(homeCss, /prefers-reduced-motion/);
  assert.match(routeCss, /prefers-reduced-motion/);
});
