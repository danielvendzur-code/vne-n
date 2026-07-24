from pathlib import Path

landing_path = Path("src/components/site/PremiumLanding.tsx")
landing = landing_path.read_text()

if "lp-hero-cta--primary" not in landing:
    landing = landing.replace(
        'import { useEffect, useRef, useState, type ReactNode } from "react";',
        'import { useEffect, useState, type ReactNode } from "react";',
        1,
    )
    landing = landing.replace(
        'const liquidSpring = { type: "spring" as const, stiffness: 290, damping: 29, mass: 0.78 };\n',
        "",
        1,
    )
    landing = landing.replace('  const magneticCta = useMagnetic<HTMLAnchorElement>(0.055);\n', "", 1)
    landing = landing.replace(
        '''            <Link
              to="/kontakt"
              className="lp-button lp-button-primary lp-button-sweep"
              ref={magneticCta}
            >
              <span className="lp-button-content">
                Chcem chatbot na mieru <ArrowRight size={17} />
              </span>
            </Link>
            <a href="#projekty" className="lp-button lp-button-bloom">
              <span className="lp-bloom-dot lp-bloom-dot--one" aria-hidden="true" />
              <span className="lp-bloom-dot lp-bloom-dot--two" aria-hidden="true" />
              <span className="lp-bloom-dot lp-bloom-dot--three" aria-hidden="true" />
              <span className="lp-bloom-dot lp-bloom-dot--four" aria-hidden="true" />
              <span className="lp-button-content">
                Pozrieť realizácie <ArrowUpRight size={17} />
              </span>
            </a>''',
        '''            <Link to="/kontakt" className="lp-button lp-hero-cta lp-hero-cta--primary">
              <span className="lp-button-content">
                Chcem chatbot na mieru <ArrowRight size={17} />
              </span>
            </Link>
            <a href="#projekty" className="lp-button lp-hero-cta lp-hero-cta--secondary">
              <span className="lp-button-content">
                Pozrieť realizácie <ArrowUpRight size={17} />
              </span>
            </a>''',
        1,
    )
    landing = landing.replace('  const cardRef = useRef<HTMLElement>(null);\n', "", 1)
    landing = landing.replace(
        '''      ref={cardRef}
      className="lp-solution-pill"
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={
        reducedMotion ? { duration: 0 } : { duration: 0.62, delay: index * 0.08, ease: premiumEase }
      }
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType === "touch") return;
        const card = event.currentTarget;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5;
        const y = (event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5;
        card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--tilt-x", "0deg");
        event.currentTarget.style.setProperty("--tilt-y", "0deg");
      }}''',
        '''      className="lp-solution-pill"
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={
        reducedMotion ? { duration: 0 } : { duration: 0.62, delay: index * 0.08, ease: premiumEase }
      }''',
        1,
    )
    landing = landing.replace(
        'className="lp-solution-cta"',
        'className="lp-solution-cta lp-solution-cta--clean"',
        1,
    )
    landing = landing.replace(
        '''          <div className="lp-switch" role="group" aria-label="Porovnanie webu bez a s chatbotom">
            <motion.button
              type="button"
              data-active={mode === "without"}
              aria-pressed={mode === "without"}
              onClick={() => setMode("without")}
            >
              {mode === "without" ? (
                <motion.span
                  className="lp-switch-liquid"
                  layoutId="comparison-liquid"
                  transition={liquidSpring}
                  aria-hidden="true"
                />
              ) : null}
              <span className="lp-control-label">Bez chatbota</span>
            </motion.button>
            <motion.button
              type="button"
              data-active={mode === "with"}
              aria-pressed={mode === "with"}
              onClick={() => setMode("with")}
            >
              {mode === "with" ? (
                <motion.span
                  className="lp-switch-liquid"
                  layoutId="comparison-liquid"
                  transition={liquidSpring}
                  aria-hidden="true"
                />
              ) : null}
              <span className="lp-control-label">S chatbotom</span>
            </motion.button>
          </div>''',
        '''          <div className="lp-switch lp-switch--clean" role="group" aria-label="Porovnanie webu bez a s chatbotom">
            <button
              type="button"
              data-active={mode === "without"}
              aria-pressed={mode === "without"}
              onClick={() => setMode("without")}
            >
              <span className="lp-control-label">Bez chatbota</span>
            </button>
            <button
              type="button"
              data-active={mode === "with"}
              aria-pressed={mode === "with"}
              onClick={() => setMode("with")}
            >
              <span className="lp-control-label">S chatbotom</span>
            </button>
          </div>''',
        1,
    )
    landing = landing.replace(
        '''              initial={reducedMotion ? false : { opacity: 0, x: mode === "with" ? 18 : -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: mode === "with" ? 12 : -12 }}''',
        '''              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}''',
        1,
    )
    landing_path.write_text(landing)

layout_path = Path("src/components/site/Layout.tsx")
layout = layout_path.read_text()
layout = layout.replace('import { LiquidSegmentedDrag } from "./LiquidSegmentedDrag";\n', "")
layout = layout.replace('import { LiquidSurfacePointer } from "./LiquidSurfacePointer";\n', "")
layout = layout.replace('        <LiquidSegmentedDrag />\n', "")
layout = layout.replace('        <LiquidSurfacePointer />\n', "")
if 'import "./MatteUiFinal.css";' not in layout:
    layout = layout.replace(
        'import "./ApprovedInteractionsFinal.css";\n',
        'import "./ApprovedInteractionsFinal.css";\nimport "./MatteUiFinal.css";\n',
        1,
    )
layout_path.write_text(layout)

test_path = Path("tests/home-contract.test.mjs")
tests = test_path.read_text()
if "MatteUiFinal" not in tests:
    tests = tests.replace(
        '  assert.match(layout, /ApprovedInteractionsFinal\\.css/);\n',
        '  assert.match(layout, /ApprovedInteractionsFinal\\.css/);\n  assert.match(layout, /MatteUiFinal\\.css/);\n',
        1,
    )
    tests = tests.replace(
        '''  assert.equal(
    layout.lastIndexOf('import "./'),
    layout.indexOf('import "./ApprovedInteractionsFinal.css"'),
  );''',
        '''  assert.ok(
    layout.indexOf('import "./ApprovedInteractionsFinal.css"') <
      layout.indexOf('import "./MatteUiFinal.css"'),
  );
  assert.equal(layout.lastIndexOf('import "./'), layout.indexOf('import "./MatteUiFinal.css"'));''',
        1,
    )
    tests = tests.replace(
        '''test("comparison uses one clean content surface", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const drag = await read("src/components/site/LiquidSegmentedDrag.tsx");
  const tasteCss = await read("src/components/site/TasteSystemFinal.css");
  assert.match(layout, /LiquidSegmentedDrag/);
  assert.match(drag, /setPointerCapture/);
  assert.match(tasteCss, /One comparison card/);
  assert.match(tasteCss, /\\.lp-switch[\\s\\S]*border: 0 !important/);
  assert.match(tasteCss, /\\.lp-comparison[\\s\\S]*background: transparent !important/);
  assert.match(tasteCss, /\\.lp-comparison-body[\\s\\S]*border-radius: 24px !important/);
  assert.match(tasteCss, /\\.lp-comparison-copy,[\\s\\S]*background: transparent !important/);
});''',
        '''test("comparison uses one clean content surface without liquid runtime", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const matteCss = await read("src/components/site/MatteUiFinal.css");
  assert.doesNotMatch(layout, /LiquidSegmentedDrag/);
  assert.doesNotMatch(layout, /LiquidSurfacePointer/);
  assert.doesNotMatch(landing, /lp-switch-liquid/);
  assert.match(landing, /lp-switch--clean/);
  assert.match(matteCss, /Final matte interaction system/);
  assert.match(matteCss, /\\.lp-comparison-body[\\s\\S]*border-radius: 24px !important/);
  assert.match(matteCss, /\\.lp-switch--clean[\\s\\S]*backdrop-filter: none !important/);
});''',
        1,
    )
    tests = tests.replace(
        '''  assert.match(landing, /lp-button-sweep/);
  assert.match(landing, /lp-button-bloom/);
  assert.match(landing, /lp-sweep-action/);''',
        '''  assert.match(landing, /lp-hero-cta--primary/);
  assert.match(landing, /lp-hero-cta--secondary/);
  assert.doesNotMatch(landing, /lp-button-bloom/);
  assert.doesNotMatch(landing, /lp-bloom-dot/);''',
        1,
    )
    test_path.write_text(tests)
