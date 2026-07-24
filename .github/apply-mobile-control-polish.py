from pathlib import Path

layout_path = Path("src/components/site/Layout.tsx")
layout = layout_path.read_text()
if 'import "./MobileControlPolish.css";' not in layout:
    layout = layout.replace(
        'import "./FinalUserCorrection.css";',
        'import "./FinalUserCorrection.css";\nimport "./MobileControlPolish.css";',
    )
    layout_path.write_text(layout)

tests_path = Path("tests/home-contract.test.mjs")
tests = tests_path.read_text()
if "/MobileControlPolish\\.css/" not in tests:
    tests = tests.replace(
        "  assert.match(layout, /FinalUserCorrection\\.css/);\n",
        "  assert.match(layout, /FinalUserCorrection\\.css/);\n  assert.match(layout, /MobileControlPolish\\.css/);\n",
    )
    old_last = '''  assert.equal(\n    layout.lastIndexOf('import "./'),\n    layout.indexOf('import "./FinalUserCorrection.css"'),\n  );'''
    new_last = '''  assert.ok(\n    layout.indexOf('import "./FinalUserCorrection.css"') <\n      layout.indexOf('import "./MobileControlPolish.css"'),\n  );\n  assert.equal(\n    layout.lastIndexOf('import "./'),\n    layout.indexOf('import "./MobileControlPolish.css"'),\n  );'''
    if old_last not in tests:
        raise SystemExit("final import assertion not found")
    tests = tests.replace(old_last, new_last)
    tests += '''\n\ntest("mobile comparison and primary chatbot CTA use the final compact system", async () => {\n  const layout = await read("src/components/site/Layout.tsx");\n  const css = await read("src/components/site/MobileControlPolish.css");\n\n  assert.match(layout, /MobileControlPolish\\.css/);\n  assert.match(css, /\\.lp-hero-cta--primary/);\n  assert.match(css, /background:\\s*#3478f6 !important/);\n  assert.match(css, /@media \\(max-width:\\s*620px\\)/);\n  assert.match(css, /grid-template-columns:\\s*repeat\\(2, minmax\\(0, 1fr\\)\\) !important/);\n  assert.match(css, /\\.lp-comparison > \\.lp-switch\\.lp-switch--clean/);\n  assert.match(css, /min-height:\\s*48px !important/);\n});\n'''
    tests_path.write_text(tests)
