import { Analytics, type BeforeSend } from "@vercel/analytics/react";
import styles from "./AnalyticsConsent.module.css";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ANALYTICS_CONSENT_EVENT } from "@/lib/analytics-consent";

const CONSENT_KEY = "mojchatbot.analytics-consent.v2";
const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

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
    if (!stored) return null;
    const record = JSON.parse(stored) as { value?: unknown; savedAt?: unknown };
    if (
      (record.value === "granted" || record.value === "denied") &&
      typeof record.savedAt === "number" &&
      record.savedAt <= Date.now() &&
      Date.now() - record.savedAt < CONSENT_MAX_AGE
    )
      return record.value;
    window.localStorage.removeItem(CONSENT_KEY);
    return null;
  } catch {
    return null;
  }
}

function writeConsent(value: Exclude<Consent, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, savedAt: Date.now() }));
  } catch {
    // Privacy mode or a blocked storage API must not break the website.
  }
}

function syncConsentDataset(value: Consent) {
  if (value === null) {
    delete document.documentElement.dataset.analyticsConsent;
    return;
  }
  document.documentElement.dataset.analyticsConsent = value;
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

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (!document.querySelector(`script[data-ga-id="${measurementId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.gaId = measurementId;
    document.head.appendChild(script);
  }

  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
  window.gtag("js", new Date());
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
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
    const stored = readConsent();
    syncConsentDataset(stored);
    setConsent(stored);
    setShowPrompt(stored === null);

    const reopen = () => setShowPrompt(true);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, reopen);
    const updateFromAnotherTab = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY && event.key !== null) return;
      const next = readConsent();
      // Reload also removes already loaded analytics SDKs and their listeners.
      if (document.documentElement.dataset.analyticsConsent === "granted" && next !== "granted") {
        window.location.reload();
        return;
      }
      syncConsentDataset(next);
      setConsent(next);
      setShowPrompt(next === null);
    };
    window.addEventListener("storage", updateFromAnotherTab);
    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, reopen);
      window.removeEventListener("storage", updateFromAnotherTab);
    };
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
        page_location: `${window.location.origin}${pathname}`,
        page_title: document.title,
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [consent, measurementId, pathname]);

  const choose = (value: Exclude<Consent, null>) => {
    writeConsent(value);
    syncConsentDataset(value);
    setConsent(value);
    setShowPrompt(false);

    if (value === "denied") {
      if (measurementId) {
        (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
      }
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      removeGoogleAnalyticsCookies();
      if (consent === "granted") window.location.reload();
    }
  };

  const beforeSend: BeforeSend = (event) => {
    if (document.documentElement.dataset.analyticsConsent !== "granted") return null;
    // Query strings and fragments may contain contact or campaign input.
    const url = new URL(event.url, window.location.origin);
    return { ...event, url: `${url.origin}${url.pathname}` };
  };

  return (
    <>
      {consent === "granted" ? <Analytics beforeSend={beforeSend} /> : null}
      {showPrompt ? (
        <aside
          className={`analytics-consent ${styles.prompt}`}
          role="dialog"
          aria-modal="false"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
        >
          <h2 id="analytics-consent-title">Vaše súkromie, vaša voľba.</h2>
          <p id="analytics-consent-description">
            Technické úložisko pomáha zachovať chat a vašu voľbu. Voliteľné meranie cez Vercel
            {measurementId ? " a Google Analytics" : " Analytics"} spustíme iba po súhlase.
            Odmietnutie nijako neobmedzí web ani asistenta.
          </p>
          <div className={styles.links}>
            <Link to="/cookies">Podrobnosti o cookies</Link>
            <Link to="/ochrana-udajov">Ochrana osobných údajov</Link>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={() => choose("denied")}>
              Odmietnuť analytiku
            </button>
            <button type="button" onClick={() => choose("granted")}>
              Povoliť analytiku
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
