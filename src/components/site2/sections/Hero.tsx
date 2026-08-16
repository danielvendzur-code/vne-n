import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";
import type { DemoEntry } from "@/lib/demo-entry";
import { ProductSurface } from "../ProductSurface";
import "./Hero.css";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const line: Variants = {
  hidden: { y: "34%", clipPath: "inset(0 0 108% 0)" },
  visible: { y: "0%", clipPath: "inset(0 0 -14% 0)", transition: { duration: 0.86, ease: EASE } },
};

const rise: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

const rule: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.72, ease: EASE } },
};

const stage: Variants = {
  hidden: { x: "12%", opacity: 0 },
  visible: {
    x: "0%",
    opacity: 1,
    transition: { duration: 0.92, ease: EASE, delay: 0.24, staggerChildren: 0.07 },
  },
};

const CLAIM = ["Váš e‑shop odpovie", "skôr, než", "zákazník odíde."];

const PROOF = ["Reálne nasadené weby", "Logika podľa vašej firmy", "Od návrhu po nasadenie"];

/**
 * Prvá obrazovka.
 *
 * Dve plochy proti sebe: vľavo papier s tvrdením, vpravo produktová
 * plocha zarazená do pravej hrany okna. Keď návštevník prišiel z ukážky,
 * nad tvrdením stojí pásik, ktorý nadväzuje na e-mail, a plocha sa
 * otvorí rovno na tom nástroji, o ktorom sa bavili.
 */
export function Hero({ demo }: { demo: DemoEntry | null }) {
  const reduced = useReducedMotion();
  const introReady = useIntroReady();
  const ctaRef = useMagnetic<HTMLAnchorElement>();
  const rootRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const claimY = useTransform(smooth, [0, 1], [0, reduced ? 0 : -104]);
  const stageY = useTransform(smooth, [0, 1], [0, reduced ? 0 : -44]);
  const fade = useTransform(smooth, [0, 0.86], [1, reduced ? 1 : 0]);

  const still = reduced;
  const state = still || introReady ? "visible" : "hidden";

  return (
    <section className="mc2-hero" id="uvod" ref={rootRef}>
      <div className="mc2-hero__inner">
        <motion.header
          className="mc2-hero__masthead"
          initial={still ? false : "hidden"}
          animate={state}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          <motion.span className="mc2-hero__masthead-rule" variants={rule} />
          <motion.span className="mc2-hero__kicker" variants={rise}>
            Chatboty pre e-shopy
          </motion.span>
          <motion.span className="mc2-hero__origin" variants={rise}>
            Aj pre firmy so službami
          </motion.span>
        </motion.header>

        <motion.div
          className="mc2-hero__claim"
          initial={still ? false : "hidden"}
          animate={state}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.075 } } }}
          style={{ y: claimY, opacity: fade }}
        >
          {demo ? (
            <motion.p className="mc2-hero__demo" variants={rise}>
              <span className="mc2-hero__demo-dot" aria-hidden="true" />
              {demo.band}
            </motion.p>
          ) : null}

          <h1 aria-label="Váš e-shop odpovie skôr, než zákazník odíde.">
            {CLAIM.map((text, index) => (
              <span className="mc2-hero__line" aria-hidden="true" key={text}>
                <motion.span
                  className="mc2-hero__line-inner"
                  data-accent={index === CLAIM.length - 1}
                  variants={line}
                >
                  {text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="mc2-hero__lead" variants={rise}>
            Chatbot odpovie na otázky o objednávke, poradí s výberom a vybaví vrátenie. Rovnako
            dobre pracuje pre firmy so službami — s kalkulačkou aj konfigurátorom.
          </motion.p>

          <motion.div className="mc2-hero__actions" variants={rise}>
            {demo?.action.kind === "form" ? (
              <Link to="/kontakt" className="mc2-cta" ref={ctaRef}>
                <span>{demo.action.label}</span>
                <span className="mc2-cta__icon" aria-hidden="true">
                  <ArrowRight />
                  <ArrowRight />
                </span>
              </Link>
            ) : (
              <Link to="/kontakt" className="mc2-cta" ref={ctaRef}>
                <span>Nezáväzná konzultácia</span>
                <span className="mc2-cta__icon" aria-hidden="true">
                  <ArrowRight />
                  <ArrowRight />
                </span>
              </Link>
            )}

            {demo && demo.action.kind === "assistant" ? (
              <button
                type="button"
                className="mc2-quiet"
                onClick={() => openSiteAssistant({ source: "hero-demo", preset: demo.preset })}
              >
                {demo.action.label}
              </button>
            ) : null}
          </motion.div>
        </motion.div>

        <motion.div
          className="mc2-hero__stage"
          initial={still ? false : "hidden"}
          animate={state}
          variants={stage}
          style={{ y: stageY, opacity: fade }}
        >
          <ProductSurface initial={demo?.surface ?? "objednavky"} source="hero" />
        </motion.div>

        <motion.footer
          className="mc2-hero__foot"
          initial={still ? false : "hidden"}
          animate={state}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.5 } },
          }}
          style={{ opacity: fade }}
        >
          <motion.span className="mc2-hero__foot-rule" variants={rule} />
          <ul className="mc2-hero__proof">
            {PROOF.map((item, index) => (
              <motion.li key={item} variants={rise}>
                <span className="mc2-hero__num">{`0${index + 1}`}</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
          <motion.a className="mc2-hero__cue" href="#realizacie" variants={rise}>
            <span>Realizácie</span>
            <ArrowDown aria-hidden="true" />
          </motion.a>
        </motion.footer>
      </div>
    </section>
  );
}
