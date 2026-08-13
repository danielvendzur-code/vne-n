import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  "/sluzby": "Čo tvoríme",
  "/preco-chatbot": "Čo to prinesie webu",
  "/projekty": "Realizácie",
  "/projekty/derat": "DERAT — prípadová štúdia",
  "/cennik": "Cena",
  "/postup": "Spolupráca",
  "/kontakt": "Kontakt",
  "/cookies": "Cookies a analytika",
  "/ochrana-udajov": "Ochrana osobných údajov",
  "/dakujeme": "Ďakujeme",
};

function normalizePath(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

export function Breadcrumbs() {
  const pathname = normalizePath(
    useRouterState({ select: (state) => state.location.pathname }),
  );
  const label = ROUTE_LABELS[pathname];

  if (!label || pathname === "/") return null;

  return (
    <nav className="site-breadcrumbs" aria-label="Drobečková navigácia">
      <div className="container-page site-breadcrumbs__inner">
        <Link to="/">Domov</Link>
        <ChevronRight aria-hidden="true" size={13} />
        {pathname === "/projekty/derat" ? (
          <>
            <Link to="/projekty">Realizácie</Link>
            <ChevronRight aria-hidden="true" size={13} />
          </>
        ) : null}
        <span aria-current="page">{label}</span>
      </div>
    </nav>
  );
}
