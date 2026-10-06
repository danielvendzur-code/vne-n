# Product demonstrations and brand refresh

The home-page carousel is a sequence of six screenshots from Koverta's original Soltec configurator, not an embedded configurator. Each frame shows the same selected pergola with progressively added options: frame color, open louvers, ZIP screen and warm LED lighting. Source captures are 1400 × 875; thumbnails are separate 400 × 250 WebP assets. The source geometry, materials and renderer come from `danielvendzur-code/koverta-web/konfigurator`.

The live product demonstration in “Riešenia pre váš web” and `/3d-konfigurator` uses that original renderer. Its 22-second tour repeats the louver, ZIP, frame-color and LED phases. It pauses offscreen, in hidden tabs and for reduced motion. Manual controls stop the tour until the visitor chooses to play it again. The carousel has separate navigation and never embeds this live demo.

Koverta and Môj Plot portfolio screenshots render the original client widget interfaces. They are labelled demonstrations; they do not imply the widgets are currently deployed on those public sites. Koverta's launcher uses Koverta's own K symbol. Fence and skincare photographs come from the existing client catalogues. No generated photography is used.

The Gmail component is a clearly labelled sample with a fictional customer. Switching its source changes the inquiry details. Its reply editor does not send messages. The final configuration attachment and email fields both show a white RAL 9010 frame.

Brand assets and the two-part “Rozhovor” symbol follow the supplied logo handoff. Rebuild the social share image using `node scripts/build-brand-assets.mjs`; this script does not overwrite the approved vector or favicon assets.

The assistant is served from this site's origin to avoid depending on a separate GitHub Pages deployment. After rebuilding the backend widget, run `node scripts/sync-assistant.mjs ../backend/dist` and commit the refreshed `public/assistant` bundle. `VITE_ASSISTANT_EMBED_URL` remains available as an explicit override.

Validation: TypeScript, ESLint, 48 repository tests, production build and browser checks for repeat motion, manual controls, carousel steps and keyboard navigation, calculator, skincare advisor, Gmail tabs/reply, chatbot opening, reduced motion and 390px layout. Backend: build, checks, 14 regression tests and 13 browser tests.
