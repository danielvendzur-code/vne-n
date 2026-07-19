import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./Subpage.css";

export const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { y: 22, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.68, ease: premiumEase } },
};

type RevealDirection = "up" | "left" | "right";

export function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  distance = 36,
  amount = 0.18,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  distance?: number;
  amount?: number;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const reducedMotion = useReducedMotion();
  const x = direction === "left" ? -distance : direction === "right" ? distance : 0;
  const y = direction === "up" ? Math.min(distance, 28) : 0;
  const Component = motion[Tag];

  return (
    <Component
      className={className}
      initial={reducedMotion ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.72, delay, ease: premiumEase }}
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

/**
 * Section heading with kicker line, big display title and optional lead —
 * the same rhythm the landing page uses, portable to every subpage.
 */
export function SectionHeading({
  eyebrow,
  children,
  copy,
  align = "left",
}: {
  eyebrow: string;
  children: ReactNode;
  copy?: string;
  align?: "left" | "center";
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="sp-heading"
      data-align={align}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.34 }}
      variants={{
        hidden: { opacity: 0, x: -30 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.7, ease: premiumEase, staggerChildren: 0.09 },
        },
      }}
    >
      <motion.p className="sp-eyebrow" variants={staggerChild}>
        <i />
        {eyebrow}
      </motion.p>
      <motion.h2 variants={staggerChild}>{children}</motion.h2>
      {copy ? (
        <motion.p className="sp-heading-copy" variants={staggerChild}>
          {copy}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
