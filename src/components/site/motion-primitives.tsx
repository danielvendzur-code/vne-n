import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useNarrowViewport, useReducedMotion } from "@/hooks/useReducedMotion";
import "./Subpage.css";

export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Pohybový slovník celého webu. Predtým mala každá sekcia vlastné číslo
 * (0,58 – 0,94 s), takže sa web nehýbal jednou rýchlosťou. Tri trvania
 * stačia na všetko a držia sa toho, čo je zvykom na produktových weboch:
 * odchod je kratší než príchod, aby scrollovanie hore nepôsobilo ťažko.
 */
export const MOTION = {
  fast: 0.22,
  base: 0.72,
  slow: 0.82,
  stagger: 0.07,
} as const;

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: MOTION.stagger, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: MOTION.base, ease: premiumEase } },
};

/**
 * Nadpis sa neodkrýva len priehľadnosťou — zotrie sa zdola nahor.
 * `clip-path` beží na kompozítore rovnako ako `opacity`, takže to nič
 * nestojí, a text pôsobí, akoby vystúpil spoza hrany, nie akoby sa
 * zjavil z ničoho.
 */
export const wipeUp: Variants = {
  hidden: { opacity: 0, y: 18, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 -12% 0)",
    transition: { duration: MOTION.slow, ease: premiumEase },
  },
};

type RevealDirection = "up" | "left" | "right";

/**
 * Jediné odhalenie na celom webe. Domovská stránka mala donedávna
 * vlastnú kópiu s inými číslami; obe sú teraz tu, vrátane úzkeho
 * zobrazenia, kde bočný posun v 390 px stĺpci vyzeral trhane.
 */
export function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  distance = 36,
  amount = 0.18,
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  distance?: number;
  /** Aká časť prvku musí byť vidieť, než sa spustí odhalenie. */
  amount?: number;
  as?: "div" | "section" | "article" | "li" | "span";
  /** Dátové atribúty prechádzajú na element, aby si CSS vedelo siahnuť na stav. */
  [dataAttribute: `data-${string}`]: unknown;
}) {
  const reducedMotion = useReducedMotion();
  const narrow = useNarrowViewport();
  const Component = motion[Tag];

  // Pri vypnutých animáciách sa obsah vykreslí bez akýchkoľvek stavov.
  // Nesmie tu ostať `hidden` bez cieľa — obsah by ostal neviditeľný.
  //
  // Vykresľuje sa čistý element, nie pohybový. Server o voľbe návštevníka
  // nevie, takže do HTML pošle východiskový stav `opacity: 0`. Pohybová
  // knižnica si zapísané hodnoty drží a zapisuje ich do DOM sama, mimo
  // Reactu — keby tu ostal ten istý typ komponentu, prepísala by aj náš
  // `style` a otázky, karty realizácií či záverečná karta by pre človeka
  // s vypnutými animáciami ostali natrvalo neviditeľné. Zmena typu
  // element vymení za nový, takže po starom zápise neostane stopa.
  if (reducedMotion) {
    const Plain = Tag;
    return (
      <Plain className={className} style={{ opacity: 1, transform: "none" }} {...rest}>
        {children}
      </Plain>
    );
  }

  const mobileDistance = Math.min(distance, 16);
  const x =
    direction === "up"
      ? 0
      : direction === "left"
        ? -(narrow ? mobileDistance : distance)
        : narrow
          ? mobileDistance
          : distance;
  const y = direction === "up" ? Math.min(distance, narrow ? 12 : 22) : 0;

  return (
    <Component
      className={className}
      data-motion-reveal=""
      // Jednosmerné. Predtým sa obsah pri odchode zo zorného poľa vracal
      // do skrytého stavu, takže pri scrollovaní späť hore sa odhaľovanie
      // prehrávalo znova — a keďže scrollovanie hore je rýchlejšie než
      // samotné odhalenie, nadpisy aj otázky boli v polovici obrazovky
      // priehľadné alebo úplne neviditeľné. Čo raz bolo vidieť, ostáva
      // vidieť.
      initial={{ opacity: 0, x, y }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: MOTION.base,
          delay: narrow ? Math.min(delay, 0.06) : delay,
          ease: premiumEase,
        },
      }}
      viewport={{
        once: true,
        amount: narrow ? 0.06 : amount,
        margin: narrow ? "-4% 0px -6% 0px" : "-6% 0px -6% 0px",
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Animated hero for subpages: kicker, display title, lead and optional chips.
 */
export function PageIntro({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="sp-hero">
      <motion.div
        className="container-page sp-hero-inner"
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerParent}
      >
        <motion.p className="sp-eyebrow" variants={staggerChild}>
          <i />
          {eyebrow}
        </motion.p>
        <motion.h1 variants={staggerChild}>{title}</motion.h1>
        {lead ? (
          <motion.p className="sp-hero-lead" variants={staggerChild}>
            {lead}
          </motion.p>
        ) : null}
        {children ? <motion.div variants={staggerChild}>{children}</motion.div> : null}
      </motion.div>
    </section>
  );
}

/**
 * Closing call-to-action band shared by subpages.
 */
export function CtaBand({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: ReactNode;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <Reveal className="container-page" amount={0.3}>
      <div className="sp-cta">
        <p>{kicker}</p>
        <h2>{title}</h2>
        {lead ? <p className="sp-cta-lead">{lead}</p> : null}
        <div className="sp-cta-actions">{children}</div>
      </div>
    </Reveal>
  );
}
