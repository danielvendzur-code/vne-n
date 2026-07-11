import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteLayout } from "@/components/site/Layout";
import { projects } from "@/data/projects";
import { openSiteAssistant } from "@/lib/site-assistant";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const productTypes = [
  {
    key: "kalkulacka",
    name: "Kalkulačka",
    lead: "Návštevník zadá parametre a dostane orientačný cenový rozsah.",
    useFor: "Ceny podľa rozmerov, počtu kusov alebo rozsahu prác.",
  },
  {
    key: "asistent",
    name: "Dopytový asistent",
    lead: "Krátky rozhovor, ktorý zistí, o čo klient reálne žiada.",
    useFor: "Služby, kde je zadanie zakaždým iné a treba upresniť situáciu.",
  },
  {
    key: "produktovy",
    name: "Produktový konfigurátor",
    lead: "Klient si poskladá produkt z reálne dostupných kombinácií.",
    useFor: "Sauny, nábytok, dvere, okná — všade, kde je široká ponuka variantov.",
  },
  {
    key: "vizual",
    name: "Vizuálny a 3D konfigurátor",
    lead: "Zmeny vidno okamžite v 3D náhľade alebo na obrázku.",
    useFor: "Prístrešky, kuchyne, pomníky — všade, kde si klient potrebuje vec predstaviť.",
  },
];

function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-story-step]");
      steps.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
          },
        });
      });
    }, scrollRef);
    return () => ctx.revert();
  }, []);

  const featured = projects.filter((p) => p.featured);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative">
        <div className="container-page pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="grid gap-12 md:grid-cols-12 items-end">
            <div className="md:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="eyebrow mb-6"
              >
                Interaktívne nástroje na mieru
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="font-semibold"
                style={{
                  fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)",
                  lineHeight: 1.02,
                }}
              >
                Návštevník si zvolí, čo potrebuje.
                <br />
                <span style={{ color: "var(--primary)" }}>Vy dostanete použiteľný dopyt.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-8 max-w-2xl text-lg"
                style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
              >
                Staviam kalkulačky, dopytových asistentov a produktové aj 3D konfigurátory
                pre firmy, ktorým dochádzajú vágne správy typu „koľko by to stálo“.
                Nástroj klientovi pomôže rozhodnúť sa a vám dodá konkrétne zadanie.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <button
                  onClick={() => openSiteAssistant({ source: "hero" })}
                  className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Napísať vlastné zadanie
                </button>
                <Link
                  to="/projekty"
                  className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
                  style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
                >
                  Pozrieť projekty
                </Link>
              </motion.div>
            </div>

            <div className="md:col-span-4">
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <div className="eyebrow mb-3">Čo v tejto chvíli robím</div>
                <ul className="space-y-3 text-sm">
                  {[
                    "Návrh krokov pre vášho klienta",
                    "Napojenie na vaše cenníky a varianty",
                    "Odovzdanie dopytov vo formáte, ktorý použijete",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
                      <span style={{ color: "var(--text-primary)" }}>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT I BUILD */}
      <section style={{ backgroundColor: "var(--background-soft)" }}>
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-12 items-end mb-12">
            <div className="md:col-span-7">
              <div className="eyebrow mb-4">Štyri odlišné nástroje</div>
              <h2 className="font-semibold" style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)" }}>
                Nie všetko je chatbot. Každý typ rieši iný problém.
              </h2>
            </div>
            <p className="md:col-span-5 text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Kalkulačka počíta. Asistent sa pýta. Konfigurátor skladá.
              3D konfigurátor ukáže. Vyberáme podľa toho, čo klient v tej chvíli potrebuje.
            </p>
          </div>

          <div className="grid gap-px md:grid-cols-2" style={{ backgroundColor: "var(--border)" }}>
            {productTypes.map((t, i) => (
              <div
                key={t.key}
                className="p-8 md:p-10"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-xs tabular-nums" style={{ color: "var(--text-light)" }}>
                    0{i + 1}
                  </span>
                  <h3 className="text-xl font-semibold">{t.name}</h3>
                </div>
                <p className="text-base mb-4" style={{ color: "var(--text-primary)" }}>
                  {t.lead}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span className="eyebrow mr-2">Na čo</span>
                  {t.useFor}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/sluzby" className="text-sm font-medium" style={{ color: "var(--primary)" }}>
              Podrobný popis a rozdiely →
            </Link>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section>
        <div className="container-page py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <div className="eyebrow mb-4">Projekty</div>
              <h2 className="font-semibold" style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)" }}>
                Vybrané nástroje, ktoré aktuálne bežia.
              </h2>
            </div>
            <Link to="/projekty" className="text-sm font-medium" style={{ color: "var(--primary)" }}>
              Všetky projekty →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((p, i) => (
              <Link
                key={p.slug}
                to="/projekty/$slug"
                params={{ slug: p.slug }}
                className="group block rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="relative aspect-[4/3] p-6 flex flex-col justify-between"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent}18 0%, ${p.accent}05 100%)`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {p.category}
                    </span>
                  </div>
                  <ProjectVisual slug={p.slug} accent={p.accent} />
                  <span className="text-xs tabular-nums" style={{ color: "var(--text-light)" }}>
                    0{i + 1}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:underline decoration-1 underline-offset-4">
                    {p.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                    {p.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SCROLL STORY */}
      <section ref={scrollRef} style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container-page py-24 md:py-32">
          <div className="mb-16 md:mb-24">
            <div className="eyebrow mb-4">Ako z návštevníka vznikne konkrétny dopyt</div>
            <h2 className="font-semibold max-w-3xl" style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)" }}>
              Postup, ktorý funguje bez ohľadu na to, či ide o plot alebo saunu.
            </h2>
          </div>

          <div className="grid gap-16 md:gap-24">
            {[
              {
                n: "01",
                h: "Klient príde a nevie sa rozhodnúť",
                p: "Formulár mu neponúka žiadnu pomoc. Napíše krátku správu alebo odíde. Firma dostane vetu bez rozmerov, materiálu či lokality.",
              },
              {
                n: "02",
                h: "Nástroj sa spýta na to, čo je dôležité",
                p: "Krok po kroku. Bez zbytočností. Klient vidí len tie otázky, ktoré majú zmysel pre jeho výber.",
              },
              {
                n: "03",
                h: "Klient vidí, čo si zložil",
                p: "Cenový rozsah, produkt v 3D alebo prehľad výberu. Rozhodnutie je jasnejšie a odchod z rozhodovania je ťažší.",
              },
              {
                n: "04",
                h: "Firma dostane dopyt, ktorý sa dá spracovať",
                p: "Namiesto vágnej správy prichádza konkrétne zadanie. Ponuku pripravíte bez zbytočnej výmeny e-mailov.",
              },
            ].map((s) => (
              <div key={s.n} data-story-step className="grid md:grid-cols-12 gap-6 md:gap-10">
                <div className="md:col-span-3">
                  <div
                    className="text-5xl md:text-6xl font-semibold tabular-nums"
                    style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}
                  >
                    {s.n}
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h3 className="text-2xl font-semibold mb-3">{s.h}</h3>
                  <p className="text-base max-w-2xl" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {s.p}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container-page pb-24 md:pb-32">
          <div
            className="rounded-2xl p-10 md:p-16"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <div className="grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8">
                <h2 className="font-semibold" style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", color: "var(--primary-foreground)" }}>
                  Napíšte, čo klienti na vašej stránke najčastejšie potrebujú.
                </h2>
                <p className="mt-4 text-base max-w-xl" style={{ color: "color-mix(in oklab, var(--primary-foreground) 78%, transparent)" }}>
                  Odpoviem, či dáva zmysel kalkulačka, asistent alebo konfigurátor.
                </p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <button
                  onClick={() => openSiteAssistant({ source: "home-cta" })}
                  className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
                >
                  Napísať zadanie
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ProjectVisual({ slug, accent }: { slug: string; accent: string }) {
  // Each project preview intentionally looks different — no repeated card art.
  if (slug === "mojplot") {
    return (
      <svg viewBox="0 0 200 80" className="w-full h-24">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={i * 16 + 4} y={20} width="6" height="50" fill={accent} opacity={0.8} rx="1" />
        ))}
        <line x1="0" y1="70" x2="200" y2="70" stroke={accent} strokeWidth="1.5" />
      </svg>
    );
  }
  if (slug === "koverta") {
    return (
      <svg viewBox="0 0 200 100" className="w-full h-24">
        <polygon points="20,80 100,20 180,80" fill="none" stroke={accent} strokeWidth="2" />
        <rect x="40" y="60" width="120" height="30" fill={accent} opacity={0.15} />
        <line x1="20" y1="90" x2="180" y2="90" stroke={accent} strokeWidth="1" />
      </svg>
    );
  }
  if (slug === "kamenarstvo") {
    return (
      <svg viewBox="0 0 200 100" className="w-full h-24">
        <path d="M60,90 L60,40 Q100,10 140,40 L140,90 Z" fill={accent} opacity={0.2} stroke={accent} strokeWidth="1.5" />
        <line x1="30" y1="90" x2="170" y2="90" stroke={accent} strokeWidth="1.5" />
      </svg>
    );
  }
  if (slug === "aplan") {
    return (
      <svg viewBox="0 0 200 90" className="w-full h-24">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0, ${i * 24})`}>
            <rect x="10" y="10" width="120" height="14" rx="7" fill={accent} opacity={0.15} />
            <rect x="10" y="10" width={40 + i * 30} height="14" rx="7" fill={accent} opacity={0.35} />
          </g>
        ))}
      </svg>
    );
  }
  if (slug === "vasasauna") {
    return (
      <svg viewBox="0 0 200 100" className="w-full h-24">
        <rect x="20" y="30" width="160" height="55" fill="none" stroke={accent} strokeWidth="1.5" />
        <rect x="60" y="45" width="30" height="40" fill={accent} opacity={0.35} />
        <rect x="100" y="45" width="30" height="40" fill={accent} opacity={0.2} />
        <rect x="140" y="45" width="20" height="40" fill={accent} opacity={0.5} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 90" className="w-full h-24">
      <circle cx="40" cy="50" r="20" fill={accent} opacity={0.25} />
      <circle cx="100" cy="50" r="12" fill={accent} opacity={0.55} />
      <circle cx="150" cy="50" r="24" fill="none" stroke={accent} strokeWidth="2" />
    </svg>
  );
}
