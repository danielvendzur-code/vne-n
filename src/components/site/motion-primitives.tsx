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
  base: 0.42,
  slow: 0.64,
  stagger: 0.055,
} as const;

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: MOTION.stagger, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: MOTION.base, ease: premiumEase } },
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
  distance = 28,
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
  "data-open"?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const narrow = useNarrowViewport();
  const Component = motion[Tag];

  // Pri vypnutých animáciách sa obsah vykreslí bez akýchkoľvek stavov.
  // Nesmie tu ostať `hidden` bez cieľa — obsah by ostal neviditeľný.
  if (reducedMotion) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    );
  }

  const x = narrow || direction === "up" ? 0 : direction === "left" ? -distance : distance;
  const y = direction === "up" ? Math.min(distance, 14) : 0;

  return (
    <Component
      className={className}
      // Obojsmerné: pri scrollovaní späť hore obsah zase odchádza. Trvanie
      // odchodu sedí v `initial`, lebo práve doň sa prvok vracia, keď
      // opustí zorné pole — a odchod má byť kratší než príchod.
      initial={{
        opacity: 0,
        x,
        y,
        transition: { duration: MOTION.fast, ease: premiumEase },
      }}
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
        once: false,
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
