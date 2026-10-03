# Presentation preview

The homepage keeps the green palette, original outline logo, hero copy and three overlapping client screenshots. Homepage sections, navigation, footer and contact own their styles through CSS Modules. Website CTAs share `WebsiteAction.module.css`; the external chatbot and its loader are unchanged.

All four cooperation steps are available immediately by click or keyboard (arrows, Home, End). Reading is never interrupted by autoplay. Solution screenshots keep their natural proportions. Prices render their real values on the server without a counter.

## Install and validate

Use Node.js 22 and Bun 1.4.2:

```sh
bun run scripts/install-frozen.mjs
bun run dev --host 127.0.0.1 --port 5174
bun run lint
bun run test
node scripts/security-audit.mjs
bun run build
```

The installer warms Bun's cache from public npm using committed versions and SHA-512 checksums, then installs the original frozen lockfile. Five Lovable mirror URLs are unavailable outside its sandbox. Neither manifest nor lockfile is rewritten. Vercel and PR CI use the same installer.

For a local production server, use the Node target directly (the Vercel target does not produce the `dist/server/server.js` expected by `vite preview`):

```sh
NITRO_PRESET=node-server bunx vite build
PORT=4175 HOST=127.0.0.1 node .output/server/index.mjs
```

## Browser checks

With Playwright and Chromium available:

```sh
CHROMIUM_PATH=/usr/bin/chromium node scripts/verify-presentation.mjs http://127.0.0.1:5174
```

For Playwright installed outside this checkout, set `PLAYWRIGHT_MODULE` to its `index.mjs` file URL. Screenshots go to `/tmp/moj-chatbot-visual` or `VISUAL_OUTPUT`.

The checks cover 1440×900, 1366×768, 390×844 and 320×740: hero focus, four solution images, CTA geometry, direct keyboard access to the last cooperation step, FAQ, mobile menu, contact validation, preserved input on delivery failure, successful redirect, real API validation and horizontal overflow. Successful delivery and failure responses are simulated; the tests do not send email. Server validation requests are real and deliberately invalid. Reduced-motion checks cover the original logo.

The contact retains its real `/api/lead` submission path and central delivery backend. Production credentials remain there. Preview deployment uses the existing Vercel Git integration. Do not merge to or deploy production main while reviewing.
