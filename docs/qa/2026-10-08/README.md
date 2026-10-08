# Reviewed presentation — 8 October 2026

This review builds on website PR #200 (`beac46714ba491dd3fc643e5fd9ee16f14dd4de1`) and widget PR #148 (`e109ac5c0f7395f001b1fec84cc8ad5e7080ebb6`). Their remote tips were checked before starting and were unchanged during implementation. Work is on separate branches; neither main nor the existing PR branches were overwritten.

## What changed

- Hero captures retain their original layers, links and movement. Removed added frames, numbering, company captions and arrows, and slightly enlarged the captures. Actual logos inside product screenshots are retained.
- Larger menu type and touch targets, with a narrow-screen header adjustment. Email and adjacent footer CTA share the same button geometry.
- Four compact solution cards use coordinated line/text/mask/CTA timing and gentle hover movement. Removed pointer-following illumination and sweeping highlights. Mobile titles have their own horizontal layout.
- One scroll-led pair of panels opens over the inquiry section heading. No wheel interception or pinned scrolling. Reduced motion and no-JS show the content directly.
- Product previews travel into details through native View Transitions, with a decoded-image fallback and cleanup. Direct URLs, browser Back and reduced motion were checked.
- Gmail previews have natural heights and keyboard-operated disclosure, with contacts, illustrative price and summary initially shown. Neither collapsed nor expanded email has an inner scrollbar.
- An anonymous, working skincare catalog maps three skin choices to different recommendations and explains the selection.
- Shared reveal refs now initialize only after their own elements hydrate. This removes the parent controller's early mutations of lazy SSR children.
- Widget CSS comes from the reviewed backend build. Removed the extra loader stylesheet override; no API, price, payload, history, privacy, analytics or client integration contract was changed.

## Real product sources

The real Koverta 3D configurator was recaptured with the pergola selected and cookies refused through the provided control. [Clean 3D capture](../../../public/work/koverta/configurator-live-screenshot.jpg).

Koverta's widget loads lazily after user interaction. Its current **Poradca** was opened on the real site, cookies were refused through the provided control, and a question about pergola versus fixed roofing received a real answer and product links. Its actual client logo is retained. [Original capture](koverta-source.png).

Môj Plot's real widget was opened, configured for 20 bm, 153 cm and 4 mm, with anthracite finish, round posts, underboards and installation. Its own calculator returned **1 175 €** (rounded display; detailed total 1 175,29 €). The fictional test contact submission was intercepted before network delivery. [Input](calculator-input-source.png), [result](calculator-result-source.png).

Marketing previews are editorial crops/compositions of those real captures, **not unedited screenshots**: Koverta removes the clipped prior greeting; Môj Plot places its input, calculated price and configuration together. No result or interface text was fabricated. The anonymous skincare preview is a capture of the working component in this PR.

## Video diagnosis

All 720 frames of both 12-second, 60 fps sources were measured against the fixed front-left pergola column. The original source's tracked position spans 1 px horizontally and vertically. The prior stabilized version spans 10 px / 22 px, with a maximum frame-to-frame vertical movement of 9 px. See [measurements](video-motion.json). The stabilizer follows moving shade/lamella content and moves the otherwise fixed structure. The card therefore uses the original recording and a matching poster, retains lazy loading, and pauses off screen or for reduced motion. Frame sheets spanning the entire recording were visually reviewed. These measurements address camera drift; they do not prove 60 fps on every device.

## Verification

- Website: lint with the frozen Bun dependencies used by CI, production Vercel build, 48 tests, security audit (176 scanned files). The original type formatting is retained; npm and Bun locks use different Prettier versions.
- Backend: type check, production/embed builds, 14 tests; the JS bundle remains unchanged by these CSS-only additions.
- Chromium: 320, 390, 768, 1366 and 1920 px, navigation/menu/hero/cases/mail/detail transitions/chat/widget/keyboard-height composer. [Report](cinematic-report.json). The final mask correction was checked at all five widths: [heading report](heading-report.json). The observer watches an unmasked parent; only its inner text is clipped.
- Normal and reduced motion at 390 and 1366 px: fallback transition, Back, direct product URLs, all skincare choices, equal footer CTA geometry and intercepted contact submission. [Report](regression.json).
- Full widget flow at 320, 390 and 1366 px: features, details, industry, timeline, contact; selected feedback and lead payload validated with intercepted submission. [Report](widget-flow.json).
- [Motion recording](motion.mp4) shows menu, solution hover/takeover and scroll-led panels.

Before/after hero: [desktop before](hero-before-desktop.png), [desktop after](hero-after-desktop.png), [mobile before](hero-before-mobile.png), [mobile after](hero-after-mobile.png). [Mobile menu](menu-mobile.png), [matching footer CTAs](footer-mobile.png).

Solutions before: [desktop](solutions-before-desktop.png), [mobile](solutions-before-mobile.png). Gmail before: [desktop](mail-before-desktop.png), [mobile](mail-before-mobile.png).

Solutions after: [desktop](solutions-after-desktop.png), [mobile](solutions-after-mobile.png). Gmail: [desktop](mail-after-desktop.png), [mobile](mail-after-mobile.png). Section-only captures omit fixed navigation to prevent its duplication in stitched images; hero/menu screenshots retain it.

Browser scripts are included for reproducibility. CI now installs Playwright in a separate runtime directory so it cannot re-resolve application dependencies, then tests the real production Vercel output. The development-only Lovable source tagger emits inconsistent SSR/client line coordinates; production testing avoids those debug attributes while retaining strict console-error assertions. Run from the repository with Playwright available (`PLAYWRIGHT_MODULE` can point to an installed package), Chromium specified by `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, and the production build served on port 4183. `node scripts/serve-vercel-build.mjs <repository-path> 4183` serves the generated Vercel handler and static files because the existing `vite preview` expects a missing `dist/server/server.js`. Reports/videos are written under `/workspace/qa`, outside the checkout. Playwright recording needs its ffmpeg installation.

## Performance and release limits

The PR #200 production source was independently rebuilt as a reference, using the same dependencies as the reviewed build. Lab navigation measurements use Chromium, 4× CPU slowdown, 40 ms latency and 1.5 Mbit/s download, three fresh contexts at 390 and 1366 px. [Raw samples](performance.json). These are local lab samples, not field Core Web Vitals or a Lighthouse score. Final measurement ran separately from functional browser activity. Median samples:

| Width   | LCP before → after | CLS before → after | Long-task time before → after | Transfer before → after |
| ------- | ------------------ | ------------------ | ----------------------------- | ----------------------- |
| 390 px  | 5 016 → 4 992 ms   | 0.0006 → 0.0006    | 803 → 707 ms                  | 1.395 → 1.397 MB        |
| 1366 px | 4 916 → 4 896 ms   | 0.0023 → 0.0020    | 981 → 757 ms                  | 1.681 → 1.579 MB        |

LCP is effectively unchanged under this deliberately slow lab profile. These measurements do not establish good field LCP or guarantee 60 fps on physical devices.

The provided design.so benchmark currently resolves to a domain-for-sale page. The earlier Vercel preview requires deployment access, so its rendered UI could not be reviewed through the public URL. Production was captured separately; source comparisons and PR baseline screenshots guided the changes.

Real email delivery, Redis history, deployed AI configuration for Môj Chatbot, Safari, and physical iOS/Android devices are not proven by intercepted tests. External Koverta and Môj Plot were observed, not modified or deployed. This is a **draft review**, not approval to deploy production. Review the paired PRs and staging integrations before merging; production deployment still requires the owner's explicit approval.
