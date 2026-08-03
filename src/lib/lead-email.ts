/**
 * Odoslanie dopytu cez Resend.
 *
 * Beží iba na serveri — kľúč sa nikdy nedostane do prehliadača. Volá sa
 * z `src/routes/api.lead.ts`, ktorý je na rovnakej doméne ako web, takže
 * odpadá aj CORS.
 */

export interface LeadPayload {
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
}

/** Adresa Resend API. Prepísateľná len kvôli testom. */
const RESEND_ENDPOINT = process.env.RESEND_API_URL?.trim() || "https://api.resend.com/emails";

/** Adresa, na ktorú chodia dopyty. */
export const LEAD_RECIPIENT = process.env.LEAD_TO_EMAIL?.trim() || "info@mojchatbot.sk";

/**
 * Odosielateľ. Doména musí byť v Resende overená, inak API odmietne
 * odoslanie. Preto sa dá prepísať cez premennú prostredia.
 */
const LEAD_FROM = process.env.LEAD_FROM_EMAIL?.trim() || "Môj Chatbot <info@mojchatbot.sk>";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `<tr>
      <td style="padding:6px 14px 6px 0;color:#5f6d65;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:6px 0;color:#0b2f20;font-size:14px">${escapeHtml(value)}</td>
    </tr>`;
}

/** E-mail pre mňa — všetko, čo zákazník vyplnil, na jednom mieste. */
function internalHtml(lead: LeadPayload) {
  const note = lead.note ? escapeHtml(lead.note).replaceAll("\n", "<br>") : "bez poznámky";
  return `<!doctype html><html lang="sk"><body style="margin:0;background:#f5f9f2;padding:24px;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;padding:28px">
    <p style="margin:0 0 4px;color:#0f6a3e;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Nový dopyt z webu</p>
    <h1 style="margin:0 0 20px;color:#0b2f20;font-size:22px">${escapeHtml(lead.name)}</h1>
    <table style="width:100%;border-collapse:collapse">
      ${row("E-mail", lead.email)}
      ${row("Telefón", lead.phone)}
      ${row("Firma", lead.company)}
      ${row("Web", lead.web)}
      ${row("Riešenie", lead.interest)}
      ${row("Odvetvie", lead.industry)}
      ${row("Funkcie", lead.features)}
      ${row("Termín", lead.timeline)}
      ${row("Zdroj", lead.source)}
    </table>
    <p style="margin:22px 0 6px;color:#5f6d65;font-size:13px">Poznámka</p>
    <div style="padding:14px 16px;border-radius:10px;background:#f5f9f2;color:#0b2f20;font-size:14px;line-height:1.6">${note}</div>
    <p style="margin:22px 0 0;color:#5f6d65;font-size:12px">Odpovedať sa dá priamo na túto správu — pôjde zákazníkovi.</p>
  </div></body></html>`;
}

/** Automatické poďakovanie pre zákazníka s kópiou jeho zadania. */
function replyHtml(lead: LeadPayload) {
  const note = lead.note ? escapeHtml(lead.note).replaceAll("\n", "<br>") : "";
  return `<!doctype html><html lang="sk"><body style="margin:0;background:#f5f9f2;padding:24px;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:28px">
    <p style="margin:0 0 4px;color:#0f6a3e;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Ďakujem za zadanie</p>
    <h1 style="margin:0 0 14px;color:#0b2f20;font-size:22px;line-height:1.25">Váš dopyt mi prišiel.</h1>
    <p style="margin:0 0 16px;color:#4c5a52;font-size:15px;line-height:1.65">
      Dobrý deň${lead.name ? `, ${escapeHtml(lead.name.split(" ")[0])}` : ""},<br>
      ďakujem za správu. Pozriem sa na ňu a ozveme sa s odporúčaným riešením,
      rozsahom aj cenou zvyčajne do jedného pracovného dňa.
    </p>
    ${
      note
        ? `<p style="margin:0 0 6px;color:#5f6d65;font-size:13px">Čo ste poslali</p>
           <div style="padding:14px 16px;border-radius:10px;background:#f5f9f2;color:#0b2f20;font-size:14px;line-height:1.6">${note}</div>`
        : ""
    }
    <p style="margin:20px 0 0;color:#4c5a52;font-size:14px;line-height:1.6">
      Ak chcete niečo doplniť, stačí odpovedať na tento e-mail.
    </p>
    <p style="margin:22px 0 0;color:#5f6d65;font-size:13px">
      Tím Môj Chatbot<br>
      <a href="https://mojchatbot.sk" style="color:#0f6a3e">mojchatbot.sk</a>
    </p>
  </div></body></html>`;
}

function textSummary(lead: LeadPayload) {
  return [
    `Zdroj: ${lead.source}`,
    `Meno: ${lead.name}`,
    `E-mail: ${lead.email}`,
    `Telefón: ${lead.phone || "neuvedený"}`,
    `Firma: ${lead.company || "neuvedená"}`,
    `Web: ${lead.web || "neuvedený"}`,
    `Riešenie: ${lead.interest || "neuvedené"}`,
    `Odvetvie: ${lead.industry || "neuvedené"}`,
    `Funkcie: ${lead.features || "neuvedené"}`,
    `Termín: ${lead.timeline || "neuvedený"}`,
    "",
    "Poznámka:",
    lead.note || "bez poznámky",
  ].join("\n");
}

async function sendEmail(apiKey: string, body: Record<string, unknown>): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      // Do logu ide dôvod od Resendu, do odpovede pre prehliadač nikdy.
      console.error("Resend odmietol správu:", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend je nedostupný:", error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export interface DeliveryResult {
  delivered: boolean;
  autoReplySent: boolean;
  /** true, keď nie je nastavený kľúč — vtedy má web ponúknuť mailto. */
  notConfigured?: boolean;
}

export async function deliverLead(lead: LeadPayload): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { delivered: false, autoReplySent: false, notConfigured: true };
  }

  const subject = `Nový dopyt — ${lead.company?.trim() || lead.name.trim()}`;

  const delivered = await sendEmail(apiKey, {
    from: LEAD_FROM,
    to: [LEAD_RECIPIENT],
    // Odpoveď na dopyt ide rovno zákazníkovi, nie na vlastnú adresu.
    reply_to: lead.email,
    subject,
    html: internalHtml(lead),
    text: textSummary(lead),
  });

  if (!delivered) return { delivered: false, autoReplySent: false };

  // Poďakovanie je bonus. Keď neodíde, dopyt je aj tak doručený, takže
  // zákazníkovi netvrdíme opak a formulár ostáva úspešný.
  const autoReplySent = await sendEmail(apiKey, {
    from: LEAD_FROM,
    to: [lead.email],
    reply_to: LEAD_RECIPIENT,
    subject: "Ďakujem za zadanie — Môj Chatbot",
    html: replyHtml(lead),
    text: [
      `Dobrý deň${lead.name ? `, ${lead.name.split(" ")[0]}` : ""},`,
      "",
      "ďakujem za správu. Ozveme sa s odporúčaným riešením, rozsahom aj cenou",
      "zvyčajne do jedného pracovného dňa.",
      "",
      lead.note ? `Čo ste poslali:\n${lead.note}` : "",
      "",
      "Tím Môj Chatbot",
      "https://mojchatbot.sk",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return { delivered: true, autoReplySent };
}
