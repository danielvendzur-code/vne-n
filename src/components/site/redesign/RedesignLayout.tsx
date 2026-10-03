import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { AnalyticsConsent } from "../AnalyticsConsent";
import "./fonts.css";
import "./reference.css";
import "./redesign.css";

function AircraftCursor() {
  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    if (!media.matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shape = document.createElement("div");
    const tag = document.createElement("div");
    shape.className = "redesign-cursor";
    tag.className = "redesign-cursor-label";
    document.body.append(shape, tag);
    document.body.classList.add("redesign-cursor-active");
    let x = -200,
      y = -200,
      previousX = -200,
      previousY = -200,
      angle = -45,
      bank = 0;
    let frame = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      const control = target?.closest("a,button,summary,label,[data-cursor]");
      tag.textContent =
        control?.getAttribute("data-cursor") ??
        (control?.tagName === "SUMMARY"
          ? "Rozbaliť"
          : control?.tagName === "A"
            ? "Otvoriť"
            : "Vybrať");
      tag.style.opacity = control ? "1" : "0";
    };
    const leave = () => {
      x = y = -200;
      tag.style.opacity = "0";
    };
    const tick = () => {
      const dx = x - previousX,
        dy = y - previousY;
      previousX = x;
      previousY = y;
      if (dx * dx + dy * dy > 4) {
        const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const difference = ((targetAngle - angle + 540) % 360) - 180;
        const step = difference * (reduced ? 1 : 0.1);
        angle += step;
        bank += (Math.max(-1, Math.min(1, step / 14)) - bank) * 0.15;
      } else {
        bank *= 0.92;
      }
      shape.style.transform = `translate(${x}px,${y}px) rotate(${angle}deg) scaleY(${reduced ? 1 : 1 - Math.abs(bank) * 0.3})`;
      tag.style.transform = `translate(${x + 24}px,${y + 24}px)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    tick();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      document.body.classList.remove("redesign-cursor-active");
      shape.remove();
      tag.remove();
    };
  }, []);
  return null;
}

export function RedesignLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/projekty")
        ? "realizacie"
        : pathname === "/postup"
          ? "postup"
          : pathname === "/cennik"
            ? "cennik"
            : "riesenia";
  return (
    <div className="redesign">
      <a className="redesign-skip" href="#main-content">
        Preskočiť na obsah
      </a>
      <div className="redesign-header">
        <Header active={active} />
      </div>
      <main id="main-content" key={pathname}>
        {children}
      </main>
      <AnalyticsConsent />
      <AircraftCursor />
    </div>
  );
}
