/**
 * Stav značkového úvodu.
 *
 * Úvod beží raz za reláciu a hero naň čaká — inak by sa nadpis odkrýval
 * pod oponou a návštevník by o ten moment prišiel. Stav žije mimo Reactu,
 * pretože ho číta hero a zapisuje oponu iný strom komponentov; poistka
 * na čase zaručí, že hero sa objaví aj vtedy, keď sa úvod z akéhokoľvek
 * dôvodu nedohrá.
 */

const SESSION_KEY = "mc:brand-intro:v1";

/** Poistka: aj keby opona uviazla, hero sa odkryje. */
const SAFETY_MS = 3200;

type Listener = () => void;

let ready = false;
let safety: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();

export function isIntroReady(): boolean {
  return ready;
}

/** Server o relácii návštevníka nevie, takže vždy začína zavretou oponou. */
export function isIntroReadyOnServer(): boolean {
  return false;
}

export function markIntroReady(): void {
  if (ready) return;
  ready = true;
  if (safety) {
    clearTimeout(safety);
    safety = null;
  }
  listeners.forEach((listener) => listener());
}

export function subscribeIntro(listener: Listener): () => void {
  listeners.add(listener);
  if (!ready && safety === null && typeof window !== "undefined") {
    safety = setTimeout(markIntroReady, SAFETY_MS);
  }
  return () => {
    listeners.delete(listener);
  };
}

/** Druhá a ďalšia stránka v tej istej relácii už úvod nehrá. */
export function introAlreadyPlayed(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberIntroPlayed(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* Súkromný režim prehliadača — úvod sa jednoducho prehrá znova. */
  }
}
