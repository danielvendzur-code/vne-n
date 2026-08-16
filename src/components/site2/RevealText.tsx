import { Fragment } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Nadpis, ktorý sa odkryje po slovách.
 *
 * Každé slovo má vlastnú masku a vystúpi spoza hrany o zlomok sekundy
 * neskôr než predošlé. Je to jediný výraznejší typografický pohyb na
 * webe a používa sa len na nadpisy sekcií — keby ho mal každý odstavec,
 * prestal by čokoľvek znamenať.
 *
 * Text ostáva jeden reťazec pre čítačku obrazovky aj pre vyhľadávače;
 * rozdelené sú len vizuálne obaly.
 */
export function RevealText({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    const Plain = Tag;
    return <Plain className={className}>{text}</Plain>;
  }

  const Component = motion[Tag];

  return (
    <Component
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.055, delayChildren: delay } },
      }}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {/* Skutočná medzera medzi obalmi, nie `margin`. Obaly sú
              `inline-block`, takže medzera z DOM sa správa ako každá iná:
              dovolí zalomenie a na začiatku riadku sa sama zruší. S
              odsadením cez `margin` každý ďalší riadok začínal odsadený. */}
          {index > 0 ? " " : null}
          <span className="mc2-word" aria-hidden="true">
            <motion.span
              className="mc2-word__inner"
              variants={{
                hidden: { y: "105%" },
                visible: { y: "0%", transition: { duration: 0.78, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </Component>
  );
}
