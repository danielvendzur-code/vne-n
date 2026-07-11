import { Link } from "@tanstack/react-router";
import { Symbol } from "@/components/Symbol";
import { openSiteAssistant } from "@/lib/site-assistant";

export function Footer() {
  return (
    <footer className="mt-24" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container-page py-12 grid gap-10 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <Symbol />
          <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
            Kalkulačky, dopytoví asistenti a konfigurátory pre malé a stredné firmy.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-3">Prehľad</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sluzby" style={{ color: "var(--text-primary)" }}>Čo staviam</Link></li>
            <li><Link to="/projekty" style={{ color: "var(--text-primary)" }}>Projekty</Link></li>
            <li><Link to="/postup" style={{ color: "var(--text-primary)" }}>Ako to prebieha</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-3">Kontakt</div>
          <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
            Napíšte, čo klienti na vašej stránke najčastejšie potrebujú. Ozvem sa.
          </p>
          <button
            onClick={() => openSiteAssistant({ source: "footer" })}
            className="inline-flex rounded-md px-3.5 py-2 text-sm font-medium"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Napísať zadanie
          </button>
        </div>
      </div>
      <div className="container-page py-6 text-xs flex flex-wrap gap-4 justify-between" style={{ color: "var(--text-light)", borderTop: "1px solid var(--border)" }}>
        <span>© {new Date().getFullYear()}</span>
        <span>Vytvorené na zákazku.</span>
      </div>
    </footer>
  );
}
