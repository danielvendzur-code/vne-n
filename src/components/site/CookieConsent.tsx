import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronRight, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  applyCookieConsent,
  COOKIE_SETTINGS_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent";
import "./CookieConsent.css";

type ConsentView = "hidden" | "banner" | "settings";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CookieConsent() {
  const [view, setView] = useState<ConsentView>("hidden");
  const [analytics, setAnalytics] = useState(false);
  const settingsRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const closeSettings = useCallback(() => {
    setView(readCookieConsent() ? "hidden" : "banner");
  }, []);

  useFocusTrap(settingsRef, view === "settings", closeSettings);

  useEffect(() => {
    const existing = readCookieConsent();
    applyCookieConsent(existing);
    setAnalytics(existing?.analytics ?? false);

    const showTimer = existing ? 0 : window.setTimeout(() => setView("banner"), 900);
    const openSettings = () => {
      const current = readCookieConsent();
      setAnalytics(current?.analytics ?? false);
      setView("settings");
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    if (view === "banner") body.dataset.cookieBanner = "visible";
    else delete body.dataset.cookieBanner;

    if (view === "settings") {
      body.dataset.cookieSettings = "open";
      const previousOverflow = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = previousOverflow;
        delete body.dataset.cookieSettings;
      };
    }

    delete body.dataset.cookieSettings;
    return undefined;
  }, [view]);

  const save = (analyticsAllowed: boolean) => {
    writeCookieConsent(analyticsAllowed);
    setAnalytics(analyticsAllowed);
    setView("hidden");
  };

  const transition = reducedMotion ? { duration: 0 } : { duration: 0.42, ease };

  return (
    <>
      <AnimatePresence>
        {view === "banner" ? (
          <motion.aside
            className="cookie-banner"
            role="dialog"
            aria-label="Nastavenie cookies"
            initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.99 }}
            transition={transition}
          >
            <div className="cookie-banner__head">
              <span className="cookie-banner__icon" aria-hidden="true">
                <ShieldCheck />
              </span>
              <div>
                <p>Vaše súkromie</p>
                <h2>Cookies bez zbytočného sledovania.</h2>
              </div>
            </div>
            <p className="cookie-banner__copy">
              Nevyhnutné cookies udržia web funkčný a zapamätajú si vašu voľbu. Analytické údaje sa
              môžu použiť iba po vašom súhlase.
            </p>
            <div className="cookie-banner__actions">
              <button type="button" className="cookie-button cookie-button--primary" onClick={() => save(true)}>
                Prijať všetko
              </button>
              <button type="button" className="cookie-button cookie-button--quiet" onClick={() => save(false)}>
                Iba nevyhnutné
              </button>
            </div>
            <button type="button" className="cookie-banner__settings" onClick={() => setView("settings")}>
              Nastaviť podrobne <ChevronRight aria-hidden="true" />
            </button>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {view === "settings" ? (
          <motion.div
            className="cookie-modal-layer"
            role="presentation"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.24 }}
          >
            <button
              type="button"
              className="cookie-modal-backdrop"
              aria-label="Zavrieť nastavenia cookies"
              onClick={closeSettings}
            />
            <motion.section
              ref={settingsRef}
              className="cookie-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-settings-title"
              tabIndex={-1}
              initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.99 }}
              transition={transition}
            >
              <header className="cookie-modal__head">
                <span className="cookie-modal__mark" aria-hidden="true">
                  <ShieldCheck />
                </span>
                <div>
                  <p>Nastavenia súkromia</p>
                  <h2 id="cookie-settings-title">Vyberte, čo môžeme používať.</h2>
                </div>
                <button type="button" className="cookie-modal__close" aria-label="Zavrieť" onClick={closeSettings}>
                  <X />
                </button>
              </header>

              <p className="cookie-modal__intro">
                Web funguje aj bez analytických cookies. Svoj výber môžete kedykoľvek zmeniť cez
                odkaz v pätičke.
              </p>

              <div className="cookie-category-list">
                <article className="cookie-category" data-locked="true">
                  <span className="cookie-category__icon" aria-hidden="true">
                    <LockKeyhole />
                  </span>
                  <div className="cookie-category__copy">
                    <div>
                      <h3>Nevyhnutné</h3>
                      <span>Vždy aktívne</span>
                    </div>
                    <p>Zapamätajú si nastavenie cookies a zabezpečia základné fungovanie webu.</p>
                  </div>
                  <span className="cookie-category__locked" aria-label="Vždy aktívne">
                    <Check />
                  </span>
                </article>

                <article className="cookie-category">
                  <span className="cookie-category__icon" aria-hidden="true">
                    <ShieldCheck />
                  </span>
                  <div className="cookie-category__copy">
                    <div>
                      <h3>Analytické</h3>
                      <span>Voliteľné</span>
                    </div>
                    <p>
                      Pomáhajú vyhodnotiť používanie webu a zlepšovať jeho obsah. Bez súhlasu zostanú
                      vypnuté.
                    </p>
                  </div>
                  <label className="cookie-switch">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(event) => setAnalytics(event.target.checked)}
                    />
                    <span aria-hidden="true" />
                    <b>{analytics ? "Povolené" : "Vypnuté"}</b>
                  </label>
                </article>
              </div>

              <div className="cookie-modal__policy">
                <Link to="/cookies" onClick={() => setView("hidden")}>
                  Podrobnosti o cookies <ChevronRight aria-hidden="true" />
                </Link>
              </div>

              <footer className="cookie-modal__actions">
                <button type="button" className="cookie-button cookie-button--quiet" onClick={() => save(false)}>
                  Iba nevyhnutné
                </button>
                <button type="button" className="cookie-button cookie-button--primary" onClick={() => save(analytics)}>
                  Uložiť nastavenie
                </button>
              </footer>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
