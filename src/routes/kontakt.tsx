import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Clock3, Mail, MessageCircle, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./kontakt.css";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — chatboty a kalkulačky na mieru" },
      {
        name: "description",
        content:
          "Napíšte mi, čo dnes na webe vysvetľujete alebo počítate ručne. Navrhnem vhodný chatbot, kalkulačku alebo konfigurátor.",
      },
      { property: "og:title", content: "Poďme navrhnúť váš webový nástroj" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [timing, setTiming] = useState("Bez pevného termínu");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Nový projekt${company ? ` — ${company}` : ""}`);
    const body = encodeURIComponent(
      [
        `Meno: ${name}`,
        `E-mail: ${email}`,
        `Firma: ${company || "neuvedené"}`,
        `Termín: ${timing}`,
        "",
        "Čo potrebujem vyriešiť:",
        project,
      ].join("\n"),
    );
    window.location.href = `mailto:info@webko.sk?subject=${subject}&body=${body}`;
  };

  return (
    <SiteLayout>
      <div className="contact-page">
        <div className="contact-glow" aria-hidden="true" />
        <div className="container-page contact-grid">
          <section className="contact-intro">
            <p className="contact-kicker">
              <i />
              Nezáväzná konzultácia
            </p>
            <h1>
              Ukážte mi, čo dnes robíte <em>ručne.</em>
            </h1>
            <p className="contact-lead">
              Stačí stručne opísať službu, cenník alebo rozhodovanie zákazníka. Ozvem sa s
              konkrétnym návrhom ďalšieho kroku.
            </p>

            <div className="contact-details">
              <a href="mailto:info@webko.sk">
                <Mail />
                info@webko.sk
              </a>
              <a href="tel:+421910893949">
                <Phone />
                +421 910 893 949
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
                  Návrh rozsahu prvej verzie
                </li>
                <li>
                  <Check />
                  Jasný ďalší krok bez záväzku
                </li>
              </ul>
            </div>
          </section>

          <section className="contact-card" aria-labelledby="contact-form-title">
            <div className="contact-card-head">
              <span>01 / krátke zadanie</span>
              <h2 id="contact-form-title">Povedzte mi základ.</h2>
              <p>
                Formulár pripraví e-mail vo vašej poštovej aplikácii. Nič sa neodošle bez vášho
                potvrdenia.
              </p>
            </div>
            <form onSubmit={submit}>
              <div className="contact-fields-two">
                <label>
                  <span>Meno *</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
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
                    type="email"
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
              <button type="submit" className="contact-submit">
                Otvoriť pripravený e-mail <ArrowRight />
              </button>
            </form>
            <div className="contact-or">
              <span>alebo</span>
            </div>
            <button
              className="contact-assistant"
              type="button"
              onClick={() => openSiteAssistant({ source: "contact-page" })}
            >
              <MessageCircle />
              Prejsť krátkym konfigurátorom
            </button>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
