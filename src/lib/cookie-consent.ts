export const COOKIE_CONSENT_NAME = "vendzur_cookie_consent";
export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export const COOKIE_SETTINGS_EVENT = "vendzur:cookie-settings";
export const COOKIE_CONSENT_EVENT = "vendzur:cookie-consent";

export type CookieConsentState = {
  version: number;
  necessary: true;
  analytics: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

const encodeConsent = (consent: CookieConsentState) => encodeURIComponent(JSON.stringify(consent));

const decodeConsent = (value: string): CookieConsentState | null => {
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<CookieConsentState>;
    if (
      parsed.version !== COOKIE_CONSENT_VERSION ||
      parsed.necessary !== true ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }
    return parsed as CookieConsentState;
  } catch {
    return null;
  }
};

const cookieParts = () => (isBrowser() ? document.cookie.split(";") : []);

export function readCookieConsent(): CookieConsentState | null {
  if (!isBrowser()) return null;
  const prefix = `${COOKIE_CONSENT_NAME}=`;
  const match = cookieParts().map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return match ? decodeConsent(match.slice(prefix.length)) : null;
}

export function writeCookieConsent(analytics: boolean): CookieConsentState {
  const consent: CookieConsentState = {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };

  if (!isBrowser()) return consent;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_CONSENT_NAME}=${encodeConsent(consent)}; Path=/; Max-Age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
  applyCookieConsent(consent);
  return consent;
}

const expireCookie = (name: string, domain?: string) => {
  const domainPart = domain ? `; Domain=${domain}` : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${domainPart}`;
};

const clearKnownAnalyticsCookies = () => {
  if (!isBrowser()) return;
  const hostname = window.location.hostname;
  const parentDomain =
    hostname.split(".").length > 2 ? `.${hostname.split(".").slice(-2).join(".")}` : undefined;
  const analyticsNames = cookieParts()
    .map((part) => part.trim().split("=")[0])
    .filter((name) => /^(?:_ga(?:_.+)?|_gid|_gat(?:_.+)?|_pk_id\..+|_pk_ses\..+)$/i.test(name));

  analyticsNames.forEach((name) => {
    expireCookie(name);
    expireCookie(name, hostname);
    if (parentDomain) expireCookie(name, parentDomain);
  });
};

export function applyCookieConsent(consent = readCookieConsent()): void {
  if (!isBrowser()) return;
  const analyticsAllowed = consent?.analytics === true;

  document.documentElement.dataset.analyticsConsent = analyticsAllowed ? "granted" : "denied";

  if (analyticsAllowed) {
    window.dataLayer ??= [];
    window.dataLayer.push({
      event: "vendzur_consent_update",
      analytics_storage: "granted",
      consent_version: COOKIE_CONSENT_VERSION,
    });
  } else {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: "vendzur_consent_update",
        analytics_storage: "denied",
        consent_version: COOKIE_CONSENT_VERSION,
      });
    }
    clearKnownAnalyticsCookies();
  }

  window.dispatchEvent(
    new CustomEvent<CookieConsentState | null>(COOKIE_CONSENT_EVENT, { detail: consent }),
  );
}

export function openCookieSettings(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}
