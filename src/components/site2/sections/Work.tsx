import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { realizations } from "@/data/realizations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RevealText } from "../RevealText";
import { RuleLine } from "../RuleLine";
import { Reveal2 } from "../Reveal2";
import "./Work.css";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Ukážka, ktorá sleduje kurzor.
 *
 * Nad zoznamom sa drží jeden obrázok a mení sa podľa toho, nad ktorým
 * riadkom kurzor je. Je to jediný prvok na webe, ktorý reaguje priamo na
 * pohyb myši — preto si to môže dovoliť.
 *
 * Pozíciu dobieha pružinou v jednom `requestAnimationFrame` a zapisuje
 * ju do vlastných vlastností, takže sa počas pohybu nič neprekresľuje
 * mimo kompozítora. Na dotyku a pri vypnutých animáciách sa nepripojí.
 */
function useCursorPreview(reduced: boolean) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let started = false;

    const tick = () => {
      x += (targetX - x) * 0.14;
      y += (targetY - y) * 0.14;
      layer.style.setProperty("--x", `${x.toFixed(1)}px`);
      layer.style.setProperty("--y", `${y.toFixed(1)}px`);
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!started) {
        started = true;
        x = targetX;
        y = targetY;
        frame = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return { layerRef, hovered, setHovered };
}

/**
 * Realizácie ako index.
 *
 * Predtým to boli štyri rovnaké karty s odstavcom pri každej. Teraz je
 * to zoznam: číslo, názov, typ. Nič viac — kto chce detail, rozklikne
 * riadok a dostane veľký screenshot aj popis. Stránka sa tak dá prejsť
 * očami za pár sekúnd a text sa pýta o slovo, až keď oň niekto stojí.
 */
export function Work() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const { layerRef, hovered, setHovered } = useCursorPreview(reduced);
  // Nad rozkliknutým riadkom sa ukážka nedrží: veľký screenshot je už
  // otvorený pod ním a malý by mu ležal cez cestu.
  const preview = hovered && hovered !== open ? realizations.find((i) => i.name === hovered) : null;

  return (
    <section className="mc2-work" id="realizacie">
      <div className="mc2-shell">
        <Reveal2 className="mc2-work__head">
          <p className="mc2-eyebrow">
            <b>02</b> Realizácie
          </p>
          <RevealText className="mc2-title" text="Weby, ktoré si viete otvoriť." />
        </Reveal2>

        <ul className="mc2-work__index" onPointerLeave={() => setHovered(null)}>
          {realizations.map((project, index) => {
            const expanded = open === project.name;
            const panelId = `mc2-work-${project.name.replace(/\W+/g, "-")}`;

            return (
              <li className="mc2-work__item" key={project.name} data-open={expanded}>
                <h3>
                  <button
                    type="button"
                    className="mc2-work__row"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onPointerEnter={() => setHovered(project.name)}
                    onFocus={() => setHovered(project.name)}
                    onClick={() => setOpen(expanded ? null : project.name)}
                  >
                    <span className="mc2-work__num">{`0${index + 1}`}</span>
                    <span className="mc2-work__name">{project.name}</span>
                    <span className="mc2-work__type">{project.type}</span>
                    <span className="mc2-work__plus" aria-hidden="true">
                      <Plus />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      className="mc2-work__panel"
                      id={panelId}
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.52, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="mc2-work__panel-inner">
                        <motion.a
                          className="mc2-work__media"
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Otvoriť živý web ${project.domain}`}
                          initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
                          animate={{ clipPath: "inset(0 0 0% 0)" }}
                          transition={{ duration: 0.72, ease: EASE, delay: 0.08 }}
                        >
                          <img
                            src={project.image}
                            alt={project.alt}
                            loading="lazy"
                            decoding="async"
                          />
                        </motion.a>

                        <div className="mc2-work__copy">
                          <p className="mc2-work__detail">{project.detail}</p>
                          <div className="mc2-work__actions">
                            <a
                              className="mc2-quiet"
                              href={project.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {project.domain}
                              <ArrowUpRight aria-hidden="true" />
                            </a>
                            {project.caseStudyPath ? (
                              <Link className="mc2-quiet" to={project.caseStudyPath}>
                                Prípadová štúdia
                                <ArrowUpRight aria-hidden="true" />
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <RuleLine />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Ukážka pod kurzorom. Mimo mriežky, aby nemohla ovplyvniť layout. */}
      <div className="mc2-work__cursor" ref={layerRef} aria-hidden="true" data-on={!!preview}>
        {preview ? <img src={preview.image} alt="" /> : null}
      </div>
    </section>
  );
}
