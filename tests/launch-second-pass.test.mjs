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

test("hero previews stay full-bleed without legacy clipping hacks", async () => {
  const landingCss = await read("src/components/site/KageLanding.css");
  const launchCss = await read("src/components/site/LaunchReadinessFinal.css");

  assert.match(
    landingCss,
    /\.hybrid-hero__case \.project-composite__site,[\s\S]*?object-fit:\s*cover/,
  );
  assert.match(
    launchCss,
    /body:has\(\.hybrid-home\) \.kage-hero \.hybrid-hero__case \.project-composite__site \{[\s\S]*?object-fit:\s*cover\s*!important/,
  );
  assert.doesNotMatch(landingCss, /clip-path:\s*[^;]+!important/);
  assert.doesNotMatch(launchCss, /clip-path:\s*[^;]+!important/);
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
test("mobile hero typography is viewport-bounded and swept across phone widths", async () => {
  const css = await read("src/components/site/LaunchReadinessFinal.css");
  const workflow = await read(".github/workflows/production-visual-verify.yml");

  assert.match(
    css,
    /body:has\(\.hybrid-home\) \.kage-hero h1 \{[\s\S]*?max-width:\s*100%\s*!important;[\s\S]*?font-size:\s*min\(15vw, 4\.55rem\)\s*!important;/,
  );
  assert.match(workflow, /const widths = \[280, 320, 360, 375, 390, 414, 430, 480, 600, 720\]/);
  assert.match(workflow, /hero headline glyph/);
  assert.match(workflow, /mobile headline overflow at/);
});
test("desktop hero keeps the approved layered Kage composition and animation", async () => {
  const landingCss = await read("src/components/site/KageLanding.css");
  const launchCss = await read("src/components/site/LaunchReadinessFinal.css");

  assert.match(landingCss, /\.kage-hero \.hybrid-hero__collage \{\s*inset: 3% 0 3% 52\.5%/);
  assert.match(landingCss, /\.hybrid-hero__case--1 \{[\s\S]*?transform: rotate\(1\.35deg\)/);
  assert.match(landingCss, /animation: kage-character-write 820ms/);
  assert.match(
    launchCss,
    /Desktop hero intentionally inherits the original KageLanding composition/,
  );
  assert.doesNotMatch(launchCss, /@media \(min-width: 721px\)[\s\S]*?\.hybrid-hero__collage/);
});
