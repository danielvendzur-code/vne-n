import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Linka, ktorá sa dokreslí, keď na ňu prídete.
 *
 * Zoznamy na tejto stránke — realizácie aj kroky spolupráce — nedržia
 * pokope rámčeky, ale vlasové linky medzi riadkami. Keby stáli hotové,
 * bola by to tabuľka. Takto sa mriežka skladá pred očami a stránka pri
 * scrollovaní žije bez toho, aby sa čokoľvek hýbalo hore-dole.
 *
 * Animuje sa výhradne `scaleX`, takže sa nič neprepočítava; pri
 * vypnutých animáciách je to obyčajná linka.
 */
export function RuleLine({ delay = 0 }: { delay?: number }) {
  const reduced = useReducedMotion();

  if (reduced) return <span className="mc2-line" aria-hidden="true" />;

  return (
    <motion.span
      className="mc2-line"
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    />
  );
}
