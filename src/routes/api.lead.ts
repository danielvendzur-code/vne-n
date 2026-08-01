import { createFileRoute } from "@tanstack/react-router";
import { deliverLead, LEAD_RECIPIENT, type LeadPayload } from "@/lib/lead-email";

/**
 * Príjem dopytov z kontaktného formulára.
 *
 * Beží na rovnakej doméne ako web, takže odpadá CORS aj závislosť na
 * cudzej službe. Samotné odoslanie rieši Resend v `lib/lead-email.ts`;
 * kľúč je v premennej prostredia a do prehliadača sa nikdy nedostane.
 */

const LIMITS = {
  name: 80,
  email: 160,
  phone: 40,
  company: 160,
  web: 200,
  note: 1_500,
  interest: 160,
  industry: 120,
  features: 400,
  timeline: 80,
  source: 60,
} as const;

/** Znaky, ktoré v hlavičke e-mailu umožňujú vložiť vlastný riadok. */
const HEADER_INJECTION = /[\r\n]/;

function clean(value: unknown, limit: number): string {
  if (typeof value !== "string") return "";
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    const control = code <= 8 || (code >= 11 && code <= 12) || (code >= 14 && code <= 31);
    return control || code === 127 ? " " : character;
  })
    .join("")
    .replace(/[ \t]{4,}/g, "   ")
    .trim()
    .slice(0, limit);
}

/** Zámerne voľná kontrola — cieľom je odhaliť preklep, nie strážiť RFC. */
function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value) && !HEADER_INJECTION.test(value);
}

/**
 * Jednoduchý strop na počet dopytov z jednej adresy. Drží sa v pamäti
 * inštancie — nie je to ochrana pred cielenou záplavou, ale zastaví
 * omylom dvakrát odoslaný formulár aj primitívneho robota.
 */
const RATE_WINDOW_MS = 60_000;
// Desať za minútu prejde aj človeku, ktorý sa dvakrát pomýli v e-maile.
const RATE_MAX = 10;
const recentByIp = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recentByIp.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  hits.push(now);
  recentByIp.set(ip, hits);

  // Mapa nesmie rásť donekonečna.
  if (recentByIp.size > 500) {
    for (const [key, times] of recentByIp) {
      if (!times.some((time) => now - time < RATE_WINDOW_MS)) recentByIp.delete(key);
    }
  }
  return hits.length > RATE_MAX;
}

function mailtoFallback(lead: LeadPayload): string {
  const subject = `Nový projekt — ${lead.company || lead.name}`;
  const body = [
    `Meno: ${lead.name}`,
    `E-mail: ${lead.email}`,
    `Firma: ${lead.company || "neuvedená"}`,
    `Termín: ${lead.timeline || "neuvedený"}`,
    "",
    "Poznámka:",
    lead.note || "bez poznámky",
  ].join("\n");
  return `mailto:${LEAD_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export const Route = createFileRoute("/api/lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("x-real-ip") ||
          "unknown";
        if (rateLimited(ip)) {
          return json({ ok: false, error: "too-many-requests" }, 429);
        }

        let raw: Record<string, unknown>;
        try {
          raw = (await request.json()) as Record<string, unknown>;
        } catch {
          return json({ ok: false, error: "invalid-json" }, 400);
        }

        // Návnada pre roboty: pole, ktoré človek nikdy nevyplní.
        if (clean(raw.website, 40)) {
          // Tvárime sa, že všetko prebehlo — robot sa nemá čo dozvedieť.
          return json({ ok: true, autoReplySent: false });
        }

        const lead: LeadPayload = {
          source: clean(raw.source, LIMITS.source) || "website",
          name: clean(raw.name, LIMITS.name),
          email: clean(raw.email, LIMITS.email),
          phone: clean(raw.phone, LIMITS.phone),
          company: clean(raw.company, LIMITS.company),
          web: clean(raw.web, LIMITS.web),
          note: clean(raw.note, LIMITS.note),
          interest: clean(raw.interest, LIMITS.interest),
          industry: clean(raw.industry, LIMITS.industry),
          features: clean(raw.features, LIMITS.features),
          timeline: clean(raw.timeline, LIMITS.timeline),
          consent: raw.consent === true,
        };

        if (!lead.name || !isEmail(lead.email) || !lead.note || !lead.consent) {
          return json({ ok: false, error: "invalid-payload" }, 422);
        }

        const result = await deliverLead(lead);

        if (result.notConfigured) {
          console.error("RESEND_API_KEY nie je nastavený — dopyt sa neodoslal.");
          return json(
            { ok: false, error: "delivery-not-configured", fallback: mailtoFallback(lead) },
            503,
          );
        }

        if (!result.delivered) {
          return json({ ok: false, error: "delivery-failed", fallback: mailtoFallback(lead) }, 502);
        }

        return json({ ok: true, autoReplySent: result.autoReplySent });
      },

      GET: () => json({ ok: false, error: "method-not-allowed" }, 405),
    },
  },
});
