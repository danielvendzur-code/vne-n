# Premium redesign — 4 October 2026

The homepage keeps the original three real project screenshots, restores their overlapping composition, and replaces the FAQ, service overview and enquiry comparison with a coherent white, graphite and lime system. The widget is a separate release in `moj.chatbot.backend`, branch `codex/premium-widget-oct4`.

## Design decisions

- Reference inputs: the eight user screenshots, historical hero positioning (commit `7b46681`), and upstream `leonxlnx/taste-skill` (`skills/taste-skill/SKILL.md`). SiteInspire's Jack & Jill page was blocked by the environment's network proxy (403); it was not visually inspected.
- Geist / Geist Mono, local fonts, shared semantic palette, restrained 6 px actions and 12–14 px content corners.
- Editorial FAQ with separators, accessible expandable answers and a direct founder contact.
- Simultaneous enquiry comparison: fictional email versus a structured brief, stacked on mobile. Fictional addresses use `example.invalid`.
- Four independent tools with an explicit combination option and consistent outline pictograms.
- Sharp existing Porsche scene, without an image badge. The caption explicitly identifies an illustrative model, not a Porsche client relationship.
- Native SVG pixel cursor on fine pointers; no cursor ring. Text fields and touch devices keep their native behavior.
- Legacy page chrome/styles load only on routes that use them. The initial shared stylesheet drops from 370 kB to approximately 129 kB before compression. Responsive 640/1000 px hero images preserve the original screenshot content.
- React 19 and existing TypeScript compatibility errors were fixed so the whole repository passes `tsc --noEmit`.

## Validation

`npm run lint`, `tsc --noEmit`, 48 repository tests, production Vercel build and local Node SSR build pass. Production dependency audit reports no vulnerabilities.

Chromium / Playwright covers desktop and touch navigation, Escape and outside-click dismissal, FAQ keyboard expansion, the pixel cursor, comparison panels, builder CTAs, all public service routes, and absence of horizontal overflow. Widget tests additionally cover combinations, back navigation, answer retention/pruning, validation, exact submitted brief and delivery fallback. No real notifications were sent: browser submissions used intercepted API responses.

Evidence is saved outside the source repository in `/workspace/redesign-review`: before/after at 1440, 1280, 768, 390 and 360 px, detail screenshots, test logs and Lighthouse HTML/JSON. Open `review.html` for the comparison and `REPORT.md` for the final metrics and commit identifiers. The measurements are local Lighthouse lab runs, not production PageSpeed Insights or field Core Web Vitals.

## Preview and release

Local web preview: port 3000. Local widget: port 4173. The review web build uses `VITE_ASSISTANT_EMBED_URL=http://127.0.0.1:4173/widget.js` only as a build-time preview setting. Production defaults stay in the code and the normal Vercel build was verified separately.

For a shared preview, publish both review branches and use the backend Vercel preview's `/widget.js` URL as `VITE_ASSISTANT_EMBED_URL` in the web preview. The GitHub credential in this environment currently fails authentication, so remote PR/preview creation is blocked.

Do not merge or deploy production until the user approves. After approval, publish the widget with its `fonts/` directory and the new release marker before publishing the website. Confirm live lead delivery with the configured Resend service and live chat with the configured Anthropic service.

## Asset rights

`public/work/koverta/model-porsche.webp` existed before this task. No licence or permission document was found in the repositories. Permission was requested from the user; until confirmed, the new use is a review-only illustration and must be cleared or replaced before public release. Existing project screenshots were retained; the new responsive files are resizes of those screenshots. Geist font licences remain with the font assets.
