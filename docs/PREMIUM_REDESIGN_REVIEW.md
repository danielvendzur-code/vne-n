# Premium redesign — 4 October 2026

The homepage keeps the original three real project screenshots, restores their overlapping composition, and replaces the FAQ, service overview and enquiry comparison with a coherent white, graphite and lime system. The widget is a separate release in `moj.chatbot.backend`, branch `codex/premium-widget-oct4`.

## Design decisions

- Reference inputs: the eight user screenshots, historical hero positioning (commit `7b46681`), and upstream `leonxlnx/taste-skill` (`skills/taste-skill/SKILL.md`). SiteInspire's Jack & Jill page was blocked by the environment's network proxy (403); it was not visually inspected.
- Geist / Geist Mono, local fonts, shared semantic palette, restrained 6 px actions and 12–14 px content corners.
- Editorial FAQ with separators, accessible expandable answers and a direct founder contact.
- Simultaneous enquiry comparison: fictional email versus a structured brief, stacked on mobile. Fictional addresses use `example.invalid`.
- Four independent tools with an explicit combination option and consistent outline pictograms.
- Sharp existing Porsche scene, without an image badge. The caption explicitly identifies an illustrative model, not a Porsche client relationship.
- Native SVG clean arrow cursor (user-selected option 02) on fine pointers; no cursor ring. Text fields and touch devices keep their native behavior.
- Legacy page chrome/styles load only on routes that use them. The initial shared stylesheet drops from 370 kB to approximately 129 kB before compression. Responsive 640/1000 px hero images preserve the original screenshot content.
- React 19 and existing TypeScript compatibility errors were fixed so the whole repository passes `tsc --noEmit`.

## Validation

`npm run lint`, `tsc --noEmit`, 48 repository tests, production Vercel build and local Node SSR build pass. Production dependency audit reports no vulnerabilities.

Chromium / Playwright covers desktop and touch navigation, Escape and outside-click dismissal, FAQ keyboard expansion, the clean arrow cursor, comparison panels, builder CTAs, all public service routes, and absence of horizontal overflow. Widget tests additionally cover combinations, back navigation, answer retention/pruning, validation, exact submitted brief and delivery fallback. No real notifications were sent: browser submissions used intercepted API responses.

Evidence is saved outside the source repository in `/workspace/redesign-review`: before/after at 1440, 1280, 768, 390 and 360 px, detail screenshots, test logs and Lighthouse HTML/JSON. Open `review.html` for the comparison and `REPORT.md` for the final metrics and commit identifiers. The measurements are local Lighthouse lab runs, not production PageSpeed Insights or field Core Web Vitals.

## Preview and release

Local web preview: port 3000. Local widget: port 4173. The review web build uses `VITE_ASSISTANT_EMBED_URL=http://127.0.0.1:4173/widget.js` only as a build-time preview setting. Production defaults stay in the code and the normal Vercel build was verified separately.

For a shared preview, publish both review branches and use the backend Vercel preview's `/widget.js` URL as `VITE_ASSISTANT_EMBED_URL` in the web preview. Both review branches were pushed successfully. GitHub API requests (GraphQL and REST) return Forbidden in this environment, so draft PR creation and retrieval of an external deployment URL are blocked. Branch: https://github.com/danielvendzur-code/vne-n/tree/codex/premium-redesign-oct4

The user approved merging on 4 October 2026; the user selected clean arrow option 02. Publish the widget with its `fonts/` directory and the new release marker before publishing the website. Confirm live lead delivery with the configured Resend service and live chat with the configured Anthropic service.

## Asset rights

`public/work/koverta/model-porsche.webp` existed before this task. No licence or permission document was found in the repositories. The user explicitly confirmed permission to publicly use this existing Porsche illustration on 4 October 2026. The caption continues to identify it as an illustrative model, not a client relationship. Existing project screenshots were retained; the new responsive files are resizes of those screenshots. Geist font licences remain with the font assets.

## Follow-up: privacy and cookie controls

The new footer previously displayed legal labels as plain text. They now link to the existing cookie, privacy and legal pages, with a separate button to reopen cookie settings. Consent is hosted once in the root shell, covers Vercel Analytics and configured Google Analytics, and is required before either SDK loads. Choices are equally accessible, persist for 180 days and can be withdrawn; withdrawal reloads the page to unload already loaded SDKs and clears accessible Google analytics cookies. Storage changes propagate across tabs. Analytics strips URL queries/fragments and the widget tracks events only after consent. Policy copy documents functional chat storage (24 hours), server transcripts (90 days), current providers and the new analytics behavior. Widget contact and chat views include direct privacy notices.

The user selected option 02 from the three SVG alternatives: a clean 24 × 32 px arrow with dark fill and a white outline. The matching asset is `public/cursor/clean-arrow.svg`, with hotspot 3,2. Text inputs and touch retain their native cursors; the rejected pixel arrow was removed.

## Release verification maintenance

The production export/audit checks still referenced the old eager layout, hero and widget release. They now follow the lazy legacy layout, current hero, reversible cookie settings, approved cursor and widget release v16. Visual checks live in `scripts/verify-live-visual.mjs` and exercise five homepage widths, desktop/touch navigation, loaded project images, actual headline glyph bounds, FAQ keyboard expansion, widget launch, contact form and public/legal pages. Paths with a trailing slash use the same layout and active navigation as their canonical paths. Pricing identifies Venaco as a VAT payer and states that the quote provides the final price including VAT, retaining the advertised amounts.

The full Pages build, static export of all 15 routes and the exact artifact-validation block from the Pages workflow were verified locally, including the compiled `/vne-n/cursor/clean-arrow.svg` URL. These checks accompany the production Vercel build, TypeScript, lint and 48 repository tests.

The docs fallback used `bun run build`, whose package script forces the Vercel preset despite an outer Node preset; it could therefore never start `.output/server/index.mjs`. It now uses the verified `build:pages` command and preserves the repository's existing Markdown documentation while copying exported files.

The custom-domain verifier waits for `/build-meta.json`, which the static exporter produced but the Vercel target omitted. Both Vercel build commands now write a public release marker from `VERCEL_GIT_COMMIT_SHA`, falling back to the CI/Git SHA, with a no-store response header. This makes verification of the exact Vercel release possible without disclosing credentials. Existing development-tooling `braces@3.0.3` advisory / auto-remediation limitation is documented in `docs/tanstack-deployment-fix.md`; production dependency audits remain clean.
