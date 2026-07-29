import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./SectionRail.css";

interface RailSection {
  id: string;
  label: string;
}

/**
 * Úzky pás pod hlavičkou, ktorý pri scrollovaní ukazuje, v ktorej
 * časti stránky návštevník práve je.
 *
 * Sekcie samy o sebe vyzerali rovnako — nadpis a karty dookola — takže
 * sa nedalo rozoznať, kde sa človek nachádza. Toto je jediný prvok na
 * stránke, ktorý tú informáciu drží stále na očiach.
 */
export function SectionRail({ sections }: { sections: RailSection[] }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const reducedMotion = useReducedMotion();
  const framePending = useRef(false);

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node !== null);
    if (!nodes.length) return;

    // Polohy sa merajú mimo scrollovania, aby sa pri ňom nevynucoval
    // prepočet rozloženia — inak pás sekal rovnako ako časová os.
    let tops: number[] = [];
    const measure = () => {
      tops = nodes.map((node) => node.getBoundingClientRect().top + window.scrollY);
    };

    const update = () => {
      framePending.current = false;
      if (!tops.length) return;
      // Sekcia sa počíta ako aktívna, keď jej začiatok prejde tretinou okna.
      const line = window.scrollY + window.innerHeight * 0.34;
      let next = -1;
      for (let i = 0; i < tops.length; i += 1) {
        if (tops[i] <= line) next = i;
        else break;
      }
      setActiveIndex((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (framePending.current) return;
      framePending.current = true;
      window.requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [sections]);

  const active = activeIndex >= 0 ? sections[activeIndex] : null;

  return (
    <div
      className="section-rail"
      data-visible={active !== null}
      data-reduced={reducedMotion}
      aria-hidden="true"
    >
      <div className="container-page section-rail__inner">
        <span className="section-rail__index">
          {String(activeIndex + 1).padStart(2, "0")}
          <i />
          {String(sections.length).padStart(2, "0")}
        </span>
        <span className="section-rail__label">{active?.label ?? ""}</span>
        <span className="section-rail__track">
          <span
            className="section-rail__fill"
            style={{
              transform: `scaleX(${active ? (activeIndex + 1) / sections.length : 0})`,
            }}
          />
        </span>
      </div>
    </div>
  );
}
