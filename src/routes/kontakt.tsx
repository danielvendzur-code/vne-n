import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { submitWebsiteLead } from "@/lib/lead-submission";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    ...seo({
      title: "Kontakt — preberme váš web",
      description:
        "Napíšte, čo má zákazník na vašom webe zistiť, vypočítať alebo vybrať. Dostanete jasný návrh rozsahu a cenu vopred.",
      path: "/kontakt",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Kontakt", path: "/kontakt" }]),
      },
    ],
  }),
  component: ContactPage,
});

const FIELD_LIMITS = {
  name: 80,
  email: 160,
  phone: 40,
  company: 160,
  web: 200,
  project: 1_500,
  source: 60,
  demo: 600,
} as const;

type SubmitState = "idle" | "sending";

const TIMING_OPTIONS = [
  "Bez pevného termínu",
  "Do 1 mesiaca",
  "Do 2–3 mesiacov",
  "Čo najskôr",
] as const;

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
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [web, setWeb] = useState("");
  const [project, setProject] = useState("");
  const [leadSource, setLeadSource] = useState("website-contact");
  const [timing, setTiming] = useState("Bez pevného termínu");
  const [consent, setConsent] = useState(false);
  const [botTrap, setBotTrap] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sourceParam = cleanField(params.get("source") ?? "", FIELD_LIMITS.source);
    const companyParam = cleanField(params.get("company") ?? "", FIELD_LIMITS.company);
    const webParam = cleanField(params.get("web") ?? "", FIELD_LIMITS.web);
    const demoParam = cleanField(params.get("demo") ?? "", FIELD_LIMITS.demo);

    if (sourceParam) setLeadSource(sourceParam);
    if (companyParam) setCompany((current) => current || companyParam);
    if (webParam) setWeb((current) => current || webParam);

    if (sourceParam.startsWith("coffee-demo-")) {
      const intro = companyParam
        ? `Mám záujem o kávového poradcu z pripravenej ukážky pre ${companyParam}.`
        : "Mám záujem o kávového poradcu z pripravenej ukážky.";
      const demoLine = demoParam ? `\nUkážka: ${demoParam}` : "";
      setProject((current) => current || `${intro}${demoLine}\n\nDoplňujúca poznámka:`);
    }
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState !== "idle") return;

    const safeName = cleanField(name, FIELD_LIMITS.name);
    const safeEmail = cleanField(email, FIELD_LIMITS.email);
    const safePhone = cleanField(phone, FIELD_LIMITS.phone);
    const safeCompany = cleanField(company, FIELD_LIMITS.company);
    const safeWeb = cleanField(web, FIELD_LIMITS.web);
    const safeProject = cleanField(project, FIELD_LIMITS.project);
    const safeSource = cleanField(leadSource, FIELD_LIMITS.source) || "website-contact";

    if (!safeName || !safeEmail || !safeProject || !consent) {
      setError("Vyplňte povinné polia a potvrďte súhlas so spracovaním údajov.");
      return;
    }

    setError("");
    setSubmitState("sending");

    try {
      const result = await submitWebsiteLead({
        source: safeSource,
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        company: safeCompany,
        web: safeWeb,
        note: safeProject,
        interest: safeSource.startsWith("coffee-demo-")
          ? "Kávový poradca pre e-shop"
          : "Návrh chatbota, kalkulačky, konfigurátora alebo produktového poradcu",
        timeline: timing,
        consent: true,
        website: botTrap,
      });

      if (result.fallback) {
        window.location.assign(result.fallback);
        return;
      }

      window.location.assign(`${import.meta.env.BASE_URL}dakujeme`);
    } catch {
      setSubmitState("idle");
      setError("Dopyt sa nepodarilo odoslať. Skúste to znova alebo použite e-mail či telefón.");
    }
  };

  const fromCoffeeDemo = leadSource.startsWith("coffee-demo-");

  return (
    <div className="contact-page contact-page--rebrand">
      <header className="sp-hero">
        <div className="container-page">
          <p className="section-kicker">CONTACT</p>
          <h1>
            Preberme, čo má váš web <em>robiť ďalej.</em>
          </h1>
          <p className="sp-hero-lead">
            Stačí pár viet o tom, čo predávate a kde sa zákazník dnes zasekne. Navrhneme
            najjednoduchší funkčný smer a cenu povieme vopred.
          </p>
        </div>
      </header>

      <section className="contact-section">
        <div className="container-page contact-editorial-grid">
          <aside className="contact-editorial-aside">
            <div>
              <p className="section-kicker">PRIAMY KONTAKT</p>
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              <a href={`tel:${siteConfig.contact.phoneHref}`}>{siteConfig.contact.phoneLabel}</a>
            </div>
            <div>
              <p className="section-kicker">ČO STAČÍ POSLAŤ</p>
              <ol>
                <li>Čo predávate.</li>
                <li>Čo zákazníci stále riešia ručne.</li>
                <li>Čo má byť výsledkom na webe.</li>
              </ol>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => openSiteAssistant({ source: "contact-page", entry: "builder" })}
            >
              Radšej vyskladať riešenie <ArrowRight size={15} />
            </button>
          </aside>

          <div className="contact-form-wrap">
            <p className="section-kicker">
              {fromCoffeeDemo ? "PREDVYPLNENÉ Z VAŠEJ UKÁŽKY" : "KRÁTKE ZADANIE"}
            </p>
            <form className="contact-form" onSubmit={(event) => void submit(event)} noValidate>
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

              <div className="contact-fields-two">
                <label>
                  <span>Telefón</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    maxLength={FIELD_LIMITS.phone}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+421 ..."
                  />
                </label>
                <label>
                  <span>Firma</span>
                  <input
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    maxLength={FIELD_LIMITS.company}
                    autoComplete="organization"
                    placeholder="Názov firmy"
                  />
                </label>
              </div>

              <label>
                <span>Web</span>
                <input
                  value={web}
                  onChange={(event) => setWeb(event.target.value)}
                  maxLength={FIELD_LIMITS.web}
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://firma.sk"
                />
              </label>

              <label>
                <span>Čo má web zjednodušiť? *</span>
                <textarea
                  value={project}
                  onChange={(event) => setProject(event.target.value)}
                  required
                  maxLength={FIELD_LIMITS.project}
                  rows={6}
                  placeholder="Napríklad: zákazníci sa pýtajú na cenu. Počítame ju podľa rozmerov, variantu a montáže."
                />
              </label>

              <label>
                <span>Ideálny termín</span>
                <select value={timing} onChange={(event) => setTiming(event.target.value)}>
                  {TIMING_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <div className="contact-trap" aria-hidden="true">
                <label htmlFor="contact-website">Web (nevypĺňať)</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botTrap}
                  onChange={(event) => setBotTrap(event.target.value)}
                />
              </div>

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
                className="contact-submit"
                data-state={submitState}
                disabled={submitState === "sending"}
              >
                {submitState === "sending" ? "Odosielam…" : "Odoslať zadanie"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
