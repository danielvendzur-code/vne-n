from pathlib import Path
import re

landing_path = Path("src/components/site/PremiumLanding.tsx")
landing = landing_path.read_text()
landing = landing.replace('import { useEffect, useState, type ReactNode } from "react";', 'import { useState, type ReactNode } from "react";')
landing = landing.replace('  Plus,\n', '')
landing = landing.replace('const liquidControlSelector = ".lp-button, .lp-assistant-cta, .lp-faq-ask";\n\n', '')
landing = re.sub(r'\nfunction LiquidControlGlow\(\) \{.*?\n\}\n\nfunction Reveal\(', '\nfunction Reveal(', landing, flags=re.S)
landing = landing.replace('                      {tool.combo ? <span className="lp-hero-pick-plus">+ chatbot</span> : null}\n', '')
landing = re.sub(r'\s*\{activeTool === key \? \(\n\s*<Check className="lp-hero-pick-check" aria-hidden="true" />\n\s*\) : null\}', '', landing)
landing = re.sub(r'\n\s*<span className="lp-chip-icon" aria-hidden="true">\n\s*\{isActive \? <Check /> : <Plus />\}\n\s*</span>', '', landing)
landing = landing.replace('        <LiquidControlGlow />\n', '')
landing_path.write_text(landing)

layout_path = Path("src/components/site/Layout.tsx")
layout = layout_path.read_text()
if 'import "./FinalUserCorrection.css";' not in layout:
    layout = layout.replace('import "./MatteUiFinal.css";\n', 'import "./MatteUiFinal.css";\nimport "./FinalUserCorrection.css";\n')
layout_path.write_text(layout)

security_path = Path("scripts/security-audit.mjs")
security = security_path.read_text()
if "const correctionIndex" not in security:
    security = security.replace("const matteIndex = layout.indexOf('import \"./MatteUiFinal.css\"');\nconst lastStyleImport", "const matteIndex = layout.indexOf('import \"./MatteUiFinal.css\"');\nconst correctionIndex = layout.indexOf('import \"./FinalUserCorrection.css\"');\nconst lastStyleImport")
    security = security.replace('if (matteIndex === -1) fail("MatteUiFinal.css is not imported");', 'if (matteIndex === -1) fail("MatteUiFinal.css is not imported");\nif (correctionIndex === -1) fail("FinalUserCorrection.css is not imported");')
    security = security.replace('  approvedIndex >= matteIndex\n)', '  approvedIndex >= matteIndex ||\n  matteIndex >= correctionIndex\n)')
    security = security.replace('if (matteIndex !== lastStyleImport) {\n  fail("MatteUiFinal.css must be the final component style import");\n}', 'if (correctionIndex !== lastStyleImport) {\n  fail("FinalUserCorrection.css must be the final component style import");\n}')
    anchor = 'if (/mix-blend-mode|lp-bloom-dot|scale\\(6\\.2\\)/i.test(matteCss)) {\n  fail("Liquid or bloom decoration remains in the final matte layer");\n}\n'
    check = '''\nconst correctionCss = await read("src/components/site/FinalUserCorrection.css");\nfor (const token of ["Final user correction", ".lp-comparison > .lp-switch.lp-switch--clean", "visibility: visible !important", "content: none !important", "border: 0 !important"]) {\n  if (!correctionCss.includes(token)) fail(`Final user correction is missing ${token}`);\n}\nif (/inset 3px 0 0|mix-blend-mode|lp-bloom-dot/i.test(correctionCss)) fail("Ornament or liquid decoration remains in final correction");\n'''
    security = security.replace(anchor, anchor + check)
    security = security.replace('for (const token of ["lp-button-bloom", "lp-bloom-dot", "lp-switch-liquid"]) {', 'for (const token of ["lp-button-bloom", "lp-bloom-dot", "lp-switch-liquid", "lp-hero-pick-plus", "lp-hero-pick-check", "lp-chip-icon", "LiquidControlGlow"]) {')
security_path.write_text(security)

test_path = Path("tests/home-contract.test.mjs")
tests = test_path.read_text()
if "final correction restores the comparison" not in tests:
    tests = tests.replace('  assert.match(layout, /MatteUiFinal\\.css/);', '  assert.match(layout, /MatteUiFinal\\.css/);\n  assert.match(layout, /FinalUserCorrection\\.css/);')
    tests = tests.replace("  assert.equal(layout.lastIndexOf('import \"./'), layout.indexOf('import \"./MatteUiFinal.css\"'));", "  assert.ok(layout.indexOf('import \"./MatteUiFinal.css\"') < layout.indexOf('import \"./FinalUserCorrection.css\"'));\n  assert.equal(layout.lastIndexOf('import \"./'), layout.indexOf('import \"./FinalUserCorrection.css\"'));")
    tests += '''\n\ntest("final correction restores the comparison and removes chip ornaments", async () => {\n  const landing = await read("src/components/site/PremiumLanding.tsx");\n  const css = await read("src/components/site/FinalUserCorrection.css");\n  assert.match(landing, /Bez chatbota/);\n  assert.match(landing, /S chatbotom/);\n  assert.doesNotMatch(landing, /LiquidControlGlow|lp-hero-pick-plus|lp-hero-pick-check|lp-chip-icon/);\n  assert.match(css, /Final user correction/);\n  assert.match(css, /\.lp-comparison > \.lp-switch\.lp-switch--clean/);\n  assert.match(css, /visibility:\s*visible !important/);\n  assert.doesNotMatch(css, /inset 3px 0 0|mix-blend-mode|lp-bloom-dot/);\n});\n'''
test_path.write_text(tests)
