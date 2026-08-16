import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Jediné odhalenie na celom novom webe.
 *
 * Jednosmerné: čo raz bolo vidieť, ostáva vidieť. Obojsmerné odhalenie
 * znamená, že pri rýchlom scrollovaní späť hore je obsah v polovici
 * obrazovky priehľadný — a hore sa scrolluje rýchlejšie, než trvá
 * animácia.
 *
 * Pri vypnutých animáciách sa vykreslí obyčajný element, nie pohybový.
 * Pohybová knižnica si zapísané hodnoty drží mimo Reactu a prepísala by
 * aj náš `style`; výmena typu elementu zaručí, že po nej neostane stopa.
 */
export function Reveal2({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Plain = Tag;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = motion[Tag];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.62, delay, ease: EASE },
      }}
      viewport={{ once: true, amount: 0.16, margin: "-8% 0px -8% 0px" }}
    >
      {children}
    </Component>
  );
}
