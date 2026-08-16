import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { introAlreadyPlayed, markIntroReady, rememberIntroPlayed } from "@/lib/brand-intro";
import "./BrandIntro.css";

/** Meno animácie opony. Musí sedieť s `BrandIntro.css`. */
const LIFT = "mc-intro-lift";
const LIFT_SKIP = "mc-intro-lift-skip";

/**
 * Značkový úvod.
 *
 * Prvé otvorenie webu začína značkou: ťah loga sa nakreslí, názov sa
 * odkryje spoza ľavej hrany a opona sa zdvihne nahor. Až potom nabehne
 * hero — jeden súvislý pohyb namiesto dvoch animácií cez seba.
 *
 * Opona je zámerne súčasťou HTML zo servera a celý pohyb je v CSS. Beží
 * teda od prvého vykreslenia, nie až od pripojenia Reactu — inak by
 * návštevník na okamih uvidel hotové hero a opona by naň spadla až
 * potom. JavaScript rieši len tri veci: kedy je po tom, preskočenie a
 * to, že sa úvod nehrá druhýkrát v tej istej relácii.
 *
 * Pri vypnutých animáciách sa opona nevykreslí vôbec (rieši CSS ešte
 * pri parsovaní, takže ani neblikne) a hero sa objaví bez čakania.
 */
export function BrandIntro() {
  const reducedMotion = useReducedMotion();
  const curtainRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  /** Opakovaná návšteva v tej istej relácii — opona odíde skratkou. */
  const [skip, setSkip] = useState(false);

  const finish = useCallback(() => {
    setGone(true);
    rememberIntroPlayed();
    markIntroReady();
  }, []);

  useEffect(() => {
    const curtain = curtainRef.current;

    // Bez opony (vypnuté animácie) alebo keď sa už stihla dohrať — napríklad
    // na pomalom zariadení, kde React nabehol až po nej — sa nečaká.
    const running = curtain
      ?.getAnimations()
      .some((animation) => animation.playState !== "finished");
    if (reducedMotion || !curtain || !running) {
      finish();
      return;
    }

    if (introAlreadyPlayed()) setSkip(true);

    const onEnd = (event: AnimationEvent) => {
      if (event.animationName === LIFT || event.animationName === LIFT_SKIP) finish();
    };
    curtain.addEventListener("animationend", onEnd);

    const skipNow = () => setSkip(true);
    window.addEventListener("keydown", skipNow, { once: true });
    window.addEventListener("pointerdown", skipNow, { once: true });

    // Kým je opona hore, stránka pod ňou nescrolluje.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      curtain.removeEventListener("animationend", onEnd);
      window.removeEventListener("keydown", skipNow);
      window.removeEventListener("pointerdown", skipNow);
      document.body.style.overflow = previousOverflow;
    };
  }, [finish, reducedMotion]);

  if (gone) return null;

  return (
    // Opona je čisto vizuálna. Obsah stránky pod ňou ostáva v strome
    // prístupný, takže čítačka obrazovky nemá čakať, kým sa zdvihne.
    <div className="mc-intro" data-skip={skip || undefined} aria-hidden="true" ref={curtainRef}>
      <div className="mc-intro__stage">
        <div className="mc-intro__lockup">
          <span className="mc-intro__mark">
            <BrandMark size={92} />
          </span>
          <span className="mc-intro__word">
            <b>Môj</b> Chatbot
          </span>
        </div>
        <span className="mc-intro__rule" />
      </div>
    </div>
  );
}
