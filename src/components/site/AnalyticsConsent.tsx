import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

const CONSENT_KEY = "mojchatbot.analytics-consent";
const CONSENT_EVENT = "analytics-consent:open";

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

    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") {
      setConsent(stored);
      setShowPrompt(false);
    } else {
      setShowPrompt(true);
    }

    const reopen = () => setShowPrompt(true);
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_EVENT, reopen);
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
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setShowPrompt(false);

    if (value === "denied" && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  };

  return (
    <aside className="analytics-consent" aria-label="Nastavenie analytiky">
      <div>
        <strong>Analytika návštevnosti</strong>
        <p>
          Vercel Analytics je bez cookies. Google Analytics spustíme iba po vašom súhlase.
          <Link to="/cookies"> Podrobnosti</Link>
        </p>
      </div>
      <div className="analytics-consent__actions">
        <button type="button" onClick={() => choose("denied")}>
          Len nevyhnutné
        </button>
        <button type="button" data-primary="true" onClick={() => choose("granted")}>
          Povoliť analytiku
        </button>
      </div>
    </aside>
  );
}

export function openAnalyticsPreferences() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONSENT_EVENT));
}
