export const ANALYTICS_CONSENT_EVENT = "analytics-consent:open";

export function openAnalyticsPreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
  }
}
