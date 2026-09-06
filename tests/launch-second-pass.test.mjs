import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("contact fallback never forces a mail client", async () => {
  const contact = await read("src/routes/kontakt.tsx");

  assert.doesNotMatch(
    contact,
    /if \(result\.fallback\) \{\s*window\.location\.assign\(result\.fallback\)/,
  );
  assert.match(contact, /setFallbackHref\(result\.fallback\)/);
  assert.match(contact, /Otvoriť pripravený e-mail/);
  assert.match(contact, /Zadanie zostalo vyplnené/);
});

test("analytics consent is propagated to the embedded assistant", async () => {
  const consent = await read("src/components/site/AnalyticsConsent.tsx");
  const root = await read("src/routes/__root.tsx");

  assert.match(consent, /dataset\.analyticsConsent = value/);
  assert.match(consent, /syncConsentDataset\(stored\)/);
  assert.match(consent, /syncConsentDataset\(value\)/);
  assert.doesNotMatch(
    root,
    /rel:\s*"preconnect",\s*href:\s*"https:\/\/www\.googletagmanager\.com"/,
  );
});

test("homepage transition label does not duplicate numbered chapter 03", async () => {
  const landing = await read("src/components/site/KageLanding.tsx");

  assert.match(landing, /<span className="section-index">ČO TO ZMENÍ<\/span>/);
  assert.equal((landing.match(/<b>03<\/b>/g) ?? []).length, 1);
  assert.match(landing, /<b>03<\/b> AKO TO FUNGUJE/);
});

test("desktop hero final authority removes stale preview clipping", async () => {
  const css = await read("src/components/site/LaunchReadinessFinal.css");

  assert.match(
    css,
    /\.hybrid-hero__case \.project-composite \{[\s\S]*?clip-path:\s*none\s*!important/,
  );
  assert.match(
    css,
    /\.hybrid-hero__case \.project-composite__site \{[\s\S]*?object-fit:\s*cover\s*!important/,
  );
  assert.match(
    css,
    /\.hybrid-hero__case \.project-composite__site \{[\s\S]*?transform:\s*none\s*!important/,
  );
});
