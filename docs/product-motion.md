# Product demonstrations and brand refresh

The homepage keeps four compact columns in the original vertical-title design: configurator, chatbot, calculator, advisor. At 1366 × 768 the solutions section is 662px high; the Gmail comparison is under 696px, leaving room for the 72px header. Smaller screens use two columns or one column with internal widget scrolling.

The two MôjPlot previews embed the original `widgetmp.html` interface from `danielvendzur-code/mojplot-chatbot-backend`. Its actual calculator logic, product photos and logo are bundled locally. The demo intercepts fetch calls, so chat responses and inquiry submissions remain examples. The footer labels both previews accordingly.

The carousel contains six screenshots of progressive choices in Koverta's original Soltec renderer. It contains no live configurator. All frames use the same 5,076 × 2,500mm footprint: an anthracite base, white frame, contrasting anthracite louvers, ZIP screen, an underside LED detail and the final combination. Captures originate at 2800 × 1750, are exported as 1400 × 875 WebP, and have separate 400 × 250 thumbnails. Manual navigation restarts autoplay; the pause button stops it. Playback stops offscreen, in hidden tabs and for reduced motion.

The live pergola demo uses the original geometry and WebGL renderer. Its repeated 22-second tour demonstrates louvers, ZIP, full assembly color and LED lighting. Manual interaction stops the tour until Play is selected. Camera motion uses the renderer's frame scheduler, avoiding duplicate drawing; unchanged updates do not rebuild the model. LED materials emit light and participate in the renderer's bloom, instead of being shaded like roof panels. LED selection turns the camera towards the underside; furniture is hidden for this roof detail. The original seating models, missing in the prior handoff, are now included. Their source and license notes are in `public/work/pergola/scene-assets/CREDITS.md`.

Koverta and DERAT portfolio/hero screenshots show styled client websites with their original assistants open. Koverta uses its own K logo. MôjPlot also uses its original widget. These are reference demonstrations, not a claim about the current deployment state of those client sites.

The skincare photograph is an unbranded real photograph by Content Pixie: https://unsplash.com/photos/white-drop-bottle-on-white-surface-WdJ4WnLxyDs. It is used under the Unsplash license: https://unsplash.com/license. The MôjPlot product photographs come from its existing catalogue. No generated photography is used.

The Gmail sample compares a vague request with a complete inquiry. Configurator/calculator tabs change the fields; the sample reply does not send mail. The fictional customer's white RAL 9010 frame and anthracite RAL 7016 louvers match the attached final image.

The delivered Rozhovor vector paths remain intact. In merged states their flat edges overlap by 0.2 SVG units, closing the raster seam. Both halves move synchronously. Hover and keyboard focus enlarge the logo to 116%; reduced motion disables the transition. The assistant types two welcome messages in order, preserves restored conversation history, and uses the same espresso color for its header and composer.

The navigation opens as a compact two-column panel with main links, tool shortcuts and the shared builder CTA. It has staggered rows, an animated menu icon, hover surfaces and an exit transition. On mobile it becomes one column. Escape restores focus to the toggle; outside clicks and opening the assistant dismiss it. Closing content is inert.

The assistant bundle is served from this site's origin. Rebuild `moj.chatbot.backend`, then run `node scripts/sync-assistant.mjs ../moj.chatbot.backend/dist`. Both repositories now identify the release as `product-motion-20261006-v26`.

Validation of this follow-up: 48 web contract tests, TypeScript, targeted ESLint, production builds; 14 backend regression tests; browser assertions at 1366 × 768, 390 × 640 and 360 × 640 covering layout, native calculator progression, model controls, LED camera, autoplay after manual navigation, pause, reduced motion, menu, logo growth/seam, welcome messages, mock chat and conversation restoration. Browser chat/lead requests were mocked and did not send messages.
