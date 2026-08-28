import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../src/components/site/FinalUxAuthority.css', import.meta.url), 'utf8');
const tuner = readFileSync(new URL('../src/components/site/FlowScrollTuner.tsx', import.meta.url), 'utf8');

test('desktop solutions keep independent readable columns and strong CTAs', () => {
  assert.match(css, /grid-template-columns:[\s\S]*minmax\(14\.75rem, 0\.88fr\)[\s\S]*minmax\(12\.5rem, 0\.74fr\)[\s\S]*minmax\(16\.25rem, 1fr\)/);
  assert.match(css, /\.hybrid-tool__cta[\s\S]*min-height: 48px/);
  assert.match(css, /\.site-nav[\s\S]*border: 0 !important[\s\S]*background: transparent !important/);
});

test('desktop flow is slower while idle snap remains decisive', () => {
  assert.match(css, /\.kage-home \.kage-flow[\s\S]*height: 440vh !important/);
  assert.match(tuner, /const FLOW_IDLE_MS = 55/);
  assert.match(tuner, /localProgress >= 0\.5/);
  assert.match(tuner, /clamp\(210 \+ Math\.abs\(distance\) \* 0\.09, 210, 300\)/);
  assert.match(tuner, /event\.stopImmediatePropagation\(\)/);
});

test('contact and mobile header have explicit alignment authority', () => {
  assert.match(css, /\.contact-page \.contact-editorial-grid[\s\S]*align-items: start !important/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.site-header__inner[\s\S]*justify-content: space-between !important/);
});
