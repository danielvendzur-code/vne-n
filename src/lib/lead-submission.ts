import { siteConfig } from "@/config/site";

const LEAD_ENDPOINT =
  import.meta.env.VITE_LEAD_API_URL?.trim() || "https://moj-chatbot-backend.vercel.app/api/lead";

/**
 * Adresa, na ktorú dopyt smeruje aj vtedy, keď API nie je dostupné a
 * prehliadač otvorí e-mailového klienta. Drží sa v jednom mieste spolu
 * so zvyškom kontaktov.
 */
const FALLBACK_RECIPIENT = siteConfig.contact.email;

export type WebsiteLead = {
  source: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  web?: string;
  note?: string;
  interest?: string;
  industry?: string;
  features?: string;
  timeline?: string;
  consent: boolean;
};

type LeadResponse = {
  ok?: boolean;
  error?: string;
  fallback?: string;
  /** API potvrdí, či odoslalo automatické poďakovanie odosielateľovi. */
  autoReply?: boolean;
  autoReplySent?: boolean;
};

export type LeadResult = {
  /** mailto: adresa, ak sa dopyt nepodarilo odoslať cez API. */
  fallback?: string;
  /** true, ak API potvrdilo odoslanie automatického poďakovania. */
  thankYouSent: boolean;
};

function localFallback(payload: WebsiteLead): string {
  const subject = `Nový projekt — ${payload.company?.trim() || payload.name.trim()}`;
  const body = [
    `Zdroj: ${payload.source}`,
    `Meno: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Telefón: ${payload.phone || "neuvedený"}`,
    `Firma: ${payload.company || "neuvedená"}`,
    `Web: ${payload.web || "neuvedený"}`,
    "",
    `Riešenie: ${payload.interest || "neuvedené"}`,
    `Odvetvie: ${payload.industry || "neuvedené"}`,
    `Funkcie: ${payload.features || "neuvedené"}`,
    `Termín: ${payload.timeline || "neuvedený"}`,
    "",
    "Poznámka:",
    payload.note || "bez poznámky",
  ].join("\n");
  return `mailto:${FALLBACK_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function submitWebsiteLead(payload: WebsiteLead): Promise<LeadResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        ...payload,
        // Dopyt chodí na značkovú adresu a odosielateľ má dostať
        // automatické poďakovanie s kópiou toho, čo poslal.
        recipient: FALLBACK_RECIPIENT,
        replyTo: payload.email,
        autoReply: true,
        locale: "sk",
      }),
    });
    const data = (await response.json().catch(() => ({}))) as LeadResponse;
    if (response.ok && data.ok) {
      return { thankYouSent: data.autoReplySent ?? data.autoReply ?? false };
    }
    return { fallback: data.fallback || localFallback(payload), thankYouSent: false };
  } catch {
    return { fallback: localFallback(payload), thankYouSent: false };
  } finally {
    window.clearTimeout(timeout);
  }
}
