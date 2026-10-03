import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { AnalyticsConsent } from "../AnalyticsConsent";
import "./fonts.css";
import "./reference.css";
import "./redesign.css";

function DotRingCursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const shape = document.createElement("div");
    const tag = document.createElement("div");
    shape.className = "redesign-cursor";
    tag.className = "redesign-cursor-label";
    shape.setAttribute("aria-hidden", "true");
    tag.setAttribute("aria-hidden", "true");
    document.body.append(shape, tag);
    document.body.classList.add("redesign-cursor-active");

    const position = (x: number, y: number, label = "") => {
      shape.style.transform = `translate(${x}px,${y}px)`;
      tag.style.transform = `translate(${x + 24}px,${y + 24}px)`;
      tag.textContent = label;
      tag.style.opacity = label ? "1" : "0";
    };
    const move = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const control = target?.closest("a,button,summary,label,[data-cursor]");
      position(event.clientX, event.clientY, control?.getAttribute("data-cursor") ?? "");
    };
    const leave = () => position(-200, -200);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
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
      <DotRingCursor />
    </div>
  );
}
