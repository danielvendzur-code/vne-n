import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ANALYTICS_CONSENT_EVENT } from "@/lib/analytics-consent";

const CONSENT_KEY = "mojchatbot.analytics-consent";

type Consent = "granted" | "denied" | null;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: Gtag;
  }
}

function validMeasurementId(value: string | undefined): string | null {
  const candidate = value?.trim().toUpperCase();
  return candidate && /^G-[A-Z0-9]+$/.test(candidate) ? candidate : null;
}

function readConsent(): Consent {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

function writeConsent(value: Exclude<Consent, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Privacy mode or a blocked storage API must not break the website.
  }
}

function removeGoogleAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name))
    .filter((name) => name === "_gid" || name.startsWith("_ga") || name.startsWith("_gat"));

  if (!names.length) return;

  const hostname = window.location.hostname;
  const labels = hostname.split(".").filter(Boolean);
  const parentDomain = labels.length >= 2 ? `.${labels.slice(-2).join(".")}` : "";

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    if (hostname) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${hostname}; SameSite=Lax`;
    }
    if (parentDomain) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${parentDomain}; SameSite=Lax`;
    }
  }
}

function ensureGoogleAnalytics(measurementId: string) {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  if (!document.querySelector(`script[data-ga-id="${measurementId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.gaId = measurementId;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: false,
  });
}

export function AnalyticsConsent() {
  const measurementId = useMemo(
    () => validMeasurementId(import.meta.env.VITE_GA_MEASUREMENT_ID),
    [],
  );
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [consent, setConsent] = useState<Consent>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!measurementId) return;

    const stored = readConsent();
    setConsent(stored);
    setShowPrompt(stored === null);

    const reopen = () => setShowPrompt(true);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, reopen);
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId || consent !== "granted") return;
    ensureGoogleAnalytics(measurementId);
  }, [consent, measurementId]);

  useEffect(() => {
    if (!measurementId || consent !== "granted" || typeof window.gtag !== "function") return;

    const timer = window.setTimeout(() => {
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [consent, measurementId, pathname]);

  if (!measurementId || !showPrompt) return null;

  const choose = (value: Exclude<Consent, null>) => {
    writeConsent(value);
    setConsent(value);
    setShowPrompt(false);

    if (value === "denied") {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      removeGoogleAnalyticsCookies();
    }
  };

  return (
    <aside
      className="analytics-consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-description"
    >
      <div className="analytics-consent__copy">
        <strong id="analytics-consent-title">Analytika návštevnosti</strong>
        <p id="analytics-consent-description">
          Google Analytics spustíme iba po vašom súhlase. Odmietnutie nijako neobmedzí web.
          <Link to="/cookies"> Podrobnosti a zmena nastavenia</Link>
        </p>
      </div>
      <div className="analytics-consent__actions">
        <button type="button" onClick={() => choose("denied")}>
          Odmietnuť analytiku
        </button>
        <button type="button" onClick={() => choose("granted")}>
          Povoliť analytiku
        </button>
      </div>
    </aside>
  );
}
