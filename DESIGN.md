# VNE — product portfolio design system

This file installs the `DESIGN.md` workflow from `VoltAgent/awesome-design-md` for this repository. The project brief is the source of truth; the warm editorial pacing and large media framing are informed by the collection's Mastercard reference without copying its brand.

## Direction

- Feel: a precise European product studio, editorial rather than SaaS-template.
- Canvas: warm ivory with tonal chapter changes; never pure white as the page background.
- Composition: 12-column grid, controlled asymmetry, narrow reading measures and one dominant visual per chapter.
- Product UI: realistic controls, compact information density, thin dividers and clear selected states.
- Motion: only for selection, progress, product transformation and scroll storytelling. Native scrolling always remains in control.

## Tokens

- Page `#F3EFE6`, secondary page `#E9E3D7`
- Surface `#FFFDF8`, muted surface `#ECE8DE`
- Ink `#10261F`, muted ink `#68716C`
- Structural green `#246653`, dark green `#184A3D`
- Restrained terracotta `#DF8B61`
- Fine gold detail `#C5A45E`
- Divider `rgba(16, 38, 31, 0.13)`

## Typography

Use the existing Inter Tight stack. Display type is tightly tracked, balanced and limited to three lines on desktop. Body copy stays below roughly 65 characters per line. Use tabular figures for prices, counters and progress.

## Geometry

- Utility controls: 10–12px radius.
- Product panels: 18–24px radius.
- Dominant media stages: 28–40px radius.
- Pills are reserved for navigation, chips and progress indicators.
- Prefer borders to shadows; large atmospheric shadows are reserved for the sticky product stage and dialogs.

## Interaction

- Touch targets are at least 44px.
- Buttons have hover, pressed and focus-visible states.
- Desktop scroll stories may use a sticky visual with GSAP scrub transitions.
- Mobile stories become a natural horizontal snap gallery; no pinned empty space.
- Reduced motion shows a stable representative frame and removes scrubbed movement.

## Guardrails

No purple AI gradients, fake testimonials, fake statistics, stock photography, 3D configurator claims, repeated equal cards, decorative marquees or generic contact forms. All visible copy is natural Slovak and describes concrete inputs, decisions or outputs.
