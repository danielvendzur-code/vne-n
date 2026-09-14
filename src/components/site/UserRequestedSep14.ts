export const userRequestedSep14Css = String.raw`
/* User-requested contrast pass, 2026-09-14.
   Intentionally scoped to the homepage solution/process rows and /postup only. */

/* 01 — homepage solution rows: dark full-card hover with clear inverse copy. */
.kage-home .hybrid-tool {
  transition:
    background-color 220ms var(--ease-standard),
    border-color 220ms var(--ease-standard),
    color 220ms var(--ease-standard),
    box-shadow 260ms var(--ease-standard);
}

@media (hover: hover) and (pointer: fine) {
  .kage-home .hybrid-tool:hover {
    border-color: #12372d !important;
    background: #12372d !important;
    color: #f6f5ee !important;
    box-shadow: 0 22px 44px -38px rgba(7, 27, 21, 0.72) !important;
  }

  .kage-home .hybrid-tool:hover .hybrid-tool__inner > span:first-child {
    background: #c8f06a !important;
    color: #071b15 !important;
  }

  .kage-home .hybrid-tool:hover :is(strong, b, p) {
    color: #f6f5ee !important;
  }

  .kage-home .hybrid-tool:hover .hybrid-tool__cta {
    border-color: #c8f06a !important;
    background: #c8f06a !important;
    color: #071b15 !important;
  }
}

/* Keyboard users get the same visual state as pointer hover. */
.kage-home .hybrid-tool:focus-visible {
  border-color: #12372d !important;
  background: #12372d !important;
  color: #f6f5ee !important;
  box-shadow:
    0 0 0 3px rgba(200, 240, 106, 0.42),
    0 22px 44px -38px rgba(7, 27, 21, 0.72) !important;
}

.kage-home .hybrid-tool:focus-visible .hybrid-tool__inner > span:first-child {
  background: #c8f06a !important;
  color: #071b15 !important;
}

.kage-home .hybrid-tool:focus-visible :is(strong, b, p) {
  color: #f6f5ee !important;
}

.kage-home .hybrid-tool:focus-visible .hybrid-tool__cta {
  border-color: #c8f06a !important;
  background: #c8f06a !important;
  color: #071b15 !important;
}

/* 02 — homepage cooperation rows: stronger default contrast, same dark interaction language. */
.kage-home .hybrid-process__list > li {
  border-color: rgba(18, 55, 45, 0.2) !important;
  background: rgba(252, 251, 247, 0.72) !important;
  transition:
    background-color 220ms var(--ease-standard),
    border-color 220ms var(--ease-standard),
    color 220ms var(--ease-standard),
    box-shadow 260ms var(--ease-standard) !important;
}

.kage-home .hybrid-process__list > li > strong {
  color: #0b241d !important;
}

.kage-home .hybrid-process__list > li > p {
  color: #3d4b43 !important;
}

@media (hover: hover) and (pointer: fine) {
  .kage-home .hybrid-process__list > li:hover {
    border-color: #12372d !important;
    background: #12372d !important;
    color: #f6f5ee !important;
    box-shadow: 0 22px 44px -38px rgba(7, 27, 21, 0.68) !important;
  }

  .kage-home .hybrid-process__list > li:hover > span {
    background: #c8f06a !important;
    color: #071b15 !important;
  }

  .kage-home .hybrid-process__list > li:hover > strong,
  .kage-home .hybrid-process__list > li:hover > p {
    color: #f6f5ee !important;
  }
}

/* 03 — /postup: keep the editorial layout, but give each step a restrained live state. */
.process-page--rebrand .process-list > li {
  position: relative;
  transition:
    background-color 220ms var(--ease-standard),
    box-shadow 220ms var(--ease-standard);
}

.process-page--rebrand .process-list > li > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.05rem;
  height: 2.05rem;
  border-radius: 999px;
  background: rgba(18, 55, 45, 0.08);
  color: #315d4d;
  font-weight: 720;
  transition:
    background-color 220ms var(--ease-standard),
    color 220ms var(--ease-standard),
    transform 220ms var(--ease-standard);
}

.process-page--rebrand .process-output {
  position: relative;
  padding-left: 1rem;
}

.process-page--rebrand .process-output::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.67em;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 999px;
  background: #7fa83d;
}

@media (hover: hover) and (pointer: fine) {
  .process-page--rebrand .process-list > li:hover {
    background: rgba(18, 55, 45, 0.055);
    box-shadow: inset 4px 0 0 #12372d;
  }

  .process-page--rebrand .process-list > li:hover > span {
    background: #12372d;
    color: #c8f06a;
    transform: translateY(-1px);
  }

  .process-page--rebrand .process-list > li:hover h2 {
    color: #12372d !important;
  }

  .process-page--rebrand .process-list > li:hover .process-output::before {
    background: #12372d;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kage-home .hybrid-tool,
  .kage-home .hybrid-process__list > li,
  .process-page--rebrand .process-list > li,
  .process-page--rebrand .process-list > li > span {
    transition: none !important;
  }
}
`;
