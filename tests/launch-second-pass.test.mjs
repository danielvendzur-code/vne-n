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

test("privacy copy matches actual browser and server chat retention", async () => {
  const cookies = await read("src/routes/cookies.tsx");
  const privacy = await read("src/routes/ochrana-udajov.tsx");

  assert.match(cookies, /náhodný identifikátor[\s\S]*?najviac 24 hodín/);
  assert.match(cookies, /neslúžia na reklamu ani profilovanie/);
  assert.match(privacy, /Rozpracovaný chat v prehliadači najviac 24 hodín/);
  assert.match(privacy, /serverová história konverzácie najviac 90 dní/);
});


test("legal page does not pretend a contact form creates a consumer contract", async () => {
  const legal = await read("src/routes/pravne-informacie.tsx");

  assert.match(legal, /Odoslanie formulára alebo dopytu[\s\S]*?nevytvára objednávku ani/);
  assert.match(legal, /povinné[\s\S]*?informácie[\s\S]*?pred jej uzavretím/);
  assert.match(legal, /alternatívne riešenie spotrebiteľského sporu/);
  assert.match(legal, /soi\.sk\/alternativne-riesenie-spotrebitelskych-sporov/);
});
