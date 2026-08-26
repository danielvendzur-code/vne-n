import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

function normalizePath(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

/**
 * Top-level pages already have a complete primary navigation and do not need a
 * second breadcrumb strip. Keep breadcrumbs only for genuinely nested content.
 */
export function Breadcrumbs() {
  const pathname = normalizePath(useRouterState({ select: (state) => state.location.pathname }));

  if (pathname !== "/projekty/derat") return null;

  return (
    <nav className="site-breadcrumbs" aria-label="Drobečková navigácia">
      <div className="container-page site-breadcrumbs__inner">
        <Link to="/">Domov</Link>
        <ChevronRight aria-hidden="true" size={13} />
        <Link to="/projekty">Realizácie</Link>
        <ChevronRight aria-hidden="true" size={13} />
        <span aria-current="page">DERAT — prípadová štúdia</span>
      </div>
    </nav>
  );
}
