import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, CheckCircle2, Clock3, Mail, MessageCircle, Phone } from "lucide-react";
import { premiumEase } from "@/components/site/motion-primitives";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { submitWebsiteLead } from "@/lib/lead-submission";
import { openSiteAssistant } from "@/lib/site-assistant";
import { seo } from "@/lib/seo";
import "./kontakt.css";
import "./kontakt-final.css";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    ...seo({
      title: "Kontakt — návrh chatbota, kalkulačky alebo konfigurátora",
      description:
        "Opíšte, čo dnes na webe vysvetľujete alebo počítate ručne. Jednoduchý chatbot začína od 350 € a konkrétny rozsah dostanete vopred.",
      path: "/kontakt",
    }),
  }),
  component: ContactPage,
});

const FIELD_LIMITS = {
  name: 80,
  email: 160,
  company: 160,
  project: 1_500,
} as const;

type SubmitState = "idle" | "sending" | "done";

function isBlockedControlCharacter(character: string): boolean {
  const code = character.charCodeAt(0);
  return code <= 8 || (code >= 11 && code <= 12) || (code >= 14 && code <= 31) || code === 127;
}

function cleanField(value: string, limit: number): string {
  return Array.from(value, (character) => (isBlockedControlCharacter(character) ? " " : character))
    .join("")
    .replace(/\s{4,}/g, "   ")
    .trim()
    .slice(0, limit);
}

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [timing, setTiming] = useState("Bez pevného termínu");
  const [consent, setConsent] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const reducedMotion = useReducedMotion();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState !== "idle") return;

    const safeName = cleanField(name, FIELD_LIMITS.name);
    const safeEmail = cleanField(email, FIELD_LIMITS.email);
    const safeCompany = cleanField(company, FIELD_LIMITS.company);
    const safeProject = cleanField(project, FIELD_LIMITS.project);

    if (!safeName || !safeEmail || !safeProject || !consent) {
      setError("Vyplňte povinné polia a potvrďte súhlas so spracovaním údajov.");
      return;
    }

    setError("");
    setSubmitState("sending");

    try {
      const result = await submitWebsiteLead({
        source: "website-contact",
        name: safeName,
        email: safeEmail,
        company: safeCompany,
        web: safeCompany.includes(".") ? safeCompany : "",
        note: safeProject,
        interest: "Návrh chatbota, kalkulačky alebo konfigurátora",
        timeline: timing,
        consent: true,
      });
      if (result.fallback) window.location.assign(result.fallback);
      setSubmitState("done");
    } catch {
      setSubmitState("idle");
      setError("Dopyt sa nepodarilo odoslať. Skúste to znova alebo použite e-mail či telefón.");
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-glow" aria-hidden="true" />
      <div className="container-page contact-grid">
        <motion.section
          className="contact-intro"
          initial={reducedMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          <p className="contact-kicker">
            <i />
            Konkrétny návrh riešenia
          </p>
          <h1>
            Ukážte mi, čo dnes robíte <em>ručne.</em>
          </h1>
          <p className="contact-lead">
            Jednoduchý chatbot začína od 350 €. Stačí stručne opísať službu, cenník alebo
            rozhodovanie zákazníka a ozvem sa s vhodným rozsahom prvej verzie.
          </p>

          <div className="contact-details">
            <a href={`mailto:${siteConfig.contact.email}`}>
              <Mail />
              {siteConfig.contact.email}
            </a>
            <a href={`tel:${siteConfig.contact.phoneHref}`}>
              <Phone />
              {siteConfig.contact.phoneLabel}
            </a>
            <span>
              <Clock3 />
              Odpoveď zvyčajne do 1 pracovného dňa
            </span>
          </div>

          <div className="contact-expect">
            <p>Čo dostanete po prvom kontakte</p>
            <ul>
              <li>
                <Check />
                Odporúčanie vhodného typu nástroja
              </li>
              <li>
                <Check />
                Návrh rozsahu prvej verzie a ceny
              </li>
              <li>
                <Check />
                Zoznam podkladov potrebných na realizáciu
              </li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          className="contact-card"
          aria-labelledby="contact-form-title"
          initial={reducedMotion ? false : { opacity: 0, y: 34, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: premiumEase }}
        >
          {submitState === "done" ? (
            <div className="contact-success" role="status">
              <CheckCircle2 aria-hidden="true" />
              <span>Ďakujem za zadanie</span>
              <h2>Dopyt je pripravený.</h2>
              <p>
                Ozvem sa na <b>{email.trim()}</b> s odporúčaným riešením a ďalším krokom zvyčajne do
                jedného pracovného dňa.
              </p>
              <button
                type="button"
                className="contact-assistant"
                onClick={() => openSiteAssistant({ source: "contact-success" })}
              >
                <MessageCircle /> Ešte sa niečo opýtať
              </button>
            </div>
          ) : (
            <>
              <div className="contact-card-head">
                <span>01 / krátke zadanie</span>
                <h2 id="contact-form-title">Povedzte mi základ.</h2>
                <p>Formulár odošle zadanie priamo. Povinné sú iba meno, e-mail a stručný popis.</p>
              </div>
              <form onSubmit={(event) => void submit(event)}>
                <div className="contact-fields-two">
                  <label>
                    <span>Meno *</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      maxLength={FIELD_LIMITS.name}
                      autoComplete="name"
                      placeholder="Vaše meno"
                    />
                  </label>
                  <label>
                    <span>E-mail *</span>
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      maxLength={FIELD_LIMITS.email}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="vas@email.sk"
                    />
                  </label>
                </div>
                <label>
                  <span>Firma alebo web</span>
                  <input
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    maxLength={FIELD_LIMITS.company}
                    autoComplete="organization"
                    placeholder="firma.sk"
                  />
                </label>
                <label>
                  <span>Čo chcete zjednodušiť? *</span>
                  <textarea
                    value={project}
                    onChange={(event) => setProject(event.target.value)}
                    required
                    maxLength={FIELD_LIMITS.project}
                    rows={5}
                    placeholder="Napríklad: zákazníkom ručne počítame cenu podľa rozmerov, dopravy a montáže…"
                  />
                </label>
                <label>
                  <span>Ideálny termín</span>
                  <select value={timing} onChange={(event) => setTiming(event.target.value)}>
                    <option>Bez pevného termínu</option>
                    <option>Do 1 mesiaca</option>
                    <option>Do 2–3 mesiacov</option>
                    <option>Čo najskôr</option>
                  </select>
                </label>
                <label className="contact-consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                  />
                  <span>Súhlasím so spracovaním údajov na prípravu návrhu.</span>
                </label>
                {error ? (
                  <p className="contact-error" role="alert">
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="contact-submit approved-sweep-action"
                  data-state={submitState}
                  disabled={submitState === "sending"}
                >
                  <span className="contact-submit__content">
                    {submitState === "sending" ? "Odosielam…" : "Získať návrh riešenia"}{" "}
                    <ArrowRight />
                  </span>
                </button>
              </form>
              <div className="contact-or">
                <span>alebo</span>
              </div>
              <button
                className="contact-assistant"
                type="button"
                onClick={() => openSiteAssistant({ source: "contact-page", entry: "builder" })}
              >
                <MessageCircle /> Prejsť 5-krokovým konfigurátorom
              </button>
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
}
