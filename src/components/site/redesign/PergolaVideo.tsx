import { useEffect, useRef, useState } from "react";
import { sitePath } from "./utils";
import s from "./HomeSolutions.module.css";

/**
 * Cinematic film only. The live Koverta configurator opens on koverta.sk;
 * the marketing homepage must not instantiate WebGL or an iframe.
 */
export function PergolaVideo({ large = false }: { large?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = root.current;
    const player = video.current;
    if (!element || !player) return;

    let visible = false;
    let loaded = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (motion.matches || document.hidden || !visible || failed) {
        player.pause();
        setPlaying(false);
        return;
      }

      if (!loaded) {
        // Defer the video request until the card is near the viewport.
        loaded = true;
        player.src = sitePath("/work/solutions/pergola-film.mp4");
        player.load();
      }
      void player.play().catch(() => {
        // Keep the poster available when autoplay is disabled by the browser.
        setPlaying(false);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "160px 0px", threshold: 0 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      player.pause();
    };
  }, [failed]);

  return (
    <div
      ref={root}
      className={s.pergolaFilm}
      data-playing={playing}
      data-size={large ? "large" : "card"}
    >
      <div className={s.pergolaScene}>
        <img
          className={s.pergolaPoster}
          src={sitePath("/work/solutions/pergola-fixed-camera-poster.webp")}
          alt="Bioklimatická pergola Koverta v 3D vizualizácii"
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
        />
        {!failed && (
          <video
            ref={video}
            className={s.pergolaFilmVideo}
            muted
            loop
            playsInline
            preload="none"
            autoPlay={false}
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
